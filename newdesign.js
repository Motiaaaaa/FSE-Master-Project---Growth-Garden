// =====================================================
// TAP THE FLOWER
// RESPONSIVE FULL-SCREEN VERSION
// =====================================================


// =====================================================
// DESIGN SIZE
// Everything is designed at 1200 x 700 and then
// automatically scaled to fit the user's screen.
// =====================================================

const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 700;

let gameScale = 1;
let offsetX = 0;
let offsetY = 0;


// =====================================================
// GAME VARIABLES
// =====================================================

let screen = "home";

let selectedTheme = "Fall";
let difficulty = "Easy";

let flowers = [];

let score = 0;
let earlyClicks = 0;
let missedClicks = 0;
let wiltedFlowers = 0;

let reactionTime = 0;
let bestReactionTime = 0;
let totalReactionTime = 0;

let message = "";

let gameLength = 45;
let startTime = 0;

let maxFlowers = 2;
let growthSpeed = 0.15;

let minSpawnTime = 2500;
let maxSpawnTime = 4000;

let nextFlowerTime = 0;

let wiltTime = 4000;
let wiltDisplayTime = 1000;

let minimumFlowerDistance = 190;


// Pause
let gamePaused = false;
let pauseStartTime = 0;


// =====================================================
// SETUP
// =====================================================

function setup() {

    createCanvas(
        windowWidth,
        windowHeight
    );

    textFont("Arial");

    calculateGameScale();
}


// =====================================================
// WINDOW RESIZE
// =====================================================

function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );

    calculateGameScale();
}


// =====================================================
// CALCULATE RESPONSIVE SCALE
// =====================================================

function calculateGameScale() {

    let scaleX =
        width / DESIGN_WIDTH;

    let scaleY =
        height / DESIGN_HEIGHT;


    // Keep correct proportions
    gameScale =
        min(
            scaleX,
            scaleY
        );


    // Center the game
    offsetX =
        (
            width -
            DESIGN_WIDTH *
            gameScale
        )
        / 2;


    offsetY =
        (
            height -
            DESIGN_HEIGHT *
            gameScale
        )
        / 2;
}


// =====================================================
// CONVERT REAL MOUSE POSITION TO GAME POSITION
// =====================================================

function getGameMouseX() {

    return (
        mouseX -
        offsetX
    )
    / gameScale;
}


function getGameMouseY() {

    return (
        mouseY -
        offsetY
    )
    / gameScale;
}


// =====================================================
// DRAW
// =====================================================

function draw() {

    // Fill unused screen space
    background(
        190,
        225,
        245
    );


    push();


    translate(
        offsetX,
        offsetY
    );


    scale(
        gameScale
    );


    // =================================================
    // CURRENT SCREEN
    // =================================================

    if (
        screen ==
        "home"
    ) {

        drawHomeScreen();
    }


    else if (
        screen ==
        "setup"
    ) {

        drawSetupScreen();
    }


    else if (
        screen ==
        "game"
    ) {

        drawGame();
    }


    else if (
        screen ==
        "results"
    ) {

        drawResultsScreen();
    }


    pop();
}


// =====================================================
// BASIC BACKGROUND
// =====================================================

function drawBasicBackground() {

    noStroke();


    // Sky
    fill(
        190,
        225,
        245
    );


    rect(
        0,
        0,
        DESIGN_WIDTH,
        DESIGN_HEIGHT
    );


    // Light grass
    fill(
        165,
        215,
        85
    );


    rect(
        0,
        590,
        DESIGN_WIDTH,
        45
    );


    // Dark grass
    fill(
        125,
        195,
        65
    );


    rect(
        0,
        635,
        DESIGN_WIDTH,
        65
    );
}


// =====================================================
// HOME SCREEN
// =====================================================

function drawHomeScreen() {

    drawBasicBackground();


    drawCard(
        300,
        55,
        600,
        560
    );


    // Title
    fill(
        45,
        105,
        60
    );


    noStroke();

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(48);


    text(
        "Tap the Flower",
        DESIGN_WIDTH / 2,
        130
    );


    // Subtitle
    fill(95);

    textStyle(NORMAL);

    textSize(22);


    text(
        "Reaction and Timing Exercise",
        DESIGN_WIDTH / 2,
        175
    );


    // Flower
    drawMenuFlower(
        DESIGN_WIDTH / 2,
        285,
        100
    );


    // Instructions
    fill(65);

    textSize(20);


    text(
        "Watch the garden and wait for each flower to bloom.",
        DESIGN_WIDTH / 2,
        395
    );


    text(
        "Tap the flower when TAP! appears before it wilts.",
        DESIGN_WIDTH / 2,
        430
    );


    text(
        "Practice your reaction time, timing, and accuracy.",
        DESIGN_WIDTH / 2,
        465
    );


    // Start button
    drawGreenButton(
        455,
        510,
        290,
        70,
        "START EXERCISE"
    );


    textAlign(LEFT);
}


