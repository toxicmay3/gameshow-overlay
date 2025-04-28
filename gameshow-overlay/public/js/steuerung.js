// public/js/steuerung.js

const socket = io();

// Lokale Variablen
let aktuelleSpieleliste = [];

// Daten an Overlay senden
function updateOverlay() {
  socket.emit('updateOverlay', {
    team1: document.getElementById('team1Name').value,
    team2: document.getElementById('team2Name').value,
    score1: parseInt(document.getElementById('score1')?.textContent || "0"),
    score2: parseInt(document.getElementById('score2')?.textContent || "0"),
    spieleliste: aktuelleSpieleliste
  });
}

// Speichern der Teamnamen
function save() {
  updateOverlay();
}

// Punkte verändern
function changeScore(scoreId, delta) {
  const scoreElement = document.getElementById(scoreId);
  if (scoreElement) {
    let score = parseInt(scoreElement.textContent);
    score += delta;
    scoreElement.textContent = score;
    updateOverlay();
  }
}

// Spiel hinzufügen
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

// Spieleliste neu rendern
function renderGameList() {
  const liste = document.getElementById('spielelisteSteuerung');
  liste.innerHTML = '';
  aktuelleSpieleliste.forEach((spiel) => {
    const li = document.createElement('li');
    li.textContent = spiel;
    liste.appendChild(li);
  });
}

// Alles zurücksetzen
function reset() {
  document.getElementById('team1Name').value = '';
  document.getElementById('team2Name').value = '';
  document.getElementById('score1').textContent = '0';
  document.getElementById('score2').textContent = '0';
  aktuelleSpieleliste = [];
  renderGameList();
  updateOverlay();
}
