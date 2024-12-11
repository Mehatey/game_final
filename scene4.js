class Scene4 {
    constructor() {
        this.assetsLoaded = false;
        this.hero = new Hero(width / 2, height / 2);
        this.hope = new Hope();
        this.dialogueBox = new DialogueBox();
        this.currentDialogue = 0;
        this.background = null;
        this.dialogues = [
            { speaker: 'hope', text: "Well, look at you. Survived 15 seconds. Not bad, square one." },
            { speaker: 'hero', text: "What was that?! Things flying at me? What's the point of this?" },
            { speaker: 'hope', text: "The point? Growth isn't easy. Those were just the whispers of your doubts." },
            { speaker: 'hope', text: "And look around now see what happens when you push past fear." },
            { speaker: 'hero', text: "Wow This place. It's beautiful. I didn't notice before." },
            { speaker: 'hope', text: "Of course you didn't. Fear blinds. Doubt muffles." },
            { speaker: 'hope', text: "Answer these six questions, and we'll see the real obstacles holding you back." },

            { speaker: 'hero', text: "Fine. Let's go." }
        ];
        this.playerName = "Square";
        this.narrationMusic = null;
        this.currentQuestion = 0;
        this.questions = [
            {
                question: "What is your biggest internal challenge?",
                options: ["Overthinking", "Impatience", "Low self-esteem", "Difficulty staying focused"]
            },
            {
                question: "What is the hardest emotion for you to handle?",
                options: ["Anxiety", "Anger", "Sadness", "Regret"]
            },
            {
                question: "What do you value most in life right now?",
                options: ["Personal growth", "Meaningful relationships", "Financial stability", "Living in the moment"]
            },
            {
                question: "Which of these habits do you wish you could change?",
                options: ["Procrastinating until the last minute", "Seeking perfection in everything", "Comparing yourself to others", "Saying yes to too many things"]
            },
            {
                question: "What would help you feel more in control of your life?",
                options: ["A clear plan for the future", "Breaking free from bad habits", "Finding a supportive community", "Overcoming self-doubt"]
            },
            {
                question: "Whats your biggest obstacle right now?",
                options: ["Finances", "Fear of failure", "Lack of motivation", "Distractions"]
            }
        ];
        this.inputBox = null;
        this.nameEntered = '';
        this.showingPostDialogue = false;
        this.postDialogues = [
            { speaker: 'hope', text: "Interesting. Your answers paint quite the picture." },
            { speaker: 'hero', text: "What do you mean? What picture?" },
            { speaker: 'hope', text: "These questions aren't just words. They are the map of your struggles." },
            { speaker: 'hero', text: "You're saying my thoughts are going to start attacking me again?" },
            { speaker: 'hope', text: "Exactly. But you're not without a weapon." },
            { speaker: 'hero', text: "This is what I was waiting for?" },
            { speaker: 'hope', text: "Press the spacebar, square one, and fire their name." }
        ];
        this.currentPostDialogue = 0;
        this.cannonName = '';
        this.cannonPosition = null;
        this.cannonDirection = createVector(0, -1); // Default direction
        this.cannonActive = false;
        this.cannonFlash = false;
    }

    preload() {
        this.background = loadImage('assets/backgrounds/bg9.gif');
        this.hero.preload();
        this.hope.preload();
        this.dialogueBox.typingSound = loadSound('assets/sounds/typing.mp3');

        // Load and play ambient music
        soundFormats('mp3');
        loadSound('assets/sounds/ambient.mp3',
            (sound) => {
                this.narrationMusic = sound;
                this.narrationMusic.setVolume(0.5);
                this.narrationMusic.loop();
                this.assetsLoaded = true;
            }
        );
    }

    draw() {
        if (!this.assetsLoaded) return;

        // Clear the canvas and draw background
        background(0);
        if (this.background) {
            push();
            imageMode(CORNER);
            image(this.background, 0, 0, width, height);
            pop();
        }

        // Draw characters
        this.hero.update();
        this.hero.draw();

        this.hope.update();
        let time = millis() * 0.001;
        this.hope.x = width / 2 + sin(time) * 100;
        this.hope.y = height / 2 + cos(time) * 50;
        this.hope.draw();

        if (this.currentDialogue < this.dialogues.length) {
            // Show initial dialogues
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                let dialogue = this.dialogues[this.currentDialogue];
                this.dialogueBox.typingSpeed = 1;
                this.dialogueBox.startDialogue(
                    dialogue.text,
                    dialogue.speaker === 'hero' ? this.playerName : 'Hope'
                );
                this.currentDialogue++;
            }
        } else if (this.currentQuestion < this.questions.length) {
            // Show questions
            this.showQuestion();
        } else if (!this.showingPostDialogue) {
            // Show final question
            this.showFinalQuestion();
        } else {
            // Show post-input dialogues
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.currentPostDialogue < this.postDialogues.length) {
                    let dialogue = this.postDialogues[this.currentPostDialogue];
                    this.dialogueBox.typingSpeed = 1;
                    this.dialogueBox.startDialogue(
                        dialogue.text,
                        dialogue.speaker === 'hero' ? this.playerName : 'Hope'
                    );
                    this.currentPostDialogue++;
                }
            }
        }

        // Draw cannon if active
        if (this.cannonActive) {
            this.drawCannon();

            // Check if cannon has reached the edge and stop music
            if (this.cannonPosition.x > width) {
                if (this.narrationMusic && this.narrationMusic.isPlaying()) {
                    console.log("Stopping ambient music");
                    this.narrationMusic.stop();
                    this.narrationMusic = null;
                }
            }
        }

        this.dialogueBox.update();
        this.dialogueBox.draw();
    }

    keyPressed() {
        if (key === ' ') {
            this.activateCannon();
        }
    }

    cleanup() {
        if (this.narrationMusic) {
            this.narrationMusic.setLoop(false);
            this.narrationMusic.stop();
            this.narrationMusic = null;
        }

        if (this.inputBox) {
            this.inputBox.remove();
            this.inputBox = null;
        }
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showFinalQuestion();
            return;
        }

        let q = this.questions[this.currentQuestion];

        // Calculate dynamic box size with more padding
        let boxWidth = 900; // Increased width
        let boxHeight = 200 + q.options.length * 70; // Increased height and spacing

        // Draw main box
        fill(0, 100, 255, 230); // Hope's box color
        stroke(0, 70, 180);
        strokeWeight(4);
        rectMode(CENTER);
        rect(width / 2, height / 2, boxWidth, boxHeight, 20); // Increased corner radius

        // Draw question text
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(32); // Increased question text size
        text(q.question, width / 2, height / 2 - boxHeight / 2 + 80); // Adjusted position

        // Draw options
        for (let i = 0; i < q.options.length; i++) {
            let y = height / 2 - boxHeight / 2 + 160 + i * 70; // Adjusted spacing

            // Check hover state
            let isHovered = mouseX > width / 2 - boxWidth / 2 + 40 &&
                mouseX < width / 2 + boxWidth / 2 - 40 &&
                mouseY > y - 25 && mouseY < y + 25;

            // Draw option button
            fill(isHovered ? 'yellow' : 'white');
            stroke(0);
            strokeWeight(2);
            rect(width / 2, y, boxWidth - 80, 50, 8); // Increased button size

            // Draw option text
            fill(0);
            noStroke();
            textSize(24); // Increased option text size
            text(q.options[i], width / 2, y);
        }
    }

    showFinalQuestion() {
        if (!this.inputBox) {
            console.log("Creating input box");
            this.inputBox = createInput('');
            this.inputBox.position(width / 2 - 150, height / 2 + 20);
            this.inputBox.size(300, 40);
            this.inputBox.style('font-size', '20px');
            this.inputBox.style('padding', '10px');
            this.inputBox.style('border-radius', '8px');
            this.inputBox.style('font-family', 'ARCADE');
            this.inputBox.style('cursor', 'pointer');

            this.inputBox.mousePressed(() => {
                console.log("Input box clicked");
                this.inputBox.elt.focus();
            });

            this.inputBox.input(() => {
                console.log("Input value:", this.inputBox.value());
                this.nameEntered = this.inputBox.value();
            });

            this.inputBox.elt.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.inputBox.value().trim() !== '') {
                    console.log("Enter pressed, name entered:", this.inputBox.value());
                    this.nameEntered = this.inputBox.value();
                    this.inputBox.remove();
                    this.inputBox = null;
                    this.showingPostDialogue = true;
                    localStorage.setItem('cannonName', this.nameEntered);
                }
            });
        }

        // Draw the blue box and text
        fill(0, 100, 255, 230);
        stroke(0, 70, 180);
        strokeWeight(4);
        rectMode(CENTER);
        rect(width / 2, height / 2, 800, 200, 20);

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(28);
        text("Enter the name of a person who has helped you\nthe most in your life", width / 2, height / 2 - 50);
    }

    mousePressed() {
        if (this.currentDialogue >= this.dialogues.length) {
            if (this.currentQuestion < this.questions.length) {
                let q = this.questions[this.currentQuestion];
                let boxWidth = 800;
                let boxHeight = 300 + q.options.length * 70;
                for (let i = 0; i < q.options.length; i++) {
                    let y = height / 2 - boxHeight / 2 + 160 + i * 70;
                    if (mouseX > width / 2 - boxWidth / 2 + 40 &&
                        mouseX < width / 2 + boxWidth / 2 - 40 &&
                        mouseY > y - 25 && mouseY < y + 25) {
                        this.currentQuestion++;
                        break;
                    }
                }
            }
        }
    }

    activateCannon() {
        this.cannonName = this.nameEntered;
        this.cannonPosition = createVector(this.hero.x, this.hero.y);
        this.cannonDirection = createVector(1, 0);
        this.cannonActive = true;

        // Immediately stop the music and remove loop
        if (this.narrationMusic) {
            this.narrationMusic.setLoop(false);
            this.narrationMusic.stop();
            this.narrationMusic = null;
        }
    }

    drawCannon() {
        if (this.cannonActive) {
            this.cannonFlash = !this.cannonFlash;

            push();
            translate(this.cannonPosition.x, this.cannonPosition.y);

            // Add recoil effect
            let recoil = sin(frameCount * 0.8) * 3;
            translate(recoil, 0);

            // Missile body (yellow rectangle with rounded ends)
            fill(255, 255, 0); // Bright yellow
            stroke(70); // Dark gray outline
            strokeWeight(2);
            rectMode(CENTER);
            let textWidth = this.cannonName.length * 15;
            rect(0, 0, textWidth + 40, 40, 10);

            // Missile nose cone (yellow semicircle)
            fill(255, 255, 0);
            stroke(70);
            strokeWeight(2);
            arc(textWidth / 2 + 20, 0, 40, 40, -HALF_PI, HALF_PI);

            // Trailing streaks
            for (let i = 0; i < 5; i++) {
                let alpha = map(i, 0, 5, 255, 0);
                let streakLength = map(i, 0, 5, 20, 5);
                stroke(255, 50, 0, alpha);
                strokeWeight(4 - i / 2);
                line(-textWidth / 2 - 20 - i * 10, -5 + sin(frameCount * 0.2 + i) * 3,
                    -textWidth / 2 - 20 - streakLength - i * 10, -5 + sin(frameCount * 0.2 + i) * 3);
                line(-textWidth / 2 - 20 - i * 10, 5 + cos(frameCount * 0.2 + i) * 3,
                    -textWidth / 2 - 20 - streakLength - i * 10, 5 + cos(frameCount * 0.2 + i) * 3);
            }

            // Flame effect
            if (this.cannonFlash) {
                for (let i = 0; i < 3; i++) {
                    fill(255, 50, 0, 150 - i * 50);
                    let flameSize = 20 - i * 5;
                    ellipse(-textWidth / 2 - 25 - i * 8, 0, flameSize, flameSize);
                }
            }

            // Text
            fill(0); // Black text
            textSize(24); // Slightly smaller
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text(this.cannonName, 0, 0);

            pop();

            // Move the cannon
            this.cannonPosition.add(p5.Vector.mult(this.cannonDirection, 12));

            // When cannon reaches edge, transition to Scene5
            if (this.cannonPosition.x > width) {
                this.cannonActive = false;
                this.transitionToScene5();
            }
        }
    }

    transitionToScene5() {
        if (this.narrationMusic && this.narrationMusic.isPlaying()) {
            this.narrationMusic.stop();
            this.narrationMusic.disconnect();
        }

        // Stop all sounds and reset audio context
        getAudioContext().suspend();
        getAudioContext().close().then(() => {
            const allSounds = document.querySelectorAll('audio');
            allSounds.forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
            switchScene(new Scene5());
        });
    }
}
