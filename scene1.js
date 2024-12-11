class Button {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 50;
        this.text = text;
        this.isHovered = false;
        this.baseColor = color(50);
        this.hoverColor = color(100);
        this.textColor = color(255);
        this.cornerRadius = 10;
    }

    draw() {
        push();
        this.isHovered = this.checkHover();
        rectMode(CENTER);
        fill(this.isHovered ? this.hoverColor : this.baseColor);
        stroke(255);
        strokeWeight(3);
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        fill(this.textColor);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(24);
        text(this.text, this.x, this.y);
        pop();
    }

    checkHover() {
        return mouseX > this.x - this.width / 2 &&
            mouseX < this.x + this.width / 2 &&
            mouseY > this.y - this.height / 2 &&
            mouseY < this.y + this.height / 2;
    }

    isClicked() {
        return this.checkHover();
    }
}

class Scene1 {
    constructor() {
        this.font = null;
        this.backgroundImage = null;
        this.buttons = {
            loadGame: {
                x: windowWidth / 2,
                y: windowHeight / 2,
                width: 300,
                height: 60,
                text: "LOAD GAME"
            },
            beginJourney: {
                x: windowWidth / 2,
                y: windowHeight / 2 + 100,
                width: 300,
                height: 60,
                text: "BEGIN JOURNEY"
            }
        };
        this.loadGameButton = new Button(width / 2, height / 2 + 50, "Load Game");
        this.beginJourneyButton = new Button(width / 2, height / 2, "Begin Journey");
        
        // Adjust button position to be more visible
        this.wordGameButton = {
            x: 50,  // Changed from width-150 to 50 for better visibility
            y: 50,  // Changed from height-50 to 50 to place at top
            width: 120,
            height: 40,
            text: "Word Game"
        };
    }

    preload() {
        this.font = loadFont('./assets/fonts/ARCADE.TTF');
        this.backgroundImage = loadImage('./assets/backgrounds/introbg1.png');
    }

    draw() {
        background(0);  // Make sure this is here
        
        // Draw background with proper scaling
        let scale = Math.max(windowWidth / this.backgroundImage.width, windowHeight / this.backgroundImage.height);
        let newWidth = this.backgroundImage.width * scale;
        let newHeight = this.backgroundImage.height * scale;
        let x = (windowWidth - newWidth) / 2;
        let y = (windowHeight - newHeight) / 2;

        image(this.backgroundImage, x, y, newWidth, newHeight);

        // Set up pixel art style
        noSmooth();
        textFont(this.font);
        textAlign(CENTER, CENTER);

        // Draw buttons
        this.drawPixelButton(this.buttons.loadGame);
        this.drawPixelButton(this.buttons.beginJourney);
        
        // Draw word game button with brighter colors
        push();
        // Button background
        fill(0, 100, 255);  // Brighter blue
        stroke(255);
        strokeWeight(3);
        rect(this.wordGameButton.x, this.wordGameButton.y, 
             this.wordGameButton.width, this.wordGameButton.height, 10);
        
        // Button text
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(20);  // Larger text
        text(this.wordGameButton.text, 
             this.wordGameButton.x + this.wordGameButton.width/2, 
             this.wordGameButton.y + this.wordGameButton.height/2);
        pop();
    }

    drawPixelButton(button) {
        push();
        strokeWeight(3);
        stroke(0);

        // Hover effect with glow
        if (this.isMouseOver(button)) {
            // Glow effect
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(255, 255, 0, 0.5)';
            fill(255, 255, 0); // Bright yellow on hover
        } else {
            fill(255, 255, 0); // Yellow
        }

        // Button rectangle
        rect(button.x - button.width / 2,
            button.y - button.height / 2,
            button.width,
            button.height);

        // Button text (no stroke)
        noStroke();
        fill(0);
        textSize(24);
        text(button.text,
            button.x,
            button.y);
        pop();
    }

    isMouseOver(button) {
        return mouseX > button.x - button.width / 2 &&
            mouseX < button.x + button.width / 2 &&
            mouseY > button.y - button.height / 2 &&
            mouseY < button.y + button.height / 2;
    }

    mousePressed() {
        // Check word game button
        if (mouseX > this.wordGameButton.x && 
            mouseX < this.wordGameButton.x + this.wordGameButton.width &&
            mouseY > this.wordGameButton.y && 
            mouseY < this.wordGameButton.y + this.wordGameButton.height) {
            
            let scene3 = new Scene3();
            scene3.preload();  // Load assets
            scene3.assetsLoaded = true;  // Ensure assets are marked as loaded
            scene3.dialogueState = 'playing';  // Skip to word game
            scene3.hopeEntered = true;  // Ensure Hope state is set
            scene3.currentDialogue = scene3.heroDialogues.length;  // Skip all dialogue
            currentScene = scene3;
        }
        
        // Check if click is within loadGame button bounds
        if (mouseX > this.buttons.loadGame.x - this.buttons.loadGame.width/2 && 
            mouseX < this.buttons.loadGame.x + this.buttons.loadGame.width/2 && 
            mouseY > this.buttons.loadGame.y - this.buttons.loadGame.height/2 && 
            mouseY < this.buttons.loadGame.y + this.buttons.loadGame.height/2) {
            currentScene = new Scene3();
            if (currentScene.preload) {
                currentScene.preload();  // Make sure preload is called
            }
        }
        
        // Check if click is within beginJourney button bounds
        if (mouseX > this.buttons.beginJourney.x - this.buttons.beginJourney.width/2 && 
            mouseX < this.buttons.beginJourney.x + this.buttons.beginJourney.width/2 && 
            mouseY > this.buttons.beginJourney.y - this.buttons.beginJourney.height/2 && 
            mouseY < this.buttons.beginJourney.y + this.buttons.beginJourney.height/2) {
            currentScene = new Scene2();
        }
    }
}
