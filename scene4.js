class Scene4 {
    constructor() {
        this.assetsLoaded = false;
        this.hero = new Hero(width/2, height/2);
        this.hope = new Hope();
        this.dialogueBox = new DialogueBox();
        this.currentDialogue = 0;
        this.background = null;
        this.dialogues = [
            { speaker: 'hope', text: "Well, look at you. Survived 15 seconds. Not bad, square one." },
            { speaker: 'hero', text: "What was that?! Things flying at me? What's the point of this?" },
            { speaker: 'hope', text: "The point? Growth isn't easy. Those were just the whispers of your doubts." },
            { speaker: 'hope', text: "And look around now see what happens when you push past fear." },
            { speaker: 'hero', text: "Wow… This place. It's beautiful. I didn't notice before." },
            { speaker: 'hope', text: "Of course you didn't. Fear blinds. Doubt muffles." },
            { speaker: 'hope', text: "Answer these six questions, and we'll see the real obstacles holding you back." },
            { speaker: 'hero', text: "Obstacles? What are you talking about?" },
            { speaker: 'hope', text: "Just answer honestly, or there's no point in continuing." },
            { speaker: 'hero', text: "Fine. Let's get this over with." }
        ];
        this.playerName = "Square";
        this.narrationMusic = null;
    }

    preload() {
        this.background = loadImage('assets/backgrounds/bg9.gif');
        this.hero.preload();
        this.hope.preload();
        this.dialogueBox.typingSound = loadSound('assets/sounds/typing.mp3');

        soundFormats('mp3');
        loadSound('assets/sounds/ambient.mp3',
            (sound) => {
                this.narrationMusic = sound;
                this.narrationMusic.setVolume(0.5);
                this.narrationMusic.loop();
                this.assetsLoaded = true;
            }
        );
    }

    draw() {
        if (!this.assetsLoaded) return;

        // Clear the canvas and draw background to fill screen
        background(0);
        if (this.background) {
            push();
            imageMode(CORNER);
            image(this.background, 0, 0, width, height);
            pop();
        }

        // Update hero position based on keyboard input
        if (keyIsDown(LEFT_ARROW)) {
            this.hero.x -= 5;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.hero.x += 5;
        }
        if (keyIsDown(UP_ARROW)) {
            this.hero.y -= 5;
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.hero.y += 5;
        }

        // Keep hero within screen bounds
        this.hero.x = constrain(this.hero.x, 0, width);
        this.hero.y = constrain(this.hero.y, 0, height);

        this.hero.update();
        this.hero.draw();

        this.hope.update();
        let time = millis() * 0.001;
        this.hope.x = width/2 + sin(time) * 100;
        this.hope.y = height/2 + cos(time) * 50;
        this.hope.draw();

        // Handle dialogue with faster typing speed
        if (!this.dialogueBox.isTyping && this.dialogueBox.isComplete()) {
            if (this.currentDialogue < this.dialogues.length) {
                let dialogue = this.dialogues[this.currentDialogue];
                this.dialogueBox.typingSpeed = 1;
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

    keyPressed() {
        // Handle any key interactions
    }

    cleanup() {
        if (this.narrationMusic && this.narrationMusic.isPlaying()) {
            this.narrationMusic.stop();
        }
    }
}
