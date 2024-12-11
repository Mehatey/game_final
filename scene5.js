class Scene5 {
        constructor() {
        // Force cleanup of previous scene's music immediately
        if (window.scenes && window.scenes['Scene4'] && 
            window.scenes['Scene4'].narrationMusic && 
            window.scenes['Scene4'].narrationMusic.isPlaying()) {
            window.scenes['Scene4'].narrationMusic.stop();
            window.scenes['Scene4'].narrationMusic = null;
        }

        this.assetsLoaded = false;
        this.hero = new Hero(width/2, height/2);
        this.hope = new Hope();
        this.dialogueBox = new DialogueBox();
        this.currentDialogue = 0;
        this.background = null;
        this.fadeAmount = 0;
        this.isFading = false;
        this.scaryMusic = null;
        
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
            { speaker: 'Regret', text: "I am Regret. The chain that drags you backward.", color: this.enemyColor },
            { speaker: 'Hero', text: "Stop! Leave Hope alone!", color: color(128, 128, 128, 230) },
            { speaker: 'Regret', text: "You carry me every day. You can't escape the past.", color: this.enemyColor },
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
            { speaker: 'Anger', text: "I am Anger. The fire that consumes.", color: this.enemyColor },
            { speaker: 'Hero', text: "Let Hope go!", color: color(128, 128, 128, 230) },
            { speaker: 'Anger', text: "I thrive on frustration, and you've given me plenty.", color: this.enemyColor },
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
            { speaker: 'Insecurity', text: "I am Insecurity. The voice that says you're not enough.", color: this.enemyColor },
            { speaker: 'Hero', text: "No! Leave Hope alone!", color: color(128, 128, 128, 230) },
            { speaker: 'Insecurity', text: "I thrive on your fears and failures. You'll never escape me.", color: this.enemyColor },
            { speaker: 'Hope', text: "Defeat Insecurity, and you'll find belief in yourself.", color: color(0, 100, 255, 230) }
        ];
        this.insecurityAngle = 0;
        this.insecurityRadius = 400;
        this.insecurityActive = false;
        this.insecuritySize = 300;
        this.insecurityCurrentDialogue = 0;
        this.insecurityFinalPos = { x: 0, y: 0 };
        this.procastDefeated = false;
    }

    preload() {
        this.background = loadImage('assets/backgrounds/bg9.gif');
        this.hero.preload();
        this.hope.preload();
        this.dialogueBox.typingSound = loadSound('assets/sounds/typing.mp3');
        this.fear = loadImage('assets/characters/enemies/fear.gif');
        this.fearSound = loadSound('assets/sounds/fear.mp3');
        this.doubt = loadImage('assets/characters/enemies/doubt.gif');
        this.doubtSound = loadSound('assets/sounds/doubt.mp3');
        this.regret = loadImage('assets/characters/enemies/regret.gif');
        this.regretSound = loadSound('assets/sounds/regret.mp3');
        this.anger = loadImage('assets/characters/enemies/anger.gif');
        this.angerSound = loadSound('assets/sounds/anger.mp3');
        this.insecurity = loadImage('assets/characters/enemies/insecurity.gif');
        this.insecuritySound = loadSound('assets/sounds/insecurity.mp3');

        // Load scary music
        soundFormats('mp3');
        loadSound('assets/sounds/scary.mp3',
            (sound) => {
                this.scaryMusic = sound;
                this.scaryMusic.setVolume(0.5);
                this.assetsLoaded = true;
            }
        );
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
        for(let y = 0; y < height; y++) {
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
            
            // Start scary music if it's not playing
            if (this.scaryMusic && !this.scaryMusic.isPlaying()) {
                this.scaryMusic.setVolume(0.5);
                this.scaryMusic.loop();
            }
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

        // Start fear sequence after initial dialogues
        if (this.currentDialogue >= this.dialogues.length && !this.fearActive) {
            this.fearActive = true;
            // Only play fear sound once when fear becomes active
            if (!this.fearSound.isPlaying()) {
                this.fearSound.play();
            }
        }

        // Draw fear spiraling in
        if (this.fearActive) {
            // Spiral effect
            this.fearAngle += 0.05;
            this.fearRadius = Math.max(150, this.fearRadius - 1); // Slowly decrease radius to 150
            this.fearSize = Math.max(150, this.fearSize - 0.75); // Slowly decrease size to 3 times (150)
            
            let fearX = this.hero.x + cos(this.fearAngle) * this.fearRadius;
            let fearY = this.hero.y + sin(this.fearAngle) * this.fearRadius;
            
            push();
            imageMode(CENTER);
            image(this.fear, fearX, fearY, this.fearSize, this.fearSize);
            pop();

            // Fear dialogue handling
            if (this.fearRadius <= 150 && !this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.fearCurrentDialogue < this.fearDialogues.length) {
                    let dialogue = this.fearDialogues[this.fearCurrentDialogue];
                    this.dialogueBox.startDialogue(
                        dialogue.text,
                        dialogue.speaker,
                        dialogue.color  // Pass the color for the dialogue box
                    );
                    this.fearCurrentDialogue++;
                }
            }

            // Check if fear dialogue is complete
            if (this.fearCurrentDialogue >= this.fearDialogues.length) {
                this.fearDefeated = true;
                this.fearActive = false;
                this.doubtActive = true;
                // Play doubt sound only once when doubt becomes active
                if (!this.doubtSound.isPlaying()) {
                    this.doubtSound.play();
                }
            }
        }

        // Draw doubt after fear is defeated
        if (this.doubtActive) {
            // Spiral effect for doubt
            this.doubtAngle += 0.05;
            this.doubtRadius = Math.max(150, this.doubtRadius - 1);
            this.doubtSize = Math.max(150, this.doubtSize - 0.75);
            
            let doubtX = this.hero.x + cos(this.doubtAngle) * this.doubtRadius;
            let doubtY = this.hero.y + sin(this.doubtAngle) * this.doubtRadius;
            
            push();
            imageMode(CENTER);
            image(this.doubt, doubtX, doubtY, this.doubtSize, this.doubtSize);
            pop();

            // Doubt dialogue handling
            if (this.doubtRadius <= 150 && !this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.doubtCurrentDialogue < this.doubtDialogues.length) {
                    let dialogue = this.doubtDialogues[this.doubtCurrentDialogue];
                    this.dialogueBox.startDialogue(
                        dialogue.text,
                        dialogue.speaker,
                        dialogue.color
                    );
                    this.doubtCurrentDialogue++;
                }
            }

            // Check if doubt dialogue is complete
            if (this.doubtCurrentDialogue >= this.doubtDialogues.length) {
                this.doubtDefeated = true;
                this.doubtActive = false;
                this.regretActive = true;
                // Play regret sound only once when regret becomes active
                if (!this.regretSound.isPlaying()) {
                    this.regretSound.play();
                }
            }
        }

        // Draw regret after doubt is defeated
        if (this.regretActive) {
            // Spiral effect for regret
            this.regretAngle += 0.05;
            this.regretRadius = Math.max(150, this.regretRadius - 1);
            this.regretSize = Math.max(150, this.regretSize - 0.75);
            
            let regretX = this.hero.x + cos(this.regretAngle) * this.regretRadius;
            let regretY = this.hero.y + sin(this.regretAngle) * this.regretRadius;
            
            push();
            imageMode(CENTER);
            image(this.regret, regretX, regretY, this.regretSize, this.regretSize);
            pop();

            // Regret dialogue handling
            if (this.regretRadius <= 150 && !this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.regretCurrentDialogue < this.regretDialogues.length) {
                    let dialogue = this.regretDialogues[this.regretCurrentDialogue];
                    this.dialogueBox.startDialogue(
                        dialogue.text,
                        dialogue.speaker,
                        dialogue.color
                    );
                    this.regretCurrentDialogue++;
                }
            }

            // Check if regret dialogue is complete
            if (this.regretCurrentDialogue >= this.regretDialogues.length) {
                this.regretDefeated = true;
                this.regretActive = false;
                this.angerActive = true;
                
                // Stop regret sound if it's still playing
                if (this.regretSound && this.regretSound.isPlaying()) {
                    this.regretSound.stop();
                }
                
                // Play anger sound only once
                if (this.angerSound && !this.angerSound.isPlaying()) {
                    this.angerSound.play();
                }
            }
        }

        // Draw anger after regret is defeated
        if (this.angerActive) {
            let angerX, angerY;
            
            if (this.angerRadius > 150) {
                // Spiral animation
                this.angerAngle += 0.05;
                this.angerRadius = Math.max(150, this.angerRadius - 1);
                this.angerSize = Math.max(150, this.angerSize - 0.75);
                
                angerX = this.hero.x + cos(this.angerAngle) * this.angerRadius;
                angerY = this.hero.y + sin(this.angerAngle) * this.angerRadius;
            } else {
                // Spiral effect
                this.angerAngle += 0.05;
                this.angerRadius = Math.max(150, this.angerRadius - 1);
                this.angerSize = Math.max(150, this.angerSize - 0.75);
                
                angerX = this.hero.x + cos(this.angerAngle) * this.angerRadius;
                angerY = this.hero.y + sin(this.angerAngle) * this.angerRadius;
            }
            
            push();
            imageMode(CENTER);
            image(this.anger, angerX, angerY, this.angerSize, this.angerSize);
            pop();

            // Anger dialogue handling
            if (this.angerRadius <= 150 && !this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                if (this.angerCurrentDialogue < this.angerDialogues.length) {
                    let dialogue = this.angerDialogues[this.angerCurrentDialogue];
                    this.dialogueBox.startDialogue(
                        dialogue.text,
                        dialogue.speaker,
                        dialogue.color
                    );
                    this.angerCurrentDialogue++;
                }
            }

            // Check if anger dialogue is complete
            if (this.angerCurrentDialogue >= this.angerDialogues.length) {
                this.angerActive = false;
            }
        }

        // Draw cannon if active
        if (this.cannonActive) {
            this.drawCannon();
        }

        // Update and draw dialogue box
        this.dialogueBox.update();
        this.dialogueBox.draw();

        // Check if procrastination dialogue is complete
    cleanup() {
        if (this.scaryMusic && this.scaryMusic.isPlaying()) {
            this.scaryMusic.stop();
        }
        if (this.fearSound && this.fearSound.isPlaying()) {
            this.fearSound.stop();
        }
        if (this.doubtSound && this.doubtSound.isPlaying()) {
            this.doubtSound.stop();
        }
        if (this.regretSound && this.regretSound.isPlaying()) {
            this.regretSound.stop();
        }
        if (this.angerSound && this.angerSound.isPlaying()) {
            this.angerSound.stop();
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
            arc(textWidth/2 + 20, 0, 40, 40, -HALF_PI, HALF_PI);
            
            // Trailing streaks
            for(let i = 0; i < 5; i++) {
                let alpha = map(i, 0, 5, 255, 0);
                let streakLength = map(i, 0, 5, 20, 5);
                stroke(255, 50, 0, alpha);
                strokeWeight(4 - i/2);
                line(-textWidth/2 - 20 - i*10, -5 + sin(frameCount * 0.2 + i) * 3, 
                     -textWidth/2 - 20 - streakLength - i*10, -5 + sin(frameCount * 0.2 + i) * 3);
                line(-textWidth/2 - 20 - i*10, 5 + cos(frameCount * 0.2 + i) * 3, 
                     -textWidth/2 - 20 - streakLength - i*10, 5 + cos(frameCount * 0.2 + i) * 3);
            }
            
            // Flame effect
            if (this.cannonFlash) {
                for(let i = 0; i < 3; i++) {
                    noStroke();
                    fill(255, 50, 0, 150 - i * 50);
                    let flameSize = 20 - i * 5;
                    ellipse(-textWidth/2 - 25 - i * 8, 0, flameSize, flameSize);
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
