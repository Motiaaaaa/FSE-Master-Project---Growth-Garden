
let currentScreen = "home";
let currentExercise = "";
let settingsOpen = false;

// Settings
let musicOn = true;
let soundEffectsOn = true;
let vibrationOn = true;
let animationsOn = true;
let slowMovement = false;
let largerTargets = false;
let timerEnabled = true;
let tapAssistance = true;

// Game variables
let gameLevel = "Beginner";
let gameScore = 0;
let butterflyGoal = 10;
let remainingTime = 60;
let butterflies = [];
let sparkles = [];
let catchEffects = [];
let netX = 300;
let netY = 275;
let gamePaused = false;
let lastFrameTime = 0;

// Feedback
let feedbackMessage = "";
let feedbackStart = 0;
let feedbackDuration = 900;

// Audio
let audioContext;
let musicTimer = 0;
let musicIndex = 0;
let musicNotes = [
  261.63, 329.63, 392, 329.63,
  293.66, 349.23, 440, 349.23
];

// Colors
const C = {
  forest: "#254D3B",
  green: "#4F9569",
  sage: "#A9C9A0",
  mint: "#E3F0E3",
  cream: "#FFF9ED",
  sky: "#BFE1EF",
  lavender: "#D8C9E9",
  pink: "#EBAFBA",
  gold: "#F3D17A",
  brown: "#89664B",
  gray: "#64766C",
  white: "#FFFFFF",
  dark: "#263D32"
};

// ==================================================
// SETUP
// ==================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont("Arial");
  textAlign(CENTER, CENTER);
  lastFrameTime = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(C.sky);

  let sx = width / 600;
  let sy = height / 400;

  push();
  scale(sx, sy);

  if (currentScreen === "home") {
    drawHomePage();

  } else if (currentScreen === "exercise") {
    drawPlaceholderPage();

  } else if (currentScreen === "butterflyIntro") {
    drawButterflyIntro();

  } else if (currentScreen === "butterflyTutorial") {
    drawButterflyTutorial();

  } else if (currentScreen === "butterflyGame") {
    drawButterflyGame();

  } else if (currentScreen === "butterflyEnd") {
    drawButterflyEnd();
  }

  pop();

  updateMusic();
}

// ==================================================
// GENERAL HELPERS
// ==================================================

function inside(x, y, bx, by, bw, bh) {
  return x >= bx && x <= bx + bw &&
    y >= by && y <= by + bh;
}

function isHovering(x, y, w, h) {
  let sx = width / 600;
  let sy = height / 400;

  return inside(
    mouseX / sx,
    mouseY / sy,
    x, y, w, h
  );
}

function drawPanel(x, y, w, h, radius = 16, panelColor = C.cream) {
  noStroke();
  fill(30, 55, 40, 35);
  rect(x, y + 4, w, h, radius);

  fill(panelColor);
  rect(x, y, w, h, radius);
}

function drawButton(label, x, y, w, h, fillColor, textColor = C.forest) {
  let hovered = isHovering(x, y, w, h);

  noStroke();
  fill(25, 50, 35, 35);
  rect(x, y + 4, w, h, 13);

  fill(
    hovered
      ? lerpColor(color(fillColor), color(255), 0.12)
      : fillColor
  );

  rect(x, y, w, h, 13);

  fill(textColor);
  textStyle(BOLD);
  textSize(12);
  text(label, x + w / 2, y + h / 2);
  textStyle(NORMAL);
}

function drawSoftButton(label, x, y, w, h) {
  let hovered = isHovering(x, y, w, h);

  noStroke();
  fill(30, 55, 40, 25);
  rect(x, y + 3, w, h, 13);

  fill(hovered ? "#FFFFFF" : "#F8FAF2");
  rect(x, y, w, h, 13);

  noFill();
  stroke(hovered ? C.green : "#DCE8D8");
  strokeWeight(1.2);
  rect(x, y, w, h, 13);

  noStroke();
  fill(C.forest);
  textStyle(BOLD);
  textSize(12);
  text(label, x + w / 2, y + h / 2);
  textStyle(NORMAL);
}

function drawFeedback() {
  if (!feedbackMessage) return;

  let timeLeft = feedbackDuration - (millis() - feedbackStart);

  if (timeLeft <= 0) {
    feedbackMessage = "";
    return;
  }

  let fadeAmount = constrain(
    map(timeLeft, 0, feedbackDuration, 0, 255),
    0, 255
  );

  noStroke();
  fill(37, 77, 59, fadeAmount * 0.92);
  rect(155, 325, 290, 38, 12);

  fill(255, 255, 255, fadeAmount);
  textStyle(BOLD);
  textSize(14);
  text(feedbackMessage, 300, 344);
  textStyle(NORMAL);
}

function startFeedback(message, duration = 900) {
  feedbackMessage = message;
  feedbackStart = millis();
  feedbackDuration = duration;
}

