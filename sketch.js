let currentScene;
let gameFont;

function preload() {
    gameFont = loadFont('assets/fonts/ARCADE.TTF');
    currentScene = new Scene1();
    currentScene.preload();
}

function setup() {
    createCanvas(800, 600);
    textFont(gameFont);
}

function draw() {
    if (currentScene) {
        currentScene.draw();
    }
}

function mousePressed() {
    if (currentScene && currentScene.mousePressed) {
        currentScene.mousePressed();
    }
}

function keyPressed() {
    if (currentScene) {
        currentScene.keyPressed();
    }
}

function switchScene(newScene) {
    currentScene = newScene;
    currentScene.preload();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}