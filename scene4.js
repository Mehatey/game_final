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

            { speaker: 'hero', text: "Let's do it." }
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
            { speaker: 'hero', text: "Well aren't you a wise one?" },
            { speaker: 'hope', text: "These questions are the map of your struggles." },
            { speaker: 'hero', text: "Fuck are my thoughts going to start attacking me again?" },
            { speaker: 'hope', text: "Exactly. But you're not without a weapon." },
            { speaker: 'hero', text: "Let's go! this is what I was waiting for" },
            { speaker: 'hope', text: "Press the spacebar, and fire their name." }
        ];
        this.currentPostDialogue = 0;
        this.cannonName = '';
        this.cannonPosition = null;
        this.cannonDirection = createVector(0, -1); // Default direction
        this.cannonActive = false;
        this.cannonFlash = false;

        // Initialize game music with Howler
        this.gameMusic = new Howl({
            src: ['./assets/sounds/gamemusic.mp3'],
            volume: 0.5,
            loop: true,
            onload: () => {
                console.log("Game music loaded");
                this.gameMusic.play(); // Start playing immediately
                this.assetsLoaded = true;
            },
            onloaderror: (id, err) => console.error("Error loading game music:", err)
        });

        // Initialize typing sound with Howler
        this.dialogueBox.typingSound = new Howl({
            src: ['./assets/sounds/typing.mp3'],
            volume: 0.3,
            loop: true,
            onload: () => console.log("Typing sound loaded"),
            onloaderror: (id, err) => console.error("Error loading typing sound:", err)
        });

        // Add button hover sound
        this.buttonSound = new Howl({
            src: ['./assets/sounds/button.mp3'],
            volume: 0.3,
            onload: () => console.log("Button sound loaded"),
            onloaderror: (id, err) => console.error("Error loading button sound:", err)
        });

        // Add firing sound
        this.firingSound = new Howl({
            src: ['./assets/sounds/firing.mp3'],
            volume: 0.5,
            onload: () => console.log("Firing sound loaded"),
            onloaderror: (id, err) => console.error("Error loading firing sound:", err)
        });

        this.hasFirstCannonFired = false;
        this.sceneTransitionTimer = null;

        this.doorWidth = 0;
        this.doorHeight = windowHeight;
        this.doorStartTime = millis();
        this.doorDuration = 4000; // 4 seconds
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
    }

    preload() {
        this.background = loadImage('assets/backgrounds/bg9.gif');
        this.hero.preload();
        this.hope.preload();
    }

    draw() {
        if (this.doorOpening) {
            background(0);
            
            let elapsed = millis() - this.doorStartTime;
            if (elapsed > 0) {
                // Draw warp speed effect
                push();
                strokeWeight(2);
                for (let warpLine of this.warpLines) {
                    stroke(255, 255, 255, warpLine.alpha);
                    warpLine.x += warpLine.speed;
                    if (warpLine.x > width) warpLine.x = 0;
                    
                    let angle = atan2(height/2 - warpLine.y, width/2 - warpLine.x);
                    let startX = warpLine.x;
                    let startY = warpLine.y;
                    let endX = warpLine.x + cos(angle) * warpLine.length;
                    let endY = warpLine.y + sin(angle) * warpLine.length;
                    
                    line(startX, startY, endX, endY);
                }
                pop();

                // Calculate portal size
                this.doorWidth = map(
                    elapsed,
                    0,
                    this.doorDuration,
                    0,
                    windowWidth * 0.7
                );

                push();
                drawingContext.save();
                
                // Create portal shape
                translate(width/2, height/2);
                beginShape();
                for (let a = 0; a < TWO_PI; a += 0.1) {
                    let xoff = map(cos(a + frameCount * 0.05), -1, 1, 0, 0.2);
                    let yoff = map(sin(a + frameCount * 0.05), -1, 1, 0, 0.2);
                    let r = this.doorWidth/2;
                    let x = r * cos(a) + noise(xoff, yoff, frameCount * 0.02) * 20;
                    let y = r * sin(a) + noise(xoff, yoff + 5, frameCount * 0.02) * 20;
                    vertex(x, y);
                }
                endShape(CLOSE);
                
                // Add glow and portal effects
                drawingContext.shadowBlur = 30;
                drawingContext.shadowColor = 'rgba(0, 150, 255, 0.5)';
                
                // Clip to portal shape
                drawingContext.clip();

                // Draw the actual scene content
                push();
                translate(-width/2, -height/2);
                if (this.background) {
                    image(this.background, 0, 0, width, height);
                }
                this.hero.draw();
                this.hope.draw();
                pop();
                
                drawingContext.restore();
                pop();

                // Draw portal edge effects
                push();
                translate(width/2, height/2);
                noFill();
                for (let i = 0; i < 3; i++) {
                    stroke(0, 150, 255, 255 - i * 50);
                    strokeWeight(3 - i);
                    beginShape();
                    for (let a = 0; a < TWO_PI; a += 0.1) {
                        let r = this.doorWidth/2 + i * 5;
                        let x = r * cos(a);
                        let y = r * sin(a);
                        vertex(x, y);
                    }
                    endShape(CLOSE);
                }
                pop();

                if (elapsed >= this.doorDuration) {
                    this.doorOpening = false;
                }
            }
        } else {
            if (!this.assetsLoaded) return;

            // Clear the canvas and draw background
            background(0);
            if (this.background) {
                push();
                imageMode(CORNER);
                image(this.background, 0, 0, width, height);
                pop();
            }

            // Add custom cursor
            CustomCursor.draw();

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
                    if (this.gameMusic) {
                        console.log("Stopping game music");
                        this.gameMusic.stop();
                        this.gameMusic = null;
                    }
                }
            }

            this.dialogueBox.update();
            this.dialogueBox.draw();
        }
    }

    keyPressed() {
        if (key === ' ') {
            this.activateCannon();
        }
    }

    cleanup() {
        if (this.sceneTransitionTimer) {
            clearTimeout(this.sceneTransitionTimer);
        }
        // Clean up all Howler sounds
        if (this.gameMusic) {
            this.gameMusic.stop();
            this.gameMusic.unload();
        }
        if (this.dialogueBox && this.dialogueBox.typingSound) {
            this.dialogueBox.typingSound.stop();
            this.dialogueBox.typingSound.unload();
        }
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showFinalQuestion();
            return;
        }

        let q = this.questions[this.currentQuestion];
        let boxWidth = 900;
        let boxHeight = 200 + q.options.length * 70;

        // Draw main box
        fill(0, 100, 255, 230);
        stroke(0, 70, 180);
        strokeWeight(4);
        rectMode(CENTER);
        rect(width / 2, height / 2, boxWidth, boxHeight, 20);

        // Draw question text
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(32);
        text(q.question, width / 2, height / 2 - boxHeight / 2 + 80);

        // Draw options with hover effect
        for (let i = 0; i < q.options.length; i++) {
            let y = height / 2 - boxHeight / 2 + 160 + i * 70;
            
            // Check hover state
            let isHovered = mouseX > width / 2 - boxWidth / 2 + 40 &&
                mouseX < width / 2 + boxWidth / 2 - 40 &&
                mouseY > y - 25 && mouseY < y + 25;

            // Play sound on hover
            if (isHovered && !this['option' + i + 'Hovered']) {
                this.buttonSound.play();
                this['option' + i + 'Hovered'] = true;
            } else if (!isHovered) {
                this['option' + i + 'Hovered'] = false;
            }

            // Draw option button with hover effect
            fill(isHovered ? 'yellow' : 'white');
            stroke(0);
            strokeWeight(2);
            rect(width / 2, y, boxWidth - 80, 50, 8);

            // Draw option text
            fill(0);
            noStroke();
            textSize(24);
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
        if (this.currentQuestion < this.questions.length) {
            let q = this.questions[this.currentQuestion];
            let boxWidth = 900;
            let boxHeight = 200 + q.options.length * 70;

            // Check clicks for each option
            for (let i = 0; i < q.options.length; i++) {
                let y = height / 2 - boxHeight / 2 + 160 + i * 70;
                if (mouseX > width / 2 - boxWidth / 2 + 40 &&
                    mouseX < width / 2 + boxWidth / 2 - 40 &&
                    mouseY > y - 25 && mouseY < y + 25) {
                    this.currentQuestion++;
                    this.buttonSound.play();
                    break;
                }
            }
        }
    }

    activateCannon() {
        this.cannonName = this.nameEntered;
        this.cannonPosition = createVector(this.hero.x, this.hero.y);
        this.cannonDirection = createVector(1, 0);
        this.cannonActive = true;
        
        // Play firing sound
        if (this.firingSound) {
            this.firingSound.play();
        }

        // Start transition timer after first cannon fire
        if (!this.hasFirstCannonFired) {
            this.hasFirstCannonFired = true;
            this.sceneTransitionTimer = setTimeout(() => {
                this.cleanup();
                this.transitionToScene5();
            }, 6000); // 6 seconds delay
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

            // Reset cannon position when it reaches edge instead of transitioning
            if (this.cannonPosition.x > width) {
                this.cannonActive = false;
            }
        }
    }

    transitionToScene5() {
        this.cleanup();
        currentScene = new Scene4_5();  // Go to Scene4.5 first
        if (currentScene.preload) {
            currentScene.preload();
        }
    }
}
