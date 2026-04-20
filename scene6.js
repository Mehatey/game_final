class Scene6 {
    constructor() {
        // Add initialization flag at the start
        this.isInitialized = false;
        this.gameStarted = false;
        this.instructionsRead = false;
        this.font = null;

        // Initialize hero images first
        this.heroImages = {
            default: null,
            left: null
        };

        // Initialize hero with default values
        this.hero = {
            x: 100,
            y: height / 2,
            image: null,
            direction: 'default'
        };

        // Game state
        this.motivation = 100;
        this.doubtHealth = 100;
        this.doubtY = height / 2;
        this.gameTimer = 60;
        this.lastTime = millis();

        // Projectiles
        this.missiles = [];
        this.redOrbs = [];
        this.lastOrbTime = 0;
        this.orbInterval = 3000;

        // Assets
        this.background = null;
        this.doubt = null;
        this.missile2 = null;

        // Game state
        this.gameOver = false;

        // Cannon properties
        this.moveSpeed = 8;  // Increased from 5 to 8
        this.cannonActive = false;
        this.cannonPosition = createVector(0, 0);
        this.cannonDirection = createVector(1, 0);
        this.cannonName = localStorage.getItem('cannonName') || "HOPE";
        this.cannonFlash = false;

        // Animation
        this.bursts = [];
        this.burstDuration = 500;

        // Add sound
        this.scarySound = null;
        this.hurtSound = null;
        this.soundStarted = false;

        // Add doubt movement
        this.doubtDirection = 1;
        this.doubtSpeed = 3;

        // Increase sizes
        this.heroSize = 150;  // Triple size (was 50)
        this.missileSize = 50;  // Single size for all missiles

        // Add flash overlay properties
        this.flashAlpha = 0;
        this.flashDuration = 30;

        // Screen shake
        this._shakeFrames    = 0;
        this._shakeMag       = 0;
        this._cannonBursts   = [];   // particles on cannon fire
        this._chargeWarning  = 0;

        // Add missile count limit
        this.maxMissiles = 2;  // Reduced from 3 to 2
        this.missileSpawnRate = 0.005; // Lower initial spawn rate
        this.missileSpawnIncrease = 0.00002; // Slower increment rate over time
        this.missileStartTime = 57; // Start spawning missiles at 57 seconds

        // Reduce missile speed range
        this.missileSpeedRange = {
            min: -3,
            max: 3
        };

        // Initialize missiles
        this.missiles = [];
        for (let i = 0; i < this.maxMissiles; i++) {
            this.missiles.push({
                x: random(width),
                y: random(height),
                speedX: random(this.missileSpeedRange.min, this.missileSpeedRange.max),
                speedY: random(this.missileSpeedRange.min, this.missileSpeedRange.max),
                type: 'missile2',
                size: this.missileSize
            });
        }

        // Add sound loading flag
        this.soundsLoaded = false;
        this.doubtSoundPlayed = false;

        // Initialize bouncing sprites
        this.bouncingSprites = [
            {
                x: random(width),
                y: random(height),
                speedX: random(1.5, 2.5) * (random() > 0.5 ? 1 : -1),
                speedY: random(1.5, 2.5) * (random() > 0.5 ? 1 : -1),
                type: 'doubt',
                size: 100
            },
            {
                x: random(width),
                y: random(height),
                speedX: random(1.5, 2.5) * (random() > 0.5 ? 1 : -1),
                speedY: random(1.5, 2.5) * (random() > 0.5 ? 1 : -1),
                type: 'missile2',
                size: this.missileSize
            }
        ];

        // Initialize sounds
        this.sounds = {
            castle: null,
            doubt: null,
            hurt: null,
            firing: null,
            button: null,
            glow: null
        };

        // Add sound timing control
        this.lastDoubtSoundTime = 0;
        this.doubtSoundInterval = 10000; // 10 seconds
        this.doubtSoundDuration = 5000;  // 5 seconds

        // Add hit effect properties
        this.hitEffect = {
            active: false,
            duration: 1000,
            startTime: 0
        };

        // Add fade properties
        this.fadeAlpha = 0;
        this.fadeStarted = false;

        // Add button sound and hover state tracking
        this.buttonHovered = false;  // Track if button is being hovered

        this.gameStartDelay = 3000; // 3 seconds
        this.gameStartTime = millis();

        this.doubtHitEffect = false;
        this.doubtHitTime = 0;

        this.countdownActive = true;
        this.countdownTime = 3;
        this.lastCountdownUpdate = millis();

        // Add doubt movement properties
        this.doubtPosition = {
            x: width - 150,  // Starting x position
            y: height / 2,   // Starting y position
            rotation: 0,     // Current rotation angle
            rotationSpeed: 0.02  // Speed of rotation
        };

        // Add horizontal movement properties
        this.doubtHorizontalSpeed = 2;
        this.doubtHorizontalDirection = 1;
        this.doubtHorizontalRange = 200; // How far doubt moves horizontally
        this.doubtStartX = width - 150;  // Original x position

        // Add multi-orb attack properties
        this.isMultiOrbAttack = false;
        this.multiOrbChance = 0.005; // 0.5% chance initially
        this.maxMultiOrbs = 8; // Maximum number of orbs in multi-attack
        this.multiOrbDuration = 2000; // Duration of multi-orb attack in ms
        this.lastMultiOrbTime = 0;

        // Add charge attack properties
        this.isCharging = false;
        this.chargeSpeed = 15;
        this.chargeChance = 0.001; // 0.1% chance initially
        this.chargeCooldown = 5000; // 5 seconds cooldown
        this.lastChargeTime = 0;
        this.originalDoubtPos = null;

        this.fireballSpawnRate = 0.005; // Start with a low spawn rate
        this.fireballSpawnIncrease = 0.0001; // Increment rate over time

        // Add multi-fireball properties
        this.lastMultiFireballTime = 0;
        this.multiFireballInterval = 10000; // 10 seconds
        this.fireballCount = 8; // number of fireballs in each burst

        // Add these properties to your constructor
        this.victoryAnimation = false;
        this.victoryAnimationStart = 0;
        this.victoryAnimationDuration = 5000; // 5 seconds
        this.showVictoryScreen = false;
        this.particles = []; // for explosion effect

        this.specialPowerTime = 0;
        this.specialPowerDuration = 5000; // 5 seconds
        this.specialPowerActive = false;
        this.lastHitTime = millis();
        this.invincible = false;

        this.dialogueBox = new DialogueBox();
        this.dialogueIndex = 0;
        this.dialogues = [
            { text: "You did it, Hero! Doubt is defeated!", name: "Hope" },

        ];
        this.showDialogue = false; // Start with no dialogue

        this.doubtDefeated = false;
        this.doubtAnimationStart = 0;
        this.doubtDialogueShown = false;

        this.doubtOpacity = 255;
        this.fadeOverlayAlpha = 0;
        this.confetti = [];
        this.fireworks = [];

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

        // Add diagonal movement boost
        this.diagonalSpeedMultiplier = 0.71;  // For smooth diagonal movement
    }

    preload() {
        // Load hero images first
        this.heroImages.default = loadImage('assets/characters/meh0/hero1still.png');
        this.heroImages.left = loadImage('assets/characters/meh0/hero1left.png');

        // Set initial hero image
        this.hero.image = this.heroImages.default;

        // Load other images
        this.background = loadImage('assets/backgrounds/bg8.png');
        this.doubt = loadImage('assets/characters/enemies/doubt.gif');
        this.missile2 = loadImage('assets/animations/missiles/missile2.gif');

        // Load sounds with proper callback chain
        soundFormats('mp3');
        this.sounds = {};
        this.sounds.castle = loadSound('./assets/sounds/castle.mp3', () => {
            this.sounds.doubt = loadSound('./assets/sounds/doubt.mp3', () => {
                this.sounds.hurt = loadSound('./assets/sounds/hurt.mp3', () => {
                    this.sounds.firing = loadSound('./assets/sounds/firing.mp3', () => {
                        this.sounds.button = loadSound('./assets/sounds/button.mp3', () => {
                            this.scarySound = loadSound('./assets/sounds/scary.mp3', () => {
                                this.soundsLoaded = true;
                                console.log('All sounds loaded');
                            });
                        });
                    });
                });
            });
        });

        this.font = loadFont('./assets/fonts/ARCADE.TTF');

        // Load sounds
        this.sounds.glow = loadSound('./assets/sounds/glow.mp3');
    }

    // Add this method to start sounds after scene is fully loaded
    startSounds() {
        if (this.soundsLoaded && this.scarySound && !this.soundStarted) {
            this.scarySound.loop();
            this.soundStarted = true;
        }
    }

    draw() {
        if (!this.isInitialized) {
            this.setup();
            if (this.soundsLoaded) {
                this.startSounds();
            }
        }

        if (!this.instructionsRead) {
            this.showInstructions();
            return;
        }

        if (this.doubtHealth <= 0 && !this.doubtDefeated) {
            this.animateDoubtDefeat(); // Trigger animation
            return;
        }

        if (this.gameOver) {
            if (this.victory) {
                this.showGameOver(); // Victory screen
            } else {
                this.showDefeatScreen(); // Defeat screen
            }
            return;
        }

        // Update timer
        if (millis() - this.lastTime >= 1000) {
            this.gameTimer--;
            this.lastTime = millis();
            if (this.gameTimer <= 0) {
                this.gameOver = true;
                this.victory = false; // Defeat if timer reaches 0
            }
        }

        // Check defeat conditions
        if (this.motivation <= 0 || this.heroHitByDoubt()) {
            this.gameOver = true;
            this.victory = false; // Defeat if motivation is 0 or hero is hit
        }

        // Screen shake
        if (this._shakeFrames > 0) {
            translate(random(-this._shakeMag, this._shakeMag),
                      random(-this._shakeMag, this._shakeMag));
            this._shakeFrames--;
        }

        // Draw background
        background(this.background);

        // Mode: danger during battle
        CustomCursor.mode = 'danger';

        // Unified top HUD bar
        this.drawHUD();

        // Allow hero movement
        this.updateHero();
        this.drawHero();

        // Draw timer
        // drawTimer handled by unified HUD above

        // Generate red orbs
        if (millis() - this.lastOrbTime > this.orbInterval) {
            this.createRedOrb();
            this.lastOrbTime = millis();
        }

        // Spawn missiles
        if (random(1) < this.missileSpawnRate) {
            this.createMissile();
        }

        // Update and draw projectiles
        this.updateProjectiles();

        // Draw motivation bar
        // drawMotivationBar handled by unified HUD above

        // Cannon burst particles
        if (this._cannonBursts.length > 0) {
            push(); noStroke();
            for (let i = this._cannonBursts.length - 1; i >= 0; i--) {
                let b = this._cannonBursts[i];
                b.x += b.vx; b.y += b.vy; b.vy += 0.18;
                b.life--;
                if (b.life <= 0) { this._cannonBursts.splice(i, 1); continue; }
                fill(b.r, b.g, b.b, map(b.life, 22, 0, 220, 0));
                ellipse(b.x, b.y, b.sz * (b.life/22));
            }
            pop();
        }

        // Draw cannon if active
        if (this.cannonActive) {
            this.drawCannon();
            this.cannonPosition.add(p5.Vector.mult(this.cannonDirection, 12));
            if (this.cannonPosition.x > width) {
                this.cannonActive = false;
            }
        }

        // Check collisions
        this.checkCollisions();

        // Update doubt position
        this.updateDoubtPosition();

        // Draw shield if special power is active
        if (this.specialPowerActive) {
            this.createShieldEffect();
        }

        // Red hit flash overlay (full screen)
        if (this.flashAlpha > 0) {
            push();
            noStroke();
            fill(255, 0, 0, this.flashAlpha);
            rect(0, 0, width, height);
            this.flashAlpha = max(0, this.flashAlpha - 12);
            pop();
        }

        // Doubt charge warning — yellow pulse before charge
        if (this.isCharging) {
            push();
            noStroke();
            let warn = (sin(frameCount * 0.5) * 0.5 + 0.5) * 60;
            fill(255, 220, 0, warn);
            rect(0, 0, width, height);
            pop();
        }

        // Update special power bar
        this.updateSpecialPowerBar();

        // Draw special power bar
        this.drawSpecialPowerBar();

        if (this.doorOpening) {
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
        }
    }

    drawTimer() {
        push();
        let t    = this.gameTimer;
        let isLow = t <= 10;
        let pulse = isLow ? (sin(frameCount * 0.28) * 0.5 + 0.5) : 0;
        drawingContext.shadowBlur  = isLow ? 18 + pulse * 18 : 8;
        drawingContext.shadowColor = isLow ? 'rgba(255,80,80,0.9)' : 'rgba(255,255,255,0.3)';
        noStroke();
        fill(0, 0, 0, 160);
        rectMode(CENTER);
        rect(width / 2, 36, 90, 46, 12);
        fill(isLow ? color(255, 80 + pulse * 80, 80) : 255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(t + 's', width / 2, 36);
        drawingContext.shadowBlur = 0;
        pop();
    }

    drawHUD() {
        push();
        // Single unified frosted bar across top
        noStroke();
        fill(0, 0, 0, 170);
        rectMode(CORNER);
        rect(0, 0, width, 64);

        // LEFT — Motivation bar
        let mw  = min(260, width * 0.22);
        let mfill = map(this.motivation, 0, 100, 0, mw);
        let mLow  = this.motivation < 30;
        let mPulse = mLow ? (sin(frameCount * 0.25) * 0.5 + 0.5) : 0;
        let ctx = drawingContext;

        // bg
        fill(0, 0, 0, 120); rect(20, 14, mw, 22, 6);
        // fill gradient
        let mg = ctx.createLinearGradient(20, 14, 20 + mw, 14);
        mg.addColorStop(0, mLow ? `rgba(255,${80+mPulse*80},60,0.85)` : 'rgba(255,140,60,0.85)');
        mg.addColorStop(1, mLow ? 'rgba(200,40,40,0.85)' : 'rgba(220,100,40,0.85)');
        ctx.fillStyle = mg; ctx.fillRect(20, 14, mfill, 22);
        if (mLow) { drawingContext.shadowBlur = 10; drawingContext.shadowColor = 'rgba(255,80,80,0.7)'; }
        fill(240, 200, 160); textSize(12); textAlign(LEFT, CENTER);
        text('MOTIVATION  ' + floor(this.motivation) + '%', 26, 36);
        drawingContext.shadowBlur = 0;

        // CENTER — Timer (dominant)
        let t = ceil(this.gameTimer);
        let tLow = t <= 10;
        let tPulse = tLow ? (sin(frameCount * 0.28) * 0.5 + 0.5) : 0;
        fill(0, 0, 0, 160); rectMode(CENTER); rect(width/2, 32, 100, 52, 10);
        if (tLow) { drawingContext.shadowBlur = 20 + tPulse*16; drawingContext.shadowColor = 'rgba(255,80,80,0.9)'; }
        else      { drawingContext.shadowBlur = 8; drawingContext.shadowColor = 'rgba(100,180,255,0.4)'; }
        fill(tLow ? color(255, 80+tPulse*80, 80) : color(100, 200, 255));
        textSize(36); textAlign(CENTER, CENTER);
        text(t + 's', width/2, 32);
        drawingContext.shadowBlur = 0;

        // RIGHT — Doubt health
        let dw    = min(260, width * 0.22);
        let dx0   = width - 20 - dw;
        let dfill = map(this.doubtHealth, 0, 100, 0, dw);
        let dLow  = this.doubtHealth < 20;
        fill(0, 0, 0, 120); rectMode(CORNER); rect(dx0, 14, dw, 22, 6);
        let dg = ctx.createLinearGradient(dx0, 14, dx0 + dw, 14);
        dg.addColorStop(0, 'rgba(255,60,60,0.85)');
        dg.addColorStop(1, 'rgba(200,30,30,0.85)');
        ctx.fillStyle = dg; ctx.fillRect(dx0, 14, dfill, 22);
        if (dLow) { drawingContext.shadowBlur = 12; drawingContext.shadowColor = 'rgba(255,60,60,0.7)'; }
        fill(255, 160, 160); textSize(12); textAlign(RIGHT, CENTER);
        text('DOUBT  ' + floor(this.doubtHealth) + '%', width - 26, 36);
        drawingContext.shadowBlur = 0;
        pop();
    }

    drawDoubtHealthBar() {
        // kept for compatibility — unified HUD handles this now
    }

    drawMotivationBar_legacy() {
        push();
        rectMode(CORNER);
        let barW = map(this.doubtHealth, 0, 100, 0, 220);
        noStroke();
        fill(0, 0, 0, 160);
        rect(width - 248, 16, 232, 34, 8);
        drawingContext.shadowBlur  = 8;
        drawingContext.shadowColor = 'rgba(255,40,40,0.7)';
        fill(200, 30, 30);
        rect(width - 244, 20, barW, 26, 6);
        drawingContext.shadowBlur = 0;
        fill(255);
        textSize(13);
        textAlign(RIGHT, CENTER);
        text('DOUBT  ' + floor(this.doubtHealth) + '%', width - 26, 34);
        pop();
    }

    drawMotivationBar() {
        push();
        rectMode(CORNER);
        let isLow = this.motivation < 30;
        let barW   = map(this.motivation, 0, 100, 0, 220);
        let pulse  = isLow ? (sin(frameCount * 0.25) * 0.5 + 0.5) : 0;

        // Background
        noStroke();
        fill(0, 0, 0, 160);
        rect(16, 16, 228, 34, 8);

        // Bar fill
        drawingContext.shadowBlur  = isLow ? 14 + pulse * 14 : 6;
        drawingContext.shadowColor = isLow ? 'rgba(255,60,60,0.9)' : 'rgba(60,255,60,0.5)';
        fill(isLow ? color(255, 60 + pulse * 80, 60) : color(60, 220, 80));
        rect(20, 20, barW, 26, 6);
        drawingContext.shadowBlur = 0;

        // Label
        noStroke();
        fill(255);
        textSize(13);
        textAlign(LEFT, CENTER);
        text('MOTIVATION  ' + floor(this.motivation) + '%', 26, 34);
        pop();
    }

    updateHero() {
        // Store previous position for collision detection
        let prevX = this.hero.x;
        let prevY = this.hero.y;

        let movingHorizontal = false;
        let movingVertical = false;

        // Horizontal movement with image switching - add null checks
        if (keyIsDown(LEFT_ARROW)) {
            this.hero.x -= this.moveSpeed;
            movingHorizontal = true;
            if (this.heroImages.default) {
                this.hero.image = this.heroImages.default;
            }
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.hero.x += this.moveSpeed;
            movingHorizontal = true;
            if (this.heroImages.left) {
                this.hero.image = this.heroImages.left;
            }
        }

        // Vertical movement
        if (keyIsDown(UP_ARROW)) {
            this.hero.y -= this.moveSpeed;
            movingVertical = true;
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.hero.y += this.moveSpeed;
            movingVertical = true;
        }

        // Apply diagonal movement correction
        if (movingHorizontal && movingVertical) {
            this.hero.x = prevX + (this.hero.x - prevX) * this.diagonalSpeedMultiplier;
            this.hero.y = prevY + (this.hero.y - prevY) * this.diagonalSpeedMultiplier;
        }

        // Keep hero in bounds
        this.hero.x = constrain(this.hero.x, 0, width);
        this.hero.y = constrain(this.hero.y, 0, height);
    }

    drawHero() {
        // Check if image is loaded before drawing
        if (this.hero.image) {
            push();
            imageMode(CENTER);
            image(this.hero.image, this.hero.x, this.hero.y, this.heroSize, this.heroSize);
            pop();
        }
    }

    drawHope() {
        // Draw Hope character flying in
        let hopeX = width / 2;
        let hopeY = height / 2 - 100;
        imageMode(CENTER);
        image(this.hopeImage, hopeX, hopeY, 100, 100);
    }

    createRedOrb() {
        const currentTime = millis();

        // Play doubt sound
        if (currentTime - this.lastDoubtSoundTime > this.doubtSoundInterval) {
            if (this.sounds.doubt) {
                this.sounds.doubt.play();
                this.lastDoubtSoundTime = currentTime;
            }
        }

        // Check if it's time for multi-fireball attack
        if (currentTime - this.lastMultiFireballTime > this.multiFireballInterval) {
            // Calculate angle to hero
            let angleToHero = atan2(this.hero.y - this.doubtPosition.y,
                this.hero.x - this.doubtPosition.x);

            // Create rotating circle of fireballs
            for (let i = 0; i < this.fireballCount; i++) {
                // Create orbit effect with rotating angles
                let orbitRadius = 50; // Radius of the circular formation
                let orbitAngle = (i * TWO_PI / this.fireballCount);

                let orb = {
                    x: this.doubtPosition.x, // Start from doubt's position
                    y: this.doubtPosition.y,
                    speed: 5,
                    size: 30,
                    maxSize: 60,
                    pulseAmount: 0,
                    glowSize: 1.5,
                    orbitAngle: orbitAngle, // Store the orbit angle
                    orbitRadius: orbitRadius,
                    rotationSpeed: 0.05 // Speed of rotation
                };

                // Calculate velocity towards hero while maintaining orbital motion
                orb.vx = cos(angleToHero) * orb.speed;
                orb.vy = sin(angleToHero) * orb.speed;

                // Add orbital motion properties
                orb.updatePosition = function (time) {
                    // Update orbit angle
                    this.orbitAngle += this.rotationSpeed;

                    // Add orbital offset to straight-line motion
                    this.x += this.vx + cos(this.orbitAngle) * this.orbitRadius * 0.1;
                    this.y += this.vy + sin(this.orbitAngle) * this.orbitRadius * 0.1;
                };

                this.redOrbs.push(orb);
            }
            this.lastMultiFireballTime = currentTime;
        } else {
            // Create single fireball aimed at hero
            let orb = {
                x: this.doubtPosition.x,
                y: this.doubtPosition.y,
                speed: 5,
                size: 30,
                maxSize: 60,
                pulseAmount: 0,
                glowSize: 1.5
            };

            let angle = atan2(this.hero.y - orb.y, this.hero.x - orb.x);
            orb.vx = cos(angle) * orb.speed;
            orb.vy = sin(angle) * orb.speed;

            this.redOrbs.push(orb);
        }
    }

    createMissile() {
        let missile = {
            x: this.doubtPosition.x,
            y: this.doubtPosition.y,
            speedX: random(this.missileSpeedRange.min, this.missileSpeedRange.max), // Reduced speed range
            speedY: random(this.missileSpeedRange.min, this.missileSpeedRange.max), // Reduced speed range
            type: 'missile2',
            size: this.missileSize
        };
        this.missiles.push(missile);
    }

    createFireballs() {
        let numFireballs = 5; // Number of fireballs to create
        for (let i = 0; i < numFireballs; i++) {
            let angle = random(TWO_PI);
            let fireball = {
                x: this.doubtPosition.x,
                y: this.doubtPosition.y,
                vx: cos(angle) * 5,
                vy: sin(angle) * 5,
                size: 30
            };
            this.redOrbs.push(fireball);
        }
    }

    updateProjectiles() {
        // Increase missile spawn rate over time
        if (this.gameTimer < this.missileStartTime) {
            this.missileSpawnRate += this.missileSpawnIncrease;
        }

        // Update and draw red orbs
        for (let orb of this.redOrbs) {
            if (orb.updatePosition) {
                orb.updatePosition(frameCount); // Use the custom update function
            } else {
                orb.x += orb.vx;
                orb.y += orb.vy;
            }

            orb.pulseAmount = sin(frameCount * 0.1) * 10;
            let currentSize = orb.size + orb.pulseAmount;

            push();
            noStroke();
            fill(255, 50, 0, 50);
            ellipse(orb.x, orb.y, currentSize * orb.glowSize);

            fill(255, 100, 0, 100);
            ellipse(orb.x, orb.y, currentSize * 1.25);

            fill(255, 0, 0);
            ellipse(orb.x, orb.y, currentSize);

            fill(255, 200, 0, 150);
            ellipse(orb.x, orb.y, currentSize * 0.5);
            pop();

            orb.size = min(orb.size + 0.3, orb.maxSize);
            orb.glowSize += 0.01;
        }

        // Update and draw missiles
        for (let missile of this.missiles) {
            missile.x += missile.speedX;
            missile.y += missile.speedY;

            // Bounce off edges
            if (missile.x < 0 || missile.x > width) missile.speedX *= -1;
            if (missile.y < 0 || missile.y > height) missile.speedY *= -1;

            push();
            let angle = atan2(missile.speedY, missile.speedX);
            translate(missile.x, missile.y);
            rotate(angle);

            // Draw the missile body only if image is loaded
            if (this.missile2) {  // Add check for image loading
                image(this.missile2, -missile.size / 2, -missile.size / 2, missile.size, missile.size);
            }

            pop();
        }

        // Clean up off-screen projectiles
        this.missiles = this.missiles.filter(m =>
            m.x > -100 && m.x < width + 100 &&
            m.y > -100 && m.y < height + 100
        );

        this.redOrbs = this.redOrbs.filter(orb =>
            orb.x > -100 && orb.x < width + 100 &&
            orb.y > -100 && orb.y < height + 100
        );

        // Destroy projectiles that hit the shield
        if (this.specialPowerActive) {
            this.missiles = this.missiles.filter(missile => {
                let d = dist(this.hero.x, this.hero.y, missile.x, missile.y);
                if (d < this.heroSize + 50) {
                    this.createExplosionEffect(missile.x, missile.y);
                    this.shatterProjectile(missile.x, missile.y); // Shatter effect
                    return false; // Remove missile
                }
                return true;
            });

            this.redOrbs = this.redOrbs.filter(orb => {
                let d = dist(this.hero.x, this.hero.y, orb.x, orb.y);
                if (d < this.heroSize + 50) {
                    this.createExplosionEffect(orb.x, orb.y);
                    this.shatterProjectile(orb.x, orb.y); // Shatter effect
                    return false; // Remove orb
                }
                return true;
            });
        }
    }

    checkCollisions() {
        if (this.invincible) return; // Skip collision checks if invincible

        let collisionDetected = false;

        // Check cannon collision with doubt
        if (this.cannonActive) {
            // Check cannon collision with missiles first
            for (let i = this.missiles.length - 1; i >= 0; i--) {
                let missile = this.missiles[i];
                let d = dist(this.cannonPosition.x, this.cannonPosition.y, missile.x, missile.y);
                if (d < 40) {  // Collision radius for missiles
                    // Create explosion effect for missile
                    this.bursts.push({
                        x: missile.x,
                        y: missile.y,
                        size: 30,
                        startTime: millis()
                    });
                    // Remove the missile
                    this.missiles.splice(i, 1);
                }
            }

            // Then check cannon collision with doubt
            let d = dist(this.cannonPosition.x, this.cannonPosition.y,
                this.doubtPosition.x, this.doubtPosition.y);
            if (d < 75) {  // Increased collision radius
                this.doubtHitEffect = true;
                this.doubtHitTime = millis();

                // Create larger burst animation
                this.bursts.push({
                    x: this.doubtPosition.x,
                    y: this.doubtPosition.y,
                    size: 80,  // Bigger burst
                    startTime: millis()
                });

                // Reduce doubt health more significantly
                this.doubtHealth = max(0, this.doubtHealth - 25);  // More damage
                this.cannonActive = false;

                // Increase doubt size when hit
                this.heroSize = min(this.heroSize + 10, 250);  // Cap at max size

                // Add strong red flash overlay
                this.flashAlpha = 200;  // Stronger flash
            }
        }

        // Add charge collision check
        if (this.isCharging) {
            let chargeHitDistance = 50; // Adjust collision radius as needed
            let d = dist(this.hero.x, this.hero.y,
                this.doubtPosition.x, this.doubtPosition.y);

            if (d < chargeHitDistance) {
                this.motivation = 0;
                this.gameOver = true;
                return;
            }
        }

        for (let missile of this.missiles) {
            let d = dist(this.hero.x, this.hero.y, missile.x, missile.y);
            if (d < 30) {
                collisionDetected = true;
                // Activate hit effect when missile hits
                this.hitEffect.active = true;
                this.hitEffect.startTime = millis();

                if (this.sounds.hurt) {
                    this.sounds.hurt.play();
                }
                this.bursts.push({
                    x: missile.x,
                    y: missile.y,
                    size: 40,
                    startTime: millis()
                });

                this.motivation = max(0, this.motivation - 20);
                this.missiles.splice(this.missiles.indexOf(missile), 1);
                this._shakeFrames = 14; this._shakeMag = 8;
                this.flashAlpha = 180;
                if (this.motivation <= 0) {
                    this.gameOver = true;
                }
            }
        }

        for (let orb of this.redOrbs) {
            let d = dist(this.hero.x, this.hero.y, orb.x, orb.y);
            if (d < 25) {
                collisionDetected = true;
                // Activate hit effect when orb hits
                this.hitEffect.active = true;
                this.hitEffect.startTime = millis();

                if (this.sounds.hurt) {
                    this.sounds.hurt.play();
                }
                this.bursts.push({
                    x: orb.x,
                    y: orb.y,
                    size: 50,
                    startTime: millis()
                });

                this.motivation = 0;
                this.gameOver = true;
                this._shakeFrames = 20; this._shakeMag = 12;
                this.flashAlpha = 220;
            }
        }

        // Reset last hit time on collision
        if (collisionDetected) {
            this.lastHitTime = millis();
        }
    }

    updateDoubtPosition() {
        const currentTime = millis();
        const timeElapsed = (currentTime - this.gameStartTime) / 1000;

        // Handle charge attack
        if (!this.isCharging &&
            currentTime - this.lastChargeTime > this.chargeCooldown &&
            random() < this.chargeChance + (timeElapsed * 0.0001)) {

            this.isCharging = true;
            this.originalDoubtPos = {
                x: this.doubtPosition.x,
                y: this.doubtPosition.y
            };
            this.lastChargeTime = currentTime;

            // Calculate charge direction
            let angle = atan2(this.hero.y - this.doubtPosition.y,
                this.hero.x - this.doubtPosition.x);
            this.chargeVelocity = {
                x: cos(angle) * this.chargeSpeed,
                y: sin(angle) * this.chargeSpeed
            };
        }

        if (this.isCharging) {
            // Move doubt during charge
            this.doubtPosition.x += this.chargeVelocity.x;
            this.doubtPosition.y += this.chargeVelocity.y;

            // Check if doubt has gone past the player or reached screen edge
            if (this.doubtPosition.x < 0 || this.doubtPosition.x > width ||
                this.doubtPosition.y < 0 || this.doubtPosition.y > height) {
                // Return to original position
                this.isCharging = false;
                this.doubtPosition.x = this.originalDoubtPos.x;
                this.doubtPosition.y = this.originalDoubtPos.y;
            }
        } else {
            // Normal movement when not charging
            // Vertical movement
            this.doubtPosition.y += this.doubtSpeed * this.doubtDirection;
            if (this.doubtPosition.y > height - 100 || this.doubtPosition.y < 100) {
                this.doubtDirection *= -1;
            }

            // Random speed changes
            if (random() < 0.01) {
                this.doubtSpeed = random(2, 5);
            }

            // Horizontal movement
            this.doubtPosition.x += this.doubtHorizontalSpeed * this.doubtHorizontalDirection;
            let distanceFromStart = Math.abs(this.doubtPosition.x - this.doubtStartX);
            if (distanceFromStart > this.doubtHorizontalRange) {
                this.doubtHorizontalDirection *= -1;
            }

            // Rotation
            this.doubtPosition.rotation += this.doubtPosition.rotationSpeed;
        }

        // Draw doubt with all effects
        push();
        imageMode(CENTER);
        translate(this.doubtPosition.x, this.doubtPosition.y);
        rotate(this.doubtPosition.rotation);

        // Add charge glow gradient effect
        if (this.isCharging) {
            drawingContext.shadowBlur = 30;
            for (let i = 4; i > 0; i--) {
                push();
                noStroke();

                // Create gradient
                let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, 100);
                gradient.addColorStop(0, 'rgba(255, 200, 0, 0.4)');   // Yellow core
                gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.3)'); // Orange middle
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0.2)');     // Red outer

                drawingContext.fillStyle = gradient;
                ellipse(0, 0, 160 + i * 15, 160 + i * 15);
                pop();
            }
        }

        // Keep existing hit effect
        if (this.doubtHitEffect && millis() - this.doubtHitTime < 200) {
            tint(255, 0, 0, 200);
        }

        image(this.doubt, 0, 0, 150, 150);
        pop();
    }

    activateCannon() {
        if (!this.cannonActive) {
            if (this.sounds.firing) this.sounds.firing.play();
            this.cannonName      = localStorage.getItem('cannonName') || "HOPE";
            this.cannonPosition  = createVector(this.hero.x, this.hero.y);
            this.cannonDirection = createVector(1, 0);
            this.cannonActive    = true;

            // Screen shake + burst particles on fire
            this._shakeFrames = 10;
            this._shakeMag    = 6;
            for (let i = 0; i < 14; i++) {
                let a = (i / 14) * TWO_PI;
                this._cannonBursts.push({
                    x: this.hero.x, y: this.hero.y,
                    vx: cos(a) * random(3, 7),
                    vy: sin(a) * random(3, 7),
                    life: 22, sz: random(5, 12),
                    r: 255, g: floor(random(180, 240)), b: 60
                });
            }
        }
    }

    showGameOver() {
        if (this.victory) {
            if (!this.victoryAnimation) {
                this.victoryAnimation = true;
                this.victoryAnimationStart = millis();

                // Play hopeentry.mp3
                this.sounds.hopeEntry = loadSound('./assets/sounds/hopeentry.mp3', () => {
                    this.sounds.hopeEntry.play();
                });
            }

            // Victory screen
            background(0, 150);
            fill(this.dialogueBox.hopeBoxColor);
            stroke(this.dialogueBox.hopeStrokeColor);
            strokeWeight(this.dialogueBox.strokeWidth);
            rectMode(CENTER);
            rect(width / 2, height / 2, 400, 250, this.dialogueBox.cornerRadius);

            // Victory particles
            if (!this._vicStart) this._vicStart = millis();
            let vt = min(1, (millis() - this._vicStart) / 1500);
            push();
            noStroke();
            for (let i = 0; i < 50; i++) {
                let seed = i * 17.3;
                let angle = (i / 50) * TWO_PI + frameCount * 0.01;
                let d = 80 + noise(seed) * 200 + vt * 60;
                let px = width/2 + cos(angle) * d;
                let py = height/2 + sin(angle) * d * 0.6;
                let sz = 4 + noise(seed, frameCount * 0.02) * 10;
                fill(floor(random(100,255)), floor(random(150,255)), 80, 180);
                ellipse(px, py, sz, sz);
            }
            pop();

            drawingContext.shadowBlur  = 28;
            drawingContext.shadowColor = 'rgba(100,200,100,0.9)';
            fill(120, 255, 120);
            textAlign(CENTER, CENTER);
            textSize(44);
            text('YOU BEAT DOUBT!', width / 2, height / 2 - 70);
            drawingContext.shadowBlur = 0;

            fill(220, 220, 255);
            textSize(20);
            text('Your motivation was stronger.', width / 2, height / 2 - 24);

            // Collect Learning button
            let buttonWidth = 240;
            let buttonHeight = 60;
            let buttonX = width / 2;
            let buttonY = height / 2 + 50;

            if (mouseX > buttonX - buttonWidth / 2 && mouseX < buttonX + buttonWidth / 2 &&
                mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2) {
                fill(120, 120, 255);
            } else {
                fill(80, 80, 255);
            }
            rectMode(CENTER);
            rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

            fill(255);
            textSize(24);
            textAlign(CENTER, CENTER);
            text('Collect Learning', buttonX, buttonY);

            if (mouseIsPressed && !this.transitioning &&
                mouseX > buttonX - buttonWidth / 2 && mouseX < buttonX + buttonWidth / 2 &&
                mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2) {
                this.transitioning = true;
                if (this.sounds.hopeEntry && this.sounds.hopeEntry.isPlaying()) {
                    this.sounds.hopeEntry.stop();
                }
                switchScene(new Scene7());
            }
        } else {
            // Defeat screen
            push();
            fill(0, 0, 0, 180);
            rect(0, 0, width, height);

            drawingContext.shadowBlur  = 24;
            drawingContext.shadowColor = 'rgba(255,60,60,0.8)';
            fill(255, 80, 80);
            textAlign(CENTER, CENTER);
            textSize(48);
            text('DOUBT WINS', width / 2, height / 2 - 50);
            drawingContext.shadowBlur = 0;

            fill(200, 200, 255);
            textSize(20);
            text('Your motivation ran out.', width / 2, height / 2 + 2);

            // Try Again button
            let bx = width/2, by = height/2 + 60, bw = 200, bh = 54;
            let hover = mouseX > bx-bw/2 && mouseX < bx+bw/2 && mouseY > by-bh/2 && mouseY < by+bh/2;
            drawingContext.shadowBlur  = hover ? 20 : 6;
            drawingContext.shadowColor = 'rgba(100,100,255,0.8)';
            fill(hover ? color(120, 120, 255) : color(60, 60, 200));
            rectMode(CENTER);
            rect(bx, by, bw, bh, 12);
            drawingContext.shadowBlur = 0;
            fill(255);
            textSize(22);
            text('TRY AGAIN', bx, by);
            pop();

            // Restart on click — only inside the button (bx/by/bw/bh already declared above)
            let onBtn = mouseX > bx-bw/2 && mouseX < bx+bw/2 && mouseY > by-bh/2 && mouseY < by+bh/2;
            if (mouseIsPressed && onBtn && !this.resettingGame) {
                this.resettingGame = true;
                this.resetGame();
            } else if (!mouseIsPressed) {
                this.resettingGame = false;
            }
        }
    }

    drawConfetti() {
        for (let i = 0; i < 20; i++) { // Reduced by 80%
            let x = random(width);
            let y = random(height);
            let size = random(5, 10);
            fill(random(255), random(255), random(255));
            noStroke();
            ellipse(x, y, size, size);
        }
    }

    drawFireworks() {
        for (let i = 0; i < 1; i++) { // Subtle effect
            let x = random(width);
            let y = random(height / 2);
            let size = random(20, 50);
            fill(random(255), random(255), random(255), 150);
            noStroke();
            ellipse(x, y, size, size);
        }
    }

    drawCollectInsightButton() {
        let buttonWidth = 200;
        let buttonHeight = 60;
        let buttonX = width / 2 - buttonWidth / 2;
        let buttonY = height * 0.75;

        push();
        if (this.isMouseOverButton(buttonX, buttonY, buttonWidth, buttonHeight)) {
            fill(100, 100, 255);
            if (mouseIsPressed) {
                // Handle button click
                console.log('Collect Insight clicked');
            }
        } else {
            fill(50);
        }
        rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

        fill(255);
        noStroke();
        textSize(24);
        textAlign(CENTER, CENTER);
        text('Collect Insight', width / 2, buttonY + buttonHeight / 2);
        pop();
    }

    drawCannon() {
        if (this.cannonActive) {
            push();
            translate(this.cannonPosition.x, this.cannonPosition.y);
            let angle = atan2(this.cannonDirection.y, this.cannonDirection.x);
            rotate(angle);

            // Draw glowing trail
            for (let i = 0; i < 7; i++) {
                let trailAlpha = map(i, 0, 7, 200, 0);
                let trailSize = map(i, 0, 7, 40, 15);
                fill(100, 100, 255, trailAlpha);
                noStroke();
                ellipse(-i * 15, 0, trailSize, trailSize);
            }

            // Draw main cannon body
            fill(150, 150, 255);
            rect(-30, -15, 60, 30, 5);

            // Draw energy core
            fill(255);
            ellipse(0, 0, 20, 20);

            // Add pulsing glow effect
            let pulseSize = 25 + sin(frameCount * 0.2) * 5;
            fill(200, 200, 255, 100);
            ellipse(0, 0, pulseSize, pulseSize);

            // Add pointy rocket front
            fill(150, 150, 255);
            noStroke();
            triangle(30, -15, 30, 15, 50, 0); // Pointy tip

            pop();
        }
    }

    // Add setup method to properly initialize the scene
    setup() {
        if (!this.isInitialized) {
            clear();
            background(0);
            this.isInitialized = true;

            // Reset all game states to initial values
            this.motivation = 100;
            this.doubtHealth = 100;
            this.doubtY = height / 2;
            this.gameTimer = 60;
            this.lastTime = millis();
            this.gameOver = false;

            // Reset hero position
            this.hero.x = 100;
            this.hero.y = height / 2;

            // Clear all arrays
            this.missiles = [];
            this.redOrbs = [];
            this.bursts = [];

            // Initialize with slower, smaller missiles
            for (let i = 0; i < this.maxMissiles; i++) {
                this.missiles.push({
                    x: random(width),
                    y: random(height),
                    speedX: random(this.missileSpeedRange.min, this.missileSpeedRange.max),
                    speedY: random(this.missileSpeedRange.min, this.missileSpeedRange.max),
                    type: 'missile2',
                    size: this.missileSize
                });
            }

            this.gameStartTime = millis();
        }
    }

    showInstructions() {
        // Start castle music when instructions show - add soundsLoaded check
        if (!this.isCastleMusicPlaying && this.sounds.castle && this.soundsLoaded) {
            this.sounds.castle.loop();
            this.isCastleMusicPlaying = true;
        }

        // Remove sound playing from here
        background(0, 0, 0, 200);

        // Update and draw bouncing sprites
        this.updateBouncingSprites();
        this.drawBouncingSprites();

        // Set font
        textFont(this.font);

        // Header
        push();
        textAlign(CENTER, CENTER);
        textSize(48);
        fill(255);
        text('INSTRUCTIONS', width / 2, height / 4);

        // Body text
        textSize(24);
        let instructions = [
            'Use the arrow keys to move',
            'Press Spacebar to fire a rocket',
            'If you get hit with a red Orb you instantly die'
        ];

        for (let i = 0; i < instructions.length; i++) {
            text(instructions[i], width / 2, height / 2 + (i * 40));
        }

        // Ready button with inner shadow on hover
        let buttonWidth = 200;
        let buttonHeight = 60;
        let buttonX = width / 2 - buttonWidth / 2;
        let buttonY = height * 0.75;

        push();
        let hovered = this.isMouseOverButton(buttonX, buttonY, buttonWidth, buttonHeight);
        if (hovered && !this.buttonHovered && this.sounds.button) {
            this.sounds.button.play();
        }
        this.buttonHovered = hovered;

        drawingContext.shadowBlur  = hovered ? 28 : 8;
        drawingContext.shadowColor = hovered ? 'rgba(80,140,255,0.9)' : 'rgba(60,60,200,0.4)';
        fill(hovered ? color(80, 130, 255) : color(40, 40, 160));
        stroke(hovered ? color(140, 180, 255) : color(60, 60, 180));
        strokeWeight(2);
        rect(buttonX, buttonY, buttonWidth, buttonHeight, 12);
        drawingContext.shadowBlur = 0;

        fill(255);
        noStroke();
        textSize(24);
        textAlign(CENTER, CENTER);
        text('I AM READY', width / 2, buttonY + buttonHeight / 2);
        pop();
        pop();
    }

    updateBouncingSprites() {
        this.bouncingSprites.forEach(sprite => {
            // Update position
            sprite.x += sprite.speedX;
            sprite.y += sprite.speedY;

            // Bounce off edges
            if (sprite.x < 0 || sprite.x > width) {
                sprite.speedX *= -1;
            }
            if (sprite.y < 0 || sprite.y > height) {
                sprite.speedY *= -1;
            }

            // Keep sprites in bounds
            sprite.x = constrain(sprite.x, 0, width);
            sprite.y = constrain(sprite.y, 0, height);
        });
    }

    drawBouncingSprites() {
        this.bouncingSprites.forEach(sprite => {
            push();
            imageMode(CENTER);
            let img;
            switch (sprite.type) {
                case 'doubt':
                    img = this.doubt;
                    break;
                case 'missile2':
                    img = this.missile2;
                    break;
            }

            // Draw with rotation based on movement
            translate(sprite.x, sprite.y);
            rotate(atan2(sprite.speedY, sprite.speedX));
            image(img, 0, 0, sprite.size, sprite.size);
            pop();
        });
    }

    // Add this function for button interaction
    isMouseOverButton(x, y, w, h) {
        return mouseX > x && mouseX < x + w &&
            mouseY > y && mouseY < y + h;
    }

    // Add mousePressed handler for the instruction screen
    mousePressed() {
        if (!this.instructionsRead) {
            let buttonWidth = 200;
            let buttonHeight = 60;
            let buttonX = width / 2 - buttonWidth / 2;
            let buttonY = height * 0.75;

            if (this.isMouseOverButton(buttonX, buttonY, buttonWidth, buttonHeight)) {
                // Play doubt sound when "I AM READY" is clicked
                if (this.soundsLoaded && !this.doubtSoundPlayed && this.sounds.doubt) {
                    this.sounds.doubt.play();
                    this.doubtSoundPlayed = true;
                    console.log('Playing doubt sound after ready button click');
                }

                this.fadeStarted = true;
                this.fadeAlpha = 0;

                setTimeout(() => {
                    this.instructionsRead = true;
                    this.gameStarted = true;
                    this.setup();
                    this.fadeAlpha = 0;
                    this.fadeStarted = false;
                }, 3000);
            }
        }
    }

    keyPressed() {
        if (key === 's' && this.specialPowerTime >= 15000) {
            this.activateSpecialPower();
        } else if (key === ' ') {
            this.activateCannon();
        }
    }

    // Add this method for doubt explosion
    createExplosionParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.doubtPosition.x,
                y: this.doubtPosition.y,
                vx: random(-5, 5),
                vy: random(-5, 5),
                size: random(10, 30),
                alpha: 255
            });
        }
    }

    // Add this method to reset the game
    resetGame() {
        // Clear running intervals from special power
        if (this.cannonInterval) {
            clearInterval(this.cannonInterval);
            this.cannonInterval = null;
        }

        // Core game state
        this.gameOver          = false;
        this.victory           = false;
        this.doubtDefeated     = false;
        this.doubtDialogueShown = false;
        this.doubtHealth       = 100;
        this.motivation        = 100;
        this.gameTimer         = 60;
        this.lastTime          = millis();
        this.dialogueIndex     = 0;
        this.showDialogue      = false;
        this.isCastleMusicPlaying = false;

        // Clear all arrays
        this.particles   = [];
        this.missiles    = [];
        this.redOrbs     = [];
        this.bursts      = [];
        this.cannonBalls = [];

        // Cannon
        this.cannonActive    = false;
        this.specialPowerActive = false;
        this.specialPowerTime   = 0;
        this.invincible         = false;

        // Doubt position / movement reset
        this.doubtPosition = {
            x: width - 150,
            y: height / 2,
            rotation: 0,
            rotationSpeed: 0.02
        };
        this.doubtDirection          = 1;
        this.doubtSpeed              = 3;
        this.doubtHorizontalDirection = 1;
        this.isCharging              = false;
        this.chargeVelocity          = { x: 0, y: 0 };
        this.lastChargeTime          = 0;
        this.doubtHitEffect          = false;
        this.doubtSoundPlayed        = false;

        // Hero position
        this.hero.x = 100;
        this.hero.y = height / 2;
        this.cannonPosition  = createVector(this.hero.x, this.hero.y);
        this.cannonDirection = createVector(1, 0);

        // Visual state
        this.flashAlpha    = 0;
        this._shakeFrames  = 0;
        this._shakeMag     = 0;
        this._cannonBursts = [];
        this._vicStart     = null;
        this.transitioning = false;
        this.resettingGame = false;
        this.fadeOverlayAlpha = 0;
        this.doubtOpacity     = 255;

        // Allow setup() to actually run again
        this.isInitialized = false;
        this.setup();

        // Restart music
        if (this.sounds.castle) {
            this.sounds.castle.stop();
            this.sounds.castle.play();
            this.isCastleMusicPlaying = true;
        }
    }

    updateSpecialPowerBar() {
        // Increment special power time every second if not hit
        if (millis() - this.lastHitTime > 1000) {
            this.specialPowerTime = min(this.specialPowerTime + deltaTime, 15000);
        } else {
            this.specialPowerTime = 0;
        }
    }

    drawSpecialPowerBar() {
        push();
        fill(0, 0, 0, 150);
        rect(20, 50, 200, 20);
        fill(255, 255, 0);
        rect(20, 50, (this.specialPowerTime / 15000) * 200, 20);

        fill((this.specialPowerTime / 15000) < 0.3 ? 255 : 0);
        textSize(16);
        text('Special Power', 25, 65);

        if (this.specialPowerTime >= 15000) {
            fill(255, 255, 0);
            textSize(16);
            text('Press S', 230, 65);
        }
        pop();
    }

    activateSpecialPower() {
        this.specialPowerActive = true;
        this.invincible = true;

        // Play shield sound
        if (this.sounds.glow) {
            this.sounds.glow.play();
        }

        // Fire cannons for 5 seconds
        this.cannonInterval = setInterval(() => {
            this.fireCannonsInAllDirections();
        }, 100);

        setTimeout(() => {
            clearInterval(this.cannonInterval);
            this.specialPowerActive = false;
            this.invincible = false;
            this.specialPowerTime = 0;
        }, 5000);
    }

    fireCannonsInAllDirections() {
        const angles = [0, PI / 4, PI / 2, (3 * PI) / 4, PI, (5 * PI) / 4, (3 * PI) / 2, (7 * PI) / 4];
        angles.forEach(angle => {
            let cannon = {
                x: this.hero.x,
                y: this.hero.y,
                vx: cos(angle) * 5,
                vy: sin(angle) * 5,
                size: 20
            };
            this.missiles.push(cannon);
        });
    }

    createShieldEffect() {
        push();
        noStroke();
        let pulse = sin(frameCount * 0.1) * 10;
        let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.heroSize + 70 + pulse);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0.2)');
        drawingContext.fillStyle = gradient;

        let shieldX = this.hero.x + cos(frameCount * 0.1) * 15;
        let shieldY = this.hero.y + sin(frameCount * 0.1) * 15;

        // Create jagged edges
        beginShape();
        for (let i = 0; i < TWO_PI; i += 0.1) {
            let offset = random(-10, 10); // Jaggedness
            let x = shieldX + (this.heroSize + 70 + pulse + offset) * cos(i);
            let y = shieldY + (this.heroSize + 70 + pulse + offset) * sin(i);
            vertex(x, y);
        }
        endShape(CLOSE);

        // Add glowing effect
        stroke(255, 255, 0, 150);
        strokeWeight(3);
        noFill();
        ellipse(shieldX, shieldY, this.heroSize + 80 + pulse, this.heroSize + 80 + pulse);
        pop();
    }

    createExplosionEffect(x, y) {
        push();
        for (let i = 0; i < 10; i++) {
            fill(255, random(100, 200), 0, 150);
            ellipse(x + random(-20, 20), y + random(-20, 20), random(20, 40));
        }
        pop();
    }

    // Add this method to create shatter effect
    shatterProjectile(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: random(-3, 3),
                vy: random(-3, 3),
                size: random(5, 15),
                alpha: 255
            });
        }
    }

    handleDialogue() {
        if (this.dialogueIndex < this.dialogues.length) {
            let currentDialogue = this.dialogues[this.dialogueIndex];
            if (!this.dialogueBox.isTyping) {
                this.dialogueBox.startDialogue(currentDialogue.text, currentDialogue.name);
            }
            this.dialogueBox.update();
            this.dialogueBox.draw();

            if (this.dialogueBox.isComplete()) {
                this.dialogueIndex++;
                this.dialogueBox.stopTypingSound();
            }
        } else {
            this.showDialogue = false;
        }
    }

    animateDoubtDefeat() {
        if (this.doubtAnimationStart === 0) {
            this.doubtAnimationStart = millis();
            if (this.sounds.doubt && this.sounds.doubt.isPlaying()) {
                this.sounds.doubt.stop(); // Stop other sounds
            }
            if (this.sounds.castle && this.sounds.castle.isPlaying()) {
                this.sounds.castle.stop(); // Stop castle.mp3
            }
            this.sounds.death = loadSound('./assets/sounds/death.mp3', () => {
                this.sounds.death.play();
            });
        }

        let timeElapsed = millis() - this.doubtAnimationStart;

        if (timeElapsed < 6000) { // 6 seconds
            // Erratic spiral movement with speed adjustment
            let angle = timeElapsed * 0.1;
            let radius = map(timeElapsed, 0, 6000, 300, 0);
            let speedFactor = map(timeElapsed, 0, 6000, 1, 0.1);
            this.doubtPosition.x = width / 2 + cos(angle) * radius * speedFactor;
            this.doubtPosition.y = height / 2 + sin(angle) * radius * speedFactor;

            // Draw shadow trail
            this.drawShadowTrail();

            // Draw Doubt with warping and rotation effect
            push();
            imageMode(CENTER);
            tint(255, this.doubtOpacity);
            translate(this.doubtPosition.x, this.doubtPosition.y);
            rotate(angle);
            scale(1 + sin(timeElapsed * 0.1) * 0.5);
            image(this.doubt, 0, 0, 150, 150);
            pop();

            // Draw red streaks and lightning
            this.drawStreaksAndLightning(timeElapsed);

            // Fade overlay
            this.fadeOverlayAlpha = map(timeElapsed, 0, 6000, 0, 255);
            this.doubtOpacity = map(timeElapsed, 0, 6000, 255, 0);

            push();
            fill(0, this.fadeOverlayAlpha);
            rect(0, 0, width, height);
            pop();

            // Display Doubt's final words
            if (!this.doubtDialogueShown) {
                this.dialogueBox.startDialogue("How could you? I was a part of you.", "Doubt");
                this.doubtDialogueShown = true;
            }
            this.dialogueBox.update();
            this.dialogueBox.draw();
        } else {
            this.doubtDefeated = true;
            this.victory = true; // Set victory state
            this.gameOver = true; // Ensure game over state
            this.showGameOver(); // Transition to victory screen
        }
    }

    drawShadowTrail() {
        for (let i = 0; i < 5; i++) {
            let shadowX = this.doubtPosition.x - i * 10;
            let shadowY = this.doubtPosition.y - i * 10;
            push();
            imageMode(CENTER);
            tint(255, 50); // Lesser opacity for shadow
            image(this.doubt, shadowX, shadowY, 150, 150);
            pop();
        }
    }

    createFadingParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: random(-1, 1),
                vy: random(-1, 1),
                size: random(5, 10),
                alpha: 255
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 5;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            } else {
                push();
                noStroke();
                fill(255, 0, 0, p.alpha);
                ellipse(p.x, p.y, p.size);
                pop();
            }
        }
    }

    drawStreaksAndLightning(timeElapsed) {
        if (frameCount % 2 !== 0) return; // draw every other frame — less frantic
        push();
        let intensity = map(timeElapsed, 0, 6000, 1, 0.3);
        stroke(255, 40, 40, 130 * intensity);
        strokeWeight(1.5);
        for (let i = 0; i < 12; i++) {
            let angle  = random(TWO_PI);
            let len    = random(30, 140);
            let x1 = this.doubtPosition.x + cos(angle) * len;
            let y1 = this.doubtPosition.y + sin(angle) * len;
            let x2 = this.doubtPosition.x + cos(angle) * (len + random(15, 40));
            let y2 = this.doubtPosition.y + sin(angle) * (len + random(15, 40));
            line(x1, y1, x2, y2);
        }
        pop();
    }

    startDialogue(text, name) {
        this.targetText = text;
        this.currentText = "";
        this.charIndex = 0;
        this.isTyping = true;
        this.speakerName = name;
        this.opacity = 255;
        this.timer = 0;

        if (name === 'Hero') {
            this.boxColor = this.heroBoxColor;
            this.strokeColor = this.heroStrokeColor;
        }
        // Other conditions...
    }

    showDefeatScreen() {
        push();
        fill(0, 0, 0, 180); rect(0, 0, width, height);

        drawingContext.shadowBlur  = 24;
        drawingContext.shadowColor = 'rgba(255,60,60,0.8)';
        fill(255, 80, 80);
        textAlign(CENTER, CENTER);
        textSize(48);
        text('DOUBT WINS', width / 2, height / 2 - 50);
        drawingContext.shadowBlur = 0;

        fill(200, 200, 255);
        textSize(20);
        text('Your motivation ran out.', width / 2, height / 2 + 2);

        let bx = width/2, by = height/2+60, bw = 200, bh = 54;
        let hover = mouseX > bx-bw/2 && mouseX < bx+bw/2 && mouseY > by-bh/2 && mouseY < by+bh/2;
        drawingContext.shadowBlur  = hover ? 20 : 6;
        drawingContext.shadowColor = 'rgba(100,100,255,0.8)';
        fill(hover ? color(120,120,255) : color(60,60,200));
        rectMode(CENTER);
        rect(bx, by, bw, bh, 12);
        drawingContext.shadowBlur = 0;
        fill(255); textSize(22);
        text('TRY AGAIN', bx, by);
        pop();

        let onBtn = mouseX > bx-bw/2 && mouseX < bx+bw/2 && mouseY > by-bh/2 && mouseY < by+bh/2;
        if (mouseIsPressed && onBtn && !this.resettingGame) {
            this.resettingGame = true;
            this.resetGame();
        } else if (!mouseIsPressed) {
            this.resettingGame = false;
        }
    }

    heroHitByDoubt() {
        // Logic to determine if the hero is hit by charging Doubt or fireblasts
        // Return true if hit, otherwise false
        return this.isCharging && this.checkHeroCollision() || this.checkFireblastCollision();
    }

    checkHeroCollision() {
        // Implement collision detection logic for hero
        return false; // Placeholder
    }

    checkFireblastCollision() {
        // Implement collision detection logic for fireblasts
        return false; // Placeholder
    }

    cleanup() {
        if (this.cannonInterval) {
            clearInterval(this.cannonInterval);
            this.cannonInterval = null;
        }
        if (this.sounds) {
            Object.values(this.sounds).forEach(s => {
                if (s && typeof s.stop === 'function') s.stop();
            });
        }
        if (this.scarySound && typeof this.scarySound.stop === 'function') {
            this.scarySound.stop();
        }
    }
}
