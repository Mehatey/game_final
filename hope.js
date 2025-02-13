class Hope {
    constructor() {
        this.x = width / 2 + 100;
        this.y = height / 2;
        this.sprite = null;
        this.size = 100; // Add explicit size
        this.targetSize = 160;
        this.glowIntensity = 0;
        this.visible = false;
        this.entrySound = new Howl({
            src: ['assets/sounds/hopeentry.mp3'],
            volume: 0.5,
            onload: () => console.log("Hope entry sound loaded")
        });
        this.dialogueColor = color(0, 100, 255, 230);
        this.glowColor = color(100, 150, 255, 100);
        this.entryComplete = false;
        this.entryTimer = 0;
        this.entryDuration = 360;
        this.alpha = 0;
        this.flyPath = [];
        this.linePatterns = [];
        this.portrait = null;
        this.lightning = {
            flash: 0,
            lastFlash: 0,
            overlay: 0
        };
        this.screenEffects = {
            vignette: 0,
            shake: 0,
            ripple: 0
        };
        this.shouldFadeOut = false;
        this.opacity = 255;
        this.floatAngle = 0;
        this.floatRadius = 30;
        this.targetX = width / 2;
        this.targetY = height / 2;
    }

    async preload() {
        try {
            this.sprite = await loadImage('./assets/characters/hope.gif');
            console.log("Hope sprite loaded"); // Debug log
        } catch (error) {
            console.error("Error loading Hope sprite:", error);
        }
    }

    update() {
        if (this.visible) {
            if (!this.entryComplete) {
                this.entryTimer++;

                // Generate line patterns
                if (frameCount % 10 === 0) {
                    this.linePatterns.push({
                        x1: random(width),
                        y1: 0,
                        x2: width / 2,
                        y2: height / 2,
                        alpha: 255,
                        thickness: random(1, 3)
                    });
                }

                // Update line patterns
                for (let i = 0; i < this.linePatterns.length; i++) {
                    this.linePatterns[i].alpha -= 1;
                    if (this.linePatterns[i].alpha <= 0) {
                        this.linePatterns.splice(i, 1);
                        i--;
                    }
                }

                // More frequent and intense lightning
                if (random(1) < 0.15 && this.entryTimer < this.entryDuration - 60) {
                    this.lightning.flash = 255;
                    this.screenEffects.shake = 20;
                }

                let progress = this.entryTimer / this.entryDuration;
                let eased = 1 - Math.pow(1 - progress, 3);

                this.y = lerp(-100, height / 2, eased);
                this.size = lerp(0, this.targetSize, eased);
                this.alpha = lerp(0, 255, eased);

                // Stronger effects
                this.lightning.flash *= 0.95;
                this.screenEffects.shake *= 0.9;
                this.screenEffects.vignette = sin(this.entryTimer * 0.05) * 200;
                this.screenEffects.ripple = sin(this.entryTimer * 0.03) * 40;

                if (this.entryTimer >= this.entryDuration) {
                    this.entryComplete = true;
                    this.alpha = 255;
                    this.y = height / 2;
                    this.size = this.targetSize;
                }
            } else {
                // Add smooth floating movement
                this.floatAngle += 0.02;
                this.x = lerp(this.x, this.targetX, 0.05);
                this.y = lerp(this.y, this.targetY, 0.05);

                // Add slight floating effect
                this.x += cos(this.floatAngle) * this.floatRadius;
                this.y += sin(this.floatAngle) * this.floatRadius;
            }
        }

        // Add fade out when dialogue ends
        if (this.shouldFadeOut) {
            this.opacity = max(0, this.opacity - 5);
            if (this.opacity === 0) {
                this.visible = false;
            }
        }
    }

    draw() {
        if (this.sprite) {
            push();
            imageMode(CENTER);
            image(this.sprite, this.x, this.y, this.size, this.size);
            pop();
        } else {
            console.error("Hope sprite not loaded"); // Debug log
        }
    }

    startEntry() {
        this.visible = true;
        this.entryTimer = 0;
        if (this.entrySound) {
            this.entrySound.play();
        }
    }

    getDialogueBox() {
        return {
            color: this.dialogueColor
        };
    }

    startFadeOut() {
        this.shouldFadeOut = true;
    }

    setPosition(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
}
