class Scene5 {
    constructor() {
        // Force cleanup of any lingering audio
        getAudioContext().suspend();
        getAudioContext().resume();
        
        // Initialize SoundManager first
        this.soundManager = new SoundManager();
        
        this.assetsLoaded = false;
        this.hero = new Hero(width / 2, height / 2);
        this.hope = new Hope();
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
            { speaker: 'Hero', text: "Hope, what's going on? Why is everything turning dark?" },
            { speaker: 'Hope', text: "I don't know. Something feels wrong." },
            { speaker: 'Hero', text: "You're the one who's supposed to know what's happening!" },
            { speaker: 'Hope', text: "Stay close. This darkness it's alive." }
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
        this.fearSize = 300; // Start with 6 times size (50 * 6)
        this.fearCurrentDialogue = 0;
        this.hopeVisible = false;
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
        this.doubtSize = 300;
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
        this.regretSize = 300;
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
        this.angerSize = 300;
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
        this.insecuritySize = 300;
        this.insecurityCurrentDialogue = 0;
        this.insecurityFinalPos = { x: 0, y: 0 };
        this.procastDefeated = false;

        // Enemy glow colors matching their dialogue colors
        this.fearGlowColor = color(128, 0, 128);  // Purple
        this.doubtGlowColor = color(128, 0, 128);  // Purple
        this.regretGlowColor = color(128, 0, 128);  // Purple
        this.angerGlowColor = color(255, 0, 0);    // Red
        this.procastGlowColor = color(0, 128, 128); // Teal
        this.insecurityGlowColor = color(128, 0, 128); // Purple

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

        this.procastDialogues = [
            { speaker: 'Procrastination', text: "I am Procrastination. The endless delay.", 
              color: color(0, 128, 128, 230) },
            { speaker: 'Hero', text: "I won't let you stop me!", 
              color: color(128, 128, 128, 230) },
            { speaker: 'Procrastination', text: "Tomorrow is always better, isn't it?", 
              color: color(0, 128, 128, 230) },
            { speaker: 'Hope', text: "Defeat Procrastination, and you'll find your drive.", 
              color: color(0, 100, 255, 230) }
        ];

        this.procastCurrentDialogue = 0;
        this.procastFinalPos = { x: 0, y: 0 };
        this.procastRadius = 400;
        this.procastAngle = 0;

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
    }

    async preload() {
        try {
            // Load background and characters
            this.background = await loadImage('assets/backgrounds/bg9.gif');
            await this.hero.preload();
            await this.hope.preload();
            
            // Load enemy images
            this.fear = await loadImage('assets/characters/enemies/fear.gif');
            this.doubt = await loadImage('assets/characters/enemies/doubt.gif');
            this.regret = await loadImage('assets/characters/enemies/regret.gif');
            this.anger = await loadImage('assets/characters/enemies/anger.gif');
            this.procast = await loadImage('assets/characters/enemies/procast.gif');
            this.insecurity = await loadImage('assets/characters/enemies/insecurity.gif');
            
            // Initialize sound manager and load sounds
            this.soundManager = new SoundManager();
            
            // Load all sounds
            await Promise.all([
                this.soundManager.loadSound('scary', 'assets/sounds/scary.mp3'),
                this.soundManager.loadSound('fear', 'assets/sounds/fear.mp3'),
                this.soundManager.loadSound('doubt', 'assets/sounds/doubt.mp3'),
                this.soundManager.loadSound('regret', 'assets/sounds/regret.mp3'),
                this.soundManager.loadSound('anger', 'assets/sounds/anger.mp3'),
                this.soundManager.loadSound('procast', 'assets/sounds/procast.mp3'),
                this.soundManager.loadSound('insecurity', 'assets/sounds/insecurity.mp3')
            ]);

            this.assetsLoaded = true;
            console.log('All assets loaded successfully');
        } catch (error) {
            console.error('Error loading assets:', error);
            this.assetsLoaded = false;
        }
    }

