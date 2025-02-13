class DialogueBox {
    constructor() {
        this.boxPadding = 40;
        this.textSize = 32;
        this.nameSize = 28;
        this.cornerRadius = 15;
        this.currentText = "";
        this.targetText = "";
        this.charIndex = 0;
        this.isTyping = false;
        this.typewriterSpeed = 2;
        this.displayDuration = 400;
        this.timer = 0;
        this.opacity = 255;
        this.speakerName = "";
        this.defaultBoxColor = color(70, 70, 70, 230);
        this.defaultStrokeColor = color(50, 50, 50);
        this.hopeBoxColor = color(0, 100, 255, 230);
        this.hopeStrokeColor = color(0, 70, 180);
        this.heroBoxColor = color(70, 70, 70, 230);
        this.heroStrokeColor = color(50, 50, 50);
        this.fearBoxColor = color(128, 0, 128, 230);
        this.fearStrokeColor = color(90, 0, 90);
        this.doubtBoxColor = color(180, 0, 0, 230);
        this.doubtStrokeColor = color(130, 0, 0);
        this.regretBoxColor = color(0, 0, 139, 230);    // Dark blue for regret
        this.regretStrokeColor = color(0, 0, 100);      // Slightly darker blue for stroke
        this.angerBoxColor = color(0, 100, 0, 230);     // Dark green for anger
        this.angerStrokeColor = color(0, 70, 0);        // Darker green for stroke
        this.procastBoxColor = color(255, 140, 0, 230);    // Orange for procrastination
        this.procastStrokeColor = color(200, 110, 0);      // Darker orange for stroke
        this.insecurityBoxColor = color(139, 0, 0, 230);    // Dark crimson for insecurity
        this.insecurityStrokeColor = color(100, 0, 0);      // Darker crimson for stroke
        this.boxColor = this.defaultBoxColor;
        this.strokeColor = this.defaultStrokeColor;
        this.boxWidth = width - 100;
        this.boxHeight = 120;
        this.strokeWidth = 4;
        this.typingSound = null;
        this.minWidth = 400;
        this.maxWidth = width - 10;
        this.namePadding = 25;
        this.typingSpeed = 50;  // Increased from 30 for slower typing
        this.fastTypingSpeed = 2; // Reduced from 4 to 2 for fast typing
        this.fadeOutTimer = 0;
        this.fadeOutDuration = 60;  // Frames to fade out
        this.typeInterval = 50;  // Increase this value to slow down typing (was likely 30 or less)

        // Initialize typing sound
        this.typingSound = new Howl({
            src: ['./assets/sounds/typing.mp3'],
            volume: 0.3,
            loop: true,
            onload: () => console.log("DialogueBox typing sound loaded"),
            onloaderror: (id, err) => console.error("Error loading typing sound:", err)
        });
    }

    startDialogue(text, name) {
        this.targetText = text;
        this.currentText = "";
        this.charIndex = 0;
        this.isTyping = true;
        this.speakerName = name;
        this.opacity = 255;
        this.timer = 0;

        if (name === 'Hope') {
            this.boxColor = this.hopeBoxColor;
            this.strokeColor = this.hopeStrokeColor;
        } else if (name === 'Fear') {
            this.boxColor = this.fearBoxColor;
            this.strokeColor = this.fearStrokeColor;
        } else if (name === 'Doubt') {
            this.boxColor = this.doubtBoxColor;
            this.strokeColor = this.doubtStrokeColor;
        } else if (name === 'Regret') {
            this.boxColor = this.regretBoxColor;
            this.strokeColor = this.regretStrokeColor;
        } else if (name === 'Anger') {
            this.boxColor = this.angerBoxColor;
            this.strokeColor = this.angerStrokeColor;
        } else if (name === 'Procrastination') {
            this.boxColor = this.procastBoxColor;
            this.strokeColor = this.procastStrokeColor;
        } else if (name === 'Hero') {
            this.boxColor = this.heroBoxColor;
            this.strokeColor = this.heroStrokeColor;
        } else if (name === 'Insecurity') {
            this.boxColor = this.insecurityBoxColor;
            this.strokeColor = this.insecurityStrokeColor;
        } else {
            this.boxColor = this.defaultBoxColor;
            this.strokeColor = this.defaultStrokeColor;
        }

        // Start typing sound
        if (this.typingSound) {
            this.typingSound.play();
        }
    }

    stopTypingSound() {
        if (this.typingSound) {
            this.typingSound.stop();
        }
    }

    update() {
        if (this.isComplete() && this.currentText !== "") {
            this.fadeOutTimer++;
            if (this.fadeOutTimer >= this.fadeOutDuration) {
                this.currentText = "";
                this.fadeOutTimer = 0;
            }
        }
        if (this.isTyping && frameCount % this.typewriterSpeed === 0) {
            this.charIndex += 1;

            // Update currentText from targetText based on charIndex
            this.currentText = this.targetText.substring(0, this.charIndex);

            if (this.charIndex >= this.targetText.length) {
                this.isTyping = false;
                this.charIndex = this.targetText.length;
                this.currentText = this.targetText;
                if (this.typingSound) {
                    this.typingSound.stop();
                }
            }
        }
    }

    isComplete() {
        if (!this.isTyping && this.currentText === this.targetText) {
            this.timer++;
            return this.timer > 60;
        }
        return false;
    }

    draw() {
        if (!this.currentText) return;

        push();
        let alpha = 255;
        if (this.fadeOutTimer > 0) {
            alpha = map(this.fadeOutTimer, 0, this.fadeOutDuration, 255, 0);
        }

        // Calculate text width and box size
        textSize(this.textSize);
        let textW = textWidth(this.currentText);
        let requiredWidth = textW + (this.boxPadding * 3);
        this.boxWidth = Math.min(width - 60, Math.max(this.minWidth, requiredWidth));

        let boxX = (width - this.boxWidth) / 2;
        let boxY = height - this.boxHeight - 30;

        // Draw box
        fill(this.boxColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWidth);
        rectMode(CORNER);
        rect(boxX, boxY, this.boxWidth, this.boxHeight, this.cornerRadius);

        // Draw name if present
        if (this.speakerName) {
            textSize(this.nameSize);
            fill(255);
            noStroke();
            textAlign(LEFT, TOP);
            text(this.speakerName,
                boxX + this.boxPadding,
                boxY + this.namePadding);
        }

        // Draw dialogue text
        fill(255);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(this.textSize);
        text(this.currentText,
            boxX + this.boxPadding,
            boxY + (this.boxHeight / 2) + 10,
            this.boxWidth - (this.boxPadding * 2));
        pop();
    }
}
