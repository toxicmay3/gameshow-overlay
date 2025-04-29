// public/js/overlay.js

const socket = io();

// Debug-Panel-Verbindung (falls vorhanden)
const connectionStatus = document.getElementById('connection-status');
const lastUpdate       = document.getElementById('last-update');

// Verbindung hergestellt
socket.on('connect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Verbunden ✅';
});

// Verbindung verloren
socket.on('disconnect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Getrennt ❌';
});

// 📦 Bei jedem Update die Oberfläche neu bauen
socket.on('updateOverlay', (data) => {
  if (lastUpdate) lastUpdate.textContent = new Date().toLocaleTimeString();

  if (data.team1 !== undefined) {
    document.getElementById('team1').innerHTML = `${data.team1} <span class="score">${data.score1}</span>`;
  }
  if (data.team2 !== undefined) {
    document.getElementById('team2').innerHTML = `${data.team2} <span class="score">${data.score2}</span>`;
  }

  if (data.spieleliste !== undefined) {
    const liste = document.getElementById('spieleliste');
    liste.innerHTML = '';

    data.spieleliste.forEach((spiel) => {
      const li = document.createElement('li');

      const nameSpan = document.createElement('span');
      nameSpan.textContent = spiel.name;

      const winnerSpan = document.createElement('span');
      if (spiel.winner) {
        winnerSpan.textContent = ` (${spiel.winner})`;
      }

      if (spiel.done) {
        nameSpan.style.textDecoration = 'line-through';
        nameSpan.style.color = 'grey';
      }

      li.appendChild(nameSpan);
      li.appendChild(winnerSpan);
      liste.appendChild(li);
    });
  }
});
