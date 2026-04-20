class Scene2 {
    constructor() {
        this.video = null;
        this.started = false;

        const v = createVideo('./assets/videos/intro/cinematic_2dgame.mp4');
        v.hide();
        v.volume(1);
        v.onended(() => {
            this.cleanup();
            currentScene = new Scene3();
            if (currentScene.preload) currentScene.preload();
        });
        this.video = v;
    }

    preload() {}

    draw() {
        background(0);

        if (!this.started && this.video) {
            this.started = true;
            this.video.size(windowWidth, windowHeight);
            this.video.position(0, 0);
            this.video.style('object-fit', 'cover');
            this.video.style('z-index', '999');
            this.video.show();
            this.video.play();
        }
    }

    mousePressed() {
        // Click anywhere to skip
        this.cleanup();
        currentScene = new Scene3();
        if (currentScene.preload) currentScene.preload();
    }

    keyPressed() {
        if (key === ' ' || keyCode === ESCAPE) {
            this.mousePressed();
        }
    }

    cleanup() {
        if (this.video) {
            this.video.stop();
            this.video.remove();
            this.video = null;
        }
    }
}