    draw() {
        if (!this.assetsLoaded) return;

        // Background handling
        background(0);
        if (this.background && this.fadeAmount < 255) {
            push();
            imageMode(CORNER);
            tint(255, 255 - this.fadeAmount);
            image(this.background, 0, 0, width, height);
            pop();
        }

        // Pure black to dark purple gradient
        push();
        let gradientAlpha = map(this.fadeAmount, 0, 255, 0, 180);
        for (let y = 0; y < height; y++) {
            let inter = map(y, 0, height, 0, 1);
            let c = lerpColor(
                color(20, 0, 40, gradientAlpha), // Dark purple at top
                color(0, 0, 0, gradientAlpha),   // Pure black at bottom
                inter
            );
            stroke(c);
            line(0, y, width, y);
        }
        pop();

        // Handle fade
        if (this.isFading) {
            this.fadeAmount += 0.5;
        }

        // Start fading after first dialogue
        if (this.currentDialogue > 0 && !this.isFading) {
            this.isFading = true;
        }

        // Handle initial dialogues
        if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
            if (this.currentDialogue < this.dialogues.length) {
                let dialogue = this.dialogues[this.currentDialogue];
                this.dialogueBox.startDialogue(
                    dialogue.text,
                    dialogue.speaker
                );
                this.currentDialogue++;
            }
        }

        // Draw characters
        this.hero.update();
        this.hero.draw();

        // Show Hope when the dialogue mentions "stay close"
        if (this.currentDialogue >= 3 && !this.hopeVisible) {
            this.hopeVisible = true;
        }

        // Draw Hope if visible
        if (this.hopeVisible) {
            this.hope.update();
            this.hope.draw();
        }

        // Play scary music when scene starts
        if (this.scaryMusic && !this.scaryMusic.isPlaying() && this.currentDialogue >= this.dialogues.length) {
            this.scaryMusic.loop();
            this.scaryMusic.setVolume(0.3);
        }

        // Move this to the top of draw, after initial dialogues
        if (this.currentDialogue >= this.dialogues.length && !this.fearActive && !this.currentEnemy) {
            console.log('Starting enemy sequence');
            this.fearActive = true;
            this.currentEnemy = 'fear';
            this.currentEnemyIndex = 0;
            this.soundManager.playSound('scary');  // Start scary background music
        }

