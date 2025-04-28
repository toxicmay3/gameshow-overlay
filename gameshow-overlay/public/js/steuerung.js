const socket = io();
let spiele = [];
let backupTimer;

const team1NameInput = document.getElementById('team1-name');
const team2NameInput = document.getElementById('team2-name');
const team1ScoreInput = document.getElementById('team1-score');
const team2ScoreInput = document.getElementById('team2-score');

const updateTeamsButton = document.getElementById('update-teams');
const spielHinzufuegenButton = document.getElementById('spiel-hinzufuegen');
const speichernButton = document.getElementById('speichern');

const spieleliste = document.getElementById('spieleliste');
const messageBox = document.getElementById('message');

updateTeamsButton.addEventListener('click', () => {
  sendUpdate();
});

spielHinzufuegenButton.addEventListener('click', () => {
  const name = document.getElementById('spielname').value.trim();
  if (name) {
    spiele.push({ name: name, done: false });
    updateSpieleliste();
    sendUpdate();
    document.getElementById('spielname').value = '';
  }
});

speichernButton.addEventListener('click', () => {
  saveBackup();
  showMessage('Manuell gespeichert ✅');
});

socket.on('connect', () => {
  showMessage('Verbunden mit dem Server');
});

socket.on('updateOverlay', (data) => {
  if (data.team1 !== undefined) team1NameInput.value = data.team1;
  if (data.team2 !== undefined) team2NameInput.value = data.team2;
  if (data.score1 !== undefined) team1ScoreInput.value = data.score1;
  if (data.score2 !== undefined) team2ScoreInput.value = data.score2;
  if (data.spieleliste !== undefined) {
    spiele = data.spieleliste;
    updateSpieleliste();
  }
});

function updateSpieleliste() {
  spieleliste.innerHTML = '';
  spiele.forEach((spiel, index) => {
    const li = document.createElement('li');
    li.textContent = spiel.name + (spiel.winner ? ` (${spiel.winner})` : '');
    if (spiel.done) {
      li.style.textDecoration = 'line-through';
      li.style.color = 'grey';
    }
    li.addEventListener('click', () => {
      spiele[index].done = !spiele[index].done;
      updateSpieleliste();
      sendUpdate();
    });
    spieleliste.appendChild(li);
  });
}

function sendUpdate() {
  socket.emit('updateOverlay', {
    team1: team1NameInput.value,
    team2: team2NameInput.value,
    score1: parseInt(team1ScoreInput.value) || 0,
    score2: parseInt(team2ScoreInput.value) || 0,
    spieleliste: spiele
  });
}

function saveBackup() {
  fetch('/save', { method: 'POST' });
}

function showMessage(msg) {
  messageBox.textContent = msg;
  setTimeout(() => {
    messageBox.textContent = '';
  }, 3000);
}