// =====================================================
// SETUP SCREEN
// =====================================================

function drawSetupScreen() {

    drawBasicBackground();


    // Back
    drawGrayButton(
        25,
        25,
        110,
        50,
        "← Back"
    );


    // Main card
    drawCard(
        220,
        25,
        760,
        650
    );


    // Title
    fill(
        45,
        105,
        60
    );


    noStroke();

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(44);


    text(
        "Tap the Flower",
        DESIGN_WIDTH / 2,
        90
    );


    fill(95);

    textStyle(NORMAL);

    textSize(21);


    text(
        "Reaction and Timing Exercise",
        DESIGN_WIDTH / 2,
        130
    );


    // =================================================
    // INSTRUCTIONS
    // =================================================

    fill(60);

    textAlign(LEFT);

    textSize(18);


    text(
        "1. Watch the garden for flowers.",
        330,
        180
    );


    text(
        "2. Wait until a flower fully blooms.",
        330,
        215
    );


    text(
        "3. Tap the flower when TAP! appears.",
        330,
        250
    );


    text(
        "4. Tap quickly before the flower wilts.",
        330,
        285
    );


    text(
        "5. Try to improve your reaction time and accuracy.",
        330,
        320
    );


    // =================================================
    // THEMES
    // =================================================

    textAlign(CENTER);

    fill(65);

    textStyle(BOLD);

    textSize(19);


    text(
        "Choose Theme",
        DESIGN_WIDTH / 2,
        365
    );


    drawChoiceButton(
        310,
        390,
        130,
        48,
        "Fall",
        selectedTheme == "Fall"
    );


    drawChoiceButton(
        460,
        390,
        130,
        48,
        "Space",
        selectedTheme == "Space"
    );


    drawChoiceButton(
        610,
        390,
        130,
        48,
        "Winter",
        selectedTheme == "Winter"
    );


    drawChoiceButton(
        760,
        390,
        130,
        48,
        "Cherry",
        selectedTheme == "Cherry"
    );


    // Theme descriptions
    fill(100);

    textStyle(NORMAL);

    textSize(13);


    text(
        "Autumn",
        375,
        460
    );


    text(
        "Galaxy",
        525,
        460
    );


    text(
        "Snow",
        675,
        460
    );


    text(
        "Spring",
        825,
        460
    );


    // =================================================
    // DIFFICULTY
    // =================================================

    fill(65);

    textStyle(BOLD);

    textSize(19);


    text(
        "Choose Difficulty",
        DESIGN_WIDTH / 2,
        505
    );


    drawChoiceButton(
        365,
        530,
        140,
        48,
        "Easy",
        difficulty == "Easy"
    );


    drawChoiceButton(
        530,
        530,
        140,
        48,
        "Medium",
        difficulty == "Medium"
    );


    drawChoiceButton(
        695,
        530,
        140,
        48,
        "Hard",
        difficulty == "Hard"
    );


    // Descriptions
    fill(95);

    textStyle(NORMAL);

    textSize(13);


    text(
        "2 flowers • 4 sec",
        435,
        600
    );


    text(
        "3 flowers • 3 sec",
        600,
        600
    );


    text(
        "5 flowers • 2 sec",
        765,
        600
    );


    // Start
    drawGreenButton(
        485,
        620,
        230,
        50,
        "START EXERCISE"
    );


    textAlign(LEFT);
}


// =====================================================
// GAME SCREEN
// =====================================================

