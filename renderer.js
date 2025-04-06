const { remote } = require('electron');

const selectedCoinsDiv = document.getElementById('selected-coins');
const addCoinButton = document.getElementById('add-coin-button');
const coinDropdown = document.getElementById('coin-dropdown');
const coinSelect = document.getElementById('coin-select');
const resetButton = document.getElementById('reset-button');
const closeButton = document.getElementById('close-button');

let selectedCoins = new Map();

// Add selected coin
async function addCoin(coin) {
    if (!coin || selectedCoins.has(coin)) return;

    const coinDiv = document.createElement('div');
    coinDiv.id = `selected-${coin}`;
    coinDiv.className = "flex justify-between items-center bg-green-100 p-2 rounded";

    const coinName = document.createElement('span');
    coinName.innerHTML = `🪙 <strong>${coin}:</strong> Loading...`;

    const removeButton = document.createElement('button');
    removeButton.textContent = '❌';
    removeButton.className = "no-drag text-red-500 hover:text-red-700 font-bold";
    removeButton.onclick = () => removeCoin(coin);

    coinDiv.appendChild(coinName);
    coinDiv.appendChild(removeButton);
    selectedCoinsDiv.appendChild(coinDiv);

    selectedCoins.set(coin, coinDiv);

    await updatePrice(coin);

    if (selectedCoinsDiv.querySelector('p')) {
        selectedCoinsDiv.querySelector('p').remove();
    }
}

// Remove a selected coin
function removeCoin(coin) {
    const coinDiv = selectedCoins.get(coin);
    if (coinDiv) {
        coinDiv.remove();
        selectedCoins.delete(coin);
    }
    if (selectedCoins.size === 0) {
        selectedCoinsDiv.innerHTML = '<p class="text-gray-500">No coins selected yet.</p>';
    }
}

// Fetch the USD price
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

// Update price for one coin
async function updatePrice(coin) {
    const coinDiv = selectedCoins.get(coin);
    if (!coinDiv) return;

    const span = coinDiv.querySelector('span');
    const price = await fetchPrice(coin);

    if (price !== null) {
        span.innerHTML = `🪙 <strong>${coin}:</strong> $${price.toFixed(6)}`;
    } else {
        span.innerHTML = `<div class="text-red-500">${coin}: Price not available</div>`;
    }
}

// Refresh all prices every 60 seconds
setInterval(() => {
    selectedCoins.forEach((_, coin) => updatePrice(coin));
}, 60000);

// Add Coin Button behavior
addCoinButton.addEventListener('click', () => {
    coinDropdown.classList.toggle('hidden');
});

// Coin Select behavior
coinSelect.addEventListener('change', (e) => {
    const selectedCoin = e.target.value;
    addCoin(selectedCoin);
    coinDropdown.classList.add('hidden');
    coinSelect.value = "";
});

// Reset button
resetButton.addEventListener('click', () => {
    selectedCoins.clear();
    selectedCoinsDiv.innerHTML = '<p class="text-gray-500">No coins selected yet.</p>';
});

// Close button
closeButton.addEventListener('click', () => {
    const remote = require('@electron/remote');
    let window = remote.getCurrentWindow();
    window.close();
});
