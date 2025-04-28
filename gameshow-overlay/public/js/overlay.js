const socket = io();

const connectionStatus = document.getElementById('connection-status');
const lastUpdate = document.getElementById('last-update');

socket.on('connect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Verbunden ✅';
});

socket.on('disconnect', () => {
  if (connectionStatus) connectionStatus.textContent = 'Getrennt ❌';
});

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
      let text = spiel.name;
      if (spiel.winner) {
        text += ` (${spiel.winner})`;
      }
      li.textContent = text;

      if (spiel.done) {
        li.style.textDecoration = 'line-through';
        li.style.color = 'grey';
      }

      liste.appendChild(li);
    });
  }
});
