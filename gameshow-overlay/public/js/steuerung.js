function save() {
  localStorage.setItem('team1', document.getElementById('team1Name').value);
  localStorage.setItem('team2', document.getElementById('team2Name').value);
  updateGameList();
}

function changeScore(team, value) {
  let score = parseInt(localStorage.getItem(team) || 0);
  score += value;
  if (score < 0) score = 0;
  localStorage.setItem(team, score);
}

function addGame() {
  const newGame = document.getElementById('newGame').value;
  if (!newGame) return;
  const list = JSON.parse(localStorage.getItem('games') || '[]');
  list.push({ name: newGame, done: false, winner: null });
  localStorage.setItem('games', JSON.stringify(list));
  document.getElementById('newGame').value = '';
  updateGameList();
}

function updateGameList() {
  const list = JSON.parse(localStorage.getItem('games') || '[]');
  const ul = document.getElementById('spielelisteSteuerung');
  ul.innerHTML = '';

  const team1Name = localStorage.getItem('team1') || 'Team 1';
  const team2Name = localStorage.getItem('team2') || 'Team 2';

  list.forEach((item, index) => {
    const li = document.createElement('li');
    const container = document.createElement('div');
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "5px";
    container.style.marginBottom = "5px";

    const span = document.createElement('span');
    let displayName = item.name;
    if (item.done) {
      displayName = `~~${displayName}~~`; // Markdown-Style durchstreichen
    }
    span.innerHTML = displayName;

    if (item.winner === "team1") {
      const winnerSpan = document.createElement('span');
      winnerSpan.textContent = ` (${team1Name})`;
      winnerSpan.style.marginLeft = "5px";
      container.appendChild(winnerSpan);
    } else if (item.winner === "team2") {
      const winnerSpan = document.createElement('span');
      winnerSpan.textContent = ` (${team2Name})`;
      winnerSpan.style.marginLeft = "5px";
      container.appendChild(winnerSpan);
    }

    // Buttons
    const doneButton = document.createElement('button');
    doneButton.textContent = '✔️';
    doneButton.className = 'done-button';
    doneButton.onclick = () => {
      list[index].done = !list[index].done;
      localStorage.setItem('games', JSON.stringify(list));
      updateGameList();
    };

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.className = 'edit-button';
    editButton.onclick = () => {
      showEditField(li, list, index);
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => {
      list.splice(index, 1);
      localStorage.setItem('games', JSON.stringify(list));
      updateGameList();
    };

    const upButton = document.createElement('button');
    upButton.textContent = '⬆️';
    upButton.className = 'move-button';
    upButton.onclick = () => {
      if (index > 0) {
        [list[index], list[index - 1]] = [list[index - 1], list[index]];
        localStorage.setItem('games', JSON.stringify(list));
        updateGameList();
      }
    };

    const downButton = document.createElement('button');
    downButton.textContent = '⬇️';
    downButton.className = 'move-button';
    downButton.onclick = () => {
      if (index < list.length - 1) {
        [list[index], list[index + 1]] = [list[index + 1], list[index]];
        localStorage.setItem('games', JSON.stringify(list));
        updateGameList();
      }
    };

    const team1Button = document.createElement('button');
    team1Button.textContent = '🥇 T1';
    team1Button.className = 'winner1-button';
    team1Button.onclick = () => {
      list[index].winner = "team1";
      localStorage.setItem('games', JSON.stringify(list));
      updateGameList();
    };

    const team2Button = document.createElement('button');
    team2Button.textContent = '🥈 T2';
    team2Button.className = 'winner2-button';
    team2Button.onclick = () => {
      list[index].winner = "team2";
      localStorage.setItem('games', JSON.stringify(list));
      updateGameList();
    };

    const noWinnerButton = document.createElement('button');
    noWinnerButton.textContent = '➖';
    noWinnerButton.className = 'no-winner-button';
    noWinnerButton.onclick = () => {
      list[index].winner = null;
      localStorage.setItem('games', JSON.stringify(list));
      updateGameList();
    };

    container.appendChild(span);
    container.appendChild(doneButton);
    container.appendChild(editButton);
    container.appendChild(deleteButton);
    container.appendChild(upButton);
    container.appendChild(downButton);
    container.appendChild(team1Button);
    container.appendChild(team2Button);
    container.appendChild(noWinnerButton);

    li.appendChild(container);
    ul.appendChild(li);
  });
}

function showEditField(li, list, index) {
  const input = document.createElement('input');
  input.type = "text";
  input.value = list[index].name;
  input.style.marginRight = "5px";
  input.style.width = "200px";

  const saveButton = document.createElement('button');
  saveButton.textContent = '💾 Speichern';
  saveButton.className = 'save-button';
  saveButton.onclick = () => {
    if (input.value.trim() !== '') {
      list[index].name = input.value.trim();
      localStorage.setItem('games', JSON.stringify(list));
      updateGameList();
    }
  };

  li.innerHTML = '';
  const container = document.createElement('div');
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "5px";
  container.appendChild(input);
  container.appendChild(saveButton);
  li.appendChild(container);
}

function reset() {
  localStorage.clear();
  updateGameList();
}

window.onload = updateGameList;
