let tiles = [];
let score = 0;
let audioCtx;

let fallSpeed = 3;       
let spawnInterval = 45;  

let gameState = 'START'; // 'START', 'PLAYING', 'COMPLETED'
let timeLeft = 60;       
let lastTime = 0;        

let pressedKey = -1;     
let pressTimer = 0;
let feedbacks = [];      

let notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(24);
  
  let AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
}

function draw() {
  background('skyblue'); 
  
  if (gameState === 'START') {
    drawStartScreen();
    return; 
  } 
  else if (gameState === 'PLAYING') {
    drawGameScreen();
    runTimer();
  } 
  else if (gameState === 'COMPLETED') {
    drawGameScreen(); 
    drawCompletionScreen(); 
  }
}

function drawStartScreen() {
  fill('saddlebrown'); noStroke();
  rect(54, 80, 142, 120); rect(354, 150, 142, 120); rect(204, 50, 142, 120);

  fill('white'); stroke('black'); strokeWeight(2);
  for (let i = 0; i < 6; i++) rect(i * 100, 320, 100, 80);
  fill('black'); noStroke();
  rect(70, 320, 60, 45); rect(170, 320, 60, 45);
  rect(370, 320, 60, 45); rect(470, 320, 60, 45);

  fill('black'); stroke('white'); strokeWeight(4);
  textSize(56); text("Piano Tiles", 300, 120);
  
  fill('white'); stroke('black'); strokeWeight(3);
  rect(140, 180, 320, 80, 10); 
  fill('black'); noStroke(); textSize(32);
  text("Start Exercise", 300, 220); 
}

function drawGameScreen() {
  stroke('lightgreen'); strokeWeight(2);
  line(150, 0, 150, 400); line(300, 0, 300, 400); line(450, 0, 450, 400);

  fill('forestgreen'); noStroke(); rect(0, 300, 600, 100); 

  for (let i = 0; i < 4; i++) {
    stroke('black'); strokeWeight(2);
    if (pressedKey === i && pressTimer > 0) fill('gray'); 
    else fill('white');
    rect(i * 150 + 2, 300, 146, 100);
  }

  if (gameState === 'PLAYING') {
    if (frameCount % spawnInterval === 0) {
      tiles.push({ col: floor(random(4)), y: -120 }); 
    }
    fill('saddlebrown'); noStroke();
    for (let i = tiles.length - 1; i >= 0; i--) {
      let t = tiles[i];
      t.y += fallSpeed; 
      rect(t.col * 150 + 4, t.y, 142, 120);
      if (t.y > 400) tiles.splice(i, 1);
    }
  }

  for (let i = feedbacks.length - 1; i >= 0; i--) {
    let f = feedbacks[i];
    fill(f.color); noStroke(); textSize(24);
    text(f.text, f.x, f.y);
    f.y -= 1.5; f.alpha -= 5; 
    if (f.alpha <= 0) feedbacks.splice(i, 1);
  }

  fill('white'); stroke('black'); strokeWeight(2);
  rect(100, 10, 400, 70, 10); 
  fill('black'); noStroke(); textSize(28);
  text("Growth: " + score + " | Time: " + ceil(timeLeft), 300, 45); 
  
  if (pressTimer > 0) pressTimer--;
}

function drawCompletionScreen() {
  fill(0, 150); 
  noStroke(); rect(0, 0, 600, 400);
  
  fill('white'); textSize(48);
  text("Exercise Completed!", 300, 120);
  textSize(32);
  text("Final Growth: " + score, 300, 180);
  
  fill('white'); stroke('black'); strokeWeight(3);
  rect(140, 240, 320, 70, 10);
  fill('black'); noStroke(); textSize(28);
  text("Back to Home", 300, 275);
}

function runTimer() {
  let currentTime = millis();
  let elapsedTime = (currentTime - lastTime) / 1000; 
  timeLeft = 60 - elapsedTime; 
  
  if (timeLeft <= 0) {
    timeLeft = 0;
    gameState = 'COMPLETED'; 
  }
}

function mousePressed() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume(); 
  }

  if (gameState === 'START') {
    if (mouseX > 140 && mouseX < 460 && mouseY > 180 && mouseY < 260) {
      startGame();
    }
    return;
  }

  if (gameState === 'COMPLETED') {
    if (mouseX > 140 && mouseX < 460 && mouseY > 240 && mouseY < 310) {
      gameState = 'START';
    }
    return;
  }

  let col = floor(mouseX / 150);
  pressedKey = col;
  pressTimer = 10; 

  let lowest = null;
  let idx = -1;

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].col === col && (!lowest || tiles[i].y > lowest.y)) {
      lowest = tiles[i];
      idx = i;
    }
  }

  if (lowest && lowest.y > 180) {
    tiles.splice(idx, 1); 
    score += 10;
    feedbacks.push({ x: col * 150 + 75, y: 250, text: "+10", color: 'green' });
    
    fallSpeed = 3 + floor(score / 50) * 0.5;
    spawnInterval = max(15, 45 - floor(score / 50) * 3);
    
    let randomNote = random(notes);
    playNote(randomNote, 0.3, 'sine', 0.3);
    
  } else {
    score -= 5;
    feedbacks.push({ x: mouseX, y: mouseY, text: "-5", color: 'red' });
    
    playErrorSound();
  }
}

function startGame() {
  gameState = 'PLAYING';
  score = 0;
  tiles = [];
  feedbacks = [];
  fallSpeed = 3;
  spawnInterval = 45;
  timeLeft = 60; 
  lastTime = millis(); 
}

function playNote(note, duration, type, volume) {
  if (!audioCtx) return;
  
  const freqMap = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25
  };
  
  let freq = freqMap[note];
  if (!freq) return;

  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  osc.type = type; 
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}


function playErrorSound() {
  if (!audioCtx) return;

  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  osc.type = 'sawtooth'; // Harsher sound
  
  // Frequency drops from 200Hz to 50Hz to simulate a "buzzer" or "failure"
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}