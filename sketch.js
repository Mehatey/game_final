let currentScene;
let gameFont;

function preload() {
    gameFont = loadFont('assets/fonts/ARCADE.TTF');
}

function setup() {
    createCanvas(800, 600);
    textFont(gameFont);
    currentScene = new Scene1();
    if (currentScene.preload) {
        currentScene.preload();
    }
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
    if (currentScene.preload) {
        currentScene.preload();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}