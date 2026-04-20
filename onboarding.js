class Onboarding {
    constructor() {
        this.slide = 0;
        this.totalSlides = 3;
        this.fadeAlpha = 0;
        this.fadingIn = true;
        this.fadingOut = false;
        this.particles = [];

        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: random(width),
                y: random(height),
                size: random(2, 4),
                speed: random(0.2, 0.6),
                alpha: random(15, 50)
            });
        }
    }

    draw() {
        background(0);
        this._drawParticles();

        switch (this.slide) {
            case 0: this._drawLogo(); break;
            case 1: this._drawStory(); break;
            case 2: this._drawControls(); break;
        }

        if (!this.fadingIn && !this.fadingOut) {
            this._drawHint();
        }

        // Fade overlay
        push();
        noStroke();
        if (this.fadingIn) {
            this.fadeAlpha = min(255, this.fadeAlpha + 10);
            fill(0, 255 - this.fadeAlpha);
            rect(0, 0, width, height);
            if (this.fadeAlpha >= 255) this.fadingIn = false;
        } else if (this.fadingOut) {
            this.fadeAlpha = max(0, this.fadeAlpha - 10);
            fill(0, 255 - this.fadeAlpha);
            rect(0, 0, width, height);
            if (this.fadeAlpha <= 0) {
                this.fadingOut = false;
                this._advance();
            }
        }
        pop();
    }

    _drawParticles() {
        for (let p of this.particles) {
            p.y -= p.speed;
            if (p.y < 0) { p.y = height + 5; p.x = random(width); }
            noStroke();
            fill(255, p.alpha);
            rect(p.x, p.y, p.size, p.size);
        }
    }

    _drawLogo() {
        textAlign(CENTER, CENTER);
        noStroke();

        // Big title
        drawingContext.shadowBlur = 40;
        drawingContext.shadowColor = 'rgba(255,255,255,0.8)';
        textSize(min(width * 0.1, 96));
        fill(255);
        text('SQUARUBE', width / 2, height / 2 - 30);
        drawingContext.shadowBlur = 0;

        // Tagline
        textSize(min(width * 0.024, 22));
        fill(160);
        text('A STORY OF EVOLUTION', width / 2, height / 2 + 55);

        // Square icon
        stroke(255, 80);
        strokeWeight(2);
        noFill();
        let s = 28;
        rectMode(CENTER);
        rect(width / 2, height / 2 + 105, s, s);
        rectMode(CORNER);
        noStroke();
    }

    _drawStory() {
        textAlign(CENTER, CENTER);
        noStroke();

        let lines = [
            'You are a square.',
            'Hope is your only guide.',
            'Your inner demons are waiting.'
        ];

        let lineH = min(height * 0.12, 80);
        let startY = height / 2 - lineH;

        for (let i = 0; i < lines.length; i++) {
            textSize(min(width * 0.033, 30));
            fill(i === lines.length - 1 ? 255 : 200);
            text(lines[i], width / 2, startY + i * lineH);
        }
    }

    _drawControls() {
        textAlign(CENTER, CENTER);
        noStroke();

        let rows = [
            ['WASD  /  ARROWS', 'Move'],
            ['SPACE', 'Fire'],
            ['CLICK', 'Choose'],
            ['ESC', 'Pause'],
        ];

        let rowH = min(height * 0.1, 70);
        let startY = height / 2 - rowH * 1.5;
        let kCol = width * 0.38;
        let vCol = width * 0.62;
        let kw = min(width * 0.28, 240);
        let kh = 44;

        for (let i = 0; i < rows.length; i++) {
            let y = startY + i * rowH;

            // Key pill
            fill(255, 15);
            stroke(255, 50);
            strokeWeight(1);
            rectMode(CENTER);
            rect(kCol, y, kw, kh, 5);
            rectMode(CORNER);
            noStroke();

            textSize(min(width * 0.022, 20));
            fill(220);
            text(rows[i][0], kCol, y);

            textAlign(LEFT, CENTER);
            textSize(min(width * 0.022, 20));
            fill(130);
            text(rows[i][1], vCol, y);
            textAlign(CENTER, CENTER);
        }
    }

    _drawHint() {
        textAlign(CENTER, CENTER);
        noStroke();
        let pulse = map(sin(frameCount * 0.04), -1, 1, 70, 160);
        fill(255, pulse);
        textSize(min(width * 0.013, 12));
        text('CLICK OR PRESS SPACE TO CONTINUE', width / 2, height * 0.9);

        // Dots
        let spacing = 14;
        let startX = width / 2 - ((this.totalSlides - 1) * spacing) / 2;
        for (let i = 0; i < this.totalSlides; i++) {
            fill(i === this.slide ? 255 : color(255, 50));
            noStroke();
            ellipse(startX + i * spacing, height * 0.95, 6, 6);
        }
    }

    _advance() {
        this.slide++;
        if (this.slide >= this.totalSlides) {
            currentScene = new Scene1();
            if (currentScene.preload) currentScene.preload();
            return;
        }
        this.fadeAlpha = 0;
        this.fadingIn = true;
    }

    _next() {
        if (this.fadingIn || this.fadingOut) return;
        this.fadingOut = true;
    }

    mousePressed() { this._next(); }
    keyPressed() {
        if (key === ' ' || keyCode === ENTER) this._next();
    }
    cleanup() {}
}
