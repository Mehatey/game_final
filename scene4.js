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
        this._shakeFrames  = 0;
        this._shakeMag     = 0;
        this._fadeAlpha    = 0;
        this._fading       = false;
        this._optionFlash  = 0;   // frames of white flash on option select

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

        // Initialize portal properties
        this.portalProgress = 0;
        this.portalDuration = 2000;
        this.startTime = millis();
        this.portalComplete = false;

        // Set background to full screen immediately
        this.backgroundScale = 1;
        this.backgroundX = 0;
        this.backgroundY = 0;

        // Ensure cursor is hidden at start
        noCursor();
        document.body.style.cursor = 'none';

        // Initialize cursor at start
        CustomCursor.activate();
    }

    preload() {
        this.background = loadImage('assets/backgrounds/bg9.gif');
        this.hero.preload();
        this.hope.preload();
    }

    draw() {
        // Screen shake
        if (this._shakeFrames > 0) {
            translate(random(-this._shakeMag, this._shakeMag),
                      random(-this._shakeMag, this._shakeMag));
            this._shakeFrames--;
        }

        // Pre-transition fade-to-black
        if (this._fading) {
            this._fadeAlpha = min(255, this._fadeAlpha + 4);
        }

        // Start with black background
        background(0);

        if (!this.portalComplete) {
            push();
            let elapsed = millis() - this.startTime;
            this.portalProgress = min(elapsed / this.portalDuration, 1);

            // Calculate portal size
            let portalSize = map(this.portalProgress, 0, 1, 0, width * 1.5);
            let centerX = width / 2;
            let centerY = height / 2;

            // Create clipping mask for the background
            drawingContext.save();

            // Start shape for clipping mask
            beginShape();

            // Draw the portal shape that will mask the background
            for (let i = 0; i < TWO_PI; i += 0.1) {
                let xoff = map(cos(i), -1, 1, 0, 0.2);
                let yoff = map(sin(i), -1, 1, 0, 0.2);
                let r = portalSize / 2;
                let x = centerX + r * cos(i) + noise(xoff, yoff, frameCount * 0.02) * 20;
                let y = centerY + r * sin(i) + noise(xoff, yoff + 5, frameCount * 0.02) * 20;
                vertex(x, y);
            }
            endShape(CLOSE);

            // Use the shape as a clip mask
            drawingContext.clip();

            // Draw background image inside the clip mask
            // Calculate scaling to ensure image covers the portal
            let scale = max(width / this.background.width, height / this.background.height) * 1.2;
            let scaledWidth = this.background.width * scale;
            let scaledHeight = this.background.height * scale;

            // Center the scaled image
            let x = width / 2 - scaledWidth / 2;
            let y = height / 2 - scaledHeight / 2;

            image(this.background, x, y, scaledWidth, scaledHeight);

            drawingContext.restore();

            // Draw portal edge glow effects
            noFill();
            for (let i = 0; i < 3; i++) {
                stroke(0, 150, 255, 255 - i * 50);
                strokeWeight(3 - i);
                drawingContext.shadowBlur = 30;
                drawingContext.shadowColor = 'rgba(0, 150, 255, 0.5)';
                beginShape();
                for (let a = 0; a < TWO_PI; a += 0.1) {
                    let r = portalSize / 2 + i * 5;
                    let x = centerX + r * cos(a);
                    let y = centerY + r * sin(a);
                    vertex(x, y);
                }
                endShape(CLOSE);
            }
            pop();

            if (this.portalProgress >= 1) {
                this.portalComplete = true;
            }
        } else {
            // When portal is complete, show full background
            if (this.background) {
                image(this.background, 0, 0, width, height);
            }
        }

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

                    let angle = atan2(height / 2 - warpLine.y, width / 2 - warpLine.x);
                    let startX = warpLine.x;
                    let startY = warpLine.y;
                    let endX = warpLine.x + cos(angle) * warpLine.length;
                    let endY = warpLine.y + sin(angle) * warpLine.length;

                    line(startX, startY, endX, endY);
                }
                pop();

                // Ambient portal rumble — grows as portal widens
                if (frameCount % 4 === 0) {
                    let rumble = map(elapsed, 0, this.doorDuration, 0, 2.5);
                    this._shakeFrames = 2;
                    this._shakeMag    = rumble;
                }

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
                translate(width / 2, height / 2);
                beginShape();
                for (let a = 0; a < TWO_PI; a += 0.1) {
                    let xoff = map(cos(a + frameCount * 0.05), -1, 1, 0, 0.2);
                    let yoff = map(sin(a + frameCount * 0.05), -1, 1, 0, 0.2);
                    let r = this.doorWidth / 2;
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
                translate(-width / 2, -height / 2);
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
                translate(width / 2, height / 2);
                noFill();
                for (let i = 0; i < 3; i++) {
                    stroke(0, 150, 255, 255 - i * 50);
                    strokeWeight(3 - i);
                    beginShape();
                    for (let a = 0; a < TWO_PI; a += 0.1) {
                        let r = this.doorWidth / 2 + i * 5;
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

        // Option-selected flash
        if (this._optionFlash > 0) {
            push(); noStroke();
            fill(255, 255, 255, map(this._optionFlash, 12, 0, 120, 0));
            rect(0, 0, width, height);
            this._optionFlash--;
            pop();
        }

        // Fade-to-black overlay
        if (this._fadeAlpha > 0) {
            push();
            noStroke();
            fill(0, this._fadeAlpha);
            rect(0, 0, width, height);
            pop();
        }

        // Draw cursor in all states
        CustomCursor.draw();
    }

    keyPressed() {
        if (key === ' ') {
            this.activateCannon();
        }
    }

    cleanup() {
        if (this.sceneTransitionTimer) {
            clearTimeout(this.sceneTransitionTimer);
            this.sceneTransitionTimer = null;
        }
        // Stop all sounds
        if (this.gameMusic) {
            this.gameMusic.stop();
            this.gameMusic.unload();
        }
        if (this.dialogueBox && this.dialogueBox.typingSound) {
            this.dialogueBox.typingSound.stop();
            this.dialogueBox.typingSound.unload();
        }
        if (this.buttonSound) {
            this.buttonSound.stop();
            this.buttonSound.unload();
        }
        if (this.firingSound) {
            this.firingSound.stop();
            this.firingSound.unload();
        }

        // Remove input box if it exists
        if (this.inputBox) {
            this.inputBox.remove();
            this.inputBox = null;
        }

        // Remove ALL debug buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.remove();
            button.style.display = 'none';  // Extra safety
        });

        CustomCursor.deactivate();
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showFinalQuestion();
            return;
        }

        // Progress indicator
        push();
        let prog = (this.currentQuestion) / this.questions.length;
        let barW = 300;
        noStroke();
        fill(0, 0, 0, 140);
        rect(width/2 - barW/2 - 4, 28, barW + 8, 22, 6);
        fill(0, 100, 255, 180);
        rect(width/2 - barW/2, 32, barW * prog, 14, 4);
        fill(255, 200);
        textSize(13);
        textAlign(CENTER, CENTER);
        text(`Question ${this.currentQuestion + 1} / ${this.questions.length}`, width/2, 39);
        pop();

        let q        = this.questions[this.currentQuestion];
        let boxWidth = min(860, width * 0.88);
        let boxHeight = 180 + q.options.length * 64;
        let boxX = width/2 - boxWidth/2;
        let boxY = height/2 - boxHeight/2;

        // Gradient question box
        push();
        let ctx = drawingContext;
        let bgrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
        bgrad.addColorStop(0, 'rgba(35, 80, 150, 0.94)');
        bgrad.addColorStop(1, 'rgba(20, 55, 115, 0.94)');
        ctx.fillStyle = bgrad;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        drawingContext.shadowBlur  = 24;
        drawingContext.shadowColor = 'rgba(80, 150, 255, 0.45)';
        noFill();
        stroke(80, 140, 220);
        strokeWeight(2);
        rectMode(CORNER);
        rect(boxX, boxY, boxWidth, boxHeight, 16);
        drawingContext.shadowBlur = 0;

        // Question text
        fill(210, 235, 255);
        noStroke();
        textAlign(CENTER, TOP);
        textSize(28);
        text(q.question, boxX + 32, boxY + 38, boxWidth - 64);

        // Divider line
        stroke(80, 120, 200, 100);
        strokeWeight(1);
        line(boxX + 40, boxY + 118, boxX + boxWidth - 40, boxY + 118);

        // Options
        for (let i = 0; i < q.options.length; i++) {
            let oy = boxY + 138 + i * 64;
            let ow = boxWidth - 64;
            let ox = boxX + 32;

            let isHovered = mouseX > ox && mouseX < ox + ow && mouseY > oy && mouseY < oy + 46;

            if (isHovered && !this['option' + i + 'Hovered']) {
                this.buttonSound.play();
                this['option' + i + 'Hovered'] = true;
            } else if (!isHovered) {
                this['option' + i + 'Hovered'] = false;
            }

            // Scale on hover (smooth)
            let targetSc = isHovered ? 1.025 : 1.0;
            let key      = '_optSc' + i;
            this[key]    = lerp(this[key] || 1.0, targetSc, 0.18);
            let sc       = this[key];

            let ctx2 = drawingContext;
            if (isHovered) {
                let og = ctx2.createLinearGradient(ox, oy, ox, oy + 46);
                og.addColorStop(0, 'rgba(220, 230, 90, 0.92)');
                og.addColorStop(1, 'rgba(190, 210, 60, 0.92)');
                ctx2.fillStyle = og;
                drawingContext.shadowBlur  = 14;
                drawingContext.shadowColor = 'rgba(220, 240, 80, 0.5)';
            } else {
                let og = ctx2.createLinearGradient(ox, oy, ox, oy + 46);
                og.addColorStop(0, 'rgba(100, 160, 240, 0.75)');
                og.addColorStop(1, 'rgba(70,  130, 210, 0.75)');
                ctx2.fillStyle = og;
                drawingContext.shadowBlur  = 5;
                drawingContext.shadowColor = 'rgba(80, 140, 220, 0.25)';
            }

            push();
            translate(ox + ow/2, oy + 23);
            scale(sc);
            ctx2.fillRect(-ow/2, -23, ow, 46);
            noFill();
            stroke(isHovered ? color(240,250,100) : color(100,150,220));
            strokeWeight(1.5);
            rect(-ow/2, -23, ow, 46, 8);
            drawingContext.shadowBlur = 0;

            fill(isHovered ? 20 : 230);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(21);
            text(q.options[i], 0, 0);
            pop();
        }
        pop();
    }

    showFinalQuestion() {
        if (!this.inputBox) {
            this.inputBox = createInput('');
            this.inputBox.position(width / 2 - 180, height / 2 + 10);
            this.inputBox.size(360, 46);
            this.inputBox.style('font-size', '20px');
            this.inputBox.style('padding', '10px 16px');
            this.inputBox.style('border-radius', '8px');
            this.inputBox.style('font-family', 'ARCADE, monospace');
            this.inputBox.style('background', 'rgba(10,30,70,0.92)');
            this.inputBox.style('border', '2px solid rgba(100,160,255,0.7)');
            this.inputBox.style('color', 'rgb(180,220,255)');
            this.inputBox.style('outline', 'none');
            this.inputBox.style('box-shadow', '0 0 20px rgba(80,150,255,0.4)');
            this.inputBox.style('cursor', 'text');
            // Auto-focus so player can type immediately
            setTimeout(() => { if (this.inputBox) this.inputBox.elt.focus(); }, 80);

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

        // Better styled final question box
        let fctx = drawingContext;
        let fbx = width/2 - 360, fby = height/2 - 130, fbw = 720, fbh = 230;
        let fbg = fctx.createLinearGradient(fbx, fby, fbx, fby + fbh);
        fbg.addColorStop(0, 'rgba(35,80,150,0.94)');
        fbg.addColorStop(1, 'rgba(20,55,115,0.94)');
        fctx.fillStyle = fbg;
        fctx.fillRect(fbx, fby, fbw, fbh);
        drawingContext.shadowBlur  = 22;
        drawingContext.shadowColor = 'rgba(80,150,255,0.4)';
        noFill(); stroke(80,140,220); strokeWeight(2);
        rect(fbx, fby, fbw, fbh, 16);
        drawingContext.shadowBlur = 0;

        fill(210, 235, 255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(24);
        text("Who has helped you the most in your life?", width / 2, height/2 - 68);

        // Pulse hint text
        let hp = (sin(frameCount * 0.08) + 1) * 0.5;
        fill(140, 180, 255, 120 + hp * 80);
        textSize(14);
        text("Type their name and press Enter", width / 2, height/2 + 68);
    }

    mousePressed() {
        if (this.currentQuestion < this.questions.length) {
            let q = this.questions[this.currentQuestion];
            let boxWidth = 900;
            let boxHeight = 200 + q.options.length * 70;

            // Check clicks for each option
            let boxWidth2 = min(860, width * 0.88);
            let boxHeight2 = 180 + q.options.length * 64;
            let boxX2 = width/2 - boxWidth2/2;
            let boxY2 = height/2 - boxHeight2/2;
            for (let i = 0; i < q.options.length; i++) {
                let oy = boxY2 + 138 + i * 64;
                let ox = boxX2 + 32;
                let ow = boxWidth2 - 64;
                if (mouseX > ox && mouseX < ox + ow && mouseY > oy && mouseY < oy + 46) {
                    this.currentQuestion++;
                    this._optionFlash = 12;   // brief white flash
                    this._shakeFrames = 6;
                    this._shakeMag    = 3;
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
        // Screen shake on fire
        this._shakeFrames = 12;
        this._shakeMag    = 5;

        if (!this.hasFirstCannonFired) {
            this.hasFirstCannonFired = true;
            // Fade music before screen fade
            if (this.gameMusic) this.gameMusic.fade(0.5, 0, 1500);
            // Screen fade starts 1.2s before transition
            setTimeout(() => { this._fadeAlpha = 0; this._fading = true; }, 2800);
            this.sceneTransitionTimer = setTimeout(() => {
                this.transitionToScene5();
            }, 4000);
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
        currentScene = new Scene4_5();
        if (currentScene.preload) currentScene.preload();
    }

    // When transitioning to Scene4
    static transitionIn() {
        CustomCursor.hide();
        // ... other transition code
    }

}
