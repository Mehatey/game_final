window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.log('Error: ' + msg);
    console.log('URL: ' + url);
    console.log('Line: ' + lineNo);
    return false;
};

let currentScene;
let gameFont;
let paused = false;

function preload() {
    gameFont = loadFont('assets/fonts/ARCADE.TTF');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont(gameFont);
    blendMode(BLEND);

    currentScene = new Onboarding();
    noCursor();
}

function draw() {
    if (currentScene) {
        currentScene.draw();
        CustomCursor.draw();
        if (paused) _drawPauseMenu();
    }
}

function mousePressed() {
    if (paused) {
        _handlePauseClick();
        return;
    }
    if (currentScene && currentScene.mousePressed) {
        currentScene.mousePressed();
    }
}

function keyPressed() {
    // ESC toggles pause — only during gameplay scenes
    if (keyCode === ESCAPE) {
        let isGameplay = currentScene instanceof Scene3 ||
            currentScene instanceof Scene4 ||
            currentScene instanceof Scene4_5 ||
            currentScene instanceof Scene5 ||
            currentScene instanceof Scene6 ||
            currentScene instanceof Scene7;
        if (isGameplay) paused = !paused;
        return;
    }
    if (paused) return;
    if (currentScene && currentScene.keyPressed) {
        currentScene.keyPressed(key);
    }
}

function switchScene(newScene) {
    if (currentScene && currentScene.cleanup) {
        currentScene.cleanup();
    }
    paused = false;
    currentScene = newScene;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setScene(sceneName) {
    if (currentScene && currentScene.cleanup) currentScene.cleanup();
    currentScene = null;
    paused = false;
    clear();
    background(0);
    removeElements();

    switch (sceneName) {
        case 'scene1':  currentScene = new Scene1();   break;
        case 'scene2':  currentScene = new Scene2();   break;
        case 'scene3':  currentScene = new Scene3();   break;
        case 'scene4':  currentScene = new Scene4();   break;
        case 'scene4.5': currentScene = new Scene4_5(); break;
        case 'scene5':  currentScene = new Scene5();   break;
        case 'scene6':  currentScene = new Scene6();   break;
        case 'scene7':  currentScene = new Scene7();   break;
    }
    if (currentScene && currentScene.preload) currentScene.preload();
}

// ── Pause menu ────────────────────────────────────────────────────────────────

function _drawPauseMenu() {
    push();
    // Overlay
    fill(0, 190);
    noStroke();
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);

    // Title
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(255,255,255,0.6)';
    textSize(min(width * 0.055, 50));
    fill(255);
    text('PAUSED', width / 2, height * 0.3);
    drawingContext.shadowBlur = 0;

    // Buttons
    let bw = 220, bh = 50;
    let buttons = [
        { label: 'RESUME', y: height * 0.48 },
        { label: 'RESTART', y: height * 0.59 }
    ];

    for (let b of buttons) {
        let hovered = mouseX > width / 2 - bw / 2 && mouseX < width / 2 + bw / 2 &&
            mouseY > b.y - bh / 2 && mouseY < b.y + bh / 2;
        rectMode(CENTER);
        if (hovered) {
            fill(255);
            stroke(255);
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(255,255,255,0.4)';
        } else {
            fill(255, 18);
            stroke(255, 70);
        }
        strokeWeight(1);
        rect(width / 2, b.y, bw, bh, 4);
        drawingContext.shadowBlur = 0;
        rectMode(CORNER);
        noStroke();
        textSize(min(width * 0.017, 15));
        fill(hovered ? 0 : 255);
        text(b.label, width / 2, b.y);
    }

    // Controls hint
    textSize(min(width * 0.013, 12));
    fill(80);
    text('ESC to resume  ·  arrows / wasd move  ·  space fires', width / 2, height * 0.72);
    pop();
}

function _handlePauseClick() {
    let bw = 220, bh = 50;

    // Resume
    if (mouseX > width / 2 - bw / 2 && mouseX < width / 2 + bw / 2 &&
        mouseY > height * 0.48 - bh / 2 && mouseY < height * 0.48 + bh / 2) {
        paused = false;
        return;
    }

    // Restart → back to Scene1
    if (mouseX > width / 2 - bw / 2 && mouseX < width / 2 + bw / 2 &&
        mouseY > height * 0.59 - bh / 2 && mouseY < height * 0.59 + bh / 2) {
        paused = false;
        if (currentScene && currentScene.cleanup) currentScene.cleanup();
        currentScene = new Scene1();
        if (currentScene.preload) currentScene.preload();
    }
}
