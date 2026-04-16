class Hope {
    constructor() {
        this.x = width / 2 + 100;
        this.y = height / 2;
        this.sprite = null;
        this.size = 100;
        this.targetSize = 160;
        this.glowIntensity = 0;
        this.visible = false;
        this.entrySound = new Howl({
            src: ['assets/sounds/hopeentry.mp3'],
            volume: 0.5,
            onload: () => {}
        });
        this.dialogueColor  = color(0, 100, 255, 230);
        this.glowColor      = color(100, 150, 255, 100);
        this.entryComplete  = false;
        this.entryTimer     = 0;
        this.entryDuration  = 280;
        this.alpha          = 0;
        this.linePatterns   = [];
        this.lightning      = { flash: 0, lastFlash: 0, overlay: 0 };
        this.screenEffects  = { vignette: 0, shake: 0, ripple: 0 };
        this.shouldFadeOut  = false;
        this.opacity        = 255;
        this.floatAngle     = 0;
        this.floatRadius    = 18;
        this.targetX        = width / 2;
        this.targetY        = height / 2;
        this._bobAngle      = 0;
    }

    preload() {
        loadImage('./assets/characters/hope.gif', img => {
            this.sprite = img;
            try { if (typeof img.play === 'function') img.play(); } catch(e) {}
        });
    }

    update() {
        if (this.visible) {
            if (!this.entryComplete) {
                this.entryTimer++;

                let progress = this.entryTimer / this.entryDuration;
                let eased    = 1 - Math.pow(1 - progress, 3);

                this.y     = lerp(-100, height / 2, eased);
                this.size  = lerp(0, this.targetSize, eased);
                this.alpha = lerp(0, 255, eased);

                this.lightning.flash      *= 0.92;
                this.screenEffects.shake  *= 0.88;
                this.screenEffects.vignette = sin(this.entryTimer * 0.06) * 180;

                if (this.entryTimer >= this.entryDuration) {
                    this.entryComplete = true;
                    this.alpha = 255;
                    this.y     = height / 2;
                    this.size  = this.targetSize;
                }
            } else {
                // Gentle floating orbit
                this.floatAngle += 0.018;
                this.x = lerp(this.x, this.targetX, 0.04);
                this.y = lerp(this.y, this.targetY, 0.04);
                this.x += cos(this.floatAngle)        * this.floatRadius;
                this.y += sin(this.floatAngle * 0.7)  * this.floatRadius * 0.5;

                // Breathing glow
                this.glowIntensity = 20 + sin(this.floatAngle * 2) * 15;
            }
        }

        // Smooth eased fade out
        if (this.shouldFadeOut) {
            this.opacity *= 0.94;
            if (this.opacity < 2) {
                this.opacity = 0;
                this.visible = false;
            }
        }
    }

    draw() {
        if (!this.sprite || !this.visible) return;

        push();
        let a = this.shouldFadeOut ? this.opacity : (this.entryComplete ? 255 : this.alpha);

        // Drop shadow for depth
        drawingContext.shadowOffsetX = 3;
        drawingContext.shadowOffsetY = 8;
        drawingContext.shadowBlur    = 22;
        drawingContext.shadowColor   = `rgba(0,0,0,${0.45 * (a/255)})`;

        // Dual-layer glow: cyan (cool) + gold (warm) = feels alive + protective
        if (this.entryComplete) {
            noFill();
            let breathe = (sin(this.floatAngle * 2) * 0.5 + 0.5);

            // Outer gold ring
            let gA1 = breathe * 70;
            stroke(255, 200, 80, gA1);
            strokeWeight(2.5);
            drawingContext.shadowBlur  = 20 + breathe * 16;
            drawingContext.shadowColor = `rgba(255,200,80,0.5)`;
            ellipse(this.x, this.y, this.size * 1.55, this.size * 1.55);

            // Inner cyan ring
            let gA2 = breathe * 100;
            stroke(100, 160, 255, gA2);
            strokeWeight(2);
            drawingContext.shadowBlur  = 16 + breathe * 12;
            drawingContext.shadowColor = `rgba(100,160,255,0.55)`;
            ellipse(this.x, this.y, this.size * 1.25, this.size * 1.25);
            drawingContext.shadowBlur  = 0;
        }

        // Gentle sway rotation when floating
        push();
        translate(this.x, this.y);
        if (this.entryComplete) rotate(sin(this.floatAngle * 0.7) * 0.08);
        imageMode(CENTER);
        tint(255, a);
        image(this.sprite, 0, 0, this.size, this.size);
        noTint();
        pop();

        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur    = 0;
        pop();
    }

    startEntry() {
        this.visible     = true;
        this.entryTimer  = 0;
        this.entryComplete = false;
        this.alpha       = 0;
        this.opacity     = 255;
        this.shouldFadeOut = false;
        if (this.entrySound) this.entrySound.play();
    }

    startFadeOut() { this.shouldFadeOut = true; }

    setPosition(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    getDialogueBox() {
        return { color: this.dialogueColor };
    }
}
