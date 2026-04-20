class Onboarding {
    constructor() {
        this.slide = 0;
        this.totalSlides = 4;
        this.fadeAlpha = 0;
        this.fadingIn = true;
        this.fadingOut = false;
        this.particles = [];

        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: random(width),
                y: random(height),
                size: random(2, 5),
                speed: random(0.2, 0.7),
                alpha: random(20, 70)
            });
        }
    }

    draw() {
        background(0);
        this._drawParticles();

        switch (this.slide) {
            case 0: this._drawLogo(); break;
            case 1: this._drawStory(); break;
            case 2: this._drawCharacters(); break;
            case 3: this._drawControls(); break;
        }

        if (!this.fadingIn && !this.fadingOut) {
            this._drawContinueHint();
        }

        // Fade overlay
        push();
        noStroke();
        if (this.fadingIn) {
            this.fadeAlpha = min(255, this.fadeAlpha + 8);
            fill(0, 255 - this.fadeAlpha);
            rect(0, 0, width, height);
            if (this.fadeAlpha >= 255) this.fadingIn = false;
        } else if (this.fadingOut) {
            this.fadeAlpha = max(0, this.fadeAlpha - 8);
            fill(0, 255 - this.fadeAlpha);
            rect(0, 0, width, height);
            if (this.fadeAlpha <= 0) {
                this.fadingOut = false;
                this._advanceSlide();
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

        drawingContext.shadowBlur = 35;
        drawingContext.shadowColor = 'rgba(255,255,255,0.7)';
        textSize(min(width * 0.09, 80));
        fill(255);
        text('SQUARUBE', width / 2, height / 2 - 50);
        drawingContext.shadowBlur = 0;

        textSize(min(width * 0.02, 17));
        fill(160);
        text('A STORY OF EVOLUTION', width / 2, height / 2 + 20);

        stroke(255, 100);
        strokeWeight(2);
        noFill();
        let s = 32;
        rect(width / 2 - s / 2, height / 2 + 65, s, s);
        noStroke();
    }

    _drawStory() {
        textAlign(CENTER, CENTER);
        noStroke();

        textSize(min(width * 0.022, 18));
        fill(120);
        text('THE STORY', width / 2, height * 0.18);

        stroke(255, 40);
        strokeWeight(1);
        line(width / 2 - 80, height * 0.18 + 18, width / 2 + 80, height * 0.18 + 18);
        noStroke();

        let lines = [
            'A lone square lands on an unfamiliar world.',
            '',
            'Guided by Hope, you must face the inner demons',
            'standing between you and who you could become —',
            '',
            'Fear.  Doubt.  Regret.  Anger.',
            'Insecurity.  Procrastination.',
            '',
            'This is your story of evolution.'
        ];

        let lineH = height * 0.065;
        let startY = height * 0.35;
        textSize(min(width * 0.02, 17));

        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === '') continue;
            let alpha = (i === lines.length - 1) ? 255 : 200;
            fill(255, alpha);
            text(lines[i], width / 2, startY + i * lineH);
        }
    }

    _drawCharacters() {
        textAlign(CENTER, CENTER);
        noStroke();

        textSize(min(width * 0.022, 18));
        fill(120);
        text('WHO YOU ARE', width / 2, height * 0.18);

        stroke(255, 40);
        strokeWeight(1);
        line(width / 2 - 80, height * 0.18 + 18, width / 2 + 80, height * 0.18 + 18);

        // Divider
        stroke(255, 25);
        line(width / 2, height * 0.3, width / 2, height * 0.78);
        noStroke();

        let col1 = width * 0.28;
        let col2 = width * 0.72;
        let iconY = height * 0.42;

        // YOU — square
        stroke(255);
        strokeWeight(2);
        noFill();
        let sq = 38;
        rectMode(CENTER);
        rect(col1, iconY, sq, sq);
        rectMode(CORNER);
        noStroke();

        textSize(min(width * 0.02, 18));
        fill(255);
        text('YOU', col1, iconY + 38);
        textSize(min(width * 0.015, 13));
        fill(140);
        text('The Square', col1, iconY + 60);
        text('Land on a new world.', col1, height * 0.65);
        text('Survive. Fight. Evolve.', col1, height * 0.68 + 16);

        // HOPE — circle
        stroke(100, 160, 255);
        strokeWeight(2);
        noFill();
        ellipse(col2, iconY, 42, 42);
        noStroke();

        textSize(min(width * 0.02, 18));
        fill(100, 160, 255);
        text('HOPE', col2, iconY + 38);
        textSize(min(width * 0.015, 13));
        fill(140);
        text('Your guide', col2, iconY + 60);
        text('She believes in you', col2, height * 0.65);
        text('even when you don\'t.', col2, height * 0.68 + 16);
    }

    _drawControls() {
        textAlign(CENTER, CENTER);
        noStroke();

        textSize(min(width * 0.022, 18));
        fill(120);
        text('CONTROLS', width / 2, height * 0.18);

        stroke(255, 40);
        strokeWeight(1);
        line(width / 2 - 80, height * 0.18 + 18, width / 2 + 80, height * 0.18 + 18);
        noStroke();

        let rows = [
            ['ARROW KEYS / WASD', 'Move your character'],
            ['SPACE', 'Fire / activate cannon'],
            ['CLICK', 'Confirm choices & dialogue'],
            ['ESC', 'Pause the game'],
        ];

        let startY = height * 0.35;
        let rowH = height * 0.1;
        let kCol = width * 0.35;
        let dCol = width * 0.65;
        let kw = min(width * 0.22, 200);
        let kh = 36;

        for (let i = 0; i < rows.length; i++) {
            let y = startY + i * rowH;

            // key pill
            fill(255, 18);
            stroke(255, 55);
            strokeWeight(1);
            rectMode(CENTER);
            rect(kCol, y, kw, kh, 5);
            rectMode(CORNER);
            noStroke();

            textSize(min(width * 0.015, 13));
            fill(220);
            text(rows[i][0], kCol, y);

            textAlign(LEFT, CENTER);
            fill(140);
            text(rows[i][1], dCol - 10, y);
            textAlign(CENTER, CENTER);
        }
    }

    _drawContinueHint() {
        textAlign(CENTER, CENTER);
        noStroke();
        let pulse = map(sin(frameCount * 0.04), -1, 1, 80, 180);
        fill(255, pulse);
        textSize(min(width * 0.013, 12));
        text('CLICK OR PRESS SPACE TO CONTINUE', width / 2, height * 0.88);

        // Slide dots
        let spacing = 14;
        let startX = width / 2 - ((this.totalSlides - 1) * spacing) / 2;
        for (let i = 0; i < this.totalSlides; i++) {
            fill(i === this.slide ? 255 : color(255, 50));
            noStroke();
            ellipse(startX + i * spacing, height * 0.93, 6, 6);
        }
    }

    _advanceSlide() {
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
