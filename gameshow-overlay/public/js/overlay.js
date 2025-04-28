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
      li.textContent = spiel.name;

      if (spiel.done) {
        li.style.textDecoration = 'line-through';
        li.style.color = 'grey';
      }

      liste.appendChild(li);
    });
  }
});
