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
        this.typewriterSpeed = 3;
        this.displayDuration = 600;
        this.timer = 0;
        this.opacity = 255;
        this.speakerName = "";
        this.defaultBoxColor = color(70, 70, 70, 230);
        this.defaultStrokeColor = color(50, 50, 50);
        this.hopeBoxColor = color(0, 100, 255, 230);
        this.hopeStrokeColor = color(0, 70, 180);
        this.boxColor = this.defaultBoxColor;
        this.strokeColor = this.defaultStrokeColor;
        this.boxWidth = width - 100;
        this.boxHeight = 120;
        this.strokeWidth = 4;
        this.typingSound = null;
        this.minWidth = 400;
        this.maxWidth = width - 10;
        this.namePadding = 25;
    }

    startDialogue(text, name, style = null) {
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
        } else {
            this.boxColor = this.defaultBoxColor;
            this.strokeColor = this.defaultStrokeColor;
        }

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
        if (this.isTyping) {
            this.timer++;
            if (this.timer > this.typewriterSpeed) {
                this.timer = 0;
                if (this.charIndex < this.targetText.length) {
                    this.currentText += this.targetText.charAt(this.charIndex);
                    this.charIndex++;
                } else {
                    this.isTyping = false;
                }
            }
        }
    }

    isComplete() {
        if (!this.isTyping && this.currentText === this.targetText) {
            this.timer++;
            return this.timer > 60;  // 60 frames = 1 second delay
        }
        return false;
    }

    draw() {
        if (!this.currentText) return;
        
        push();
        
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
             boxY + (this.boxHeight/2) + 10,
             this.boxWidth - (this.boxPadding * 2));
        pop();
    }
    }
