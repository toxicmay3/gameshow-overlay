const socket = io();

const connectionStatus = document.getElementById('connection-status');
const lastUpdate = document.getElementById('last-update');

let scrollContainer;
let scrollList;
let animationFrame;
let scrollSpeed = 0.5; // Geschwindigkeit des Scrollens (kleiner = langsamer)

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
    const listeWrapper = document.getElementById('spieleliste');
    listeWrapper.innerHTML = '';

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

      listeWrapper.appendChild(li);
    });

    // Nach Update neue Scroll-Animation starten
    prepareScrolling();
  }
});

// Scroll-Logik
function prepareScrolling() {
  cancelAnimationFrame(animationFrame);

  scrollContainer = document.querySelector('.spieleliste-container');
  scrollList = document.querySelector('.spieleliste-wrapper');

  if (!scrollContainer || !scrollList) return;

  // Vorherige Clone entfernen
  const originalList = scrollList.querySelector('ul');
  const existingClone = scrollList.querySelector('ul.clone');
  if (existingClone) {
    scrollList.removeChild(existingClone);
  }

  const clone = originalList.cloneNode(true);
  clone.classList.add('clone');
  clone.style.marginTop = '20px'; // Abstand zwischen Original und Clone
  scrollList.appendChild(clone);

  scrollList.style.transform = 'translateY(0px)';
  startScrolling();
}

function startScrolling() {
  let pos = 0;
  const totalHeight = scrollList.scrollHeight / 2;

  function step() {
    pos -= scrollSpeed;
    if (Math.abs(pos) >= totalHeight) {
      pos = 0; // Weiches Zurücksetzen
    }
    scrollList.style.transform = `translateY(${pos}px)`;
    animationFrame = requestAnimationFrame(step);
  }

  step();
}
