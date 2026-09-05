let sistema;

function setup(){

createCanvas(windowWidth,windowHeight);

sistema = new Sistema();

textFont("Arial");

}

function draw(){

background(34, 34, 34);

sistema.update();
sistema.draw();

}

function windowResized(){

resizeCanvas(windowWidth,windowHeight);

sistema = new Sistema();

}

function mousePressed(){

    sistema.mousePressed();

}

function mouseReleased(){

    sistema.mouseReleased();

}