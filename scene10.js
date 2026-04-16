class Scene4_5 {
    constructor() {
        console.log('Scene4_5 constructor started');
        try {
            this.hero = new Hero(width / 2, height / 2);
            this.hero.visible = false;
            this.background = null;
            this.assetsLoaded = false;

            // Log initial setup
            console.log('Basic initialization complete');

            // Portal transition properties
            this.doorWidth = 0;
            this.doorStartTime = null;
            this.doorDuration = 4000;
            this.doorOpening = true;
            this.transitionComplete = false;

            // Unified cannon properties (keep only one set)
            this.cannonActive = false;
            this.cannonPosition = createVector(0, 0);
            this.cannonDirection = createVector(1, 0);
            this.cannonName = localStorage.getItem('cannonName') || "HOPE";
            this.cannonFlash = false;
            this.cannonBalls = [];

            // Unified sound initialization
            this.sounds = {
                fire: new Howl({
                    src: ['./assets/sounds/fire.mp3'],
                    volume: 0.3,
                    loop: true,
                    onload: () => console.log("Fire sound loaded")
                }),
                firing: new Howl({
                    src: ['./assets/sounds/firing.mp3'],
                    volume: 0.5
                })
            };

            // Initialize distraction sounds
            this.distractionSounds = {
                beer: new Howl({
                    src: ['./assets/sounds/beer.mp3'],
                    volume: 0.5,
                    onload: () => console.log("Beer sound loaded")
                }),
                burger: new Howl({
                    src: ['./assets/sounds/burger.mp3'],
                    volume: 0.5,
                    onload: () => console.log("Burger sound loaded")
                }),
                computer: new Howl({
                    src: ['./assets/sounds/computer.mp3'],
                    volume: 0.5,
                    onload: () => console.log("Computer sound loaded")
                })
            };

            // Add sound effects
            this.typingSound = new Howl({
                src: ['./assets/sounds/typing.mp3'],
                volume: 0.3,
                loop: true,
                onload: () => console.log("Typing sound loaded"),
                onloaderror: (id, err) => console.error("Error loading typing sound:", err)
            });

            // Add new sound effects while keeping original paths
            this.screamSound = new Howl({
                src: ['./assets/sounds/scream.mp3'],
                volume: 1.0,
                onload: () => console.log("Scream sound loaded")
            });

            this.pokemonSiren = new Howl({
                src: ['./assets/sounds/pokemonsiren.mp3'],
                volume: 0.5,
                onload: () => console.log("Pokemon siren loaded"),
                onplay: () => {
                    setTimeout(() => {
                        if (currentScene !== this) return;
                        if (this.pokemonSiren) this.pokemonSiren.fade(0.5, 0, 1000);
                        if (this.scarySound) this.scarySound.play();
                    }, 6000);
                }
            });

            this.scarySound = new Howl({
                src: ['./assets/sounds/scary.mp3'],
                volume: 0.5,
                onload: () => console.log("Scary sound loaded")
            });

            // Add Hope and DialogueBox
            this.hope = new Hope();
            this.hope.x = 80;  // Same position as scene4.5
            this.hope.y = 60;  // Same position as scene4.5
            this.hopeMovement = {
                angle: 0,
                radius: 10  // Same small radius
            };
            this.hopeVisible = false;
            this.dialogueBox = new DialogueBox();

            // Remove in-game dialogue sequences
            this.gameDialogues = [];  // Empty array instead of battle dialogues
            this.currentGameDialogue = 0;
            this.gameDialogueTimer = 0;
            this.gameDialogueActive = false;

            // Game properties
            this.gameStarted = false;
            this.gameTimer = 45;
            this.lastSoundTime = 0;
            this.soundInterval = 5000;
            this.distractionImages = {
                burger: null,
                computer: null,
                fourLoko: null
            };
            this.distractions = [];

            // Initialize warp lines
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

            // Flag for initial scream
            this.hasPlayedScream = false;

            // Initialize hero velocity
            this.hero.velocity = createVector(0, 0);

            // Add new sounds
            this.heartbeatSound = new Howl({
                src: ['./assets/sounds/heartbeat.mp3'],
                volume: 0.5,
                loop: true
            });

            this.wordgameSound = new Howl({
                src: ['./assets/sounds/wordgame.mp3'],
                volume: 0.5,
                loop: true
            });

            this.hurtSound = new Howl({
                src: ['./assets/sounds/hurt.mp3'],
                volume: 0.5
            });

            // Add game stats
            this.motivation = 100;
            this.specialPowerTime = 0;
            this.lastHitTime = millis();

            // Add flash overlay properties
            this.flashOverlay = {
                alpha: 0,
                duration: 3000,
                startTime: null,
                active: false
            };

            this._shakeFrames    = 0;
            this._shakeMag       = 0;
            this._hitFlash       = 0;
            this._startGameCalled = false;
            this._distractBursts = [];

            console.log('Scene4_5 constructor completed');
        } catch (error) {
            console.error('Error in Scene4_5 constructor:', error);
        }
    }

    preload() {
        let loaded = 0;
        const need = 5; // background + hero + hope + 3 distractions
        const tryDone = () => { loaded++; if (loaded >= need) { this.assetsLoaded = true; this.doorStartTime = millis(); if (this.sounds.fire) this.sounds.fire.play(); } };

        // Background via p5
        loadImage('assets/backgrounds/burning.gif', img => { this.background = img; tryDone(); });

        // Characters
        this.hero.preload(); tryDone();
        this.hope.preload(); tryDone();

        // Distraction GIFs as native HTML img elements (animated by browser natively)
        const distrMap = { burger: 'burger.gif', computer: 'computer.gif', fourLoko: 'fourloko.gif' };
        for (let [key, file] of Object.entries(distrMap)) {
            const el = document.createElement('img');
            el.src = `assets/distractions/${file}`;
            el.onload  = () => { this.distractionImages[key] = el; this.distractionImages[key + '_native'] = true; tryDone(); };
            el.onerror = () => tryDone();
        }

    }

    draw() {
        if (!this.assetsLoaded) {
            // Draw loading screen
            background(0);
            fill(255);
            textAlign(CENTER, CENTER);
            text('Loading...', width / 2, height / 2);
            return;
        }

        if (!this.background) {
            console.error('Background not loaded');
            return;
        }

        if (!this.hope.sprite) {
            console.error('Hope sprite not loaded');
            return;
        }

        // Screen shake
        if (this._shakeFrames > 0) {
            translate(random(-this._shakeMag, this._shakeMag),
                      random(-this._shakeMag, this._shakeMag));
            this._shakeFrames--;
        }

        // Add black gradient overlay when game starts
        if (this.gameStarted) {
            push();
            drawingContext.fillStyle = drawingContext.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, width / 2
            );
            drawingContext.fillStyle.addColorStop(0, 'rgba(0,0,0,0.2)');
            drawingContext.fillStyle.addColorStop(1, 'rgba(0,0,0,0.7)');
            rect(0, 0, width, height);
            pop();
        }

        // Start with black background
        background(0);

        if (this.doorOpening && this.doorStartTime) {
            let elapsed = millis() - this.doorStartTime;

            // Calculate portal size
            this.doorWidth = map(elapsed, 0, this.doorDuration, 0, windowWidth * 0.7);

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

            // Draw scaled background based on portal size
            push();
            translate(width / 2, height / 2);
            drawingContext.save();

            // Remove fill and only use stroke for portal shape
            noFill();
            stroke(0, 150, 255, 150);
            strokeWeight(2);
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
            drawingContext.clip();

            // Scale background image based on portal size
            let scale = map(this.doorWidth, 0, windowWidth * 0.7, 0.1, 1);
            imageMode(CENTER);
            image(this.background, 0, 0, width * scale, height * scale);
            drawingContext.restore();
            pop();

            if (elapsed >= this.doorDuration) {
                this.doorOpening = false;
                this.transitionComplete = true;
                this.hopeVisible = true;
                this.hero.visible = true;
                // Auto-start the game once the door finishes opening
                if (!this.gameStarted && !this._startGameCalled) {
                    this._startGameCalled = true;
                    this.startGame();
                }
            }
        } else if (this.transitionComplete) {
            // Draw full background
            imageMode(CENTER);
            image(this.background, width / 2, height / 2, width, height);
        }

        // Draw Hope with floating movement
        if (this.hopeVisible) {
            this.hopeMovement.angle += 0.02;
            let floatX = 80 + cos(this.hopeMovement.angle) * this.hopeMovement.radius;
            let floatY = 60 + sin(this.hopeMovement.angle) * this.hopeMovement.radius;

            this.hope.x = floatX;
            this.hope.y = floatY;
            this.hope.draw();
        }

        // Draw hero only if visible
        if (this.hero.visible) {
            this.hero.update();
            this.hero.draw();
        }

        // Game Logic
        if (this.gameStarted) {
            // Draw Timer — pill with glow when low
            push();
            let tv   = ceil(this.gameTimer);
            let tLow = tv <= 10;
            let tp   = tLow ? (sin(frameCount * 0.3) * 0.5 + 0.5) : 0;
            drawingContext.shadowBlur  = tLow ? 16 + tp * 16 : 8;
            drawingContext.shadowColor = tLow ? 'rgba(255,80,80,0.9)' : 'rgba(255,255,255,0.3)';
            noStroke();
            fill(0, 0, 0, 160);
            rectMode(CENTER);
            rect(width / 2, 40, 90, 48, 12);
            textFont('ARCADE');
            textSize(34);
            textAlign(CENTER, CENTER);
            fill(tLow ? color(255, 80 + tp * 80, 80) : 255);
            text(tv, width / 2, 40);
            drawingContext.shadowBlur = 0;
            pop();

            // Update timer
            if (this.gameTimer > 0) {
                this.gameTimer -= deltaTime / 1000;

                // Play random distraction sound every 5 seconds
                if (millis() - this.lastSoundTime > this.soundInterval) {
                    const sounds = ['beer', 'burger', 'computer'];
                    const randomSound = random(sounds);
                    this.distractionSounds[randomSound].play();
                    this.lastSoundTime = millis();
                }

                // Spawn every 3 seconds, max 5 distractions
                if (frameCount % 180 === 0) {
                    if (this.distractions.length < 5) {
                        this.addNewDistraction();
                    }
                }
            } else {
                // Game complete!
                this.cleanup();
                currentScene = new Scene5();
                if (currentScene.preload) {
                    currentScene.preload();
                }
            }

            // Update and draw distractions with rotation
            for (let i = this.distractions.length - 1; i >= 0; i--) {
                let d = this.distractions[i];
                d.x += d.velocity.x;
                d.y += d.velocity.y;
                d.rotation += d.rotationSpeed;

                push();
                translate(d.x, d.y);
                rotate(d.rotation);
                let dImg = this.distractionImages[d.type];
                if (dImg) {
                    if (this.distractionImages[d.type + '_native']) {
                        // Native HTML img — animated GIF drawn via canvas API
                        drawingContext.drawImage(dImg, -d.size/2, -d.size/2, d.size, d.size);
                    } else {
                        imageMode(CENTER);
                        image(dImg, 0, 0, d.size, d.size);
                    }
                }
                pop();

                // Check collision with hero
                if (dist(d.x, d.y, this.hero.x, this.hero.y) < (d.size + 30) / 2) {
                    this.gameTimer -= 5;
                    this._shakeFrames = 16; this._shakeMag = 8;
                    this._hitFlash = 160;
                    // Burst particles at collision point
                    for (let p = 0; p < 10; p++) {
                        let ang = (p / 10) * TWO_PI;
                        this._distractBursts.push({
                            x: d.x, y: d.y,
                            vx: cos(ang) * random(2, 5),
                            vy: sin(ang) * random(2, 5),
                            life: 25, sz: random(6, 14),
                            r: 255, g: floor(random(80, 160)), b: 0
                        });
                    }
                    this.distractions.splice(i, 1);
                    continue;
                }

                // Remove if off screen
                if (d.x < -100 || d.x > width + 100 ||
                    d.y < -100 || d.y > height + 100) {
                    this.distractions.splice(i, 1);
                }
            }

            // Update special power
            this.updateSpecialPowerBar();

            // Distraction burst particles
            push(); noStroke();
            for (let i = this._distractBursts.length - 1; i >= 0; i--) {
                let b = this._distractBursts[i];
                b.x += b.vx; b.y += b.vy; b.vy += 0.2;
                b.life--;
                if (b.life <= 0) { this._distractBursts.splice(i, 1); continue; }
                fill(b.r, b.g, b.b, map(b.life, 25, 0, 220, 0));
                ellipse(b.x, b.y, b.sz * (b.life/25), b.sz * (b.life/25));
            }
            pop();

            // Hit flash
            if (this._hitFlash > 0) {
                push();
                noStroke();
                fill(255, 60, 60, this._hitFlash);
                rect(0, 0, width, height);
                this._hitFlash = max(0, this._hitFlash - 14);
                pop();
            }

            // Draw bars
            this.drawMotivationBar();
            this.drawSpecialPowerBar();

            // Update cannon
            if (this.cannonActive) {
                this.drawCannon();
                this.cannonPosition.add(p5.Vector.mult(this.cannonDirection, 12));
                if (this.cannonPosition.x > width) {
                    this.cannonActive = false;
                }
            }
        }

        // Draw flash overlay
        if (this.flashOverlay.active) {
            let elapsed = millis() - this.flashOverlay.startTime;
            if (elapsed < this.flashOverlay.duration) {
                // Create pulsing effect synced with siren
                let flashIntensity = map(sin(elapsed * 0.01), -1, 1, 0.3, 1);
                push();
                fill(255, 255, 255, 255 * flashIntensity);
                rect(0, 0, width, height);
                pop();
            } else {
                this.flashOverlay.active = false;
            }
        }
    }

    keyPressed() {
        if (key === ' ') {
            this.activateCannon();
        }

        if (this.gameStarted) {
            const speed = 60;  // Increased to 60 for very fast movement
            if (keyCode === LEFT_ARROW || key === 'a') {
                this.hero.velocity.x = -speed;
            }
            if (keyCode === RIGHT_ARROW || key === 'd') {
                this.hero.velocity.x = speed;
            }
            if (keyCode === UP_ARROW || key === 'w') {
                this.hero.velocity.y = -speed;
            }
            if (keyCode === DOWN_ARROW || key === 's') {
                this.hero.velocity.y = speed;
            }
        }
    }

    keyReleased() {
        if (this.gameStarted) {
            if ((keyCode === LEFT_ARROW || key === 'a') && this.hero.velocity.x < 0) {
                this.hero.velocity.x = 0;
            }
            if ((keyCode === RIGHT_ARROW || key === 'd') && this.hero.velocity.x > 0) {
                this.hero.velocity.x = 0;
            }
            if ((keyCode === UP_ARROW || key === 'w') && this.hero.velocity.y < 0) {
                this.hero.velocity.y = 0;
            }
            if ((keyCode === DOWN_ARROW || key === 's') && this.hero.velocity.y > 0) {
                this.hero.velocity.y = 0;
            }
        }
    }

    drawCannon() {
        if (this.cannonActive) {
            try {
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
                triangle(30, -15, 30, 15, 50, 0);

                pop();
            } catch (error) {
                console.error('Error drawing cannon:', error);
                this.cannonActive = false;  // Deactivate cannon if there's an error
            }
        }
    }

    activateCannon() {
        if (!this.cannonActive && this.gameStarted) {  // Add gameStarted check
            console.log('Activating cannon');
            if (this.sounds.firing) {
                this.sounds.firing.play();
            }
            this.cannonName = localStorage.getItem('cannonName') || "HOPE";
            this.cannonPosition = createVector(this.hero.x, this.hero.y);
            this.cannonDirection = createVector(1, 0);
            this.cannonActive = true;
            console.log('Cannon activated:', this.cannonPosition);
        }
    }

    cleanup() {
        // Stop all sounds properly
        if (this.sounds.fire) {
            this.sounds.fire.stop();
            this.sounds.fire.unload();
        }
        if (this.sounds.firing) {
            this.sounds.firing.stop();
            this.sounds.firing.unload();
        }

        Object.values(this.distractionSounds).forEach(sound => {
            sound.stop();
            sound.unload();
        });

        if (this.dialogueBox) {
            this.dialogueBox.stopTypingSound();
        }

        this.heartbeatSound.stop();
        this.wordgameSound.stop();
    }

    addNewDistraction() {
        const types = ['burger', 'computer', 'fourLoko'];
        const type = random(types);
        const angle = random(TWO_PI);
        const speed = random(2, 5);

        // Much smaller sizes for distractions
        let size;
        if (type === 'computer') {
            size = 80;  // Half size for computer
        } else if (type === 'fourLoko') {
            size = 90;  // Smaller fourLoko
        } else {
            size = 100;  // Smaller burger
        }

        // Only add if we don't have too many
        if (this.distractions.length < 12) {  // Cap total distractions
            this.distractions.push({
                type: type,
                x: random(width),
                y: random(height),
                size: size,
                velocity: createVector(cos(angle) * speed, sin(angle) * speed),
                rotation: 0,
                rotationSpeed: random(-0.05, 0.05)
            });
        }

        // Play sounds in sequence
        if (millis() - this.lastSoundTime > 5000) {
            const sounds = ['beer', 'burger', 'computer'];
            const randomSound = random(sounds);
            this.distractionSounds[randomSound].play();
            this.lastSoundTime = millis();
        }
    }

    startGame() {
        // Start with flash overlay
        this.flashOverlay.active = true;
        this.flashOverlay.startTime = millis();

        // Play pokemon siren immediately
        this.pokemonSiren.play();

        // Delay game start — 1.5s instead of 3s (felt sluggish)
        setTimeout(() => {
            if (currentScene !== this) return;
            this.gameStarted = true;
            this.gameTimer = 45;
            this.lastSoundTime = 0;
            this.distractions = [];

            this.addNewDistraction();
            this.addNewDistraction();

            if (this.heartbeatSound) this.heartbeatSound.play();
            if (this.wordgameSound) this.wordgameSound.play();
        }, 1500);
    }

    createExplosion(x, y) {
        // Add explosion effect
        push();
        fill(255, 100, 0);
        ellipse(x, y, 100, 100);
        pop();
    }

    updateSpecialPowerBar() {
        // Increment special power time every second if not hit
        if (millis() - this.lastHitTime > 1000) {
            this.specialPowerTime = min(this.specialPowerTime + deltaTime, 15000);
        } else {
            this.specialPowerTime = 0;
        }
    }

    drawMotivationBar() {
        push();
        rectMode(CORNER);
        fill(0, 150);
        rect(20, 20, 200, 20);
        fill(0, 255, 0);
        rect(20, 20, this.motivation * 2, 20);

        fill(this.motivation < 30 ? 255 : 0);
        textSize(16);
        text('Motivation: ' + this.motivation, 25, 35);
        pop();
    }

    drawSpecialPowerBar() {
        push();
        rectMode(CORNER);
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
}
