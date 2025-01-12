const end = 10;
let images = [];
let collectImage;
let backgroundImage;
let movingImage;
let collisionSound;
let pokusny;
let music; // Přidána proměnná pro hudbu
let gameOver = false; // Proměnná pro sledování stavu hry

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

  detectCollision(image) {
    return collideRectCircle(this.x, this.y, this.width, this.height, 
      image.x, image.y, image.size);
  }
}

class Obrazek {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 20;
    this.speed = 2;
    this.color = color(random(255), random(255), random(255));
  }

  draw() {
    if (collectImage) {
      imageMode(CENTER);
      image(collectImage, this.x, this.y, this.size * 7.5, this.size * 7.5);
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
  collectImage = loadImage('meth.webp');
  collisionSound = loadSound('kolize.mp3');
  backgroundImage = loadImage('van.webp');
  music = loadSound('saul.mp3'); // Načtení hudby
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pokusny = new Rectangle(500, 300);
  images.push(new Obrazek());

  // Spuštění hudby na pozadí
  if (music && music.isLoaded()) {
    music.setVolume(0.1);
    music.loop();
  } else {
    console.error("Hudba se nenačetla správně.");
  }
}

function draw() {
  // Pokud hra skončila, nezobrazuje nic jiného
  if (gameOver) {
    // Nastavení barvy pro obdélník (např. červený okraj a průhledný vnitřek)
    fill(0); // Poloprůhledný červený
    stroke(255);  // Bílý okraj

    // Vykreslení obdélníku kolem textu
    let textWidthValue = textWidth("You have won!") + 40; // Šířka textu + okraje
    let textHeightValue = 64 + 20; // Výška textu + okraje
    let rectX = width / 2 - textWidthValue / 2;
    let rectY = height / 2 - textHeightValue / 2;

    rect(rectX, rectY, textWidthValue, textHeightValue); // Vykreslí obdélník

    // Zobrazení textu "HRA SKONČILA"
    fill(255); // Bílá barva pro text
    textSize(32);
    textAlign(CENTER, CENTER);
    text("You have won!", width / 2, height / 2);

    return; // Zastaví vykreslování
  }

  if (backgroundImage) {
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(20);
  }

  // Aktualizace methu
  for (let i = 0; i < images.length; i++) {
    images[i].update();
    images[i].draw();
    if (pokusny.detectCollision(images[i])) {
      pokusny.points++;
      console.log(pokusny.points);

      // Kontrola, zda hráč nasbíral 20 bodů
      if (pokusny.points >= end) {
        gameOver = true; // Pokud ano, hra skončí
      }

      if (collisionSound && collisionSound.isLoaded()) {
        collisionSound.setVolume(5.0);
        collisionSound.play();
      }

      images.splice(i, 1); // Odstranění methu, ktery byl sebrán
      images.push(new Obrazek()); // Vytvoření nového methu
    }
    if (images[i].y > height + 20) {
      images.splice(i, 1);  // Pokud meth spadne mimo obrazovku, odstraníme ji
      images.push(new Obrazek());
    }
  }

  // Kontrola pohybu pouze, pokud hra neskončila
  if (!gameOver) {
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
  }

  // Zobrazení skóre v pravém horním rohu
  fill(255);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + pokusny.points, 20, 20);

  fill(255);
  textSize(32);
  textAlign(CENTER, TOP);
  text("The goal of the game is to collect "  + end + " meths.", windowWidth / 2, 20);


  pokusny.draw();
}