function drawGame() {

    drawGameBackground();


    // =================================================
    // HEADER
    // =================================================

    fill(255);

    noStroke();


    rect(
        0,
        0,
        DESIGN_WIDTH,
        115
    );


    fill(
        45,
        105,
        60
    );


    textAlign(CENTER);

    textStyle(BOLD);

    textSize(36);


    text(
        "Tap the Flower",
        DESIGN_WIDTH / 2,
        45
    );


    fill(85);

    textStyle(NORMAL);

    textSize(17);


    text(
        "Wait for a full bloom, then tap before the flower wilts.",
        DESIGN_WIDTH / 2,
        78
    );


    // Back
    drawGrayButton(
        20,
        25,
        100,
        50,
        "← Back"
    );


    // Pause
    drawGrayButton(
        135,
        25,
        100,
        50,
        "Pause"
    );


    // Home
    drawGrayButton(
        250,
        25,
        100,
        50,
        "Home"
    );


    // =================================================
    // TIMER
    // =================================================

    let timePassed =
        (
            millis() -
            startTime
        )
        / 1000;


    let timeLeft =
        gameLength -
        timePassed;


    if (
        timeLeft <= 0
    ) {

        screen =
            "results";

        return;
    }


    // =================================================
    // SPAWN FLOWERS
    // =================================================

    if (
        !gamePaused &&
        millis() >= nextFlowerTime &&
        flowers.length < maxFlowers
    ) {

        createNewFlower();

        scheduleNextFlower();
    }


    // =================================================
    // UPDATE FLOWERS
    // =================================================

    for (
        let i =
            flowers.length - 1;

        i >= 0;

        i--
    ) {

        let flower =
            flowers[i];


        if (
            !gamePaused
        ) {


            // Grow
            if (
                !flower.hasWilted &&
                flower.size <
                flower.maxSize
            ) {

                flower.size +=
                    flower.speed;
            }


            // Bloom
            if (
                flower.size >=
                flower.maxSize &&
                !flower.hasBloomed
            ) {

                flower.size =
                    flower.maxSize;

                flower.hasBloomed =
                    true;

                flower.bloomTime =
                    millis();
            }


            // Wilt
            if (
                flower.hasBloomed &&
                !flower.hasWilted &&
                millis() -
                flower.bloomTime >=
                wiltTime
            ) {

                flower.hasWilted =
                    true;

                flower.wiltedAt =
                    millis();

                wiltedFlowers++;


                message =
                    "A flower wilted. Watch for TAP!";
            }


            // Remove wilted
            if (
                flower.hasWilted &&
                millis() -
                flower.wiltedAt >=
                wiltDisplayTime
            ) {

                flowers.splice(
                    i,
                    1
                );


                nextFlowerTime =
                    min(
                        nextFlowerTime,
                        millis() + 400
                    );


                continue;
            }
        }


        // Draw
        if (
            flower.hasWilted
        ) {

            drawWiltedFlower(
                flower
            );
        }

        else {

            drawFlower(
                flower
            );
        }


        // TAP
        if (
            flower.hasBloomed &&
            !flower.hasWilted
        ) {

            fill(
                selectedTheme ==
                "Space"
                    ? "white"
                    : "black"
            );


            noStroke();

            textAlign(CENTER);

            textStyle(BOLD);

            textSize(20);


            text(
                "TAP!",
                flower.x,
                flower.y -
                flower.size -
                35
            );


            textStyle(NORMAL);
        }


        // Wilted label
        if (
            flower.hasWilted
        ) {

            fill(
                selectedTheme ==
                "Space"
                    ? "white"
                    : "black"
            );


            textAlign(CENTER);

            textStyle(BOLD);

            textSize(15);


            text(
                "WILTED",
                flower.x,
                flower.y -
                flower.size -
                25
            );


            textStyle(NORMAL);
        }
    }


    // =================================================
    // SCORE CARD
    // =================================================

    drawStatusCard(
        955,
        145,
        215,
        145
    );


    fill(65);

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(19);


    text(
        "Flowers Tapped",
        1062,
        180
    );


    fill(
        50,
        130,
        65
    );


    textSize(34);


    text(
        score,
        1062,
        225
    );


    // Progress
    fill(220);

    noStroke();


    rect(
        985,
        255,
        155,
        14,
        8
    );


    let progress =
        map(
            timeLeft,
            gameLength,
            0,
            155,
            0
        );


    fill(
        65,
        155,
        80
    );


    rect(
        985,
        255,
        progress,
        14,
        8
    );


    // =================================================
    // DIFFICULTY CARD
    // =================================================

    drawStatusCard(
        975,
        320,
        175,
        70
    );


    fill(65);

    textSize(16);


    text(
        "Difficulty: " +
        difficulty,
        1062,
        363
    );


    // =================================================
    // TIME CARD
    // =================================================

    drawStatusCard(
        975,
        415,
        175,
        100
    );


    fill(80);

    textStyle(NORMAL);

    textSize(15);


    text(
        "Time Remaining",
        1062,
        445
    );


    fill(
        50,
        130,
        65
    );


    textStyle(BOLD);

    textSize(30);


    text(
        ceil(timeLeft) +
        " sec",
        1062,
        485
    );


    // =================================================
    // STATS CARD
    // =================================================

    drawStatusCard(
        975,
        540,
        175,
        105
    );


    fill(70);

    textStyle(NORMAL);

    textSize(14);


    text(
        "Early Taps: " +
        earlyClicks,
        1062,
        570
    );


    text(
        "Wilted: " +
        wiltedFlowers,
        1062,
        598
    );


    if (
        reactionTime > 0
    ) {

        text(
            "Reaction: " +
            reactionTime.toFixed(2) +
            " sec",
            1062,
            626
        );
    }


    // Message
    fill(
        selectedTheme ==
        "Space"
            ? "white"
            : "black"
    );


    textAlign(CENTER);

    textStyle(BOLD);

    textSize(18);


    text(
        message,
        500,
        665
    );


    textStyle(NORMAL);


    if (
        gamePaused
    ) {

        drawPauseOverlay();
    }


    textAlign(LEFT);
}


