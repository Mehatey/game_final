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
        this.namePrompt = false;
        this.playerName = "";
        this.showCursor = true;
        this.finalSquareSize = 40;
        this.showHero = false;
        this.squareSize = 15;
        this.maxSquares = 300;
        this.heroAnimation = null;
        this.centerSquare = null;
        this.isGrowing = false;
        this.waitingForNext = false;
        this.textBoxWidth = 0;
        this.textBoxHeight = 80;
        this.targetTextBoxWidth = 0;
        this.textPadding = 40;
        this.textBuffer = createGraphics(100, 100);
        this.textBuffer.textSize(24);
        this.videos = [];
        this.currentVideo = null;
        this.videoIndex = 0;
        this.showIntroText = false;
        this.clickable = false;
        this.isFlying = false;
        this.flyStartTime = 0;
        this.fadeToBlack = false;
        this.fadeStartTime = 0;
        this.totalVideos = 7;
    }

    preload() {
        this.heroAnimation = loadImage('./assets/characters/meh0/hero1ani.gif');
        
        for (let i = 1; i <= this.totalVideos; i++) {
            let videoPath = `./assets/videos/intro/meh0${i}.mp4`;
            let video = createVideo(videoPath, () => {
                video.hide();
                video.style('width', '100%');
                video.style('height', '100%');
                video.style('object-fit', 'cover');
                video.style('position', 'fixed');
                video.style('left', '0');
                video.style('top', '0');
                video.style('z-index', '999');
            });
            video.elt.onended = () => this.playNextVideo();
            this.videos.push(video);
        }
    }

    draw() {
        if (this.videoPlaying && this.currentVideo) {
            this.currentVideo.show();
            return; // Exit draw loop to show video
        }

        let gradient = drawingContext.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(20, 20, 20, 1)');
        drawingContext.fillStyle = gradient;
        rect(0, 0, width, height);

        for (let square of this.squares) {
            push();
            noFill();
            stroke(255, 255, 255, 100);
            strokeWeight(1);
            rect(square.x, square.y, this.squareSize, this.squareSize);
            pop();
        }

        if (!this.textComplete) {
            if (!this.reversing) {
                this.updateSpiral();
            }

            this.textBuffer.textSize(24);
            let actualTextWidth = this.textBuffer.textWidth(this.currentText);
            this.targetTextBoxWidth = actualTextWidth + (this.textPadding * 2);

            this.textBoxWidth = lerp(this.textBoxWidth, this.targetTextBoxWidth, 0.1);

            push();
            fill(0, 0, 0, 200);
            stroke(255);
            strokeWeight(2);
            rectMode(CENTER);
            rect(width/2, height/2, this.textBoxWidth, this.textBoxHeight, 5);
            pop();

            if (frameCount % 3 === 0 && 
                this.currentSentence < this.sentences.length && 
                !this.waitingForNext) {
                
                const currentSentenceText = this.sentences[this.currentSentence];
                
                if (this.charIndex < currentSentenceText.length) {
                    this.currentText += currentSentenceText.charAt(this.charIndex);
                    this.charIndex++;
                } else if (this.currentSentence < this.sentences.length - 1) {
                    this.waitingForNext = true;
                    setTimeout(() => {
                        this.currentSentence++;
                        this.charIndex = 0;
                        this.currentText = "";
                        this.waitingForNext = false;
                        this.textBoxWidth = 0;
                        this.targetTextBoxWidth = 0;
                    }, 1500);
                } else {
                    setTimeout(() => {
                        this.textComplete = true;
                        this.reversing = true;
                        this.reverseSpiral();
                    }, 1500);
                }
            }

            push();
            textAlign(CENTER, CENTER);
            textSize(24);
            fill(255);
            text(this.currentText, width/2, height/2);
            pop();

        } else if (this.showHero) {
            if (this.isFlying) {
                this.animateFlyingHero();
            } else if (this.fadeToBlack) {
                this.animateFadeToBlack();
            } else {
                push();
                imageMode(CENTER);
                image(this.heroAnimation, width/2, height/2, 600, 600);
                
                if (this.showIntroText) {
                    textAlign(CENTER, CENTER);
                    textSize(30);
                    fill(255);
                    text(`Hey ${this.playerName}, click on me to know my story`, width/2, height/2 + 350);
                    this.clickable = true;
                }
                pop();
            }
        } else {
            if (this.centerSquare && !this.namePrompt) {
                push();
                noFill();
                stroke(255);
                strokeWeight(2);
                rectMode(CENTER);
                rect(width/2, height/2 - 100, this.centerSquare.size, this.centerSquare.size);
                pop();

                if (this.isGrowing) {
                    this.centerSquare.size += 4;
                    if (this.centerSquare.size >= 120) {
                        this.isGrowing = false;
                        this.namePrompt = true;
                        this.centerSquare = null;
                    }
                }
            }

            if (this.namePrompt) {
                this.drawNamePrompt();
            }
        }

        if (this.reversing && this.squares.length > 0) {
            if (this.squares.length > 1) {
                this.squares.pop();
            } else if (!this.centerSquare) {
                this.centerSquare = {
                    x: width/2,
                    y: height/2,
                    size: this.squareSize
                };
                this.squares = [];
                this.isGrowing = true;
            }
        }
    }

    mousePressed() {
        if (this.showHero && this.clickable && !this.videoPlaying) {
            let heroArea = {
                x: width/2 - 300,
                y: height/2 - 300,
                width: 600,
                height: 600
            };

            if (mouseX > heroArea.x && mouseX < heroArea.x + heroArea.width &&
                mouseY > heroArea.y && mouseY < heroArea.y + heroArea.height) {
                this.startFlyingAnimation();
            }
        }
    }

    startFlyingAnimation() {
        this.clickable = false;
        this.isFlying = true;
        this.flyStartTime = millis();
    }

    animateFlyingHero() {
        let elapsedTime = millis() - this.flyStartTime;
        let angle = map(elapsedTime, 0, 3000, 0, TWO_PI * 3); // Rotate 3 times
        let radius = map(elapsedTime, 0, 3000, 0, width / 2);

        push();
        translate(width / 2, height / 2);
        rotate(angle);
        imageMode(CENTER);
        image(this.heroAnimation, cos(angle) * radius, sin(angle) * radius, 600, 600);
        pop();

        if (elapsedTime > 3000) {
            this.isFlying = false;
            this.fadeToBlack = true;
            this.fadeStartTime = millis();
        }
    }

    animateFadeToBlack() {
        let elapsedTime = millis() - this.fadeStartTime;
        let alpha = map(elapsedTime, 0, 1000, 0, 255);

        push();
        fill(0, alpha);
        rect(0, 0, width, height);
        pop();

        if (elapsedTime > 1000) {
            this.fadeToBlack = false;
            this.startVideoSequence();
        }
    }

    startVideoSequence() {
        this.videoPlaying = true;
        this.videoIndex = 0;
        
        if (this.videos.length > 0 && this.videos[0]) {
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
            this.currentVideo.stop();
        }
        
        this.videoIndex++;
        
        if (this.videoIndex < this.totalVideos && this.videos[this.videoIndex]) {
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
            console.log("Video sequence complete");
        }
    }

    drawNamePrompt() {
        push();
        textAlign(CENTER, CENTER);
        
        fill(0);
        stroke(255);
        strokeWeight(2);
        rectMode(CENTER);
        rect(width/2, height/2 - 100, 150, 150);
        
        textSize(30);
        fill(255);
        noStroke();
        text("Name your Square", width/2, height/2 + 50);
        
        fill(0);
        stroke(255);
        rectMode(CENTER);
        rect(width/2, height/2 + 100, 300, 50);
        
        fill(255);
        noStroke();
        textSize(24);
        text(this.playerName + (this.showCursor ? "|" : ""), width/2, height/2 + 100);
        pop();
    }

    keyPressed() {
        if (this.namePrompt) {
            if (keyCode === ENTER && this.playerName.length > 0) {
                this.namePrompt = false;
                this.showHero = true;
                this.showIntroText = true;
            } else if (keyCode === BACKSPACE) {
                this.playerName = this.playerName.slice(0, -1);
            } else if (keyCode !== ENTER && this.playerName.length < 15) {
                this.playerName += key;
            }
        }
    }

    updateSpiral() {
        if (frameCount % 2 === 0 && this.squares.length < this.maxSquares) {
            let angle = this.squares.length * 0.5;
            let radius = this.squares.length * 2;
            let x = width/2 + cos(angle) * radius;
            let y = height/2 + sin(angle) * radius;
            
            if (x >= 0 && x <= width && y >= 0 && y <= height) {
                this.squares.push({x, y});
            }
        }
    }

    reverseSpiral() {
        this.reversing = true;
    }
}