function clearFeedback() {
  feedbackMessage = "";
}

// ==================================================
// HOME PAGE
// ==================================================

function drawHomePage() {
  drawGardenScene();

  fill(C.forest);
  textStyle(BOLD);
  textSize(32);
  text("Growth Garden", 300, 65);

  textStyle(NORMAL);
  fill("#456B56");
  textSize(13);
  text(
    "Small movements. Stronger skills. A little growth every day.",
    300, 94
  );

  stroke(C.green);
  strokeWeight(2);
  line(245, 111, 355, 111);
  noStroke();

  drawExerciseButton(
    "Catch the Butterfly", "BUTTERFLY",
    105, 145, 190, 55, "#E8DDF2", "#765D94"
  );

  drawExerciseButton(
    "Tap the Flower", "FLOWER",
    305, 145, 190, 55, "#F8E2E8", "#A85D76"
  );

  drawExerciseButton(
    "Harvest the Fruit", "FRUIT",
    105, 215, 190, 55, "#F8E8C9", "#9A6D38"
  );

  drawExerciseButton(
    "Piano Tiles", "PIANO",
    305, 215, 190, 55, "#DDEBE1", "#47765B"
  );

  drawSettingsIcon();

  fill(C.forest);
  textSize(11);
  textStyle(BOLD);
  text("WELCOME TO YOUR GARDEN", 300, 310);

  textStyle(NORMAL);
  fill("#52755D");
  textSize(10);
  text(
    "Choose an activity to begin growing your skills.",
    300, 328
  );

  if (settingsOpen) {
    drawSettingsPanel();
  }
}

// ==================================================
// GARDEN BACKGROUND
// ==================================================

function drawGardenScene() {
  background(C.sky);

  // Sun
  noStroke();
  fill(255, 239, 190, 90);
  ellipse(500, 62, 115, 115);

  fill("#F9E5A8");
  ellipse(500, 62, 53, 53);

  // Clouds
  drawCloud(75, 78, 0.9);
  drawCloud(400, 115, 0.65);

  // Distant hills
  noStroke();
  fill("#B5D7AE");
  ellipse(75, 305, 260, 170);
  ellipse(520, 310, 270, 175);

  fill("#8FBE83");
  ellipse(160, 350, 360, 150);
  ellipse(480, 350, 380, 160);

  // Ground
  fill("#79B66C");
  rect(0, 325, 600, 75);

  // Garden path
  fill("#D9C9A3");
  beginShape();
  vertex(245, 400);
  vertex(290, 400);
  vertex(330, 325);
  vertex(290, 325);
  endShape(CLOSE);

  stroke("#E8D8B5");
  strokeWeight(2);
  line(270, 400, 310, 325);
  noStroke();

  // Trees
  drawTree(45, 270, 0.85);
  drawTree(555, 270, 0.9);

  // Flowers and plants
  drawFlowerPatch(90, 345);
  drawFlowerPatch(490, 350);
  drawFlowerPatch(185, 360);
  drawFlowerPatch(415, 365);

  drawPlant(25, 355, 0.8);
  drawPlant(575, 350, 0.8);

  // Moving insects
  drawGardenInsects();
}

function drawCloud(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  noStroke();
  fill(255, 255, 255, 190);
  ellipse(0, 8, 45, 24);
  ellipse(18, 0, 34, 30);
  ellipse(38, 8, 42, 25);

  pop();
}

function drawTree(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  noStroke();
  fill("#8B694A");
  rect(-7, 0, 14, 65, 5);

  fill("#4F9569");
  ellipse(0, -18, 78, 85);
  ellipse(-23, -4, 54, 55);
  ellipse(25, -5, 55, 57);

  fill("#70AC78");
  ellipse(-15, -32, 30, 32);
  ellipse(18, -28, 32, 30);

  pop();
}

function drawPlant(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  stroke("#477F52");
  strokeWeight(3);
  line(0, 0, 0, -23);

  noStroke();
  fill("#69A76E");
  ellipse(-7, -14, 13, 7);
  ellipse(7, -20, 13, 7);

  pop();
}

// ==================================================
// FLOWERS
// ==================================================

function drawFlowerPatch(x, y) {
  drawFlower(x, y, 0.55, "#EBAFBA");
  drawFlower(x + 18, y + 5, 0.45, "#E7D2F0");
  drawFlower(x - 16, y + 7, 0.4, "#F3D17A");
}

function drawFlower(x, y, s, petalColor) {
  push();
  translate(x, y);
  scale(s);

  // Stem
  stroke("#4E8B57");
  strokeWeight(3);
  line(0, 0, 0, -27);

  // Leaves
  noStroke();
  fill("#72A66F");
  ellipse(-7, -13, 13, 7);
  ellipse(7, -19, 13, 7);

  // Flower head
  push();
  translate(0, -30);

  fill(petalColor);

  for (let i = 0; i < 5; i++) {
    ellipse(0, -8, 9, 13);
    rotate(TWO_PI / 5);
  }

  fill("#F5D77A");
  ellipse(0, 0, 9, 9);

  pop();
  pop();
}

