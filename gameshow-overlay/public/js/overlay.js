// public/js/overlay.js

// WebSocket Verbindung aufbauen
const socket = io();

// Debug Panel Referenzen
const connectionStatus = document.getElementById('connection-status');
const lastUpdate = document.getElementById('last-update');

// Hilfsfunktion: Einzelne Best-of-3 Punkte rendern
function renderSingleTeamCircles(points, color) {
  let html = '<div class="team-circles">';
  for (let i = 0; i < 3; i++) {
    if (i < points) {
      html += `<span class="circle" style="background:${color};"></span>`;
    } else {
      html += `<span class="circle empty"></span>`;
    }
  }
  html += '</div>';
  return html;
}

// Socket Status anzeigen
socket.on('connect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Verbunden ✅';
});

socket.on('disconnect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Getrennt ❌';
});

// Bei jedem empfangenen Update die Oberfläche aktualisieren
socket.on('updateOverlay', (data) => {
  if (lastUpdate) lastUpdate.textContent = new Date().toLocaleTimeString();

  if (data.team1 !== undefined && data.score1 !== undefined) {
    const team1Element = document.getElementById('team1');
    if (team1Element) team1Element.innerHTML = `${data.team1} <span class="score" id="score1">${data.score1}</span>`;
  }

  if (data.team2 !== undefined && data.score2 !== undefined) {
    const team2Element = document.getElementById('team2');
    if (team2Element) team2Element.innerHTML = `${data.team2} <span class="score" id="score2">${data.score2}</span>`;
  }

  if (data.spieleliste !== undefined) {
    const liste = document.getElementById('spieleliste');
    if (liste) {
      liste.innerHTML = '';
      data.spieleliste.forEach(spiel => {
        const li = document.createElement('li');

        // Nur der Name wird durchgestrichen
        const nameSpan = document.createElement('span');
        nameSpan.textContent = spiel.name;

        if (spiel.done) {
          nameSpan.style.textDecoration = 'line-through';
          nameSpan.style.color = 'grey';
        }

        li.appendChild(nameSpan);

        if (spiel.winner) {
          const winnerSpan = document.createElement('span');
          winnerSpan.textContent = ` (${spiel.winner})`;
          winnerSpan.style.marginLeft = '8px';
          li.appendChild(winnerSpan);
        }

        liste.appendChild(li);
      });
    }
  }

  // Best-of-3 Anzeige
  const bestof3 = document.getElementById('bestof3');
  if (bestof3) {
    const team1Points = data.team1Points || 0;
    const team2Points = data.team2Points || 0;
    const team1Color = data.team1Color || '#ff0000';
    const team2Color = data.team2Color || '#0000ff';

    bestof3.innerHTML = `
      <div class="bestof3-wrapper">
        ${renderSingleTeamCircles(team1Points, team1Color)}
        ${renderSingleTeamCircles(team2Points, team2Color)}
      </div>
    `;
  }
});
