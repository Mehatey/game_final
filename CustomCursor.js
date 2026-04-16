class CustomCursor {
    static lastX = 0;
    static lastY = 0;
    static rotation = 0;
    static colorOffset = 0;
    static isSpinning = false;
    static spinStartTime = 0;
    static spinDuration = 1500;
    static trailPositions = [];
    static isActive = false;
    static mode = 'default'; // 'default' | 'danger' | 'story' | 'interact'

    static easeInOutQuart(x) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }

    static draw() {
        noCursor();  // Always ensure system cursor is hidden
        document.body.style.cursor = 'none';

        if (!this.isActive) {
            this.activate();
        }

        let dx = mouseX - this.lastX;
        let dy = mouseY - this.lastY;
        let speed = sqrt(dx * dx + dy * dy);

        // Trail — 3 positions max, less visual noise
        if (abs(dx) > 0.5 || abs(dy) > 0.5) {
            this.trailPositions.unshift({ x: mouseX, y: mouseY });
            if (this.trailPositions.length > 3) this.trailPositions.pop();
        }
        for (let i = this.trailPositions.length - 1; i >= 0; i--) {
            let pos = this.trailPositions[i];
            let tx  = i === 0 ? mouseX : this.trailPositions[i-1].x;
            let ty  = i === 0 ? mouseY : this.trailPositions[i-1].y;
            pos.x   = lerp(pos.x, tx, 0.35);
            pos.y   = lerp(pos.y, ty, 0.35);
            if (i > 0 && dist(pos.x, pos.y, tx, ty) < 1) this.trailPositions.splice(i, 1);
        }

        // Cursor colour — mode-aware, palette-consistent
        let r, g, b;
        if      (this.mode === 'danger')   { r=255; g=100; b=100; }
        else if (this.mode === 'story')    { r=100; g=180; b=255; }
        else if (this.mode === 'interact') { r=255; g=220; b=80;  }
        else { // default: gentle cyan
            r = 100; g = 180; b = 255;
        }
        let strokeR = r*0.6, strokeG = g*0.6, strokeB = b*0.6;

        // Draw trail — smaller, softer
        for (let i = 0; i < this.trailPositions.length; i++) {
            let pos = this.trailPositions[i];
            let fa  = map(i, 0, this.trailPositions.length, 55, 0);
            push();
            translate(pos.x, pos.y);
            noStroke();
            fill(r, g, b, fa);
            rect(-9, -9, 18, 18, 2);
            pop();
        }

        // Smooth directional rotation — fixes twitchy behaviour
        if (!this.isSpinning && (abs(dx) > 0.5 || abs(dy) > 0.5)) {
            let targetAngle  = atan2(dy, dx);
            let diff = targetAngle - this.rotation;
            while (diff >  PI) diff -= TWO_PI;
            while (diff < -PI) diff += TWO_PI;
            this.rotation += diff * 0.12;
        }

        // Special spin animation when clicked with easing
        if (this.isSpinning) {
            let elapsed = millis() - this.spinStartTime;
            if (elapsed < this.spinDuration) {
                let progress = elapsed / this.spinDuration;
                let easedProgress = this.easeInOutQuart(progress);
                this.rotation = map(easedProgress, 0, 1, 0, TWO_PI * 3);
            } else {
                this.isSpinning = false;
            }
        }

        // Handle mouse click
        if (mouseIsPressed && !this.isSpinning) {
            this.isSpinning = true;
            this.spinStartTime = millis();
        }

        this.lastX = mouseX;
        this.lastY = mouseY;
        this.colorOffset += 0.02;

        // Main cursor
        push();
        translate(mouseX, mouseY);
        rotate(this.rotation);

        // Mode-based colour override
        let fr = r, fg = g, fb = b;
        if (this.mode === 'danger')   { fr = 255; fg = 60;  fb = 60;  }
        if (this.mode === 'story')    { fr = 100; fg = 180; fb = 255; }
        if (this.mode === 'interact') { fr = 255; fg = 220; fb = 80;  }

        drawingContext.shadowBlur  = 40;
        drawingContext.shadowColor = `rgba(${fr}, ${fg}, ${fb}, 0.8)`;

        strokeWeight(2);
        stroke(strokeR, strokeG, strokeB);
        fill(fr, fg, fb, 255);
        let sz = this.mode === 'interact' ? 18 : 15;
        rect(-sz, -sz, sz*2, sz*2, 3);

        // Face features — white outline so visible on all bg colours
        noStroke();
        // Outline
        fill(255, 180);
        ellipse(-5, -3, 5,  12);
        ellipse( 5, -3, 5,  12);
        // Eyes
        fill(0);
        ellipse(-5, -3, 2.5, 10);
        ellipse( 5, -3, 2.5, 10);
        // Mouth
        fill(255, 180);
        rect(-3, 7, 6, 3);
        fill(0);
        rect(-2, 7, 4, 1.5);

        pop();
    }

    static activate() {
        if (!this.isActive) {
            this.isActive = true;
            noCursor();
            document.body.style.cursor = 'none';
            this.trailPositions = [];
            this.rotation = 0;
            this.lastX = mouseX;
            this.lastY = mouseY;
        }
    }

    static deactivate() {
        this.isActive = false;
        this.trailPositions = [];
    }
}
