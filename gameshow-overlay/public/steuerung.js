const socket = io();

// Lokale Variablen speichern
let aktuelleSpieleliste = [];

function save() {
  const team1Name = document.getElementById('team1Name').value;
  const team2Name = document.getElementById('team2Name').value;
  
  updateOverlay();
}

function changeScore(scoreId, delta) {
  const scoreElement = document.getElementById(scoreId);
  let score = parseInt(scoreElement.textContent);
  score += delta;
  scoreElement.textContent = score;
  
  updateOverlay();
}

function addGame() {
  const newGameInput = document.getElementById('newGame');
  const newGame = newGameInput.value.trim();
  if (newGame !== '') {
    aktuelleSpieleliste.push(newGame);
    renderGameList();
    newGameInput.value = '';
    updateOverlay();
  }
}

function renderGameList() {
  const liste = document.getElementById('spielelisteSteuerung');
  liste.innerHTML = '';
  aktuelleSpieleliste.forEach((spiel, index) => {
    const li = document.createElement('li');
    li.textContent = spiel;
    liste.appendChild(li);
  });
}

function reset() {
  document.getElementById('team1Name').value = '';
  document.getElementById('team2Name').value = '';
  document.getElementById('score1').textContent = '0';
  document.getElementById('score2').textContent = '0';
  aktuelleSpieleliste = [];
  renderGameList();
  updateOverlay();
}

function updateOverlay() {
  socket.emit('updateOverlay', {
    team1: document.getElementById('team1Name').value,
    team2: document.getElementById('team2Name').value,
    score1: parseInt(document.getElementById('score1').textContent) || 0,
    score2: parseInt(document.getElementById('score2').textContent) || 0,
    spieleliste: aktuelleSpieleliste
  });
}
