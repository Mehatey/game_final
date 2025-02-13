class Scene5 {
    constructor() {
        // Initialize SoundManager first
        this.soundManager = new SoundManager();

        this.assetsLoaded = false;
        this.hero = new Hero(width / 2 - 100, height / 2);
        this.hope = new Hope();
        this.hope.x = width / 2 + 100;
        this.hope.y = height / 2;
        this.hopeVisible = true;  // Always visible
        this.dialogueBox = new DialogueBox();

        // Sound played flags
        this.fearSoundPlayed = false;
        this.doubtSoundPlayed = false;
        this.regretSoundPlayed = false;
        this.angerSoundPlayed = false;
        this.procastSoundPlayed = false;
        this.insecuritySoundPlayed = false;

        this.currentDialogue = 0;
        this.background = null;
        this.fadeAmount = 0;
        this.isFading = false;

        this.dialogues = [
            { speaker: 'Hero', text: "Hope I feel proud that I dodged the distractions?" },
            { speaker: 'Hope', text: "Yeah I'm proud of you." },
            { speaker: 'Hero', text: "I feel weird what is that coming towards us!" },
            { speaker: 'Hope', text: "Stay close. I don't like the look of this." }
        ];

        this.playerName = "Square";
        this.fear = null;
        this.fearSound = null;
        this.fearDialogues = [
            { speaker: 'Fear', text: "I am Fear. The shadow in your mind. The weight that paralyzes you.", color: color(128, 0, 128, 230) },
            { speaker: 'Hero', text: "Fear? What are you?", color: color(128, 128, 128, 230) },
            { speaker: 'Fear', text: "I keep you from taking the first step. Now I will claim your Hope.", color: color(128, 0, 128, 230) },
            { speaker: 'Hope', text: "Defeat Fear, and you'll gain the courage to move forward.", color: color(0, 100, 255, 230) }
        ];
        this.fearAngle = 0;
        this.fearRadius = 400; // Start with larger radius
        this.fearActive = false;
        this.fearSize = 130;    // Increased from 100
        this.fearCurrentDialogue = 0;
        this.doubt = null;
        this.doubtSound = null;
        this.doubtDialogues = [
            { speaker: 'Doubt', text: "I am Doubt. The whisper that questions every choice you make.", color: color(128, 0, 128, 230) },
            { speaker: 'Hero', text: "Get away from Hope!", color: color(128, 128, 128, 230) },
            { speaker: 'Doubt', text: "You can't stop me when you don't even trust yourself.", color: color(128, 0, 128, 230) },
            { speaker: 'Hope', text: "Defeat Doubt, and you'll gain clarity in your journey.", color: color(0, 100, 255, 230) }
        ];
        this.doubtAngle = 0;
        this.doubtRadius = 400;
        this.doubtActive = false;
        this.doubtSize = 130;   // Increased from 100
        this.doubtCurrentDialogue = 0;
        this.fearDefeated = false;
        this.regret = null;
        this.regretSound = null;
        this.regretDialogues = [
            { speaker: 'Regret', text: "I am Regret. The chain that drags you backward.", color: color(128, 0, 128, 230) },
            { speaker: 'Hero', text: "Stop! Leave Hope alone!", color: color(128, 128, 128, 230) },
            { speaker: 'Regret', text: "You carry me every day. You can't escape the past.", color: color(128, 0, 128, 230) },
            { speaker: 'Hope', text: "Defeat Regret, and you'll find the strength to move on.", color: color(0, 100, 255, 230) }
        ];
        this.regretAngle = 0;
        this.regretRadius = 400;
        this.regretActive = false;
        this.regretSize = 200;     // Increased from 180
        this.regretCurrentDialogue = 0;
        this.regretFinalPos = { x: 0, y: 0 };
        this.doubtDefeated = false;
        this.anger = null;
        this.angerSound = null;
        this.angerDialogues = [
            { speaker: 'Anger', text: "I am Anger. The fire that consumes.", color: color(255, 0, 0, 230) },
            { speaker: 'Hero', text: "Let Hope go!", color: color(128, 128, 128, 230) },
            { speaker: 'Anger', text: "I thrive on frustration, and you've given me plenty.", color: color(255, 0, 0, 230) },
            { speaker: 'Hope', text: "Defeat Anger, and you'll gain focus.", color: color(0, 100, 255, 230) }
        ];
        this.angerAngle = 0;
        this.angerRadius = 400;
        this.angerActive = false;
        this.angerSize = 130;      // Increased from 100
        this.angerCurrentDialogue = 0;
        this.angerFinalPos = { x: 0, y: 0 };
        this.regretDefeated = false;
        this.insecurity = null;
        this.insecuritySound = null;
        this.insecurityDialogues = [
            { speaker: 'Insecurity', text: "I am Insecurity. The voice that says you're not enough.", color: color(128, 0, 128, 230) },
            { speaker: 'Hero', text: "No! Leave Hope alone!", color: color(128, 128, 128, 230) },
            { speaker: 'Insecurity', text: "I thrive on your fears and failures. You'll never escape me.", color: color(128, 0, 128, 230) },
            { speaker: 'Hope', text: "Defeat Insecurity, and you'll find belief in yourself.", color: color(0, 100, 255, 230) }
        ];
        this.insecurityAngle = 0;
        this.insecurityRadius = 400;
        this.insecurityActive = false;
        this.insecuritySize = 140;    // Increased but still smaller than original
        this.insecurityCurrentDialogue = 0;
        this.insecurityFinalPos = { x: 0, y: 0 };
        this.procastDefeated = false;

        // Enemy glow colors matching their dialogue colors
        this.fearGlowColor = color(128, 0, 128);    // Purple
        this.doubtGlowColor = color(180, 0, 0);     // Dark red
        this.regretGlowColor = color(0, 0, 139);    // Dark blue
        this.angerGlowColor = color(0, 100, 0);     // Dark green
        this.procastGlowColor = color(255, 140, 0); // Orange
        this.insecurityGlowColor = color(139, 0, 0); // Dark crimson

        this.currentEnemy = null;  // Track current active enemy
        this.enemyStates = {
            fear: { active: false, complete: false },
            doubt: { active: false, complete: false },
            regret: { active: false, complete: false },
            anger: { active: false, complete: false },
            procast: { active: false, complete: false },
            insecurity: { active: false, complete: false }
        };

        // Add enemy sequence tracking
        this.currentEnemyIndex = -1;
        this.enemySequence = ['fear', 'doubt', 'regret', 'anger', 'procast', 'insecurity'];
        this.currentEnemy = null;

        this.procastDialogues = [
            {
                speaker: 'Procrastination', text: "I am Procrastination. The endless delay.",
                color: color(0, 128, 128, 230)
            },
            {
                speaker: 'Hero', text: "I won't let you stop me!",
                color: color(128, 128, 128, 230)
            },
            {
                speaker: 'Procrastination', text: "Tomorrow is always better, isn't it?",
                color: color(0, 128, 128, 230)
            },
            {
                speaker: 'Hope', text: "Defeat Procrastination, and you'll find your drive.",
                color: color(0, 100, 255, 230)
            }
        ];

        this.procastCurrentDialogue = 0;
        this.procastFinalPos = { x: 0, y: 0 };
        this.procastRadius = 400;
        this.procastAngle = 0;
        this.procastSize = 130;    // Increased from 100

        // Add timing controls for enemy entrances
        this.entranceDuration = 5000; // 5 seconds for entrance animation
        this.entranceStartTimes = {
            fear: 0,
            doubt: 0,
            regret: 0,
            anger: 0,
            procast: 0,
            insecurity: 0
        };

        // Add scary background music
        this.scaryMusic = null;

        // Add these properties
        this.entrySoundDuration = 5000; // 5 seconds for entry sound
        this.entryStartTime = 0;
        this.isCircling = false;
        this.ambientSound = null;
        this.scarySound = null;

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

        // Add dystopia background
        // this.background = loadImage('./assets/backgrounds/dystopia.gif'); // Remove this line

        // Add circular movement properties
        this.circleRadius = 200;  // Reduced from 250
        this.circleSpeed = 0.01;  // Initial rotation speed
        this.speedIncreaseInterval = 3000;  // 3 seconds
        this.maxCircleSpeed = 0.05;  // Maximum rotation speed
        this.lastSpeedIncrease = 0;  // Track last speed increase time
        this.enemyCount = 6;
        this.enemyAngles = {};
        this.enemySequence.forEach((enemy, index) => {
            this.enemyAngles[enemy] = (TWO_PI / this.enemyCount) * index;
        });

        // Float animation properties
        this.floatAngle = 0;
        this.floatSpeed = 0.015;  // Increased for more noticeable movement
        this.floatAmount = 30;    // Total movement range in pixels
        this.floatDirection = 1;  // Track direction

        // Update sizes and distances
        this.heroSize = 180;     // Increased hero size

        // Entry effects configuration
        this.entryEffects = {
            fear: {
                active: false,
                timer: 0,
                duration: 5000,
                overlay: color(128, 0, 128, 0),
                startPos: { x: 0, y: 0 }
            },
            doubt: {
                active: false,
                timer: 0,
                duration: 5000,
                overlay: color(180, 0, 0, 0),
                startPos: { x: 0, y: 0 }
            },
            regret: {
                active: false,
                timer: 0,
                duration: 5000,
                overlay: color(0, 0, 139, 0),
                startPos: { x: 0, y: 0 }
            },
            anger: {
                active: false,
                timer: 0,
                duration: 5000,
                overlay: color(0, 100, 0, 0),
                startPos: { x: 0, y: 0 }
            },
            procast: {
                active: false,
                timer: 0,
                duration: 5000,
                overlay: color(255, 140, 0, 0),
                startPos: { x: 0, y: 0 }
            },
            insecurity: {
                active: false,
                timer: 0,
                duration: 5000,
                overlay: color(139, 0, 0, 0),
                startPos: { x: 0, y: 0 }
            }
        };

        // Entry positions (outside canvas)
        this.entryPositions = [
            { x: -100, y: -100 },        // Top-left
            { x: width + 100, y: -100 }, // Top-right
            { x: -100, y: height + 100 }, // Bottom-left
            { x: width + 100, y: height + 100 }, // Bottom-right
            { x: width / 2, y: -100 },     // Top
            { x: width / 2, y: height + 100 } // Bottom
        ];

        // Add flash overlay for enemy entrances
        this.flashOverlay = {
            active: false,
            color: null,
            alpha: 0,
            duration: 3000
        };

        console.log("Hope initialized at:", this.hope.x, this.hope.y); // Debug log

        this.timeouts = [];
        this.intervals = [];
    }

    async preload() {
        try {
            // Load background and characters
            this.background = await loadImage('./assets/backgrounds/dystopia.gif');
            await this.hero.preload();
            await this.hope.preload();
            console.log("Hope preloaded successfully"); // Debug log

            // Load enemy images
            const enemyTypes = ['fear', 'doubt', 'regret', 'anger', 'procast', 'insecurity'];
            for (let type of enemyTypes) {
                this[type] = await loadImage(`assets/characters/enemies/${type}.gif`);
            }

            // Load sounds properly
            if (this.soundManager) {
                await Promise.all([
                    this.soundManager.loadSound('scary', './assets/sounds/scary.mp3'),
                    this.soundManager.loadSound('fear', './assets/sounds/fear.mp3'),
                    this.soundManager.loadSound('doubt', './assets/sounds/doubt.mp3'),
                    this.soundManager.loadSound('regret', './assets/sounds/regret.mp3'),
                    this.soundManager.loadSound('anger', './assets/sounds/anger.mp3'),
                    this.soundManager.loadSound('procast', './assets/sounds/procast.mp3'),
                    this.soundManager.loadSound('insecurity', './assets/sounds/insecurity.mp3')
                ]);
            }

            this.assetsLoaded = true;
            console.log('All assets loaded successfully');
        } catch (error) {
            console.error('Error in preload:', error);
            this.assetsLoaded = false;
        }
    }

    draw() {
        if (!this.assetsLoaded) return;

        // 1. Draw background
        clear();
        if (this.background) {
            push();
            imageMode(CORNER);
            image(this.background, 0, 0, width, height);
            pop();
        }

        // 2. Draw enemy effects
        if (this.currentEnemy) {
            this.enemySequence.forEach(enemy => {
                if (this[`${enemy}Active`]) {
                    if (this.entryEffects[enemy].active) {
                        this.drawEnemyEntry(enemy);
                    } else {
                        this.drawEnemy(enemy);
                    }
                }
            });
        }

        // 3. Draw hero and hope
        if (this.hero) {
            push();
            imageMode(CENTER);
            this.hero.update();
            // Enable movement
            if (keyIsDown(LEFT_ARROW)) this.hero.x -= 5;
            if (keyIsDown(RIGHT_ARROW)) this.hero.x += 5;

            // Smooth floating motion
            this.floatAngle += this.floatSpeed;
            let floatOffset = sin(this.floatAngle) * this.floatAmount;

            this.hero.y = height / 2 + floatOffset;
            this.hero.draw();
            pop();

            // Draw hope with same float
            if (this.hope) {
                push();
                imageMode(CENTER);
                this.hope.x = this.hero.x + 75;
                this.hope.y = this.hero.y;  // Will inherit hero's float
                this.hope.draw();
                pop();
            }
        }

        // 4. Draw dialogue box
        this.dialogueBox.update();
        this.dialogueBox.draw();

        // Remove dialogue handling from here and consolidate in one place
        if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
            if (this.currentDialogue < this.dialogues.length) {
                let dialogue = this.dialogues[this.currentDialogue];
                this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                this.currentDialogue++;

                if (this.currentDialogue === this.dialogues.length) {
                    setTimeout(() => {
                        this.startEnemyEntry('fear');
                    }, 3000);
                }
            }
        }

        // Increase rotation speed every 3 seconds
        if (this.currentEnemy && millis() - this.lastSpeedIncrease > this.speedIncreaseInterval) {
            this.circleSpeed = min(this.circleSpeed * 1.2, this.maxCircleSpeed);  // Increase by 20% each time
            this.lastSpeedIncrease = millis();
            console.log("Speed increased to:", this.circleSpeed);
        }

        // Check if all enemies are active to start final sequence
        if (this.checkAllEnemiesActive() && !this.finalSequenceStarted) {
            this.startFinalSequence();
        }

        // Handle hope strobing if active
        if (this.hopeStrobing) {
            this.strobeHope();
        }
    }

    // Add new method for enemy effects
    drawEnemyEffects(enemy, x, y) {
        push();
        switch (enemy) {
            case 'fear':
                // Smoke effect
                for (let i = 0; i < 10; i++) {
                    let angle = random(TWO_PI);
                    let radius = random(50, 100);
                    fill(128, 0, 128, random(50, 100));
                    noStroke();
                    circle(
                        x + cos(angle) * radius,
                        y + sin(angle) * radius,
                        random(20, 40)
                    );
                }
                break;

            case 'anger':
                // Lightning effect
                stroke(255, 255, 0, 200);
                strokeWeight(3);
                for (let i = 0; i < 3; i++) {
                    let startX = x + random(-50, 50);
                    let startY = y - 100;
                    let endX = x + random(-50, 50);
                    let endY = y + 100;
                    this.drawLightning(startX, startY, endX, endY);
                }
                break;

            // Add effects for other enemies...
        }
        pop();
    }

    drawLightning(x1, y1, x2, y2) {
        let segments = 8;
        beginShape();
        vertex(x1, y1);
        for (let i = 1; i < segments; i++) {
            let x = lerp(x1, x2, i / segments);
            let y = lerp(y1, y2, i / segments);
            // Add some randomness to middle points
            if (i !== segments - 1) {
                x += random(-10, 10);
                y += random(-10, 10);
            }
            vertex(x, y);
        }
        vertex(x2, y2);
        endShape();
    }

    triggerEnemyEntry(enemyType) {
        this[`${enemyType}Active`] = true;
        this.currentEnemy = enemyType;
        this.soundManager.playSound('scary');
        // Play thunder sound if available
        if (this.soundManager.sounds.thunder) {
            this.soundManager.playSound('thunder');
        }
    }

    cleanup() {
        try {
            // Clear all timeouts and intervals
            this.timeouts.forEach(timeout => clearTimeout(timeout));
            this.intervals.forEach(interval => clearInterval(interval));
            this.timeouts = [];
            this.intervals = [];

            if (this.soundManager) {
                this.soundManager.stopAll();
            }
        } catch (error) {
            console.error('Error in cleanup:', error);
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

            // Missile nose cone (semicircle)
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
                    noStroke();
                    fill(255, 50, 0, 150 - i * 50);
                    let flameSize = 20 - i * 5;
                    ellipse(-textWidth / 2 - 25 - i * 8, 0, flameSize, flameSize);
                }
            }

            // Text
            noStroke();
            fill(0); // Black text
            textSize(24);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            text(this.cannonName, 0, 0);

            pop();

            // Move the cannon
            this.cannonPosition.add(p5.Vector.mult(this.cannonDirection, 12));

            // Deactivate when off-screen
            if (this.cannonPosition.x > width) {
                this.cannonActive = false;
            }
        }
    }

    activateCannon() {
        this.cannonName = localStorage.getItem('cannonName');
        if (this.cannonName) {
            console.log("Activating cannon with name:", this.cannonName);
            this.cannonPosition = createVector(this.hero.x, this.hero.y);
            this.cannonDirection = createVector(1, 0);
            this.cannonActive = true;
        }
    }

    keyPressed() {
        if (key === ' ') {  // Changed to check for space key
            console.log("Space pressed");
            this.activateCannon();
        }
    }

    drawEnemy(enemy) {
        if (!this[enemy]) return;

        let angle = this.enemyAngles[enemy] + frameCount * this.circleSpeed;
        let paddedRadius = this.circleRadius + 50;
        let x = width / 2 + cos(angle) * paddedRadius;
        let y = height / 2 + sin(angle) * paddedRadius;

        push();
        imageMode(CENTER);

        // Make enemy face hero
        let directionToHero = atan2(this.hero.y - y, this.hero.x - x);
        translate(x, y);
        if (cos(directionToHero) < 0) {
            scale(-1, 1);
        }

        // Enhanced pulsing glow effect
        let glowPulse = (1 + sin(frameCount * 0.05)) * 0.5;  // Slower pulse
        drawingContext.shadowBlur = 30 + (glowPulse * 20);  // Glow size varies from 30 to 50
        drawingContext.shadowColor = color(
            red(this[`${enemy}GlowColor`]),
            green(this[`${enemy}GlowColor`]),
            blue(this[`${enemy}GlowColor`]),
            200 + (glowPulse * 55)  // Alpha varies from 200 to 255
        );

        let img = this[enemy];
        let aspectRatio = img.width / img.height;
        let size = this[`${enemy}Size`];
        image(img, 0, 0, size * aspectRatio, size);
        pop();
    }

    drawEnemyEntry(enemy) {
        if (!this.entryEffects[enemy]) {
            console.error(`Missing entry effects for enemy: ${enemy}`);
            return;
        }

        let effect = this.entryEffects[enemy];
        if (!effect.startPos) {
            console.error(`Missing start position for enemy: ${enemy}`);
            return;
        }

        let progress = (millis() - effect.timer) / effect.duration;
        progress = constrain(progress, 0, 1);

        try {
            switch (enemy) {
                case 'fear':
                    this.drawFearEntry(effect.startPos, progress, enemy);
                    break;
                case 'doubt':
                    this.drawDoubtEntry(effect.startPos, progress, enemy);
                    break;
                case 'regret':
                    this.drawRegretEntry(effect.startPos, progress, enemy);
                    break;
                case 'anger':
                    this.drawAngerEntry(effect.startPos, progress, enemy);
                    break;
                case 'procast':
                    this.drawProcastEntry(effect.startPos, progress, enemy);
                    break;
                case 'insecurity':
                    this.drawInsecurityEntry(effect.startPos, progress, enemy);
                    break;
                default:
                    console.error(`Unknown enemy type: ${enemy}`);
            }
        } catch (error) {
            console.error(`Error drawing entry for ${enemy}:`, error);
        }

        if (progress >= 1) {
            effect.active = false;
        }

        if (progress < 0.6) {
            push();
            blendMode(SCREEN);  // Changed to SCREEN for more intense flashing
            noStroke();

            // Faster, more intense strobes
            let strobeCount = 8;  // Increased from 5
            let strobeProgress = (progress * strobeCount) % 1;
            let flashAlpha = map(strobeProgress, 0, 1, 255, 0);
            let flashIntensity = (1 + sin(progress * 300)) * 0.9;  // Faster strobe
            flashIntensity *= (1 + cos(progress * 250)) * 0.9;  // Add second wave

            // Use exact dialogue box colors
            const flashColors = {
                fear: color(128, 0, 128, flashAlpha),      // Purple
                doubt: color(180, 0, 0, flashAlpha),       // Dark red
                regret: color(0, 0, 139, flashAlpha),      // Dark blue
                anger: color(0, 100, 0, flashAlpha),       // Dark green
                procast: color(255, 140, 0, flashAlpha),   // Orange
                insecurity: color(139, 0, 0, flashAlpha)   // Dark crimson
            };

            // Draw flash behind everything
            drawingContext.globalCompositeOperation = 'destination-over';
            fill(flashColors[enemy]);
            rect(0, 0, width, height);
            pop();
        }
    }

    drawFearEntry(startPos, progress, enemy) {
        if (!startPos) return;

        push();
        // Full screen effects
        blendMode(ADD);

        // Dark atmosphere over entire screen
        push();
        blendMode(MULTIPLY);
        noStroke();
        fill(40, 0, 60, 150);
        rect(0, 0, width, height);
        pop();

        // Lightning strikes across screen
        if (frameCount % 5 === 0) {
            for (let i = 0; i < 5; i++) {
                push();
                blendMode(ADD);
                stroke(200, 150, 255);
                strokeWeight(3);
                let x1 = random(width);
                let y1 = 0;
                let x2 = random(width);
                let y2 = height;
                drawingContext.shadowBlur = 30;
                drawingContext.shadowColor = color(200, 150, 255);
                this.drawLightning(x1, y1, x2, y2);
                pop();
            }
        }

        // Swirling purple mist covering the screen
        for (let i = 0; i < 50; i++) {
            let angle = noise(i, frameCount * 0.02) * TWO_PI;
            let radius = width * 0.5 * noise(i, frameCount * 0.01);
            let x = width / 2 + cos(angle) * radius;
            let y = height / 2 + sin(angle) * radius;

            push();
            blendMode(SCREEN);
            noStroke();
            fill(128, 0, 128, 30);
            let size = noise(i, frameCount * 0.05) * 100;
            circle(x, y, size);
            pop();
        }

        // Energy particles converging on entry point
        for (let i = 0; i < 30; i++) {
            let t = frameCount * 0.1 + i;
            let spiralRadius = (1 - progress) * 400;
            let x = lerp(startPos.x, this.hero.x, progress) + cos(t) * spiralRadius;
            let y = lerp(startPos.y, this.hero.y, progress) + sin(t) * spiralRadius;

            push();
            blendMode(ADD);
            noStroke();
            fill(200, 100, 255, 150);
            let particleSize = 10 + sin(t) * 5;
            circle(x, y, particleSize);

            // Add trailing effect
            for (let j = 0; j < 5; j++) {
                let trailX = x - cos(t) * (j * 10);
                let trailY = y - sin(t) * (j * 10);
                fill(200, 100, 255, 30 - j * 5);
                circle(trailX, trailY, particleSize - j);
            }
            pop();
        }

        // Pulsing vignette effect
        let vignetteSize = 100 + sin(frameCount * 0.1) * 20;
        drawingContext.shadowBlur = vignetteSize;
        drawingContext.shadowColor = color(128, 0, 128, 100);
        noFill();
        stroke(128, 0, 128, 50);
        rect(0, 0, width, height);

        pop();
    }

    drawDoubtEntry(startPos, progress, enemy) {
        // Copy the fire effects from Anger's entry
        // ... fire and ember effects ...
    }

    drawRegretEntry(startPos, progress, enemy) {
        if (!startPos) return;

        push();
        // First draw the flashing overlay (3 seconds)
        if (progress < 0.6) {  // 3 seconds = 0.6 of 5 second duration
            push();
            blendMode(SCREEN);
            noStroke();
            let flashAlpha = map(progress, 0, 0.6, 255, 0);
            let flashIntensity = (1 + sin(progress * 100)) * 0.5;
            flashIntensity *= (1 + cos(progress * 80)) * 0.5;

            // Full screen flash in regret's dark blue color
            fill(0, 0, 139, flashAlpha * flashIntensity);
            rect(0, 0, width, height);

            // Add flash particles
            for (let i = 0; i < 20; i++) {
                let x = random(width);
                let y = random(height);
                let size = random(20, 100);
                fill(0, 0, 139, flashAlpha * 0.5);
                circle(x, y, size * flashIntensity);
            }
            pop();
        }

        // Deep blue time distortion effect
        for (let i = 0; i < 25; i++) {
            // Time ripples
            let angle = i * TWO_PI / 25;
            let rippleRadius = (300 * progress) * sin(frameCount * 0.1 + i * 0.5);
            let x = lerp(startPos.x, this.hero.x, progress) + cos(angle) * rippleRadius;
            let y = lerp(startPos.y, this.hero.y, progress) + sin(angle) * rippleRadius;

            stroke(0, 0, 139, 150 * (1 - progress));
            strokeWeight(3);
            noFill();
            circle(x, y, 50 * noise(i, frameCount * 0.05));

            // Clock hands effect
            if (i % 5 === 0) {
                push();
                translate(x, y);
                rotate(frameCount * 0.1 + i);
                stroke(0, 0, 200, 200);
                line(0, 0, 0, -30);
                pop();
            }
        }

        // Update flash overlay
        if (progress < 0.6) {
            push();
            blendMode(BLEND);  // Changed from ADD to BLEND for solid colors
            noStroke();
            let flashAlpha = map(progress, 0, 0.6, 255, 0);
            let flashIntensity = (1 + sin(progress * 100)) * 0.8;

            // Brighter solid colors
            const flashColors = {
                fear: color(200, 0, 255, flashAlpha),     // Solid purple
                doubt: color(255, 50, 50, flashAlpha),     // Solid red
                regret: color(50, 50, 255, flashAlpha),    // Solid blue
                anger: color(255, 0, 0, flashAlpha),       // Solid red
                procast: color(255, 165, 0, flashAlpha),   // Solid orange
                insecurity: color(255, 0, 50, flashAlpha)  // Solid crimson
            };

            fill(flashColors[enemy]);
            rect(0, 0, width, height);
            pop();
        }
        pop();
    }

    drawAngerEntry(startPos, progress, enemy) {
        // New green energy effect
        push();
        blendMode(ADD);

        // Green energy waves
        for (let i = 0; i < 30; i++) {
            let angle = i * TWO_PI / 30;
            let r = 300 * (1 - progress);
            let x = width / 2 + cos(angle) * r;
            let y = height / 2 + sin(angle) * r;

            stroke(0, 255, 0, 150);
            strokeWeight(3);
            let energyLength = 50 + sin(frameCount * 0.1 + i) * 20;
            let x2 = x + cos(angle) * energyLength;
            let y2 = y + sin(angle) * energyLength;
            line(x, y, x2, y2);
        }

        // Energy particles
        for (let i = 0; i < 50; i++) {
            let t = frameCount * 0.05 + i;
            let r = 200 * (1 - progress);
            let x = width / 2 + cos(t) * r;
            let y = height / 2 + sin(t) * r;

            fill(0, 255, 0, 150);
            noStroke();
            circle(x, y, 5 + sin(t) * 3);
        }
        pop();
    }

    drawProcastEntry(startPos, progress, enemy) {
        if (!startPos) return;

        push();
        // First draw the flashing overlay (3 seconds)
        if (progress < 0.6) {
            push();
            blendMode(SCREEN);
            noStroke();
            let flashAlpha = map(progress, 0, 0.6, 255, 0);
            let flashIntensity = (1 + sin(progress * 100)) * 0.5;
            flashIntensity *= (1 + cos(progress * 80)) * 0.5;

            // Full screen flash in procrastination's orange color
            fill(255, 140, 0, flashAlpha * flashIntensity);
            rect(0, 0, width, height);

            // Add flash particles
            for (let i = 0; i < 20; i++) {
                let x = random(width);
                let y = random(height);
                let size = random(20, 100);
                fill(255, 140, 0, flashAlpha * 0.5);
                circle(x, y, size * flashIntensity);
            }
            pop();
        }

        // Time-warp effect
        blendMode(MULTIPLY);
        fill(255, 140, 0, 70);
        rect(0, 0, width, height);

        // Clock symbols and time particles
        for (let i = 0; i < 30; i++) {
            let angle = i * TWO_PI / 30;
            let r = 300 * (1 - progress);
            let x = width / 2 + cos(angle) * r;
            let y = height / 2 + sin(angle) * r;

            // Clock hands
            push();
            translate(x, y);
            rotate(frameCount * 0.02 + i);
            stroke(255, 140, 0, 150);
            strokeWeight(2);
            line(0, 0, 0, -20);
            line(0, 0, 10, 0);
            pop();

            // Time particles
            let particleX = x + cos(frameCount * 0.1) * 20;
            let particleY = y + sin(frameCount * 0.1) * 20;
            fill(255, 140, 0, 100);
            noStroke();
            circle(particleX, particleY, 5);
        }

        // Spiraling time vortex
        for (let i = 0; i < 20; i++) {
            let t = frameCount * 0.03 + i;
            let spiralR = i * 15 * (1 - progress);
            let x = width / 2 + cos(t) * spiralR;
            let y = height / 2 + sin(t) * spiralR;

            stroke(255, 140, 0, 150);
            strokeWeight(2);
            noFill();
            arc(x, y, 30, 30, t, t + PI);
        }

        // Update flash overlay
        if (progress < 0.6) {
            push();
            blendMode(BLEND);  // Changed from ADD to BLEND for solid colors
            noStroke();
            let flashAlpha = map(progress, 0, 0.6, 255, 0);
            let flashIntensity = (1 + sin(progress * 100)) * 0.8;

            // Brighter solid colors
            const flashColors = {
                fear: color(200, 0, 255, flashAlpha),     // Solid purple
                doubt: color(255, 50, 50, flashAlpha),     // Solid red
                regret: color(50, 50, 255, flashAlpha),    // Solid blue
                anger: color(255, 0, 0, flashAlpha),       // Solid red
                procast: color(255, 165, 0, flashAlpha),   // Solid orange
                insecurity: color(255, 0, 50, flashAlpha)  // Solid crimson
            };

            fill(flashColors[enemy]);
            rect(0, 0, width, height);
            pop();
        }
        pop();
    }

    drawInsecurityEntry(startPos, progress, enemy) {
        if (!startPos) return;

        push();
        // First draw the flashing overlay (3 seconds)
        if (progress < 0.6) {
            push();
            blendMode(SCREEN);
            noStroke();
            let flashAlpha = map(progress, 0, 0.6, 255, 0);
            let flashIntensity = (1 + sin(progress * 100)) * 0.5;
            flashIntensity *= (1 + cos(progress * 80)) * 0.5;

            // Full screen flash in insecurity's dark crimson color
            fill(139, 0, 0, flashAlpha * flashIntensity);
            rect(0, 0, width, height);

            // Add flash particles
            for (let i = 0; i < 20; i++) {
                let x = random(width);
                let y = random(height);
                let size = random(20, 100);
                fill(139, 0, 0, flashAlpha * 0.5);
                circle(x, y, size * flashIntensity);
            }
            pop();
        }

        // Dark crimson atmosphere
        blendMode(MULTIPLY);
        fill(139, 0, 0, 80);
        rect(0, 0, width, height);

        // Swirling shadows and doubts
        for (let i = 0; i < 40; i++) {
            let t = frameCount * 0.02 + i;
            let radius = 300 * (1 - progress) * sin(t * 0.3);
            let x = width / 2 + cos(t) * radius;
            let y = height / 2 + sin(t) * radius;

            // Shadow wisps
            push();
            blendMode(ADD);
            noStroke();
            fill(139, 0, 0, 50);
            let size = noise(i, frameCount * 0.05) * 100;
            circle(x, y, size);
            pop();

            // Doubt tendrils
            if (i % 3 === 0) {
                stroke(100, 0, 0, 100);
                strokeWeight(2);
                let curl = noise(t * 0.1) * TWO_PI;
                let x2 = x + cos(curl) * 70;
                let y2 = y + sin(curl) * 70;
                line(x, y, x2, y2);
            }
        }

        // Converging insecurity lines
        for (let i = 0; i < 36; i++) {
            let angle = i * TWO_PI / 36;
            let r = width * (1 - progress);
            let x = width / 2 + cos(angle) * r;
            let y = height / 2 + sin(angle) * r;

            stroke(139, 0, 0, 150);
            strokeWeight(1);
            line(x, y, width / 2, height / 2);
        }

        // Update flash overlay
        if (progress < 0.6) {
            push();
            blendMode(BLEND);  // Changed from ADD to BLEND for solid colors
            noStroke();
            let flashAlpha = map(progress, 0, 0.6, 255, 0);
            let flashIntensity = (1 + sin(progress * 100)) * 0.8;

            // Brighter solid colors
            const flashColors = {
                fear: color(200, 0, 255, flashAlpha),     // Solid purple
                doubt: color(255, 50, 50, flashAlpha),     // Solid red
                regret: color(50, 50, 255, flashAlpha),    // Solid blue
                anger: color(255, 0, 0, flashAlpha),       // Solid red
                procast: color(255, 165, 0, flashAlpha),   // Solid orange
                insecurity: color(255, 0, 50, flashAlpha)  // Solid crimson
            };

            fill(flashColors[enemy]);
            rect(0, 0, width, height);
            pop();
        }
        pop();
    }

    startEnemyEntry(enemy) {
        console.log(`Starting entry for ${enemy}`);  // Debug log
        if (enemy === 'fear') {
            setTimeout(() => {
                this.triggerEntry(enemy);
            }, 3000);
        } else {
            this.triggerEntry(enemy);
        }
    }

    triggerEntry(enemy) {
        console.log(`Triggering ${enemy} entry animation`);

        this[`${enemy}Active`] = true;
        this.currentEnemy = enemy;

        // Set random start position
        let startPos = random(this.entryPositions);
        this.entryEffects[enemy] = {
            ...this.entryEffects[enemy],
            active: true,
            timer: millis(),
            startPos: startPos
        };

        // Start dialogue after 3 seconds
        setTimeout(() => {
            if (this[`${enemy}Dialogues`] && this[`${enemy}CurrentDialogue`] < this[`${enemy}Dialogues`].length) {
                this.startEnemyDialogue(enemy);
            }
        }, 3000);

        // Play sounds
        if (this.soundManager) {
            this.soundManager.playSound('scary');
            if (this.soundManager.sounds.thunder) {
                setTimeout(() => this.soundManager.playSound('thunder'), 500);
            }
        }

        // Reset rotation speed for new enemy
        this.circleSpeed = 0.01;
        this.lastSpeedIncrease = millis();
    }

    // Add new method to handle enemy dialogue progression
    startEnemyDialogue(enemy) {
        let dialogue = this[`${enemy}Dialogues`][this[`${enemy}CurrentDialogue`]];
        this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker, dialogue.color);
        this[`${enemy}CurrentDialogue`]++;

        // Set up listener for dialogue completion
        let checkDialogueComplete = setInterval(() => {
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                clearInterval(checkDialogueComplete);

                if (this[`${enemy}CurrentDialogue`] < this[`${enemy}Dialogues`].length) {
                    this.startEnemyDialogue(enemy);
                } else {
                    // If this was the last insecurity dialogue
                    if (enemy === 'insecurity' && this[`${enemy}CurrentDialogue`] >= this[`${enemy}Dialogues`].length) {
                        // Start speed increase
                        this.circleSpeed = 0.1;

                        // Wait for last dialogue to complete
                        setTimeout(() => {
                            // Trigger Hope's final dialogue
                            this.dialogueBox.startDialogue("I feel myself dying... Save meeeee!", "Hope", color(0, 100, 255));

                            // Start strobing and fade out AFTER dialogue completes
                            let checkHopeDialogue = setInterval(() => {
                                if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                                    clearInterval(checkHopeDialogue);
                                    this.hopeStrobing = true;

                                    // Disappear after 3 seconds of strobing
                                    setTimeout(() => {
                                        this.hopeVisible = false;
                                    }, 3000);
                                }
                            }, 100);
                        }, 1000);
                    } else {
                        // Normal enemy progression
                        let currentIndex = this.enemySequence.indexOf(enemy);
                        if (currentIndex < this.enemySequence.length - 1) {
                            setTimeout(() => {
                                let nextEnemy = this.enemySequence[currentIndex + 1];
                                this.startEnemyEntry(nextEnemy);
                            }, 500);
                        }
                    }
                }
            }
        }, 100);
    }

    // Update methods to track timeouts
    setTimeout(callback, delay) {
        const timeout = window.setTimeout(callback, delay);
        this.timeouts.push(timeout);
        return timeout;
    }

    setInterval(callback, delay) {
        const interval = window.setInterval(callback, delay);
        this.intervals.push(interval);
        return interval;
    }

    checkAllEnemiesActive() {
        return this.enemySequence.every(enemy => this[`${enemy}Active`]);
    }

    startFinalSequence() {
        this.finalSequenceStarted = true;
        this.circleSpeed = 0.1;  // Drastically increase speed

        // Start hope strobing
        this.hopeStrobing = true;
        this.hopeStrobeStart = millis();

        // Disappear hope after 3 seconds
        setTimeout(() => {
            this.hopeStrobing = false;
            this.hopeVisible = false;

            // Add final dialogue
            setTimeout(() => {
                this.dialogueBox.startDialogue("I feel myself dying... Save meeeee!", "Hope", color(0, 100, 255));
            }, 500);
        }, 3000);
    }

    strobeHope() {
        if (!this.hope || !this.hopeVisible) return;

        try {
            let strobeTime = millis() - this.hopeStrobeStart;
            let strobeIntensity = (1 + sin(strobeTime * 0.1)) * 0.5;

            push();
            blendMode(BLEND);  // Changed from ADD to prevent transparency issues
            tint(255, strobeIntensity * 255);
            this.hope.draw();
            pop();
        } catch (error) {
            console.error('Error in strobeHope:', error);
        }
    }
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const audio = new Audio('sounds/button.mp3');
        audio.play();
    });
});


