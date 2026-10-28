// ============================================================
// HARVEST THE FRUIT
// Fine Motor Skills Rehabilitation Exercise
// p5.js
// ============================================================


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let apples = [];
let basket;

let gameState = "instructions";
// instructions
// playing
// complete

let overlayState = "none";
// none
// paused
// help
// confirmExit

let difficulty = "medium";

let collectedCount = 0;
let selectedApple = null;

// Feedback
let feedbackMessage = "";
let feedbackType = "";
let feedbackTimer = 0;

// Accessibility / settings
let soundEnabled = true;
let highContrast = false;

// Audio
let audioContext = null;

// Internal rehabilitation data
let unsuccessfulDrops = 0;


// ============================================================
// SETUP
// ============================================================

function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont("Arial");

  rectMode(CENTER);
  ellipseMode(CENTER);

  createGame();
}


// ============================================================
// MAIN DRAW LOOP
// ============================================================

function draw() {

  drawBackground();

  if (gameState === "instructions") {
    drawInstructionsScreen();
  }

  else if (gameState === "playing") {
    drawGame();
  }

  else if (gameState === "complete") {
    drawCompletionScreen();
  }


  // ----------------------------------------------------------
  // OVERLAYS
  // ----------------------------------------------------------

  if (overlayState === "paused") {
    drawPauseOverlay();
  }

  else if (overlayState === "help") {
    drawHelpOverlay();
  }

  else if (overlayState === "confirmExit") {
    drawExitConfirmation();
  }
}


// ============================================================
// BACKGROUND
// ============================================================

function drawBackground() {

  if (highContrast) {
    background(215, 235, 250);
  }

  else {
    background(190, 225, 245);
  }
}


// ============================================================
// DIFFICULTY SETTINGS
// ============================================================

function getTotalApples() {

  if (difficulty === "easy") {
    return 6;
  }

  if (difficulty === "hard") {
    return 12;
  }

  return 8;
}


function getAppleSize() {

  if (difficulty === "easy") {

    return constrain(
      width * 0.036,
      52,
      66
    );
  }


  if (difficulty === "hard") {

    return constrain(
      width * 0.021,
      32,
      42
    );
  }


  return constrain(
    width * 0.029,
    42,
    54
  );
}


function getBasketWidth() {

  if (difficulty === "easy") {

    return constrain(
      width * 0.18,
      200,
      260
    );
  }


  if (difficulty === "hard") {

    return constrain(
      width * 0.13,
      150,
      195
    );
  }


  return constrain(
    width * 0.15,
    170,
    225
  );
}


function getBasketHeight() {

  if (difficulty === "easy") {

    return constrain(
      height * 0.15,
      105,
      140
    );
  }


  if (difficulty === "hard") {

    return constrain(
      height * 0.11,
      80,
      105
    );
  }


  return constrain(
    height * 0.13,
    90,
    120
  );
}


// ============================================================
// CREATE / RESET GAME
// ============================================================

function createGame() {

  apples = [];

  collectedCount = 0;

  selectedApple = null;

  unsuccessfulDrops = 0;

  feedbackMessage = "";
  feedbackType = "";
  feedbackTimer = 0;

  overlayState = "none";


  let groundY =
    height * 0.84;


  let basketHeight =
    getBasketHeight();


  basket = {

    x: width * 0.77,

    y:
      groundY -
      basketHeight / 2,

    w:
      getBasketWidth(),

    h:
      basketHeight

  };


  createApples();
}


// ============================================================
// CREATE RANDOMIZED APPLES
// ============================================================

function createApples() {

  apples = [];


  // ----------------------------------------------------------
  // SAFE POSITIONS WITHIN TREE CANOPY
  // ----------------------------------------------------------

  let possiblePositions = [

    [-0.25, -0.18],
    [ 0.00, -0.27],
    [ 0.25, -0.17],

    [-0.33,  0.04],
    [-0.11,  0.01],
    [ 0.18,  0.05],

    [-0.23,  0.23],
    [ 0.26,  0.22],

    [-0.38, -0.09],
    [ 0.38, -0.04],

    [ 0.05,  0.21],
    [ 0.08, -0.10],

    [-0.36,  0.16],
    [ 0.36,  0.14],

    [-0.13, -0.23],
    [ 0.16, -0.24]

  ];


  // Shuffle positions so every round changes.
  shuffleArray(possiblePositions);


  let treeX =
    width * 0.34;


  let groundY =
    height * 0.84;


  let canopyW =
    min(
      width * 0.42,
      620
    );


  let canopyH =
    min(
      height * 0.38,
      330
    );


  let trunkH =
    constrain(
      height * 0.29,
      190,
      250
    );


  let trunkBottom =
    groundY + 5;


  let trunkTop =
    trunkBottom -
    trunkH;


  let treeY =
    trunkTop +
    canopyH * 0.12;


  let total =
    getTotalApples();


  let appleSize =
    getAppleSize();


  for (
    let i = 0;
    i < total;
    i++
  ) {

    let position =
      possiblePositions[i];


    let x =

      treeX +

      position[0] *
      canopyW;


    let y =

      treeY +

      position[1] *
      canopyH;


    apples.push(

      new Apple(
        x,
        y,
        appleSize,
        i + 1
      )

    );
  }
}


// ============================================================
// SHUFFLE ARRAY
// ============================================================

function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    let j =
      floor(
        random(i + 1)
      );


    let temp =
      array[i];


    array[i] =
      array[j];


    array[j] =
      temp;
  }
}


// ============================================================
// MAIN GAME
// ============================================================

function drawGame() {

  drawHeader();

  drawGround();

  drawTree();

  drawBasket();

  drawCollectedApples();


  // Update animations before drawing.
  for (let apple of apples) {

    apple.update();

    apple.display();

  }


  drawProgressPanel();

  drawFeedback();

  drawBackButton();

  drawSoundButton();

  drawPauseButton();

  drawHelpButton();

  drawContrastButton();

  drawDifficultyLabel();
}


// ============================================================
// HEADER
// ============================================================

function drawHeader() {

  let headerH =
    115;


  noStroke();


  if (highContrast) {

    fill(255);

  }

  else {

    fill(
      255,
      255,
      255,
      245
    );

  }


  rect(
    width / 2,
    headerH / 2,
    width,
    headerH
  );


  // ----------------------------------------------------------
  // TITLE
  // ----------------------------------------------------------

  if (highContrast) {

    fill(15);

  }

  else {

    fill(
      48,
      92,
      60
    );

  }


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);


  textSize(
    constrain(
      width * 0.026,
      28,
      40
    )
  );


  text(
    "Harvest the Fruit",
    width / 2,
    38
  );


  // ----------------------------------------------------------
  // SUBTITLE
  // ----------------------------------------------------------

  if (highContrast) {
    fill(25);
  }

  else {
    fill(80);
  }


  textStyle(NORMAL);


  textSize(
    constrain(
      width * 0.013,
      15,
      19
    )
  );


  text(
    "Drag each apple from the tree into the basket.",
    width / 2,
    78
  );
}


