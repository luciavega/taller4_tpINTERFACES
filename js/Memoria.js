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

            {tipo:"triangulo", x:0.40, y:0.23, tam:45, c:azul},
            {tipo:"triangulo", x:0.60, y:0.23, tam:45, c:azul},

            {tipo:"triangulo", x:0.28, y:0.47, tam:30, c:azul},
            {tipo:"triangulo", x:0.72, y:0.47, tam:30, c:azul},

            {tipo:"circulo", x:0.50, y:0.50, tam:60, c:rosa},
            {tipo:"circulo", x:0.38, y:0.50, tam:35, c:rosa},
            {tipo:"circulo", x:0.63, y:0.50, tam:35, c:rosa},

            {tipo:"cuadrado", x:0.28, y:0.67, tam:34, c:violeta},
            {tipo:"cuadrado", x:0.42, y:0.76, tam:40, c:violeta},
            {tipo:"cuadrado", x:0.58, y:0.76, tam:40, c:violeta},
            {tipo:"cuadrado", x:0.70, y:0.67, tam:34, c:violeta},

            {tipo:"linea", x:0.50, y:0.09, tam:50, c:naranja},
            {tipo:"linea", x:0.50, y:0.88, tam:50, c:naranja}

        ];

        // Variables de animación

        for(let f of this.figuras){

          f.alpha = 80;
        //  f.memoria = 8;

            f.escala=1;


        }

    }

   update(){

    for(let f of this.figuras){

        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        let d = dist(mouseX, mouseY, px, py);

        if(d <90){

            // Se revela completamente
            f.alpha = lerp(f.alpha, 255, 0.18);

            // Crece un poco
            f.escala = lerp(f.escala, 1.12, 0.12);

        }else{

            // Vuelve lentamente a casi desaparecer
         f.alpha = lerp(f.alpha, 20, 0.02);
            // Recupera tamaño normal
            f.escala = lerp(f.escala, 1, 0.08);

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