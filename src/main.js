import { GameController } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const gameController = new GameController();

  // Elements
  const themeSelect = document.getElementById('theme-select');
  const difficultySelect = document.getElementById('difficulty-select');
  const colorSelect = document.getElementById('color-select');
  const usernameInput = document.getElementById('username');
  const btnRestart = document.getElementById('btn-restart');
  const btnModalRestart = document.getElementById('btn-modal-restart');

  // Load settings from localStorage
  const savedTheme = localStorage.getItem('chessTheme') || 'modern';
  const savedUsername = localStorage.getItem('chessUsername') || '';
  const savedDifficulty = localStorage.getItem('chessDifficulty') || '3';
  const savedColor = localStorage.getItem('chessColor') || 'w';

  // Apply settings
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeSelect.value = savedTheme;
  
  if (savedUsername) {
    usernameInput.value = savedUsername;
  }
  
  difficultySelect.value = savedDifficulty;
  gameController.setDifficulty(savedDifficulty);

  colorSelect.value = savedColor;
  gameController.setPlayerColor(savedColor);

  // Event Listeners
  themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('chessTheme', theme);
  });

  usernameInput.addEventListener('input', (e) => {
    localStorage.setItem('chessUsername', e.target.value);
  });

  difficultySelect.addEventListener('change', (e) => {
    const diff = e.target.value;
    gameController.setDifficulty(diff);
    localStorage.setItem('chessDifficulty', diff);
  });

  colorSelect.addEventListener('change', (e) => {
    const color = e.target.value;
    gameController.setPlayerColor(color);
    localStorage.setItem('chessColor', color);
    gameController.restart(); // Restart game when color changes
  });

  btnRestart.addEventListener('click', () => {
    gameController.restart();
  });

  btnModalRestart.addEventListener('click', () => {
    gameController.restart();
  });
});
