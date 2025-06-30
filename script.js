let score = 0;
let timeLeft = 30;
let timerInterval;
let playerName = localStorage.getItem("berryPlayerName") || "";

function setPlayerName() {
  const nameInput = document.getElementById("playerName");
  const name = nameInput.value.trim();
  if (name) {
    playerName = name;
    localStorage.setItem("berryPlayerName", playerName);
    document.getElementById("nameInputSection").style.display = "none";
  } else {
    alert("Please enter your name first!");
  }
}

function startGame() {
  if (!playerName) {
    alert("Enter your name to play!");
    return;
  }

  score = 0;
  timeLeft = 30;
  document.getElementById("scoreboard").innerText = `Score: ${score} | Time: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("scoreboard").innerText = `Score: ${score} | Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearTimeout(gameLoop);
      saveHighScore();
      alert("Time's up! Your score: " + score);
    }
  }, 1000);

  spawnBerries();
}

let gameLoop;
function spawnBerries() {
  showBerry();

  
  if (Math.random() < 0.3) {
    setTimeout(showBerry, 300); 
  }

  const nextSpawn = Math.random() * 400 + 600;

  gameLoop = setTimeout(spawnBerries, nextSpawn);
}

function showBerry() {
  const gameArea = document.getElementById("gameArea");

  const newBerry = document.createElement("div");
  newBerry.style.width = "30px";
  newBerry.style.height = "30px";
newBerry.style.backgroundImage = "url('./images/berry.png')";

  newBerry.style.backgroundSize = "cover";
  newBerry.style.backgroundRepeat = "no-repeat";
  newBerry.style.backgroundPosition = "center";
  newBerry.style.position = "absolute";
  newBerry.style.cursor = "pointer";
  newBerry.classList.add("berry");

  const maxX = gameArea.clientWidth - 30;
  const maxY = gameArea.clientHeight - 30;
  newBerry.style.left = Math.floor(Math.random() * maxX) + "px";
  newBerry.style.top = Math.floor(Math.random() * maxY) + "px";

  newBerry.onclick = () => {
    score++;
    document.getElementById("scoreboard").innerText = `Score: ${score} | Time: ${timeLeft}s`;
    newBerry.remove();
  };

  gameArea.appendChild(newBerry);

  setTimeout(() => {
    if (newBerry && newBerry.parentNode) {
      newBerry.remove();
    }
  }, 1200); 
}

function saveHighScore() {
  let leaderboard = JSON.parse(localStorage.getItem("berryLeaderboard") || "[]");
  const existingIndex = leaderboard.findIndex(entry => entry.name === playerName);

  if (existingIndex !== -1) {
    if (score > leaderboard[existingIndex].score) {
      leaderboard[existingIndex].score = score;
    }
  } else {
    leaderboard.push({ name: playerName, score });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  const unique = [];
  leaderboard.forEach(entry => {
    if (!unique.find(e => e.name === entry.name)) {
      unique.push(entry);
    }
  });

  const top5 = unique.slice(0, 5);
  localStorage.setItem("berryLeaderboard", JSON.stringify(top5));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("berryLeaderboard") || "[]");
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

window.onload = () => {
  if (playerName) {
    document.getElementById("nameInputSection").style.display = "none";
  }
  displayLeaderboard();
};
