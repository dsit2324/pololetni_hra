let snowflakes = [];
let snowflakeImage;
let backgroundImage;
let movingImage;
let dingSound;
let pokusny;
let music; // Přidána proměnná pro hudbu

class Rectangle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 30;
    this.speed = 10;
    this.points = 0;
    this.color = color(random(255), random(255), random(255));
  }

  draw() {
    if (movingImage) {
      imageMode(CENTER);
      image(movingImage, this.x, this.y, movingImage.width / 3, movingImage.height / 3);
    } else {
      fill(this.color);
      stroke(0);
      strokeWeight(5);
      rect(this.x, this.y, this.width, this.height);
    }
  }

  move(dx, dy) {
    this.x = constrain(this.x + dx * this.speed, 0, width - this.width);
    this.y = constrain(this.y + dy * this.speed, 0, height - this.height);
  }

  detectCollision(snowflake) {
    return collideRectCircle(this.x, this.y, this.width, this.height, 
      snowflake.x, snowflake.y, snowflake.size);
  }
}

class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 20;
    this.speed = 2;
    this.color = color(random(255), random(255), random(255));
  }

  draw() {
    if (snowflakeImage) {
      imageMode(CENTER);
      image(snowflakeImage, this.x, this.y, this.size * 7.5, this.size * 7.5);
    } else {
      fill(this.color);
      circle(this.x, this.y, this.size);
    }
  }

  update() {
    this.y += this.speed;
  }
}

function preload() {
  // Načtení obrázku a zvuku
  movingImage = loadImage('walter.png');
  snowflakeImage = loadImage('meth.webp');
  dingSound = loadSound('ding.wav');
  backgroundImage = loadImage('van.webp');
  music = loadSound('saul.mp3'); // Načtení hudby
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pokusny = new Rectangle(500, 300);
  snowflakes.push(new Snowflake());

  // Spuštění hudby na pozadí
  if (music && music.isLoaded()) {
    music.loop();
  } else {
    console.error("Hudba se nenačetla správně.");
  }
}

function draw() {
  if (backgroundImage) {
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(20);
  }

  // Aktualizace sněhové vločky
  for (let i = 0; i < snowflakes.length; i++) {
    snowflakes[i].update();
    snowflakes[i].draw();
    if (pokusny.detectCollision(snowflakes[i])) {
      pokusny.points++;
      console.log(pokusny.points);
      if (dingSound && dingSound.isLoaded())
        dingSound.play();

      snowflakes.splice(i, 1);
      snowflakes.push(new Snowflake());
    }
    if (snowflakes[i].y > height + 20) {
      snowflakes.splice(i, 1);
      snowflakes.push(new Snowflake());
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    pokusny.move(-1, 0);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    pokusny.move(1, 0);
  }
  if (keyIsDown(UP_ARROW)) {
    pokusny.move(0, -1);
  }
  if (keyIsDown(DOWN_ARROW)) {
    pokusny.move(0, 1);
  }

  // Zobrazení skóre v pravém horním rohu
  fill(255);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Skóre: " + pokusny.points, 20, 20);

  pokusny.draw();
}
