class SoundManager {
    constructor() {
        this.sounds = new Map();
    }

    async loadSound(name, path) {
        return new Promise((resolve, reject) => {
            loadSound(path, 
                (sound) => {
                    this.sounds.set(name, sound);
                    console.log(`Sound ${name} loaded successfully`);
                    resolve(sound);
                },
                (error) => {
                    console.error(`Error loading sound ${name}:`, error);
                    reject(error);
                }
            );
        });
    }

    playSound(name) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.play();
        } else {
            console.warn(`Sound ${name} not found`);
        }
    }

    stopSound(name) {
        const sound = this.sounds.get(name);
        if (sound && sound.isPlaying()) {
            sound.stop();
        }
    }

    stopCurrentSound() {
        this.sounds.forEach(sound => {
            if (sound.isPlaying()) {
                sound.stop();
            }
        });
    }
}
