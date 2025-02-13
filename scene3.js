class Word {
    constructor(text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.speed = random(3, 8);
        this.size = random(20, 36);
        this.angle = random(TWO_PI);
        this.rotation = random(-0.05, 0.05);
        this.currentRotation = random(TWO_PI);
    }

    update() {
        // Move
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        this.currentRotation += this.rotation;

        // Bounce off edges
        if (this.x < -50) this.angle = PI - this.angle;
        if (this.x > width + 50) this.angle = PI - this.angle;
        if (this.y < -50) this.angle = -this.angle;
        if (this.y > height + 50) this.angle = -this.angle;
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.currentRotation);
        fill(255, 0, 0);
        textSize(this.size);
        textAlign(CENTER, CENTER);
        text(this.text, 0, 0);
        pop();
    }

    hits(hero) {
        let d = dist(this.x, this.y, hero.x, hero.y);
        return d < 30;
    }
}

class Scene3 {
    constructor() {
        this.assetsLoaded = false;
        this.hero = new Hero(width / 2, height / 2);
        this.hope = new Hope();
        this.dialogueBox = new DialogueBox();
        this.dialogueState = 'intro';
        this.introDialogues = [
            "A lone square has landed on an unfamiliar world",
            "Searching for answers, yet weighed down by doubt.",
            "Will it dare to step forward or turn back to safety?"
        ];
        this.heroDialogues = [
            { speaker: 'hero', text: "What am I even doing here? This was a mistake!" },
            { speaker: 'hero', text: "I don't belong on this planet. It feels wrong." },
            { speaker: 'hero', text: "Maybe I should just turn back before it's too late!" },
            { speaker: 'hope', text: "Ah, another soul at the crossroads, doubting every step." },
            { speaker: 'hero', text: "Who said that?! Who's there?", startHopeEntry: true },
            { speaker: 'hope', text: "I am Hope, and I'm here to see if you're ready to change." },
            { speaker: 'hope', text: "But change isn't handed to you. It's fought for, earned, and sometimes survived." },
            { speaker: 'hero', text: "What are you talking about? I don't even know where I am!" },
            { speaker: 'hope', text: "You've come this far, square one. Turning back now would be predictable." },
            { speaker: 'hope', text: "Survive the next 15 seconds, and we'll see if you're worth the effort." },
            { speaker: 'hero', text: "Survive what?! This doesn't make any sense!" },

        ];
        this.currentDialogue = 0;
        this.currentChar = 0;
        this.displayText = "";
        this.textOpacity = 255;
        this.typewriterSpeed = 4;
        this.displayDuration = 120;
        this.fadeSpeed = 3;
        this.timer = 0;
        this.state = 'typing';
        this.playerName = "Square";
        this.narrationMusic = null;
        this.hopeEntered = false;
        this.waitingForHopeEntry = false;
        this.currentIntroDialogue = 0;
        this.fadeInAlpha = 0;
        this.textFadeSpeed = 2;
        this.negativeWords = [
            "Fear", "Doubt", "Regret", "Failure", "Procrastination",
            "Anger", "Anxiety", "Sadness", "Comparison", "Distractions",
            "Perfectionism", "Impatience", "Overthinking", "Insecurity",
            "Laziness", "Excuses", "Isolation", "Judgment", "Stress", "Hopelessness"
        ];
        this.gameTimer = 15;
        this.words = [];
        this.gameStarted = false;
        this.hurtSound = null;
        this.showRetryPrompt = false;
        this.hopeQuotes = [
            "Believe in yourself. Every step forward is progress.",
            "The strongest souls emerge from the toughest battles.",
            "Your potential is greater than your doubts.",
            "Rise again, stronger than before.",
            "Every setback is a setup for a comeback."
        ];
        this.currentHopeQuote = "";
        this.hero.initialSize = 30;  // Store initial size
        this.hero.maxSize = 60;      // Maximum size hero can grow to
        this.hero.sizeIncrement = 2; // How much to grow on each hit

        // Initialize sound variable
        this.scarySound = null;

        // Add hopeEntry sound to constructor
        this.hopeEntrySound = null;

        // Add wordgame sound
        this.wordgameSound = null;

        // Add joker sound
        this.jokerSound = null;

        // Call preload immediately
        this.preload();

        this.doorWidth = 0;
        this.doorHeight = windowHeight;
        this.doorStartTime = millis();
        this.doorDuration = 0; // 4 seconds
        this.doorOpening = true;
        this.doorGlow = 0;
        this.warpLines = [];
        for (let i = 0; i < 50; i++) {
            this.warpLines.push({
                x: random(width),
                y: random(height),
                speed: random(5, 15),
                length: random(50, 150),
                alpha: random(100, 255)
            });
        }

        this.heroSpeed = 8;  // Increased from default speed (usually 5)
        this.typingSpeed = 2;  // Decreased from 3 for faster typing

        // In constructor, add Hope entry animation properties
        this.hopeEntryAnimation = {
            active: false,
            duration: Infinity,  // Animation continues until Hope leaves
            startTime: 0,
            glowRadius: 0,
            glowOpacity: 0,
            pulseSpeed: 0.8,
            rotationSpeed: 0.5
        };

        this.hopeParticles = [];  // Add particle array

        this.hopeBackgroundEffect = {
            active: false,
            opacity: 0,
            dissolveStart: false,
            targetOpacity: 180  // Increased brightness
        };
    }