// ==================================================
// BEES AND ANTS
// ==================================================

function drawBee(x, y, s = 1) {
  push();
  translate(x, y);
  scale(s);

  let wing = sin(millis() * 0.025) * 4;

  // Wings
  noStroke();
  fill(255, 255, 255, 190);
  ellipse(-5, -7 - wing * 0.2, 9, 13);
  ellipse(5, -7 + wing * 0.2, 9, 13);

  // Body
  fill("#F4C84D");
  ellipse(0, 0, 17, 11);

  // Stripes
  stroke("#514536");
  strokeWeight(2);
  line(-3, -5, -3, 5);
  line(3, -5, 3, 5);

  // Head
  noStroke();
  fill("#514536");
  ellipse(9, 0, 6, 6);

  pop();
}

function drawAnt(x, y, s = 1) {
  push();
  translate(x, y);
  scale(s);

  let walk = sin(millis() * 0.018) * 3;

  stroke("#493A32");
  strokeWeight(1.5);

  // Legs
  line(-4, 1, -8, 7 + walk);
  line(0, 2, 0, 9 - walk);
  line(4, 1, 8, 7 + walk);

  line(-4, 1, -7, -5 - walk);
  line(0, 2, 0, -6 + walk);
  line(4, 1, 7, -5 - walk);

  // Body
  noStroke();
  fill("#493A32");
  ellipse(-5, 0, 7, 7);
  ellipse(0, 0, 6, 6);
  ellipse(6, 0, 8, 8);

  pop();
}

function drawGardenInsects() {
  if (!animationsOn) return;

  let t = millis() * 0.001;

  // Bees flying around the garden
  drawBee(
    125 + sin(t * 1.1) * 28,
    175 + cos(t * 1.5) * 13,
    0.85
  );

  drawBee(
    450 + sin(t * 0.8) * 22,
    275 + cos(t * 1.2) * 12,
    0.75
  );

  // Ants walking along the ground
  let antX1 = (t * 25) % 620;
  let antX2 = (antX1 + 250) % 620;

  drawAnt(antX1 - 10, 385, 0.8);
  drawAnt(antX2 - 10, 375, 0.7);
}

// ==================================================
// EXERCISE BUTTONS AND ICONS
// ==================================================

function drawExerciseButton(
  label, iconType, x, y, w, h, buttonColor, accentColor
) {
  let hovered = isHovering(x, y, w, h);

  noStroke();
  fill(30, 55, 40, 35);
  rect(x, y + 4, w, h, 15);

  fill(
    hovered
      ? lerpColor(color(buttonColor), color(255), 0.2)
      : buttonColor
  );

  rect(x, y, w, h, 15);

  fill(accentColor);
  ellipse(x + 31, y + h / 2, 34, 34);

  drawExerciseIcon(iconType, x + 31, y + h / 2);

  fill(C.forest);
  textStyle(BOLD);
  textSize(12);
  text(label, x + 113, y + h / 2);

  fill(accentColor);
  textSize(17);
  text("›", x + w - 16, y + h / 2 - 1);

  textStyle(NORMAL);
}

function drawExerciseIcon(type, x, y) {
  push();
  translate(x, y);
  noStroke();

  if (type === "BUTTERFLY") {
    fill("#F7E8FA");
    ellipse(-6, -4, 12, 13);
    ellipse(6, -4, 12, 13);
    ellipse(-5, 5, 9, 9);
    ellipse(5, 5, 9, 9);

    fill(C.white);
    ellipse(0, 0, 3, 17);

  } else if (type === "FLOWER") {
    fill("#FFF1C9");

    for (let i = 0; i < 5; i++) {
      ellipse(0, -7, 8, 11);
      rotate(TWO_PI / 5);
    }

    fill("#F5C95E");
    ellipse(0, 0, 8, 8);

  } else if (type === "FRUIT") {
    // Red apple
    fill("#E64B4B");
    ellipse(-4, 2, 13, 17);
    ellipse(4, 2, 13, 17);

    // Stem
    stroke("#725039");
    strokeWeight(2);
    line(0, -5, 1, -11);

    // Leaf
    noStroke();
    fill("#5D9B60");
    ellipse(6, -9, 9, 5);

  } else if (type === "PIANO") {
    fill(C.white);
    rect(-10, -9, 20, 18, 2);

    stroke("#47765B");
    strokeWeight(1);
    line(-3, -9, -3, 9);
    line(4, -9, 4, 9);

    noStroke();
    fill("#47765B");
    rect(-7, -9, 5, 10, 1);
    rect(0, -9, 5, 10, 1);
  }

  pop();
}

// ==================================================
// SETTINGS
// ==================================================

