import { pieceSVGs } from './assets.js';

export class ChessBoard {
  constructor(containerId, onMoveAttempt) {
    this.container = document.getElementById(containerId);
    this.onMoveAttempt = onMoveAttempt;
    this.squares = {}; // map of 'a1' -> DOM element
    this.orientation = 'w';
    this.selectedSquare = null;
    this.buildBoard();
  }

  buildBoard() {
    this.container.innerHTML = '';
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    // Reverse logic if playing as black
    const renderFiles = this.orientation === 'w' ? files : [...files].reverse();
    const renderRanks = this.orientation === 'w' ? ranks : [...ranks].reverse();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const file = renderFiles[f];
        const rank = renderRanks[r];
        const squareId = `${file}${rank}`;
        
        const square = document.createElement('div');
        square.className = `square ${(r + f) % 2 === 0 ? 'light' : 'dark'}`;
        square.dataset.square = squareId;
        
        square.addEventListener('click', () => this.handleSquareClick(squareId));
        
        // Drag and drop support
        square.addEventListener('dragover', (e) => e.preventDefault());
        square.addEventListener('drop', (e) => this.handleDrop(e, squareId));

        this.container.appendChild(square);
        this.squares[squareId] = square;
      }
    }
  }

  setOrientation(color) {
    if (this.orientation !== color) {
      this.orientation = color;
      this.buildBoard(); // Rebuild to flip
    }
  }

  update(game) {
    // Clear board
    Object.values(this.squares).forEach(sq => {
      sq.innerHTML = '';
      sq.classList.remove('highlight', 'highlight-capture', 'last-move', 'checkmate', 'in-check', 'selected');
    });

    const board = game.board(); // 2D array from chess.js
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          const rank = 8 - r;
          const file = files[f];
          const squareId = `${file}${rank}`;
          
          const pieceEl = document.createElement('div');
          pieceEl.className = `piece ${piece.color} ${piece.type}`;
          pieceEl.style.backgroundImage = `url('${pieceSVGs[piece.color][piece.type]}')`;
          pieceEl.draggable = true;
          
          pieceEl.addEventListener('dragstart', (e) => {
            this.clearHighlights();
            this.selectedSquare = squareId;
            e.dataTransfer.setData('text/plain', squareId);
          });

          pieceEl.addEventListener('dragend', () => {
            // Reset if drop didn't land on a valid target
            this.selectedSquare = null;
          });
          
          this.squares[squareId].appendChild(pieceEl);
        }
      }
    }

    // Highlight king in check (orange glow) or checkmate (red glow)
    if (game.isCheckmate()) {
      const turn = game.turn();
      const kingSquare = this.findKing(board, turn);
      if (kingSquare) {
        this.squares[kingSquare].classList.add('checkmate');
      }
    } else if (game.isCheck()) {
      const turn = game.turn();
      const kingSquare = this.findKing(board, turn);
      if (kingSquare) {
        this.squares[kingSquare].classList.add('in-check');
      }
    }
  }

  findKing(board, color) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type === 'k' && piece.color === color) {
          return `${files[f]}${8 - r}`;
        }
      }
    }
    return null;
  }

  highlightMoves(moves, fromSquare) {
    this.clearHighlights();
    // Mark the selected piece's square
    if (fromSquare && this.squares[fromSquare]) {
      this.squares[fromSquare].classList.add('selected');
    }
    moves.forEach(move => {
      const sq = this.squares[move.to];
      if (sq) {
        if (move.flags.includes('c') || move.flags.includes('e')) {
          sq.classList.add('highlight-capture');
        } else {
          sq.classList.add('highlight');
        }
      }
    });
  }

  clearHighlights() {
    Object.values(this.squares).forEach(sq => {
      sq.classList.remove('highlight', 'highlight-capture', 'selected');
    });
  }

  highlightLastMove(source, target) {
    Object.values(this.squares).forEach(sq => sq.classList.remove('last-move'));
    if (source && this.squares[source]) this.squares[source].classList.add('last-move');
    if (target && this.squares[target]) this.squares[target].classList.add('last-move');
  }

  handleSquareClick(squareId) {
    if (this.selectedSquare) {
      if (this.selectedSquare === squareId) {
        this.selectedSquare = null;
        this.clearHighlights();
        return;
      }
      const source = this.selectedSquare;
      this.onMoveAttempt(source, squareId);
    } else {
      this.selectedSquare = squareId;
      this.onMoveAttempt(squareId, null); // signal to show moves
    }
  }

  handleDrop(e, targetSquareId) {
    e.preventDefault();
    const sourceSquareId = e.dataTransfer.getData('text/plain');
    if (sourceSquareId && sourceSquareId !== targetSquareId) {
      this.onMoveAttempt(sourceSquareId, targetSquareId);
    }
  }
}
