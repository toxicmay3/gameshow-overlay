// public/js/overlay.js

const socket = io();

// Debug-Panel-Verbindung (falls vorhanden)
const connectionStatus = document.getElementById('connection-status');
const lastUpdate       = document.getElementById('last-update');

// Hilfsfunktion zur Punktanzeige (● für Punkt, ○ für leer)
function renderScoreDots(scored, max) {
  let output = '';
  for (let i = 0; i < max; i++) {
    output += i < scored ? '● ' : '○ ';
  }
  return output.trim();
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

  // Punkt-Anzeige (● ○)
  const maxPoints = data.maxPoints || 3; // Fallback = 3 Punkte

  if (data.team1 !== undefined) {
    const punkte = renderScoreDots(data.team1Score || 0, maxPoints);
    document.getElementById('team1').innerHTML = `${data.team1}: <span class="score-dots">${punkte}</span>`;
  }

  if (data.team2 !== undefined) {
    const punkte = renderScoreDots(data.team2Score || 0, maxPoints);
    document.getElementById('team2').innerHTML = `${data.team2}: <span class="score-dots">${punkte}</span>`;
  }

  // Spieleliste
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
