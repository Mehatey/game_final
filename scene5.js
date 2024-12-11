class Scene5 {
        constructor() {
        this.assetsLoaded = false;
        this.hero = new Hero(width/2, height/2);
        this.hope = new Hope();
        this.dialogueBox = new DialogueBox();
        this.currentDialogue = 0;
        this.background = null;
        this.fadeAmount = 0;
        this.isFading = false;
        
        this.dialogues = [
            { speaker: 'hero', text: "Hope, what's going on? Why is everything turning dark?" },
            { speaker: 'hope', text: "I don't know. Something feels wrong." },
            { speaker: 'hero', text: "You're the one who's supposed to know what's happening!" },
            { speaker: 'hope', text: "Stay close. This darkness… it's alive." }
        ];
        
        this.playerName = "Square";
        this.backgroundMusic = null;
    }

    preload() {
        this.background = loadImage('assets/backgrounds/bg9.gif');
        this.hero.preload();
        this.hope.preload();
        this.dialogueBox.typingSound = loadSound('assets/sounds/typing.mp3');

        soundFormats('mp3');
        loadSound('assets/sounds/scary.mp3',
            (sound) => {
                this.backgroundMusic = sound;
                this.backgroundMusic.setVolume(0.5);
                this.backgroundMusic.loop();
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

        // Fade overlay
        if (this.fadeAmount > 0) {
            fill(0, this.fadeAmount);
            noStroke();
            rect(0, 0, width, height);
        }

        // Start fading after first dialogue
        if (this.currentDialogue > 0 && !this.isFading) {
            this.isFading = true;
        }

        // Handle fade
        if (this.isFading && this.fadeAmount < 255) {
            this.fadeAmount += 0.5;
        }

        // Draw characters
        this.hero.update();
        this.hero.draw();

        this.hope.update();
        this.hope.draw();

        // Handle dialogue
        if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
            if (this.currentDialogue < this.dialogues.length) {
                let dialogue = this.dialogues[this.currentDialogue];
                this.dialogueBox.startDialogue(
                    dialogue.text,
                    dialogue.speaker === 'hero' ? this.playerName : 'Hope'
                );
                this.currentDialogue++;
            }
        }

        this.dialogueBox.update();
        this.dialogueBox.draw();
    }

    cleanup() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying()) {
            this.backgroundMusic.stop();
        }
    }
}
