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
        if (!this.assetsLoaded || this.images.length === 0) {
            background(0);
            fill(255);
            textSize(20);
            text('Loading...', width / 2, height / 2);
            return;
        }

        background(0);

        // Draw current image preserving aspect ratio
        if (this.images[this.currentImage]) {
            let img = this.images[this.currentImage];
            let sc  = max(windowWidth / img.width, windowHeight / img.height);
            let dw  = img.width * sc, dh = img.height * sc;

            push();
            imageMode(CENTER);
            tint(255, this.fadeAlpha);
            image(img, width / 2, height / 2, dw, dh);
            pop();

            // Cinematic slow fade — was 5, now 2
            if (this.fadeAlpha < 255) this.fadeAlpha += 2;

            if (millis() - this.lastImageChange >= this.imageInterval && this.fadeAlpha >= 255) {
                this.currentImage++;
                this.fadeAlpha = 0;
                this.lastImageChange = millis();

                if (this.currentImage >= this.images.length) {
                    this.showingVideo = true;
                    if (this.video) {
                        this.video.play();
                        this.video.onended(() => { switchScene(new FinishScreen()); });
                    }
                }
            }
        }

        // Draw video
        if (this.showingVideo && this.video) {
            push();
            imageMode(CENTER);
            tint(255, this.videoFadeAlpha);
            image(this.video, width / 2, height / 2, width, height);
            this.videoFadeAlpha = min(255, this.videoFadeAlpha + 3);
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