// ============================================================
// GROUND
// ============================================================

function drawGround() {

  let groundY =
    height * 0.84;


  noStroke();


  if (highContrast) {

    fill(
      120,
      185,
      55
    );

  }

  else {

    fill(
      164,
      211,
      92
    );

  }


  rectMode(CORNER);


  rect(
    0,
    groundY,
    width,
    height - groundY
  );


  if (highContrast) {

    fill(
      75,
      145,
      35
    );

  }

  else {

    fill(
      132,
      194,
      70
    );

  }


  rect(
    0,
    groundY + 28,
    width,
    height - groundY - 28
  );


  rectMode(CENTER);
}


// ============================================================
// TREE
// ============================================================

function drawTree() {

  let treeX =
    width * 0.34;


  let groundY =
    height * 0.84;


  let canopyW =
    min(
      width * 0.42,
      620
    );


  let canopyH =
    min(
      height * 0.38,
      330
    );


  let trunkW =
    constrain(
      width * 0.055,
      65,
      90
    );


  let trunkH =
    constrain(
      height * 0.29,
      190,
      250
    );


  let trunkBottom =
    groundY + 5;


  let trunkTop =
    trunkBottom -
    trunkH;


  let treeY =
    trunkTop +
    canopyH * 0.12;


  // =========================================================
  // TREE SHADOW
  // =========================================================

  noStroke();


  fill(
    0,
    0,
    0,
    28
  );


  ellipse(
    treeX,
    groundY + 7,
    trunkW * 2.2,
    20
  );


  // =========================================================
  // TRUNK
  // =========================================================

  stroke(
    90,
    55,
    28
  );


  strokeWeight(4);


  fill(
    145,
    92,
    45
  );


  beginShape();


  vertex(
    treeX -
    trunkW * 0.32,

    trunkTop
  );


  vertex(
    treeX -
    trunkW * 0.28,

    trunkBottom - 25
  );


  vertex(
    treeX -
    trunkW * 0.72,

    trunkBottom
  );


  vertex(
    treeX,
    trunkBottom - 4
  );


  vertex(
    treeX +
    trunkW * 0.72,

    trunkBottom
  );


  vertex(
    treeX +
    trunkW * 0.28,

    trunkBottom - 25
  );


  vertex(
    treeX +
    trunkW * 0.32,

    trunkTop
  );


  endShape(CLOSE);


  // =========================================================
  // TRUNK DETAILS
  // =========================================================

  stroke(
    120,
    76,
    40
  );


  strokeWeight(3);


  line(
    treeX -
    trunkW * 0.10,

    trunkTop + 40,

    treeX -
    trunkW * 0.08,

    trunkBottom - 45
  );


  line(
    treeX +
    trunkW * 0.12,

    trunkTop + 65,

    treeX +
    trunkW * 0.08,

    trunkBottom - 35
  );


  // =========================================================
  // BRANCHES
  // =========================================================

  stroke(
    112,
    72,
    40
  );


  strokeWeight(12);


  line(
    treeX,
    trunkTop + 40,

    treeX -
    canopyW * 0.20,

    treeY -
    canopyH * 0.10
  );


  line(
    treeX,
    trunkTop + 40,

    treeX +
    canopyW * 0.20,

    treeY -
    canopyH * 0.10
  );


  line(
    treeX,
    trunkTop + 25,

    treeX,

    treeY -
    canopyH * 0.25
  );


  // =========================================================
  // CANOPY
  // =========================================================

  noStroke();


  if (highContrast) {

    fill(
      25,
      105,
      40
    );

  }

  else {

    fill(
      52,
      126,
      66
    );

  }


  ellipse(
    treeX,
    treeY,
    canopyW,
    canopyH
  );


  if (highContrast) {

    fill(
      45,
      145,
      55
    );

  }

  else {

    fill(
      72,
      151,
      76
    );

  }


  ellipse(
    treeX -
    canopyW * 0.25,

    treeY -
    canopyH * 0.05,

    canopyW * 0.50,

    canopyH * 0.72
  );


  ellipse(
    treeX +
    canopyW * 0.25,

    treeY -
    canopyH * 0.05,

    canopyW * 0.50,

    canopyH * 0.72
  );


  if (highContrast) {

    fill(
      65,
      170,
      65
    );

  }

  else {

    fill(
      79,
      160,
      82
    );

  }


  ellipse(
    treeX,

    treeY -
    canopyH * 0.27,

    canopyW * 0.48,

    canopyH * 0.62
  );


  ellipse(
    treeX -
    canopyW * 0.18,

    treeY -
    canopyH * 0.23,

    canopyW * 0.38,

    canopyH * 0.52
  );


  ellipse(
    treeX +
    canopyW * 0.18,

    treeY -
    canopyH * 0.23,

    canopyW * 0.38,

    canopyH * 0.52
  );
}


// ============================================================
// APPLE OVER BASKET
// ============================================================

function appleOverBasket() {

  if (selectedApple === null) {
    return false;
  }


  return isInsideBasket(
    selectedApple.x,
    selectedApple.y
  );
}


// ============================================================
// BASKET
// ============================================================

