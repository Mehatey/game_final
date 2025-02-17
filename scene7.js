class Scene7 {
    constructor() {
        console.log("Scene7 constructor called");  // Debug log
        this.images = [];
        this.currentImage = 0;
        this.fadeAlpha = 0;  // Start with fade out
        this.lastImageChange = 0;  // Start at 0 to show first image immediately
        this.imageInterval = 5000;
        this.video = null;
        this.showingVideo = false;
        this.videoFadeAlpha = 0;
        this.dissolveAmount = 0;
        this.assetsLoaded = false;  // Add loading flag

        // Add ambient sound
        this.ambientSound = null;
        this.soundStarted = false;
    }

    async preload() {
        console.log("Scene7 preload started");
        try {
            // Load first image immediately - updated paths
            const firstImage = await loadImage('./assets/1.png');  // Changed from ./assets/scene7/1.png
            this.images.push(firstImage);
            console.log("First image loaded");

            // Load remaining images - updated paths
            for (let i = 2; i <= 6; i++) {
                const img = await loadImage(`./assets/${i}.png`);  // Changed from ./assets/scene7/${i}.png
                this.images.push(img);
                console.log(`Loaded image ${i}.png`);
            }

            // Load video - updated path
            this.video = createVideo(['./assets/mehevolve.mp4']);  // Changed from ./assets/scene7/mehevolve.mp4
            this.video.hide();
            this.video.volume(0);
            console.log("Video element created");

            // Load ambient sound
            this.ambientSound = loadSound('./assets/sounds/ambient.mp3', () => {
                console.log('Ambient sound loaded');
            });

            this.assetsLoaded = true;
            this.lastImageChange = millis();
            this.fadeAlpha = 0;
            console.log('Scene7 assets loaded successfully');
        } catch (error) {
            console.error('Error in Scene7 preload:', error);
            console.error('Error details:', error.message);
        }
    }

    draw() {
        console.log("Scene7 draw called, assetsLoaded:", this.assetsLoaded);  // Debug log
        if (!this.assetsLoaded || this.images.length === 0) {
            background(0);
            fill(255);
            textSize(20);
            text('Loading...', width / 2, height / 2);
            return;
        }

        background(0);

        // Draw current image with fade
        if (this.images[this.currentImage]) {
            push();
            imageMode(CORNER);
            tint(255, this.fadeAlpha);
            image(this.images[this.currentImage], 0, 0, windowWidth, windowHeight);
            pop();

            // Fade in current image
            if (this.fadeAlpha < 255) {
                this.fadeAlpha += 5;
            }

            // Check for next image
            if (millis() - this.lastImageChange >= this.imageInterval && this.fadeAlpha >= 255) {
                this.currentImage++;
                this.fadeAlpha = 0;
                this.lastImageChange = millis();

                // Start video after last image
                if (this.currentImage >= this.images.length) {
                    this.showingVideo = true;
                    if (this.video) {
                        this.video.play();
                        this.video.onended(() => {
                            switchScene(new Scene8());
                        });
                    }
                }
            }
        }

        // Draw video if showing
        if (this.showingVideo && this.video) {
            push();
            tint(255, this.videoFadeAlpha);
            image(this.video, 0, 0, width, height);
            this.videoFadeAlpha = min(255, this.videoFadeAlpha + 5);
            pop();
        }

        // Draw custom cursor
        CustomCursor.draw();
    }

    windowResized() {
        // Handle window resizing if needed
        resizeCanvas(windowWidth, windowHeight);
    }

    cleanup() {
        if (this.video) {
            this.video.stop();
        }
        if (this.ambientSound && this.ambientSound.isPlaying()) {
            this.ambientSound.stop();
        }
    }
}
