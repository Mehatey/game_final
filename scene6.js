class Scene6 {
    constructor() {
        // Add initialization flag at the start
        this.isInitialized = false;
        this.gameStarted = false;
        this.instructionsRead = false;
        this.font = null;

        // Hero with correct image path
        this.hero = {
            x: 100,
            y: height / 2,
            image: null
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
        this.missile6 = null;

        // Game state
        this.gameOver = false;

        // Cannon properties
        this.moveSpeed = 5;
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
        this.missileSize = 80;  // Triple size (was 40)

        // Add flash overlay properties
        this.flashAlpha = 0;
        this.flashDuration = 30; // frames

        // Add missile count limit
        this.maxMissiles = 0;  // Start with no missiles
        this.missileSpawnRate = 0.01;
        this.missileSpawnIncrease = 0.0001; // Increment rate over time
        this.missileStartTime = 57; // Start spawning missiles at 57 seconds

        // Initialize missiles with slower speeds
        this.missiles = [];
        for (let i = 0; i < this.maxMissiles; i++) {
            this.missiles.push({
                x: random(width),
                y: random(height),
                speedX: random(-2, 2),  // Slower initial speed (was -5, 5)
                speedY: random(-2, 2),  // Slower initial speed (was -5, 5)
                type: random(1) < 0.5 ? 'missile2' : 'missile6',
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
                speedX: random(2, 4) * (random() > 0.5 ? 1 : -1),
                speedY: random(2, 4) * (random() > 0.5 ? 1 : -1),
                type: 'doubt',
                size: 100
            },
            {
                x: random(width),
                y: random(height),
                speedX: random(2, 4) * (random() > 0.5 ? 1 : -1),
                speedY: random(2, 4) * (random() > 0.5 ? 1 : -1),
                type: 'missile2',
                size: 120
            },
            {
                x: random(width),
                y: random(height),
                speedX: random(2, 4) * (random() > 0.5 ? 1 : -1),
                speedY: random(2, 4) * (random() > 0.5 ? 1 : -1),
                type: 'missile6',
                size: 120
            }
        ];

        // Initialize sounds properly
        this.sounds = {
            hurt: null,
            doubt: null,
            castle: null,
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
    }

    preload() {
        // Load images
        this.background = loadImage('assets/backgrounds/bg8.png');
        this.doubt = loadImage('assets/characters/enemies/doubt.gif');
        this.missile2 = loadImage('assets/animations/missiles/missile2.gif');
        this.missile6 = loadImage('assets/animations/missiles/missile6.gif');
        this.hero.image = loadImage('assets/characters/meh0/hero1still.png');

        // Load sounds with proper callback chain
        soundFormats('mp3');
        this.sounds = {};
        this.sounds.castle = loadSound('./assets/sounds/castle.mp3', () => {
            this.sounds.doubt = loadSound('./assets/sounds/doubt.mp3', () => {
                this.sounds.hurt = loadSound('./assets/sounds/hurt.mp3', () => {
                    this.sounds.firing = loadSound('./assets/sounds/firing.mp3', () => {
                        this.sounds.button = loadSound('./assets/sounds/button.mp3', () => {
                            this.soundsLoaded = true;
                            console.log('All sounds loaded');
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

        if (this.gameOver) {
            this.showGameOver();
            return;
        }

        // Update timer
        if (millis() - this.lastTime >= 1000) {
            this.gameTimer--;
            this.lastTime = millis();
            if (this.gameTimer <= 0) {
                this.gameOver = true;
                this.victory = true; // Timer victory
            }
        }

        // Check for victory by defeating doubt
        if (this.doubtHealth <= 0) {
            this.gameOver = true;
            this.victory = true; // Doubt defeated
        }

        // Draw background
        background(this.background);

        // Draw doubt health bar
        this.drawDoubtHealthBar();

        // Update and draw hero
        this.updateHeroPosition();
        this.drawHero();

        // Draw timer
        this.drawTimer();

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
        this.drawMotivationBar();

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

        // Draw red flash overlay on doubt when hit
        if (this.doubtHitEffect && millis() - this.doubtHitTime < 200) {
            push();
            tint(255, 0, 0, 200);
            image(this.doubt, this.doubtPosition.x, this.doubtPosition.y, 150, 150);
            pop();
        }

        // Update special power bar
        this.updateSpecialPowerBar();

        // Draw special power bar
        this.drawSpecialPowerBar();

        // Check if special power is active
        if (this.specialPowerActive) {
            this.activateSpecialPower();
        }
    }

    drawTimer() {
        push();
        fill(255);
        textSize(32);
        textAlign(CENTER, TOP);
        text(this.gameTimer + 's', width / 2, 20);
        pop();
    }

    drawDoubtHealthBar() {
        push();
        fill(0, 150);
        rect(width - 220, 20, 200, 20);
        fill(255, 0, 0);
        rect(width - 220, 20, this.doubtHealth * 2, 20);
        fill(255);
        textSize(16);
        textAlign(RIGHT);
        text('Doubt Health: ' + this.doubtHealth, width - 25, 35);
        pop();
    }

    drawMotivationBar() {
        push();
        fill(0, 150);
        rect(20, 20, 200, 20);
        fill(0, 255, 0);
        rect(20, 20, this.motivation * 2, 20);

        // Change text color based on motivation level
        fill(this.motivation < 30 ? 255 : 0);
        textSize(16);
        text('Motivation: ' + this.motivation, 25, 35);
        pop();
    }

    updateHeroPosition() {
        if (keyIsDown(LEFT_ARROW)) {
            this.hero.x = max(0, this.hero.x - this.moveSpeed);
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.hero.x = min(width, this.hero.x + this.moveSpeed);
        }
        if (keyIsDown(UP_ARROW)) {
            this.hero.y = max(0, this.hero.y - this.moveSpeed);
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.hero.y = min(height, this.hero.y + this.moveSpeed);
        }
    }

    drawHero() {
        push();
        imageMode(CENTER);
        image(this.hero.image, this.hero.x, this.hero.y, this.heroSize, this.heroSize);
        pop();
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
        let edge = floor(random(4));
        let missile = {
            x: this.doubtPosition.x, // Start from Doubt's position
            y: this.doubtPosition.y,
            speedX: random(-5, 5),
            speedY: random(-5, 5),
            type: random(1) < 0.5 ? 'missile2' : 'missile6',
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

            // Draw the missile body
            let missileImg = missile.type === 'missile2' ? this.missile2 : this.missile6;
            image(missileImg, -missile.size / 2, -missile.size / 2, missile.size, missile.size);

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
                    return false; // Remove missile
                }
                return true;
            });

            this.redOrbs = this.redOrbs.filter(orb => {
                let d = dist(this.hero.x, this.hero.y, orb.x, orb.y);
                if (d < this.heroSize + 50) {
                    this.createExplosionEffect(orb.x, orb.y);
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
            if (this.sounds.firing) {
                this.sounds.firing.play();  // Play firing sound when cannon activates
            }
            this.cannonName = localStorage.getItem('cannonName') || "HOPE";
            this.cannonPosition = createVector(this.hero.x, this.hero.y);
            this.cannonDirection = createVector(1, 0);
            this.cannonActive = true;
        }
    }

    showGameOver() {
        if (this.victory) {
            if (!this.victoryAnimation) {
                this.victoryAnimation = true;
                this.victoryAnimationStart = millis();
                this.createExplosionParticles();

                // Stop all sounds
                if (this.sounds.doubt && this.sounds.doubt.isPlaying()) this.sounds.doubt.stop();
                if (this.sounds.castle && this.sounds.castle.isPlaying()) this.sounds.castle.stop();
                if (this.sounds.hurt && this.sounds.hurt.isPlaying()) this.sounds.hurt.stop();
                if (this.sounds.firing && this.sounds.firing.isPlaying()) this.sounds.firing.stop();
                if (this.sounds.button && this.sounds.button.isPlaying()) this.sounds.button.stop();

                // Start ambient music
                if (!this.sounds.ambient) {
                    this.sounds.ambient = loadSound('./assets/sounds/ambient.mp3', () => {
                        this.sounds.ambient.play();
                    });
                }
            }

            // Victory screen
            background(0, 150);
            fill(100, 100, 255, 200);
            rectMode(CENTER);
            rect(width / 2, height / 2, 400, 200, 20);

            fill(255);
            textAlign(CENTER, CENTER);
            textSize(32);
            text('You beat Doubt!', width / 2, height / 2 - 50);

            // Collect Learning button
            let buttonWidth = 200;
            let buttonHeight = 60;
            let buttonX = width / 2 - buttonWidth / 2;
            let buttonY = height / 2 + 40; // Adjusted position

            if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                mouseY > buttonY && mouseY < buttonY + buttonHeight) {
                fill(120, 120, 255);
            } else {
                fill(80, 80, 255);
            }
            rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

            fill(255);
            textSize(24);
            textAlign(CENTER, CENTER);
            text('Collect Learning', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

            if (mouseIsPressed &&
                mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                mouseY > buttonY && mouseY < buttonY + buttonHeight) {
                switchScene(new Scene7());
            }
        } else {
            // Defeat screen
            background(0, 150);
            fill(100, 100, 255, 200);
            rectMode(CENTER);
            rect(width / 2, height / 2, 200, 100, 20);

            fill(255);
            textAlign(CENTER, CENTER);
            textSize(24);
            text('Try Again', width / 2, height / 2);

            // Restart game on click
            if (mouseIsPressed) {
                this.resetGame();
            }
        }
    }

    drawConfetti() {
        for (let i = 0; i < 100; i++) {
            let x = random(width);
            let y = random(height);
            let size = random(5, 10);
            fill(random(255), random(255), random(255));
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

            // Initialize initial set of missiles
            for (let i = 0; i < this.maxMissiles; i++) {
                this.missiles.push({
                    x: random(width),
                    y: random(height),
                    speedX: random(-5, 5),
                    speedY: random(-5, 5),
                    type: random(1) < 0.5 ? 'missile2' : 'missile6',
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
        if (this.isMouseOverButton(buttonX, buttonY, buttonWidth, buttonHeight)) {
            // Play button sound on hover
            if (!this.buttonHovered && this.sounds.button) {
                this.sounds.button.play();
            }
            this.buttonHovered = true;

            // Inner shadow effect
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(0, 0, 0, 0.8)';
            drawingContext.shadowOffsetX = 3;
            drawingContext.shadowOffsetY = 3;
            drawingContext.shadowInset = true;
            fill(100, 100, 255);

            rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
            fill(0, 0, 0, 50);
            rect(buttonX + 3, buttonY + 3, buttonWidth - 6, buttonHeight - 6, 8);
        } else {
            this.buttonHovered = false;
            fill(50);
            rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
        }

        // Button text
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
                case 'missile6':
                    img = this.missile6;
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
        this.setup();
        this.instructionsRead = false;
        this.gameOver = false;
        this.motivation = 100;
        this.doubtHealth = 100;
        this.gameTimer = 60;
        this.hero.x = 100;
        this.hero.y = height / 2;
        this.missiles = [];
        this.redOrbs = [];
        this.bursts = [];
        this.specialPowerTime = 0;
        this.invincible = false;
        this.specialPowerActive = false;

        // Stop any ongoing sounds
        if (this.sounds.doubt && this.sounds.doubt.isPlaying()) this.sounds.doubt.stop();
        if (this.sounds.castle && this.sounds.castle.isPlaying()) this.sounds.castle.stop();
        if (this.sounds.hurt && this.sounds.hurt.isPlaying()) this.sounds.hurt.stop();
        if (this.sounds.firing && this.sounds.firing.isPlaying()) this.sounds.firing.stop();
        if (this.sounds.button && this.sounds.button.isPlaying()) this.sounds.button.stop();
        if (this.sounds.ambient && this.sounds.ambient.isPlaying()) this.sounds.ambient.stop();

        // Reset any animations or effects
        this.fadeAlpha = 0;
        this.fadeStarted = false;
        this.flashAlpha = 0;
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

        // Change text color based on special power level
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
        ellipse(shieldX, shieldY, this.heroSize + 70 + pulse, this.heroSize + 70 + pulse);

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
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const audio = new Audio('sounds/button.mp3');
        audio.play();
    });
});