function drawSettingsIcon() {
  let hovered = isHovering(530, 20, 48, 42);

  noStroke();
  fill(hovered ? "#F8FAF2" : "#FFFFFF");
  rect(530, 20, 48, 42, 13);

  fill(C.forest);
  textSize(22);
  text("⚙", 554, 41);
}

function drawSettingsPanel() {
  noStroke();
  fill(30, 50, 38, 145);
  rect(0, 0, 600, 400);

  drawPanel(145, 35, 310, 330, 18);

  fill(C.forest);
  textStyle(BOLD);
  textSize(21);
  text("Garden Settings", 300, 69);
  textStyle(NORMAL);

  let settings = [
    ["Background music", musicOn],
    ["Sound effects", soundEffectsOn],
    ["Vibration", vibrationOn],
    ["Animations", animationsOn],
    ["Slower butterflies", slowMovement],
    ["Larger targets", largerTargets],
    ["Round timer", timerEnabled],
    ["Tap assistance", tapAssistance]
  ];

  for (let i = 0; i < settings.length; i++) {
    let y = 110 + i * 26;

    fill(C.dark);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(settings[i][0], 180, y);

    fill(settings[i][1] ? C.green : "#C9D2CC");
    noStroke();
    rect(395, y - 9, 38, 18, 10);

    fill(C.white);
    ellipse(settings[i][1] ? 424 : 404, y, 14, 14);
  }

  textAlign(CENTER, CENTER);
  drawButton("Done", 230, 324, 140, 27, C.green, C.white);
}

function toggleSetting(index) {
  if (index === 0) musicOn = !musicOn;
  if (index === 1) soundEffectsOn = !soundEffectsOn;
  if (index === 2) vibrationOn = !vibrationOn;
  if (index === 3) animationsOn = !animationsOn;
  if (index === 4) slowMovement = !slowMovement;
  if (index === 5) largerTargets = !largerTargets;
  if (index === 6) timerEnabled = !timerEnabled;
  if (index === 7) tapAssistance = !tapAssistance;
}

// ==================================================
// PLACEHOLDER EXERCISE SCREENS
// ==================================================

function drawPlaceholderPage() {
  drawGardenScene();
  drawPanel(105, 85, 390, 225, 18);

  fill(C.forest);
  textStyle(BOLD);
  textSize(24);
  text(currentExercise, 300, 135);

  textStyle(NORMAL);
  fill(C.gray);
  textSize(13);
  text("This exercise will be connected", 300, 190);
  text("when its game screen is ready.", 300, 211);

  drawButton(
    "Back to Garden", 205, 255, 190, 40,
    C.green, C.white
  );
}

// ==================================================
// BUTTERFLY DIFFICULTY SETTINGS
// ==================================================

function getDifficultySettings() {
  if (gameLevel === "Intermediate") {
    return {
      goal: 15,
      count: 3,
      speed: 2.0,
      catchDistance: 28,
      time: 50
    };
  }

  if (gameLevel === "Advanced") {
    return {
      goal: 20,
      count: 5,
      speed: 2.8,
      catchDistance: 22,
      time: 40
    };
  }

  return {
    goal: 10,
    count: 1,
    speed: 1.1,
    catchDistance: 35,
    time: 60
  };
}

function getCatchDistance() {
  let distance = getDifficultySettings().catchDistance;

  if (largerTargets) {
    distance += 12;
  }

  return distance;
}

// ==================================================
// BUTTERFLY DIFFICULTY SCREEN
// ==================================================

function drawButterflyIntro() {
  drawGardenScene();
  drawPanel(65, 25, 470, 350, 20);

  fill(C.forest);
  textStyle(BOLD);
  textSize(25);
  text("Catch the Butterfly", 300, 65);

  textStyle(NORMAL);
  fill(C.gray);
  textSize(13);
  text("Fine Motor Skills Exercise", 300, 91);

  fill(C.dark);
  textSize(12);
  text("Move your hand or finger to guide the net.", 300, 125);
  text("Catch butterflies to help your garden grow!", 300, 146);

  fill(C.forest);
  textStyle(BOLD);
  textSize(13);
  text("Choose your difficulty", 300, 185);
  textStyle(NORMAL);

  let levels = [
    { name: "Beginner", x: 105, speed: "Slow movement" },
    { name: "Intermediate", x: 225, speed: "Faster movement" },
    { name: "Advanced", x: 345, speed: "Fast movement" }
  ];

  for (let level of levels) {
    let selected = gameLevel === level.name;
    let hovered = isHovering(level.x, 210, 105, 50);

    noStroke();
    fill(
      selected ? C.green :
      (hovered ? C.mint : "#F0F4EF")
    );
    rect(level.x, 210, 105, 50, 10);

    fill(selected ? C.white : C.forest);
    textStyle(BOLD);
    textSize(11);
    text(level.name, level.x + 52, 228);

    textStyle(NORMAL);
    textSize(9);
    text(level.speed, level.x + 52, 244);
  }

  let settings = getDifficultySettings();

  fill(C.gray);
  textSize(11);
  text("Goal: Catch " + settings.goal + " butterflies", 300, 282);

  text(
    timerEnabled
      ? "Time limit: " + settings.time + " seconds"
      : "No time limit",
    300, 299
  );

  drawSoftButton("Watch Tutorial", 105, 320, 175, 38);

  drawButton(
    "Start Exercise", 295, 320, 200, 38,
    C.green, C.white
  );

  drawSoftButton("Back to Home", 225, 365, 150, 25);
}