// =====================================================
// GAME BACKGROUND
// =====================================================

function drawGameBackground() {


    // SPACE
    if (
        selectedTheme ==
        "Space"
    ) {

        fill(
            25,
            30,
            65
        );


        noStroke();


        rect(
            0,
            0,
            DESIGN_WIDTH,
            DESIGN_HEIGHT
        );


        fill("white");


        for (
            let i = 0;
            i < 35;
            i++
        ) {

            circle(
                (
                    i * 97
                )
                % DESIGN_WIDTH,

                130 +
                (
                    i * 53
                )
                % 300,

                3
            );
        }


        // Moon
        fill(
            235,
            235,
            215
        );


        circle(
            800,
            200,
            100
        );


        // Ground
        fill(
            75,
            70,
            100
        );


        rect(
            0,
            480,
            DESIGN_WIDTH,
            220
        );


        fill(
            90,
            85,
            115
        );


        ellipse(
            350,
            600,
            900,
            300
        );


        return;
    }


    // WINTER
    if (
        selectedTheme ==
        "Winter"
    ) {

        fill(
            195,
            225,
            245
        );


        noStroke();


        rect(
            0,
            0,
            DESIGN_WIDTH,
            DESIGN_HEIGHT
        );


        fill(
            245,
            250,
            255
        );


        rect(
            0,
            480,
            DESIGN_WIDTH,
            220
        );


        fill(
            225,
            240,
            250
        );


        ellipse(
            350,
            600,
            900,
            300
        );


        // Snow
        fill("white");


        for (
            let i = 0;
            i < 25;
            i++
        ) {

            let snowX =
                (
                    i * 91 +
                    frameCount * 0.25
                )
                % DESIGN_WIDTH;


            let snowY =
                120 +
                (
                    i * 57 +
                    frameCount * 0.45
                )
                % 350;


            circle(
                snowX,
                snowY,
                5
            );
        }


        return;
    }


    // CHERRY
    if (
        selectedTheme ==
        "Cherry"
    ) {

        fill(
            245,
            220,
            232
        );


        noStroke();


        rect(
            0,
            0,
            DESIGN_WIDTH,
            DESIGN_HEIGHT
        );


        fill(
            145,
            200,
            115
        );


        rect(
            0,
            480,
            DESIGN_WIDTH,
            220
        );


        fill(
            160,
            215,
            125
        );


        ellipse(
            350,
            600,
            900,
            300
        );


        drawCherryTree(
            90,
            510,
            1.1
        );


        drawCherryTree(
            830,
            510,
            1.2
        );


        // Petals
        fill(
            255,
            170,
            200
        );


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            let px =
                (
                    i * 97 +
                    frameCount * 0.25
                )
                % 950;


            let py =
                130 +
                (
                    i * 61 +
                    frameCount * 0.2
                )
                % 340;


            ellipse(
                px,
                py,
                8,
                5
            );
        }


        return;
    }


    // FALL
    fill(
        245,
        205,
        145
    );


    noStroke();


    rect(
        0,
        0,
        DESIGN_WIDTH,
        DESIGN_HEIGHT
    );


    fill(
        250,
        220,
        170
    );


    rect(
        0,
        115,
        DESIGN_WIDTH,
        365
    );


    // Sun
    fill(
        255,
        220,
        80
    );


    circle(
        800,
        200,
        110
    );


    // Ground
    fill(
        135,
        185,
        75
    );


    rect(
        0,
        480,
        DESIGN_WIDTH,
        220
    );


    fill(
        150,
        195,
        80
    );


    ellipse(
        350,
        600,
        900,
        300
    );


    drawFallTree(
        90,
        510,
        1.1
    );


    drawFallTree(
        830,
        510,
        1.2
    );
}


// =====================================================
// CREATE FLOWER
// =====================================================

function createNewFlower() {

    let flowerMaxSize;


    if (
        difficulty ==
        "Easy"
    ) {

        flowerMaxSize =
            90;
    }

    else if (
        difficulty ==
        "Medium"
    ) {

        flowerMaxSize =
            75;
    }

    else {

        flowerMaxSize =
            60;
    }


    let newX;

    let newY;

    let safe =
        false;

    let attempts =
        0;


    while (
        !safe &&
        attempts < 150
    ) {

        newX =
            random(
                120,
                870
            );


        newY =
            random(
                520,
                620
            );


        safe =
            true;


        for (
            let i = 0;
            i < flowers.length;
            i++
        ) {

            if (
                dist(
                    newX,
                    newY,
                    flowers[i].x,
                    flowers[i].y
                )
                <
                minimumFlowerDistance
            ) {

                safe =
                    false;

                break;
            }
        }


        attempts++;
    }


    if (
        !safe
    ) {

        return;
    }


    flowers.push({

        x:
            newX,

        y:
            newY,

        size:
            10,

        maxSize:
            flowerMaxSize,

        speed:
            growthSpeed,

        color:
            chooseFlowerColor(),

        hasBloomed:
            false,

        bloomTime:
            0,

        hasWilted:
            false,

        wiltedAt:
            0
    });
}


