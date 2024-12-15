class Scene1 {
    constructor() {
        this.font = null;
        this.backgroundImage = null;
        this.heroSprite = null;
        this.sound = null;
        this.playButton = {
            x: windowWidth / 2,
            y: windowHeight - 50,
            radius: 20
        };
        this.title = "SQUARUBE";
        this.titlePositions = [];
        this.heroPosition = {
            x: random(windowWidth),
            y: random(windowHeight),
            speedX: random([-3, 3]),
            speedY: random([-3, 3]),
            angle: random(TWO_PI),
            scale: 1,
            flipped: false,
            mass: 1.5,
            force: { x: 0, y: 0 }
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

        this.buttons = {
            skipCinematic: {
                x: windowWidth / 2,
                y: windowHeight / 2 - 50,
                width: 350,
                height: 60,
                text: "SKIP CINEMATIC",
                direction: 1
            },
            beginJourney: {
                x: windowWidth / 2,
                y: windowHeight / 2 + 30,
                width: 350,
                height: 60,
                text: "BEGIN JOURNEY",
                direction: 1
            },
            straightToMainBattle: {
                x: windowWidth / 2,
                y: windowHeight / 2 + 110,
                width: 350,
                height: 60,
                text: "MAIN BATTLE",
                direction: 1
            }
        };

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
    }

    preload() {
        this.font = loadFont('./assets/fonts/ARCADE.TTF');
        this.backgroundImage = loadImage('./assets/fantasy.gif');
        this.heroSprite = loadImage('./assets/characters/meh0/hero1still.png');
        
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

        // Animate each letter continuously
        for (let i = 0; i < this.title.length; i++) {
            let pos = this.titlePositions[i];

            push();
            // Oscillating opacity
            pos.opacity = map(sin(frameCount * 0.05 + i), -1, 1, 150, 255);
            fill(255, pos.opacity);

            // Smooth movement with momentum
            pos.x += pos.speedX;
            pos.y += pos.speedY;

            // Bounce off edges with slight randomization
            if (pos.x < 0 || pos.x > windowWidth) {
                pos.speedX *= -1;
                pos.speedX += random(-0.9, 0.9);
                pos.x = constrain(pos.x, 0, windowWidth);
            }
            if (pos.y < 0 || pos.y > windowHeight) {
                pos.speedY *= -1;
                pos.speedY += random(-0.9, 0.9);
                pos.y = constrain(pos.y, 0, windowHeight);
            }

            // Keep speeds within bounds
            pos.speedX = constrain(pos.speedX, -3, 5);
            pos.speedY = constrain(pos.speedY, -3, 5);

            // Warping effects
            translate(pos.x, pos.y);
            rotate(pos.angle);
            scale(pos.scale);
            pos.angle += pos.rotationSpeed;

            // Oscillating scale
            pos.scale = map(sin(frameCount * 0.02), -1, 1, 0.8, 1.2);

            // Draw the letter with glow effect
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
            text(this.title[i], 0, 0);
            pop();
        }
    }

    drawHeroSprite() {
        push();
        let hero = this.heroPosition;
        translate(hero.x, hero.y);
        scale(hero.flipped ? -1 : 1, 1);
        image(this.heroSprite, -60, -60, 120, 120); // Increased size
        pop();
    }

    draw() {
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
        this.titlePositions.forEach(letter => this.updateLetterMovement(letter));
        this.updateCharacterMovement(this.heroPosition);
        this.checkCollisions();
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
    }

    drawPlayButton() {
        push();
        if (this.isMouseOverCircle(this.playButton)) {
            drawingContext.shadowBlur = 20;
            drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
        }
        noFill();
        stroke(255);
        strokeWeight(3);
        ellipse(this.playButton.x, this.playButton.y, this.playButton.radius * 2);

        // Draw play icon
        fill(255);
        noStroke();
        let size = this.playButton.radius / 1.5;
        triangle(this.playButton.x - size / 2, this.playButton.y - size,
            this.playButton.x - size / 2, this.playButton.y + size,
            this.playButton.x + size, this.playButton.y);
        pop();
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

    mousePressed() {
        if (this.isMouseOver(this.buttons.skipCinematic)) {
            this.cleanup();
            switchScene(new Scene3());
        } else if (this.isMouseOver(this.buttons.beginJourney)) {
            this.cleanup();
            switchScene(new Scene2());
        } else if (this.isMouseOver(this.buttons.straightToMainBattle)) {
            this.cleanup();
            switchScene(new Scene6());
        }
    }

    checkCollisions() {
        this.titlePositions.forEach(letter => {
            let d = dist(letter.x, letter.y, this.heroPosition.x, this.heroPosition.y);

            if (d < 60) {
                // Strong collision response
                let angle = atan2(letter.y - this.heroPosition.y, letter.x - this.heroPosition.x);
                let force = 3; // Constant force for more visible effect

                // Apply force to letter
                letter.speedX += cos(angle) * force;
                letter.speedY += sin(angle) * force;

                // Apply opposite force to hero
                this.heroPosition.speedX -= cos(angle) * force * 0.5;
                this.heroPosition.speedY -= sin(angle) * force * 0.5;

                // Add some rotation to the letter
                letter.angle += random(-0.5, 0.5);
            }
        });
    }

    checkHoverEffects() {
        let mouseRadius = 100;
        let mouseForce = 2;

        // Apply hover effect to hero
        let dHero = dist(mouseX, mouseY, this.heroPosition.x, this.heroPosition.y);
        if (dHero < mouseRadius) {
            let angle = atan2(this.heroPosition.y - mouseY, this.heroPosition.x - mouseX);
            let force = map(dHero, 0, mouseRadius, mouseForce, 0);
            this.heroPosition.speedX += cos(angle) * force;
            this.heroPosition.speedY += sin(angle) * force;
        }

        // Apply hover effect to letters
        this.titlePositions.forEach(letter => {
            let d = dist(mouseX, mouseY, letter.x, letter.y);
            if (d < mouseRadius) {
                let angle = atan2(letter.y - mouseY, letter.x - mouseX);
                let force = map(d, 0, mouseRadius, mouseForce, 0);
                letter.speedX += cos(angle) * force;
                letter.speedY += sin(angle) * force;
            }
        });

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

    updateCharacterMovement(character) {
        // Base movement
        character.x += character.speedX;
        character.y += character.speedY;

        // Gradual direction changes
        if (frameCount % 240 === 0) {
            let targetAngle = random(TWO_PI);
            let targetSpeed = random(2, 4);
            character.speedX = lerp(character.speedX, cos(targetAngle) * targetSpeed, 0.05);
            character.speedY = lerp(character.speedY, sin(targetAngle) * targetSpeed, 0.05);
        }

        // Bounce off edges
        if (character.x < 0 || character.x > windowWidth) {
            character.speedX *= -0.8;
            character.flipped = !character.flipped;
            character.x = constrain(character.x, 0, windowWidth);
        }
        if (character.y < 0 || character.y > windowHeight) {
            character.speedY *= -0.8;
            character.y = constrain(character.y, 0, windowHeight);
        }

        // Light drag
        character.speedX *= 0.998;
        character.speedY *= 0.998;
    }

    updateLetterMovement(letter) {
        // Random movement changes
        if (frameCount % 60 === 0) {
            letter.speedX += random(-0.1, 0.1);
            letter.speedY += random(-0.1, 0.1);
        }

        // Apply forces
        letter.speedX += letter.force.x;
        letter.speedY += letter.force.y;

        // Gentle drag
        letter.speedX *= 0.99;
        letter.speedY *= 0.99;

        // Ensure minimum speed
        let speed = sqrt(letter.speedX * letter.speedX + letter.speedY * letter.speedY);
        if (speed < 0.1) {
            letter.speedX += random(-0.1, 0.1);
            letter.speedY += random(-0.1, 0.1);
        }

        // Update position
        letter.x += letter.speedX;
        letter.y += letter.speedY;
        letter.angle += letter.rotationSpeed;

        // Constrain speeds
        letter.speedX = constrain(letter.speedX, -1.5, 1.5);
        letter.speedY = constrain(letter.speedY, -1.5, 1.5);

        // Bounce off edges
        if (letter.x < 0 || letter.x > windowWidth) {
            letter.speedX *= -0.8;
            letter.x = constrain(letter.x, 0, windowWidth);
        }
        if (letter.y < 0 || letter.y > windowHeight) {
            letter.speedY *= -0.8;
            letter.y = constrain(letter.y, 0, windowHeight);
        }

        // Reset forces
        letter.force = { x: 0, y: 0 };
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
        return mouseX > x && mouseX < x + w && 
               mouseY > y && mouseY < y + h;
    }

    cleanup() {
        if (this.sound && this.sound.isPlaying()) {
            this.sound.stop();
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