// ==================================================
// BUTTERFLY TUTORIAL
// ==================================================

function drawButterflyTutorial() {
  drawGardenScene();
  drawPanel(65, 25, 470, 350, 20);

  fill(C.forest);
  textStyle(BOLD);
  textSize(25);
  text("How to Play", 300, 65);

  textStyle(NORMAL);
  fill(C.gray);
  textSize(12);
  text("Follow these steps to get started!", 300, 94);

  let instructions = [
    "1. Move your hand or finger to guide the net.",
    "2. Move the net toward a butterfly to catch it.",
    "3. Catch the required number before time runs out.",
    "4. Press Pause whenever you need a break."
  ];

  fill(C.dark);
  textSize(12);

  for (let i = 0; i < instructions.length; i++) {
    textAlign(LEFT, CENTER);
    text(instructions[i], 115, 135 + i * 31);
  }

  textAlign(CENTER, CENTER);
  fill(C.green);
  textStyle(BOLD);
  textSize(11);
  text(
    "The net catches butterflies automatically when it gets close!",
    300, 275
  );

  textStyle(NORMAL);

  drawSoftButton(
    "Back to Difficulty", 100, 315, 185, 38
  );

  drawButton(
    "Start Exercise", 315, 315, 185, 38,
    C.green, C.white
  );
}

// ==================================================
// AUDIO
// ==================================================

