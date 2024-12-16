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

        // Initialize buttons first
        this.buttons = {
            skipCinematic: {
                x: windowWidth / 4,
                y: windowHeight - 60,
                width: 350,
                height: 60,
                text: "SKIP CINEMATIC"
            },
            beginJourney: {
                x: windowWidth / 2,
                y: windowHeight - 60,
                width: 350,
                height: 60,
                text: "BEGIN JOURNEY"
            },
            straightToMainBattle: {
                x: (3 * windowWidth) / 4,
                y: windowHeight - 60,
                width: 350,
                height: 60,
                text: "MAIN BATTLE"
            }
        };

        // Manually set heroPosition to center and adjust
        this.heroPosition = {
            x: windowWidth / 2,
            y: windowHeight / 2 - 30,
            scale: 1 / 5,
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
        this.doorDuration = 5000;
        this.doorOpening = true;

        // Start blur after door starts opening
        this.blurAmount = 500;
        this.blurStartTime = this.doorStartTime;
        this.blurDuration = 5000;

        // Button timing
        this.buttonStartTime = millis();
        this.buttonDelay = 8000; // 8 seconds delay for buttons
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
        Object.values(this.soundEffects).forEach(sound => {
            if (sound && sound.isPlaying()) {
                sound.stop();
            }
        });
    }

    drawTitle() {
        textSize(144);

        let currentSpeed = 0.02; // Constant speed, no variations

        // Draw each letter
        for (let i = 0; i < this.title.length; i++) {
            let angle = (TWO_PI / this.title.length) * i;
            let radius = 250;
            let pos = this.titlePositions[i];
            
            // Set position in a circle around the hero (negative for clockwise)
            pos.x = this.heroPosition.x + cos(angle - frameCount * currentSpeed) * radius;
            pos.y = this.heroPosition.y + sin(angle - frameCount * currentSpeed) * radius;

            push();
            // Add glow effect to letters
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
            fill(255, 255);
            translate(pos.x, pos.y);
            rotate(-frameCount * currentSpeed); // Negative for clockwise rotation
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

        // Check for hover
        if (this.isMouseOverHero(hero)) {
            drawingContext.shadowBlur = 50; // Add glow effect
            drawingContext.shadowColor = 'rgba(255, 255, 255, 1)'; // Bright white glow
        } else {
            drawingContext.shadowBlur = 0;
        }

        // Add background shadow
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';

        // Use current hero image
        translate(hero.x, hero.y);
        scale(hero.flipped ? -hero.scale : hero.scale, hero.scale);
        imageMode(CENTER); // Center the image
        image(this.heroImages[this.currentHeroIndex], 0, 0); // Draw at the center
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
            // Black and white glow effect
            noStroke();
            // Black glow
            fill(0, 0, 0, 80);
            rect(button.x - button.width / 2 - 2,
                button.y - button.height / 2 - 2,
                button.width + 4,
                button.height + 4,
                5);
            // White glow
            fill(255, 255, 255, 40);
            rect(button.x - button.width / 2 - 1,
                button.y - button.height / 2 - 1,
                button.width + 2,
                button.height + 2,
                5);

            // Base yellow button with gradient
            drawingContext.save();
            let yellowGradient = drawingContext.createLinearGradient(
                button.x - button.width / 2,
                button.y - button.height / 2,
                button.x - button.width / 2,
                button.y + button.height / 2
            );
            yellowGradient.addColorStop(0, '#ffff00');  // Bright yellow at top
            yellowGradient.addColorStop(1, '#b3b300');  // Darker yellow at bottom
            drawingContext.fillStyle = yellowGradient;
            drawingContext.fillRect(
                button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height
            );

            // Inner corner shadows
            drawingContext.globalCompositeOperation = 'multiply';

            // Top-left corner shadow
            let cornerGradient = drawingContext.createRadialGradient(
                button.x - button.width / 2, button.y - button.height / 2, 0,
                button.x - button.width / 2, button.y - button.height / 2, 50
            );
            cornerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');  // Increased opacity
            cornerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            drawingContext.fillStyle = cornerGradient;
            drawingContext.fillRect(
                button.x - button.width / 2,
                button.y - button.height / 2,
                60,  // Increased shadow area
                60
            );

            // Bottom-right corner shadow
            cornerGradient = drawingContext.createRadialGradient(
                button.x + button.width / 2, button.y + button.height / 2, 0,
                button.x + button.width / 2, button.y + button.height / 2, 50
            );
            cornerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');  // Increased opacity
            cornerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            drawingContext.fillStyle = cornerGradient;
            drawingContext.fillRect(
                button.x + button.width / 2 - 60,  // Increased shadow area
                button.y + button.height / 2 - 60,
                60,
                60
            );

            // Enhanced noise overlay
            drawingContext.globalCompositeOperation = 'overlay';
            let noiseScale = 0.15;  // Increased noise scale
            loadPixels();
            for (let x = button.x - button.width / 2; x < button.x + button.width / 2; x += 2) {  // Step by 2 for performance
                for (let y = button.y - button.height / 2; y < button.y + button.height / 2; y += 2) {
                    let noiseVal = noise(x * noiseScale, y * noiseScale, frameCount * 0.03);
                    drawingContext.fillStyle = `rgba(255, 255, 255, ${noiseVal * 0.2})`;  // Increased noise visibility
                    drawingContext.fillRect(x, y, 2, 2);  // Larger noise pixels
                }
            }
            drawingContext.restore();
        } else {
            // Normal state - white button
            strokeWeight(3);
            stroke(200);
            fill(255, 255, 255, 230);
            rect(button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height);

            // 3D effect lines
            stroke(200);
            line(button.x - button.width / 2, button.y - button.height / 2,
                button.x + button.width / 2, button.y - button.height / 2);
            line(button.x - button.width / 2, button.y - button.height / 2,
                button.x - button.width / 2, button.y + button.height / 2);

            stroke(100);
            line(button.x + button.width / 2, button.y - button.height / 2,
                button.x + button.width / 2, button.y + button.height / 2);
            line(button.x - button.width / 2, button.y + button.height / 2,
                button.x + button.width / 2, button.y + button.height / 2);
        }

        // Button text
        fill(0);
        noStroke();
        textFont(this.font);
        textSize(24);
        textAlign(CENTER, CENTER);
        text(button.text, button.x, button.y + 2);

        // Arrow triangle
        fill(0);
        triangle(button.x + button.width / 2 - 20, button.y,
            button.x + button.width / 2 - 30, button.y - 10,
            button.x + button.width / 2 - 30, button.y + 10);

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

        // Create radial gradient
        let gradient = drawingContext.createRadialGradient(
            windowWidth / 2, windowHeight / 2, 0,
            windowWidth / 2, windowHeight / 2, windowWidth * 0.8
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

        // Apply gradient
        drawingContext.fillStyle = gradient;
        drawingContext.fillRect(0, 0, windowWidth, windowHeight);

        // Add a subtle vignette effect
        let vignetteGradient = drawingContext.createRadialGradient(
            windowWidth / 2, windowHeight / 2, windowHeight * 0.5,
            windowWidth / 2, windowHeight / 2, windowHeight
        );
        vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

        drawingContext.fillStyle = vignetteGradient;
        drawingContext.fillRect(0, 0, windowWidth, windowHeight);

        drawingContext.restore();
        pop();
    }

    isMouseOverButton(x, y, w, h) {
        return mouseX > x - w / 2 && mouseX < x + w / 2 &&
            mouseY > y - h / 2 && mouseY < y + h / 2;
    }

    cleanup() {
        if (this.sound && this.sound.isPlaying()) {
            this.sound.stop();
        }
    }

    drawCustomCursor() {
        noCursor(); // Hide the default cursor
        push();
        stroke(255, 255, 255, 255); // Full opacity stroke for outer circle
        strokeWeight(2);
        fill(this.isMouseOverAnyButton() ? 'yellow' : 'rgba(255, 255, 255, 204)'); // Yellow on hover, white otherwise
        drawingContext.shadowBlur = 10; // Slight glow
        drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)'; // White glow
        ellipse(mouseX, mouseY, 20, 20); // Outer circle

        // Inner circle with moving yellow and specific blue gradient
        this.gradientOffset += 0.05; // Increment gradient offset for animation
        let gradient = drawingContext.createRadialGradient(
            mouseX + cos(this.gradientOffset) * 5,
            mouseY + sin(this.gradientOffset) * 5,
            0,
            mouseX,
            mouseY,
            15
        );
        gradient.addColorStop(0, 'yellow');
        gradient.addColorStop(0.5, 'rgba(0, 128, 255, 0.8)'); // Specific blue color
        gradient.addColorStop(1, 'yellow');
        drawingContext.fillStyle = gradient;

        stroke(200); // Much lighter gray stroke
        strokeWeight(1); // 1 point stroke
        ellipse(mouseX, mouseY, 15, 15); // Inner circle
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