    preload() {
        console.log("Scene3 preload started");
        this.hero.preload();
        this.hope.preload();

        // Initialize sounds using Howl
        this.dialogueBox.typingSound = new Howl({
            src: ['./assets/sounds/typing.mp3'],
            volume: 0.5,
            onload: () => console.log("Typing sound loaded"),
            onloaderror: (id, err) => console.error("Error loading typing sound:", err)
        });

        this.hopeEntrySound = new Howl({
            src: ['./assets/sounds/hopeentry.mp3'],
            volume: 0.5,
            onload: () => console.log("Hope entry sound loaded"),
            onloaderror: (id, err) => console.error("Error loading hope entry sound:", err)
        });

        this.hurtSound = new Howl({
            src: ['./assets/sounds/hurt.mp3'],
            volume: 0.5,
            onload: () => console.log("Hurt sound loaded"),
            onloaderror: (id, err) => console.error("Error loading hurt sound:", err)
        });

        this.scarySound = new Howl({
            src: ['./assets/sounds/scary.mp3'],
            volume: 0.3,
            loop: true,
            onload: () => {
                console.log("Scary sound loaded");
                this.scarySound.play();
                this.assetsLoaded = true;
            },
            onloaderror: (id, err) => console.error("Error loading scary sound:", err)
        });

        // Add wordgame sound
        this.wordgameSound = new Howl({
            src: ['./assets/sounds/wordgame.mp3'],
            volume: 0.5,
            loop: true,
            onload: () => console.log("Wordgame sound loaded"),
            onloaderror: (id, err) => console.error("Error loading wordgame sound:", err)
        });

        // Add joker sound
        this.jokerSound = new Howl({
            src: ['./assets/sounds/joker.mp3'],
            volume: 0.5,
            loop: true,
            onload: () => console.log("Joker sound loaded"),
            onloaderror: (id, err) => console.error("Error loading joker sound:", err)
        });
    }

