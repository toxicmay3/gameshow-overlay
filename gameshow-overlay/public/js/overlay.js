const socket = io();

// Daten live empfangen und Overlay aktualisieren
socket.on('updateOverlay', (data) => {
  if (data.team1 !== undefined && data.score1 !== undefined) {
    document.getElementById('team1').innerHTML = `${data.team1} <span class="score" id="score1">${data.score1}</span>`;
  }
  if (data.team2 !== undefined && data.score2 !== undefined) {
    document.getElementById('team2').innerHTML = `${data.team2} <span class="score" id="score2">${data.score2}</span>`;
  }
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
