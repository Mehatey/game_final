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
        this.enemyCircleRadius = 200;
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
            fear:       { progress: 0, startX: -220, startY: -220, strobeFired: false, impactFired: false },
            doubt:      { progress: 0, startX: -220, startY: -220, strobeFired: false, impactFired: false },
            regret:     { progress: 0, startX: -220, startY: -220, strobeFired: false, impactFired: false },
            anger:      { progress: 0, startX: -220, startY: -220, strobeFired: false, impactFired: false },
            procast:    { progress: 0, startX: -220, startY: -220, strobeFired: false, impactFired: false },
            insecurity: { progress: 0, startX: -220, startY: -220, strobeFired: false, impactFired: false }
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
            baseOpacity: 40,       // Base darkness (reduced)
            currentOpacity: 100,
            pulseSpeed: 0.008,     // Keep same speed
            pulseAmount: 30,       // Amount it pulses
            time: 0,
            isWhite: false
        };

        // Strobe + shake state for enemy entries
        this.strobe       = { active: false, alpha: 0, color: [255,255,255], decay: 18 };
        this._shakeFrames = 0;
        this._shakeMag    = 0;

        // Add vignette properties
        this.vignette = {
            size: 1.5,    // Size of the vignette (larger = smaller vignette)
            opacity: 100  // Opacity of vignette (reduced)
        };

        // Initialize dialogue box
        this.dialogueBox = new DialogueBox();

        // Add dialogue tracking
        this.currentDialogueIndex = 0;
        this.dialogueStarted = false;

    }

    preload() {
        let loaded = 0;
        const total = 9; // background + hero + hope + 6 enemies
        const onLoad = () => { loaded++; if (loaded >= total) this.assetsLoaded = true; };

        // Background via p5 (doesn't need to animate frame-by-frame)
        loadImage('./assets/backgrounds/dystopia.gif', img => {
            this.background = img; onLoad();
        });

        this.hero.preload(); onLoad();
        this.hope.preload(); onLoad();

        // Enemy GIFs loaded as native HTML <img> elements so the browser
        // handles GIF animation automatically — far more reliable than p5's gif engine
        const enemyTypes = ['fear', 'doubt', 'regret', 'anger', 'procast', 'insecurity'];
        for (let type of enemyTypes) {
            const el = document.createElement('img');
            el.src = `./assets/characters/enemies/${type}.gif`;
            el.onload = () => {
                this[type] = el;          // store HTML element directly
                this[`${type}NativeGif`] = true;
                onLoad();
            };
            el.onerror = () => onLoad(); // don't hang on missing file
        }

        if (this.soundManager) {
            ['scary','fear','doubt','regret','anger','procast','insecurity'].forEach(s => {
                this.soundManager.loadSound(s, `./assets/sounds/${s}.mp3`);
            });
        }
    }

    draw() {
        if (!this.assetsLoaded) return;

        // Screen shake
        if (this._shakeFrames > 0) {
            translate(random(-this._shakeMag, this._shakeMag),
                      random(-this._shakeMag, this._shakeMag));
            this._shakeFrames--;
        }

        // 1. Draw background with proper scaling
        push();
        imageMode(CORNER);
        image(this.background, 0, 0, windowWidth, windowHeight);

        // Reduced dark overlay — let the background breathe
        fill(0, 60 + sin(frameCount * 0.02) * 20); // was 150±50, now 60±20
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
        if (this.hero) { this.hero.update(); this.hero.draw(); }
        if (this.hopeVisible && this.hope) this.hope.draw();

        // Strobe flash on enemy entry
        if (this.strobe.active && this.strobe.alpha > 0) {
            push();
            noStroke();
            fill(this.strobe.color[0], this.strobe.color[1], this.strobe.color[2], this.strobe.alpha);
            rect(0, 0, width, height);
            this.strobe.alpha = max(0, this.strobe.alpha - this.strobe.decay);
            if (this.strobe.alpha <= 0) this.strobe.active = false;
            pop();
        }

        // Orbit ring — pulses faster as circleSpeed increases (shows danger ramp-up)
        push();
        noFill();
        let activeCount = this.enemySequence.filter(e => this[`${e}Active`]).length;
        if (activeCount > 0) {
            let speedRatio  = map(this.circleSpeed, 0.01, 0.1, 0, 1);
            let ringPulse   = (sin(frameCount * lerp(0.03, 0.4, speedRatio)) + 1) * 0.5;
            let ringAlpha   = lerp(18, 90, speedRatio) + ringPulse * 20;
            let ringR = lerp(255, 255, speedRatio);
            let ringG = lerp(255, 40,  speedRatio);
            let ringB = lerp(255, 40,  speedRatio);
            let ctx = drawingContext;
            ctx.save();
            ctx.setLineDash([lerp(18,6,speedRatio), lerp(14,4,speedRatio)]);
            ctx.lineWidth = lerp(1, 3, speedRatio);
            ctx.strokeStyle = `rgba(${floor(ringR)},${floor(ringG)},${floor(ringB)},${ringAlpha/255})`;
            if (speedRatio > 0.5) {
                ctx.shadowBlur  = 12 * speedRatio;
                ctx.shadowColor = `rgba(255,60,60,0.6)`;
            }
            ctx.beginPath();
            ctx.ellipse(width/2, height/2, this.enemyCircleRadius, this.enemyCircleRadius, 0, 0, TWO_PI);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
            ctx.restore();
        }
        pop();

        // 5. Draw enemies with BLEND mode
        push();
        blendMode(BLEND);
        for (let enemy of this.enemySequence) {
            if (this[`${enemy}Active`]) {
                let ef = this.entryEffects[enemy];
                if (ef && ef.progress < 1) {
                    // During entry: only the entry animation, never the orbit sprite
                    this.drawEnemyEntry(enemy);
                } else {
                    // Entry done: draw at orbit position normally
                    this.drawEnemy(enemy);
                    this.drawEnemyEffects(enemy, this[`${enemy}X`], this[`${enemy}Y`]);
                }
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

    // Ambient idle effects — subtle, nothing lingering from entry
    drawEnemyEffects(enemy, x, y) {
        // Intentionally minimal — just a soft pulsing shadow under each enemy
        push();
        noStroke();
        let pulse = (sin(frameCount * 0.04) + 1) * 0.5;
        fill(0, 0, 0, 30 + pulse * 20);
        ellipse(x, y + this[`${enemy}Size`] * 0.45, this[`${enemy}Size`] * 0.9, 30);
        pop();
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
        if (!this.cannonActive) return;

        let cx = this.cannonPosition.x;
        let cy = this.cannonPosition.y;
        let nm = this.cannonName || 'HOPE';
        let tw = nm.length * 14;
        let bw = tw + 50, bh = 44;

        // Particle exhaust trail
        if (!this._cannonParticles) this._cannonParticles = [];
        this._cannonParticles.push({
            x: cx - bw / 2, y: cy + random(-8, 8),
            vx: random(-4, -1), vy: random(-2, 2),
            life: 1, sz: random(6, 18),
            r: floor(random(200, 255)), g: floor(random(60, 140)), b: 0
        });

        // Update + draw particles
        push();
        noStroke();
        this._cannonParticles = this._cannonParticles.filter(p => {
            p.x += p.vx; p.y += p.vy;
            p.life -= 0.06; p.sz *= 0.92;
            if (p.life <= 0) return false;
            fill(p.r, p.g, p.b, p.life * 200);
            ellipse(p.x, p.y, p.sz, p.sz);
            return true;
        });
        pop();

        push();
        translate(cx, cy);

        // Glow
        drawingContext.shadowBlur  = 30;
        drawingContext.shadowColor = 'rgba(255,200,0,0.8)';

        // Body
        fill(255, 220, 0);
        stroke(200, 140, 0);
        strokeWeight(2);
        rectMode(CENTER);
        rect(0, 0, bw, bh, 10);

        // Nose cone
        fill(255, 240, 0);
        noStroke();
        triangle(bw/2, -bh/2, bw/2, bh/2, bw/2 + 22, 0);

        drawingContext.shadowBlur = 0;

        // Name text
        fill(0);
        noStroke();
        textSize(20);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(nm, 0, 0);
        textStyle(NORMAL);

        // Engine flare
        let flare = (sin(frameCount * 1.4) * 0.5 + 0.5);
        fill(255, 80, 0, 180 + flare * 75);
        noStroke();
        ellipse(-bw/2 - 10, 0, 28 + flare * 12, 20 + flare * 8);
        fill(255, 200, 0, 140);
        ellipse(-bw/2 - 8, 0, 16, 12);
        pop();

        // Advance
        this.cannonPosition.add(p5.Vector.mult(this.cannonDirection, 14));
        if (this.cannonPosition.x > width + 100) {
            this.cannonActive = false;
            this._cannonParticles = [];
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

        // Slow breathing glow
        let glowPulse = (1 + sin(frameCount * 0.022)) * 0.5;
        let gc = this[`${enemy}GlowColor`];
        drawingContext.shadowBlur  = 22 + glowPulse * 18;
        drawingContext.shadowColor = `rgba(${red(gc)},${green(gc)},${blue(gc)},${0.55 + glowPulse * 0.3})`;

        let img = this[enemy];
        let sz  = this[`${enemy}Size`];

        if (this[`${enemy}NativeGif`]) {
            // Native HTML img — draw via canvas API to preserve GIF animation
            let ar = img.naturalWidth / img.naturalHeight;
            drawingContext.drawImage(img, -sz * ar / 2, -sz / 2, sz * ar, sz);
        } else if (img) {
            let ar = img.width / img.height;
            image(img, 0, 0, sz * ar, sz);
        }
        drawingContext.shadowBlur = 0;
        pop();
    }

    // ─────────────────────────────────────────────
    //  ENEMY ENTRY SYSTEM  — 5 second cinematic
    // ─────────────────────────────────────────────
    drawEnemyEntry(enemy) {
        if (!this.entryEffects[enemy]) return;
        let ef = this.entryEffects[enemy];
        let p  = ef.progress;            // 0 → 1  over 5 seconds
        const IMPACT = 0.68;

        let tx = this[`${enemy}X`] || width / 2;
        let ty = this[`${enemy}Y`] || height / 2;

        // ── Pre-impact build-up (p 0 → IMPACT) ──────────────────────────────
        if (p < IMPACT) {
            let bp = p / IMPACT;         // normalised build-up progress 0→1

            // Escalating screen tremor — only in final third of build-up
            if (bp > 0.55) {
                push();
                let t = map(bp, 0.55, 1, 0, 5);
                translate(
                    sin(frameCount * 1.1)  * t * noise(frameCount * 0.04),
                    cos(frameCount * 0.85) * t * noise(frameCount * 0.04 + 9)
                );
            }

            switch (enemy) {
                case 'fear':       this._fearBuild(bp, tx, ty);        break;
                case 'doubt':      this._doubtBuild(bp, tx, ty);       break;
                case 'regret':     this._regretBuild(bp, tx, ty);      break;
                case 'anger':      this._angerBuild(bp, tx, ty);       break;
                case 'procast':    this._procastBuild(bp, tx, ty);     break;
                case 'insecurity': this._insecurityBuild(bp, tx, ty);  break;
            }

            if (bp > 0.55) pop();
        }

        // ── IMPACT (fires once at p = IMPACT) ────────────────────────────────
        if (!ef.impactFired && p >= IMPACT) {
            ef.impactFired    = true;
            this.strobe       = { active: true, alpha: 255, color: [255,255,255], decay: 20 };
            this._shakeFrames = 24;
            this._shakeMag    = 14;
        }

        // ── Post-impact: enemy sprite + shockwaves (p IMPACT → 1) ────────────
        if (p >= IMPACT) {
            let img = this[enemy];
            if (img) {
                let sz      = this[`${enemy}Size`];
                let shock   = (p - IMPACT) / (1 - IMPACT);
                let bounce  = shock < 0.3 ? lerp(1.7, 1.0, shock / 0.3) : 1.0;

                push();
                // Brief white overlay flash on impact
                if (shock < 0.15) {
                    let flashA = map(shock, 0, 0.15, 180, 0);
                    drawingContext.globalAlpha = flashA / 255;
                    drawingContext.fillStyle   = 'white';
                    drawingContext.fillRect(0, 0, width, height);
                    drawingContext.globalAlpha = 1;
                }

                if (this[`${enemy}NativeGif`]) {
                    let ar = img.naturalWidth / img.naturalHeight;
                    let w  = sz * ar * bounce, h = sz * bounce;
                    drawingContext.drawImage(img, tx - w/2, ty - h/2, w, h);
                } else {
                    let ar = img.width / img.height;
                    imageMode(CENTER);
                    image(img, tx, ty, sz * ar * bounce, sz * bounce);
                }

                // 5 shockwave rings, each delayed
                noFill();
                for (let r = 0; r < 5; r++) {
                    let rt = max(0, shock - r * 0.14);
                    if (rt <= 0) continue;
                    let rad  = rt * 500;
                    let a    = max(0, (1 - rt) * 240);
                    stroke(255, 255, 255, a);
                    strokeWeight(lerp(6, 0.3, rt));
                    ellipse(tx, ty, rad * 2, rad * 1.4);
                }
                pop();
            }
        }

        ef.progress = min(1, ef.progress + 0.00333);  // 5 seconds @ 60 fps
    }

    // helper — draw big centred text flash
    _flashText(str, r, g, b, a, sz) {
        push();
        drawingContext.shadowBlur  = 40;
        drawingContext.shadowColor = `rgba(${r},${g},${b},0.9)`;
        fill(r, g, b, a);
        noStroke();
        textSize(sz || 180);
        textAlign(CENTER, CENTER);
        text(str, width / 2, height / 2);
        drawingContext.shadowBlur = 0;
        pop();
    }

    // helper — canvas-level horizontal glitch strips
    _glitchStrips(count, maxOffset, alpha) {
        let ctx = drawingContext;
        ctx.save();
        ctx.globalAlpha = alpha;
        for (let i = 0; i < count; i++) {
            let y  = random(height);
            let h  = random(4, 40);
            let ox = random(-maxOffset, maxOffset);
            ctx.drawImage(ctx.canvas, 0, y, width, h, ox, y, width, h);
        }
        ctx.restore();
    }

    // ── FEAR — lights die, purple lightning tears the sky, the word FEAR burns ──
    _fearBuild(bp, tx, ty) {
        // Darkness swells — full-screen blackout that pulses
        let darkBase = bp * 0.75;
        let darkPulse = sin(frameCount * lerp(0.04, 0.18, bp)) * 0.15;
        push();
        noStroke();
        fill(0, 0, 0, (darkBase + darkPulse) * 255);
        rect(0, 0, width, height);
        pop();

        // Purple lightning bolts spanning full screen
        if (bp > 0.25 && noise(frameCount * 0.3) > 0.55) {
            push();
            let a = bp * 220;
            stroke(180, 0, 255, a);
            strokeWeight(random(1, 3));
            let lx = random(width), ly = 0;
            for (let s = 0; s < 10; s++) {
                let nx = lx + random(-80, 80);
                let ny = ly + height / 10;
                line(lx, ly, nx, ny);
                lx = nx; ly = ny;
            }
            // glow pass
            stroke(220, 100, 255, a * 0.4);
            strokeWeight(6);
            line(random(width), 0, random(width), height);
            pop();
        }

        // Converging purple rays from all edges
        push();
        noFill();
        for (let i = 0; i < 16; i++) {
            let angle = (i / 16) * TWO_PI + frameCount * 0.005;
            let len   = lerp(width, 0, bp * bp);
            stroke(120, 0, 180, bp * 160);
            strokeWeight(lerp(4, 1, bp));
            line(tx + cos(angle) * len, ty + sin(angle) * len, tx, ty);
        }
        pop();

        // "FEAR" text eruption — random flashes
        if (bp > 0.5 && noise(frameCount * 0.25 + 10) > 0.60) {
            this._flashText('FEAR', 160, 0, 255, bp * 200, lerp(60, 240, bp));
        }

        // Intense purple strobe in final 30%
        if (bp > 0.7) {
            let s = noise(frameCount * 0.6) > 0.55 ? ((bp - 0.7) / 0.3) * 220 : 0;
            if (s > 0) { push(); noStroke(); fill(80, 0, 140, s); rect(0, 0, width, height); pop(); }
        }
    }

    // ── DOUBT — reality glitches apart, red corruption, screen tears ────────
    _doubtBuild(bp, tx, ty) {
        // Heavy red tint building
        push();
        noStroke();
        fill(200, 0, 0, bp * 140);
        rect(0, 0, width, height);
        pop();

        // Full-screen canvas glitch strips — intensity grows
        if (bp > 0.2) {
            this._glitchStrips(floor(bp * 22), bp * 80, bp * 0.7);
        }

        // Chromatic split — R and B channels pulled apart
        let aberr = bp * 35;
        push();
        blendMode(SCREEN);
        noStroke();
        fill(255, 0, 0, bp * 80);
        rect(aberr, 0, width, height);
        fill(0, 0, 255, bp * 80);
        rect(-aberr, 0, width, height);
        pop();

        // Horizontal red scan-line static across WHOLE screen
        push();
        noStroke();
        for (let i = 0; i < floor(bp * 30); i++) {
            let y = random(height);
            fill(255, 0, 0, random(80, 200) * bp);
            rect(0, y, width, random(1, 5));
        }
        pop();

        // "DOUBT" text flash
        if (bp > 0.45 && noise(frameCount * 0.28 + 20) > 0.62) {
            this._flashText('DOUBT', 255, 30, 30, bp * 210, lerp(60, 220, bp));
        }

        // Complete colour breakdown in final 25% — rapid RGB strobing
        if (bp > 0.75) {
            let t = (bp - 0.75) / 0.25;
            let c = floor(frameCount / 2) % 3;
            let cols = [[255,0,0],[0,255,0],[0,0,255]];
            push(); noStroke();
            fill(cols[c][0], cols[c][1], cols[c][2], t * 120);
            rect(0, 0, width, height);
            pop();
        }
    }

    // ── REGRET — world drowns in blue, rain pours, memories bleed ───────────
    _regretBuild(bp, tx, ty) {
        // Deep blue flood
        push();
        noStroke();
        fill(0, 10, 80, bp * 180);
        rect(0, 0, width, height);
        pop();

        // Full-screen rain — many vertical streaks
        push();
        stroke(60, 100, 255, bp * 160);
        strokeWeight(1);
        let drops = floor(bp * 120);
        for (let i = 0; i < drops; i++) {
            let seed = i * 7.3;
            let x    = (noise(seed, frameCount * 0.01) * width * 1.2) % width;
            let y    = (frameCount * (3 + noise(seed) * 4) + seed * 80) % height;
            let len  = random(10, 40);
            line(x, y, x + 2, y + len);
        }
        pop();

        // Large ripple rings from everywhere
        push();
        noFill();
        for (let r = 0; r < 6; r++) {
            let t   = (bp * 2 + r * 0.3) % 1;
            let rx  = lerp(0, width, noise(r * 13.1));
            let ry  = lerp(0, height, noise(r * 13.1 + 5));
            let rad = t * 600;
            let a   = (1 - t) * bp * 200;
            stroke(20, 60, 220, a);
            strokeWeight(lerp(3, 0.5, t));
            ellipse(rx, ry, rad * 2, rad * 2);
        }
        pop();

        // Upward memory orbs — slow, lots of them
        push();
        noStroke();
        for (let i = 0; i < 50; i++) {
            let seed = i * 44.2;
            let t    = (frameCount * 0.002 + seed * 0.05) % 1;
            let x    = (noise(seed) * width * 1.3) % width;
            let y    = height - t * height * 1.3;
            let sz   = 4 + noise(seed + 2) * 14;
            fill(40, 80, 255, bp * 120 * (1 - t));
            ellipse(x, y, sz, sz);
        }
        pop();

        // "REGRET" text
        if (bp > 0.5 && noise(frameCount * 0.15 + 30) > 0.65) {
            this._flashText('REGRET', 30, 80, 255, bp * 190, lerp(50, 180, bp));
        }
    }

    // ── ANGER — everything burns, the whole world shatters red ──────────────
    _angerBuild(bp, tx, ty) {
        // Beating red pulse — heartbeat tempo, speeds up
        let freq  = lerp(0.05, 0.4, bp);
        let pulse = max(0, sin(frameCount * freq));
        push();
        noStroke();
        fill(255, 0, 0, pulse * bp * 200);
        rect(0, 0, width, height);
        pop();

        // Crack web spreading from enemy across WHOLE screen
        push();
        noFill();
        for (let i = 0; i < 18; i++) {
            let seed  = i * 41.7;
            let angle = (i / 18) * TWO_PI + noise(seed) * 0.5;
            let maxLen = sqrt(width * width + height * height) * 0.7;
            let len   = bp * maxLen * (0.5 + noise(seed + 1) * 0.6);
            stroke(255, 50 + noise(seed + 2) * 100, 0, bp * 220);
            strokeWeight(lerp(3, 0.5, bp));
            let px = tx, py = ty;
            for (let s = 0; s < 6; s++) {
                let drift = (noise(seed + s * 9, frameCount * 0.002) - 0.5) * 60;
                let nx = px + cos(angle) * len / 6 + drift;
                let ny = py + sin(angle) * len / 6 + drift;
                line(px, py, nx, ny);
                if (s === 3) {
                    let ba = angle + (noise(seed + 77) - 0.5) * 1.4;
                    line(nx, ny, nx + cos(ba) * len * 0.3, ny + sin(ba) * len * 0.3);
                }
                px = nx; py = ny;
            }
        }
        pop();

        // Explosion bursts from random screen positions
        if (bp > 0.3 && frameCount % 8 === 0) {
            push();
            noFill();
            let bx = random(width), by = random(height);
            for (let r = 0; r < 3; r++) {
                stroke(255, random(50, 150), 0, bp * 200);
                strokeWeight(3 - r);
                ellipse(bx, by, r * 80 * bp, r * 80 * bp);
            }
            pop();
        }

        // Fire embers from bottom — ALL across width
        push();
        noStroke();
        for (let i = 0; i < 60; i++) {
            let seed = i * 22.3;
            let t    = (frameCount * 0.008 + seed * 0.06) % 1;
            let x    = noise(seed, t * 0.3) * width;
            let y    = height - t * height * 1.2;
            let sz   = lerp(12, 2, t);
            fill(255, lerp(200, 30, t), 0, bp * (1 - t) * 220);
            ellipse(x, y, sz, sz);
        }
        pop();

        // "ANGER" text
        if (bp > 0.4 && noise(frameCount * 0.35 + 40) > 0.58) {
            this._flashText('ANGER', 255, 40, 0, bp * 230, lerp(80, 260, bp));
        }

        // Violent red flash bursts in final 20%
        if (bp > 0.8 && noise(frameCount * 0.7) > 0.5) {
            push(); noStroke();
            fill(255, 0, 0, ((bp - 0.8) / 0.2) * 240);
            rect(0, 0, width, height);
            pop();
        }
    }

    // ── PROCRASTINATION — time melts, blur swallows everything ─────────────
    _procastBuild(bp, tx, ty) {
        // Full-screen amber fog that thickens
        push();
        noStroke();
        fill(200, 120, 0, bp * 160);
        rect(0, 0, width, height);
        pop();

        // Increasing CSS blur — applied to subsequent draws via ctx
        let blurPx = bp * 10;
        drawingContext.filter = `blur(${blurPx}px)`;

        // Canvas ghost echo — draw canvas shifted, creating time-smear
        if (bp > 0.25) {
            let ctx = drawingContext;
            ctx.save();
            ctx.globalAlpha = bp * 0.25;
            ctx.translate(bp * 20, 0);
            ctx.drawImage(ctx.canvas, 0, 0);
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = bp * 0.15;
            ctx.translate(-bp * 20, 0);
            ctx.drawImage(ctx.canvas, 0, 0);
            ctx.restore();
        }

        drawingContext.filter = 'none';

        // Huge slow amber orbs drifting
        push();
        noStroke();
        for (let i = 0; i < 25; i++) {
            let seed = i * 57.4;
            let t    = (frameCount * 0.0015 + seed * 0.07) % 1;
            let x    = noise(seed, t * 0.2) * width;
            let y    = noise(seed + 5, t * 0.2) * height;
            let sz   = 30 + noise(seed + 1) * 80;
            fill(255, 160, 0, bp * 60 * noise(seed + 3, t));
            ellipse(x, y, sz, sz);
        }
        pop();

        // Clock face motif in centre
        if (bp > 0.3) {
            push();
            noFill();
            stroke(255, 180, 0, bp * 160);
            strokeWeight(3);
            ellipse(width/2, height/2, bp * 400, bp * 400);
            // clock hands spinning
            translate(width/2, height/2);
            let handLen = bp * 160;
            rotate(frameCount * 0.02 * bp);
            stroke(255, 200, 0, bp * 200);
            strokeWeight(4);
            line(0, 0, 0, -handLen);
            rotate(PI / 2);
            line(0, 0, 0, -handLen * 0.7);
            pop();
        }

        // "LATER..." text
        if (bp > 0.5 && noise(frameCount * 0.1 + 50) > 0.68) {
            this._flashText('LATER...', 255, 160, 0, bp * 200, lerp(50, 160, bp));
        }

        // Orange strobe at end
        if (bp > 0.75) {
            let s = (sin(frameCount * 0.22) * 0.5 + 0.5) * ((bp - 0.75) / 0.25) * 180;
            push(); noStroke(); fill(255, 130, 0, s); rect(0, 0, width, height); pop();
        }
    }

    // ── INSECURITY — the world cracks and breaks, nothing holds ────────────
    _insecurityBuild(bp, tx, ty) {
        // Crimson dark flood
        push();
        noStroke();
        fill(120, 0, 20, bp * 190);
        rect(0, 0, width, height);
        pop();

        // Cracks radiating from ALL corners AND centre — full screen web
        push();
        noFill();
        const origins = [
            {x: 0, y: 0}, {x: width, y: 0},
            {x: 0, y: height}, {x: width, y: height},
            {x: tx, y: ty}
        ];
        for (let o of origins) {
            for (let i = 0; i < 8; i++) {
                let seed  = o.x * 0.01 + o.y * 0.01 + i * 31.3;
                let angle = (i / 8) * TWO_PI + noise(seed) * 0.6;
                let len   = bp * (180 + noise(seed + 1) * 240);
                stroke(220, 0, 40, bp * 200 * noise(seed + 4, frameCount * 0.005));
                strokeWeight(lerp(2.5, 0.4, bp));
                let px = o.x, py = o.y;
                for (let s = 0; s < 5; s++) {
                    let drift = (noise(seed + s * 11, frameCount * 0.003) - 0.5) * 55;
                    let nx = px + cos(angle) * len / 5 + drift;
                    let ny = py + sin(angle) * len / 5 + drift;
                    line(px, py, nx, ny);
                    px = nx; py = ny;
                }
            }
        }
        pop();

        // Canvas glitch — shattering reality
        if (bp > 0.3) {
            this._glitchStrips(floor(bp * 16), bp * 60, bp * 0.55);
        }

        // Flickering mirror tiles — different part of screen offset and reflected
        if (bp > 0.45) {
            let ctx = drawingContext;
            ctx.save();
            ctx.globalAlpha = bp * 0.3;
            ctx.scale(-1, 1);
            ctx.translate(-width, 0);
            ctx.drawImage(ctx.canvas, 0, 0);
            ctx.restore();
        }

        // "WORTHLESS" text
        if (bp > 0.5 && noise(frameCount * 0.22 + 60) > 0.63) {
            this._flashText('WORTHLESS', 220, 0, 40, bp * 210, lerp(40, 160, bp));
        }

        // Final breakdown — rapid crimson strobing
        if (bp > 0.7) {
            let s = noise(frameCount * 0.5) > 0.52 ? ((bp - 0.7) / 0.3) * 230 : 0;
            if (s > 0) { push(); noStroke(); fill(180, 0, 30, s); rect(0, 0, width, height); pop(); }
        }
    }

    // ---- dead code graveyard below — replaced by new entry methods above ----
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

        // Pick a launch point off-screen on a random edge
        let tx = this[`${enemy}X`] || width / 2;
        let ty = this[`${enemy}Y`] || height / 2;
        let edge = floor(random(4));
        let sx, sy;
        if      (edge === 0) { sx = random(width);  sy = -220; }           // top
        else if (edge === 1) { sx = width + 220;    sy = random(height); } // right
        else if (edge === 2) { sx = random(width);  sy = height + 220; }   // bottom
        else                 { sx = -220;            sy = random(height); } // left

        this.entryEffects[enemy] = {
            ...this.entryEffects[enemy],
            active: true,
            timer: millis(),
            startX: sx,
            startY: sy,
            progress: 0,
            strobeFired: false,
            impactFired: false
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
        let checkDialogueComplete = this.setInterval(() => {
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
                        this.setTimeout(() => {
                            if (currentScene !== this) return;
                            // Trigger Hope's final dialogue
                            this.dialogueBox.startDialogue("I feel myself dying... Save meeeee!", "Hope", color(0, 100, 255));

                            // Start strobing and fade out AFTER dialogue completes
                            let checkHopeDialogue = this.setInterval(() => {
                                if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                                    clearInterval(checkHopeDialogue);
                                    if (currentScene !== this) return;
                                    this.hopeStrobing = true;

                                    // Disappear after 3 seconds of strobing, then transition to Scene6
                                    this.setTimeout(() => {
                                        if (currentScene !== this) return;
                                        this.hopeVisible = false;

                                        // Brief pause then go to main battle
                                        this.setTimeout(() => {
                                            if (currentScene !== this) return;
                                            this.cleanup();
                                            currentScene = new Scene6();
                                            if (currentScene.preload) currentScene.preload();
                                        }, 1500);
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



