let flowers = [];
let clouds = [];
let bees = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < 14; i++) {
    flowers.push({
      x: random(60, width - 60),
      y: random(height * 0.66, height - 30),
      size: random(16, 34),
      hue: random(20, 60),
      petal: random(20, 80),
      stem: random(50, 110),
      angle: random(TWO_PI)
    });
  }

  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: random(width),
      y: random(80, 180),
      w: random(90, 150),
      h: random(30, 48),
      speed: random(0.2, 0.7)
    });
  }

  for (let i = 0; i < 6; i++) {
    bees.push({
      x: random(width),
      y: random(180, height * 0.7),
      r: random(4, 8),
      speed: random(0.5, 2.2),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  drawSky();
  drawGround();
  drawFlowers();
  drawBees();
}

function drawSky() {
  background(160, 70, 90);

  const sunX = width * 0.78;
  const sunY = 100;
  fill(48, 90, 90, 82);
  circle(sunX, sunY, 110);

  for (const cloud of clouds) {
    cloud.x += cloud.speed;
    if (cloud.x > width + 100) {
      cloud.x = -150;
    }

    fill(100, 0, 100, 72);
    ellipse(cloud.x, cloud.y, cloud.w, cloud.h);
    ellipse(cloud.x + cloud.w * 0.25, cloud.y - 8, cloud.w * 0.7, cloud.h * 0.9);
    ellipse(cloud.x - cloud.w * 0.25, cloud.y - 6, cloud.w * 0.8, cloud.h * 0.8);
  }
}

function drawGround() {
  fill(118, 52, 45);
  rect(0, height * 0.72, width, height * 0.28);

  fill(123, 54, 65);
  triangle(0, height * 0.76, width * 0.45, height * 0.72, width, height * 0.78);

  fill(102, 64, 60);
  beginShape();
  vertex(0, height * 0.8);
  vertex(width * 0.1, height * 0.83);
  vertex(width * 0.15, height * 0.84);
  vertex(width * 0.62, height * 0.8);
  vertex(width * 0.7, height * 0.84);
  vertex(width, height * 0.82);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  fill(110, 72, 60);
  rect(0, height * 0.72, width, 12);

  for (let x = 0; x < width; x += 30) {
    fill(90, 70, 60, 50);
    rect(x, height * 0.72 + 18, 10, 20);
  }
}

function drawFlowers() {
  for (const flower of flowers) {
    const sway = sin(frameCount * 0.04 + flower.x * 0.08) * 8;
    const stemTopY = flower.y - flower.stem;

    push();
    translate(flower.x, flower.y);
    rotate(radians(sway));

    fill(120, 65, 45);
    rect(-4, -flower.stem, 8, flower.stem);

    fill(120, 70, 60);
    ellipse(-12, -flower.stem + 18, 18, 12);
    ellipse(12, -flower.stem + 28, 18, 12);

    push();
    translate(0, -flower.stem);
    fill(flower.petal, 85, 80);
    for (let i = 0; i < 8; i++) {
      const ang = i * (PI / 4) + flower.angle;
      ellipse(cos(ang) * flower.size * 0.32, sin(ang) * flower.size * 0.32, flower.size * 0.7, flower.size * 0.9);
    }
    fill(48, 90, 70);
    circle(0, 0, flower.size * 0.42);
    pop();

    pop();
  }
}

function drawBees() {
  for (const bee of bees) {
    bee.x += bee.speed;
    bee.y += sin(frameCount * 0.05 + bee.phase) * 0.5;

    if (bee.x > width + 20) {
      bee.x = -20;
      bee.y = random(180, height * 0.7);
    }

    push();
    translate(bee.x, bee.y);
    fill(52, 70, 90);
    ellipse(0, 0, bee.r * 2.4, bee.r * 1.6);
    fill(48, 40, 95);
    ellipse(-bee.r * 0.7, 0, bee.r * 0.8, bee.r * 0.8);
    fill(52, 80, 90);
    ellipse(bee.r * 0.8, 0, bee.r * 0.7, bee.r * 0.7);
    stroke(0, 0, 0, 70);
    strokeWeight(1.4);
    line(-1, -bee.r * 1.2, -bee.r * 1.5, -bee.r * 2.2);
    line(1, -bee.r * 1.2, bee.r * 1.5, -bee.r * 2.2);
    noStroke();
    pop();
  }
}
