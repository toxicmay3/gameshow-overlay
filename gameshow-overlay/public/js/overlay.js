function load() {
  const team1Name = localStorage.getItem('team1') || 'Team 1';
  const team2Name = localStorage.getItem('team2') || 'Team 2';

  document.getElementById('team1').childNodes[0].textContent = team1Name;
  document.getElementById('team2').childNodes[0].textContent = team2Name;
  document.getElementById('score1').textContent = localStorage.getItem('score1') || '0';
  document.getElementById('score2').textContent = localStorage.getItem('score2') || '0';

  updateGames();
}

function updateGames() {
  const list = JSON.parse(localStorage.getItem('games') || '[]');
  const ul = document.getElementById('spieleliste');
  ul.innerHTML = '';

  const team1Name = localStorage.getItem('team1') || 'Team 1';
  const team2Name = localStorage.getItem('team2') || 'Team 2';

  list.forEach(item => {
    const li = document.createElement('li');

    const gameSpan = document.createElement('span');
    gameSpan.textContent = item.name;

    if (item.done) {
      gameSpan.style.textDecoration = 'line-through';
    }

    li.appendChild(gameSpan);

    if (item.winner === "team1") {
      const winnerSpan = document.createElement('span');
      winnerSpan.textContent = ` (${team1Name})`;
      winnerSpan.style.marginLeft = '5px';
      li.appendChild(winnerSpan);
    } else if (item.winner === "team2") {
      const winnerSpan = document.createElement('span');
      winnerSpan.textContent = ` (${team2Name})`;
      winnerSpan.style.marginLeft = '5px';
      li.appendChild(winnerSpan);
    }

    ul.appendChild(li);
  });
}

// Live aktualisieren
setInterval(load, 1000);
