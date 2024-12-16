class Scene7 {
    constructor() {
        this.images = [];
        this.currentImage = 0;
        this.fadeAlpha = 255;
        this.lastImageChange = millis();
        this.imageInterval = 5000;
        this.video = null;
        this.showingVideo = false;
        this.videoFadeAlpha = 0;
        this.dissolveAmount = 0;

        // Add ambient sound
        this.ambientSound = null;
        this.soundStarted = false;
    }

    preload() {
        // Load all images in correct order
        for (let i = 1; i <= 6; i++) {
            this.images.push(loadImage(`assets/${i}.png`));
        }

        // Load video
        this.video = createVideo('assets/mehevolve.mp4');
        this.video.hide();

        // Load ambient sound with correct path
        soundFormats('mp3');
        this.ambientSound = loadSound('assets/sounds/ambient.mp3', () => {
            // Start playing as soon as it's loaded
            if (!this.soundStarted) {
                this.ambientSound.loop();
                this.soundStarted = true;
            }
        });
    }

    draw() {
        background(0);

        // Add custom cursor
        CustomCursor.draw();

        if (this.showingVideo) {
            // Fade in video
            this.videoFadeAlpha = min(255, this.videoFadeAlpha + 5);
            push();
            tint(255, this.videoFadeAlpha);
            image(this.video, 0, 0, windowWidth, windowHeight);
            pop();
            return;
        }

        let currentTime = millis();

        // Fade effect for images
        if (this.fadeAlpha < 255) {
            this.fadeAlpha += 5;
        }

        // Draw current image fullscreen with fade
        push();
        imageMode(CORNER); // Change to CORNER for fullscreen
        tint(255, this.fadeAlpha);
        image(this.images[this.currentImage],
            0, 0, // Start from top-left corner
            windowWidth, windowHeight); // Use window dimensions
        pop();

        // Check if it's time for next image
        if (currentTime - this.lastImageChange >= this.imageInterval) {
            this.currentImage++;
            this.fadeAlpha = 0;
            this.lastImageChange = currentTime;

            // After all images shown, start video
            if (this.currentImage >= this.images.length) {
                this.showingVideo = true;
                this.video.play();
                this.video.onended(() => {
                    switchScene(new Scene8()); // Or whatever comes next
                });
            }
        }
    }

    windowResized() {
        // Handle window resizing if needed
        resizeCanvas(windowWidth, windowHeight);
    }
}