// =====================================================
// DRAW FLOWER
// =====================================================

function drawFlower(
    flower
) {

    let x =
        flower.x;

    let y =
        flower.y;

    let size =
        flower.size;


    stroke(
        50,
        125,
        55
    );


    strokeWeight(5);


    line(
        x,
        y,
        x,
        y - size
    );


    // Leaves
    if (
        size > 30
    ) {

        noStroke();


        fill(
            70,
            160,
            70
        );


        ellipse(
            x - 12,
            y - size / 2,
            26,
            12
        );


        ellipse(
            x + 12,
            y - size / 2 - 10,
            26,
            12
        );
    }


    // Bud
    if (
        !flower.hasBloomed
    ) {

        noStroke();


        fill(
            flower.color
        );


        circle(
            x,
            y - size,
            size / 3
        );
    }


    // Bloom
    else {

        noStroke();


        fill(
            flower.color
        );


        circle(
            x - size / 4,
            y - size,
            size / 2
        );


        circle(
            x + size / 4,
            y - size,
            size / 2
        );


        circle(
            x,
            y - size - size / 4,
            size / 2
        );


        circle(
            x,
            y - size + size / 4,
            size / 2
        );


        fill(
            255,
            220,
            55
        );


        circle(
            x,
            y - size,
            size / 2
        );
    }
}


// =====================================================
// WILTED FLOWER
// =====================================================

function drawWiltedFlower(
    flower
) {

    let x =
        flower.x;

    let y =
        flower.y;

    let size =
        flower.size;


    stroke(
        95,
        100,
        50
    );


    strokeWeight(5);


    line(
        x,
        y,
        x,
        y - size / 2
    );


    line(
        x,
        y - size / 2,
        x + 20,
        y - size + 15
    );


    noStroke();


    fill(
        125,
        85,
        50
    );


    ellipse(
        x + 15,
        y - size + 15,
        size / 2,
        size / 3
    );


    fill(
        85,
        60,
        35
    );


    circle(
        x + 20,
        y - size + 18,
        size / 3
    );
}


// =====================================================
// FLOWER COLORS
// =====================================================

function chooseFlowerColor() {

    if (
        selectedTheme ==
        "Fall"
    ) {

        return random([
            "orange",
            "red",
            "gold",
            "darkorange"
        ]);
    }


    if (
        selectedTheme ==
        "Space"
    ) {

        return random([
            "cyan",
            "violet",
            "magenta",
            "deepskyblue"
        ]);
    }


    if (
        selectedTheme ==
        "Winter"
    ) {

        return random([
            "white",
            "lightblue",
            "lavender",
            "skyblue"
        ]);
    }


    return random([
        "pink",
        "hotpink",
        "lightpink",
        "violet"
    ]);
}


// =====================================================
// SCHEDULE FLOWER
// =====================================================

function scheduleNextFlower() {

    nextFlowerTime =
        millis() +
        random(
            minSpawnTime,
            maxSpawnTime
        );
}


// =====================================================
// DIFFICULTY
// =====================================================

function setDifficulty(
    newDifficulty
) {

    difficulty =
        newDifficulty;


    if (
        difficulty ==
        "Easy"
    ) {

        maxFlowers =
            2;

        growthSpeed =
            0.15;

        minSpawnTime =
            2500;

        maxSpawnTime =
            4000;

        gameLength =
            45;

        wiltTime =
            4000;

        minimumFlowerDistance =
            190;
    }


    else if (
        difficulty ==
        "Medium"
    ) {

        maxFlowers =
            3;

        growthSpeed =
            0.20;

        minSpawnTime =
            1500;

        maxSpawnTime =
            3000;

        gameLength =
            35;

        wiltTime =
            3000;

        minimumFlowerDistance =
            160;
    }


    else {

        maxFlowers =
            5;

        growthSpeed =
            0.30;

        minSpawnTime =
            700;

        maxSpawnTime =
            1800;

        gameLength =
            30;

        wiltTime =
            2000;

        minimumFlowerDistance =
            130;
    }
}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    score =
        0;

    earlyClicks =
        0;

    missedClicks =
        0;

    wiltedFlowers =
        0;

    reactionTime =
        0;

    bestReactionTime =
        0;

    totalReactionTime =
        0;

    message =
        "Watch for a flower to bloom!";

    flowers =
        [];

    gamePaused =
        false;


    setDifficulty(
        difficulty
    );


    createNewFlower();

    scheduleNextFlower();


    startTime =
        millis();


    screen =
        "game";
}


