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
        this.circleRadius = 200;  // Keep this the same for Hope-Hero distance
        this.circleSpeed = 0.01;  // Initial rotation speed
        this.speedIncreaseInterval = 3000;  // 3 seconds
        this.maxCircleSpeed = 0.05;  // Maximum rotation speed
        this.lastSpeedIncrease = 0;  // Track last speed increase time
        this.enemyCount = 6;
        this.enemyAngles = {};
        this.enemySequence.forEach((enemy, index) => {
            this.enemyAngles[enemy] = (TWO_PI / this.enemyCount) * index;
            // Use the larger radius here too
            this[`${enemy}X`] = width / 2 + cos(this.enemyAngles[enemy]) * this.enemyCircleRadius;
            this[`${enemy}Y`] = height / 2 + sin(this.enemyAngles[enemy]) * this.enemyCircleRadius;
        });

        // Add float animation properties
        this.floatOffset = 0;
        this.floatSpeed = 0.02;  // Speed of up/down movement
        this.floatAmount = 20;   // Pixels to move up/down

        // Update sizes and distances
        this.heroSize = 180;     // Increased hero size
        this.enemySize = 320;  // Increased from 220 to 280

        // Initialize entry effects for each enemy
        this.entryEffects = {
            fear: { progress: 0, startPos: null },
            doubt: { progress: 0, startPos: null },
            regret: { progress: 0, startPos: null },
            anger: { progress: 0, startPos: null },
            procast: { progress: 0, startPos: null },
            insecurity: { progress: 0, startPos: null }
        };

        // When triggering an enemy, set its startPos
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

        // Add dynamic overlay properties
        this.backgroundOverlay = {
            color: 0,
            baseOpacity: 100,      // Base darkness
            currentOpacity: 100,
            pulseSpeed: 0.008,     // Keep same speed
            pulseAmount: 60,       // Amount it pulses between light/dark black
            time: 0,
            isWhite: false
        };

        // Add vignette properties
        this.vignette = {
            size: 1.5,    // Size of the vignette (larger = smaller vignette)
            opacity: 200  // Opacity of vignette
        };

        // Initialize dialogue box
        this.dialogueBox = new DialogueBox();

        // Add dialogue tracking
        this.currentDialogueIndex = 0;
        this.dialogueStarted = false;

        // Increase enemy orbit radius significantly
        this.enemyCircleRadius = 200;  // Increased to 500 for much larger orbit
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

        // 1. Draw background with proper scaling
        push();
        imageMode(CORNER);
        image(this.background, 0, 0, windowWidth, windowHeight);

        // Add dark overlay specifically for background
        fill(0, 150 + sin(frameCount * 0.02) * 50); // Oscillates between alpha 100-200
        noStroke();
        rect(0, 0, width, height);
        pop();

        // 2. Draw vignette
        push();
        drawingContext.save();
        let gradient = drawingContext.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, width / this.vignette.size
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${this.vignette.opacity / 255})`);
        drawingContext.fillStyle = gradient;
        rect(0, 0, width, height);
        drawingContext.restore();
        pop();

        // 3. Draw overlay
        push();
        blendMode(BLEND);
        this.backgroundOverlay.time += this.backgroundOverlay.pulseSpeed;
        let pulseValue = sin(this.backgroundOverlay.time);

        // Only use black with varying opacity
        fill(0, this.backgroundOverlay.baseOpacity + (abs(pulseValue) * this.backgroundOverlay.pulseAmount));
        noStroke();
        rect(0, 0, width, height);
        pop();

        // 4. Draw game elements
        if (this.hero) this.hero.draw();
        if (this.hopeVisible && this.hope) this.hope.draw();

        // 5. Draw enemies with BLEND mode
        push();
        blendMode(BLEND);  // Changed from default to BLEND
        for (let enemy of this.enemySequence) {
            if (this[`${enemy}Active`]) {
                if (this.entryEffects[enemy] && this.entryEffects[enemy].progress < 1) {
                    this.drawEnemyEntry(enemy);
                }
                this.drawEnemy(enemy);
                this.drawEnemyEffects(enemy, this[`${enemy}X`], this[`${enemy}Y`]);
            }
        }
        pop();

        // Start dialogue sequence if not started
        if (!this.dialogueStarted) {
            this.startNextDialogue();
            this.dialogueStarted = true;
        }

        // Check if current dialogue is complete and start next one
        if (this.dialogueBox.isComplete() && this.currentDialogueIndex < this.dialogues.length) {
            this.startNextDialogue();
        }

        // Draw dialogue box
        if (this.dialogueBox) {
            this.dialogueBox.update();
            this.dialogueBox.draw();
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

        // Set random start position for entry effect
        const randomPos = random(this.entryPositions);
        this.entryEffects[enemyType].startPos = randomPos;
        this.entryEffects[enemyType].progress = 0;  // Reset progress

        this.soundManager.playSound('scary');
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

        let progress = this.entryEffects[enemy].progress;
        let startPos = this.entryEffects[enemy].startPos;

        switch (enemy) {
            case 'fear':
                this.drawFearEntry(startPos, progress, enemy);
                break;
            case 'doubt':
                this.drawDoubtEntry(startPos, progress, enemy);
                break;
            case 'regret':
                this.drawRegretEntry(startPos, progress, enemy);
                break;
            case 'anger':
                this.drawAngerEntry(startPos, progress, enemy);
                break;
            case 'procast':
                this.drawProcastEntry(startPos, progress, enemy);
                break;
            case 'insecurity':
                this.drawInsecurityEntry(startPos, progress, enemy);
                break;
        }

        // Make animations much slower (5 seconds longer)
        this.entryEffects[enemy].progress += 0.002;  // Changed from 0.005 to 0.002
    }

    drawFearEntry(startPos, progress, enemy) {
        // Enhanced purple mist effect
        push();
        blendMode(ADD);
        for (let i = 0; i < 40; i++) {  // Increased from 20 to 40 particles
            let angle = random(TWO_PI);
            let radius = (1 - progress) * 400;  // Increased radius
            let x = width / 2 + cos(angle) * radius;
            let y = height / 2 + sin(angle) * radius;

            // Add pulsing effect
            let pulseSize = sin(frameCount * 0.1 + i) * 20;
            let size = (random(30, 70) + pulseSize) * progress;  // Increased size

            // Layered circles for more depth
            fill(128, 0, 128, 30);
            ellipse(x, y, size * 1.5, size * 1.5);
            fill(128, 0, 128, 50);
            ellipse(x, y, size, size);
            fill(180, 0, 180, 70);
            ellipse(x, y, size * 0.5, size * 0.5);
        }
        pop();
    }

    drawDoubtEntry(startPos, progress, enemy) {
        // Enhanced red shadow tendrils
        push();
        blendMode(ADD);
        for (let i = 0; i < 20; i++) {  // Increased from 15 to 20 tendrils
            let angle = i * TWO_PI / 20;
            let radius = (1 - progress) * 500;  // Increased radius

            // Add multiple layers of tendrils
            for (let layer = 0; layer < 3; layer++) {
                stroke(180, 0, 0, 150 - layer * 30);
                strokeWeight(4 - layer);
                noFill();
                beginShape();
                for (let j = 0; j < 8; j++) {  // More complex curves
                    let r = radius * (1 - j / 8);
                    let wobble = sin(frameCount * 0.1 + i + j) * 50;  // Added wobble
                    let x = width / 2 + cos(angle + sin(frameCount * 0.1)) * r + wobble;
                    let y = height / 2 + sin(angle + cos(frameCount * 0.1)) * r + wobble;
                    curveVertex(x, y);
                }
                endShape();
            }

            // Add particle effects at tendril tips
            fill(255, 0, 0, 100);
            noStroke();
            let tipX = width / 2 + cos(angle) * radius;
            let tipY = height / 2 + sin(angle) * radius;
            circle(tipX, tipY, 20 * progress);
        }
        pop();
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
        push();
        blendMode(ADD);

        // Enhanced green energy waves
        for (let i = 0; i < 40; i++) {  // Increased from 30 to 40 waves
            let angle = i * TWO_PI / 40;
            let r = 400 * (1 - progress);  // Increased radius
            let x = width / 2 + cos(angle) * r;
            let y = height / 2 + sin(angle) * r;

            // Multiple energy beams
            for (let j = 0; j < 3; j++) {
                stroke(0, 255, 0, 150 - j * 30);
                strokeWeight(4 - j);
                let energyLength = 80 + sin(frameCount * 0.1 + i) * 30;  // Longer beams
                let wobble = cos(frameCount * 0.2 + i) * 20;  // Added wobble
                let x2 = x + cos(angle) * (energyLength + wobble);
                let y2 = y + sin(angle) * (energyLength + wobble);
                line(x, y, x2, y2);
            }
        }

        // Enhanced energy particles
        for (let i = 0; i < 80; i++) {  // Increased from 50 to 80 particles
            let t = frameCount * 0.05 + i;
            let r = 400 * (1 - progress);
            let x = width / 2 + cos(t) * r;
            let y = height / 2 + sin(t) * r;

            // Layered particles
            fill(0, 255, 0, 100);
            noStroke();
            let size = 8 + sin(t) * 4;  // Larger particles
            circle(x, y, size);
            fill(100, 255, 100, 70);
            circle(x, y, size * 1.5);
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
            let flashIntensity = (1 + sin(progress * 100)) * 0.8;
            flashIntensity *= (1 + cos(progress * 80)) * 0.8;

            // Full screen flash in procrastination's orange color
            fill(255, 140, 0, flashAlpha * flashIntensity);
            rect(0, 0, width, height);

            // Add flash particles
            for (let i = 0; i < 20; i++) {
                let x = random(width);
                let y = random(height);
                let size = random(20, 100);
                fill(255, 140, 0, flashAlpha * 0.8);
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
            let particleX = x + cos(frameCount * 0.1) * 50;
            let particleY = y + sin(frameCount * 0.1) * 50;
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

    startNextDialogue() {
        if (this.currentDialogueIndex < this.dialogues.length) {
            const dialogue = this.dialogues[this.currentDialogueIndex];
            this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
            this.currentDialogueIndex++;

            // Check if this was the last dialogue
            if (this.currentDialogueIndex === this.dialogues.length) {
                // Wait 1 second after "Stay close" dialogue before starting fear entry
                setTimeout(() => {
                    this.fearActive = true;
                    this.fearCurrentDialogue = 0;
                    this.startEnemyDialogue('fear');
                    if (this.soundManager && !this.fearSoundPlayed) {
                        this.soundManager.playSound('fear');
                        this.fearSoundPlayed = true;
                    }
                }, 1000);
            }
        }
    }

    startEnemySequence() {
        // Start with the first enemy
        this.triggerEnemyEntry(this.enemySequence[0]);

        // Start scary sound if available
        if (this.soundManager) {
            this.soundManager.playSound('scary');
        }
    }

    updatePositions() {
        // Calculate float offset
        this.floatOffset = sin(frameCount * this.floatSpeed) * this.floatAmount;

        // Update Hope position with float
        this.hope.x = this.hero.x + cos(this.circleAngle) * this.circleRadius;
        this.hope.y = this.hero.y + sin(this.circleAngle) * this.circleRadius + this.floatOffset;

        // Update Hero position with same float
        this.hero.y = height / 2 + this.floatOffset;

        // Update enemy positions with larger radius
        this.enemySequence.forEach((enemy, index) => {
            this.enemyAngles[enemy] = (TWO_PI / this.enemyCount) * index;
            this[`${enemy}X`] = width / 2 + cos(this.enemyAngles[enemy]) * this.enemyCircleRadius;
            this[`${enemy}Y`] = height / 2 + sin(this.enemyAngles[enemy]) * this.enemyCircleRadius;
        });
    }
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const audio = new Audio('sounds/button.mp3');
        audio.play();
    });
});