    draw() {
        // Create dark gradient background first
        let c1 = color(0, 0, 0);      // Pure black
        let c2 = color(40, 40, 40);   // Dark gray

        // Draw gradient
        for (let y = 0; y < height; y++) {
            let inter = map(y, 0, height, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            line(0, y, width, y);
        }

        // Draw yellow background effect immediately after gradient
        if (this.hopeBackgroundEffect.active) {
            push();
            if (!this.hopeBackgroundEffect.dissolveStart) {
                this.hopeBackgroundEffect.opacity = min(
                    this.hopeBackgroundEffect.opacity + 3,
                    this.hopeBackgroundEffect.targetOpacity
                );
            } else {
                this.hopeBackgroundEffect.opacity = max(
                    this.hopeBackgroundEffect.opacity - 3,
                    0
                );

                if (this.hopeBackgroundEffect.opacity <= 0) {
                    this.hopeBackgroundEffect.active = false;
                }
            }

            // Draw the background with current opacity
            noStroke();
            fill(255, 255, 0, this.hopeBackgroundEffect.opacity);
            rect(0, 0, width, height);
            pop();
        }

        if (!this.assetsLoaded) {
            console.log("Waiting for assets to load...");
            return;
        }

        // Add custom cursor
        CustomCursor.draw();

        if (this.dialogueState === 'intro') {
            this.drawIntroDialogue();
        } else if (this.dialogueState === 'heroDialogue') {
            this.hero.update();
            this.hero.draw();

            // Only proceed if we have valid dialogue
            if (this.currentDialogue < this.heroDialogues.length) {
                let currentDialogue = this.heroDialogues[this.currentDialogue];

                // Draw Hope if entered
                if (this.hopeEntered) {
                    this.hope.update();
                    let time = millis() * 0.001;
                    this.hope.x = width * 0.25 + sin(time) * 50;
                    this.hope.y = height / 2 + cos(time) * 25;
                    this.hope.draw();
                }

                // Only start new dialogue if previous is complete
                if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                    // Check Hope's entry before starting new dialogue
                    if (currentDialogue.startHopeEntry && !this.hopeEntered) {
                        this.hope.startEntry();
                        this.hopeEntered = true;
                        this.hopeEntryAnimation.active = true;
                        this.hopeBackgroundEffect.active = true;  // Activate background effect
                        if (this.hopeEntrySound) {
                            this.hopeEntrySound.play();
                            // Start dissolve when music ends
                            this.hopeEntrySound.once('end', () => {
                                this.hopeBackgroundEffect.dissolveStart = true;
                            });
                        }
                    }

                    // Start new dialogue
                    this.dialogueBox.startDialogue(
                        currentDialogue.text,
                        currentDialogue.speaker === 'hero' ? this.playerName : 'Hope'
                    );
                    this.currentDialogue++;
                }

                this.dialogueBox.update();
                this.dialogueBox.draw();
            } else {
                // Move to playing state when dialogues are done
                this.dialogueState = 'playing';
                this.hope.startFadeOut();
                this.hopeEntered = false;
                this.hopeEntryAnimation.active = false;

                // Start joker sound when transitioning to word game
                if (this.jokerSound) {
                    this.jokerSound.play();
                    this.jokerSound.volume(0.5);  // Adjust volume if needed
                }

                // Start wordgame sound
                if (this.wordgameSound) {
                    this.wordgameSound.play();
                }
            }
        } else if (this.dialogueState === 'playing') {
            // Check for game completion first
            if (this.gameTimer <= 0 && !this.showRetryPrompt) {
                // Player won! Stop all gameplay and show victory screen
                this.gameCompleted = true;
                this.words = [];  // Clear all words

                // Draw victory screen
                push();
                fill(0, 0, 0, 200);
                rect(0, 0, width, height);

                textAlign(CENTER, CENTER);
                fill(255);
                textSize(32);
                text("You survived!", width / 2, height / 2 - 40);
                textSize(24);
                text("Click anywhere to continue...", width / 2, height / 2 + 40);
                pop();

                // Stop wordgame sound
                if (this.wordgameSound && this.wordgameSound.playing()) {
                    this.wordgameSound.stop();
                }

                // Stop joker sound
                if (this.jokerSound) {
                    this.jokerSound.stop();
                }

                return;  // Exit the draw loop here to prevent further game updates
            }

            // Only continue with game logic if not completed
            if (!this.gameCompleted) {
                this.hero.update();
                this.hero.draw();

                // Update and check words
                for (let i = this.words.length - 1; i >= 0; i--) {
                    let word = this.words[i];
                    word.update();
                    word.draw();

                    if (this.checkCollision(word)) {
                        if (this.hurtSound) this.hurtSound.play();
                        if (this.wordgameSound) this.wordgameSound.stop();
                        if (this.jokerSound) this.jokerSound.stop();
                        this.showRetryPrompt = true;
                        this.currentHopeQuote = random(this.hopeQuotes);
                        this.words = [];
                        break;
                    }
                }

                // Draw timer
                push();
                textAlign(CENTER, CENTER);
                textSize(32);
                fill(255);
                text(ceil(this.gameTimer), width / 2, 50);
                pop();

                // Update timer
                if (frameCount % 60 === 0 && this.gameTimer > 0) {
                    this.gameTimer--;
                }

                // Only spawn new words if game is still active
                if (this.words.length < 17 && this.gameTimer > 0) {
                    if (random() < 0.8) {
                        let word = this.negativeWords[floor(random(this.negativeWords.length))];
                        let spawnSide = floor(random(4));
                        let x, y, angle;

                        switch (spawnSide) {
                            case 0: // top
                                x = random(width);
                                y = -50;
                                angle = random(PI / 4, 3 * PI / 4);
                                break;
                            case 1: // right
                                x = width + 50;
                                y = random(height);
                                angle = random(3 * PI / 4, 5 * PI / 4);
                                break;
                            case 2: // bottom
                                x = random(width);
                                y = height + 50;
                                angle = random(5 * PI / 4, 7 * PI / 4);
                                break;
                            case 3: // left
                                x = -50;
                                y = random(height);
                                angle = random(-PI / 4, PI / 4);
                                break;
                        }

                        // Create word with direction toward center
                        let newWord = new Word(word, x, y);
                        let centerX = width / 2;
                        let centerY = height / 2;
                        let dx = centerX - x;
                        let dy = centerY - y;
                        let dist = Math.sqrt(dx * dx + dy * dy);
                        newWord.velocityX = (dx / dist) * 1.5;
                        newWord.velocityY = (dy / dist) * 1.5;
                        this.words.push(newWord);
                    }
                }
            }

            // Draw retry prompt if active
            if (this.showRetryPrompt) {
                // Darken background
                push();
                fill(0, 0, 0, 200);
                rect(0, 0, width, height);

                // Center all text
                textAlign(CENTER, CENTER);

                // Draw retry prompt
                fill(255);
                textSize(32);
                text("Try Again?", width / 2, height / 2 - 80);

                // Draw hope quote with proper wrapping
                textSize(24);
                textWrap(WORD);
                textLeading(30);
                text(this.currentHopeQuote, width / 2 - 200, height / 2 - 20, 400);

                // Center retry button and text
                fill(0, 100, 255);
                rectMode(CENTER);
                rect(width / 2, height / 2 + 60, 120, 40, 10);
                fill(255);
                textSize(20);
                text("Retry", width / 2, height / 2 + 60);
                pop();
            }
        }

        // Draw Hope's entry animation BEFORE drawing Hope
        if (this.hopeEntered && this.hopeEntryAnimation.active) {
            push();
            let time = millis() * 0.001;

            // More dynamic glow effects with reduced size
            let baseRadius = 70;  // Reduced from 100
            let pulseSpeed = 2;
            let rotationSpeed = 0.5;

            // Draw multiple layers of circles with different behaviors
            for (let i = 0; i < 12; i++) {
                let t = time + i * 0.3;
                let pulseFactor = sin(t * pulseSpeed) * 0.3 + 0.7;
                let radius = baseRadius * (1 + i * 0.15) * pulseFactor;  // Reduced multiplier from 0.2 to 0.15
                let alpha = map(sin(t * 1.5), -1, 1, 0.2, 0.8);

                // Add some chaos to the rotation
                let rotation = time * rotationSpeed + noise(t * 0.5, i) * TWO_PI;

                // Alternate between blue and white with varying opacity
                let isBlue = i % 2 === 0;
                let glowColor = isBlue ?
                    `rgba(0, 100, 255, ${alpha})` :
                    `rgba(255, 255, 255, ${alpha})`;

                push();
                translate(this.hope.x, this.hope.y);
                rotate(rotation);

                // Draw main circle
                noFill();
                stroke(glowColor);
                strokeWeight(2 + noise(t, i) * 2);
                drawingContext.shadowBlur = 30 + noise(t * 2, i) * 20;
                drawingContext.shadowColor = glowColor;

                // Add distortion to circle shape
                beginShape();
                for (let a = 0; a < TWO_PI; a += 0.2) {
                    let xoff = map(cos(a), -1, 1, 0, 0.5);
                    let yoff = map(sin(a), -1, 1, 0, 0.5);
                    let r = radius * (1 + noise(xoff, yoff, t * 0.5) * 0.2);
                    let x = r * cos(a);
                    let y = r * sin(a) * 0.8; // Slightly elliptical
                    vertex(x, y);
                }
                endShape(CLOSE);

                // Add radiating particles occasionally
                if (frameCount % 3 === 0 && random() < 0.2) {
                    let particleAngle = random(TWO_PI);
                    let particleRadius = radius * random(0.6, 0.9);
                    this.hopeParticles.push(new HopeParticle(
                        this.hope.x + cos(particleAngle) * particleRadius,
                        this.hope.y + sin(particleAngle) * particleRadius,
                        particleAngle
                    ));
                }
                pop();
            }
            pop();

            // Update and draw particles
            this.hopeParticles = this.hopeParticles.filter(particle => {
                let isAlive = particle.update();
                if (isAlive) particle.draw();
                return isAlive;
            });
        }

        // Draw Hope after the entry animation
        if (this.hopeEntered) {
            this.hope.draw();
        }
    }

