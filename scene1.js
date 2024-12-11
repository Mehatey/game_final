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
    }

    preload() {
        this.font = loadFont('./assets/fonts/ARCADE.TTF');
        this.backgroundImage = loadImage('./assets/backgrounds/introbg1.png');
    }

    draw() {
        // Draw background with proper scaling
        let scale = Math.max(windowWidth/this.backgroundImage.width, windowHeight/this.backgroundImage.height);
        let newWidth = this.backgroundImage.width * scale;
        let newHeight = this.backgroundImage.height * scale;
        let x = (windowWidth - newWidth)/2;
        let y = (windowHeight - newHeight)/2;
        
        image(this.backgroundImage, x, y, newWidth, newHeight);
        
        // Set up pixel art style
        noSmooth();
        textFont(this.font);
        textAlign(CENTER, CENTER);
        
        // Draw buttons
        this.drawPixelButton(this.buttons.loadGame);
        this.drawPixelButton(this.buttons.beginJourney);
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
        rect(button.x - button.width/2, 
             button.y - button.height/2, 
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
        return mouseX > button.x - button.width/2 && 
               mouseX < button.x + button.width/2 && 
               mouseY > button.y - button.height/2 && 
               mouseY < button.y + button.height/2;
    }

    mousePressed() {
        if (this.isMouseOver(this.buttons.loadGame)) {
            console.log('Load Game clicked');
        }
        if (this.isMouseOver(this.buttons.beginJourney)) {
            let scene2 = new Scene2();
            scene2.preload();
            currentScene = scene2;
        }
    }
}
