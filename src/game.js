import { Chess } from 'chess.js';
import { ChessBoard } from './board.js';
import { ChessAI } from './ai.js';

export class GameController {
  constructor() {
    this.game = new Chess();
    this.board = new ChessBoard('chessboard', this.handleMoveAttempt.bind(this));
    this.ai = new ChessAI('b', 3); // Default AI is black, expert
    this.playerColor = 'w';
    this.historyEl = document.getElementById('move-history');
    this.statusEl = document.getElementById('status-indicator');
    this.messagesEl = document.getElementById('game-messages');
    this.modalEl = document.getElementById('game-over-modal');
    this.modalTitle = document.getElementById('game-over-title');
    this.modalMsg = document.getElementById('game-over-message');
    
    this.isAiThinking = false;
    this.updateStatus();
    this.board.update(this.game);
  }

  setPlayerColor(color) {
    this.playerColor = color;
    this.ai.setColor(color === 'w' ? 'b' : 'w');
    this.board.setOrientation(color);
    
    if (this.game.turn() === this.ai.color) {
      this.makeAiMove();
    }
  }

  setDifficulty(level) {
    this.ai.setDifficulty(level);
  }

  restart() {
    this.game.reset();
    this.board.clearHighlights();
    this.board.update(this.game);
    this.historyEl.innerHTML = '';
    this.messagesEl.innerText = '';
    this.modalEl.classList.add('hidden');
    this.isAiThinking = false;
    this.updateStatus();

    if (this.game.turn() === this.ai.color) {
      this.makeAiMove();
    }
  }

  handleMoveAttempt(source, target) {
    if (this.isAiThinking || this.game.isGameOver()) return;
    if (this.game.turn() !== this.playerColor) return;

    if (!target) {
      // Just showing valid moves for source
      const moves = this.game.moves({ square: source, verbose: true });
      if (moves.length === 0 && this.game.isCheck()) {
        // Piece cannot help resolve the check — deselect
        this.board.selectedSquare = null;
        this.board.clearHighlights();
        this.messagesEl.innerText = "This piece can't block the check!";
        setTimeout(() => {
          if (this.messagesEl.innerText === "This piece can't block the check!") {
            this.messagesEl.innerText = "Check!";
          }
        }, 2000);
      } else {
        this.board.highlightMoves(moves, source);
      }
      return;
    }

    // Try to move
    let moveObj = null;
    try {
      moveObj = this.game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to queen for simplicity
      });
    } catch (e) {
      // Invalid move
      // Did they click another of their own pieces?
      const targetPiece = this.game.get(target);
      if (targetPiece && targetPiece.color === this.playerColor) {
        this.board.selectedSquare = target;
        const moves = this.game.moves({ square: target, verbose: true });
        this.board.highlightMoves(moves);
        return;
      }

      this.board.selectedSquare = null;
      this.board.clearHighlights();
      this.messagesEl.innerText = "Invalid move.";
      setTimeout(() => { 
        if (this.messagesEl.innerText === "Invalid move.") {
          this.messagesEl.innerText = this.game.isCheck() ? "Check!" : "";
        }
      }, 2000);
      return;
    }

    if (moveObj) {
      this.board.selectedSquare = null;
      this.board.clearHighlights();
      this.board.highlightLastMove(source, target);
      this.board.update(this.game);
      this.updateHistory();
      this.updateStatus();

      if (!this.game.isGameOver()) {
        this.makeAiMove();
      } else {
        this.handleGameOver();
      }
    }
  }

  makeAiMove() {
    this.isAiThinking = true;
    this.messagesEl.innerText = "AI is thinking...";
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const start = performance.now();
      const move = this.ai.getBestMove(this.game);
      const end = performance.now();
      
      console.log(`AI thought for ${Math.round(end - start)}ms`);
      
      if (move) {
        this.game.move(move);
        this.board.highlightLastMove(move.from, move.to);
        this.board.update(this.game);
        this.updateHistory();
        this.messagesEl.innerText = "";
      }
      
      this.isAiThinking = false;
      this.updateStatus();
      
      if (this.game.isGameOver()) {
        this.handleGameOver();
      }
    }, 50);
  }

  updateStatus() {
    if (this.game.isGameOver()) return;
    
    const isWhiteTurn = this.game.turn() === 'w';
    this.statusEl.className = `status-indicator ${isWhiteTurn ? 'white-turn' : 'black-turn'}`;
    
    if (this.game.turn() === this.playerColor) {
      this.statusEl.innerText = "Your Turn";
    } else {
      this.statusEl.innerText = "AI's Turn";
    }

    if (this.game.isCheck()) {
      this.messagesEl.innerText = "Check!";
    } else if (!this.isAiThinking) {
      this.messagesEl.innerText = "";
    }
  }

  updateHistory() {
    const history = this.game.history();
    this.historyEl.innerHTML = '';
    
    for (let i = 0; i < history.length; i += 2) {
      const row = document.createElement('div');
      row.className = 'move-row';
      
      const num = document.createElement('div');
      num.className = 'move-num';
      num.innerText = `${Math.floor(i/2) + 1}.`;
      
      const wMove = document.createElement('div');
      wMove.className = 'move-w';
      wMove.innerText = history[i];
      
      const bMove = document.createElement('div');
      bMove.className = 'move-b';
      bMove.innerText = history[i+1] ? history[i+1] : '';
      
      row.appendChild(num);
      row.appendChild(wMove);
      row.appendChild(bMove);
      this.historyEl.appendChild(row);
    }
    this.historyEl.scrollTop = this.historyEl.scrollHeight;
  }

  handleGameOver() {
    this.modalEl.classList.remove('hidden');
    if (this.game.isCheckmate()) {
      const winner = this.game.turn() === 'w' ? 'Black' : 'White';
      this.modalTitle.innerText = "Checkmate!";
      this.modalMsg.innerText = `${winner} wins!`;
      this.statusEl.innerText = "Checkmate";
    } else if (this.game.isDraw()) {
      this.modalTitle.innerText = "Draw!";
      this.modalMsg.innerText = "The game is a draw.";
      this.statusEl.innerText = "Draw";
    } else if (this.game.isStalemate()) {
      this.modalTitle.innerText = "Stalemate!";
      this.modalMsg.innerText = "The game is a stalemate.";
      this.statusEl.innerText = "Stalemate";
    }
  }
}
