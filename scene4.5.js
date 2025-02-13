class Scene4_5 {
    constructor() {
        console.log('Scene4_5 constructor started');
        try {
            this.hero = new Hero(width / 2, height / 2);
            this.hero.x = width / 2;
            this.hero.y = height / 2;
            this.hero.visible = false;
            this.background = null;
            this.assetsLoaded = false;

            // Log initial setup
            console.log('Basic initialization complete');

            // Portal transition properties
            this.doorWidth = 0;
            this.doorStartTime = null;
            this.doorDuration = 3000;
            this.doorOpening = true;
            this.transitionComplete = false;

            // Unified cannon properties (keep only one set)
            this.cannonActive = false;
            this.cannonPosition = createVector(0, 0);
            this.cannonDirection = createVector(1, 0);
            this.cannonName = localStorage.getItem('cannonName') || "HOPE";
            this.cannonFlash = false;

            // Unified sound initialization
            this.sounds = {
                fire: new Howl({
                    src: ['./assets/sounds/fire.mp3'],
                    volume: 0.3,
                    loop: true,
                    onload: () => console.log("Fire sound loaded"),
                    onend: () => {
                        console.log("Fire sound ended, starting castle sound");
                        this.castleSound.play();
                    }
                }),
                firing: new Howl({
                    src: ['./assets/sounds/firing.mp3'],
                    volume: 0.5
                }),
                glow: new Howl({
                    src: ['./assets/sounds/glow.mp3'],
                    volume: 0.5,
                    onload: () => console.log("Glow sound loaded"),
                    onloaderror: (id, err) => console.error("Error loading glow sound:", err)
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
                    volume: 1.0,
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
                        this.pokemonSiren.fade(0.5, 0, 1000);
                        this.scarySound.play();
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
            this.hope.x = 80;  // Much closer to left edge
            this.hope.y = 60;  // Much closer to top edge
            this.hero.visible = false;
            this.background = null;
            this.assetsLoaded = false;
            this.hopeVisible = true;
            this.gameStarted = false;
            this.dialogueBox = new DialogueBox();

            // Add dialogue sequence
            this.dialogues = [
                { speaker: 'Hope', text: "Hero, welcome to the forge of focus." },
                { speaker: 'Hero', text: "Aaaaaaaahhhhhhhhhhhh why is their fire everywhere?!" },
                { speaker: 'Hope', text: "Fire will not harm you here. It is the distractions you must fear." },
                { speaker: 'Hero', text: "What distractions?" },

            ];
            this.currentDialogue = 0;
            this.dialogueComplete = false;
            this.dialogueStarted = false;

            // Game properties
            this.gameStarted = false;
            this.gameTimer = 45;
            this.lastSoundTime = 0;
            this.soundInterval = 3000; // 3 seconds between sounds
            this.distractionImages = {
                burger: null,
                computer: null,
                fourLoko: null
            };
            this.distractions = [];
            this.maxDistractions = 20;  // Allow up to 4 distractions at once

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

            // Hope movement properties
            this.hopeMovement = {
                angle: 0,
                radius: 10  // Smaller radius for tighter movement
            };

            // Flag for initial scream
            this.hasPlayedScream = false;

            // Add new sounds
            this.heartbeatSound = new Howl({
                src: ['./assets/sounds/heartbeat.mp3'],
                volume: 0.8,
                loop: true,
                onload: () => console.log("Heartbeat loaded")
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

            // Add at the start after existing sprite setup
            this.hopeGlowIntensity = 0;
            this.hopeGlowSize = 180;

            // Add overlay property for background
            this.backgroundOverlay = {
                alpha: 150  // Adjust this value (0-255) for darkness
            };

            // Separate flash and hit overlays
            this.gameStartFlash = {
                active: false,
                alpha: 255,
                duration: 3000,
                startTime: null
            };

            this.hitOverlay = {
                active: false,
                alpha: 255,
                duration: 1000,  // 1 second red flash
                startTime: null
            };

            // Add in-game dialogue sequences
            this.gameDialogues = [
                { speaker: 'Hero', text: "There's too many! I can't do this!", time: 1 },
                { speaker: 'Hope', text: "Avoid getting hit for 15 seconds.", time: 6 },
                { speaker: 'Hero', text: "Shield activated! I can do this!", time: 0, trigger: 'shield' },  // 0 means wait for trigger
                { speaker: 'Hope', text: "Strength comes from within!", time: 30 }  // Mid-game encouragement
            ];
            this.currentGameDialogue = 0;
            this.gameDialogueTimer = 0;
            this.gameDialogueActive = false;

            this.moveSpeed = 10;  // Increased from 5 to 45 for much faster movement

            // Faster projectiles
            this.baseSpeed = 8;  // Even faster starting speed
            this.maxSpeed = 15;  // Much faster maximum speed

            // More frequent spawns
            this.spawnInterval = 180;  // Changed from 300 to 180 (every 3 seconds)
            this.minSpawnInterval = 180;

            // Tougher special power requirements
            this.specialPowerRequirement = 15000;  // 15 seconds without getting hit

            // Orb behavior
            this.orbHomingStrength = 0.15;  // How strongly orbs track the player
            this.multiOrbChance = 0.6;      // 60% chance for multi-orb attack

            // Add missiles array
            this.missiles = [];
            this.heroSize = 40;  // Reduced from 50 to 40

            // Add completion dialogue sequence
            this.completionDialogues = [
                { speaker: 'Hope', text: "Well done! You've resisted the temptations." },
                { speaker: 'Hero', text: "That was intense! But I feel stronger now." },
                { speaker: 'Hope', text: "Your journey continues..." }
            ];
            this.showingCompletionDialogue = false;
            this.currentCompletionDialogue = 0;

            // Add sound timer
            this.lastDistractionSound = 0;
            this.distractionSoundInterval = 5000; // 5 seconds

            // Add button sound in constructor
            this.buttonSound = new Howl({
                src: ['./assets/sounds/button.mp3'],
                volume: 0.5,
                onload: () => console.log("Button sound loaded"),
                onloaderror: (id, err) => console.error("Error loading button sound:", err)
            });

            // Add castle sound
            this.castleSound = new Howl({
                src: ['./assets/sounds/castle.mp3'],
                volume: 0.3,
                loop: true,
                onload: () => console.log("Castle sound loaded"),
                onplay: () => {
                    if (this.sounds.fire) {
                        this.sounds.fire.stop();  // Stop fire sound when castle sound plays
                    }
                }
            });

            console.log('Scene4_5 constructor completed');
        } catch (error) {
            console.error('Error in Scene4_5 constructor:', error);
        }
    }

    async preload() {
        console.log('Scene4_5 preload started');
        try {
            this.hopeSprite = await loadImage('assets/characters/hope.gif');
            console.log('Hope sprite loaded directly:', !!this.hopeSprite);

            // Load Hope first to debug the issue
            console.log('Starting Hope preload...');
            console.log('Hope initial state:', this.hope);
            await this.hope.preload();
            console.log('Hope after preload:', this.hope);
            console.log('Hope sprite loaded:', !!this.hope.sprite);

            // Load other assets
            this.background = await loadImage('assets/backgrounds/burning.gif');
            await this.hero.preload();
            console.log('Hero loaded:', {
                hero: !!this.hero,
                sprite: this.hero ? !!this.hero.sprite : false
            });

            // Load distraction gifs
            this.distractionImages.burger = await loadImage('assets/distractions/burger.gif');
            this.distractionImages.computer = await loadImage('assets/distractions/computer.gif');
            this.distractionImages.fourLoko = await loadImage('assets/distractions/fourloko.gif');

            this.assetsLoaded = true;
            this.doorStartTime = millis();

            // Start playing fire sound after assets are loaded
            if (this.sounds.fire) {
                console.log('Starting fire sound');
                this.sounds.fire.play();
            }
        } catch (error) {
            console.error('Error loading Hope:', error);
            this.assetsLoaded = false;
        }
    }

    draw() {
        if (this.gameOver) {
            this.showDefeatScreen();
            return;  // Stop further updates
        }

        try {
            // Check if assets are loaded first
            if (!this.assetsLoaded) {
                background(0);
                fill(255);
                textAlign(CENTER, CENTER);
                text('Loading...', width / 2, height / 2);
                return;
            }

            // Make sure setup is called
            if (!this.isInitialized) {
                this.setup();
            }

            // Clear and draw background
            clear();
            if (this.background) {
                push();
                imageMode(CENTER);
                image(this.background, width / 2, height / 2, width, height);

                // Add 20% opacity black overlay
                fill(0, 70);  // 20% opacity black
                rect(0, 0, width, height);
                pop();
            }

            // Handle portal transition and dialogue
            if (this.doorOpening && this.doorStartTime) {
                let elapsed = millis() - this.doorStartTime;
                let progress = elapsed / this.doorDuration;

                if (progress <= 1) {
                    this.doorWidth = width * progress;

                    // Draw door effect
                    push();
                    fill(0);
                    noStroke();
                    rect(0, 0, (width - this.doorWidth) / 2, height);
                    rect(width - (width - this.doorWidth) / 2, 0, (width - this.doorWidth) / 2, height);
                    pop();
                } else {
                    this.doorOpening = false;
                    this.transitionComplete = true;
                    this.hopeVisible = true;
                    this.hero.visible = true;
                }
            } else if (this.transitionComplete && !this.dialogueComplete) {
                // This is our working dialogue and Hope movement code
                if (this.hopeVisible && !this.dialogueComplete) {
                    console.log('Drawing Hope:', {
                        x: this.hope.x,
                        y: this.hope.y,
                        sprite: !!this.hope.sprite,
                        visible: this.hopeVisible
                    });

                    // Draw Hope with floating movement
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

                this.dialogueBox.update();
                this.dialogueBox.draw();

                if (this.currentDialogue === 1 && !this.hasPlayedScream) {
                    this.screamSound.play();
                    this.hasPlayedScream = true;
                }

                if (this.dialogueBox.isComplete()) {
                    this.currentDialogue++;
                    if (this.currentDialogue < this.dialogues.length) {
                        this.dialogueBox.startDialogue(
                            this.dialogues[this.currentDialogue].text,
                            this.dialogues[this.currentDialogue].speaker
                        );
                    } else {
                        this.dialogueComplete = true;
                        this.hopeVisible = false;
                        this.startGame();
                    }
                }
            }

            // Game state
            if (this.gameStarted) {
                // Handle in-game dialogues
                if (!this.gameDialogueActive) {
                    this.gameDialogueActive = true;
                    this.gameDialogueTimer = millis();
                    // Show first dialogue immediately when game starts
                    this.dialogueBox.startDialogue(
                        this.gameDialogues[0].text,
                        this.gameDialogues[0].speaker
                    );
                }

                // Check and display dialogues based on time or triggers
                if (this.currentGameDialogue < this.gameDialogues.length) {
                    let dialogue = this.gameDialogues[this.currentGameDialogue];
                    let gameTime = 45 - this.gameTimer; // Current game time

                    if (dialogue.trigger === 'shield' && this.specialPowerActive && !this.dialogueBox.isTyping) {
                        // Show shield-triggered dialogue
                        this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                        this.currentGameDialogue++;
                    } else if (dialogue.time > 0 && gameTime >= dialogue.time && !this.dialogueBox.isTyping) {
                        // Show time-based dialogue
                        this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                        this.currentGameDialogue++;
                    }
                }

                // Always update and draw dialogue box if game is started
                if (this.dialogueBox) {
                    this.dialogueBox.update();
                    this.dialogueBox.draw();
                }

                // Update special power
                this.updateSpecialPowerBar();

                // Update and draw distractions
                for (let i = this.distractions.length - 1; i >= 0; i--) {
                    let d = this.distractions[i];

                    // Move distraction
                    d.x += d.velocity.x;
                    d.y += d.velocity.y;
                    d.rotation += d.rotationSpeed;

                    // Draw distraction
                    push();
                    translate(d.x, d.y);
                    rotate(d.rotation);
                    imageMode(CENTER);
                    image(this.distractionImages[d.type], 0, 0, d.size, d.size);
                    pop();

                    // Check collision with hero
                    if (this.hero.visible && dist(d.x, d.y, this.hero.x, this.hero.y) < (d.size + 30) / 2) {
                        if (this.specialPowerActive) {
                            // Destroy distraction if shield is active
                            this.createExplosion(d.x, d.y);
                            this.distractions.splice(i, 1);
                        } else if (!this.invincible) {
                            // Take damage only if not invincible and no shield
                            this.motivation = max(0, this.motivation - 34);  // Changed from gameTimer to motivation
                            this.distractions.splice(i, 1);
                            this.lastHitTime = millis();
                            if (this.hurtSound) this.hurtSound.play();

                            // Add hit overlay
                            this.hitOverlay.active = true;
                            this.hitOverlay.startTime = millis();
                        }
                        continue;
                    }

                    // Remove if off screen
                    if (d.x < -200 || d.x > width + 200 ||
                        d.y < -200 || d.y > height + 200) {
                        this.distractions.splice(i, 1);
                    }
                }

                // Spawn distractions based on time elapsed
                if (this.gameStarted) {
                    const timeElapsed = 45 - this.gameTimer;
                    // Start with more frequent spawns
                    const spawnInterval = map(timeElapsed, 0, 45, 50, 30);  // Changed from 70,30 to 50,30

                    if (frameCount % floor(spawnInterval) === 0) {
                        // Start with more spawns, still increase over time
                        let numToSpawn = floor(map(timeElapsed, 0, 45, 2, 6));  // Changed from 1,6 to 2,6
                        for (let i = 0; i < numToSpawn; i++) {
                            // Higher initial cap
                            if (this.distractions.length < map(timeElapsed, 0, 45, 10, 15)) {  // Changed from 8,15 to 10,15
                                this.addNewDistraction();
                            }
                        }
                    }

                    // Earlier and more frequent waves
                    if (timeElapsed > 20 && frameCount % 100 === 0) {  // Start at 20s instead of 25s
                        let extraSpawns = floor(map(timeElapsed, 20, 45, 2, 4));  // Adjusted time range
                        for (let i = 0; i < extraSpawns; i++) {
                            if (this.distractions.length < 15) {
                                this.addNewDistraction();
                            }
                        }
                    }

                    // Play distraction sounds every 10 seconds
                    const currentTime = millis();
                    if (currentTime - this.lastDistractionSound >= 10000) {  // Every 10 seconds
                        const sounds = ['burger', 'computer', 'beer'];
                        const randomSound = random(sounds);

                        if (this.distractionSounds[randomSound]) {
                            this.distractionSounds[randomSound].play();
                        }
                        this.lastDistractionSound = currentTime;
                    }

                    // Keep speeds high to maintain challenge
                    this.baseSpeed = map(timeElapsed, 0, 45, 3, 6);
                    this.maxSpeed = map(timeElapsed, 0, 45, 4, 8);
                }

                // Draw hero
                if (this.hero) {
                    // Keep hero within bounds
                    this.hero.x = constrain(this.hero.x, 0, width);
                    this.hero.y = constrain(this.hero.y, 0, height);

                    // Draw hero using its own draw method
                    this.hero.draw();

                    // Draw shield when special power is active
                    if (this.specialPowerActive) {
                        this.createShieldEffect();
                    }
                }

                // Draw game UI
                this.drawMotivationBar();
                this.drawSpecialPowerBar();
                this.drawTimer();

                if (this.cannonActive) {
                    this.drawCannon();
                    this.cannonPosition.add(p5.Vector.mult(this.cannonDirection, 12));

                    // Check cannon collision with distractions
                    for (let i = this.distractions.length - 1; i >= 0; i--) {
                        let d = this.distractions[i];
                        if (dist(this.cannonPosition.x, this.cannonPosition.y, d.x, d.y) < d.size / 2) {
                            this.createExplosion(d.x, d.y);
                            this.distractions.splice(i, 1);
                        }
                    }

                    if (this.cannonPosition.x > width || this.cannonPosition.y > height || this.cannonPosition.x < 0 || this.cannonPosition.y < 0) {
                        this.cannonActive = false;
                    }
                }

                if (this.gameStarted && this.gameTimer > 0) {
                    this.gameTimer -= deltaTime / 1000;
                    if (this.gameTimer <= 0) {
                        // Start completion dialogue instead of immediate transition
                        this.showingCompletionDialogue = true;
                        this.dialogueBox.startDialogue(
                            this.completionDialogues[0].text,
                            this.completionDialogues[0].speaker
                        );
                        this.gameStarted = false; // Stop game mechanics
                    }
                }

                // Add this line to update hero position
                this.updateHeroPosition();

                // Update and draw missiles
                for (let i = this.missiles.length - 1; i >= 0; i--) {
                    let missile = this.missiles[i];
                    missile.x += missile.vx;
                    missile.y += missile.vy;

                    // Draw missile
                    push();
                    fill(255, 255, 0);
                    noStroke();
                    ellipse(missile.x, missile.y, missile.size);

                    // Add glow effect
                    drawingContext.shadowBlur = 15;
                    drawingContext.shadowColor = 'rgba(255, 255, 0, 0.5)';
                    pop();

                    // Remove if off screen
                    if (missile.x < 0 || missile.x > width || missile.y < 0 || missile.y > height) {
                        this.missiles.splice(i, 1);
                    }
                }
            }

            // Draw flash overlay with pulsing effect
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

            // Draw hit overlay
            if (this.hitOverlay.active) {
                let elapsed = millis() - this.hitOverlay.startTime;
                if (elapsed < this.hitOverlay.duration) {
                    let alpha = map(elapsed, 0, this.hitOverlay.duration, 100, 0);
                    push();
                    fill(255, 0, 0, alpha);
                    rect(0, 0, width, height);
                    pop();
                } else {
                    this.hitOverlay.active = false;
                }
            }

            // Ensure button sound plays for all dialogues
            if (!this.dialogueComplete && this.currentDialogue < this.dialogues.length) {
                if (!this.dialogueBox.isTyping && !this.dialogueStarted) {
                    this.buttonSound.play();  // Play sound before starting dialogue
                    this.dialogueBox.startDialogue(
                        this.dialogues[this.currentDialogue].text,
                        this.dialogues[this.currentDialogue].speaker
                    );
                    this.dialogueStarted = true;
                }

                if (this.dialogueBox.isComplete() && this.dialogueStarted) {
                    this.dialogueStarted = false;  // Reset for next dialogue
                    this.currentDialogue++;
                }
            }

            // Also ensure button sound plays for game dialogues
            if (this.currentGameDialogue < this.gameDialogues.length) {
                let dialogue = this.gameDialogues[this.currentGameDialogue];
                let gameTime = 45 - this.gameTimer;

                if ((dialogue.trigger === 'shield' && this.specialPowerActive && !this.dialogueBox.isTyping) ||
                    (dialogue.time > 0 && gameTime >= dialogue.time && !this.dialogueBox.isTyping)) {
                    this.buttonSound.play();  // Play sound before starting dialogue
                    setTimeout(() => {  // Small delay to ensure sound is heard
                        this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                    }, 50);
                    this.currentGameDialogue++;
                }
            }

            // Ensure game ends when motivation reaches 0
            if (this.motivation <= 0 && !this.gameOver) {
                this.gameOver = true;
                this.showDefeatScreen();
                return;  // Stop further updates
            }

        } catch (error) {
            console.error('Error in draw:', error);
        }
    }

    keyPressed() {
        if (key === 's' && this.specialPowerTime >= 15000) {
            this.activateSpecialPower();
        } else if (key === ' ') {
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
            triangle(30, -15, 30, 15, 50, 0);

            pop();
        }
    }

    activateCannon() {
        if (!this.cannonActive && this.gameStarted) {
            console.log('Activating cannon');
            if (this.sounds.firing) {
                this.sounds.firing.play();
            }
            this.cannonPosition = createVector(this.hero.x, this.hero.y);
            this.cannonDirection = createVector(1, 0);
            this.cannonActive = true;
            this.cannonFlash = true;

            // Add flash effect
            setTimeout(() => {
                this.cannonFlash = false;
            }, 100);
        }
    }

    cleanup() {
        // Make sure we're cleaning up all sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.stop();
                sound.unload();
            }
        });

        Object.values(this.distractionSounds).forEach(sound => {
            if (sound) {
                sound.stop();
                sound.unload();
            }
        });

        if (this.heartbeatSound) {
            this.heartbeatSound.stop();
            this.heartbeatSound.unload();
        }

        if (this.wordgameSound) {
            this.wordgameSound.stop();
            this.wordgameSound.unload();
        }

        if (this.pokemonSiren) {
            this.pokemonSiren.stop();
            this.pokemonSiren.unload();
        }

        if (this.scarySound) {
            this.scarySound.stop();
            this.scarySound.unload();
        }

        if (this.dialogueBox) {
            this.dialogueBox.stopTypingSound();
        }
    }

    addNewDistraction() {
        const types = ['burger', 'computer', 'fourLoko'];
        const type = random(types);

        // Spawn from off-screen positions
        let x, y, velX, velY;
        let side = floor(random(4));

        // Calculate random target point somewhere in the canvas
        let targetX = random(width * 0.2, width * 0.8);
        let targetY = random(height * 0.2, height * 0.8);

        // Get time-based speed multiplier
        const timeElapsed = 45 - this.gameTimer;
        const speedMultiplier = map(timeElapsed, 0, 45, 1, 1.8);  // Speed increases up to 1.8x

        switch (side) {
            case 0:  // Top
                x = random(-50, width + 50);
                y = -100;
                velX = random(-3, 3) * speedMultiplier;
                velY = random(3, 5) * speedMultiplier;
                break;
            case 1:  // Right
                x = width + 100;
                y = random(-50, height + 50);
                velX = random(-5, -3) * speedMultiplier;
                velY = random(-3, 3) * speedMultiplier;
                break;
            case 2:  // Bottom
                x = random(-50, width + 50);
                y = height + 100;
                velX = random(-3, 3) * speedMultiplier;
                velY = random(-5, -3) * speedMultiplier;
                break;
            case 3:  // Left
                x = -100;
                y = random(-50, height + 50);
                velX = random(3, 5) * speedMultiplier;
                velY = random(-3, 3) * speedMultiplier;
                break;
        }

        // Calculate direction towards target point
        let dirX = targetX - x;
        let dirY = targetY - y;
        let mag = sqrt(dirX * dirX + dirY * dirY);
        dirX = dirX / mag;
        dirY = dirY / mag;

        // Tracking gets more aggressive over time
        const trackingStrength = map(timeElapsed, 0, 45, 1.2, 2.0);
        velX = velX + dirX * trackingStrength;
        velY = velY + dirY * trackingStrength;

        let size;
        if (type === 'computer') {
            size = 80;
        } else if (type === 'fourLoko') {
            size = 90;
        } else {
            size = 130;  // Increased burger size from 100 to 130
        }

        this.distractions.push({
            type: type,
            x: x,
            y: y,
            size: size,
            velocity: createVector(velX, velY),
            rotation: 0,
            rotationSpeed: random(-0.1, 0.1)
        });
    }

    startGame() {
        this.flashOverlay.active = true;
        this.flashOverlay.startTime = millis();
        this.hero.visible = true;
        this.hopeVisible = false;

        if (this.pokemonSiren) this.pokemonSiren.play();

        setTimeout(() => {
            this.gameStarted = true;
            this.gameTimer = 45;
            this.lastSoundTime = 0;
            this.distractions = [];

            if (this.heartbeatSound) this.heartbeatSound.play();
            if (this.wordgameSound) this.wordgameSound.play();
        }, 3000);
    }

    createExplosion(x, y) {
        push();
        // Create particle effect
        for (let i = 0; i < 10; i++) {
            let angle = random(TWO_PI);
            let speed = random(2, 5);
            let size = random(5, 15);

            fill(255, random(100, 200), 0, 200);
            noStroke();
            circle(
                x + cos(angle) * speed * 5,
                y + sin(angle) * speed * 5,
                size
            );
        }
        pop();
    }

    updateSpecialPowerBar() {
        if (millis() - this.lastHitTime > 1000) {
            this.specialPowerTime = min(
                this.specialPowerTime + deltaTime,
                15000  // Cap at 15 seconds
            );
        } else {
            this.specialPowerTime = 0;  // Reset on hit
        }
    }

    drawMotivationBar() {
        push();
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
        fill(0, 0, 0, 150);
        rect(20, 50, 200, 20);
        fill(255, 255, 0);
        rect(20, 50, (this.specialPowerTime / 15000) * 200, 20);  // Use 15000 for calculation

        fill((this.specialPowerTime / 15000) < 0.3 ? 255 : 0);
        textSize(16);
        text('Special Power', 25, 65);

        if (this.specialPowerTime >= 15000) {  // Check for 15000
            fill(255, 255, 0);
            textSize(16);
            text('Press S', 230, 65);
        }
        pop();
    }

    activateSpecialPower() {
        this.specialPowerActive = true;
        this.invincible = true;

        if (this.sounds.glow) {
            this.sounds.glow.play();
        }

        setTimeout(() => {
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

    drawTimer() {
        push();
        fill(255);
        textSize(32);
        textAlign(CENTER, TOP);
        text(Math.floor(this.gameTimer) + 's', width / 2, 20);
        pop();
    }

    setup() {
        if (!this.isInitialized) {
            clear();
            background(0);
            this.isInitialized = true;

            // Initialize game states
            this.gameStarted = false;
            this.hopeVisible = true;
            this.heroVisible = false;

            // Start the door opening animation
            this.doorStartTime = millis();
            this.doorOpening = true;
        }
    }

    updateDistractions() {
        for (let i = this.distractions.length - 1; i >= 0; i--) {
            let distraction = this.distractions[i];
            distraction.x += distraction.velocity.x;
            distraction.y += distraction.velocity.y;
            distraction.rotation += distraction.rotationSpeed;

            if (distraction.x < 0 || distraction.x > width || distraction.y < 0 || distraction.y > height) {
                this.distractions.splice(i, 1);
            }
        }
    }

    drawHope() {
        if (this.hope && this.hope.sprite) {
            push();
            imageMode(CENTER);

            // Draw hope with floating animation
            this.hopeFloatAngle += 0.05;
            let floatOffset = sin(this.hopeFloatAngle) * 10;

            // Draw hope sprite
            image(this.hope.sprite,
                this.hope.x,
                this.hope.y + floatOffset,
                180, 180);

            // Add glow effect
            let glowSize = this.hopeGlowSize + sin(frameCount * 0.05) * 20;
            let glowAlpha = map(sin(frameCount * 0.05), -1, 1, 50, 150);

            noStroke();
            fill(255, 255, 255, glowAlpha);
            ellipse(this.hope.x, this.hope.y + floatOffset, glowSize, glowSize);

            pop();
        }
    }

    updateHeroPosition() {
        if (this.hero.visible) {  // Ensure hero is visible
            const speed = 7;  // Reduced from 10 to 7

            if (keyIsDown(LEFT_ARROW) || key === 'a') { // Left arrow or 'A'
                this.hero.x = max(0, this.hero.x - speed);
            }
            if (keyIsDown(RIGHT_ARROW) || key === 'd') { // Right arrow or 'D'
                this.hero.x = min(width, this.hero.x + speed);
            }
            if (keyIsDown(UP_ARROW) || key === 'w') { // Up arrow or 'W'
                this.hero.y = max(0, this.hero.y - speed);
            }
            if (keyIsDown(DOWN_ARROW) || key === 's') { // Down arrow or 'S'
                this.hero.y = min(height, this.hero.y + speed);
            }

            // Keep hero within bounds
            this.hero.x = constrain(this.hero.x, 0, width);
            this.hero.y = constrain(this.hero.y, 0, height);
        }
    }

    createShieldEffect() {
        push();
        noStroke();
        let pulse = sin(frameCount * 0.1) * 10;
        let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.heroSize + 60 + pulse);  // Adjusted for smaller hero
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0.2)');
        drawingContext.fillStyle = gradient;

        let shieldX = this.hero.x + cos(frameCount * 0.1) * 15;
        let shieldY = this.hero.y + sin(frameCount * 0.1) * 15;

        // Create jagged edges for shield
        beginShape();
        for (let i = 0; i < TWO_PI; i += 0.1) {
            let offset = random(-10, 10);
            let x = shieldX + (this.heroSize + 60 + pulse + offset) * cos(i);
            let y = shieldY + (this.heroSize + 60 + pulse + offset) * sin(i);
            vertex(x, y);
        }
        endShape(CLOSE);

        pop();
    }

    playDistractionSounds() {
        const currentTime = millis();
        if (currentTime - this.lastSoundTime >= 3000) {  // Every 3 seconds
            const sounds = ['burger', 'computer', 'beer'];
            const randomSound = random(sounds);

            // Stop any currently playing distraction sounds
            Object.values(this.distractionSounds).forEach(sound => {
                if (sound.playing()) {
                    sound.stop();
                }
            });

            if (this.distractionSounds[randomSound]) {
                this.distractionSounds[randomSound].play();
            }
            this.lastSoundTime = currentTime;
        }
    }

    showDefeatScreen() {
        push();
        background(0, 150);
        fill(100, 100, 255, 200);
        rectMode(CENTER);
        rect(width / 2, height / 2, 200, 100, 20);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text('Try Again', width / 2, height / 2);
        pop();
    }

    mousePressed() {
        if (this.gameOver) {
            let buttonX = width / 2 - 100;
            let buttonY = height / 2 - 50;
            if (mouseX > buttonX && mouseX < buttonX + 200 &&
                mouseY > buttonY && mouseY < buttonY + 100) {
                this.resetGame();
            }
        }
    }

    resetGame() {
        this.gameOver = false;
        this.gameStarted = true;
        this.gameTimer = 45;
        this.motivation = 100;
        this.specialPowerTime = 0;
        this.distractions = [];
        this.lastHitTime = millis();
        this.hero.visible = true;
    }
}