function drawBasket() {

  let x =
    basket.x;


  let w =
    basket.w;


  let h =
    basket.h;


  let groundY =
    height * 0.84;


  let y =
    groundY -
    h / 2;


  basket.y =
    y;


  let highlighted =
    appleOverBasket();


  // =========================================================
  // SHADOW
  // =========================================================

  noStroke();


  fill(
    0,
    0,
    0,
    25
  );


  ellipse(
    x,
    groundY + 7,
    w * 0.90,
    18
  );


  // =========================================================
  // DROP ZONE
  // =========================================================

  if (highlighted) {

    noStroke();


    fill(
      95,
      190,
      105,
      70
    );


    ellipse(
      x,
      y,
      w * 1.45,
      h * 1.75
    );


    noFill();


    if (highContrast) {

      stroke(
        0,
        90,
        200
      );

    }

    else {

      stroke(
        75,
        175,
        85
      );

    }


    strokeWeight(6);


    ellipse(
      x,
      y,
      w * 1.25,
      h * 1.50
    );
  }


  // =========================================================
  // HANDLE
  // =========================================================

  noFill();


  if (highlighted && highContrast) {

    stroke(
      0,
      90,
      200
    );

  }

  else if (highlighted) {

    stroke(
      65,
      150,
      75
    );

  }

  else {

    stroke(
      100,
      60,
      30
    );

  }


  strokeWeight(8);


  arc(
    x,

    y -
    h * 0.30,

    w * 0.70,

    h * 1.15,

    PI,

    TWO_PI
  );


  // =========================================================
  // BODY
  // =========================================================

  if (highlighted && highContrast) {

    stroke(
      0,
      90,
      200
    );

    strokeWeight(6);

  }

  else if (highlighted) {

    stroke(
      65,
      150,
      75
    );

    strokeWeight(5);

  }

  else {

    stroke(
      105,
      68,
      38
    );

    strokeWeight(4);

  }


  fill(
    207,
    148,
    78
  );


  beginShape();


  vertex(
    x -
    w / 2,

    y -
    h * 0.25
  );


  vertex(
    x +
    w / 2,

    y -
    h * 0.25
  );


  vertex(
    x +
    w * 0.38,

    y +
    h / 2
  );


  vertex(
    x -
    w * 0.38,

    y +
    h / 2
  );


  endShape(CLOSE);


  // =========================================================
  // WEAVE
  // =========================================================

  stroke(
    140,
    85,
    40
  );


  strokeWeight(3);


  for (
    let i = -2;
    i <= 2;
    i++
  ) {

    line(
      x +
      i * w * 0.13,

      y -
      h * 0.20,

      x +
      i * w * 0.10,

      y +
      h * 0.43
    );
  }


  for (
    let i = 0;
    i < 3;
    i++
  ) {

    let lineY =

      y -
      h * 0.03 +

      i *
      h * 0.18;


    line(
      x -
      w * 0.42,

      lineY,

      x +
      w * 0.42,

      lineY
    );
  }


  // =========================================================
  // LABEL
  // =========================================================

  noStroke();


  if (highlighted && highContrast) {

    fill(
      0,
      60,
      160
    );

  }

  else if (highlighted) {

    fill(
      45,
      130,
      60
    );

  }

  else {

    fill(50);

  }


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(16);


  if (highlighted) {

    text(
      "RELEASE HERE",
      x,
      groundY + 24
    );

  }

  else {

    text(
      "BASKET",
      x,
      groundY + 24
    );

  }
}


// ============================================================
// COLLECTED APPLES
// ============================================================

function drawCollectedApples() {

  if (collectedCount === 0) {
    return;
  }


  let x =
    basket.x;


  let y =
    basket.y;


  let w =
    basket.w;


  let h =
    basket.h;


  let size =
    min(
      getAppleSize() * 0.50,
      25
    );


  let positions = [

    [-0.28,  0.14],
    [ 0.00,  0.14],
    [ 0.28,  0.14],

    [-0.18,  0.02],
    [ 0.18,  0.02],

    [-0.32, -0.09],
    [ 0.00, -0.09],
    [ 0.32, -0.09],

    [-0.20, -0.20],
    [ 0.20, -0.20],

    [-0.07, -0.25],
    [ 0.07, -0.25]

  ];


  for (
    let i = 0;
    i < collectedCount;
    i++
  ) {

    let appleX =

      x +

      positions[i][0] *
      w;


    let appleY =

      y +

      positions[i][1] *
      h;


    drawSmallApple(
      appleX,
      appleY,
      size
    );
  }
}


// ============================================================
// SMALL APPLE
// ============================================================

function drawSmallApple(
  x,
  y,
  size
) {

  push();


  translate(
    x,
    y
  );


  stroke(
    120,
    20,
    20
  );


  strokeWeight(1.5);


  if (highContrast) {

    fill(
      235,
      20,
      20
    );

  }

  else {

    fill(
      225,
      48,
      45
    );

  }


  ellipse(
    -size * 0.12,
    0,
    size * 0.58,
    size * 0.75
  );


  ellipse(
    size * 0.12,
    0,
    size * 0.58,
    size * 0.75
  );


  stroke(
    80,
    50,
    25
  );


  strokeWeight(2);


  line(
    0,
    -size * 0.32,

    size * 0.04,
    -size * 0.48
  );


  noStroke();


  fill(
    30,
    120,
    40
  );


  ellipse(
    size * 0.13,
    -size * 0.40,

    size * 0.24,
    size * 0.11
  );


  pop();
}


// ============================================================
// PROGRESS PANEL
// ============================================================

function drawProgressPanel() {

  let panelW =
    constrain(
      width * 0.18,
      210,
      270
    );


  let panelH =
    135;


  let panelX =

    width -

    panelW / 2 -

    35;


  let panelY =
    190;


  noStroke();


  fill(
    0,
    0,
    0,
    25
  );


  rect(
    panelX + 5,
    panelY + 6,
    panelW,
    panelH,
    18
  );


  fill(255);


  rect(
    panelX,
    panelY,
    panelW,
    panelH,
    18
  );


  fill(
    highContrast
      ? 15
      : 65
  );


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(18);


  text(
    "Fruit Collected",
    panelX,
    panelY - 38
  );


  let total =
    getTotalApples();


  if (highContrast) {

    fill(
      0,
      75,
      170
    );

  }

  else {

    fill(
      55,
      125,
      67
    );

  }


  textSize(28);


  text(
    collectedCount +
    " / " +
    total,

    panelX,
    panelY
  );


  let barW =
    panelW * 0.75;


  let barH =
    14;


  noStroke();


  fill(220);


  rect(
    panelX,
    panelY + 42,
    barW,
    barH,
    8
  );


  let progress =

    collectedCount /
    total;


  if (progress > 0) {

    rectMode(CORNER);


    if (highContrast) {

      fill(
        0,
        90,
        200
      );

    }

    else {

      fill(
        76,
        160,
        80
      );

    }


    rect(

      panelX -
      barW / 2,

      panelY +
      42 -
      barH / 2,

      barW *
      progress,

      barH,

      8

    );


    rectMode(CENTER);
  }
}


// ============================================================
// DIFFICULTY LABEL
// ============================================================

function drawDifficultyLabel() {

  let x =
    width - 145;


  let y =
    345;


  noStroke();


  fill(
    255,
    255,
    255,
    235
  );


  rect(
    x,
    y,
    160,
    40,
    10
  );


  fill(
    highContrast
      ? 15
      : 75
  );


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(14);


  text(
    "Difficulty: " +
    capitalize(difficulty),

    x,
    y
  );
}


// ============================================================
// APPLE CLASS
// ============================================================

class Apple {

  constructor(
    x,
    y,
    size,
    number
  ) {

    this.x = x;
    this.y = y;


    this.homeX = x;
    this.homeY = y;


    this.size = size;

    this.number = number;


    this.dragging = false;

    this.collected = false;


    this.offsetX = 0;
    this.offsetY = 0;


    // Animation state
    this.returning = false;

    this.successAnimating = false;

    this.animationProgress = 0;

    this.returnStartX = x;
    this.returnStartY = y;
  }


  // =========================================================
  // UPDATE
  // =========================================================

