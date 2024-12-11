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

        // Add debug button for end of video sequence
        this.videoEndButton = createButton('Go to Video End');
        this.videoEndButton.position(50, height / 2 + 50);
        this.videoEndButton.mousePressed(() => {
            if (this.videoEndButton) {
                this.videoEndButton.remove();
            }
            clear();
            background(0);
            let scene2 = new Scene2();
            scene2.preload();
            scene2.videoIndex = scene2.totalVideos - 1;
            currentScene = scene2;
            scene2.currentVideo = scene2.videos[scene2.videoIndex];
            scene2.videoPlaying = true;
            scene2.currentVideo.play();
        });
        
        // Style the button
        this.videoEndButton.style('background-color', '#4CAF50');
        this.videoEndButton.style('border', 'none');
        this.videoEndButton.style('color', 'white');
        this.videoEndButton.style('padding', '15px 32px');
        this.videoEndButton.style('text-align', 'center');
        this.videoEndButton.style('text-decoration', 'none');
        this.videoEndButton.style('display', 'inline-block');
        this.videoEndButton.style('font-size', '16px');
        this.videoEndButton.style('margin', '4px 2px');
        this.videoEndButton.style('cursor', 'pointer');
        this.videoEndButton.style('border-radius', '4px');

        // Add debug button for Scene5
        this.scene5Button = createButton('Go to Scene5');
        this.scene5Button.position(50, height/2 + 100); // Below video end button
        this.scene5Button.mousePressed(() => {
            if (this.videoEndButton) {
                this.videoEndButton.remove();
            }
            if (this.scene5Button) {
                this.scene5Button.remove();
            }
            clear();
            background(0);
            let scene5 = new Scene5();
            scene5.preload();
            currentScene = scene5;
        });
        
        // Style the button (same as other debug buttons)
        this.scene5Button.style('background-color', '#4CAF50');
        this.scene5Button.style('border', 'none');
        this.scene5Button.style('color', 'white');
        this.scene5Button.style('padding', '15px 32px');
        this.scene5Button.style('text-align', 'center');
        this.scene5Button.style('text-decoration', 'none');
        this.scene5Button.style('display', 'inline-block');
        this.scene5Button.style('font-size', '16px');
        this.scene5Button.style('margin', '4px 2px');
        this.scene5Button.style('cursor', 'pointer');
        this.scene5Button.style('border-radius', '4px');

        // Add debug button for Scene6
        this.scene6Button = createButton('Go to Scene6');
        this.scene6Button.position(50, height/2 + 150); // Below other debug buttons
        this.scene6Button.mousePressed(() => {
            if (this.videoEndButton) {
                this.videoEndButton.remove();
            }
            if (this.scene5Button) {
                this.scene5Button.remove();
            }
            if (this.scene6Button) {
                this.scene6Button.remove();
            }
            clear();
            background(0);
            let scene6 = new Scene6();
            scene6.preload();
            currentScene = scene6;
        });
        
        // Style the button (same as other debug buttons)
        this.scene6Button.style('background-color', '#4CAF50');
        this.scene6Button.style('border', 'none');
        this.scene6Button.style('color', 'white');
        this.scene6Button.style('padding', '15px 32px');
        this.scene6Button.style('text-align', 'center');
        this.scene6Button.style('text-decoration', 'none');
        this.scene6Button.style('display', 'inline-block');
        this.scene6Button.style('font-size', '16px');
        this.scene6Button.style('margin', '4px 2px');
        this.scene6Button.style('cursor', 'pointer');
        this.scene6Button.style('border-radius', '4px');
    }

    preload() {
        this.font = loadFont('./assets/fonts/ARCADE.TTF');
        this.backgroundImage = loadImage('./assets/backgrounds/introbg1.png');
    }

    draw() {
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
        if (this.isMouseOver(this.buttons.loadGame)) {
            console.log('Load Game clicked');
        }
        if (this.isMouseOver(this.buttons.beginJourney)) {
            // Remove all debug buttons before starting normal game flow
            if (this.videoEndButton) {
                this.videoEndButton.remove();
            }
            if (this.scene5Button) {
                this.scene5Button.remove();
            }
            if (this.scene6Button) {
                this.scene6Button.remove();
            }
            
            // Start normal game flow
            let scene2 = new Scene2();
            scene2.preload();
            currentScene = scene2;
        }
    }

    cleanup() {
        // Check if buttons exist before removing
        if (this.videoEndButton) {
            this.videoEndButton.remove();
        }
        if (this.scene5Button) {
            this.scene5Button.remove();
        }
        // ... any other cleanup code ...
    }
}
