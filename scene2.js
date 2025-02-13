class Scene2 {
    constructor() {
        this.sentences = [
            "Hello.",
            "This is a story of evolution.",
            "A story of how a square evolved into a cube."
        ];
        this.currentSentence = 0;
        this.currentText = "";
        this.charIndex = 0;
        this.squares = [];
        this.textComplete = false;
        this.reversing = false;
        this.squareSize = 15;
        this.maxSquares = 1000;
        this.textBoxWidth = 0;
        this.textBoxHeight = 80;
        this.textPadding = 40;
        this.videos = [];
        this.currentVideo = null;
        this.videoIndex = 0;
        this.totalVideos = 7;
        this.videoPlaying = false;
        this.lastSentenceTime = 0;
        this.waitingForNext = false;
        this.buttonWidth = 200;
        this.buttonHeight = 60;

        // Initialize timing for squares and text
        this.startTime = millis();
        this.squaresStarted = false;
        this.textStarted = false;

        // Initialize typing sound
        this.typingSound = null;

        // Add entry sound
        this.entrySound = new Howl({
            src: ['./assets/sounds/entry.mp3'],
            volume: 0.5,
            onload: () => {
                this.entrySound.play();
            }
        });

        // Load videos
        const videoFiles = [
            './assets/videos/intro/meh01.mp4',
            './assets/videos/intro/meh02.mp4',
            './assets/videos/intro/meh03.mp4',
            './assets/videos/intro/meh04.mp4',
            './assets/videos/intro/meh05.mp4',
            './assets/videos/intro/meh06.mp4',
            './assets/videos/intro/meh07.mp4'
        ];

        videoFiles.forEach((path) => {
            let video = createVideo(path);
            video.hide();
            video.onended(() => this.playNextVideo());
            this.videos.push(video);
        });
    }

    preload() {
        try {
            // Load typing sound
            soundFormats('mp3');
            this.typingSound = loadSound('./assets/sounds/typing.mp3', () => {
                console.log('Typing sound loaded successfully');
            }, (error) => {
                console.error('Error loading typing sound:', error);
            });

            // Other preload code...
        } catch (e) {
            console.error('Error in Scene2 preload:', e);
        }
    }

    draw() {
        background(0);

        if (this.videoPlaying && this.currentVideo) {
            this.currentVideo.show();
            return;
        }

        let elapsed = millis() - this.startTime;

        // Start squares after 1 second
        if (elapsed > 1000 && !this.squaresStarted) {
            this.squaresStarted = true;
            this.squaresStartTime = millis();
        }

        // Draw and update squares
        if (this.squaresStarted) {
            if (!this.reversing) {
                this.updateSpiral();
            }

            for (let square of this.squares) {
                push();
                noFill();
                stroke(255, 255, 255, 100);
                strokeWeight(1);
                rect(square.x, square.y, this.squareSize, this.squareSize);
                pop();
            }

            // Only show text if not reversing
            if (!this.reversing && millis() - this.squaresStartTime > 2000) {
                this.drawText();
            }
        }

        // Handle completion states
        if (this.textComplete && this.squares.length === 0) {
            this.drawEnterButton();
        }

        if (this.reversing && this.squares.length > 0) {
            this.squares.pop();
            // Don't draw text while reversing
        }
    }

    drawText() {
        if (!this.reversing) {
            this.updateSpiral();
        }

        this.updateText();

        textSize(24);
        let actualTextWidth = textWidth(this.currentText);
        this.textBoxWidth = actualTextWidth + (this.textPadding * 2);

        push();
        fill(0, 0, 0, 230);
        rectMode(CENTER);
        rect(width / 2, height / 2, this.textBoxWidth, this.textBoxHeight, 5);

        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        text(this.currentText, width / 2, height / 2);
        pop();
    }

    updateText() {
        if (this.typingSound) {
            if (!this.typingSound.isPlaying()) {
                try {
                    this.typingSound.play();
                } catch (e) {
                    console.error('Error playing typing sound:', e);
                }
            }
        }

        // Changed from frameCount % 6 to frameCount % 3 for faster typing
        if (frameCount % 3 === 0 && this.currentSentence < this.sentences.length) {
            const currentSentenceText = this.sentences[this.currentSentence];
            if (this.charIndex < currentSentenceText.length) {
                this.currentText += currentSentenceText.charAt(this.charIndex);
                this.charIndex++;
            } else {
                if (this.typingSound) this.typingSound.stop();
                if (!this.waitingForNext) {
                    this.waitingForNext = true;
                    setTimeout(() => {
                        if (this.currentSentence < this.sentences.length - 1) {
                            this.currentSentence++;
                            this.charIndex = 0;
                            this.currentText = "";
                            this.waitingForNext = false;
                        } else {
                            this.textComplete = true;
                            this.reversing = true;
                        }
                    }, 2000);
                }
            }
        }
    }

    updateSpiral() {
        // Changed from frameCount % 12 to frameCount % 8 for medium speed
        if (frameCount % 8 === 0 && this.squares.length < this.maxSquares) {
            let angle = this.squares.length * 0.5;
            let radius = this.squares.length * 2.5;  // Increased from 2 to 2.5 for bigger spiral
            let x = width / 2 + cos(angle) * radius;
            let y = height / 2 + sin(angle) * radius;

            // Expanded bounds check to allow squares closer to edges
            if (x >= -50 && x <= width + 50 && y >= -50 && y <= height + 50) {
                this.squares.push({ x, y });
            }
        }
    }

    isMouseOverButton(x, y, w, h) {
        return mouseX > x - w / 2 && mouseX < x + w / 2 &&
            mouseY > y - h / 2 && mouseY < y + h / 2;
    }

    mousePressed() {
        console.log("Mouse pressed in Scene2");
        if (this.textComplete && this.squares.length === 0) {
            if (this.isMouseOverButton(width / 2, height / 2, this.buttonWidth, this.buttonHeight)) {
                console.log("Starting video sequence");
                this.startVideoSequence();
            }
        }
    }

    startVideoSequence() {
        // Stop entry sound when videos start
        if (this.entrySound) {
            this.entrySound.stop();
        }

        // Stop typing sound
        if (this.typingSound) {
            try {
                if (this.typingSound.isPlaying()) {
                    this.typingSound.stop();
                }
            } catch (e) {
                console.error('Error stopping typing sound:', e);
            }
        }

        this.videoPlaying = true;
        if (this.videos.length > 0) {
            this.currentVideo = this.videos[0];
            this.currentVideo.size(windowWidth, windowHeight);
            this.currentVideo.position(0, 0);
            this.currentVideo.style('object-fit', 'cover');
            this.currentVideo.style('z-index', '999');
            this.currentVideo.show();
            this.currentVideo.play();
        }
    }

    playNextVideo() {
        if (this.currentVideo) {
            this.currentVideo.hide();
        }

        this.videoIndex++;
        if (this.videoIndex < this.videos.length) {
            this.currentVideo = this.videos[this.videoIndex];
            this.currentVideo.size(windowWidth, windowHeight);
            this.currentVideo.position(0, 0);
            this.currentVideo.style('object-fit', 'cover');
            this.currentVideo.style('z-index', '999');
            this.currentVideo.show();
            this.currentVideo.play();
        } else {
            // Last video finished, clean up and switch to Scene3
            this.cleanup();
            currentScene = new Scene3();
        }
    }

    cleanup() {
        // Add sound cleanup
        if (this.typingSound) {
            try {
                if (this.typingSound.isPlaying()) {
                    this.typingSound.stop();
                }
            } catch (e) {
                console.error('Error stopping typing sound:', e);
            }
        }

        // Stop all sounds
        if (this.entrySound && this.entrySound.isPlaying()) {
            this.entrySound.stop();
        }

        // Clean up videos
        this.videos.forEach(video => {
            if (video) {
                video.stop();
                video.remove();
            }
        });
    }

    drawEnterButton() {
        push();
        rectMode(CENTER);

        // Check if mouse is over button
        let isHovered = this.isMouseOverButton(width / 2, height / 2, this.buttonWidth, this.buttonHeight);

        // Button glow effect when hovered
        if (isHovered) {
            drawingContext.shadowBlur = 20;
            drawingContext.shadowColor = 'rgba(255, 255, 0, 0.5)';
            fill(255, 255, 0); // Yellow fill when hovered
        } else {
            fill(255);
        }

        // Draw button
        rect(width / 2, height / 2, this.buttonWidth, this.buttonHeight, 10);

        // Button text
        textAlign(CENTER, CENTER);
        textSize(20);
        fill(0);
        text("Enter Meh's World", width / 2, height / 2);
        pop();
    }
}

