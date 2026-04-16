class Hero {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = createVector(0, 0);
        this.maxSpeed = 60;
        this.visible = true;
        this.sprite = null;
        this.speed = 8;
        this.direction = 'still';
        this.images = {};
        this.currentImage = null;
        this.imagesLoaded = false;
        this.size = 150;
        this.width  = this.size;
        this.height = this.size;

        // Idle bob
        this._bobAngle = random(TWO_PI);

        // Screen shake
        this._shakeFrames = 0;
        this._shakeMag    = 0;

        // Smooth movement velocity
        this._vx = 0;
        this._vy = 0;

        // Dust particles
        this._dust = [];
    }

    shake(magnitude, frames) {
        this._shakeMag    = magnitude;
        this._shakeFrames = frames;
    }

    preload() {
        const imagePaths = {
            still: 'assets/characters/meh0/hero1still.png',
            left:  'assets/characters/meh0/hero1left.png',
            right: 'assets/characters/meh0/hero1right.png',
            up:    'assets/characters/meh0/hero1up.png',
            down:  'assets/characters/meh0/hero1down.png'
        };

        for (let direction in imagePaths) {
            loadImage(imagePaths[direction],
                (img) => {
                    this.images[direction] = img;
                    if (direction === 'still') this.currentImage = img;
                },
                () => {}
            );
        }
    }

    update() {
        let tx = 0, ty = 0;
        let moving = false;

        if (keyIsDown(LEFT_ARROW)  || keyIsDown(65)) { tx = -this.speed; this.currentImage = this.images.left  || this.images.still; moving = true; }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { tx =  this.speed; this.currentImage = this.images.right || this.images.still; moving = true; }
        if (keyIsDown(UP_ARROW)    || keyIsDown(87)) { ty = -this.speed; this.currentImage = this.images.up    || this.images.still; moving = true; }
        if (keyIsDown(DOWN_ARROW)  || keyIsDown(83)) { ty =  this.speed; this.currentImage = this.images.down  || this.images.still; moving = true; }

        // Smooth acceleration
        this._vx = lerp(this._vx, tx, 0.22);
        this._vy = lerp(this._vy, ty, 0.22);

        this.x += this._vx;
        this.y += this._vy;

        if (!moving) {
            this.currentImage = this.images.still;
            this._bobAngle += 0.045;
        }

        // Dust trail when moving fast enough
        let spd = sqrt(this._vx * this._vx + this._vy * this._vy);
        if (spd > 2 && frameCount % 4 === 0) {
            this._dust.push({
                x: this.x + random(-12, 12),
                y: this.y + this.size * 0.4,
                life: 18, sz: random(4, 9)
            });
        }

        this.x = constrain(this.x, this.size / 2, width  - this.size / 2);
        this.y = constrain(this.y, this.size / 2, height - this.size / 2);
    }

    draw() {
        if (!this.visible) return;

        // Dust particles
        push();
        noStroke();
        for (let i = this._dust.length - 1; i >= 0; i--) {
            let d = this._dust[i];
            d.life--;
            if (d.life <= 0) { this._dust.splice(i, 1); continue; }
            fill(180, 170, 160, map(d.life, 18, 0, 100, 0));
            ellipse(d.x, d.y, d.sz * (d.life / 18), d.sz * 0.5 * (d.life / 18));
        }
        pop();

        // Screen shake offset
        let ox = 0, oy = 0;
        if (this._shakeFrames > 0) {
            ox = random(-this._shakeMag, this._shakeMag);
            oy = random(-this._shakeMag, this._shakeMag);
            this._shakeFrames--;
        }

        // Idle vertical bob (only when not moving)
        let bob = sin(this._bobAngle) * 4;

        push();
        translate(ox, oy);

        let img = this.sprite || this.currentImage;
        if (img) {
            imageMode(CENTER);
            image(img, this.x, this.y + bob, this.size, this.size);
        } else {
            rectMode(CENTER);
            fill(255);
            rect(this.x, this.y + bob, this.size, this.size);
        }
        pop();
    }
}
