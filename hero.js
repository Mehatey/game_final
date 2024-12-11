class Hero {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.direction = 'still';
        this.images = {};
        this.currentImage = null;
        this.imagesLoaded = false;
        this.size = 150;
    }

    preload() {
        const imagePaths = {
            still: 'assets/characters/meh0/hero1still.png',
            left: 'assets/characters/meh0/hero1left.png',
            right: 'assets/characters/meh0/hero1right.png',
            up: 'assets/characters/meh0/hero1up.png',
            down: 'assets/characters/meh0/hero1down.png'
        };

        // Load each image with error handling
        for (let direction in imagePaths) {
            loadImage(
                imagePaths[direction],
                // Success callback
                (img) => {
                    console.log(`Successfully loaded ${direction} image`);
                    this.images[direction] = img;
                    if (direction === 'still') {
                        this.currentImage = img;
                    }
                },
                // Error callback
                (err) => {
                    console.error(`Failed to load ${direction} image:`, imagePaths[direction]);
                }
            );
        }
    }

    update() {
        if (!this.currentImage) return;  // Don't update if images aren't loaded

        let moving = false;

        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {  // Left arrow or 'A'
            this.x = max(this.x - 5, 0);
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {  // Right arrow or 'D'
            this.x = min(this.x + 5, width);
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {  // Up arrow or 'W'
            this.y = max(this.y - 5, 0);
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {  // Down arrow or 'S'
            this.y = min(this.y + 5, height);
        }

        if (!moving) {
            this.direction = 'still';
            this.currentImage = this.images.still;
        }

        // Keep hero within canvas bounds, accounting for centered image
        this.x = constrain(this.x, this.size/2, width - this.size/2);
        this.y = constrain(this.y, this.size/2, height - this.size/2);
    }

    draw() {
        if (this.currentImage) {
            imageMode(CENTER);
            image(this.currentImage, this.x, this.y, this.size, this.size);
        } else {
            // Draw a placeholder rectangle if image isn't loaded
            rectMode(CENTER);
            fill(255);
            rect(this.x, this.y, this.size, this.size);
        }
    }
}