  update() {

    // --------------------------------------------------------
    // SMOOTH RETURN AFTER INCORRECT DROP
    // --------------------------------------------------------

    if (this.returning) {

      this.animationProgress +=
        0.09;


      let t =
        constrain(
          this.animationProgress,
          0,
          1
        );


      // Ease-out interpolation.
      let eased =
        1 -
        pow(
          1 - t,
          3
        );


      this.x =
        lerp(
          this.returnStartX,
          this.homeX,
          eased
        );


      this.y =
        lerp(
          this.returnStartY,
          this.homeY,
          eased
        );


      if (t >= 1) {

        this.x =
          this.homeX;


        this.y =
          this.homeY;


        this.returning =
          false;


        this.animationProgress =
          0;
      }
    }


    // --------------------------------------------------------
    // SUCCESS ANIMATION
    // --------------------------------------------------------

    if (this.successAnimating) {

      this.animationProgress +=
        0.12;


      if (
        this.animationProgress >= 1
      ) {

        this.successAnimating =
          false;


        this.collected =
          true;


        this.animationProgress =
          0;
      }
    }
  }


  // =========================================================
  // DISPLAY
  // =========================================================

  display() {

    if (
      this.collected &&
      !this.successAnimating
    ) {

      return;

    }


    push();


    translate(
      this.x,
      this.y
    );


    let scaleAmount =
      1;


    if (this.dragging) {

      scaleAmount =
        1.12;

    }


    // Shrink after successful drop.
    if (this.successAnimating) {

      scaleAmount =

        lerp(
          1.12,
          0.15,
          this.animationProgress
        );

    }


    scale(scaleAmount);


    // Shadow
    noStroke();


    fill(
      0,
      0,
      0,
      30
    );


    ellipse(
      4,
      6,
      this.size * 0.90,
      this.size * 0.85
    );


    // Apple body
    stroke(
      120,
      20,
      20
    );


    strokeWeight(
      highContrast
        ? 3
        : 2
    );


    if (highContrast) {

      fill(
        235,
        20,
        20
      );

    }

    else {

      fill(
        225,
        48,
        45
      );

    }


    ellipse(
      -this.size * 0.12,
      0,
      this.size * 0.58,
      this.size * 0.75
    );


    ellipse(
      this.size * 0.12,
      0,
      this.size * 0.58,
      this.size * 0.75
    );


    // Highlight
    noStroke();


    fill(
      255,
      150,
      140,
      210
    );


    ellipse(
      -this.size * 0.17,
      -this.size * 0.12,
      this.size * 0.12,
      this.size * 0.18
    );


    // Stem
    stroke(
      80,
      50,
      25
    );


    strokeWeight(3);


    line(
      0,
      -this.size * 0.34,

      this.size * 0.04,
      -this.size * 0.50
    );


    // Leaf
    noStroke();


    fill(
      30,
      120,
      40
    );


    ellipse(
      this.size * 0.13,
      -this.size * 0.43,

      this.size * 0.26,
      this.size * 0.12
    );


    pop();
  }


  // =========================================================
  // HIT DETECTION
  // =========================================================

  contains(
    px,
    py
  ) {

    if (
      this.returning ||
      this.successAnimating ||
      this.collected
    ) {

      return false;

    }


    let d =
      dist(
        px,
        py,
        this.x,
        this.y
      );


    // Generous invisible hit target.
    return (

      d <
      this.size * 0.85

    );
  }


  // =========================================================
  // START DRAG
  // =========================================================

  startDrag(
    px,
    py
  ) {

    if (
      this.returning ||
      this.successAnimating
    ) {

      return;

    }


    this.dragging =
      true;


    this.offsetX =

      this.x -
      px;


    this.offsetY =

      this.y -
      py;
  }


  // =========================================================
  // DRAG
  // =========================================================

  drag(
    px,
    py
  ) {

    if (!this.dragging) {

      return;

    }


    this.x =

      px +
      this.offsetX;


    this.y =

      py +
      this.offsetY;
  }


  // =========================================================
  // RELEASE
  // =========================================================

  release() {

    if (!this.dragging) {

      return;

    }


    this.dragging =
      false;


    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    if (
      isInsideBasket(
        this.x,
        this.y
      )
    ) {

      collectedCount++;


      this.successAnimating =
        true;


      this.animationProgress =
        0;


      showFeedback(
        "Great job! Apple collected!",
        "success"
      );


      playSuccessSound();


      if (
        navigator.vibrate
      ) {

        navigator.vibrate(80);

      }


      checkGameComplete();
    }


    // --------------------------------------------------------
    // INCORRECT DROP
    // --------------------------------------------------------

    else {

      unsuccessfulDrops++;


      this.returnStartX =
        this.x;


      this.returnStartY =
        this.y;


      this.returning =
        true;


      this.animationProgress =
        0;


      showFeedback(
        "Almost! Try dropping it inside the basket.",
        "retry"
      );


      playRetrySound();
    }
  }
}


// ============================================================
// BASKET COLLISION
// ============================================================

function isInsideBasket(
  x,
  y
) {

  let horizontalPadding =
    basket.w * 0.08;


  let verticalPadding =
    basket.h * 0.15;


  let left =

    basket.x -
    basket.w / 2 -
    horizontalPadding;


  let right =

    basket.x +
    basket.w / 2 +
    horizontalPadding;


  let top =

    basket.y -
    basket.h / 2 -
    verticalPadding;


  let bottom =

    basket.y +
    basket.h / 2 +
    verticalPadding;


  return (

    x > left &&
    x < right &&

    y > top &&
    y < bottom

  );
}


// ============================================================
// FEEDBACK
// ============================================================

function showFeedback(
  message,
  type
) {

  feedbackMessage =
    message;


  feedbackType =
    type;


  feedbackTimer =
    100;
}


// ============================================================
// DRAW FEEDBACK
// ============================================================

function drawFeedback() {

  if (
    feedbackTimer <= 0
  ) {

    return;

  }


  feedbackTimer--;


  let boxW =
    min(
      width * 0.36,
      470
    );


  let boxH =
    52;


  let x =
    width / 2;


  let y =
    145;


  noStroke();


  if (
    feedbackType ===
    "success"
  ) {

    fill(
      225,
      245,
      228
    );

  }

  else {

    fill(
      255,
      235,
      225
    );

  }


  rect(
    x,
    y,
    boxW,
    boxH,
    15
  );


  if (
    feedbackType ===
    "success"
  ) {

    fill(
      35,
      110,
      50
    );

  }

  else {

    fill(
      160,
      55,
      35
    );

  }


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(17);


  text(
    feedbackMessage,
    x,
    y
  );
}


// ============================================================
// BUTTON HELPER
// ============================================================

