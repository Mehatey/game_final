window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.log('Error: ' + msg);
    console.log('URL: ' + url);
    console.log('Line: ' + lineNo);
    return false;
};

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
    if (currentScene.setup) {
        currentScene.setup();
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
    if (currentScene) {
        // Cleanup PIXI if it was used
        cleanupPixi();
    }
    currentScene = newScene;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}