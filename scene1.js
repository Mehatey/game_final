class Scene1 {
    constructor() {
        this.font = null;
        this.backgroundImage = null;
        this.heroImages = [];
        this.currentHeroIndex = 0;
        this.lastHeroChange = millis();
        this.sound = null;
        this.playButton = {
            x: windowWidth / 2,
            y: windowHeight - 50,
            radius: 20
        };
        this.title = "SQUARUBE";
        this.titlePositions = [];

        // Initialize buttons with adjusted spacing and positioning
        let commonPadding = 20;
        let commonWidth = (windowWidth - (commonPadding * 2)) * 0.7;
        let buttonSpacing = 50;

        this.buttons = {
            straightToMainBattle: {
                x: windowWidth / 2 + (commonWidth / 3) + (buttonSpacing * 1.5),
                y: windowHeight - 80,
                width: commonWidth / 3,
                height: 80,
                text: "MAIN BATTLE"
            },
            skipCinematic: {
                x: windowWidth / 2 - (commonWidth / 3) - (buttonSpacing * 1.5),
                y: windowHeight - 80,
                width: commonWidth / 3,
                height: 80,
                text: "SKIP CINEMATIC"
            },
            beginJourney: {
                x: windowWidth / 2,
                y: windowHeight - 80,
                width: (commonWidth / 3) * 1.2 + 30,
                height: 80,
                text: "BEGIN JOURNEY"
            }
        };

        // Manually set heroPosition with increased padding
        this.heroPosition = {
            x: windowWidth / 2,
            y: windowHeight / 2 - 50,
            scale: 1 / 4,
            flipped: false
        };

        // Initialize letters with slower speeds
        for (let i = 0; i < this.title.length; i++) {
            this.titlePositions.push({
                x: random(windowWidth),
                y: random(windowHeight),
                speedX: random(-0.5, 0.5),
                speedY: random(-0.5, 0.5),
                angle: random(TWO_PI),
                rotationSpeed: random(-0.02, 0.02),
                mass: 1,
                opacity: random(150, 255),
                force: { x: 0, y: 0 }
            });
        }

        this.fadeAlpha = 255;
        this.fadeStartTime = millis();
        this.fadeInDuration = 3000; // 3 seconds fade in

        this.doorRadius = 0;
        this.doorStartTime = this.fadeStartTime + this.fadeInDuration;
        this.doorDuration = 8000;
        this.doorOpening = true;

        // Start blur after door starts opening
        this.blurAmount = 1000;
        this.blurStartTime = this.doorStartTime;
        this.blurDuration = 5000;

        // Button timing
        this.buttonStartTime = millis();
        this.buttonDelay = 15000; // 8 seconds delay for buttons
        this.showButtons = false;

        // Auto-play sound
        this.soundStarted = false;
        this.soundLoaded = false;

        this.playButtonClicked = false;

        // Initialize sound system
        this.soundEffects = {
            hurt: null,
            doubt: null,
            castle: null,
            firing: null
        };
        this.isCastleMusicPlaying = false;

        // Add button sound and hover state
        this.sounds = {
            button: null
        };
        this.buttonHovered = false;

        this.draggingLetter = null;
        this.offsetX = 0;
        this.offsetY = 0;

        this.gradientOffset = 0; // Initialize gradient offset
    }

    preload() {
        this.font = loadFont('./assets/fonts/ARCADE.TTF');
        this.backgroundImage = loadImage('./assets/fantasy.gif');
        this.heroImages = [
            loadImage('./assets/characters/meh0/hero1still.png'),
            loadImage('./assets/characters/meh0/hero1right.png'),
            loadImage('./assets/characters/meh0/hero1up.png'),
            loadImage('./assets/characters/meh0/hero1left.png')
        ];
        this.currentHeroIndex = 0;
        this.lastHeroChange = millis();

        // Fix sound path
        soundFormats('mp3');
        this.sound = loadSound('./assets/sounds/fantasy.mp3', () => {
            this.soundLoaded = true;
            console.log('Fantasy sound loaded');
        });

        // Load all sound effects
        this.soundEffects.hurt = loadSound('./assets/sounds/hurt.mp3');
        this.soundEffects.doubt = loadSound('./assets/sounds/doubt.mp3');
        this.soundEffects.castle = loadSound('./assets/sounds/castle.mp3');
        this.soundEffects.firing = loadSound('./assets/sounds/firing.mp3');

        // Add button sound loading
        this.sounds.button = loadSound('./assets/sounds/button.mp3');
    }

    // Sound control methods
    playSoundEffect(soundName) {
        if (this.soundEffects[soundName] && !this.soundEffects[soundName].isPlaying()) {
            this.soundEffects[soundName].play();
        }
    }

    startCastleMusic() {
        if (this.soundEffects.castle && !this.isCastleMusicPlaying) {
            this.soundEffects.castle.loop();
            this.isCastleMusicPlaying = true;
        }
    }

    stopCastleMusic() {
        if (this.soundEffects.castle && this.isCastleMusicPlaying) {
            this.soundEffects.castle.stop();
            this.isCastleMusicPlaying = false;
        }
    }

    // Clean up sounds when scene changes
    cleanup() {
        // First stop all active sounds
        if (this.sound && this.sound.isPlaying()) {
            this.sound.stop();
            this.sound.disconnect();
        }

        if (this.soundEffects) {
            Object.values(this.soundEffects).forEach(sound => {
                if (sound && sound.isPlaying()) {
                    sound.stop();
                    sound.disconnect();
                }
            });
        }

        if (this.sounds && this.sounds.button && this.sounds.button.isPlaying()) {
            this.sounds.button.stop();
            this.sounds.button.disconnect();
        }

        // Suspend and reset audio context
        getAudioContext().suspend();
        getAudioContext().close().then(() => {
            // Reset all sound-related flags
            this.soundStarted = false;
            this.buttonHovered = false;
            this.isCastleMusicPlaying = false;
        });

        // Remove any lingering audio elements from the DOM
        const allAudioElements = document.querySelectorAll('audio');
        allAudioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            audio.remove();
        });
    }

    drawTitle() {
        textSize(144);
        let currentSpeed = 0.03;
        let radius = 200;

        // Calculate the current revolution number (integer)
        let revolutionNumber = floor((frameCount * currentSpeed) / TWO_PI);
        
        // Determine color based on even/odd revolution number
        let color = (revolutionNumber % 2 === 0) ? '#FFFFFF' : '#7FDFFF'; // White on even, blue on odd
        
        // Reverse direction based on revolution number
        let direction = (revolutionNumber % 2 === 0) ? 1 : -1;

        // Draw each letter
        for (let i = 0; i < this.title.length; i++) {
            let angle = (TWO_PI / this.title.length) * i;
            let pos = this.titlePositions[i];

            // Set position in a circle around the hero, direction changes with color
            pos.x = this.heroPosition.x + cos(angle - (frameCount * currentSpeed * direction)) * radius;
            pos.y = this.heroPosition.y + sin(angle - (frameCount * currentSpeed * direction)) * radius;

            push();
            noStroke();

            // Add glow effect matching the current color
            drawingContext.shadowBlur = 20;
            drawingContext.shadowColor = color;

            // Fill with the same color
            fill(color);

            translate(pos.x, pos.y);
            textAlign(CENTER, CENTER);
            text(this.title[i], 0, 0);
            pop();
        }
    }

    isMouseOverLetter(pos) {
        let d = dist(mouseX, mouseY, pos.x, pos.y);
        return d < 50; // Adjust radius as needed
    }

    drawHeroSprite() {
        push();
        let hero = this.heroPosition;

        // Change hero image every 5 seconds
        if (millis() - this.lastHeroChange > 5000) {
            this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
            this.lastHeroChange = millis();
        }

        // Calculate glow intensity using sin wave for smooth pulsing
        // frameCount/120 gives us a 2-second cycle (assuming 60 FPS)
        let glowIntensity = map(sin(frameCount / 120), -1, 1, 5, 25);

        // Add pulsing white glow
        drawingContext.shadowBlur = glowIntensity;
        drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white

        // Check for hover (adds extra glow)
        if (this.isMouseOverHero(hero)) {
            drawingContext.shadowBlur = 50; // Stronger glow on hover
            drawingContext.shadowColor = 'rgba(255, 255, 255, 1)'; // Full white glow
        }

        // Use current hero image
        translate(hero.x, hero.y);
        scale(hero.flipped ? -hero.scale : hero.scale, hero.scale);
        imageMode(CENTER);
        image(this.heroImages[this.currentHeroIndex], 0, 0);
        pop();
    }

    isMouseOverHero(hero) {
        let d = dist(mouseX, mouseY, hero.x, hero.y);
        return d < 60 * hero.scale; // Adjust for increased size
    }

    draw() {
        console.log('Drawing scene');
        if (!this.soundStarted && this.soundLoaded && this.sound && !this.sound.isPlaying()) {
            this.sound.play();
            this.soundStarted = true;
        }

        // Calculate blur
        let blurElapsed = millis() - this.blurStartTime;
        if (blurElapsed >= 0 && blurElapsed < this.blurDuration) {
            this.blurAmount = map(blurElapsed, 0, this.blurDuration, 100, 0);
            drawingContext.filter = `blur(${this.blurAmount}px)`;
        }

        // Draw background and scene elements
        let scale = Math.max(windowWidth / this.backgroundImage.width, windowHeight / this.backgroundImage.height);
        let newWidth = this.backgroundImage.width * scale;
        let newHeight = this.backgroundImage.height * scale;
        let x = (windowWidth - newWidth) / 2;
        let y = (windowHeight - newHeight) / 2;

        if (this.doorOpening) {
            background(0);

            let elapsed = millis() - this.doorStartTime;
            if (elapsed > 0) {
                this.doorRadius = map(
                    elapsed,
                    0,
                    this.doorDuration,
                    0,
                    sqrt(sq(windowWidth) + sq(windowHeight))
                );

                push();
                drawingContext.save();

                // Circular mask
                drawingContext.beginPath();
                drawingContext.arc(
                    windowWidth / 2,
                    windowHeight / 2,
                    this.doorRadius,
                    0,
                    TWO_PI
                );
                drawingContext.clip();

                // Draw scene within mask
                image(this.backgroundImage, x, y, newWidth, newHeight);
                this.drawGradientOverlay();
                this.drawTitle();
                this.drawHeroSprite();
                this.drawPlayButton();
                this.drawPixelButton(this.buttons.skipCinematic);
                this.drawPixelButton(this.buttons.beginJourney);
                this.drawPixelButton(this.buttons.straightToMainBattle);

                drawingContext.restore();
                pop();

                if (elapsed >= this.doorDuration) {
                    this.doorOpening = false;
                }
            }
        } else {
            push();
            // Normal scene drawing
            image(this.backgroundImage, x, y, newWidth, newHeight);
            this.drawGradientOverlay();
            this.drawTitle();
            this.drawHeroSprite();
            this.drawPlayButton();
            this.drawPixelButton(this.buttons.skipCinematic);
            this.drawPixelButton(this.buttons.beginJourney);
            this.drawPixelButton(this.buttons.straightToMainBattle);
            pop();
        }

        // Update movements and collisions
        this.checkHoverEffects();

        // Initial fade from black
        let fadeElapsed = millis() - this.fadeStartTime;
        if (fadeElapsed < this.fadeInDuration) {
            this.fadeAlpha = map(fadeElapsed, 0, this.fadeInDuration, 255, 0);
            push();
            noStroke();
            fill(0, this.fadeAlpha);
            rect(0, 0, width, height);
            pop();
        }

        // Only show buttons if play button has been clicked
        if (this.playButtonClicked) {
            this.drawPixelButton(this.buttons.skipCinematic);
            this.drawPixelButton(this.buttons.beginJourney);
            this.drawPixelButton(this.buttons.straightToMainBattle);
        }

        this.drawCustomCursor(); // Draw the custom cursor
    }

    drawPlayButton() {
        // No play icon
    }

    isMouseOverCircle(button) {
        let d = dist(mouseX, mouseY, button.x, button.y);
        return d < button.radius;
    }

    animateButton(button) {
        // Continuous movement
        button.y += button.direction * 0.5;
        if (button.y > windowHeight / 2 + 150 || button.y < windowHeight / 2 - 150) {
            button.direction *= -1;
        }
    }

    drawPixelButton(button) {
        push();
        if (this.isMouseOver(button)) {
            // Hover state remains exactly the same
            push();
            drawingContext.globalCompositeOperation = 'source-over';
            
            strokeWeight(8);
            let strokeGradient = drawingContext.createLinearGradient(
                button.x - button.width / 2,
                button.y,
                button.x + button.width / 2,
                button.y
            );
            strokeGradient.addColorStop(0, 'rgb(0, 0, 0)');
            strokeGradient.addColorStop(1, 'rgb(40, 40, 40)');
            drawingContext.strokeStyle = strokeGradient;
            
            let gradient = drawingContext.createLinearGradient(
                button.x - button.width / 2,
                button.y,
                button.x + button.width / 2,
                button.y
            );
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 200, 0, 0.8)');
            drawingContext.fillStyle = gradient;
            
            rect(button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height,
                5);

            // Black inner shadow on hover
            drawingContext.shadowInset = true;
            drawingContext.shadowBlur = 25;
            drawingContext.shadowColor = 'rgba(0, 0, 0, 0.8)';
            drawingContext.shadowOffsetX = 0;
            drawingContext.shadowOffsetY = 0;
            rect(button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height,
                5);
            pop();
        } else {
            // Normal state with dark blue inner shadow
            push();
            strokeWeight(8);
            let strokeGradient = drawingContext.createLinearGradient(
                button.x - button.width / 2,
                button.y,
                button.x + button.width / 2,
                button.y
            );
            strokeGradient.addColorStop(0, 'rgb(0, 100, 150)');
            strokeGradient.addColorStop(1, 'rgb(0, 80, 120)');
            drawingContext.strokeStyle = strokeGradient;
            
            let fillGradient = drawingContext.createLinearGradient(
                button.x - button.width / 2,
                button.y,
                button.x + button.width / 2,
                button.y
            );
            fillGradient.addColorStop(0, 'rgba(127, 223, 255, 0.8)');
            fillGradient.addColorStop(1, 'rgba(127, 223, 255, 0.8)');
            drawingContext.fillStyle = fillGradient;
            
            rect(button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height,
                5);

            // Dark blue inner shadow (same technique as hover's black shadow)
            drawingContext.shadowInset = true;
            drawingContext.shadowBlur = 25;
            drawingContext.shadowColor = 'rgba(0, 80, 120, 0.8)';
            drawingContext.shadowOffsetX = 15; // Add some offset for gradient effect
            drawingContext.shadowOffsetY = 15;
            rect(button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height,
                5);

            // Second shadow from opposite direction for complete gradient
            drawingContext.shadowOffsetX = -15;
            drawingContext.shadowOffsetY = -15;
            rect(button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height,
                5);
            pop();
        }

        // Button text
        fill(0);
        noStroke();
        textFont(this.font);
        textSize(24);
        textAlign(CENTER, CENTER);
        text(button.text, button.x, button.y + 2);

        // Add triangle only for BEGIN JOURNEY button
        if (button.text === "BEGIN JOURNEY") {
            push();
            fill(this.isMouseOver(button) ? 0 : [0, 80, 120]); // Black on hover, dark blue normally
            noStroke();
            let textWidth = this.font.textBounds(button.text, button.x, button.y, 24).w;
            
            // Wider triangle with rounded corners
            beginShape();
            vertex(button.x + textWidth/2 + 10, button.y - 6);
            bezierVertex(
                button.x + textWidth/2 + 10, button.y - 6,
                button.x + textWidth/2 + 10, button.y + 6,
                button.x + textWidth/2 + 10, button.y + 6
            );
            vertex(button.x + textWidth/2 + 22, button.y);
            bezierVertex(
                button.x + textWidth/2 + 22, button.y,
                button.x + textWidth/2 + 10, button.y - 6,
                button.x + textWidth/2 + 10, button.y - 6
            );
            endShape(CLOSE);
            pop();
        }

        pop();
    }

    isMouseOver(button) {
        return mouseX > button.x - button.width / 2 &&
            mouseX < button.x + button.width / 2 &&
            mouseY > button.y - button.height / 2 &&
            mouseY < button.y + button.height / 2;
    }

    checkHoverEffects() {
        // Check button hover for sound
        Object.values(this.buttons).forEach(button => {
            if (this.isMouseOver(button)) {
                if (!this.buttonHovered && this.sounds.button) {
                    this.sounds.button.play();
                }
                this.buttonHovered = true;
                return;
            }
        });

        if (!Object.values(this.buttons).some(button => this.isMouseOver(button))) {
            this.buttonHovered = false;
        }
    }

    drawGradientOverlay() {
        push();
        drawingContext.save();
        drawingContext.globalCompositeOperation = 'multiply';

        // Increased alpha range (0.2-0.8 -> 0.1-0.9) for more dramatic effect
        let pulseAlpha = map(sin(frameCount * 0.02), -1, 1, 0.1, 0.9);

        // Create radial gradient with pulsing alpha
        let gradient = drawingContext.createRadialGradient(
            windowWidth / 2, windowHeight / 2, 0,
            windowWidth / 2, windowHeight / 2, windowWidth * 0.8
        );
        gradient.addColorStop(0, `rgba(0, 0, 0, ${pulseAlpha})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

        // Apply gradient
        drawingContext.fillStyle = gradient;
        drawingContext.fillRect(0, 0, windowWidth, windowHeight);

        // Add a subtle vignette effect with pulsing
        let vignetteGradient = drawingContext.createRadialGradient(
            windowWidth / 2, windowHeight / 2, windowHeight * 0.5,
            windowWidth / 2, windowHeight / 2, windowHeight
        );
        vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${pulseAlpha})`);

        drawingContext.fillStyle = vignetteGradient;
        drawingContext.fillRect(0, 0, windowWidth, windowHeight);

        drawingContext.restore();
        pop();
    }

    isMouseOverButton(x, y, w, h) {
        return mouseX > x - w / 2 && mouseX < x + w / 2 &&
            mouseY > y - h / 2 && mouseY < y + h / 2;
    }

    drawCustomCursor() {
        noCursor();
        push();
        
        // Largest background circle
        fill(255, 255, 255, 30); // Very translucent white
        noStroke();
        ellipse(mouseX, mouseY, 40, 40); // Increased from 30 to 40
        
        // Middle circle
        fill(255, 255, 255, 60);
        noStroke();
        ellipse(mouseX, mouseY, 25, 25); // Increased from 20 to 25
        
        // Outer circle with reduced stroke
        stroke(255, 255, 255, 255);
        strokeWeight(0.5);
        noFill();
        ellipse(mouseX, mouseY, 20, 20); // Increased from 15 to 20
        
        pop();
    }

    isMouseOverAnyButton() {
        return Object.values(this.buttons).some(button => this.isMouseOverButton(button.x, button.y, button.width, button.height));
    }

    drawButtons() {
        Object.values(this.buttons).forEach(button => {
            push();
            fill(255, 204); // 80% opacity
            rectMode(CENTER);
            rect(button.x, button.y, button.width, button.height);
            fill(0);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(button.text, button.x, button.y);
            pop();
        });
    }

    mousePressed() {
        // Check which button was clicked
        if (this.buttons.beginJourney && this.isMouseOver(this.buttons.beginJourney)) {
            this.cleanup();  // Add cleanup here before switching scene
            currentScene = new Scene2();
        }
        
        if (this.buttons.skipCinematic && this.isMouseOver(this.buttons.skipCinematic)) {
            this.cleanup();  // Add cleanup here before switching scene
            currentScene = new Scene3();
        }
        
        if (this.buttons.straightToMainBattle && this.isMouseOver(this.buttons.straightToMainBattle)) {
            this.cleanup();  // Add cleanup here before switching scene
            currentScene = new Scene6();
        }
    }
}
// Easing function for smooth animation
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            console.log('Button clicked'); // Log to verify click event
            const audio = new Audio('sounds/button.mp3');
            audio.play().catch(error => console.error('Audio playback failed:', error));
        });
    });
});