function drawSmallControlButton(
  x,
  y,
  w,
  h,
  label,
  active
) {

  if (active) {

    if (highContrast) {

      fill(
        0,
        90,
        200
      );

    }

    else {

      fill(
        69,
        154,
        79
      );

    }

  }

  else {

    fill(245);

  }


  noStroke();


  rect(
    x,
    y,
    w,
    h,
    9
  );


  if (active) {

    fill(255);

  }

  else {

    fill(
      highContrast
        ? 15
        : 70
    );

  }


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(13);


  text(
    label,
    x,
    y
  );
}


// ============================================================
// SOUND BUTTON
// ============================================================

function drawSoundButton() {

  drawSmallControlButton(
    75,
    105,
    110,
    38,

    soundEnabled
      ? "Sound: ON"
      : "Sound: OFF",

    soundEnabled
  );
}


function pointInsideSoundButton(
  px,
  py
) {

  return pointInsideRectangle(
    px,
    py,
    75,
    105,
    110,
    38
  );
}


// ============================================================
// PAUSE BUTTON
// ============================================================

function drawPauseButton() {

  drawSmallControlButton(
    195,
    105,
    105,
    38,
    "Pause",
    false
  );
}


function pointInsidePauseButton(
  px,
  py
) {

  return pointInsideRectangle(
    px,
    py,
    195,
    105,
    105,
    38
  );
}


// ============================================================
// HELP BUTTON
// ============================================================

function drawHelpButton() {

  drawSmallControlButton(
    310,
    105,
    110,
    38,
    "? Instructions",
    false
  );
}


function pointInsideHelpButton(
  px,
  py
) {

  return pointInsideRectangle(
    px,
    py,
    310,
    105,
    110,
    38
  );
}


// ============================================================
// CONTRAST BUTTON
// ============================================================

function drawContrastButton() {

  drawSmallControlButton(
    435,
    105,
    125,
    38,

    highContrast
      ? "Contrast: ON"
      : "Contrast: OFF",

    highContrast
  );
}


function pointInsideContrastButton(
  px,
  py
) {

  return pointInsideRectangle(
    px,
    py,
    435,
    105,
    125,
    38
  );
}


// ============================================================
// BACK BUTTON
// ============================================================

function drawBackButton() {

  let x = 72;
  let y = 55;

  let w = 105;
  let h = 44;


  fill(235);

  noStroke();


  rect(
    x,
    y,
    w,
    h,
    10
  );


  fill(
    highContrast
      ? 15
      : 65
  );


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(15);


  text(
    "← Back",
    x,
    y
  );
}


function pointInsideBackButton(
  px,
  py
) {

  return pointInsideRectangle(
    px,
    py,
    72,
    55,
    105,
    44
  );
}


// ============================================================
// GENERIC RECTANGLE HIT DETECTION
// ============================================================

function pointInsideRectangle(
  px,
  py,
  x,
  y,
  w,
  h
) {

  return (

    px >
    x - w / 2 &&

    px <
    x + w / 2 &&

    py >
    y - h / 2 &&

    py <
    y + h / 2

  );
}


// ============================================================
// PAUSE OVERLAY
// ============================================================

function drawPauseOverlay() {

  drawOverlayBackground();


  let x =
    width / 2;


  let y =
    height / 2;


  let w =
    min(
      width * 0.48,
      520
    );


  let h =
    330;


  drawOverlayCard(
    x,
    y,
    w,
    h
  );


  fill(
    45,
    110,
    60
  );


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(34);


  text(
    "Exercise Paused",
    x,
    y - 90
  );


  fill(80);

  textStyle(NORMAL);

  textSize(17);


  text(
    "Take your time. Your progress is saved.",
    x,
    y - 42
  );


  drawOverlayButton(
    x,
    y + 35,
    220,
    55,
    "RESUME EXERCISE",
    true
  );


  drawOverlayButton(
    x,
    y + 105,
    220,
    50,
    "EXIT EXERCISE",
    false
  );
}


// ============================================================
// HELP OVERLAY
// ============================================================

function drawHelpOverlay() {

  drawOverlayBackground();


  let x =
    width / 2;


  let y =
    height / 2;


  let w =
    min(
      width * 0.58,
      650
    );


  let h =
    440;


  drawOverlayCard(
    x,
    y,
    w,
    h
  );


  fill(
    45,
    110,
    60
  );


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(32);


  text(
    "How to Play",
    x,
    y - 165
  );


  fill(60);

  textAlign(
    LEFT,
    TOP
  );


  textStyle(NORMAL);

  textSize(17);


  let textX =
    x - w * 0.36;


  let textY =
    y - 105;


  let spacing =
    43;


  text(
    "1. Select an apple from the tree.",
    textX,
    textY
  );


  text(
    "2. Keep the mouse button or your finger pressed.",
    textX,
    textY + spacing
  );


  text(
    "3. Slowly move the apple toward the basket.",
    textX,
    textY + spacing * 2
  );


  text(
    "4. The basket will highlight when you reach it.",
    textX,
    textY + spacing * 3
  );


  text(
    "5. Release the apple to place it in the basket.",
    textX,
    textY + spacing * 4
  );


  drawOverlayButton(
    x,
    y + 155,
    180,
    52,
    "CONTINUE",
    true
  );
}


// ============================================================
// EXIT CONFIRMATION
// ============================================================

function drawExitConfirmation() {

  drawOverlayBackground();


  let x =
    width / 2;


  let y =
    height / 2;


  let w =
    min(
      width * 0.50,
      540
    );


  let h =
    330;


  drawOverlayCard(
    x,
    y,
    w,
    h
  );


  fill(
    45,
    110,
    60
  );


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(30);


  text(
    "Leave Exercise?",
    x,
    y - 90
  );


  fill(70);

  textStyle(NORMAL);

  textSize(17);


  text(
    "Your current progress will be lost.",
    x,
    y - 40
  );


  drawOverlayButton(
    x - 105,
    y + 70,
    180,
    55,
    "KEEP PLAYING",
    true
  );


  drawOverlayButton(
    x + 105,
    y + 70,
    180,
    55,
    "LEAVE",
    false
  );
}


// ============================================================
// OVERLAY BACKGROUND
// ============================================================

function drawOverlayBackground() {

  noStroke();


  fill(
    0,
    0,
    0,
    110
  );


  rect(
    width / 2,
    height / 2,
    width,
    height
  );
}


// ============================================================
// OVERLAY CARD
// ============================================================

function drawOverlayCard(
  x,
  y,
  w,
  h
) {

  noStroke();


  fill(
    0,
    0,
    0,
    35
  );


  rect(
    x + 6,
    y + 6,
    w,
    h,
    22
  );


  fill(255);


  rect(
    x,
    y,
    w,
    h,
    22
  );
}


// ============================================================
// OVERLAY BUTTON
// ============================================================

