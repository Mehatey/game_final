class Scene1 {
    constructor() {
        document.body.style.cursor = 'none';
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            element.style.cursor = 'none';
        });

        document.querySelectorAll('button').forEach(button => {
            button.style.cursor = 'none';
        });

        this.font = null;
        this.backgroundImage = null;
        this.heroImages = [];
        this.currentHeroIndex = 0;
        this.lastHeroChange = millis();
        this.sound = null;
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


        // Initialize hero position
        this.heroPosition = {
            x: windowWidth / 2,
            y: windowHeight / 2 - 50,
            scale: 1 / 4,
            flipped: false
        };

        // Initialize title positions
        this.title = "SQUARUBE";  // Make sure title is defined
        this.titlePositions = this.title.split('').map(() => ({
            x: width / 2,
            y: height / 2
        }));

        // Initialize letters with more dynamic starting positions and timing
        this.letters = "SQUARUBE".split('');
        console.log("Total letters:", this.letters.length);  // Should show 8
        this.letterAnimations = this.letters.map((letter, i) => ({
            opacity: 155,
            x: this.getRandomStartPosition('x'),
            y: this.getRandomStartPosition('y'),
            rotation: random(-PI, PI),
            targetX: 0,
            targetY: 0,
            scale: random(0.5, 2),
            speed: random(0.02, 0.09),
            active: false, // Controls when letter starts animating
            perspective: random(-0.5, 0.9) // Add perspective warping
        }));

        this.fadeAlpha = 255;
        this.fadeStartTime = millis();
        this.fadeInDuration = 1000;

        // Button timing
        this.buttonStartTime = millis();
        this.buttonDelay = 0; // 8 seconds delay for buttons
        this.showButtons = false;

        this.playButtonClicked = false;

        // Initialize sound system
        this.soundEffects = {
            hurt: null,
            doubt: null,
            castle: null,
            firing: null
        };

        // Add button sound and hover state
        this.sounds = {
            button: null
        };
        this.buttonHovered = false;

        this.draggingLetter = null;
        this.offsetX = 0;
        this.offsetY = 0;

        this.gradientOffset = 0; // Initialize gradient offset

        this.state = 'initial_play';  // New initial state
        this.coverImage = null;
        this.startTime = millis();
        this.titleSize = 180;  // Half of 360
        this.revealProgress = 0;

        this.revealedAreas = [];
        this.revealSize = 250;  // Increased from 200

        this.waveOffset = 0;
        this.waveSpeed = 0.005;  // Very slow for gentle movement
        this.waveAmplitude = 7;  // Small amplitude for subtle effect

        this.revealedLetters = 0;

        this.hobbitSound = new Audio('./assets/sounds/hobbit.mp3');

        this.initialState = true;

        // Add this to initialize soundPlayButton
        this.soundPlayButton = {
            x: width - 50,
            y: 50,
            radius: 20,
            hover: false,
            isPlaying: false
        };

        // Add a single shared sound instance at the class level
        this.buttonSound = loadSound('./assets/sounds/button.mp3');
        this.buttonHovered = false;
        this.letterButtonHovered = new Array(8).fill(false); // For 8 letters

        // Add new state properties
        this.artboardState = {
            x: 0,
            scrollSpeed: 5,  // Reduced from 8 to 6
            autoScroll: true,
            startDelay: 2000,
            startTime: null
        };

        // Add typewriter state
        this.typewriterState = {
            lines: [
                "This is a story of a square",
                "Who is lost and demands more from life",
                "He comes to Earth guided by hope",
                "To fight the evils in his mind.",
                "And has 6 insights that form his 6 sides",
                "As he evolves into a cube, changed forever."
            ],
            currentLine: 0,
            currentChar: 0,
            lineDelay: 500,
            lastTyped: 0,
            currentCharIndex: 0
        };


        // Add positions for scattered text
        this.scatteredPositions = this.typewriterState.lines.map(() => ({
            x: random(width * 0.2, width * 0.8),  // Keep text within visible area
            y: random(height * 0.2, height * 0.8)
        }));

        // Add overlay fade properties
        this.overlayAlpha = 0;
        this.targetOverlayAlpha = 0;
        this.overlayFadeSpeed = 0.1;  // Controls fade speed (0.1 = 0.5 seconds approx)

        // For thunder overlay
        this.thunderGif = null;
        this.lastThunderTime = 0;
        this.thunderDuration = 2500;  // Assuming thunder.gif is about 2.5 seconds
        this.thunderDelay = 0;    // 1 second delay between plays
        this.thunderPlayed = false;   // Track if initial thunder has played
        this.playButtonVisible = false;  // Track play button visibility
        this.backgroundFadeIn = 2000;    // For background fade in
        this.stateStartTime = null;   // Track when state starts


        // For rain sound
        this.rainSound = null;
        this.rainStarted = false;

        this.rainDrops = Array(800).fill().map(() => ({
            x: random(width),
            y: random(height),
            speed: random(6, 15),  // Back to original speed
            length: random(10, 20),
            opacity: random(50, 90)
        }));

        this.showInitialButton = true;  // New flag for initial button state
        this.initialButtonHovered = false;


        // Add dissolve effect properties
        this.dissolveStartTime = 0;
        this.dissolveProgress = 0;
        this.dissolveDuration = 5000; // 2 seconds

        // 2. Modify thunder properties
        this.thunderGif = null;
        this.thunder2Gif = null;
        this.lastThunderTime = 0;
        this.thunderDuration = 2500;
        this.thunderDelay = 0;  // Remove fixed delay
        this.thunderPlayed = false;  // Keep this

        this.playButton = {
            x: windowWidth / 2,
            y: windowHeight / 2 + 100,
            width: 160,
            height: 60,
            text: "START"
        };

        // Add this in the constructor, where other state properties are initialized
        this.hero3State = {
            x: 100,                    // Start from left side
            y: height * 0.8,          // Near bottom of screen
            speed: 2,                 // Reduced from 8 to 2 for slower movement
            direction: 'front',
            size: 200,
            images: {
                front: null,
                left: null,
                right: null,
                dance: null
            }
        };

        // If you have a rain visual effect, we can also adjust its parameters:
        this.rainSystem = {
            drops: 200,          // Increased number of drops
            speed: 15,           // Slightly faster
            thickness: 2,        // Slightly thicker drops
            opacity: 180         // More visible
        };

        // In constructor, remove any auto-playing sounds except rain
        this.rainSound = loadSound('./assets/sounds/rain.mp3', () => {
            // Don't auto-play, wait for Let's Go button
            this.rainLoaded = true;
        });

        // In constructor
        this.jokerSound = loadSound('./assets/sounds/joker.mp3');  // Remove auto-play callback

        // In constructor, add new sounds
        this.fearSound = loadSound('./assets/sounds/fear.mp3');
        this.empireSound = loadSound('./assets/sounds/Empire.mp3');

        // Add sound manager
        this.soundManager = {
            playSound: (sound) => {
                if (sound && !sound.isPlaying()) {
                    try {
                        sound.play();
                    } catch (e) {
                        console.log("Sound play failed, retrying...");
                        setTimeout(() => {
                            try {
                                sound.play();
                            } catch (e) {
                                console.log("Sound retry failed");
                            }
                        }, 100);
                    }
                }
            },
            stopSound: (sound) => {
                if (sound && sound.isPlaying()) {
                    try {
                        sound.stop();
                    } catch (e) {
                        console.log("Sound stop failed");
                    }
                }
            }
        };

        // Use soundManager instead of direct play/stop
        this.soundManager.playSound(this.buttonSound);
        this.soundManager.stopSound(this.rainSound);

        // Add event listener to prevent cursor showing on hover
        document.addEventListener('mouseover', (e) => {
            e.target.style.cursor = 'none';
        });
    }

    preload() {
        try {
            // Load assets
            this.font = loadFont('./assets/fonts/ARCADE.TTF');
            this.backgroundImage = loadImage('./assets/fantasy.gif');
            this.heroImages = [
                loadImage('./assets/characters/meh0/hero1still.png'),
                loadImage('./assets/characters/meh0/hero1right.png'),
                loadImage('./assets/characters/meh0/hero1up.png'),
                loadImage('./assets/characters/meh0/hero1left.png')
            ];
            this.artboardState.image = loadImage('./assets/backgrounds/Artboard1.png');

            // Load sounds once
            soundFormats('mp3');
            this.hobbitSound = loadSound('./assets/sounds/hobbit.mp3', () => {
                this.soundLoaded = true;
            });
            this.rainSound = loadSound('./assets/sounds/rain.mp3', () => {
                this.rainLoaded = true;
            });

            // Load other assets
            this.coverImage = loadImage('./assets/backgrounds/cover.png');
            this.state1Background = loadImage('./assets/backgrounds/state1cover.png');
            this.thunderGif = loadImage('./assets/backgrounds/thunder.gif');
            this.thunder2Gif = loadImage('./assets/backgrounds/thunder2.gif');
        } catch (e) {
            console.error('Error loading assets:', e);
        }
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
        let textH = textAscent() + textDescent();
        // Adjust hit area to match actual text bounds
        return d < textWidth(this.letters[0]) / 2 &&
            abs(mouseY - pos.y) < textH / 2;  // More precise vertical check
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
        if (this.showInitialButton) {
            background(0);

            // Draw "Let's Go" button
            let buttonWidth = 200;
            let buttonHeight = 60;
            let buttonX = width / 2;
            let buttonY = height / 2;

            let isHovered = mouseX > buttonX - buttonWidth / 2 &&
                mouseX < buttonX + buttonWidth / 2 &&
                mouseY > buttonY - buttonHeight / 2 &&
                mouseY < buttonY + buttonHeight / 2;

            push();
            if (isHovered) {
                drawingContext.shadowBlur = 20;
                drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
                fill(60, 60, 60, 230);
            } else {
                fill(40, 40, 40, 230);
            }

            noStroke();
            rectMode(CENTER);
            rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

            textAlign(CENTER, CENTER);
            textSize(24);
            fill(255);
            text("LET'S GO", buttonX, buttonY);
            pop();

            // Add hover sound effect
            if (isHovered && !this.initialButtonHovered) {
                if (this.buttonSound) {
                    this.buttonSound.play();
                }
                this.initialButtonHovered = true;
            } else if (!isHovered) {
                this.initialButtonHovered = false;
            }

            return;  // Don't proceed with rest of draw until button is clicked
        }

        if (this.initialState) {
            if (!this.dissolveStartTime) {
                this.dissolveStartTime = millis();
            }

            // Calculate dissolve progress
            this.dissolveProgress = constrain((millis() - this.dissolveStartTime) / this.dissolveDuration, 0, 1);

            // Draw background with dissolve effect
            if (this.state1Background) {
                push();
                tint(255, this.dissolveProgress * 255);
                image(this.state1Background, 0, 0, width, height);
                pop();
            }

            // Calculate current darkness level (based on time or any other factor)
            let currentTime = millis() * 0.001;  // Convert to seconds
            let darknessLevel = map(sin(currentTime * 0.5), -1, 1, 0.3, 0.9);  // Oscillate between light and dark

            // Only show thunder during dark periods
            if (darknessLevel > this.darknessThreshold) {
                let currentTime = millis();
                if (currentTime - this.lastThunderTime > this.thunderDuration) {
                    // Draw thunder with modified opacity and brightness
                    push();
                    tint(255 * this.thunderBrightness, this.thunderOpacity);
                    image(this.thunderGif, 0, -50, width, height + 100);
                    tint(255 * this.thunderBrightness, this.thunderOpacity * 0.25);
                    image(this.thunder2Gif, 0, -50, width, height + 100);
                    pop();

                    // Reset thunder timer
                    this.lastThunderTime = currentTime;
                }
            }

            // Draw rain with existing opacity
            drawingContext.globalCompositeOperation = 'screen';
            for (let drop of this.rainDrops) {
                stroke(255, drop.opacity);
                strokeWeight(1);
                line(drop.x, drop.y,
                    drop.x + drop.length / 2, drop.y + drop.length);

                drop.x = (drop.x + drop.speed / 2) % width;
                drop.y = (drop.y + drop.speed) % height;
            }

            // Increase the darkness range of the pulsating overlay (0.4 to 0.8 instead of 0.3 to 0.6)
            let overlayAlpha = map(sin(frameCount * 0.02), -1, 1, 0.2, 0.9);
            drawingContext.globalCompositeOperation = 'source-over';
            let gradient = drawingContext.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, width * 0.8
            );
            gradient.addColorStop(0, `rgba(0, 0, 0, ${overlayAlpha})`);
            gradient.addColorStop(0.7, `rgba(0, 0, 0, ${overlayAlpha + 0.15})`);
            gradient.addColorStop(1, `rgba(0, 0, 0, ${overlayAlpha + 0.25})`);

            drawingContext.fillStyle = gradient;
            drawingContext.fillRect(0, 0, width, height);

            // Show thunder when overlay is getting darker (threshold increased)
            if (overlayAlpha > 0.65) {  // Increased from 0.45 to 0.65
                let currentTime = millis();
                if (currentTime - this.lastThunderTime > this.thunderDuration) {
                    push();
                    drawingContext.globalCompositeOperation = 'lighten';
                    tint(255, 255);
                    image(this.thunderGif, 0, -50, width, height + 100);
                    tint(255, 25);
                    image(this.thunder2Gif, 0, -50, width, height + 100);
                    pop();

                    this.lastThunderTime = currentTime;
                }
            }

            // Only draw circle play button after 5 seconds
            if (!this.stateStartTime) {
                this.stateStartTime = millis();
            }
            let stateTime = millis() - this.stateStartTime;

            if (stateTime > 5000) {
                drawingContext.globalCompositeOperation = 'source-over';
                let buttonSize = 50;
                let buttonX = width - 50;
                let buttonY = 50;
                let isHovered = dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2;

                push();
                if (isHovered) {
                    // Hover state
                    drawingContext.shadowBlur = 20;
                    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    drawingContext.shadowOffsetY = 4;

                    // Inner shadow
                    let gradient = drawingContext.createRadialGradient(
                        buttonX, buttonY - 5, 0,  // Offset for 3D effect
                        buttonX, buttonY, buttonSize / 2
                    );
                    gradient.addColorStop(0, '#5AA1E3');
                    gradient.addColorStop(0.7, '#4A90E2');
                    gradient.addColorStop(1, '#2171CD');
                    drawingContext.fillStyle = gradient;
                } else {
                    // Rest state
                    let gradient = drawingContext.createRadialGradient(
                        buttonX, buttonY - 3, 0,
                        buttonX, buttonY, buttonSize / 2
                    );
                    gradient.addColorStop(0, 'rgba(80, 80, 80, 0.9)');
                    gradient.addColorStop(0.7, 'rgba(60, 60, 60, 0.9)');
                    gradient.addColorStop(1, 'rgba(40, 40, 40, 0.9)');
                    drawingContext.fillStyle = gradient;
                }

                noStroke();
                circle(buttonX, buttonY, buttonSize);

                // Draw play symbol with more padding and rounded edges
                fill(255);
                push();
                translate(buttonX + 2, buttonY);  // Center offset
                let triangleSize = buttonSize * 0.3;  // Smaller size ratio
                beginShape();
                vertex(-triangleSize / 2, -triangleSize / 2);
                bezierVertex(
                    -triangleSize / 2, -triangleSize / 2,
                    -triangleSize / 2, triangleSize / 2,
                    -triangleSize / 2, triangleSize / 2
                );
                vertex(triangleSize / 2, 0);
                bezierVertex(
                    triangleSize / 2, 0,
                    -triangleSize / 2, -triangleSize / 2,
                    -triangleSize / 2, -triangleSize / 2
                );
                endShape(CLOSE);
                pop();
            }

            return;
        }

        if (this.state === 'reveal') {
            this.drawSoundPrompt();
        } else if (this.state === 'artboard') {
            background(0);

            if (this.artboardState.image) {
                let scale = height / this.artboardState.image.height;
                let scaledWidth = this.artboardState.image.width * scale;

                // Initialize start time if not set
                if (!this.artboardState.startTime) {
                    this.artboardState.startTime = millis();
                }

                // Draw artboard
                image(this.artboardState.image, this.artboardState.x, 0, scaledWidth, height);

                // Only start scrolling after delay
                if (millis() - this.artboardState.startTime > 2000) {  // 2 second delay
                    if (this.artboardState.x > -scaledWidth) {
                        this.artboardState.x -= 5;  // Keep current scroll speed
                    }
                }

                // Update text based on scroll position
                let scrollProgress = -this.artboardState.x / (scaledWidth - width);
                let lineIndex = floor(scrollProgress * this.typewriterState.lines.length);
                this.typewriterState.currentLine = constrain(lineIndex, 0, this.typewriterState.lines.length - 1);

                // Check for transition to state 4
                if (this.artboardState.x <= -scaledWidth) {
                    this.state = 4;
                }

                // Draw text
                push();
                fill(255);
                textAlign(CENTER, BOTTOM);
                textSize(48);

                // Add glow and animations
                drawingContext.shadowBlur = 15;
                drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';
                let alpha = map(sin(frameCount * 0.03), -1, 1, 150, 255);
                fill(255, alpha);
                let size = map(sin(frameCount * 0.02), -1, 1, 44, 52);
                textSize(size);

                text(this.typewriterState.lines[this.typewriterState.currentLine],
                    width / 2, height - 50);
                pop();
            }
        } else {
            background(0);
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

            push();
            // Normal scene drawing
            image(this.backgroundImage, x, y, newWidth, newHeight);
            this.drawGradientOverlay();
            this.drawTitle();
            this.drawHeroSprite();
            this.drawPixelButton(this.buttons.skipCinematic);
            this.drawPixelButton(this.buttons.beginJourney);
            this.drawPixelButton(this.buttons.straightToMainBattle);
            pop();

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

            // Draw sound play button
            push();
            // Check hover state
            this.soundPlayButton.hover = dist(mouseX, mouseY, this.soundPlayButton.x, this.soundPlayButton.y) < this.soundPlayButton.radius;

            // Add blue glow on hover
            if (this.soundPlayButton.hover) {
                drawingContext.shadowBlur = 155;
                drawingContext.shadowColor = 'rgba(0, 150, 255, 0.7)';
            }

            // Smaller play triangle or pause bars
            fill(255);
            if (!this.soundPlayButton.isPlaying) {
                triangle(
                    this.soundPlayButton.x - 4, this.soundPlayButton.y - 6,
                    this.soundPlayButton.x - 4, this.soundPlayButton.y + 6,
                    this.soundPlayButton.x + 6, this.soundPlayButton.y
                );
            } else {
                rect(this.soundPlayButton.x - 4, this.soundPlayButton.y - 4, 2, 8);
                rect(this.soundPlayButton.x + 1, this.soundPlayButton.y - 4, 2, 8);
            }

            // Check hover state
            this.soundPlayButton.hover = dist(mouseX, mouseY, this.soundPlayButton.x, this.soundPlayButton.y) < this.soundPlayButton.radius;

            if (this.state === 'sound_prompt') {
                this.drawSoundPrompt();
            }
        }

        // Always draw custom cursor last
        push();
        CustomCursor.draw();
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
        if (this.state === 4) {
            push();
            if (this.isMouseOver(button)) {
                // Hover state with yellow gradient
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

                // Double shadow effect
                drawingContext.shadowInset = true;
                drawingContext.shadowBlur = 25;
                drawingContext.shadowColor = 'rgba(0, 80, 120, 0.8)';
                drawingContext.shadowOffsetX = 15;
                drawingContext.shadowOffsetY = 15;
                rect(button.x - button.width / 2,
                    button.y - button.height / 2,
                    button.width,
                    button.height,
                    5);

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

            // Add triangle for BEGIN JOURNEY button
            if (button.text === "BEGIN JOURNEY") {
                push();
                fill(this.isMouseOver(button) ? 0 : [0, 80, 120]);
                noStroke();
                let textWidth = this.font.textBounds(button.text, button.x, button.y, 24).w;

                beginShape();
                vertex(button.x + textWidth / 2 + 10, button.y - 6);
                bezierVertex(
                    button.x + textWidth / 2 + 10, button.y - 6,
                    button.x + textWidth / 2 + 10, button.y + 6,
                    button.x + textWidth / 2 + 10, button.y + 6
                );
                vertex(button.x + textWidth / 2 + 22, button.y);
                bezierVertex(
                    button.x + textWidth / 2 + 22, button.y,
                    button.x + textWidth / 2 + 10, button.y - 6,
                    button.x + textWidth / 2 + 10, button.y - 6
                );
                endShape(CLOSE);
                pop();
            }
            pop();
        } else {
            // Keep existing button styling for other states
            push();
            if (this.isMouseOver(button)) {
                fill(255);
                stroke(0);
                strokeWeight(3);
            } else {
                fill(0, 230);
                stroke(255);
                strokeWeight(3);
            }
            rect(button.x - button.width / 2,
                button.y - button.height / 2,
                button.width,
                button.height,
                5);

            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(24);
            text(button.text, button.x, button.y);
            pop();
        }
    }

    isMouseOver(button) {
        return mouseX > button.x - button.width / 2 &&
            mouseX < button.x + button.width / 2 &&
            mouseY > button.y - button.height / 2 &&
            mouseY < button.y + button.height / 2;
    }

    checkHoverEffects() {
        let isAnyButtonHovered = false;
        Object.values(this.buttons).forEach(button => {
            if (this.isMouseOver(button)) {
                isAnyButtonHovered = true;
                if (!this.buttonHovered) {
                    this.buttonHovered = true;
                    if (this.buttonSound && !this.buttonSound.isPlaying()) {
                        this.buttonSound.play();
                    }
                }
            }
        });

        if (!isAnyButtonHovered) {
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

    drawCustomCursor() {
        CustomCursor.draw();  // Use the cube cursor instead of circles
    }

    mousePressed() {
        // Resume audio context on user interaction
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }

        if (this.showInitialButton) {
            let buttonWidth = 200;
            let buttonHeight = 60;
            let buttonX = width / 2;
            let buttonY = height / 2;

            if (mouseX > buttonX - buttonWidth / 2 &&
                mouseX < buttonX + buttonWidth / 2 &&
                mouseY > buttonY - buttonHeight / 2 &&
                mouseY < buttonY + buttonHeight / 2) {

                // Ensure clean sound start
                if (this.rainSound && this.rainSound.isLoaded()) {
                    this.rainSound.stop();  // Stop any existing playback
                    this.rainSound.play();
                    this.rainSound.loop();
                }

                // Sequential sound playback
                if (this.fearSound && this.fearSound.isLoaded()) {
                    this.fearSound.play();

                    // Chain the other sounds
                    this.fearSound.onended(() => {
                        if (this.jokerSound) this.jokerSound.play();
                        this.jokerSound.onended(() => {
                            if (this.empireSound) this.empireSound.play();
                        });
                    });
                }

                this.showInitialButton = false;
                this.initialState = true;
                this.state = 'initial_play';
                return;
            }
            return;
        }

        if (this.initialState && !this.rainStarted && this.rainSound) {
            this.rainSound.play();
            this.rainSound.loop();
            this.rainStarted = true;
        }

        // In mousePressed(), update the triangle button handler
        if (this.initialState) {
            let buttonSize = 50;
            let buttonX = width - 50;
            let buttonY = 50;

            if (dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2) {
                console.log("Triangle button clicked"); // Debug log

                // Stop ALL state 1 sounds
                if (this.rainSound && this.rainSound.isPlaying()) {
                    this.rainSound.stop();
                }
                if (this.jokerSound && this.jokerSound.isPlaying()) {
                    this.jokerSound.stop();
                }
                if (this.fearSound && this.fearSound.isPlaying()) {
                    this.fearSound.stop();
                }
                if (this.empireSound && this.empireSound.isPlaying()) {
                    this.empireSound.stop();
                }

                // Start hobbit sound for state 2
                if (this.hobbitSound) {
                    this.hobbitSound.play();
                }

                // Update state
                this.initialState = false;
                this.state = 'reveal';
                this.showInitialButton = false;

                console.log("New state:", this.state); // Debug log
                return;
            }
        }

        // In mousePressed(), add the START button handler:
        if (this.state === 'reveal') {
            if (this.playButton) {
                let isHovered = mouseX > this.playButton.x - this.playButton.width / 2 &&
                    mouseX < this.playButton.x + this.playButton.width / 2 &&
                    mouseY > this.playButton.y - this.playButton.height / 2 &&
                    mouseY < this.playButton.y + this.playButton.height / 2;

                if (isHovered) {
                    // Transition to artboard state (state 3)
                    this.state = 'artboard';
                    this.artboardState.x = 0;  // Start from left edge instead of width
                    this.typewriterState.currentLine = 0;
                    this.textFadeStartTime = null;
                    this.hero3State.x = 100;  // Reset hero position
                    return;
                }
            }
        }

        // In mousePressed(), update state 4 button handlers
        if (this.state === 4) {
            try {
                // Skip Cinematic -> Scene3
                if (this.isMouseOver(this.buttons.skipCinematic)) {
                    console.log("Skip Cinematic clicked");
                    if (this.buttonSound) this.buttonSound.play();
                    this.cleanup();
                    currentScene = new Scene3();
                    if (currentScene.preload) currentScene.preload();
                    return;
                }

                // Begin Journey -> Scene2
                if (this.isMouseOver(this.buttons.beginJourney)) {
                    console.log("Begin Journey clicked");
                    if (this.buttonSound) this.buttonSound.play();
                    this.cleanup();
                    currentScene = new Scene2();
                    if (currentScene.preload) currentScene.preload();
                    return;
                }

                // Main Battle -> Scene6
                if (this.isMouseOver(this.buttons.straightToMainBattle)) {
                    console.log("Main Battle clicked");
                    if (this.buttonSound) this.buttonSound.play();
                    this.cleanup();
                    currentScene = new Scene6();
                    if (currentScene.preload) currentScene.preload();
                    return;
                }
            } catch (e) {
                console.error('Error in state 4 button handler:', e);
            }
        }
    }

    drawSoundPrompt() {
        if (this.state !== 'reveal') return;

        background(0);

        if (this.coverImage) {
            push();
            let scale = max(windowWidth / this.coverImage.width,
                windowHeight / this.coverImage.height);
            let w = this.coverImage.width * scale;
            let h = this.coverImage.height * scale;
            let x = (windowWidth - w) / 2;
            let y = (windowHeight - h) / 2;

            // Update wave offset
            this.waveOffset += this.waveSpeed;

            // Draw black background
            drawingContext.fillStyle = 'black';
            drawingContext.fillRect(0, 0, width, height);

            // Set up clipping for all revealed areas with wave effect
            drawingContext.save();
            drawingContext.beginPath();

            // Draw all revealed areas with wave distortion
            this.revealedAreas.forEach(area => {
                let waveX = area.x + sin(this.waveOffset + area.y * 0.01) * this.waveAmplitude;
                let waveY = area.y + cos(this.waveOffset + area.x * 0.01) * this.waveAmplitude;
                drawingContext.rect(waveX, waveY, area.width, area.height);
            });

            // Add current position to revealed areas
            this.revealedAreas.push({
                x: mouseX - this.revealSize / 2,
                y: mouseY - this.revealSize / 2,
                width: this.revealSize,
                height: this.revealSize
            });

            drawingContext.clip();

            // Draw image with slight wave effect
            let imageX = x + sin(this.waveOffset) * this.waveAmplitude * 0.5;
            let imageY = y + cos(this.waveOffset) * this.waveAmplitude * 0.5;
            image(this.coverImage, imageX, imageY, w, h);
            drawingContext.restore();

            // Track reveal progress
            this.revealProgress = min(this.revealProgress + 0.001, 1.0);
            pop();

            // Track reveal progress and time
            if (!this.revealStartTime && this.revealedAreas.length > 0) {
                this.revealStartTime = millis();  // Start timing when user first reveals
            }

            // Start typewriter after 3 seconds of revealing
            if (this.revealStartTime && millis() - this.revealStartTime > 3000 && !this.typewriterStarted) {
                this.typewriterStarted = true;
                this.typewriterIndex = 0;
                this.lastTypeTime = millis();
            }

            // Typewriter animation (keep existing code)
            if (this.typewriterStarted) {
                let currentTime = millis();
                if (currentTime - this.lastTypeTime > 1000) {
                    if (this.typewriterIndex < this.letters.length) {
                        this.letterAnimations[this.typewriterIndex].active = true;
                        this.letterAnimations[this.typewriterIndex].x = width / 2 - (this.letters.length * 80) / 2 + (this.typewriterIndex * 80);
                        this.letterAnimations[this.typewriterIndex].y = height * 0.5 + 100;
                        this.typewriterIndex++;
                        this.lastTypeTime = currentTime;
                    }
                }
            }

            // Add hover detection right before drawing letters
            this.letterAnimations.forEach((anim, i) => {
                // Check hover only on the exact letter pixels
                let letterBounds = this.font.textBounds(this.letters[i], anim.x, anim.y, 24 * anim.scale);
                anim.hover = mouseX > letterBounds.x &&
                    mouseX < letterBounds.x + letterBounds.w &&
                    mouseY > letterBounds.y &&
                    mouseY < letterBounds.y + letterBounds.h;

                // Assign original colors from our color array
                const colors = [
                    { r: 255, g: 100, b: 100 },  // Red
                    { r: 100, g: 255, b: 100 },  // Green
                    { r: 100, g: 100, b: 255 },  // Blue
                    { r: 255, g: 255, b: 100 },  // Yellow
                    { r: 255, g: 100, b: 255 },  // Magenta
                    { r: 100, g: 255, b: 255 },  // Cyan
                    { r: 255, g: 150, b: 50 },   // Orange
                    { r: 150, g: 50, b: 255 }    // Purple
                ];
                anim.hoverColor = colors[i % colors.length];
            });

            // Add overlay effect right after hover detection
            let isAnyLetterHovered = this.letterAnimations.some(anim => anim.hover);
            this.targetOverlayAlpha = isAnyLetterHovered ? 217 : 0;
            this.overlayAlpha = lerp(this.overlayAlpha, this.targetOverlayAlpha, this.overlayFadeSpeed);

            if (this.overlayAlpha > 0) {
                push();
                fill(0, 0, 0, this.overlayAlpha);
                rect(0, 0, width, height);
                pop();
            }

            // Then continue with existing letter drawing code
            this.letterAnimations.forEach((anim, i) => {
                if (!anim.active) return;

                let spacing = 160;
                let totalWidth = this.letters.length * spacing;
                let startX = width / 2 - totalWidth / 2 + (i * spacing);
                let targetY = height * 0.5 + 100;

                anim.x = startX;
                anim.y = targetY;
                anim.scale = 8;

                push();
                translate(anim.x, anim.y);

                if (anim.hover) {
                    let time = frameCount * 0.0001; // Much slower
                    let slowerTime = frameCount * 0.00005; // Much slower
                    let rotateX = sin(time) * 0.05; // Smaller rotation
                    let rotateY = cos(slowerTime) * 0.05;

                    drawingContext.transform(
                        1 + rotateX, 0,
                        rotateY, 1,
                        0, 0
                    );
                }

                textSize(24 * anim.scale);
                text(this.letters[i], 0, 0);
                pop();
            });
        }

        // Enhanced START button with thicker stroke and dynamic hover
        if (this.playButton && millis() - this.fadeStartTime > 1000) {
            push();
            this.playButton.x = width / 2;
            this.playButton.y = height - 100;

            let isHovered = mouseX > this.playButton.x - this.playButton.width / 2 &&
                mouseX < this.playButton.x + this.playButton.width / 2 &&
                mouseY > this.playButton.y - this.playButton.height / 2 &&
                mouseY < this.playButton.y + this.playButton.height / 2;

            const colors = [
                { r: 255, g: 100, b: 100 },  // Red
                { r: 100, g: 255, b: 100 },  // Green
                { r: 100, g: 100, b: 255 },  // Blue
                { r: 255, g: 255, b: 100 },  // Yellow
                { r: 255, g: 100, b: 255 },  // Magenta
                { r: 100, g: 255, b: 255 },  // Cyan
                { r: 255, g: 150, b: 50 },   // Orange
                { r: 150, g: 50, b: 255 }    // Purple
            ];

            let time = frameCount * 0.005;
            let index = floor(time) % colors.length;
            let nextIndex = (index + 1) % colors.length;
            let fraction = time - floor(time);

            let currentColor = {
                r: lerp(colors[index].r, colors[nextIndex].r, fraction),
                g: lerp(colors[index].g, colors[nextIndex].g, fraction),
                b: lerp(colors[index].b, colors[nextIndex].b, fraction)
            };

            if (isHovered) {
                fill(255);  // White fill
                stroke(0);  // Black stroke
                strokeWeight(3);  // Thicker stroke

                // Dynamic shadow effect
                let shadowSize = map(sin(frameCount * 0.05), -1, 1, 10, 20);
                drawingContext.shadowInset = true;
                drawingContext.shadowBlur = shadowSize;
                drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
                drawingContext.shadowOffsetX = 2;
                drawingContext.shadowOffsetY = 2;

                // Dynamic outer glow
                let glowSize = map(sin(frameCount * 0.05), -1, 1, 40, 60);
                drawingContext.shadowBlur = glowSize;
                drawingContext.shadowColor = 'rgba(0, 150, 255, 0.8)';
            } else {
                fill(0, 230);
                stroke(currentColor.r, currentColor.g, currentColor.b);
                strokeWeight(3);  // Thicker stroke

                let glowSize = map(sin(frameCount * 0.05), -1, 1, 40, 60);
                drawingContext.shadowBlur = glowSize;
                drawingContext.shadowColor = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.8)`;
            }

            rect(this.playButton.x - this.playButton.width / 2,
                this.playButton.y - this.playButton.height / 2,
                this.playButton.width,
                this.playButton.height,
                5);

            noStroke();
            textAlign(CENTER, CENTER);
            textSize(24);
            if (isHovered) {
                drawingContext.shadowColor = 'rgba(0, 0, 0, 0.8)';
                fill(0);  // Black text on hover
            } else {
                drawingContext.shadowColor = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.8)`;
                fill(currentColor.r, currentColor.g, currentColor.b);
            }
            text("START", this.playButton.x, this.playButton.y);
            pop();
        }

        // Only show other buttons after play is clicked
        if (this.playButtonClicked) {
            this.drawPixelButton(this.buttons.skipCinematic);
            this.drawPixelButton(this.buttons.beginJourney);
            this.drawPixelButton(this.buttons.straightToMainBattle);
        }

        // Draw custom cursor on top
        CustomCursor.draw();
    }

    // Add this helper method
    getRandomStartPosition(axis) {
        return random() < 0.5 ?
            random(-this[axis], 0) :
            random(this[axis], this[axis] * 2);
    }

    // Add cleanup method to Scene1 class
    cleanup() {
        try {
            // Stop sounds
            [this.rainSound, this.hobbitSound, this.buttonSound,
            this.jokerSound, this.fearSound, this.empireSound].forEach(sound => {
                if (sound && sound.isPlaying && sound.isPlaying()) {
                    try {
                        sound.stop();
                    } catch (e) {
                        console.error('Error stopping sound:', e);
                    }
                }
            });

            // Add cursor cleanup
            // document.body.style.cursor = 'default';  // Remove this line
        } catch (e) {
            console.error('Error in cleanup:', e);
        }
    }

    drawLetterAnimations() {
        if (this.state === 4 && Array.isArray(this.letterAnimations)) {
            this.letterAnimations.forEach((anim, i) => {
                if (!anim || !anim.active) return;

                try {
                    let spacing = 160;
                    let totalWidth = this.letters.length * spacing;
                    let startX = width / 2 - totalWidth / 2 + (i * spacing);
                    let targetY = height * 0.5 + 100;

                    anim.x = startX;
                    anim.y = targetY;
                    anim.scale = 8;

                    push();
                    translate(anim.x, anim.y);

                    if (anim.hover) {
                        let time = frameCount * 0.0001; // Much slower
                        let slowerTime = frameCount * 0.00005; // Much slower
                        let rotateX = sin(time) * 0.05; // Smaller rotation
                        let rotateY = cos(slowerTime) * 0.05;

                        drawingContext.transform(
                            1 + rotateX, 0,
                            rotateY, 1,
                            0, 0
                        );
                    }

                    textSize(24 * anim.scale);
                    text(this.letters[i], 0, 0);
                    pop();
                } catch (e) {
                    console.error('Error in letter animation:', e);
                }
            });
        }
    }
}

// Make sure Scene1 is available globally
window.Scene1 = Scene1;



