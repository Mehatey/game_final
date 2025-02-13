window.onerror = function (msg, url, lineNo, columnNo, error) {
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

    // Add this line to enable proper blending
    blendMode(BLEND);

    // Check if Scene1 exists before creating instance
    if (typeof Scene1 !== 'undefined') {
        currentScene = new Scene1();
        if (currentScene.preload) {
            currentScene.preload();
        }
        if (currentScene.setup) {
            currentScene.setup();
        }
    } else {
        console.error('Scene1 class not found');
    }

    noCursor();  // Hide default cursor
}

function draw() {
    if (currentScene) {
        currentScene.draw();
    }
    CustomCursor.draw();  // Draw cursor last, after all scenes
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
    if (currentScene && currentScene.cleanup) {
        currentScene.cleanup();
    }
    currentScene = newScene;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setScene(sceneName) {
    if (currentScene) {
        clear();
        background(0);
        removeElements();
        if (currentScene.cleanup) {
            currentScene.cleanup();
        }
        currentScene = null;
    }

    clear();
    background(0);
    removeElements();

    switch (sceneName) {
        case 'scene1':
            currentScene = new Scene1();
            break;
        case 'scene4':
            currentScene = new Scene4();
            break;
        case 'scene4.5':
            currentScene = new Scene4_5();
            break;
        case 'scene5':
            currentScene = new Scene5();
            break;
        // ... other scenes ...
    }
}