function drawOverlayButton(
  x,
  y,
  w,
  h,
  label,
  primary
) {

  if (primary) {

    if (highContrast) {

      fill(
        0,
        90,
        200
      );

    }

    else {

      fill(
        69,
        154,
        79
      );

    }


    noStroke();

  }

  else {

    fill(
      245,
      250,
      245
    );


    stroke(
      69,
      154,
      79
    );


    strokeWeight(2);

  }


  rect(
    x,
    y,
    w,
    h,
    12
  );


  noStroke();


  if (primary) {

    fill(255);

  }

  else {

    fill(
      55,
      125,
      67
    );

  }


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(15);


  text(
    label,
    x,
    y
  );
}


// ============================================================
// INSTRUCTIONS SCREEN
// ============================================================

function drawInstructionsScreen() {

  drawGround();


  let panelW =
    min(
      width * 0.68,
      760
    );


  let panelH =
    min(
      height * 0.80,
      670
    );


  let x =
    width / 2;


  let y =
    height / 2;


  // Shadow
  noStroke();


  fill(
    0,
    0,
    0,
    30
  );


  rect(
    x + 6,
    y + 6,
    panelW,
    panelH,
    25
  );


  // Card
  fill(255);


  rect(
    x,
    y,
    panelW,
    panelH,
    25
  );


  // =========================================================
  // TITLE
  // =========================================================

  fill(
    48,
    100,
    60
  );


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);


  textSize(
    constrain(
      width * 0.03,
      30,
      42
    )
  );


  text(
    "Harvest the Fruit",
    x,
    y - panelH * 0.38
  );


  fill(90);

  textStyle(NORMAL);

  textSize(18);


  text(
    "Fine Motor Skills Exercise",
    x,
    y - panelH * 0.30
  );


  // =========================================================
  // INSTRUCTIONS
  // =========================================================

  fill(55);


  textAlign(
    LEFT,
    TOP
  );


  textStyle(NORMAL);


  textSize(
    constrain(
      width * 0.014,
      15,
      19
    )
  );


  let textX =
    x -
    panelW * 0.36;


  let textY =
    y -
    panelH * 0.20;


  let spacing =
    36;


  text(
    "1. Select an apple from the tree.",
    textX,
    textY
  );


  text(
    "2. Keep the mouse button or your finger pressed.",
    textX,
    textY + spacing
  );


  text(
    "3. Slowly drag the apple toward the basket.",
    textX,
    textY + spacing * 2
  );


  text(
    "4. Release the apple when the basket highlights.",
    textX,
    textY + spacing * 3
  );


  text(
    "5. Collect all the apples to complete the exercise.",
    textX,
    textY + spacing * 4
  );


  drawDifficultySelection();

  drawStartButton();
}


// ============================================================
// DIFFICULTY SELECTION
// ============================================================

function drawDifficultySelection() {

  let centerX =
    width / 2;


  let y =
    height * 0.665;


  fill(65);


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(16);


  text(
    "Choose Difficulty",
    centerX,
    y - 48
  );


  drawDifficultyButton(
    centerX - 145,
    y,
    "easy",
    "Easy",
    "6 large apples"
  );


  drawDifficultyButton(
    centerX,
    y,
    "medium",
    "Medium",
    "8 medium apples"
  );


  drawDifficultyButton(
    centerX + 145,
    y,
    "hard",
    "Hard",
    "12 small apples"
  );
}


// ============================================================
// DIFFICULTY BUTTON
// ============================================================

function drawDifficultyButton(
  x,
  y,
  value,
  label,
  description
) {

  let w =
    125;


  let h =
    48;


  if (
    difficulty === value
  ) {

    fill(
      65,
      145,
      75
    );

  }

  else {

    fill(235);

  }


  noStroke();


  rect(
    x,
    y,
    w,
    h,
    10
  );


  if (
    difficulty === value
  ) {

    fill(255);

  }

  else {

    fill(70);

  }


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(14);


  text(
    label,
    x,
    y
  );


  fill(85);


  textStyle(NORMAL);

  textSize(12);


  text(
    description,
    x,
    y + 40
  );
}


// ============================================================
// DIFFICULTY HIT DETECTION
// ============================================================

function pointInsideDifficulty(
  px,
  py,
  value
) {

  let centerX =
    width / 2;


  let y =
    height * 0.665;


  let x;


  if (value === "easy") {

    x =
      centerX - 145;

  }

  else if (value === "hard") {

    x =
      centerX + 145;

  }

  else {

    x =
      centerX;

  }


  return pointInsideRectangle(
    px,
    py,
    x,
    y,
    125,
    48
  );
}


// ============================================================
// START BUTTON
// ============================================================

function drawStartButton() {

  let x =
    width / 2;


  let y =
    height * 0.81;


  let w =
    210;


  let h =
    58;


  fill(
    69,
    154,
    79
  );


  noStroke();


  rect(
    x,
    y,
    w,
    h,
    14
  );


  fill(255);


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(19);


  text(
    "START EXERCISE",
    x,
    y
  );
}


function pointInsideStartButton(
  px,
  py
) {

  return pointInsideRectangle(
    px,
    py,
    width / 2,
    height * 0.81,
    210,
    58
  );
}


// ============================================================
// START GAME
// ============================================================

function startGame() {

  createGame();


  gameState =
    "playing";


  overlayState =
    "none";


  initializeAudio();
}


// ============================================================
// CHECK COMPLETE
// ============================================================

function checkGameComplete() {

  if (
    collectedCount >=
    getTotalApples()
  ) {

    playCompletionSound();


    setTimeout(

      function () {

        if (
          gameState ===
          "playing"
        ) {

          gameState =
            "complete";


          overlayState =
            "none";

        }

      },

      700

    );
  }
}


// ============================================================
// COMPLETION SCREEN
// ============================================================

function drawCompletionScreen() {

  drawGround();


  let panelW =
    min(
      width * 0.60,
      650
    );


  let panelH =
    min(
      height * 0.66,
      530
    );


  let x =
    width / 2;


  let y =
    height / 2;


  noStroke();


  fill(
    0,
    0,
    0,
    30
  );


  rect(
    x + 6,
    y + 6,
    panelW,
    panelH,
    25
  );


  fill(255);


  rect(
    x,
    y,
    panelW,
    panelH,
    25
  );


  // =========================================================
  // CHECKMARK
  // =========================================================

  fill(
    72,
    160,
    80
  );


  ellipse(
    x,
    y - panelH * 0.30,
    85,
    85
  );


  fill(255);


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(45);


  text(
    "✓",
    x,
    y - panelH * 0.30
  );


  // =========================================================
  // MESSAGE
  // =========================================================

  fill(
    45,
    110,
    60
  );


  textSize(38);


  text(
    "Great Job!",
    x,
    y - panelH * 0.08
  );


  let total =
    getTotalApples();


  fill(70);


  textStyle(NORMAL);

  textSize(20);


  text(
    "You harvested all " +
    total +
    " apples!",

    x,
    y + panelH * 0.06
  );


  textSize(16);


  fill(90);


  text(
    "You completed the " +
    capitalize(difficulty) +
    " difficulty.",

    x,
    y + panelH * 0.14
  );


  // Rehabilitation-focused feedback
  fill(
    55,
    125,
    67
  );


  textStyle(BOLD);

  textSize(17);


  text(
    "Great work using controlled hand movements!",
    x,
    y + panelH * 0.23
  );


  drawCompletionButtons();
}


