let grid;
let cols;
let rows;
let resolution = 20;

function setup() {
    createCanvas(400, 400);
    cols = width / resolution;
    rows = height / resolution;
    grid = make2DArray(cols, rows);
}

function draw() {
    background(220);
    drawGrid();
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(255); // Fill with white color
    }
    return arr;
}

function drawGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;
            fill(grid[i][j]);
            stroke(0);
            rect(x, y, resolution, resolution);
        }
    }
}

function mousePressed() {
    let x = floor(mouseX / resolution);
    let y = floor(mouseY / resolution);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        grid[x][y] = color(random(255), random(255), random(255)); // Random color
    }
}
