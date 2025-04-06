# 🪙 Crypto Tracker Widget

A **beautiful** and **minimal** Electron app to track selected cryptocurrency prices **live**, see **percentage changes** over time, and stay **always on top** of your desktop.

---

## 📸 Features
- ✅ Select multiple coins like **BTC**, **ETH**, **SOL**, etc.
- ✅ Live price updates every few seconds.
- ✅ See **% price change** over 5, 10, or 20 minutes.
- ✅ Always-on-top floating widget.
- ✅ Drag window around freely (frameless window).
- ✅ ❌ Close app button built-in.
- ✅ Reset coins selection anytime.
- ✅ Light, Fast, and No bloat.

---

## 🚀 How to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/crypto-widget-tracker.git
   cd crypto-widget-tracker
   ```

   ```bash
   npm install
   ```
    
    ```bash
   npm start
   ```

## 📦 How to Build .EXE File (for Windows)

### 1. Build the App
```bash
npm run dist
```
## 2. Find your Installer

After building, you will find your `.exe` installer inside the `dist/` folder.

✅ You can install and run it like a regular app on Windows!


## 🛠️ Tech Stack
- **Electron**
- **TailwindCSS**
- **Node.js**
- **Coinbase API**

## 📁 Project Structure

```plaintext
crypto-widget-tracker/
│
├── main.js          # Electron Main Process (creates the window)
├── index.html       # Frontend (UI)
├── renderer.js      # Frontend Logic (fetch prices, timers, graphs)
├── package.json     # Project Configuration
└── README.md        # This file
```

## ✨ Future Ideas
- Add support for even more coins dynamically.
- Light/Dark mode switch.
- Sound alert when price changes a lot.
- Custom price threshold notifications.

## ☕ Support Me

If you like this project and want to support my work:

- **Buy Me a Coffee:** [buymeacoffee.com/abelnegash](https://buymeacoffee.com/abelnegash)
- **Cash App:** `$AbelKibebe`

Every coffee keeps me coding stronger! 💻☕💙

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/abelnegash)


## 📜 License
This project is free for personal use.  
Built with 💙 by Abel.

