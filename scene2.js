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
        this.doorWidth = 0;
        this.doorHeight = windowHeight;
        this.doorStartTime = millis();
        this.doorDuration = 4000; // 4 seconds
        this.doorOpening = true;
        this.doorGlow = 0;
        this.warpLines = [];
        for (let i = 0; i < 50; i++) {
            this.warpLines.push({
                x: random(width),
                y: random(height),
                speed: random(5, 15),
                length: random(50, 150),
                alpha: random(100, 255)
            });
        }

        // Add sounds
        this.typingSound = new Howl({
            src: ['./assets/sounds/typing.mp3'],
            volume: 0.3,
            loop: true
        });

        this.entrySound = new Howl({
            src: ['./assets/sounds/entry.mp3'],
            volume: 0.5,
            onload: () => {
                this.entrySound.play();
            }
        });

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

        if (this.doorOpening) {
            let elapsed = millis() - this.doorStartTime;
            if (elapsed > 0) {
                // Draw warp speed effect
                push();
                strokeWeight(2);
                for (let warpLine of this.warpLines) {
                    stroke(255, 255, 255, warpLine.alpha);
                    warpLine.x += warpLine.speed;
                    if (warpLine.x > width) warpLine.x = 0;

                    let angle = atan2(height / 2 - warpLine.y, width / 2 - warpLine.x);
                    let startX = warpLine.x;
                    let startY = warpLine.y;
                    let endX = warpLine.x + cos(angle) * warpLine.length;
                    let endY = warpLine.y + sin(angle) * warpLine.length;

                    line(startX, startY, endX, endY);
                }
                pop();

                // Calculate portal size
                this.doorWidth = map(
                    elapsed,
                    0,
                    this.doorDuration,
                    0,
                    windowWidth * 0.7
                );

                push();
                drawingContext.save();

                // Create portal shape
                translate(width / 2, height / 2);
                noFill();
                beginShape();
                for (let a = 0; a < TWO_PI; a += 0.1) {
                    let xoff = map(cos(a + frameCount * 0.05), -1, 1, 0, 0.2);
                    let yoff = map(sin(a + frameCount * 0.05), -1, 1, 0, 0.2);
                    let r = this.doorWidth / 2;
                    let x = r * cos(a) + noise(xoff, yoff, frameCount * 0.02) * 20;
                    let y = r * sin(a) + noise(xoff, yoff + 5, frameCount * 0.02) * 20;
                    vertex(x, y);
                }
                endShape(CLOSE);

                // Add glow and portal effects
                drawingContext.shadowBlur = 30;
                drawingContext.shadowColor = 'rgba(0, 150, 255, 0.5)';

                drawingContext.restore();
                pop();

                // Draw portal edge effects
                push();
                translate(width / 2, height / 2);
                noFill();
                for (let i = 0; i < 3; i++) {
                    stroke(0, 150, 255, 255 - i * 50);
                    strokeWeight(3 - i);
                    beginShape();
                    for (let a = 0; a < TWO_PI; a += 0.1) {
                        let r = this.doorWidth / 2 + i * 5;
                        let x = r * cos(a);
                        let y = r * sin(a);
                        vertex(x, y);
                    }
                    endShape(CLOSE);
                }
                pop();

                if (elapsed >= this.doorDuration) {
                    this.doorOpening = false;
                }
            }
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
                // Make sure typing sound plays for each character
                if (!this.typingSound.isPlaying()) {
                    this.typingSound.play();
                }
                this.currentText += currentSentenceText.charAt(this.charIndex);
                this.charIndex++;
            } else {
                this.typingSound.stop();
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
        // Clean up all sounds before starting videos
        if (this.typingSound && this.typingSound.isPlaying()) {
            this.typingSound.stop();
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
        // Stop all sounds
        if (this.typingSound && this.typingSound.isPlaying()) {
            this.typingSound.stop();
        }
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
}

