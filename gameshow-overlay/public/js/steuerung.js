// public/js/steuerung.js

const socket = io();

let score1 = 0;
let score2 = 0;
let aktuelleSpieleliste = []; // Struktur: [{ name: "Spielname", done: false, winner: "" }]
let draggedIndex = null; // Für Drag & Drop

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
  const data = {
    team1: document.getElementById('team1Name').value,
    team2: document.getElementById('team2Name').value,
    score1: score1,
    score2: score2,
    spieleliste: aktuelleSpieleliste
  };

  // ➕ Punkteanzeige (● ○) – nur wenn Checkbox aktiv ist
  const enableDots = document.getElementById('enableScoreDots');
  if (enableDots && enableDots.checked) {
    data.team1Score = parseInt(document.getElementById('scoreA').value, 10) || 0;
    data.team2Score = parseInt(document.getElementById('scoreB').value, 10) || 0;
    data.maxPoints = parseInt(document.getElementById('maxPoints').value, 10) || 3;
  }

  socket.emit('updateOverlay', data);
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
    aktuelleSpieleliste.push({ name: name, done: false, winner: "" });
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
    li.classList.add('draggable');
    li.setAttribute('draggable', true);
    li.dataset.index = index;

    // Drag & Drop Events
    li.ondragstart = (e) => {
      draggedIndex = index;
      e.dataTransfer.effectAllowed = 'move';
    };
    li.ondragover = (e) => e.preventDefault();
    li.ondrop = (e) => {
      e.preventDefault();
      const targetIndex = Number(e.currentTarget.dataset.index);
      moveGame(draggedIndex, targetIndex);
    };

    // Anzeigen: Name + Gewinner (wenn vorhanden)
    let text = spiel.name;
    if (spiel.winner) {
      text += ` (${spiel.winner})`;
    }
    li.textContent = text;

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

    const team1WinBtn = document.createElement('button');
    team1WinBtn.textContent = '🥇';
    team1WinBtn.className = 'spiel-button';
    team1WinBtn.onclick = () => setWinner(index, 'team1');

    const team2WinBtn = document.createElement('button');
    team2WinBtn.textContent = '🥈';
    team2WinBtn.className = 'spiel-button';
    team2WinBtn.onclick = () => setWinner(index, 'team2');

    const resetWinBtn = document.createElement('button');
    resetWinBtn.textContent = '↩️';
    resetWinBtn.className = 'spiel-button';
    resetWinBtn.onclick = () => resetWinner(index);

    const löschenBtn = document.createElement('button');
    löschenBtn.textContent = '🗑️';
    löschenBtn.className = 'spiel-button';
    löschenBtn.onclick = () => deleteGame(index);

    li.appendChild(erledigtBtn);
    li.appendChild(bearbeitenBtn);
    li.appendChild(team1WinBtn);
    li.appendChild(team2WinBtn);
    li.appendChild(resetWinBtn);
    li.appendChild(löschenBtn);

    ul.appendChild(li);
  });
}

function moveGame(from, to) {
  if (from === to) return;
  const [movedItem] = aktuelleSpieleliste.splice(from, 1);
  aktuelleSpieleliste.splice(to, 0, movedItem);
  renderGameList();
  updateOverlay();
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

function setWinner(index, team) {
  const teamName = team === 'team1' ? document.getElementById('team1Name').value : document.getElementById('team2Name').value;
  if (teamName.trim() !== '') {
    aktuelleSpieleliste[index].winner = teamName.trim();
    renderGameList();
    updateOverlay();
  }
}

function resetWinner(index) {
  aktuelleSpieleliste[index].winner = "";
  renderGameList();
  updateOverlay();
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

/* Beim Verbinden aktuellen Status vom Server holen */
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
