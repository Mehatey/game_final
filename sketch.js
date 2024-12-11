let currentScene;
let gameFont;

function preload() {
    gameFont = loadFont('assets/fonts/ARCADE.TTF');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
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
    if (currentScene && currentScene.keyPressed) {
        currentScene.keyPressed(key);
    }
}

function switchScene(newScene) {
    // Clean up the current scene before switching
    if (currentScene && currentScene.cleanup) {
        currentScene.cleanup();
    }

    // Stop all currently playing sounds
    if (getAudioContext().state === 'running') {
        getAudioContext().suspend();
        getAudioContext().resume();
    }

    // Switch to new scene
    currentScene = newScene;
    if (currentScene.preload) {
        currentScene.preload();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}