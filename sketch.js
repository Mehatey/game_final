let currentScene;

function preload() {
    currentScene = new Scene1();
    currentScene.preload();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    if (currentScene && currentScene.draw) {
        currentScene.draw();
    }
}

function mousePressed() {
    if (currentScene && currentScene.mousePressed) {
        currentScene.mousePressed();
    }
}

function keyPressed() {
    if (currentScene && currentScene.keyPressed) {
        currentScene.keyPressed();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}