// ============================================================
// COMPLETION BUTTONS
// ============================================================

function drawCompletionButtons() {

  let y =
    height * 0.72;


  let buttonW =
    200;


  let buttonH =
    55;


  let gap =
    15;


  let playX =

    width / 2 -

    buttonW / 2 -

    gap;


  fill(
    69,
    154,
    79
  );


  noStroke();


  rect(
    playX,
    y,
    buttonW,
    buttonH,
    14
  );


  fill(255);


  textAlign(
    CENTER,
    CENTER
  );


  textStyle(BOLD);

  textSize(16);


  text(
    "PLAY AGAIN",
    playX,
    y
  );


  // ----------------------------------------------------------
  // RETURN
  // ----------------------------------------------------------

  let returnX =

    width / 2 +

    buttonW / 2 +

    gap;


  fill(
    245,
    250,
    245
  );


  stroke(
    69,
    154,
    79
  );


  strokeWeight(2);


  rect(
    returnX,
    y,
    buttonW,
    buttonH,
    14
  );


  noStroke();


  fill(
    55,
    125,
    67
  );


  text(
    "RETURN TO GARDEN",
    returnX,
    y
  );
}


// ============================================================
// COMPLETION BUTTON HIT DETECTION
// ============================================================

function pointInsidePlayAgainButton(
  px,
  py
) {

  let buttonW =
    200;


  let gap =
    15;


  let x =

    width / 2 -

    buttonW / 2 -

    gap;


  return pointInsideRectangle(
    px,
    py,
    x,
    height * 0.72,
    200,
    55
  );
}


function pointInsideReturnButton(
  px,
  py
) {

  let buttonW =
    200;


  let gap =
    15;


  let x =

    width / 2 +

    buttonW / 2 +

    gap;


  return pointInsideRectangle(
    px,
    py,
    x,
    height * 0.72,
    200,
    55
  );
}


// ============================================================
// AUDIO
// ============================================================

function initializeAudio() {

  if (
    audioContext === null
  ) {

    try {

      audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

    }

    catch (error) {

      return;

    }
  }


  if (
    audioContext &&
    audioContext.state ===
    "suspended"
  ) {

    audioContext.resume();

  }
}


function playTone(
  frequency,
  duration,
  volume
) {

  if (!soundEnabled) {
    return;
  }


  try {

    initializeAudio();


    if (!audioContext) {
      return;
    }


    let oscillator =
      audioContext.createOscillator();


    let gain =
      audioContext.createGain();


    oscillator.connect(gain);


    gain.connect(
      audioContext.destination
    );


    oscillator.type =
      "sine";


    oscillator.frequency.value =
      frequency;


    gain.gain.setValueAtTime(
      volume,
      audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime +
      duration
    );


    oscillator.start();


    oscillator.stop(
      audioContext.currentTime +
      duration
    );

  }

  catch (error) {

    // Continue without audio.

  }
}


function playSuccessSound() {

  if (!soundEnabled) {
    return;
  }


  playTone(
    523,
    0.15,
    0.08
  );


  setTimeout(

    function () {

      playTone(
        659,
        0.18,
        0.08
      );

    },

    100

  );
}


function playRetrySound() {

  if (!soundEnabled) {
    return;
  }


  playTone(
    280,
    0.15,
    0.04
  );
}


function playCompletionSound() {

  if (!soundEnabled) {
    return;
  }


  playTone(
    523,
    0.15,
    0.07
  );


  setTimeout(

    function () {

      playTone(
        659,
        0.15,
        0.07
      );

    },

    120

  );


  setTimeout(

    function () {

      playTone(
        784,
        0.25,
        0.08
      );

    },

    240

  );
}


// ============================================================
// MOUSE CONTROLS
// ============================================================

function mousePressed() {

  // =========================================================
  // OVERLAYS FIRST
  // =========================================================

  if (overlayState !== "none") {

    handleOverlayClick(
      mouseX,
      mouseY
    );

    return;
  }


  // =========================================================
  // INSTRUCTIONS
  // =========================================================

  if (
    gameState ===
    "instructions"
  ) {

    if (
      pointInsideDifficulty(
        mouseX,
        mouseY,
        "easy"
      )
    ) {

      difficulty =
        "easy";

      createGame();

      return;
    }


    if (
      pointInsideDifficulty(
        mouseX,
        mouseY,
        "medium"
      )
    ) {

      difficulty =
        "medium";

      createGame();

      return;
    }


    if (
      pointInsideDifficulty(
        mouseX,
        mouseY,
        "hard"
      )
    ) {

      difficulty =
        "hard";

      createGame();

      return;
    }


    if (
      pointInsideStartButton(
        mouseX,
        mouseY
      )
    ) {

      startGame();

    }


    return;
  }


  // =========================================================
  // COMPLETE
  // =========================================================

  if (
    gameState ===
    "complete"
  ) {

    if (
      pointInsidePlayAgainButton(
        mouseX,
        mouseY
      )
    ) {

      restartGame();

      return;
    }


    if (
      pointInsideReturnButton(
        mouseX,
        mouseY
      )
    ) {

      returnToGarden();

      return;
    }


    return;
  }


  // =========================================================
  // PLAYING
  // =========================================================

  if (
    gameState !==
    "playing"
  ) {

    return;
  }


  // Back
  if (
    pointInsideBackButton(
      mouseX,
      mouseY
    )
  ) {

    requestExit();

    return;
  }


  // Sound
  if (
    pointInsideSoundButton(
      mouseX,
      mouseY
    )
  ) {

    soundEnabled =
      !soundEnabled;

    return;
  }


  // Pause
  if (
    pointInsidePauseButton(
      mouseX,
      mouseY
    )
  ) {

    overlayState =
      "paused";

    return;
  }


  // Help
  if (
    pointInsideHelpButton(
      mouseX,
      mouseY
    )
  ) {

    overlayState =
      "help";

    return;
  }


  // Contrast
  if (
    pointInsideContrastButton(
      mouseX,
      mouseY
    )
  ) {

    highContrast =
      !highContrast;

    return;
  }


  // ----------------------------------------------------------
  // APPLE SELECTION
  // ----------------------------------------------------------

  for (
    let i =
      apples.length - 1;

    i >= 0;

    i--
  ) {

    let apple =
      apples[i];


    if (
      apple.contains(
        mouseX,
        mouseY
      )
    ) {

      selectedApple =
        apple;


      apple.startDrag(
        mouseX,
        mouseY
      );


      break;
    }
  }
}


