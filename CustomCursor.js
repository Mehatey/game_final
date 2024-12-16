class CustomCursor {
    static draw() {
        noCursor();
        push();
        
        // Largest background circle
        fill(255, 255, 255, 30); // Very translucent white
        noStroke();
        ellipse(mouseX, mouseY, 40, 40);
        
        // Middle circle
        fill(255, 255, 255, 60);
        noStroke();
        ellipse(mouseX, mouseY, 25, 25);
        
        // Outer circle with reduced stroke
        stroke(255, 255, 255, 255);
        strokeWeight(0.5);
        noFill();
        ellipse(mouseX, mouseY, 20, 20);
        
        pop();
    }
}