    drawIntroDialogue() {
        push();
        textAlign(CENTER, CENTER);
        textSize(36);
        fill(255, this.textOpacity);
        text(this.displayText, width / 2, height / 2);
        pop();

        switch (this.state) {
            case 'typing':
                if (frameCount % 2 === 0) {
                    if (this.currentChar < this.introDialogues[this.currentDialogue].length) {
                        if (this.currentChar === 0) {
                            this.dialogueBox.typingSound.play();
                        }
                        this.displayText += this.introDialogues[this.currentDialogue][this.currentChar];
                        this.currentChar++;
                    } else {
                        this.state = 'displaying';
                        this.timer = 0;
                        this.dialogueBox.typingSound.stop();
                    }
                }
                break;

            case 'displaying':
                this.timer++;
                if (this.timer >= this.displayDuration) {
                    this.state = 'fading';
                }
                break;

            case 'fading':
                this.textOpacity -= this.fadeSpeed;
                if (this.textOpacity <= 0) {
                    this.currentDialogue++;
                    if (this.currentDialogue >= this.introDialogues.length) {
                        this.dialogueState = 'heroDialogue';
                        this.currentDialogue = 0;
                        this.dialogueBox.startDialogue(this.heroDialogues[0].text, this.playerName);
                    } else {
                        this.displayText = "";
                        this.currentChar = 0;
                        this.textOpacity = 255;
                        this.state = 'typing';
                    }
                }
                break;
        }
    }

