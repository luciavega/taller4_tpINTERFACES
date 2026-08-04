class Caducidad{

    constructor(x,y,w,h){

        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.figuras = [];

        this.crearFiguras();

    }

    crearFiguras(){

    let violeta = color(180,0,255);
    let rosa    = color(255,0,120);
    let azul    = color(20,110,255);
    let naranja = color(255,140,0);

    this.figuras=[];

let centro = this.w / 2;

let separacion = 110;

let fila1 = 40;
let fila2 = 135;
let fila3 = 195;

   //---------------- CUADRADOS ----------------

this.figuras.push({

    tipo:"cuadrado",

    x: centro - separacion,
    y: fila1 + 30,

    tam:28,

    escala:1,
    deterioro:0,

    colorOriginal:violeta

});

this.figuras.push({

    tipo:"cuadrado",

    x: centro - separacion/2,
    y: fila1,

    tam:40,

    escala:1,
    deterioro:0,

    colorOriginal:violeta

});

this.figuras.push({

    tipo:"cuadrado",

    x: centro + separacion/2,
    y: fila1,

    tam:40,

    escala:1,
    deterioro:0,

    colorOriginal:violeta

});

this.figuras.push({

    tipo:"cuadrado",

    x: centro + separacion,
    y: fila1 + 30,

    tam:28,

    escala:1,
    deterioro:0,

    colorOriginal:violeta

});
    //---------------- CIRCULOS ----------------

    this.figuras.push({
        tipo:"circulo",
    //    x:145,
    //    y:135,
    x: centro - separacion/2,
y: fila2,
        tam:65,
        escala:1,
        deterioro:0,
        colorOriginal:rosa
    });

    this.figuras.push({
        tipo:"circulo",
    //    x:255,
    //    y:135,
    x: centro + separacion/2,
y: fila2,
        tam:65,
        escala:1,
        deterioro:0,
        colorOriginal:rosa
    });

    //---------------- TRIANGULOS ----------------

    this.figuras.push({
        tipo:"triangulo",
    //    x:90,
    //    y:165,
    x: centro - separacion,
y: fila3 - 30,
        tam:40,
        escala:1,
        deterioro:0,
        colorOriginal:azul
    });

    this.figuras.push({
        tipo:"triangulo",
    //    x:145,
    //    y:190,
    x: centro - separacion/2,
y: fila3,
        tam:55,
        escala:1,
        deterioro:0,
        colorOriginal:azul
    });

    this.figuras.push({
        tipo:"triangulo",
    //    x:255,
    //    y:190,
    x: centro + separacion/2,
y: fila3,
        tam:55,
        escala:1,
        deterioro:0,
        colorOriginal:azul
    });

    this.figuras.push({
        tipo:"triangulo",
    //    x:310,
    //    y:165,
    x: centro + separacion,
y: fila3 - 30,
        tam:40,
        escala:1,
        deterioro:0,
        colorOriginal:azul
    });

}

    update(){

        const dentro = mouseX >= this.x &&
            mouseX <= this.x + this.w &&
            mouseY >= this.y &&
            mouseY <= this.y + this.h;

        if(!dentro){
            for(let f of this.figuras){
                f.deterioro = lerp(f.deterioro, 0, 0.03);
                f.escala = lerp(f.escala, 1, 0.03);
            }
            return;
        }

        let mx=mouseX-this.x;
        let my=mouseY-this.y;

        for(let f of this.figuras){

            let d=dist(mx,my,f.x,f.y);

            if(d<120){

                f.deterioro=lerp(f.deterioro,1,0.03);

                f.escala=lerp(f.escala,0.55,0.03);

            }else{

                f.deterioro=lerp(f.deterioro,0,0.03);

                f.escala=lerp(f.escala,1,0.03);

            }

        }

    }

    draw(){

        this.update();

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        translate(this.x,this.y);

        noStroke();

     rectMode(CORNER);

fill(235);

rect(0,0,this.w,this.h);

rectMode(CENTER);

    

        let sepia=color(140,115,80);

for(let f of this.figuras){

    let c=lerpColor(
        f.colorOriginal,
        sepia,
        f.deterioro
    );

    fill(c);

    push();

    translate(f.x,f.y);

    scale(f.escala);

    if(f.tipo=="cuadrado"){

        rectMode(CENTER);

        square(0,0,f.tam);

    }

    if(f.tipo=="circulo"){

        circle(0,0,f.tam);

    }

    if(f.tipo=="triangulo"){

        triangle(
            0,-f.tam/2,
            -f.tam/2,f.tam/2,
            f.tam/2,f.tam/2
        );

    }

    pop();

}
// Calcular cuánto se deterioró el sistema
let deterioroLinea = 0;

for (let f of this.figuras) {
    if (f.deterioro > deterioroLinea) {
        deterioroLinea = f.deterioro;
    }
}

stroke(
    lerpColor(
        color(255,140,0),
        sepia,
        deterioroLinea
    )
);

strokeWeight(
    lerp(4, 1.5, deterioroLinea)
);

let largo = lerp(40, 18, deterioroLinea);

line(
    this.w/2,
    180 - largo/2,
    this.w/2,
    180 + largo/2
);

pop();

}

}