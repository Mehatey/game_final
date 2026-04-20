class FinishScreen {
    constructor() {
        this.fadeAlpha = 0;
        this.particles = [];
        this.time = 0;

        for (let i = 0; i < 70; i++) {
            this.particles.push(this._newParticle(true));
        }
    }

    _newParticle(randomY) {
        let palette = [
            [255, 255, 255],
            [255, 220, 60],
            [100, 180, 255],
            [180, 255, 180]
        ];
        let c = palette[floor(random(palette.length))];
        return {
            x: random(width),
            y: randomY ? random(height) : height + 10,
            vx: random(-0.8, 0.8),
            vy: random(-2.5, -0.6),
            size: random(3, 7),
            alpha: random(120, 220),
            col: c
        };
    }

    draw() {
        background(0);
        this.time++;
        this.fadeAlpha = min(255, this.fadeAlpha + 3);

        this._drawParticles();

        push();
        textAlign(CENTER, CENTER);
        noStroke();

        // Title
        drawingContext.shadowBlur = 45;
        drawingContext.shadowColor = 'rgba(255,255,255,0.9)';
        textSize(min(width * 0.075, 68));
        fill(255, this.fadeAlpha);
        text('YOU EVOLVED', width / 2, height * 0.25);
        drawingContext.shadowBlur = 0;

        // Cube icon (square with 3d lines)
        this._drawCube(width / 2, height * 0.44, 50, this.fadeAlpha);

        // Subtitle
        textSize(min(width * 0.019, 16));
        fill(180, this.fadeAlpha);
        text('Fear.  Doubt.  Regret.  Anger.  Insecurity.  Procrastination.', width / 2, height * 0.59);

        textSize(min(width * 0.017, 15));
        fill(110, this.fadeAlpha);
        text('You faced them all — and became something more.', width / 2, height * 0.65);

        // Play Again button
        this._drawButton('PLAY AGAIN', width / 2, height * 0.78, 220, 52);

        // Credits
        textSize(min(width * 0.012, 11));
        fill(50, this.fadeAlpha);
        text('SQUARUBE  ·  made by sid', width / 2, height * 0.93);

        pop();

        // Fade-in overlay
        if (this.fadeAlpha < 255) {
            noStroke();
            fill(0, 255 - this.fadeAlpha);
            rect(0, 0, width, height);
        }
    }

    _drawCube(cx, cy, s, alpha) {
        let off = s * 0.3;
        push();
        noFill();
        stroke(255, alpha * 0.7);
        strokeWeight(2);
        // front face
        rect(cx - s / 2, cy - s / 2, s, s);
        // top + right edges
        stroke(255, alpha * 0.35);
        line(cx - s / 2, cy - s / 2, cx - s / 2 + off, cy - s / 2 - off);
        line(cx + s / 2, cy - s / 2, cx + s / 2 + off, cy - s / 2 - off);
        line(cx + s / 2, cy + s / 2, cx + s / 2 + off, cy + s / 2 - off);
        // top face + right face outlines
        line(cx - s / 2 + off, cy - s / 2 - off, cx + s / 2 + off, cy - s / 2 - off);
        line(cx + s / 2 + off, cy - s / 2 - off, cx + s / 2 + off, cy + s / 2 - off);
        pop();
    }

    _drawButton(label, bx, by, bw, bh) {
        let hovered = mouseX > bx - bw / 2 && mouseX < bx + bw / 2 &&
            mouseY > by - bh / 2 && mouseY < by + bh / 2;

        push();
        rectMode(CENTER);
        if (hovered) {
            drawingContext.shadowBlur = 20;
            drawingContext.shadowColor = 'rgba(255,255,255,0.5)';
            fill(255, this.fadeAlpha);
            stroke(255, this.fadeAlpha);
        } else {
            fill(255, min(20, this.fadeAlpha * 0.08));
            stroke(255, min(100, this.fadeAlpha * 0.4));
        }
        strokeWeight(1);
        rect(bx, by, bw, bh, 4);
        drawingContext.shadowBlur = 0;
        noStroke();
        textSize(min(width * 0.017, 15));
        fill(hovered ? color(0, this.fadeAlpha) : color(255, this.fadeAlpha));
        textAlign(CENTER, CENTER);
        text(label, bx, by);
        pop();
    }

    _drawParticles() {
        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.4;
            if (p.alpha <= 0 || p.y < -10) {
                Object.assign(p, this._newParticle(false));
            }
            noStroke();
            fill(p.col[0], p.col[1], p.col[2], p.alpha * (this.fadeAlpha / 255));
            rect(p.x, p.y, p.size, p.size);
        }
    }

    mousePressed() {
        let bw = 220, bh = 52, bx = width / 2, by = height * 0.78;
        if (mouseX > bx - bw / 2 && mouseX < bx + bw / 2 &&
            mouseY > by - bh / 2 && mouseY < by + bh / 2) {
            this.cleanup();
            currentScene = new Scene1();
            if (currentScene.preload) currentScene.preload();
        }
    }

    keyPressed() {
        if (key === ' ' || keyCode === ENTER) {
            this.cleanup();
            currentScene = new Scene1();
            if (currentScene.preload) currentScene.preload();
        }
    }

    cleanup() {}
}
