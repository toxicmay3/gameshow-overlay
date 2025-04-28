// public/js/steuerung.js

const socket = io();

let score1 = 0;
let score2 = 0;
let aktuelleSpieleliste = []; // Struktur: [{ name: "Spiel 1", done: false }]

function showSavedMessage() {
  const msg = document.createElement('div');
  msg.textContent = '✅ Gespeichert!';
  msg.style.position = 'fixed';
  msg.style.top = '10px';
  msg.style.right = '10px';
  msg.style.background = 'green';
  msg.style.color = 'white';
  msg.style.padding = '10px';
  msg.style.borderRadius = '8px';
  msg.style.zIndex = '9999';
  document.body.appendChild(msg);
  setTimeout(() => document.body.removeChild(msg), 2000);
}

function updateOverlay() {
  socket.emit('updateOverlay', {
    team1: document.getElementById('team1Name').value,
    team2: document.getElementById('team2Name').value,
    score1: score1,
    score2: score2,
    spieleliste: aktuelleSpieleliste
  });
  showSavedMessage();
}

function save() {
  updateOverlay();
}

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

function addGame() {
  const input = document.getElementById('newGame');
  const name = input.value.trim();
  if (name) {
    aktuelleSpieleliste.push({ name: name, done: false });
    renderGameList();
    input.value = '';
    updateOverlay();
  }
}

function renderGameList() {
  const ul = document.getElementById('spielelisteSteuerung');
  ul.innerHTML = '';
  aktuelleSpieleliste.forEach((spiel, index) => {
    const li = document.createElement('li');
    li.textContent = spiel.name;
    if (spiel.done) {
      li.classList.add('done');
    }

    // Buttons für jedes Spiel
    const erledigtBtn = document.createElement('button');
    erledigtBtn.textContent = '✔️';
    erledigtBtn.className = 'spiel-button';
    erledigtBtn.onclick = () => markGameDone(index);

    const bearbeitenBtn = document.createElement('button');
    bearbeitenBtn.textContent = '✏️';
    bearbeitenBtn.className = 'spiel-button';
    bearbeitenBtn.onclick = () => editGame(index);

    const löschenBtn = document.createElement('button');
    löschenBtn.textContent = '🗑️';
    löschenBtn.className = 'spiel-button';
    löschenBtn.onclick = () => deleteGame(index);

    li.appendChild(erledigtBtn);
    li.appendChild(bearbeitenBtn);
    li.appendChild(löschenBtn);

    ul.appendChild(li);
  });
}

function markGameDone(index) {
  aktuelleSpieleliste[index].done = !aktuelleSpieleliste[index].done;
  renderGameList();
  updateOverlay();
}

function editGame(index) {
  const neuerName = prompt("Neuer Name für das Spiel:", aktuelleSpieleliste[index].name);
  if (neuerName !== null && neuerName.trim() !== "") {
    aktuelleSpieleliste[index].name = neuerName.trim();
    renderGameList();
    updateOverlay();
  }
}

function deleteGame(index) {
  if (confirm("Willst du dieses Spiel wirklich löschen?")) {
    aktuelleSpieleliste.splice(index, 1);
    renderGameList();
    updateOverlay();
  }
}

function swapTeams() {
  const tempName = document.getElementById('team1Name').value;
  document.getElementById('team1Name').value = document.getElementById('team2Name').value;
  document.getElementById('team2Name').value = tempName;

  const tempScore = score1;
  score1 = score2;
  score2 = tempScore;

  document.getElementById('score1Display').textContent = score1;
  document.getElementById('score2Display').textContent = score2;
  
  updateOverlay();
}

function markWinner(team) {
  if (team === 'team1') {
    document.getElementById('team1Name').value += " (Gewinner)";
  } else {
    document.getElementById('team2Name').value += " (Gewinner)";
  }
  updateOverlay();
}

function removeTeam(team) {
  if (team === 'team1') {
    document.getElementById('team1Name').value = "";
  } else {
    document.getElementById('team2Name').value = "";
  }
  updateOverlay();
}

function resetAll() {
  document.getElementById('team1Name').value = '';
  document.getElementById('team2Name').value = '';
  score1 = 0;
  score2 = 0;
  document.getElementById('score1Display').textContent = score1;
  document.getElementById('score2Display').textContent = score2;
  aktuelleSpieleliste = [];
  renderGameList();
  updateOverlay();
}

/* Aktuellen Status beim Start vom Server holen */
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
