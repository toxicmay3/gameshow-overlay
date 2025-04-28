// public/js/overlay.js
const socket = io();

const connectionStatus = document.getElementById('connection-status');
const lastUpdate       = document.getElementById('last-update');

socket.on('connect',    () => connectionStatus.textContent = 'Verbunden ✅');
socket.on('disconnect', () => connectionStatus.textContent = 'Getrennt ❌');

socket.on('updateOverlay', (d) => {
  lastUpdate.textContent = new Date().toLocaleTimeString();

  if (d.team1 !== undefined)
    document.getElementById('team1').innerHTML = `${d.team1} <span class="score">${d.score1}</span>`;
  if (d.team2 !== undefined)
    document.getElementById('team2').innerHTML = `${d.team2} <span class="score">${d.score2}</span>`;

  if (d.spieleliste !== undefined) {
    const ul = document.getElementById('spieleliste');
    ul.innerHTML = '';
    d.spieleliste.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s;
      ul.appendChild(li);
    });
  }
});
