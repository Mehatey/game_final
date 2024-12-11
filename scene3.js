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
    }

    preload() {
        this.hero.preload();
        this.hope.preload();
        this.dialogueBox.typingSound = loadSound('assets/sounds/typing.mp3');
        this.hurtSound = loadSound('assets/sounds/hurt.mp3');

        soundFormats('mp3');
        loadSound('assets/sounds/scary.mp3',
            (sound) => {
                this.narrationMusic = sound;
                this.narrationMusic.setVolume(0.5);
                this.narrationMusic.loop();
                this.assetsLoaded = true;
            }
        );
    }

    draw() {
        background(0);

        if (!this.assetsLoaded) return;

        if (this.dialogueState === 'intro') {
            this.drawIntroDialogue();
        } else if (this.dialogueState === 'heroDialogue') {
            this.hero.update();
            this.hero.draw();

            let currentDialogue = this.heroDialogues[this.currentDialogue];

            // Draw Hope if entered
            if (this.hopeEntered) {
                this.hope.update();
                let time = millis() * 0.001;
                this.hope.x = width / 2 + sin(time) * 100;
                this.hope.y = height / 2 + cos(time) * 50;
                this.hope.draw();
            }

            // Only start new dialogue if previous is complete
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                // First show current dialogue
                this.dialogueBox.startDialogue(
                    currentDialogue.text,
                    currentDialogue.speaker === 'hero' ? this.playerName : 'Hope'
                );

                // Check Hope's entry before incrementing
                if (currentDialogue.startHopeEntry && !this.hopeEntered) {
                    this.hope.startEntry();
                    this.hopeEntered = true;
                }

                // Then prepare for next dialogue
                this.currentDialogue++;
                if (this.currentDialogue < this.heroDialogues.length) {
                    currentDialogue = this.heroDialogues[this.currentDialogue];
                } else {
                    this.dialogueState = 'playing';
                    this.hope.startFadeOut();
                }
            }

            this.dialogueBox.update();
            this.dialogueBox.draw();
        } else if (this.dialogueState === 'playing') {
            this.hero.update();
            this.hero.draw();

            // Only draw words if not showing retry prompt
            if (!this.showRetryPrompt) {
                // Update and check words
                for (let i = this.words.length - 1; i >= 0; i--) {
                    let word = this.words[i];
                    word.update();
                    word.draw();

                    if (abs(word.x - this.hero.x) < 30 && abs(word.y - this.hero.y) < 30) {
                        if (this.hurtSound) {
                            this.hurtSound.play();
                        }
                        this.showRetryPrompt = true;
                        this.currentHopeQuote = random(this.hopeQuotes);
                        this.words = [];
                        break;  // Exit loop when hit
                    }
                }

                // Maintain fewer words (reduced from 35 to 20)
                if (this.words.length < 20) {
                    let word = this.negativeWords[floor(random(this.negativeWords.length))];
                    let spawnSide = floor(random(4));
                    let x, y;

                    switch (spawnSide) {
                        case 0: // top
                            x = random(width);
                            y = -50;
                            break;
                        case 1: // right
                            x = width + 50;
                            y = random(height);
                            break;
                        case 2: // bottom
                            x = random(width);
                            y = height + 50;
                            break;
                        case 3: // left
                            x = -50;
                            y = random(height);
                            break;
                    }

                    this.words.push(new Word(word, x, y));
                }
            }

            // Draw timer
            push();
            textAlign(CENTER, CENTER);
            textSize(32);
            fill(255);
            text(ceil(this.gameTimer), width/2, 50);
            pop();

            // Update timer
            if (frameCount % 60 === 0 && this.gameTimer > 0) {
                this.gameTimer--;
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
                text("Try Again?", width/2, height/2 - 80);
                
                // Draw hope quote with proper wrapping
                textSize(24);
                textWrap(WORD);
                textLeading(30);
                text(this.currentHopeQuote, width/2 - 200, height/2 - 20, 400);

                // Center retry button and text
                fill(0, 100, 255);
                rectMode(CENTER);
                rect(width/2, height/2 + 60, 120, 40, 10);
                fill(255);
                textSize(20);
                text("Retry", width/2, height/2 + 60);
                pop();
            }
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
        if (this.dialogueState === 'playing' && this.showRetryPrompt) {
            // Check if mouse is over retry button (using centered coordinates)
            let buttonX = width/2;
            let buttonY = height/2 + 60;
            let buttonWidth = 120;
            let buttonHeight = 40;
            
            if (mouseX > buttonX - buttonWidth/2 && 
                mouseX < buttonX + buttonWidth/2 && 
                mouseY > buttonY - buttonHeight/2 && 
                mouseY < buttonY + buttonHeight/2) {
                
                // Reset game state
                this.gameTimer = 15;  // Reset to original 15 seconds
                this.words = [];      // Clear existing words
                this.showRetryPrompt = false;  // Hide retry prompt
                
                // Spawn initial set of words
                for (let i = 0; i < 20; i++) {  // Start with 20 words
                    let word = this.negativeWords[floor(random(this.negativeWords.length))];
                    let spawnSide = floor(random(4));
                    let x, y;

                    switch (spawnSide) {
                        case 0: // top
                            x = random(width);
                            y = -50;
                            break;
                        case 1: // right
                            x = width + 50;
                            y = random(height);
                            break;
                        case 2: // bottom
                            x = random(width);
                            y = height + 50;
                            break;
                        case 3: // left
                            x = -50;
                            y = random(height);
                            break;
                    }

                    this.words.push(new Word(word, x, y));
                }
            }
        }
    }

    keyPressed() {
        if (this.dialogueState === 'playing') {
            // Add any playing state key interactions here
        }
    }

    // Add cleanup method to stop music when leaving scene
    cleanup() {
        if (this.narrationMusic && this.narrationMusic.isPlaying()) {
            this.narrationMusic.stop();
        }
    }
}