    mousePressed() {
        if (this.dialogueState === 'playing') {
            if (this.showRetryPrompt) {
                // Check if mouse is over retry button (using centered coordinates)
                let buttonX = width / 2;
                let buttonY = height / 2 + 60;
                let buttonWidth = 120;
                let buttonHeight = 40;

                if (mouseX > buttonX - buttonWidth / 2 &&
                    mouseX < buttonX + buttonWidth / 2 &&
                    mouseY > buttonY - buttonHeight / 2 &&
                    mouseY < buttonY + buttonHeight / 2) {

                    // Reset game state
                    this.gameTimer = 15;  // Reset to original 15 seconds
                    this.words = [];      // Clear existing words
                    this.showRetryPrompt = false;  // Hide retry prompt

                    // Spawn initial set of words
                    for (let i = 0; i < 14; i++) {  // Increased from 12 to 14 initial words
                        let word = this.negativeWords[floor(random(this.negativeWords.length))];
                        let spawnSide = floor(random(4));
                        let x, y, angle;

                        switch (spawnSide) {
                            case 0: // top
                                x = random(width);
                                y = -50;
                                angle = random(PI / 4, 3 * PI / 4);  // Angle downward
                                break;
                            case 1: // right
                                x = width + 50;
                                y = random(height);
                                angle = random(3 * PI / 4, 5 * PI / 4);  // Angle leftward
                                break;
                            case 2: // bottom
                                x = random(width);
                                y = height + 50;
                                angle = random(5 * PI / 4, 7 * PI / 4);  // Angle upward
                                break;
                            case 3: // left
                                x = -50;
                                y = random(height);
                                angle = random(-PI / 4, PI / 4);  // Angle rightward
                                break;
                        }

                        // Create word with direction toward center
                        let newWord = new Word(word, x, y);
                        let centerX = width / 2;
                        let centerY = height / 2;
                        let dx = centerX - x;
                        let dy = centerY - y;
                        let dist = Math.sqrt(dx * dx + dy * dy);
                        newWord.velocityX = (dx / dist) * 1.5;  // Reduced from 2 to 1.5
                        newWord.velocityY = (dy / dist) * 1.5;  // Reduced from 2 to 1.5
                        this.words.push(newWord);
                    }
                }
            } else if (this.gameCompleted) {
                console.log("Attempting to transition to Scene4");
                this.cleanup();
                try {
                    currentScene = new Scene4();
                    if (currentScene.preload) {
                        currentScene.preload();
                    }
                    console.log("Successfully created Scene4");
                } catch (error) {
                    console.error("Error creating Scene4:", error);
                }
            }
        }
    }

