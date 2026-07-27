class Memoria {

    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.figuras = [];

        this.crearComposicion();

    }

    crearComposicion() {

        // Colores

        let rosa = color(255, 0, 120);
        let azul = color(40, 120, 255);
        let violeta = color(180, 0, 255);
        let naranja = color(255, 140, 0);

        // Posiciones
this.figuras = [

    // Círculos arriba
    {tipo:"circulo",   x:0.40, y:0.25, tam:50, c:rosa},
    {tipo:"circulo",   x:0.60, y:0.25, tam:50, c:rosa},

    // Triángulos más abiertos
    {tipo:"triangulo", x:0.25, y:0.50, tam:45, c:azul},
    {tipo:"triangulo", x:0.75, y:0.50, tam:45, c:azul},

    // Cuadrados abajo
    {tipo:"cuadrado",  x:0.40, y:0.75, tam:38, c:violeta},
    {tipo:"cuadrado",  x:0.60, y:0.75, tam:38, c:violeta}

];

for(let f of this.figuras){

    f.alpha = 255;
    f.escala = 1;

    f.ultimoClick = millis();

}
    }

update(){

    let tiempoEspera = 3000; // 3 segundos

    for(let f of this.figuras){

        if(millis() - f.ultimoClick > tiempoEspera){

            // Baja lentamente cuando no interactuás
            f.alpha = lerp(f.alpha,20,0.03);

        }

        // ===== LATIDO =====

        let pulso = (sin(frameCount * 0.05) + 1) / 2;

f.escala = 1 + pulso * 0.05;

    }

}

mousePressed(){

    for(let f of this.figuras){

        let px = this.x + f.x*this.w;
        let py = this.y + f.y*this.h;

        let d = dist(mouseX,mouseY,px,py);

        if(d < f.tam*0.7){

            // Reinicia el temporizador
            f.ultimoClick = millis();

            // Cada click suma intensidad
            f.alpha += 25;

            // No puede pasar de 255
            f.alpha = constrain(f.alpha,20,255);

        }

    }

}

    dibujarFigura(f){

        let px=this.x+f.x*this.w;

        let py=this.y+f.y*this.h;


        push();

        translate(px,py);

        scale(f.escala);

        fill(
            red(f.c),
            green(f.c),
            blue(f.c),
            f.alpha
        );

        stroke(
            red(f.c),
            green(f.c),
            blue(f.c),
            f.alpha
        );

        strokeWeight(3);

        switch(f.tipo){

            case "circulo":

                noStroke();

                circle(0,0,f.tam);

                break;

            case "cuadrado":

                noStroke();

                rectMode(CENTER);

                square(0,0,f.tam);

                break;

            case "triangulo":

                noStroke();

                let h=f.tam*0.86;

                triangle(

                    0,-h/2,

                    -f.tam/2,h/2,

                    f.tam/2,h/2

                );

                break;

            case "linea":

                strokeWeight(3);

                line(
                    0,
                    -f.tam/2,
                    0,
                    f.tam/2
                );

                break;

        }

        pop();

    }

    draw(){

        this.update();

        // fondo

        noStroke();

        fill(240);

        rect(
            this.x,
            this.y,
            this.w,
            this.h
        );

        // titulo

        fill(30);

        textAlign(CENTER);

        textSize(18);

       /* text(

            "MEMORIA",

            this.x+this.w/2,

            this.y+30

        );
*/
        // figuras

        for(let f of this.figuras){

            this.dibujarFigura(f);

        }

    }

}