        // Fear sequence
        if (this.fearActive) {
            if (!this.fearSoundPlayed && this.fearSound) {
                this.fearSound.play();
                this.fearSoundPlayed = true;
                this.entranceStartTimes.fear = millis();
            }

            let fearX, fearY;
            let entranceTime = millis() - this.entranceStartTimes.fear;
            
            if (entranceTime < this.entranceDuration) {
                this.fearAngle += 0.05;
                fearX = this.hero.x + cos(this.fearAngle) * this.fearRadius;
                fearY = this.hero.y + sin(this.fearAngle) * this.fearRadius;
            } else {
                if (this.fearSound && this.fearSound.isPlaying()) {
                    this.fearSound.stop();
                }
                fearX = this.hero.x + 150;
                fearY = this.hero.y + 150;
            }

            // Draw fear
            push();
            drawingContext.shadowBlur = 30;
            drawingContext.shadowColor = this.fearGlowColor;
            imageMode(CENTER);
            image(this.fear, fearX, fearY, this.fearSize, this.fearSize);
            pop();

            // Handle fear dialogue and progression
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.fearCurrentDialogue < this.fearDialogues.length) {
                    let dialogue = this.fearDialogues[this.fearCurrentDialogue];
                    this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                    this.fearCurrentDialogue++;
                } else {
                    // Only set currentEnemy to null to allow next enemy
                    this.currentEnemy = null;
                    this.currentEnemyIndex++;
                    
                    if (this.currentEnemyIndex < this.enemySequence.length) {
                        let nextEnemy = this.enemySequence[this.currentEnemyIndex];
                        switch(nextEnemy) {
                            case 'doubt':
                                this.doubtActive = true;
                                this.currentEnemy = 'doubt';
                                break;
                        }
                    }
                }
            }
        }

        // Doubt sequence
        if (this.doubtActive) {
            if (!this.doubtSoundPlayed && this.doubtSound) {
                this.doubtSound.play();
                this.doubtSoundPlayed = true;
                this.entranceStartTimes.doubt = millis();
            }

            let doubtX, doubtY;
            let entranceTime = millis() - this.entranceStartTimes.doubt;
            
            if (entranceTime < this.entranceDuration) {
                this.doubtAngle += 0.05;
                doubtX = this.hero.x + cos(this.doubtAngle) * this.doubtRadius;
                doubtY = this.hero.y + sin(this.doubtAngle) * this.doubtRadius;
            } else {
                if (this.doubtSound && this.doubtSound.isPlaying()) {
                    this.doubtSound.stop();
                }
                doubtX = this.hero.x - 150;
                doubtY = this.hero.y + 150;
            }

            // Draw doubt
            push();
            drawingContext.shadowBlur = 30;
            drawingContext.shadowColor = this.doubtGlowColor;
            imageMode(CENTER);
            image(this.doubt, doubtX, doubtY, this.doubtSize, this.doubtSize);
            pop();

            // Handle doubt dialogue and progression
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.doubtCurrentDialogue < this.doubtDialogues.length) {
                    let dialogue = this.doubtDialogues[this.doubtCurrentDialogue];
                    this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                    this.doubtCurrentDialogue++;
                } else {
                    // Only set currentEnemy to null and increment index
                    this.currentEnemy = null;
                    this.currentEnemyIndex++;
                    console.log("Moving to next enemy, index:", this.currentEnemyIndex); // Debug log
                    
                    // Activate next enemy (Regret)
                    this.regretActive = true;
                    this.currentEnemy = 'regret';
                }
            }
        }

        // Regret sequence
        if (this.regretActive) {
            if (!this.regretSoundPlayed && this.regretSound) {
                this.regretSound.play();
                this.regretSoundPlayed = true;
                this.entranceStartTimes.regret = millis();
            }

            let regretX, regretY;
            let entranceTime = millis() - this.entranceStartTimes.regret;
            
            if (entranceTime < this.entranceDuration) {
                this.regretAngle += 0.05;
                regretX = this.hero.x + cos(this.regretAngle) * this.regretRadius;
                regretY = this.hero.y + sin(this.regretAngle) * this.regretRadius;
            } else {
                if (this.regretSound && this.regretSound.isPlaying()) {
                    this.regretSound.stop();
                }
                regretX = this.hero.x - 150;
                regretY = this.hero.y - 150;
            }

            // Draw regret
            push();
            drawingContext.shadowBlur = 30;
            drawingContext.shadowColor = this.regretGlowColor;
            imageMode(CENTER);
            image(this.regret, regretX, regretY, this.regretSize, this.regretSize);
            pop();

            // Handle regret dialogue and progression
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.regretCurrentDialogue < this.regretDialogues.length) {
                    let dialogue = this.regretDialogues[this.regretCurrentDialogue];
                    this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                    this.regretCurrentDialogue++;
                } else {
                    // Only set currentEnemy to null and increment index
                    this.currentEnemy = null;
                    this.currentEnemyIndex++;
                    console.log("Moving to next enemy, index:", this.currentEnemyIndex); // Debug log
                    
                    // Activate next enemy (Anger)
                    this.angerActive = true;
                    this.currentEnemy = 'anger';
                }
            }
        }

        // Anger sequence
        if (this.angerActive) {
            if (!this.angerSoundPlayed && this.angerSound) {
                this.angerSound.play();
                this.angerSoundPlayed = true;
                this.entranceStartTimes.anger = millis();
            }

            let angerX, angerY;
            let entranceTime = millis() - this.entranceStartTimes.anger;
            
            if (entranceTime < this.entranceDuration) {
                this.angerAngle += 0.05;
                angerX = this.hero.x + cos(this.angerAngle) * this.angerRadius;
                angerY = this.hero.y + sin(this.angerAngle) * this.angerRadius;
            } else {
                if (this.angerSound && this.angerSound.isPlaying()) {
                    this.angerSound.stop();
                }
                angerX = this.hero.x + 150;
                angerY = this.hero.y - 150;
            }

            // Draw anger
            push();
            drawingContext.shadowBlur = 30;
            drawingContext.shadowColor = this.angerGlowColor;
            imageMode(CENTER);
            image(this.anger, angerX, angerY, this.angerSize, this.angerSize);
            pop();

            // Handle anger dialogue and progression
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.angerCurrentDialogue < this.angerDialogues.length) {
                    let dialogue = this.angerDialogues[this.angerCurrentDialogue];
                    this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                    this.angerCurrentDialogue++;
                } else {
                    // Only set currentEnemy to null and increment index
                    this.currentEnemy = null;
                    this.currentEnemyIndex++;
                    console.log("Moving to Procrastination, index:", this.currentEnemyIndex);
                    
                    // Directly activate Procrastination
                    this.procastActive = true;
                    this.currentEnemy = 'procast';
                }
            }
        }

        // Procrastination sequence
        if (this.procastActive) {
            if (!this.procastSoundPlayed && this.procastSound) {
                this.procastSound.play();
                this.procastSoundPlayed = true;
                this.entranceStartTimes.procast = millis();
            }

            let procastX, procastY;
            let entranceTime = millis() - this.entranceStartTimes.procast;
            
            if (entranceTime < this.entranceDuration) {
                this.procastAngle += 0.05;
                procastX = this.hero.x + cos(this.procastAngle) * this.procastRadius;
                procastY = this.hero.y + sin(this.procastAngle) * this.procastRadius;
            } else {
                if (this.procastSound && this.procastSound.isPlaying()) {
                    this.procastSound.stop();
                }
                procastX = this.hero.x + 150;
                procastY = this.hero.y - 150;
            }

            // Draw procrastination
            push();
            drawingContext.shadowBlur = 30;
            drawingContext.shadowColor = this.procastGlowColor;
            imageMode(CENTER);
            image(this.procast, procastX, procastY, this.procastSize, this.procastSize);
            pop();

            // Handle procrastination dialogue and progression
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.procastCurrentDialogue < this.procastDialogues.length) {
                    let dialogue = this.procastDialogues[this.procastCurrentDialogue];
                    this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                    this.procastCurrentDialogue++;
                } else {
                    // Only set currentEnemy to null and increment index
                    this.currentEnemy = null;
                    this.currentEnemyIndex++;
                    console.log("Moving to Insecurity, index:", this.currentEnemyIndex);
                    
                    // Directly activate Insecurity
                    this.insecurityActive = true;
                    this.currentEnemy = 'insecurity';
                }
            }
        }

        // Insecurity sequence (final enemy)
        if (this.insecurityActive) {
            if (!this.insecuritySoundPlayed && this.insecuritySound) {
                this.insecuritySound.play();
                this.insecuritySoundPlayed = true;
                this.entranceStartTimes.insecurity = millis();
            }

            let insecurityX, insecurityY;
            let entranceTime = millis() - this.entranceStartTimes.insecurity;
            
            if (entranceTime < this.entranceDuration) {
                this.insecurityAngle += 0.05;
                insecurityX = this.hero.x + cos(this.insecurityAngle) * this.insecurityRadius;
                insecurityY = this.hero.y + sin(this.insecurityAngle) * this.insecurityRadius;
            } else {
                if (this.insecuritySound && this.insecuritySound.isPlaying()) {
                    this.insecuritySound.stop();
                }
                insecurityX = this.hero.x;
                insecurityY = this.hero.y + 150;
            }

            // Draw insecurity
            push();
            drawingContext.shadowBlur = 30;
            drawingContext.shadowColor = this.insecurityGlowColor;
            imageMode(CENTER);
            image(this.insecurity, insecurityX, insecurityY, this.insecuritySize, this.insecuritySize);
            pop();

            // Handle insecurity dialogue (final enemy)
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.insecurityCurrentDialogue < this.insecurityDialogues.length) {
                    let dialogue = this.insecurityDialogues[this.insecurityCurrentDialogue];
                    this.dialogueBox.startDialogue(dialogue.text, dialogue.speaker);
                    this.insecurityCurrentDialogue++;
                    
                    // Check if this was the last dialogue
                    if (this.insecurityCurrentDialogue === this.insecurityDialogues.length && 
                        dialogue.text.includes("Defeat Insecurity, and you'll find belief in yourself")) {
                        
                        // Stop sounds and cleanup
                        if (this.scarySound && this.scarySound.isPlaying()) {
                            this.scarySound.stop();
                        }
                        this.cleanup();
                        
                        // Clear and transition
                        clear();
                        background(0);
                        let scene6 = new Scene6();
                        scene6.preload();
                        currentScene = scene6;
                    }
                }
            }
        }

        // Draw cannon if active
        if (this.cannonActive) {
            this.drawCannon();
        }

        // Update and draw dialogue box
        this.dialogueBox.update();
        this.dialogueBox.draw();
    }

    cleanup() {
        if (this.soundManager) {
            this.soundManager.stopCurrentSound();
        }
        // Reset all sound flags
        this.fearSoundPlayed = false;
        this.doubtSoundPlayed = false;
        this.regretSoundPlayed = false;
        this.angerSoundPlayed = false;
        this.procastSoundPlayed = false;
        this.insecuritySoundPlayed = false;
        
        // Force cleanup of audio context
        getAudioContext().suspend();
        Object.keys(this.enemyStates).forEach(enemy => {
            this.enemyStates[enemy] = { active: false, complete: false };
        });
        this.currentEnemy = null;

        if (this.scarySound) {
            this.scarySound.stop();
        }
        
        // Remove or comment out ambient sound cleanup
        // if (this.ambientSound) {
        //     this.ambientSound.stop();
        // }
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
}

