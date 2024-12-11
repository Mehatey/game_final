class Scene6 {
    constructor() {
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
        this.maxMissiles = 15;  // Maximum missiles allowed on screen
        this.missileSpawnRate = 0.15;  // Increased spawn rate significantly

        // Initialize bouncing missiles
        this.missiles = [];
        this.maxMissiles = 15;

        // Create initial set of missiles
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
    }

    preload() {
        // Load images
        this.background = loadImage('assets/backgrounds/bg8.png');
        this.doubt = loadImage('assets/characters/enemies/doubt.gif');
        this.missile2 = loadImage('assets/animations/missiles/missile2.gif');
        this.missile6 = loadImage('assets/animations/missiles/missile6.gif');
        this.hero.image = loadImage('assets/characters/meh0/hero1still.png');

        // Load sound
        soundFormats('mp3');
        this.scarySound = loadSound('assets/sounds/scary.mp3', () => {
            // Start playing as soon as it's loaded
            if (!this.soundStarted) {
                this.scarySound.loop();
                this.soundStarted = true;
            }
        });
        this.hurtSound = loadSound('assets/sounds/hurt.mp3');
    }

    draw() {
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
            }
        }

        // Draw background
        background(this.background);

        // Update and draw hero
        this.updateHeroPosition();
        this.drawHero();

        // Draw doubt and its health bar
        image(this.doubt, width - 150, this.doubtY - 75, 150, 150);
        this.drawDoubtHealthBar();

        // Draw timer
        this.drawTimer();

        // Generate red orbs
        if (millis() - this.lastOrbTime > this.orbInterval) {
            this.createRedOrb();
            this.lastOrbTime = millis();
        }

        // Spawn missiles
        if (random(1) < 0.02) {
            this.createMissile();
        }

        // Update and draw projectiles
        this.updateProjectiles();

        // Draw motivation bar
        this.drawMotivationBar();

        // Draw cannon if active and update its position
        if (this.cannonActive) {
            this.drawCannon();
            // Move the cannon
            this.cannonPosition.add(p5.Vector.mult(this.cannonDirection, 12));

            // Deactivate when off screen
            if (this.cannonPosition.x > width) {
                this.cannonActive = false;
            }
        }

        // Check collisions
        this.checkCollisions();

        // Update doubt position
        this.updateDoubtPosition();

        // Draw red flash overlay when hit
        if (this.flashAlpha > 0) {
            push();
            fill(255, 0, 0, this.flashAlpha);
            rect(0, 0, width, height);
            this.flashAlpha = max(0, this.flashAlpha - 255 / this.flashDuration);
            pop();
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
        pop();

        fill(255);
        textSize(16);
        text('Motivation: ' + this.motivation, 25, 35);
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
        let orb = {
            x: width - 150,
            y: this.doubtY,
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

    createMissile() {
        if (random(1) < 0.05) {
            let edge = floor(random(4));
            let missile = {
                x: 0,
                y: 0,
                speed: random(3, 6),
                angle: 0,
                type: random(1) < 0.5 ? 'missile2' : 'missile6',
                size: this.missileSize
            };

            switch (edge) {
                case 0:
                    missile.x = random(width);
                    missile.y = -50;
                    missile.angle = HALF_PI;
                    break;
                case 1:
                    missile.x = width + 50;
                    missile.y = random(height);
                    missile.angle = PI;
                    break;
                case 2:
                    missile.x = random(width);
                    missile.y = height + 50;
                    missile.angle = -HALF_PI;
                    break;
                case 3:
                    missile.x = -50;
                    missile.y = random(height);
                    missile.angle = 0;
                    break;
            }

            this.missiles.push(missile);
        }
    }

    updateProjectiles() {
        // Update bouncing missiles
        for (let missile of this.missiles) {
            // Update position
            missile.x += missile.speedX;
            missile.y += missile.speedY;

            // Bounce off walls
            if (missile.x < 0 || missile.x > width) {
                missile.speedX *= -1;
            }
            if (missile.y < 0 || missile.y > height) {
                missile.speedY *= -1;
            }

            // Draw missile
            push();
            let angle = atan2(missile.speedY, missile.speedX);
            translate(missile.x, missile.y);
            rotate(angle);
            let missileImg = missile.type === 'missile2' ? this.missile2 : this.missile6;
            image(missileImg, -missile.size / 2, -missile.size / 2, missile.size, missile.size);
            pop();
        }

        // Update red orbs (keep existing red orb code)
        for (let orb of this.redOrbs) {
            orb.x += orb.vx;
            orb.y += orb.vy;

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

        this.missiles = this.missiles.filter(m =>
            m.x > -100 && m.x < width + 100 &&
            m.y > -100 && m.y < height + 100
        );

        this.redOrbs = this.redOrbs.filter(orb =>
            orb.x > -100 && orb.x < width + 100 &&
            orb.y > -100 && orb.y < height + 100
        );
    }

    checkCollisions() {
        // Check cannon collision with doubt
        if (this.cannonActive) {
            let d = dist(this.cannonPosition.x, this.cannonPosition.y,
                width - 150, this.doubtY);
            if (d < 75) {
                // Create burst animation
                this.bursts.push({
                    x: width - 150,
                    y: this.doubtY,
                    size: 60,
                    startTime: millis()
                });

                // Reduce doubt health
                this.doubtHealth = max(0, this.doubtHealth - 20);
                this.cannonActive = false;

                // If doubt is defeated, transition to victory scene
                if (this.doubtHealth <= 0) {
                    switchScene(new Scene7());
                }
            }
        }

        for (let missile of this.missiles) {
            let d = dist(this.hero.x, this.hero.y, missile.x, missile.y);
            if (d < 30) {
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
    }

    updateDoubtPosition() {
        this.doubtY += this.doubtSpeed * this.doubtDirection;

        if (this.doubtY > height - 100 || this.doubtY < 100) {
            this.doubtDirection *= -1;
        }
    }

    activateCannon() {
        if (!this.cannonActive) {
            this.cannonName = localStorage.getItem('cannonName') || "HOPE";
            this.cannonPosition = createVector(this.hero.x, this.hero.y);
            this.cannonDirection = createVector(1, 0);
            this.cannonActive = true;
        }
    }

    showGameOver() {
        push();
        fill(0, 150);
        rect(width / 2 - 100, height / 2 - 50, 200, 100);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        if (this.doubtHealth <= 0) {
            text('Victory!', width / 2, height / 2);
        } else if (this.gameTimer <= 0) {
            text('Time Up!', width / 2, height / 2);
        } else {
            text('Try Again', width / 2, height / 2);
        }
        pop();

        if (this.scarySound && this.scarySound.isPlaying()) {
            this.scarySound.stop();
        }
    }

    keyPressed(key) {
        if (key === ' ') {
            this.activateCannon();
        }
    }

    handleHit(damage) {
        if (this.hurtSound) {
            this.hurtSound.play();
        }

        this.flashAlpha = 100;

        this.motivation = max(0, this.motivation - damage);
        if (this.motivation <= 0) {
            this.gameOver = true;
        }
    }

    drawCannon() {
        if (this.cannonActive) {
            this.cannonFlash = !this.cannonFlash;

            push();
            translate(this.cannonPosition.x, this.cannonPosition.y);

            let recoil = sin(frameCount * 0.8) * 3;
            translate(recoil, 0);

            let textWidth = this.cannonName.length * 15;
            fill(255, 255, 0);
            stroke(70);
            strokeWeight(2);
            rectMode(CENTER);
            rect(0, 0, textWidth + 40, 40, 10);

            arc(textWidth / 2 + 20, 0, 40, 40, -HALF_PI, HALF_PI);

            for (let i = 0; i < 5; i++) {
                let alpha = map(i, 0, 5, 255, 0);
                let streakLength = map(i, 0, 5, 20, 5);
                stroke(255, 50, 0, alpha);
                strokeWeight(4 - i / 2);
                line(-textWidth / 2 - 20 - i * 10, -5, -textWidth / 2 - 20 - i * 10 + streakLength, -5);
            }

            pop();
        }
    }
}
