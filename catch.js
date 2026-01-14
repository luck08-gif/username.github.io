// catch.js - simple "Catch the Square" game
document.addEventListener('DOMContentLoaded', () => {
  const gameArea = document.getElementById('gameArea');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const timeEl = document.getElementById('time');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const speedRange = document.getElementById('speedRange');

  let timer = null;
  let spawnInterval = null;
  let timeLeft = 30;
  let score = 0;
  let best = Number(localStorage.getItem('cts_best') || 0);

  bestEl.textContent = best;

  function randomInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

  function createSquare() {
    const sq = document.createElement('button');
    sq.className = 'square';
    // random size (responsive)
    const base = Math.max(48, Math.min(80, Math.floor(gameArea.clientWidth / 8)));
    const size = base;
    sq.style.width = size + 'px';
    sq.style.height = size + 'px';
    sq.textContent = '+1';
    const maxX = gameArea.clientWidth - size;
    const maxY = gameArea.clientHeight - size;
    const x = randomInt(8, Math.max(8, maxX - 8));
    const y = randomInt(8, Math.max(8, maxY - 8));
    sq.style.left = x + 'px';
    sq.style.top = y + 'px';
    sq.addEventListener('click', onHit);
    sq.addEventListener('touchstart', onHit);
    return sq;
  }

  function onHit(e){
    e.preventDefault();
    const el = e.currentTarget;
    // small pop animation
    el.style.transform = 'scale(.9)';
    setTimeout(()=>{ if (el) el.remove(); }, 80);
    score += 1;
    scoreEl.textContent = score;
    // increase speed slightly by shortening interval
    adjustSpawn();
  }

  function adjustSpawn(){
    // we'll clear and re-create spawnInterval with current speed
    if (spawnInterval) clearInterval(spawnInterval);
    const speed = Number(speedRange.value); // ms between spawns
    spawnInterval = setInterval(()=> {
      // create square; remove old ones if too many
      if (gameArea.querySelectorAll('.square').length > 6) {
        // remove the oldest
        const first = gameArea.querySelector('.square');
        if (first) first.remove();
      }
      const s = createSquare();
      gameArea.appendChild(s);
      // auto remove after some time so area doesn't fill
      setTimeout(()=> { if (s && s.parentElement) s.remove(); }, Math.max(900, speed * 1.4));
    }, speed);
  }

  function startGame(){
    // reset
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    startBtn.disabled = true;
    restartBtn.disabled = false;
    // clear area
    gameArea.innerHTML = '';
    adjustSpawn();
    timer = setInterval(()=> {
      timeLeft -= 1;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame(){
    clearInterval(timer); timer = null;
    if (spawnInterval) { clearInterval(spawnInterval); spawnInterval = null; }
    // remove squares
    gameArea.querySelectorAll('.square').forEach(s => s.remove());
    startBtn.disabled = false;
    restartBtn.disabled = true;
    // update best
    if (score > best) {
      best = score;
      localStorage.setItem('cts_best', String(best));
      bestEl.textContent = best;
      setTimeout(()=> alert(`Kết thúc! Điểm: ${score}\nChúc mừng! Điểm cao mới 🎉`), 50);
    } else {
      setTimeout(()=> alert(`Kết thúc! Điểm: ${score}`), 50);
    }
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', () => {
    if (timer || spawnInterval) {
      // if running, stop then restart
      clearInterval(timer); timer = null;
      if (spawnInterval) clearInterval(spawnInterval);
    }
    startGame();
  });

  speedRange.addEventListener('input', () => {
    // immediately adjust spawn speed if already running
    if (spawnInterval) adjustSpawn();
  });

  // accessibility: keyboard hit (space) on focused square
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      const s = document.querySelector('.square');
      if (s) s.click();
    }
  });

  // responsive: clear squares on resize (to avoid off-screen)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=> {
      gameArea.querySelectorAll('.square').forEach(s => s.remove());
    }, 200);
  });
});