// ============================================================
// MOUSE DRAGGED
// ============================================================

function mouseDragged() {

  if (
    gameState ===
    "playing" &&

    overlayState ===
    "none" &&

    selectedApple !==
    null
  ) {

    selectedApple.drag(
      mouseX,
      mouseY
    );

  }
}


// ============================================================
// MOUSE RELEASED
// ============================================================

function mouseReleased() {

  if (
    gameState ===
    "playing" &&

    overlayState ===
    "none" &&

    selectedApple !==
    null
  ) {

    selectedApple.release();


    selectedApple =
      null;

  }
}


// ============================================================
// TOUCH CONTROLS
// ============================================================

function touchStarted() {

  if (
    touches.length === 0
  ) {

    return false;

  }


  let tx =
    touches[0].x;


  let ty =
    touches[0].y;


  // Overlay
  if (
    overlayState !==
    "none"
  ) {

    handleOverlayClick(
      tx,
      ty
    );

    return false;
  }


  // Instructions
  if (
    gameState ===
    "instructions"
  ) {

    if (
      pointInsideDifficulty(
        tx,
        ty,
        "easy"
      )
    ) {

      difficulty =
        "easy";

      createGame();

      return false;
    }


    if (
      pointInsideDifficulty(
        tx,
        ty,
        "medium"
      )
    ) {

      difficulty =
        "medium";

      createGame();

      return false;
    }


    if (
      pointInsideDifficulty(
        tx,
        ty,
        "hard"
      )
    ) {

      difficulty =
        "hard";

      createGame();

      return false;
    }


    if (
      pointInsideStartButton(
        tx,
        ty
      )
    ) {

      startGame();

    }


    return false;
  }


  // Complete
  if (
    gameState ===
    "complete"
  ) {

    if (
      pointInsidePlayAgainButton(
        tx,
        ty
      )
    ) {

      restartGame();

      return false;
    }


    if (
      pointInsideReturnButton(
        tx,
        ty
      )
    ) {

      returnToGarden();

      return false;
    }


    return false;
  }


  // Playing
  if (
    gameState ===
    "playing"
  ) {

    if (
      pointInsideBackButton(
        tx,
        ty
      )
    ) {

      requestExit();

      return false;
    }


    if (
      pointInsideSoundButton(
        tx,
        ty
      )
    ) {

      soundEnabled =
        !soundEnabled;

      return false;
    }


    if (
      pointInsidePauseButton(
        tx,
        ty
      )
    ) {

      overlayState =
        "paused";

      return false;
    }


    if (
      pointInsideHelpButton(
        tx,
        ty
      )
    ) {

      overlayState =
        "help";

      return false;
    }


    if (
      pointInsideContrastButton(
        tx,
        ty
      )
    ) {

      highContrast =
        !highContrast;

      return false;
    }


    for (
      let i =
        apples.length - 1;

      i >= 0;

      i--
    ) {

      let apple =
        apples[i];


      if (
        apple.contains(
          tx,
          ty
        )
      ) {

        selectedApple =
          apple;


        apple.startDrag(
          tx,
          ty
        );


        break;
      }
    }
  }


  return false;
}


function touchMoved() {

  if (
    gameState ===
    "playing" &&

    overlayState ===
    "none" &&

    selectedApple !==
    null &&

    touches.length > 0
  ) {

    selectedApple.drag(
      touches[0].x,
      touches[0].y
    );

  }


  return false;
}


function touchEnded() {

  if (
    gameState ===
    "playing" &&

    overlayState ===
    "none" &&

    selectedApple !==
    null
  ) {

    selectedApple.release();


    selectedApple =
      null;

  }


  return false;
}


// ============================================================
// OVERLAY CLICK HANDLING
// ============================================================

function handleOverlayClick(
  px,
  py
) {

  // =========================================================
  // PAUSED
  // =========================================================

  if (
    overlayState ===
    "paused"
  ) {

    // Resume
    if (
      pointInsideRectangle(
        px,
        py,

        width / 2,
        height / 2 + 35,

        220,
        55
      )
    ) {

      overlayState =
        "none";

      return;
    }


    // Exit
    if (
      pointInsideRectangle(
        px,
        py,

        width / 2,
        height / 2 + 105,

        220,
        50
      )
    ) {

      overlayState =
        "confirmExit";

      return;
    }
  }


  // =========================================================
  // HELP
  // =========================================================

  else if (
    overlayState ===
    "help"
  ) {

    if (
      pointInsideRectangle(
        px,
        py,

        width / 2,
        height / 2 + 155,

        180,
        52
      )
    ) {

      overlayState =
        "none";

      return;
    }
  }


  // =========================================================
  // CONFIRM EXIT
  // =========================================================

  else if (
    overlayState ===
    "confirmExit"
  ) {

    // Keep playing
    if (
      pointInsideRectangle(
        px,
        py,

        width / 2 - 105,
        height / 2 + 70,

        180,
        55
      )
    ) {

      overlayState =
        "none";

      return;
    }


    // Leave
    if (
      pointInsideRectangle(
        px,
        py,

        width / 2 + 105,
        height / 2 + 70,

        180,
        55
      )
    ) {

      returnToGarden();

      return;
    }
  }
}


// ============================================================
// REQUEST EXIT
// ============================================================

function requestExit() {

  // If no progress has been made,
  // no warning is necessary.
  if (
    collectedCount === 0 &&
    unsuccessfulDrops === 0
  ) {

    returnToGarden();

    return;
  }


  overlayState =
    "confirmExit";
}


// ============================================================
// RESTART
// ============================================================

function restartGame() {

  createGame();


  gameState =
    "playing";


  overlayState =
    "none";
}


// ============================================================
// RETURN TO GARDEN
// ============================================================

function returnToGarden() {

  /*
    TEMPORARY:

    Until your team's Garden/Home screen is combined
    with your exercise, this returns to this exercise's
    setup screen.

    Later, replace this with your team's navigation.

    Example:

        currentScreen = "garden";
  */


  createGame();


  gameState =
    "instructions";


  overlayState =
    "none";
}


// ============================================================
// CAPITALIZE
// ============================================================

function capitalize(word) {

  return (

    word
      .charAt(0)
      .toUpperCase() +

    word.slice(1)

  );
}


// ============================================================
// WINDOW RESIZE
// ============================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );


  /*
    If the user resizes before starting,
    rebuild everything normally.

    During an active exercise we also rebuild the
    layout because all positions are responsive.
  */

  createGame();
}