function startAudio() {
  if (!audioContext) {
    let AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(frequency, duration = 0.15, volume = 0.08) {
  if (!soundEffectsOn) return;

  startAudio();
  if (!audioContext) return;

  let oscillator = audioContext.createOscillator();
  let gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function playCatchSound() {
  playTone(620, 0.12);
  setTimeout(() => playTone(820, 0.16), 90);
}

function playMissSound() {
  playTone(220, 0.16, 0.05);
}

function playCompleteSound() {
  playTone(523, 0.15);
  setTimeout(() => playTone(659, 0.15), 130);
  setTimeout(() => playTone(784, 0.25), 260);
}

function vibrateDevice(duration) {
  if (
    vibrationOn &&
    typeof navigator !== "undefined" &&
    navigator.vibrate
  ) {
    navigator.vibrate(duration);
  }
}

function updateMusic() {
  if (!musicOn) return;

  if (millis() - musicTimer > 850) {
    musicTimer = millis();

    if (
      currentScreen !== "home" &&
      currentScreen !== "exercise"
    ) {
      startAudio();
      playMusicNote();
    }
  }
}

function playMusicNote() {
  if (!musicOn || !audioContext) return;

  let frequency = musicNotes[musicIndex % musicNotes.length];
  musicIndex++;

  let oscillator = audioContext.createOscillator();
  let gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.018;

  gain.gain.setTargetAtTime(
    0.001,
    audioContext.currentTime + 0.3,
    0.1
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
}

// ==================================================
// BUTTERFLY GAME SETUP
// ==================================================

function createButterfly() {
  let settings = getDifficultySettings();

  let speed = settings.speed;

  if (slowMovement) {
    speed *= 0.65;
  }

  return {
    x: random(70, 530),
    y: random(100, 245),

    speedX: random([-1, 1]) * random(speed * 0.6, speed),
    speedY: random([-1, 1]) * random(speed * 0.3, speed * 0.6),

    phase: random(TWO_PI),

    directionTimer: random(0.6, 1.8),
    speedFactor: random(0.85, 1.15),

    size: largerTargets ? 1.3 : 1
  };
}

function startButterflyGame() {
  let settings = getDifficultySettings();

  gameScore = 0;
  butterflyGoal = settings.goal;
  remainingTime = settings.time;

  butterflies = [];
  sparkles = [];
  catchEffects = [];

  gamePaused = false;

  netX = 300;
  netY = 275;

  clearFeedback();

  for (let i = 0; i < settings.count; i++) {
    butterflies.push(createButterfly());
  }

  lastFrameTime = millis();
  currentScreen = "butterflyGame";
}

// ==================================================
// BUTTERFLY GAME
// ==================================================

function drawButterflyGame() {
  drawGameBackground();

  if (!gamePaused) {
    updateGame();
  }

  drawButterflies();
  drawCatchEffects();
  drawSparkles();
  drawNet();
  drawGameHUD();
  drawFeedback();

  if (gamePaused) {
    drawPauseOverlay();
  }
}

function drawGameBackground() {
  background(C.sky);

  noStroke();
  fill("#B5D7AE");
  ellipse(80, 365, 220, 100);
  ellipse(520, 365, 240, 100);

  fill("#86BD73");
  rect(0, 345, 600, 55);

  fill("#75AD62");
  rect(0, 370, 600, 30);

  drawFlower(45, 350, 0.8, C.pink);
  drawFlower(550, 345, 0.75, C.lavender);
  drawFlower(115, 355, 0.55, C.gold);
}

// ==================================================
// GAME UPDATE AND AUTOMATIC CATCHING
// ==================================================

function updateGame() {
  let currentTime = millis();

  let delta = min(
    (currentTime - lastFrameTime) / 1000,
    0.05
  );

  lastFrameTime = currentTime;

  // Timer
  if (timerEnabled) {
    remainingTime -= delta;

    if (remainingTime <= 0) {
      remainingTime = 0;
      endButterflyGame(false);
      return;
    }
  }

  // Move butterflies with less predictable patterns
  let settings = getDifficultySettings();

  for (let butterfly of butterflies) {
    butterfly.phase += delta * 5;

    butterfly.directionTimer -= delta;

    // Occasionally change direction and speed
    if (butterfly.directionTimer <= 0) {
      let baseSpeed = settings.speed;

      if (slowMovement) {
        baseSpeed *= 0.65;
      }

      butterfly.speedX =
        random([-1, 1]) * random(baseSpeed * 0.5, baseSpeed);

      butterfly.speedY =
        random([-1, 1]) * random(baseSpeed * 0.25, baseSpeed * 0.65);

      butterfly.speedFactor = random(0.75, 1.35);

      butterfly.directionTimer = random(0.6, 1.6);
    }

    // Horizontal and vertical movement
    butterfly.x +=
      butterfly.speedX * 60 * delta * butterfly.speedFactor;

    butterfly.y +=
      butterfly.speedY * 60 * delta * butterfly.speedFactor
      + sin(butterfly.phase) * 0.4;

    // Keep butterflies inside the play area
    if (butterfly.x < 35) {
      butterfly.x = 35;
      butterfly.speedX = abs(butterfly.speedX);
    }

    if (butterfly.x > 565) {
      butterfly.x = 565;
      butterfly.speedX = -abs(butterfly.speedX);
    }

    if (butterfly.y < 90) {
      butterfly.y = 90;
      butterfly.speedY = abs(butterfly.speedY);
    }

    if (butterfly.y > 285) {
      butterfly.y = 285;
      butterfly.speedY = -abs(butterfly.speedY);
    }
  }

  // Update net position
  let targetX = mouseX / (width / 600);
  let targetY = mouseY / (height / 400);

  netX = lerp(netX, constrain(targetX, 30, 570), 0.18);
  netY = lerp(netY, constrain(targetY, 100, 330), 0.18);

  // Automatic net detection
  for (let i = butterflies.length - 1; i >= 0; i--) {
    let butterfly = butterflies[i];

    let catchDistance = getCatchDistance();

    if (
      dist(netX, netY, butterfly.x, butterfly.y)
      < catchDistance
    ) {
      catchButterfly(i);
      break;
    }
  }

  updateSparkles();
  updateCatchEffects();
}

// ==================================================
// BUTTERFLY DRAWING
// ==================================================

function drawButterflies() {
  for (let butterfly of butterflies) {
    drawButterfly(
      butterfly.x,
      butterfly.y,
      butterfly.size,
      butterfly.phase
    );
  }
}

function drawButterfly(x, y, s, phase) {
  push();
  translate(x, y);
  scale(s);

  let wingMove = sin(phase || millis() * 0.01) * 2;

  noStroke();

  fill("#EAA5C5");
  ellipse(-9, -5, 17, 22 + wingMove);
  ellipse(9, -5, 17, 22 - wingMove);

  fill("#B7A4E8");
  ellipse(-8, 8, 13, 15);
  ellipse(8, 8, 13, 15);

  fill("#3F4961");
  ellipse(0, 0, 5, 23);

  stroke("#3F4961");
  strokeWeight(1.5);
  noFill();

  arc(-3, -12, 9, 12, PI, TWO_PI);
  arc(3, -12, 9, 12, PI, TWO_PI);

  pop();
}

// ==================================================
// NET
// ==================================================

function drawNet() {
  push();
  translate(netX, netY);

  // Handle
  stroke("#8B6548");
  strokeWeight(5);
  line(0, 10, 9, 42);

  // Net rim
  noFill();
  stroke("#FFFFFF");
  strokeWeight(3);
  ellipse(0, 0, 45, 40);

  stroke("#A7C8D6");
  strokeWeight(1);
  ellipse(0, 0, 35, 31);

  pop();
}

// ==================================================
// GAME HUD
// ==================================================

function drawGameHUD() {
  noStroke();
  fill(C.cream);
  rect(0, 0, 600, 58);

  fill(C.forest);
  textStyle(BOLD);
  textSize(18);
  text("Catch the Butterfly", 300, 19);

  textStyle(NORMAL);
  fill(C.gray);
  textSize(10);
  text("Move your net to catch the butterflies", 300, 39);

  drawSoftButton("Pause", 15, 12, 65, 30);

  // Score panel
  drawPanel(440, 72, 135, 72, 13);

  fill(C.gray);
  textSize(11);
  text("Butterflies Caught", 507, 91);

  fill(C.green);
  textStyle(BOLD);
  textSize(22);
  text(gameScore + " / " + butterflyGoal, 507, 117);
  textStyle(NORMAL);

  noStroke();
  fill("#E3E9E3");
  rect(455, 130, 105, 6, 5);

  fill(C.green);
  rect(
    455, 130,
    105 * (gameScore / butterflyGoal),
    6, 5
  );

  // Timer
  if (timerEnabled) {
    drawPanel(20, 72, 120, 55, 12);

    fill(C.gray);
    textSize(10);
    text("Time remaining", 80, 89);

    fill(remainingTime < 10 ? "#C95D5D" : C.forest);
    textStyle(BOLD);
    textSize(19);
    text(ceil(remainingTime) + "s", 80, 109);
    textStyle(NORMAL);
  }
}

// ==================================================
// PAUSE SCREEN
// ==================================================

function pauseGame() {
  gamePaused = true;
  clearFeedback();
}

function resumeGame() {
  gamePaused = false;
  lastFrameTime = millis();
}

function drawPauseOverlay() {
  noStroke();
  fill(25, 48, 39, 165);
  rect(0, 0, 600, 400);

  drawPanel(155, 105, 290, 200, 18);

  fill(C.forest);
  textStyle(BOLD);
  textSize(24);
  text("Game Paused", 300, 146);

  textStyle(NORMAL);
  fill(C.gray);
  textSize(12);
  text("Take a break whenever you need one.", 300, 175);

  drawButton(
    "Resume Game", 215, 195, 170, 38,
    C.green, C.white
  );

  drawSoftButton(
    "Back to Difficulty", 215, 246, 170, 35
  );
}

// ==================================================
// CATCHING BUTTERFLIES
// ==================================================

function catchButterfly(index) {
  if (gamePaused || currentScreen !== "butterflyGame") {
    return;
  }

  if (index < 0 || index >= butterflies.length) {
    return;
  }

  let caught = butterflies[index];

  // Catch animation
  catchEffects.push({
    x: caught.x,
    y: caught.y,
    age: 0,
    size: caught.size
  });

  // Sparkles
  for (let i = 0; i < 9; i++) {
    sparkles.push({
      x: caught.x,
      y: caught.y,
      vx: random(-2.5, 2.5),
      vy: random(-2.5, 2.5),
      life: 35,
      size: random(3, 6)
    });
  }

  butterflies.splice(index, 1);
  gameScore++;

  playCatchSound();
  vibrateDevice(60);

  startFeedback("Great job! You caught one!", 900);

  if (gameScore >= butterflyGoal) {
    endButterflyGame(true);
    return;
  }

  // Replace the caught butterfly
  butterflies.push(createButterfly());
}

// Optional manual catch support
function checkCatch(x, y) {
  if (gamePaused || currentScreen !== "butterflyGame") {
    return;
  }

  for (let i = 0; i < butterflies.length; i++) {
    let butterfly = butterflies[i];

    let catchDistance = getCatchDistance();

    if (
      dist(x, y, butterfly.x, butterfly.y)
      < catchDistance
    ) {
      catchButterfly(i);
      return;
    }
  }
}

// ==================================================
// CATCH ANIMATIONS
// ==================================================

function drawCatchEffects() {
  for (let effect of catchEffects) {
    let progress = effect.age / 25;
    let effectSize = map(progress, 0, 1, 28, 2);

    noFill();
    stroke(
      255, 255, 255,
      map(progress, 0, 1, 220, 0)
    );

    strokeWeight(2);
    ellipse(effect.x, effect.y, effectSize * 1.7);

    drawButterfly(
      effect.x,
      effect.y,
      map(progress, 0, 1, 1, 0.1),
      0
    );
  }
}

function updateCatchEffects() {
  for (let effect of catchEffects) {
    effect.age++;
  }

  catchEffects = catchEffects.filter(
    effect => effect.age < 25
  );
}

function drawSparkles() {
  noStroke();

  for (let sparkle of sparkles) {
    fill(
      255, 224, 126,
      map(sparkle.life, 0, 35, 0, 255)
    );

    ellipse(
      sparkle.x,
      sparkle.y,
      sparkle.size
    );
  }
}

function updateSparkles() {
  for (let sparkle of sparkles) {
    sparkle.x += sparkle.vx;
    sparkle.y += sparkle.vy;
    sparkle.life--;
  }

  sparkles = sparkles.filter(
    sparkle => sparkle.life > 0
  );
}

// ==================================================
// END SCREEN
// ==================================================

function endButterflyGame(completed) {
  currentScreen = "butterflyEnd";
  gamePaused = false;
  clearFeedback();

  if (completed) {
    playCompleteSound();
    vibrateDevice(150);
  }
}

function drawButterflyEnd() {
  drawGardenScene();
  drawPanel(85, 48, 430, 305, 20);

  fill(C.forest);
  textStyle(BOLD);
  textSize(27);

  if (gameScore >= butterflyGoal) {
    text("Wonderful Work!", 300, 108);
  } else {
    text("Good Effort!", 300, 108);
  }

  textStyle(NORMAL);
  fill(C.gray);
  textSize(13);
  text(
    "You practiced your fine motor skills today.",
    300, 143
  );

  fill(C.green);
  textStyle(BOLD);
  textSize(36);
  text(gameScore + " / " + butterflyGoal, 300, 205);

  textStyle(NORMAL);
  fill(C.gray);
  textSize(12);
  text("Butterflies caught", 300, 231);

  drawButton(
    "Play Again", 205, 260, 190, 38,
    C.green, C.white
  );

  drawSoftButton(
    "Back to Home", 225, 310, 150, 30
  );
}

// ==================================================
// INPUT HANDLING
// ==================================================

function mousePressed() {
  startAudio();

  let x = mouseX / (width / 600);
  let y = mouseY / (height / 400);

  if (currentScreen === "home") {
    handleHomeClick(x, y);

  } else if (currentScreen === "exercise") {
    if (inside(x, y, 205, 255, 190, 40)) {
      currentScreen = "home";
      currentExercise = "";
    }

  } else if (currentScreen === "butterflyIntro") {
    handleIntroClick(x, y);

  } else if (currentScreen === "butterflyTutorial") {
    handleTutorialClick(x, y);

  } else if (currentScreen === "butterflyGame") {
    if (gamePaused) {
      handlePauseClick(x, y);

    } else if (inside(x, y, 15, 12, 65, 30)) {
      pauseGame();

    } else {
      checkCatch(netX, netY);
    }

  } else if (currentScreen === "butterflyEnd") {
    handleEndClick(x, y);
  }

  return false;
}

function handleHomeClick(x, y) {
  if (settingsOpen) {
    if (inside(x, y, 230, 324, 140, 27)) {
      settingsOpen = false;
      return;
    }

    let settingIndex = floor((y - 97) / 26);

    if (
      x > 390 &&
      x < 445 &&
      settingIndex >= 0 &&
      settingIndex < 8
    ) {
      toggleSetting(settingIndex);
    }

    return;
  }

  if (inside(x, y, 530, 20, 48, 42)) {
    settingsOpen = true;
    return;
  }

  if (inside(x, y, 105, 145, 190, 55)) {
    currentExercise = "Catch the Butterfly";
    currentScreen = "butterflyIntro";
    return;
  }

  if (inside(x, y, 305, 145, 190, 55)) {
    currentExercise = "Tap the Flower";
    currentScreen = "exercise";
    return;
  }

  if (inside(x, y, 105, 215, 190, 55)) {
    currentExercise = "Harvest the Fruit";
    currentScreen = "exercise";
    return;
  }

  if (inside(x, y, 305, 215, 190, 55)) {
    currentExercise = "Piano Tiles";
    currentScreen = "exercise";
    return;
  }
}

function handleIntroClick(x, y) {
  if (inside(x, y, 105, 210, 105, 50)) {
    gameLevel = "Beginner";

  } else if (inside(x, y, 225, 210, 105, 50)) {
    gameLevel = "Intermediate";

  } else if (inside(x, y, 345, 210, 105, 50)) {
    gameLevel = "Advanced";

  } else if (inside(x, y, 105, 320, 175, 38)) {
    currentScreen = "butterflyTutorial";

  } else if (inside(x, y, 295, 320, 200, 38)) {
    startButterflyGame();

  } else if (inside(x, y, 225, 365, 150, 25)) {
    currentScreen = "home";
    currentExercise = "";
  }
}

function handleTutorialClick(x, y) {
  if (inside(x, y, 100, 315, 185, 38)) {
    currentScreen = "butterflyIntro";

  } else if (inside(x, y, 315, 315, 185, 38)) {
    startButterflyGame();
  }
}

function handlePauseClick(x, y) {
  if (inside(x, y, 215, 195, 170, 38)) {
    resumeGame();

  } else if (inside(x, y, 215, 246, 170, 35)) {
    gamePaused = false;
    currentScreen = "butterflyIntro";
    clearFeedback();
  }
}

function handleEndClick(x, y) {
  if (inside(x, y, 205, 260, 190, 38)) {
    startButterflyGame();

  } else if (inside(x, y, 225, 310, 150, 30)) {
    currentScreen = "home";
    currentExercise = "";
  }
}
