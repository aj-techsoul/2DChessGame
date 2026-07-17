// Piece values for evaluation
const pieceValues = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
};

// Piece-Square Tables (PST) for positional evaluation (simplified)
const pst = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5,  5,  5,  5,  5,  5,  5,  5],
    [1,  1,  2,  3,  3,  2,  1,  1],
    [0.5,  0.5,  1,  2.5,  2.5,  1,  0.5,  0.5],
    [0,  0,  0,  2,  2,  0,  0,  0],
    [0.5, -0.5, -1,  0,  0, -1, -0.5,  0.5],
    [0.5,  1, 1,  -2, -2,  1,  1,  0.5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-5, -4, -3, -3, -3, -3, -4, -5],
    [-4, -2,  0,  0,  0,  0, -2, -4],
    [-3,  0,  1,  1.5,  1.5,  1,  0, -3],
    [-3,  0.5,  1.5,  2,  2,  1.5,  0.5, -3],
    [-3,  0,  1.5,  2,  2,  1.5,  0, -3],
    [-3,  0.5,  1,  1.5,  1.5,  1,  0.5, -3],
    [-4, -2,  0,  0.5,  0.5,  0, -2, -4],
    [-5, -4, -3, -3, -3, -3, -4, -5]
  ],
  b: [
    [-2, -1, -1, -1, -1, -1, -1, -2],
    [-1,  0,  0,  0,  0,  0,  0, -1],
    [-1,  0,  0.5,  1,  1,  0.5,  0, -1],
    [-1,  0.5,  0.5,  1,  1,  0.5,  0.5, -1],
    [-1,  0,  1,  1,  1,  1,  0, -1],
    [-1,  1,  1,  1,  1,  1,  1, -1],
    [-1,  0.5,  0,  0,  0,  0,  0.5, -1],
    [-2, -1, -1, -1, -1, -1, -1, -2]
  ],
  r: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [0.5,  1,  1,  1,  1,  1,  1,  0.5],
    [-0.5,  0,  0,  0,  0,  0,  0, -0.5],
    [-0.5,  0,  0,  0,  0,  0,  0, -0.5],
    [-0.5,  0,  0,  0,  0,  0,  0, -0.5],
    [-0.5,  0,  0,  0,  0,  0,  0, -0.5],
    [-0.5,  0,  0,  0,  0,  0,  0, -0.5],
    [0,  0,  0,  0.5,  0.5,  0,  0,  0]
  ],
  q: [
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
    [-1,  0,  0,  0,  0,  0,  0, -1],
    [-1,  0,  0.5,  0.5,  0.5,  0.5,  0, -1],
    [-0.5,  0,  0.5,  0.5,  0.5,  0.5,  0, -0.5],
    [0,  0,  0.5,  0.5,  0.5,  0.5,  0, -0.5],
    [-1,  0.5,  0.5,  0.5,  0.5,  0.5,  0, -1],
    [-1,  0,  0.5,  0,  0,  0,  0, -1],
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2]
  ],
  k: [
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-2, -3, -3, -4, -4, -3, -3, -2],
    [-1, -2, -2, -2, -2, -2, -2, -1],
    [2,  2,  0,  0,  0,  0,  2,  2],
    [2,  3,  1,  0,  0,  1,  3,  2]
  ]
};

export class ChessAI {
  constructor(color, difficulty) {
    this.color = color;
    this.difficulty = parseInt(difficulty);
    // difficulty mapping: 1 (Beginner) -> depth 1, 2 (Moderate) -> depth 2, 3 (Expert) -> depth 3
    this.depth = this.difficulty; 
  }

  setDifficulty(level) {
    this.difficulty = parseInt(level);
    this.depth = this.difficulty;
  }

  setColor(color) {
    this.color = color;
  }

  evaluateBoard(game) {
    let totalEvaluation = 0;
    const board = game.board();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          totalEvaluation += this.getPieceValue(piece, r, f);
        }
      }
    }

    return totalEvaluation;
  }

  getPieceValue(piece, r, f) {
    const isWhite = piece.color === 'w';
    const val = pieceValues[piece.type];
    
    // For PST, if black, we reverse the rank
    const rank = isWhite ? r : 7 - r;
    const pstVal = pst[piece.type][rank][f];

    const total = val + pstVal;
    return isWhite ? total : -total;
  }

  minimax(game, depth, alpha, beta, isMaximizingPlayer) {
    if (depth === 0 || game.isGameOver()) {
      return this.evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizingPlayer) {
      let bestVal = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
        bestVal = Math.max(bestVal, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
        game.undo();
        alpha = Math.max(alpha, bestVal);
        if (beta <= alpha) {
          break; // Beta cut-off
        }
      }
      return bestVal;
    } else {
      let bestVal = Infinity;
      for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
        bestVal = Math.min(bestVal, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
        game.undo();
        beta = Math.min(beta, bestVal);
        if (beta <= alpha) {
          break; // Alpha cut-off
        }
      }
      return bestVal;
    }
  }

  getBestMove(game) {
    const moves = game.moves({ verbose: true });
    
    // Slight randomization for opening/equal moves to prevent exact same games
    moves.sort(() => Math.random() - 0.5);

    let bestMove = null;
    let bestValue = this.color === 'w' ? -Infinity : Infinity;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      game.move(move);
      const boardValue = this.minimax(game, this.depth - 1, -Infinity, Infinity, this.color !== 'w');
      game.undo();

      if (this.color === 'w') {
        if (boardValue > bestValue) {
          bestValue = boardValue;
          bestMove = move;
        }
      } else {
        if (boardValue < bestValue) {
          bestValue = boardValue;
          bestMove = move;
        }
      }
    }

    // Fallback if no best move found (shouldn't happen unless checkmate, which is caught earlier)
    return bestMove || moves[0];
  }
}
