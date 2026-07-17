# ♞ Chess AI Master

A beautiful 2D Chess game built with **Vanilla JavaScript + Vite**, featuring a smart AI opponent powered by the **Minimax algorithm with Alpha-Beta Pruning**.

![Chess AI Master](./src/assets/hero.png)

---

## 🎮 Features

- ♟️ **Play vs AI** — Smart AI opponent using Minimax with Alpha-Beta Pruning
- 🎯 **3 Difficulty Levels** — Beginner, Moderate, Expert
- ♜ **Choose Your Color** — Play as White or Black
- 🎨 **4 Board Themes** — Modern (Dark), Ancient, Forest, Underwater
- 📜 **Move History** — Full algebraic notation move log
- ✅ **Check / Checkmate / Stalemate Detection**
- 🔁 **Restart Anytime** — Reset button and Play Again modal
- 🖱️ **Click-to-Move** — Select a piece to see valid moves highlighted

---

## 🛠️ Prerequisites

Before running the game, make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** (version 18 or higher recommended)
- **npm** (comes bundled with Node.js)

To verify your installation, run:

```bash
node --version
npm --version
```

---

## 🚀 Getting Started

Follow these steps to run the game locally:

### 1. Clone the Repository

```bash
git clone https://github.com/aj-techsoul/2DChessGame.git
```

### 2. Navigate into the Project Directory

```bash
cd 2DChessGame
```

### 3. Install Dependencies

```bash
npm install
```

This installs:
- **Vite** — fast development server & bundler
- **chess.js** — chess move validation & game logic library

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Once the server starts, you'll see output like:

```
  VITE v8.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and go to:

```
http://localhost:5173
```

The game will load instantly! 🎉

---

## 🎯 How to Play

| Action | How |
|--------|-----|
| **Select a piece** | Click on any of your pieces |
| **See valid moves** | Valid destination squares will be highlighted |
| **Make a move** | Click a highlighted square to move |
| **Cancel selection** | Click elsewhere on the board |
| **Restart game** | Click the **Restart Game** button in the sidebar |

### Game Settings (top bar)

| Setting | Options |
|---------|---------|
| **Player name** | Type your name in the input field |
| **Theme** | Modern (Dark) · Ancient · Forest · Underwater |
| **Color** | White (you go first) · Black (AI goes first) |
| **Difficulty** | Beginner · Moderate · Expert |

> 💡 **Tip:** Change settings before starting or after restarting for best results.

---

## 🏗️ Build for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
2DChessGame/
├── index.html          # Main HTML entry point
├── style.css           # Global styles & themes
├── package.json        # Project dependencies & scripts
├── public/
│   ├── favicon.svg     # Browser tab icon
│   └── icons.svg       # Chess piece SVG icons
└── src/
    ├── main.js         # App entry — wires up all controls
    ├── game.js         # GameController — core game loop
    ├── board.js        # ChessBoard — DOM rendering & interaction
    ├── ai.js           # ChessAI — Minimax + Alpha-Beta Pruning
    └── assets.js       # Asset helpers
```

---

## 🧠 AI Difficulty Levels

| Level | Search Depth | Description |
|-------|-------------|-------------|
| **Beginner** | 1 ply | Looks 1 move ahead — makes occasional blunders |
| **Moderate** | 2 ply | Looks 2 moves ahead — decent tactical play |
| **Expert** | 3 ply | Looks 3 moves ahead — strong positional & tactical play |

The AI uses **Piece-Square Tables (PST)** for positional evaluation and always promotes pawns to queens.

---

## 🧩 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5 / CSS3** | Structure & styling |
| **Vanilla JavaScript (ES Modules)** | Game logic |
| **Vite** | Dev server & bundler |
| **chess.js** | Chess rules, move validation, FEN |
| **Google Fonts (Outfit)** | Typography |

---

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Vite will automatically try the next available port (e.g., 5174)
# Or specify a port manually:
npm run dev -- --port 3000
```

**`npm install` fails?**
- Make sure Node.js is version 18+
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Game not loading in browser?**
- Make sure the dev server is running (`npm run dev`)
- Check the terminal for any error messages
- Try a hard refresh: `Ctrl + Shift + R`

---

## 📄 License

This project is open source. Feel free to fork, modify, and share!

---

Made with ❤️ by [aj-techsoul](https://github.com/aj-techsoul)
