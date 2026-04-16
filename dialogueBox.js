class DialogueBox {
    constructor() {
        this.boxPadding      = 40;
        this.textSize        = 30;
        this.nameSize        = 22;
        this.cornerRadius    = 22;
        this.currentText     = "";
        this.targetText      = "";
        this.charIndex       = 0;
        this.isTyping        = false;
        this.typewriterSpeed = 2;
        this.timer           = 0;
        this.opacity         = 255;
        this.speakerName     = "";
        this.fadeOutTimer    = 0;
        this.fadeOutDuration = 55;
        this.boxHeight       = 130;
        this.strokeWidth     = 3;
        this.minWidth        = 420;
        this.maxWidth        = width - 60;
        this.namePadding     = 20;
        this.typingSound     = null;

        // Speaker colours (box bg, box stroke, dot colour)
        this._themes = {
            Hope:            { bg: color(0,100,255,220),   st: color(0,60,180),    dot: color(120,180,255) },
            Fear:            { bg: color(100,0,130,220),   st: color(70,0,100),    dot: color(180,80,220)  },
            Doubt:           { bg: color(160,0,0,220),     st: color(110,0,0),     dot: color(255,80,80)   },
            Regret:          { bg: color(0,0,120,220),     st: color(0,0,80),      dot: color(80,120,255)  },
            Anger:           { bg: color(0,90,0,220),      st: color(0,60,0),      dot: color(80,220,80)   },
            Procrastination: { bg: color(200,110,0,220),   st: color(150,80,0),    dot: color(255,190,60)  },
            Insecurity:      { bg: color(120,0,20,220),    st: color(80,0,10),     dot: color(220,60,80)   },
            _default:        { bg: color(45,45,55,220),    st: color(30,30,40),    dot: color(200,200,200) },
        };
        this._theme = this._themes._default;

        this.typingSound = new Howl({
            src: ['./assets/sounds/typing.mp3'],
            volume: 0.25,
            loop: true,
            onloaderror: () => {}
        });
    }

    startDialogue(text, name) {
        this.targetText  = text;
        this.currentText = "";
        this.charIndex   = 0;
        this.isTyping    = true;
        this.speakerName = name || "";
        this.opacity     = 255;
        this.timer       = 0;
        this.fadeOutTimer = 0;
        this._theme = this._themes[name] || this._themes._default;

        // Adapt typing speed to emotional content
        if      (text.includes('!'))  this.typewriterSpeed = 1; // Urgent — fast
        else if (text.includes('...')) this.typewriterSpeed = 4; // Hesitant — slow
        else if (text.includes('?'))  this.typewriterSpeed = 3; // Uncertain — slightly slow
        else                          this.typewriterSpeed = 2; // Default

        if (this.typingSound) this.typingSound.play();
    }

    stopTypingSound() {
        if (this.typingSound) this.typingSound.stop();
    }

    update() {
        if (this.isComplete() && this.currentText !== "") {
            this.fadeOutTimer++;
            if (this.fadeOutTimer >= this.fadeOutDuration) {
                this.currentText  = "";
                this.fadeOutTimer = 0;
            }
        }
        if (this.isTyping && frameCount % this.typewriterSpeed === 0) {
            this.charIndex++;
            this.currentText = this.targetText.substring(0, this.charIndex);
            if (this.charIndex >= this.targetText.length) {
                this.isTyping    = false;
                this.charIndex   = this.targetText.length;
                this.currentText = this.targetText;
                if (this.typingSound) this.typingSound.stop();
            }
        }
    }

    isComplete() {
        if (!this.isTyping && this.currentText === this.targetText) {
            this.timer++;
            return this.timer > 45;
        }
        return false;
    }

    draw() {
        if (!this.currentText) return;

        push();

        // Global fade value (renamed to avoid shadowing p5's alpha() function)
        let fadeA = this.fadeOutTimer > 0
            ? map(this.fadeOutTimer, 0, this.fadeOutDuration, 255, 0)
            : 255;

        // Box sizing
        textSize(this.textSize);
        let requiredW = textWidth(this.currentText) + this.boxPadding * 3;
        let boxW = constrain(requiredW, this.minWidth, this.maxWidth);
        let boxX = (width - boxW) / 2;
        let boxY = height - this.boxHeight - 28;

        // Drop shadow under box
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 6;
        drawingContext.shadowBlur    = 24;
        drawingContext.shadowColor   = `rgba(0,0,0,${fadeA * 0.6 / 255})`;

        // Gradient box background — top slightly lighter for depth
        let bg      = this._theme.bg;
        let bgA     = alpha(bg) * (fadeA / 255);
        let r0 = red(bg), g0 = green(bg), b0 = blue(bg);
        let ctx2 = drawingContext;
        let bgrad = ctx2.createLinearGradient(boxX, boxY, boxX, boxY + this.boxHeight);
        bgrad.addColorStop(0, `rgba(${min(255,r0+18)},${min(255,g0+18)},${min(255,b0+18)},${bgA/255})`);
        bgrad.addColorStop(1, `rgba(${r0},${g0},${b0},${bgA/255})`);
        ctx2.fillStyle = bgrad;
        ctx2.fillRect(boxX, boxY, boxW, this.boxHeight);
        noFill();
        stroke(this._theme.st);
        strokeWeight(this.strokeWidth);
        rectMode(CORNER);
        rect(boxX, boxY, boxW, this.boxHeight, this.cornerRadius);

        drawingContext.shadowBlur = 0;
        drawingContext.shadowOffsetY = 0;

        // Speaker dot + name
        if (this.speakerName) {
            let dot = this._theme.dot;
            let dotX = boxX + this.boxPadding;
            let dotY = boxY + this.namePadding + 6;

            noStroke();
            fill(red(dot), green(dot), blue(dot), 220 * (fadeA / 255));
            circle(dotX, dotY, 10);

            textSize(this.nameSize);
            fill(255, 255, 255, fadeA);
            textAlign(LEFT, TOP);
            text(this.speakerName, dotX + 14, boxY + this.namePadding);
        }

        // Dialogue text with subtle drop shadow
        noStroke();
        textSize(this.textSize);
        textAlign(LEFT, CENTER);
        let textY = boxY + (this.boxHeight / 2) + (this.speakerName ? 10 : 0);
        let textX = boxX + this.boxPadding;
        let textW = boxW - this.boxPadding * 2;

        // Shadow pass
        fill(0, 0, 0, 80 * (fadeA / 255));
        text(this.currentText, textX + 1, textY + 2, textW);

        // Main text
        fill(255, 255, 255, fadeA);
        text(this.currentText, textX, textY, textW);

        // Pulsing continue indicator (▼) when done typing
        if (!this.isTyping && this.currentText === this.targetText && this.timer < 45) {
            let pulse = (sin(frameCount * 0.12) + 1) * 0.5;
            fill(255, 255, 255, 120 + pulse * 135);
            textSize(16);
            textAlign(RIGHT, BOTTOM);
            text('▼', boxX + boxW - 16, boxY + this.boxHeight - 10);
        }

        pop();
    }
}
