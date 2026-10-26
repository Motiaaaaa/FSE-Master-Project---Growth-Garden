function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(135, 206, 235); // Sky blue background

  // Title
  fill(255);
  textSize(32);
  textAlign(CENTER, TOP);
  text("Harvest the Fruit", width / 2, 20);

  // Tree
  // // Trunk
   fill (139, 69, 19); // Brown color for the trunk
   rect(250, 150, 100, 200); // Tree trunk

  // // Leaves
   fill(34, 139, 34); // Green color for the leaves
   ellipse(300, 100, 200, 200); // Tree leaves

  // // Fruit
    fill(255, 0, 0); // Red color for the fruit
    ellipse(300, 100, 30, 30); // Fruit on the tree
    
}