// =====================================================
// PAUSE
// =====================================================

function pauseGame() {

    if (
        gamePaused
    ) {

        return;
    }


    gamePaused =
        true;


    pauseStartTime =
        millis();
}


function resumeGame() {

    if (
        !gamePaused
    ) {

        return;
    }


    let pauseLength =
        millis() -
        pauseStartTime;


    startTime +=
        pauseLength;


    nextFlowerTime +=
        pauseLength;


    for (
        let i = 0;
        i < flowers.length;
        i++
    ) {

        if (
            flowers[i].hasBloomed
        ) {

            flowers[i].bloomTime +=
                pauseLength;
        }


        if (
            flowers[i].hasWilted
        ) {

            flowers[i].wiltedAt +=
                pauseLength;
        }
    }


    gamePaused =
        false;
}


// =====================================================
// PAUSE OVERLAY
// =====================================================

function drawPauseOverlay() {

    fill(
        0,
        0,
        0,
        120
    );


    noStroke();


    rect(
        0,
        115,
        DESIGN_WIDTH,
        DESIGN_HEIGHT - 115
    );


    drawCard(
        425,
        205,
        350,
        330
    );


    fill(
        45,
        105,
        60
    );


    textAlign(CENTER);

    textStyle(BOLD);

    textSize(36);


    text(
        "Game Paused",
        DESIGN_WIDTH / 2,
        270
    );


    fill(85);

    textStyle(NORMAL);

    textSize(17);


    text(
        "Your timer and flowers are frozen.",
        DESIGN_WIDTH / 2,
        310
    );


    drawGreenButton(
        485,
        350,
        230,
        60,
        "RESUME"
    );


    drawGrayButton(
        485,
        435,
        105,
        50,
        "← Back"
    );


    drawGrayButton(
        610,
        435,
        105,
        50,
        "Home"
    );


    textAlign(LEFT);
}


// =====================================================
// RESULTS
// =====================================================

function drawResultsScreen() {

    drawBasicBackground();


    drawGrayButton(
        25,
        25,
        110,
        50,
        "← Back"
    );


    drawCard(
        320,
        45,
        560,
        600
    );


    fill(
        45,
        105,
        60
    );


    textAlign(CENTER);

    textStyle(BOLD);

    textSize(42);


    text(
        "Exercise Complete!",
        DESIGN_WIDTH / 2,
        115
    );


    fill(90);

    textStyle(NORMAL);

    textSize(20);


    text(
        selectedTheme +
        " Theme  •  " +
        difficulty +
        " Difficulty",
        DESIGN_WIDTH / 2,
        155
    );


    let attempts =
        score +
        earlyClicks +
        missedClicks +
        wiltedFlowers;


    let accuracy =
        0;


    if (
        attempts > 0
    ) {

        accuracy =
            score /
            attempts *
            100;
    }


    let average =
        0;


    if (
        score > 0
    ) {

        average =
            totalReactionTime /
            score;
    }


    fill(
        50,
        130,
        65
    );


    textStyle(BOLD);

    textSize(48);


    text(
        score,
        DESIGN_WIDTH / 2,
        230
    );


    fill(80);

    textStyle(NORMAL);

    textSize(17);


    text(
        "Flowers Tapped",
        DESIGN_WIDTH / 2,
        260
    );


    stroke(225);

    strokeWeight(2);


    line(
        385,
        290,
        815,
        290
    );


    noStroke();


    fill(65);

    textSize(20);


    text(
        "Early Taps: " +
        earlyClicks,
        DESIGN_WIDTH / 2,
        335
    );


    text(
        "Wilted Flowers: " +
        wiltedFlowers,
        DESIGN_WIDTH / 2,
        375
    );


    text(
        "Missed Taps: " +
        missedClicks,
        DESIGN_WIDTH / 2,
        415
    );


    text(
        "Accuracy: " +
        accuracy.toFixed(0) +
        "%",
        DESIGN_WIDTH / 2,
        455
    );


    if (
        score > 0
    ) {

        text(
            "Average Reaction: " +
            average.toFixed(2) +
            " sec",
            DESIGN_WIDTH / 2,
            495
        );


        text(
            "Best Reaction: " +
            bestReactionTime.toFixed(2) +
            " sec",
            DESIGN_WIDTH / 2,
            535
        );
    }


    drawGreenButton(
        470,
        570,
        260,
        60,
        "PLAY AGAIN"
    );


    textAlign(LEFT);
}


// =====================================================
// BUTTONS
// =====================================================

