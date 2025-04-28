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

/* Punkte ändern */
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

/* Spieleliste anzeigen */
function renderGameList() {
  const ul = document.getElementById('spielelisteSteuerung');
  ul.innerHTML = '';
  aktuelleSpieleliste.forEach((s) => {
    const li = document.createElement('li');
    li.textContent = s;
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
