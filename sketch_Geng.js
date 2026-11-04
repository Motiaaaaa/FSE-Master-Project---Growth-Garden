let tiles = [];
let score = 0;
let osc;

let fallSpeed = 3;       
let spawnInterval = 45;  
let gameState = 'START'; // Game states: 'START', 'PLAYING'

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(24);
  
  osc = new p5.Oscillator('sine');
  osc.start(); 
  osc.amp(0);
}

function draw() {
  background('skyblue'); 
  
  if (gameState === 'START') {
    drawStartScreen();
    return; 
  }
  
  drawGameScreen();
}

function drawStartScreen() {
  // Decorative static falling tiles
  fill('saddlebrown'); noStroke();
  rect(54, 80, 142, 120);
  rect(354, 150, 142, 120);
  rect(204, 50, 142, 120);

  // Decorative piano keys at the bottom
  fill('white'); stroke('black'); strokeWeight(2);
  for (let i = 0; i < 6; i++) {
    rect(i * 100, 320, 100, 80);
  }
  // Black keys
  fill('black'); noStroke();
  rect(70, 320, 60, 45);
  rect(170, 320, 60, 45);
  rect(370, 320, 60, 45);
  rect(470, 320, 60, 45);

  // Main Title
  fill('black'); stroke('white'); strokeWeight(4);
  textSize(56);
  text("Piano Tiles", 300, 120);
  
  // Start Button
  fill('white'); stroke('black'); strokeWeight(3);
  rect(200, 180, 200, 80, 10); 
  
  fill('black'); noStroke(); textSize(32);
  text("Start", 300, 220); 
}

function drawGameScreen() {
  stroke('lightgreen'); strokeWeight(2);
  line(150, 0, 150, 400); 
  line(300, 0, 300, 400); 
  line(450, 0, 450, 400);

  fill('forestgreen'); noStroke();
  rect(0, 300, 600, 100); 

  fill('white'); stroke('black'); strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    rect(i * 150 + 2, 300, 146, 100);
  }

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

  fill('white'); stroke('black'); strokeWeight(2);
  rect(220, 10, 160, 40, 10); 
  
  fill('black'); noStroke(); textSize(24);
  text("Growth: " + score, 300, 30); 
}

function mousePressed() {
  if (gameState === 'START') {
    if (mouseX > 200 && mouseX < 400 && mouseY > 180 && mouseY < 260) {
      gameState = 'PLAYING';
      score = 0;
      tiles = [];
      fallSpeed = 3;
      spawnInterval = 45;
    }
    return;
  }

  let col = floor(mouseX / 150);
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
    
    fallSpeed = 3 + floor(score / 50) * 0.5;
    spawnInterval = max(15, 45 - floor(score / 50) * 3);
    
    osc.freq(523.25); osc.amp(0.5, 0.05); setTimeout(() => osc.amp(0, 0.1), 100);
  } else {
    score -= 5;
    osc.freq(150); osc.amp(0.5, 0.05); setTimeout(() => osc.amp(0, 0.1), 100);
  }
}