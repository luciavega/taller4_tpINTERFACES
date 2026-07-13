let sistema;

function setup(){

createCanvas(windowWidth,windowHeight);

sistema = new Sistema();

textFont("Arial");

}

function draw(){

background(240);

sistema.update();
sistema.draw();

}

function windowResized(){

resizeCanvas(windowWidth,windowHeight);

sistema = new Sistema();

}