function drawGreenButton(
    x,
    y,
    w,
    h,
    label
) {

    fill(
        65,
        155,
        80
    );


    noStroke();


    rect(
        x,
        y,
        w,
        h,
        10
    );


    fill("white");

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(17);


    text(
        label,
        x + w / 2,
        y + h / 2 + 6
    );


    textStyle(NORMAL);
}


function drawGrayButton(
    x,
    y,
    w,
    h,
    label
) {

    fill(235);

    noStroke();


    rect(
        x,
        y,
        w,
        h,
        10
    );


    fill(65);

    textAlign(CENTER);

    textStyle(BOLD);

    textSize(15);


    text(
        label,
        x + w / 2,
        y + h / 2 + 5
    );


    textStyle(NORMAL);
}


function drawChoiceButton(
    x,
    y,
    w,
    h,
    label,
    selected
) {

    if (
        selected
    ) {

        fill(
            65,
            155,
            80
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
        9
    );


    if (
        selected
    ) {

        fill("white");
    }

    else {

        fill(65);
    }


    textAlign(CENTER);

    textStyle(BOLD);

    textSize(15);


    text(
        label,
        x + w / 2,
        y + h / 2 + 5
    );


    textStyle(NORMAL);
}


// =====================================================
// CARDS
// =====================================================

function drawCard(
    x,
    y,
    w,
    h
) {

    fill(
        0,
        0,
        0,
        25
    );


    noStroke();


    rect(
        x + 7,
        y + 9,
        w,
        h,
        20
    );


    fill("white");


    rect(
        x,
        y,
        w,
        h,
        20
    );
}


function drawStatusCard(
    x,
    y,
    w,
    h
) {

    fill(
        0,
        0,
        0,
        20
    );


    noStroke();


    rect(
        x + 5,
        y + 6,
        w,
        h,
        14
    );


    fill(
        255,
        255,
        255,
        245
    );


    rect(
        x,
        y,
        w,
        h,
        14
    );
}


// =====================================================
// MENU FLOWER
// =====================================================

function drawMenuFlower(
    x,
    y,
    size
) {

    stroke(
        50,
        130,
        60
    );


    strokeWeight(7);


    line(
        x,
        y + 80,
        x,
        y
    );


    noStroke();


    fill(
        75,
        165,
        75
    );


    ellipse(
        x - 22,
        y + 45,
        50,
        20
    );


    ellipse(
        x + 22,
        y + 28,
        50,
        20
    );


    fill(
        240,
        95,
        145
    );


    circle(
        x - size / 4,
        y,
        size / 2
    );


    circle(
        x + size / 4,
        y,
        size / 2
    );


    circle(
        x,
        y - size / 4,
        size / 2
    );


    circle(
        x,
        y + size / 4,
        size / 2
    );


    fill(
        255,
        215,
        50
    );


    circle(
        x,
        y,
        size / 2
    );
}


// =====================================================
// FALL TREE
// =====================================================

function drawFallTree(
    x,
    y,
    s
) {

    noStroke();


    fill(
        105,
        70,
        40
    );


    rect(
        x - 10 * s,
        y - 110 * s,
        20 * s,
        110 * s
    );


    fill(
        220,
        120,
        45
    );


    circle(
        x,
        y - 145 * s,
        110 * s
    );


    fill(
        235,
        165,
        55
    );


    circle(
        x + 42 * s,
        y - 120 * s,
        75 * s
    );


    fill(
        205,
        85,
        40
    );


    circle(
        x - 40 * s,
        y - 120 * s,
        75 * s
    );
}


// =====================================================
// CHERRY TREE
// =====================================================

function drawCherryTree(
    x,
    y,
    s
) {

    noStroke();


    fill(
        105,
        70,
        60
    );


    rect(
        x - 10 * s,
        y - 110 * s,
        20 * s,
        110 * s
    );


    fill(
        245,
        165,
        195
    );


    circle(
        x,
        y - 145 * s,
        110 * s
    );


    fill(
        255,
        190,
        215
    );


    circle(
        x + 42 * s,
        y - 120 * s,
        75 * s
    );


    fill(
        235,
        145,
        185
    );


    circle(
        x - 40 * s,
        y - 120 * s,
        75 * s
    );
}


// =====================================================
// MOUSE PRESSED
// =====================================================

function mousePressed() {

    // Convert screen mouse coordinates
    // into 1200 x 700 game coordinates
    let mx =
        getGameMouseX();


    let my =
        getGameMouseY();


    // Ignore clicks outside the game area
    if (
        mx < 0 ||
        mx > DESIGN_WIDTH ||
        my < 0 ||
        my > DESIGN_HEIGHT
    ) {

        return;
    }


    // =================================================
    // HOME
    // =================================================

    if (
        screen ==
        "home"
    ) {

        if (
            mx > 455 &&
            mx < 745 &&
            my > 510 &&
            my < 580
        ) {

            screen =
                "setup";
        }


        return;
    }


    // =================================================
    // SETUP
    // =================================================

    if (
        screen ==
        "setup"
    ) {


        // Back
        if (
            mx > 25 &&
            mx < 135 &&
            my > 25 &&
            my < 75
        ) {

            screen =
                "home";

            return;
        }


        // Themes
        if (
            my > 390 &&
            my < 438
        ) {

            if (
                mx > 310 &&
                mx < 440
            ) {

                selectedTheme =
                    "Fall";
            }

            else if (
                mx > 460 &&
                mx < 590
            ) {

                selectedTheme =
                    "Space";
            }

            else if (
                mx > 610 &&
                mx < 740
            ) {

                selectedTheme =
                    "Winter";
            }

            else if (
                mx > 760 &&
                mx < 890
            ) {

                selectedTheme =
                    "Cherry";
            }
        }


        // Difficulty
        if (
            my > 530 &&
            my < 578
        ) {

            if (
                mx > 365 &&
                mx < 505
            ) {

                setDifficulty(
                    "Easy"
                );
            }

            else if (
                mx > 530 &&
                mx < 670
            ) {

                setDifficulty(
                    "Medium"
                );
            }

            else if (
                mx > 695 &&
                mx < 835
            ) {

                setDifficulty(
                    "Hard"
                );
            }
        }


        // Start
        if (
            mx > 485 &&
            mx < 715 &&
            my > 620 &&
            my < 670
        ) {

            startGame();
        }


        return;
    }


    // =================================================
    // RESULTS
    // =================================================

    if (
        screen ==
        "results"
    ) {

        // Back
        if (
            mx > 25 &&
            mx < 135 &&
            my > 25 &&
            my < 75
        ) {

            screen =
                "setup";

            return;
        }


        // Play again
        if (
            mx > 470 &&
            mx < 730 &&
            my > 570 &&
            my < 630
        ) {

            startGame();
        }


        return;
    }


    // =================================================
    // GAME
    // =================================================

    if (
        screen ==
        "game"
    ) {


        // =============================================
        // PAUSED
        // =============================================

        if (
            gamePaused
        ) {


            // Resume
            if (
                mx > 485 &&
                mx < 715 &&
                my > 350 &&
                my < 410
            ) {

                resumeGame();

                return;
            }


            // Back
            if (
                mx > 485 &&
                mx < 590 &&
                my > 435 &&
                my < 485
            ) {

                gamePaused =
                    false;

                flowers =
                    [];

                screen =
                    "setup";

                return;
            }


            // Home
            if (
                mx > 610 &&
                mx < 715 &&
                my > 435 &&
                my < 485
            ) {

                gamePaused =
                    false;

                flowers =
                    [];

                screen =
                    "home";

                return;
            }


            return;
        }


        // Back
        if (
            mx > 20 &&
            mx < 120 &&
            my > 25 &&
            my < 75
        ) {

            flowers =
                [];

            screen =
                "setup";

            return;
        }


        // Pause
        if (
            mx > 135 &&
            mx < 235 &&
            my > 25 &&
            my < 75
        ) {

            pauseGame();

            return;
        }


        // Home
        if (
            mx > 250 &&
            mx < 350 &&
            my > 25 &&
            my < 75
        ) {

            flowers =
                [];

            screen =
                "home";

            return;
        }


        // =================================================
        // FLOWER CLICK
        // =================================================

        let clicked =
            false;


        for (
            let i =
                flowers.length - 1;

            i >= 0;

            i--
        ) {

            let flower =
                flowers[i];


            if (
                flower.hasWilted
            ) {

                continue;
            }


            let centerY =
                flower.y -
                flower.size;


            let d =
                dist(
                    mx,
                    my,
                    flower.x,
                    centerY
                );


            if (
                d <
                flower.maxSize / 2
            ) {

                clicked =
                    true;


                // Correct
                if (
                    flower.hasBloomed
                ) {

                    score++;


                    reactionTime =
                        (
                            millis() -
                            flower.bloomTime
                        )
                        / 1000;


                    totalReactionTime +=
                        reactionTime;


                    if (
                        bestReactionTime == 0 ||
                        reactionTime <
                        bestReactionTime
                    ) {

                        bestReactionTime =
                            reactionTime;
                    }


                    message =
                        "Great job!";


                    flowers.splice(
                        i,
                        1
                    );


                    nextFlowerTime =
                        min(
                            nextFlowerTime,
                            millis() + 450
                        );
                }


                // Early
                else {

                    earlyClicks++;


                    message =
                        "Too early. Wait until the flower blooms.";
                }


                break;
            }
        }


        if (
            !clicked
        ) {

            missedClicks++;


            message =
                "Try tapping directly on a flower.";
        }
    }
}