class Herencia {

    constructor(x,y,w,h){

    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;

    this.estado = 0;
    this.frameInicio = 0;

    this.movimiento = false;

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
 padre:true
},

            {
 tipo:"circulo",
 x:0.33,
 y:0.46,
 tam:60,
 c:rosa,
 visible:false,
 alpha:0,
 escala:0,
 hijo:true
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
 hijo:true
},
// cuadrados superiores
{
    tipo:"cuadrado",
    x:0.22,
    y:0.10,
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
    y:0.10,
    tam:36,
    c:violeta,
    visible:false,
    alpha:0,
    escala:0,
    delay:55
},

// cuadrados hijos del círculo izquierdo
{
    tipo:"cuadrado",
    x:0.25,
    y:0.18,
    tam:36,
    c:violeta,
    visible:false,
    alpha:0,
    escala:0,
    nieto:true
},

{
    tipo:"cuadrado",
    x:0.41,
    y:0.18,
    tam:36,
    c:violeta,
    visible:false,
    alpha:0,
    escala:0,
    nieto:true
},

// cuadrados hijos del círculo derecho
{
    tipo:"cuadrado",
    x:0.59,
    y:0.18,
    tam:36,
    c:violeta,
    visible:false,
    alpha:0,
    escala:0,
    nieto:true
},

{
    tipo:"cuadrado",
    x:0.75,
    y:0.18,
    tam:36,
    c:violeta,
    visible:false,
    alpha:0,
    escala:0,
    nieto:true
},
        ];

    }

update(){

    let padre=this.figuras[0];

    let px=this.x+padre.x*this.w;
    let py=this.y+padre.y*this.h;


    // latido del triangulo siempre
    padre.escala = 1 + sin(frameCount*0.08)*0.05;


    // click triangulo
    if(mouseIsPressed &&
       dist(mouseX,mouseY,px,py)<60){


        if(this.estado==0){

            this.estado=1;
            this.frameInicio=frameCount;

        }

        else if(this.estado==2){

            this.movimiento=true;

        }

    }


    // aparecen circulos

    if(this.estado==1){

        for(let f of this.figuras){

            if(f.hijo){

                f.visible=true;

                f.alpha=lerp(f.alpha,255,0.08);
                f.escala=lerp(f.escala,1,0.08);


                // latido círculos
                f.escala = 1 + sin(frameCount*0.08)*0.04;

            }

        }


        // esperar click en circulos
        for(let f of this.figuras){

            if(f.hijo){

                let fx=this.x+f.x*this.w;
                let fy=this.y+f.y*this.h;


                if(mouseIsPressed &&
                   dist(mouseX,mouseY,fx,fy)<40){

                    this.estado=2;

                }

            }

        }

    }



    // aparecen cuadrados

    if(this.estado==2){

        for(let f of this.figuras){

            if(f.nieto){

                f.visible=true;

                f.alpha=lerp(f.alpha,255,0.08);
                f.escala=lerp(f.escala,1,0.08);

            }

        }

    }


}

    dibujarFigura(f){

        let px=this.x+f.x*this.w;
        let py=this.y+f.y*this.h;

       let moverX=0;
let moverY=0;


if(this.movimiento){

    let movimientoPadre = sin(frameCount*0.03)*20;


    moverX = movimientoPadre;
    moverY = cos(frameCount*0.03)*10;

}

        push();

       translate(px+moverX, py+moverY);

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