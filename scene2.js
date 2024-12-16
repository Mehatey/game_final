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
        this.maxSquares = 300;
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

        // Move video loading here
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

    draw() {
        background(0);

        if (this.videoPlaying && this.currentVideo) {
            this.currentVideo.show();
            return;
        }

        // Draw squares
        for (let square of this.squares) {
            push();
            noFill();
            stroke(255, 255, 255, 100);
            strokeWeight(1);
            rect(square.x, square.y, this.squareSize, this.squareSize);
            pop();
        }

        if (!this.textComplete) {
            this.drawText();
        } else if (this.squares.length === 0) {
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

        if (this.reversing && this.squares.length > 0) {
            this.squares.pop();
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
        if (frameCount % 6 === 0 && this.currentSentence < this.sentences.length) {
            const currentSentenceText = this.sentences[this.currentSentence];
            if (this.charIndex < currentSentenceText.length) {
                this.currentText += currentSentenceText.charAt(this.charIndex);
                this.charIndex++;
            } else {
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
        if (frameCount % 2 === 0 && this.squares.length < this.maxSquares) {
            let angle = this.squares.length * 0.5;
            let radius = this.squares.length * 2;
            let x = width / 2 + cos(angle) * radius;
            let y = height / 2 + sin(angle) * radius;

            if (x >= 0 && x <= width && y >= 0 && y <= height) {
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
        this.videoPlaying = true;
        if (this.videos.length > 0) {
            console.log("Playing first video");
            this.currentVideo = this.videos[0];
            this.currentVideo.size(windowWidth, windowHeight);
            this.currentVideo.position(0, 0);
            this.currentVideo.style('object-fit', 'cover');
            this.currentVideo.style('z-index', '999');
            this.currentVideo.show();
            this.currentVideo.play().catch(err => console.error("Video play error:", err));
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
            this.videoPlaying = false;
            this.currentVideo = null;
        }
    }
}

