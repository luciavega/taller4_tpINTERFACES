class Herencia {

    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.activado = false;
        this.frameInicio = 0;

        this.crearComposicion();

    }

    crearComposicion() {

        let rosa = color(255, 0, 120);
        let azul = color(40, 120, 255);
        let violeta = color(180, 0, 255);
        let naranja = color(255, 140, 0);

        this.figuras = [

            // figura "padre" ??
            {
                tipo:"triangulo",
                x:0.50,
                y:0.68,
                tam:85,
                c:azul,
                visible:true,
                alpha:255,
                escala:1,
                delay:0
            },

            // figuras hijas(?)
            {
                tipo:"circulo",
                x:0.33,
                y:0.46,
                tam:60,
                c:rosa,
                visible:false,
                alpha:0,
                escala:0,
                delay:25
            },

            {
                tipo:"circulo",
                x:0.67,
                y:0.46,
                tam:60,
                c:rosa,
                visible:false,
                alpha:0,
                escala:0,
                delay:25
            },

            // figuras hijas x2 
            {
                tipo:"cuadrado",
                x:0.22,
                y:0.18,
                tam:36,
                c:violeta,
                visible:false,
                alpha:0,
                escala:0,
                delay:55
            },

            {
                tipo:"cuadrado",
                x:0.38,
                y:0.18,
                tam:36,
                c:violeta,
                visible:false,
                alpha:0,
                escala:0,
                delay:55
            },

            {
                tipo:"cuadrado",
                x:0.62,
                y:0.18,
                tam:36,
                c:violeta,
                visible:false,
                alpha:0,
                escala:0,
                delay:55
            },

            {
                tipo:"cuadrado",
                x:0.78,
                y:0.18,
                tam:36,
                c:violeta,
                visible:false,
                alpha:0,
                escala:0,
                delay:55
            },

            {
                tipo:"linea",
                x:0.50,
                y:0.27,
                tam:70,
                c:naranja,
                visible:true,
                alpha:255,
                escala:1
            },

            {
                tipo:"linea",
                x:0.50,
                y:0.90,
                tam:40,
                c:naranja,
                visible:true,
                alpha:255,
                escala:1
            }

        ];

    }

    update(){

        let padre = this.figuras[0];

        let px = this.x + padre.x * this.w;
        let py = this.y + padre.y * this.h;

        if(mouseIsPressed &&
           dist(mouseX,mouseY,px,py)<60 &&
           !this.activado){

            this.activado = true;
            this.frameInicio = frameCount;

        }

        if(this.activado){

            for(let f of this.figuras){

                if(!f.visible){

                    if(frameCount - this.frameInicio > f.delay){

                        f.visible = true;

                    }

                }

                if(f.visible){

                    f.alpha = lerp(f.alpha,255,0.08);
                    f.escala = lerp(f.escala,1,0.08);

                }

            }

        }

    }

    dibujarFigura(f){

        let px=this.x+f.x*this.w;
        let py=this.y+f.y*this.h;

        let mover=0;

        if(this.activado){

            mover=sin(frameCount*0.03)*6;

        }

        push();

        translate(px+mover,py);

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

        noStroke();
        fill(240);

        rect(
            this.x,
            this.y,
            this.w,
            this.h
        );

        for(let f of this.figuras){

            if(f.visible){

                this.dibujarFigura(f);

            }

        }

    }

}