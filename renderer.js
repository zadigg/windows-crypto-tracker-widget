const { remote } = require('electron');
const coinListDiv = document.getElementById('coin-list');
const selectedCoinsDiv = document.getElementById('selected-coins');
const resetButton = document.getElementById('reset-button');
const closeButton = document.getElementById('close-button');

// Predefined list of available coins
const availableCoins = ["BTC", "ETH", "SOL", "XRP", "ADA"];
let selectedCoins = new Map();

// Create list of available coins with + buttons
function renderCoinList() {
    coinListDiv.innerHTML = '';
    availableCoins.forEach(coin => {
        const coinRow = document.createElement('div');
        coinRow.className = "flex justify-between items-center bg-gray-100 p-2 rounded";

        const coinName = document.createElement('span');
        coinName.textContent = coin;

        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.className = "no-drag bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded";
        addButton.onclick = () => addCoin(coin);

        coinRow.appendChild(coinName);
        coinRow.appendChild(addButton);
        coinListDiv.appendChild(coinRow);
    });
}

// Add coin to selected list
async function addCoin(coin) {
    if (selectedCoins.has(coin)) return; // Already selected

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

// Remove single coin
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

// Fetch live USD spot price
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

// Update price for a single selected coin
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

// Refresh all selected coin prices every 60 seconds
setInterval(() => {
    selectedCoins.forEach((_, coin) => updatePrice(coin));
}, 60000);

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

// Initial setup
renderCoinList();