    keyPressed() {
        if (this.namePrompt) {
            if (keyCode === ENTER && this.playerName.length > 0) {
                this.namePrompt = false;
                this.showHero = true;
                this.showIntroText = true;
            } else if (keyCode === BACKSPACE) {
                this.playerName = this.playerName.slice(0, -1);
            } else if (keyCode !== ENTER && this.playerName.length < 15) {
                this.playerName += key;
            }
        }
    }

    // Add cleanup method to stop music when leaving scene
    cleanup() {
        // Stop all Howl instances
        if (this.dialogueBox && this.dialogueBox.typingSound) {
            this.dialogueBox.typingSound.stop();
        }

        if (this.hurtSound) {
            this.hurtSound.stop();
        }

        if (this.scarySound) {
            this.scarySound.stop();
        }

        // Unload sounds to free memory
        if (this.dialogueBox && this.dialogueBox.typingSound) {
            this.dialogueBox.typingSound.unload();
        }
        if (this.hurtSound) {
            this.hurtSound.unload();
        }
        if (this.scarySound) {
            this.scarySound.unload();
        }

        // Add wordgame sound cleanup
        if (this.wordgameSound) {
            this.wordgameSound.stop();
            this.wordgameSound.unload();
        }

        // Add joker sound cleanup
        if (this.jokerSound) {
            this.jokerSound.stop();
            this.jokerSound.unload();
        }
    }

    checkCollision(word) {
        // Get hero hitbox (using hero's actual size)
        let heroHitbox = {
            left: this.hero.x - this.hero.size / 3,    // Use 1/3 of hero size for tighter hitbox
            right: this.hero.x + this.hero.size / 3,
            top: this.hero.y - this.hero.size / 3,
            bottom: this.hero.y + this.hero.size / 3
        };

        // Get word hitbox
        let wordWidth = textWidth(word.text);
        let wordHeight = textAscent() + textDescent();
        let wordHitbox = {
            left: word.x - wordWidth / 2,
            right: word.x + wordWidth / 2,
            top: word.y - wordHeight / 2,
            bottom: word.y + wordHeight / 2
        };

        // Check for overlap
        let collision = !(heroHitbox.right < wordHitbox.left ||
            heroHitbox.left > wordHitbox.right ||
            heroHitbox.bottom < wordHitbox.top ||
            heroHitbox.top > wordHitbox.bottom);

        if (collision) {
            console.log("Collision detected!"); // Debug log
            this.showRetryPrompt = true;
            this.currentHopeQuote = random(this.hopeQuotes);
            if (this.hurtSound) this.hurtSound.play();
            if (this.wordgameSound) this.wordgameSound.stop();
            if (this.jokerSound) this.jokerSound.stop();
            return true;
        }
        return false;
    }

    updateDialogue() {
        if (this.currentDialogue < this.heroDialogues.length) {
            let dialogue = this.heroDialogues[this.currentDialogue];

            // Speed up typing by reducing frame delay
            if (frameCount % this.typingSpeed === 0) {  // Using typingSpeed from constructor
                if (this.currentChar < dialogue.text.length) {
                    this.displayText += dialogue.text.charAt(this.currentChar);
                    this.currentChar++;
                } else if (!this.waitingForNext) {
                    this.waitingForNext = true;
                    setTimeout(() => {
                        this.currentDialogue++;
                        this.currentChar = 0;
                        this.displayText = "";
                        this.waitingForNext = false;
                    }, 1500);  // Reduced wait time between dialogues
                }
            }
        }
    }
}

// Update HopeParticle class for subtler particles
class HopeParticle {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = random(1, 3);  // Reduced speed
        this.size = random(2, 8);   // Smaller size
        this.alpha = 200;           // Start less bright
        this.color = random() > 0.5 ? color(0, 100, 255) : color(255);
        this.opacity = random(0.2, 0.5);  // Lower opacity range
    }

    update() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        this.alpha -= 3;  // Fade out faster
        return this.alpha > 0;
    }

    draw() {
        push();
        noStroke();
        fill(this.color.levels[0], this.color.levels[1],
            this.color.levels[2], this.alpha * this.opacity);
        circle(this.x, this.y, this.size);
        pop();
    }
}
