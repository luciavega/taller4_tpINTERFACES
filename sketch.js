let sistema;

function setup(){

createCanvas(windowWidth,windowHeight);

sistema = new Sistema();

textFont("Arial");

}

function draw(){

background(0);

sistema.update();
sistema.draw();

}

function windowResized(){

resizeCanvas(windowWidth,windowHeight);

sistema = new Sistema();

}

function mousePressed(){

    for(let p of sistema.paneles){

        if(typeof p.mousePressed === 'function'){
            p.mousePressed();
        }

    }

}