const socket = io();

const connectionStatus = document.getElementById('connection-status');
const lastUpdate = document.getElementById('last-update');

let animationFrame;
let scrollSpeed = 0.3; // langsam und angenehm

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

    startScrolling();
  }
});

// Scroll Animation
function startScrolling() {
  cancelAnimationFrame(animationFrame);

  const liste = document.getElementById('spieleliste');
  let pos = 0;
  const totalHeight = liste.scrollHeight;

  function step() {
    pos -= scrollSpeed;
    if (Math.abs(pos) >= totalHeight) {
      pos = 0;
    }
    liste.style.transform = `translateY(${pos}px)`;
    animationFrame = requestAnimationFrame(step);
  }

  liste.style.transition = 'none';
  liste.style.transform = 'translateY(0px)';
  animationFrame = requestAnimationFrame(step);
}
