// public/js/overlay.js

const socket = io();

// Debug-Panel-Verbindung (falls vorhanden)
const connectionStatus = document.getElementById('connection-status');
const lastUpdate = document.getElementById('last-update');

// Hilfsfunktion um Punkte-Kreise zu rendern
function renderBestOf3Circles(points, color) {
  const maxPoints = 3;
  let html = '<div class="bestof3-circles">';
  for (let i = 0; i < maxPoints; i++) {
    if (i < points) {
      html += `<span class="circle" style="background:${color};"></span>`;
    } else {
      html += `<span class="circle empty"></span>`;
    }
  }
  html += '</div>';
  return html;
}

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

  // Teamnamen + normale Punkte
  if (data.team1 !== undefined) {
    document.getElementById('team1').textContent = data.team1;
  }
  if (data.team2 !== undefined) {
    document.getElementById('team2').textContent = data.team2;
  }

  // Spieleliste neu bauen
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

  // Best-of-3 Punkte Kreise einfügen
  const bestofContainer = document.getElementById('bestof3');
  if (bestofContainer) {
    const team1Points = data.team1Points || 0;
    const team2Points = data.team2Points || 0;
    const team1Color = data.team1Color || '#ff0000';
    const team2Color = data.team2Color || '#0000ff';

    bestofContainer.innerHTML = `
      <div class="bestof3-wrapper">
        <div class="team-circles">
          ${renderBestOf3Circles(team1Points, team1Color)}
        </div>
        <div class="team-circles">
          ${renderBestOf3Circles(team2Points, team2Color)}
        </div>
      </div>
    `;
  }
});
