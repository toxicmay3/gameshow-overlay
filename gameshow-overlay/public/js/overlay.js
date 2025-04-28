// public/js/overlay.js

const socket = io();

// Verbindung zum Debug-Panel (wenn vorhanden)
const connectionStatus = document.getElementById('connection-status');
const lastUpdate       = document.getElementById('last-update');

// Bei Verbindungsaufbau Status anzeigen
socket.on('connect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Verbunden ✅';
});

socket.on('disconnect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Getrennt ❌';
});

// 📦 Beim Verbinden oder bei Updates Overlay aktualisieren
socket.on('updateOverlay', (data) => {
  if (lastUpdate) lastUpdate.textContent = new Date().toLocaleTimeString();

  if (data.team1 !== undefined)
    document.getElementById('team1').innerHTML = `${data.team1} <span class="score">${data.score1}</span>`;

  if (data.team2 !== undefined)
    document.getElementById('team2').innerHTML = `${data.team2} <span class="score">${data.score2}</span>`;

  if (data.spieleliste !== undefined) {
    const liste = document.getElementById('spieleliste');
    liste.innerHTML = '';
    data.spieleliste.forEach(spiel => {
      const li = document.createElement('li');
      li.textContent = spiel;
      liste.appendChild(li);
    });
  }
});
