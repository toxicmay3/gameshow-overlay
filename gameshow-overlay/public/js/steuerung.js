// public/js/steuerung.js

const socket = io();

/* Punkt-Variablen */
let score1 = 0;
let score2 = 0;

/* Spieleliste */
let aktuelleSpieleliste = [];

/* Overlay sofort aktualisieren */
function updateOverlay() {
  socket.emit('updateOverlay', {
    team1      : document.getElementById('team1Name').value,
    team2      : document.getElementById('team2Name').value,
    score1     : score1,
    score2     : score2,
    spieleliste: aktuelleSpieleliste
  });
}

/* Team-Namen speichern */
function save() {
  updateOverlay();
}

/* Punkte verändern */
function changeScore(team, delta) {
  if (team === 'team1') {
    score1 += delta;
    document.getElementById('score1Display').textContent = score1;
  } else {
    score2 += delta;
    document.getElementById('score2Display').textContent = score2;
  }
  updateOverlay();
}

/* Spiel hinzufügen */
function addGame() {
  const input = document.getElementById('newGame');
  const name  = input.value.trim();
  if (name) {
    aktuelleSpieleliste.push(name);
    renderGameList();
    input.value = '';
    updateOverlay();
  }
}

/* Spieleliste neu aufbauen */
function renderGameList() {
  const ul = document.getElementById('spielelisteSteuerung');
  ul.innerHTML = '';
  aktuelleSpieleliste.forEach((spiel) => {
    const li = document.createElement('li');
    li.textContent = spiel;
    ul.appendChild(li);
  });
}

/* Alles zurücksetzen */
function resetAll() {
  document.getElementById('team1Name').value = '';
  document.getElementById('team2Name').value = '';
  score1 = 0; score2 = 0;
  document.getElementById('score1Display').textContent = score1;
  document.getElementById('score2Display').textContent = score2;
  aktuelleSpieleliste = [];
  renderGameList();
  updateOverlay();
}

/* 📦 Beim Verbinden: aktuellen Status vom Server holen */
socket.on('updateOverlay', (data) => {
  if (data.team1 !== undefined) document.getElementById('team1Name').value = data.team1;
  if (data.team2 !== undefined) document.getElementById('team2Name').value = data.team2;
  if (data.score1 !== undefined) {
    score1 = data.score1;
    document.getElementById('score1Display').textContent = score1;
  }
  if (data.score2 !== undefined) {
    score2 = data.score2;
    document.getElementById('score2Display').textContent = score2;
  }
  if (data.spieleliste !== undefined) {
    aktuelleSpieleliste = data.spieleliste;
    renderGameList();
  }
});
