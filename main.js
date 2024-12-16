let pixiApp = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize PIXI but keep it separate from your p5 scenes
    pixiApp = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true,
        autoStart: false  // Don't start rendering automatically
    });
    
    // Hide PIXI canvas initially
    pixiApp.view.style.display = 'none';
    document.querySelector('main').appendChild(pixiApp.view);
});

// Helper functions to show/hide PIXI when needed
function showPixiCanvas() {
    if (pixiApp) {
        pixiApp.view.style.display = 'block';
        pixiApp.start();
    }
}

function hidePixiCanvas() {
    if (pixiApp) {
        pixiApp.view.style.display = 'none';
        pixiApp.stop();
    }
}
