class Scene3 {
    constructor() {
        this.assetsLoaded = false;
        this.hero = new Hero(width / 2, height / 2);
        this.hope = new Hope();
        this.dialogueBox = new DialogueBox();
        this.dialogueState = 'intro';
        this.introDialogues = [
            "A lone square has landed on an unfamiliar world",
            "Searching for answers, yet weighed down by doubt.",
            "Will it dare to step forward or turn back to safety?"
        ];
        this.heroDialogues = [
            { speaker: 'hero', text: "What am I even doing here? This was a mistake!" },
            { speaker: 'hero', text: "I don't belong on this planet. It feels wrong." },
            { speaker: 'hero', text: "Maybe I should just turn back before it's too late!" },
            { speaker: 'hope', text: "Ah, another soul at the crossroads, doubting every step." },
            { speaker: 'hero', text: "Who said that?! Who's there?", startHopeEntry: true },
            { speaker: 'hope', text: "I am Hope, and I'm here to see if you're ready to change." },
            { speaker: 'hope', text: "But change isn't handed to you. It's fought for, earned, and sometimes survived." },
            { speaker: 'hero', text: "Change? What are you talking about? I don't even know where I am!" },
            { speaker: 'hope', text: "You've come this far, square one. Turning back now would be predictable." },
            { speaker: 'hope', text: "Survive the next 15 seconds, and we'll see if you're worth the effort." },
            { speaker: 'hero', text: "Survive what?! This doesn't make any sense!" },
            { speaker: 'hope', text: "No more questions. No more complaints. Just move." },
            { speaker: 'hope', text: "If you can't handle your own mind, then how will you ever change?" }
        ];
        this.currentDialogue = 0;
        this.currentChar = 0;
        this.displayText = "";
        this.textOpacity = 255;
        this.typewriterSpeed = 3;
        this.displayDuration = 120;
        this.fadeSpeed = 3;
        this.timer = 0;
        this.state = 'typing';
        this.playerName = "Square";
        this.narrationMusic = null;
        this.hopeEntered = false;
        this.waitingForHopeEntry = false;
        this.currentIntroDialogue = 0;
        this.fadeInAlpha = 0;
        this.textFadeSpeed = 2;
    }

    preload() {
        this.hero.preload();
        this.hope.preload();
        this.dialogueBox.typingSound = loadSound('assets/sounds/typing.mp3');

        soundFormats('mp3');
        loadSound('assets/sounds/scary.mp3',
            (sound) => {
                this.narrationMusic = sound;
                this.narrationMusic.setVolume(0.5);
                this.narrationMusic.loop();
                this.assetsLoaded = true;
            }
        );
    }

    draw() {
        background(0);
    
        if (!this.assetsLoaded) return;
    
        if (this.dialogueState === 'intro') {
            this.drawIntroDialogue();
        } else if (this.dialogueState === 'heroDialogue') {
            this.hero.draw();
    
            let currentDialogue = this.heroDialogues[this.currentDialogue];
    
            // Draw Hope if entered
            if (this.hopeEntered) {
                this.hope.update();
                this.hope.draw();
            }
    
            // Only start new dialogue if previous is complete
            if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
                // First show current dialogue
                this.dialogueBox.startDialogue(
                    currentDialogue.text,
                    currentDialogue.speaker === 'hero' ? this.playerName : 'Hope'
                );
    
                // Check Hope's entry before incrementing
                if (currentDialogue.startHopeEntry && !this.hopeEntered) {
                    this.hope.startEntry();
                    this.hopeEntered = true;
                }
                
                // Then prepare for next dialogue
                this.currentDialogue++;
                if (this.currentDialogue < this.heroDialogues.length) {
                    currentDialogue = this.heroDialogues[this.currentDialogue];
                } else {
                    this.dialogueState = 'playing';
                }
            }
    
            this.dialogueBox.update();
            this.dialogueBox.draw();
        } else if (this.dialogueState === 'playing') {
            this.hero.update();
            this.hero.draw();
            if (this.hopeEntered) {
                this.hope.draw();
            }
        }
    }

    drawIntroDialogue() {
        push();
        textAlign(CENTER, CENTER);
        textSize(36);
        fill(255, this.textOpacity);
        text(this.displayText, width / 2, height / 2);
        pop();

        switch (this.state) {
            case 'typing':
                if (frameCount % 2 === 0) {
                    if (this.currentChar < this.introDialogues[this.currentDialogue].length) {
                        if (this.currentChar === 0) {
                            this.dialogueBox.typingSound.play();
                        }
                        this.displayText += this.introDialogues[this.currentDialogue][this.currentChar];
                        this.currentChar++;
                    } else {
                        this.state = 'displaying';
                        this.timer = 0;
                        this.dialogueBox.typingSound.stop();
                    }
                }
                break;

            case 'displaying':
                this.timer++;
                if (this.timer >= this.displayDuration) {
                    this.state = 'fading';
                }
                break;

            case 'fading':
                this.textOpacity -= this.fadeSpeed;
                if (this.textOpacity <= 0) {
                    this.currentDialogue++;
                    if (this.currentDialogue >= this.introDialogues.length) {
                        this.dialogueState = 'heroDialogue';
                        this.currentDialogue = 0;
                        this.dialogueBox.startDialogue(this.heroDialogues[0].text, this.playerName);
                    } else {
                        this.displayText = "";
                        this.currentChar = 0;
                        this.textOpacity = 255;
                        this.state = 'typing';
                    }
                }
                break;
        }
    }

    mousePressed() {
        if (this.dialogueState === 'playing') {
            // Add any playing state mouse interactions here
        }
    }

    keyPressed() {
        if (this.dialogueState === 'playing') {
            // Add any playing state key interactions here
        }
    }

    // Add cleanup method to stop music when leaving scene
    cleanup() {
        if (this.narrationMusic && this.narrationMusic.isPlaying()) {
            this.narrationMusic.stop();
        }
    }
}
