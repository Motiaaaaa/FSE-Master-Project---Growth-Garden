let tiles = []; // Array to store falling tiles
let score = 0;  // Growth score

function setup() {
  // Step 1: Create game screen and basic setup
  createCanvas(600, 400); 
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  // Step 2: Draw thematic background
  background(200, 230, 255); // Sky blue
  stroke(150, 200, 150); strokeWeight(2);
  line(150, 0, 150, 400); line(300, 0, 300, 400); line(450, 0, 450, 400); // Tracks
  
  fill(100, 180, 100); noStroke();
  rect(0, 300, 600, 100); // Bottom grass

  // Step 3: Draw bottom keys UI
  fill(255); stroke(100, 150, 100); strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    rect(i * 150 + 2, 300, 146, 100); 
  }

  // ==========================================
  // Step 4: Program the tiles to appear in sequence
  // ==========================================
  // Spawn a new tile every 45 frames
  if (frameCount % 45 === 0) {
    let randomCol = floor(random(4)); // Randomly select a column
    tiles.push({ col: randomCol, y: -120 }); // Add to array, start above screen
  }

  // ==========================================
  // Step 5: Update and draw falling tiles
  // ==========================================
  for (let i = tiles.length - 1; i >= 0; i--) {
    let t = tiles[i];
    t.y += 3; // Move tile down by speed 3
    
    // Draw dark soil-colored tile
    fill(60, 40, 20); noStroke();
    rect(t.col * 150 + 4, t.y, 142, 120);

    // Remove tile if it falls off the bottom
    if (t.y > 400) {
      tiles.splice(i, 1);
    }
  }

  // Step 6: Draw score UI
  fill(255); stroke(100, 150, 100); strokeWeight(2);
  rect(220, 10, 160, 50, 10); 
  fill(0); noStroke();
  text("Growth: " + score, 300, 35); // Display real-time score
}

// ==========================================
// Step 7: Program the user tapping interaction
// ==========================================
function mousePressed() {
  // Calculate which column the user clicked
  let clickedCol = floor(mouseX / 150);
  
  // Iterate backwards to detect hits
  for (let i = tiles.length - 1; i >= 0; i--) {
    let t = tiles[i];
    
    // Check if column matches and mouseY is within tile bounds
    if (t.col === clickedCol && mouseY > t.y && mouseY < t.y + 120) {
      tiles.splice(i, 1); // Remove the hit tile
      score += 10;        // Increase score
      break;              // Only remove one tile per click
    }
  }
}
