const selectedCoinsDiv = document.getElementById('selected-coins');
const addCoinButton = document.getElementById('add-coin-button');
const coinDropdown = document.getElementById('coin-dropdown');
const coinSelect = document.getElementById('coin-select');
const resetButton = document.getElementById('reset-button');
const closeButton = document.getElementById('close-button');
const timeframeSelect = document.getElementById('timeframe-select');

let selectedCoins = new Map();
let priceHistory = {}; // Store price history
let selectedTimeframeMinutes = 1; // Default to 5 min

async function addCoin(coin) {
    if (!coin || selectedCoins.has(coin)) return;

    const coinDiv = document.createElement('div');
    coinDiv.id = `selected-${coin}`;
    coinDiv.className = "flex justify-between items-center bg-slate-700 p-2 rounded";

    const coinName = document.createElement('span');
    coinName.id = `coin-name-${coin}`;
    coinName.innerHTML = `🪙 <strong>${coin}:</strong> $0.00`;

    const rightSideDiv = document.createElement('div');
    rightSideDiv.className = "flex items-center space-x-2";

    const timerOrPercent = document.createElement('span');
    timerOrPercent.id = `timer-${coin}`;
    timerOrPercent.className = "text-xs text-gray-400";

    const removeButton = document.createElement('button');
    removeButton.textContent = '❌';
    removeButton.className = "no-drag text-red-500 hover:text-red-700 font-bold";
    removeButton.onclick = () => removeCoin(coin);

    rightSideDiv.appendChild(timerOrPercent);
    rightSideDiv.appendChild(removeButton);

    coinDiv.appendChild(coinName);
    coinDiv.appendChild(rightSideDiv);

    selectedCoinsDiv.appendChild(coinDiv);
    selectedCoins.set(coin, { coinDiv, timerOrPercent, addedAt: Date.now() });

    await updatePrice(coin);

    if (selectedCoinsDiv.querySelector('p')) {
        selectedCoinsDiv.querySelector('p').remove();
    }
}



// Remove coin
function removeCoin(coin) {
    const coinDiv = selectedCoins.get(coin);
    if (coinDiv) {
        coinDiv.remove();
        selectedCoins.delete(coin);
    }
    if (selectedCoins.size === 0) {
        selectedCoinsDiv.innerHTML = '<p class="text-gray-400">No coins selected yet.</p>';
    }
}

// Fetch live price from Coinbase
async function fetchPrice(coinSymbol) {
    try {
        const res = await fetch(`https://api.coinbase.com/v2/prices/${coinSymbol}-USD/spot`);
        const data = await res.json();
        return parseFloat(data.data.amount);
    } catch (error) {
        console.error(`Error fetching ${coinSymbol}:`, error);
        return null;
    }
}

function updateTimers() {
    const now = Date.now();
    selectedCoins.forEach((data, coin) => {
        const elapsedMs = now - data.addedAt;
        const totalMs = selectedTimeframeMinutes * 60 * 1000;
        const remainingMs = totalMs - elapsedMs;

        if (remainingMs > 0) {
            const minutes = Math.floor(remainingMs / 60000);
            const seconds = Math.floor((remainingMs % 60000) / 1000);
            data.timerOrPercent.innerHTML = `<span class="text-gray-400 text-xs">${minutes}:${seconds.toString().padStart(2, '0')}</span>`;
        } else {
            updatePrice(coin); // Force recheck to show percent
        }
    });
}

// Update price and calculate % change
async function updatePrice(coin) {
    const data = selectedCoins.get(coin);
    if (!data) return;

    const coinNameSpan = document.getElementById(`coin-name-${coin}`);
    const timerSpan = data.timerOrPercent;

    const price = await fetchPrice(coin);

    if (price !== null) {
        if (!priceHistory[coin]) priceHistory[coin] = [];
        priceHistory[coin].push({ time: Date.now(), price });

        if (priceHistory[coin].length > 50) {
            priceHistory[coin].shift();
        }

        // Always update live price
        coinNameSpan.innerHTML = `🪙 <strong>${coin}:</strong> $${price.toFixed(6)}`;

        const changePercent = calculateChangePercent(coin, selectedTimeframeMinutes);

        if (changePercent !== null && changePercent !== "loading") {
            const sign = changePercent >= 0 ? '+' : '';
            const color = changePercent >= 0 ? 'text-green-400' : 'text-red-400';
            timerSpan.innerHTML = `<span class="${color}">(${sign}${changePercent.toFixed(2)}%)</span>`;
        }
        // If still loading, timerSpan stays managed separately by updateTimers
    } else {
        coinNameSpan.innerHTML = `<div class="text-red-500">${coin}: Price not available</div>`;
    }
}


function calculateChangePercent(coin, minutesAgo) {
    const history = priceHistory[coin];
    if (!history || history.length === 0) return null;

    const now = Date.now();
    const targetTime = now - (minutesAgo * 60 * 1000);

    // Find the closest price BEFORE or CLOSE to the target time
    let closestOldPrice = null;
    let minDifference = Infinity;

    for (let i = 0; i < history.length; i++) {
        const diff = Math.abs(history[i].time - targetTime);
        if (history[i].time <= targetTime && diff < minDifference) {
            closestOldPrice = history[i].price;
            minDifference = diff;
        }
    }

    if (closestOldPrice === null) return "loading";

    const latestPrice = history[history.length - 1].price;
    const changePercent = ((latestPrice - closestOldPrice) / closestOldPrice) * 100;
    return changePercent;
}




// Auto-refresh every 3 seconds
setInterval(() => {
    selectedCoins.forEach((_, coin) => updatePrice(coin));
}, 3000);

setInterval(() => {
    updateTimers();
}, 1000);

// Handle buttons
addCoinButton.addEventListener('click', () => {
    coinDropdown.classList.toggle('hidden');
});

coinSelect.addEventListener('change', (e) => {
    const selectedCoin = e.target.value;
    addCoin(selectedCoin);
    coinDropdown.classList.add('hidden');
    coinSelect.value = "";
});

resetButton.addEventListener('click', () => {
    selectedCoins.clear();
    selectedCoinsDiv.innerHTML = '<p class="text-gray-400">No coins selected yet.</p>';
    priceHistory = {};
});

closeButton.addEventListener('click', () => {
    const remote = require('@electron/remote');
    let window = remote.getCurrentWindow();
    window.close();
});

timeframeSelect.addEventListener('change', (e) => {
    selectedTimeframeMinutes = parseInt(e.target.value);
});
