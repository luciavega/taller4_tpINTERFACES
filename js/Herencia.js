class Herencia {

    constructor(x,y,w,h){

    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;

    this.estado = 0;
    this.frameInicio = 0;

    this.movimiento = false;
    this.clickAnterior = false;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.desplazamientoX = 0;
    this.desplazamientoY = 0;
    this.followX = 0;
    this.followY = 0;
    this.tiempoInactividad = null;

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

reset(){

    this.estado = 0;
    this.dragging = false;
    this.movimiento = false;
    this.clickAnterior = false;
    this.desplazamientoX = 0;
    this.desplazamientoY = 0;
    this.followX = 0;
    this.followY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.tiempoInactividad = null;

    for(let f of this.figuras){

        if(f.padre){
            f.visible = true;
            f.alpha = 255;
            f.escala = 1;
        }
        else if(f.hijo){
            f.visible = false;
            f.alpha = 0;
            f.escala = 0;
            f.followX = 0;
            f.followY = 0;
        }
        else if(f.nieto){
            f.visible = false;
            f.alpha = 0;
            f.escala = 0;
            f.followX = 0;
            f.followY = 0;
        }

    }

}

update(){

    const dentro = mouseX >= this.x &&
        mouseX <= this.x + this.w &&
        mouseY >= this.y &&
        mouseY <= this.y + this.h;

    let padre=this.figuras[0];

    let px=this.x+padre.x*this.w;
    let py=this.y+padre.y*this.h;

    let clickActual = mouseIsPressed;

    if(this.estado==0){

        padre.escala = 1 + sin(frameCount*0.08)*0.05;

        if(!this.clickAnterior && clickActual && dentro){

            if(dist(mouseX,mouseY,px,py)<60){
                this.estado=1;
                this.frameInicio=frameCount;
            }

        }

    }

    if(this.estado==1){

        padre.escala = 1;

        for(let f of this.figuras){

            if(f.hijo){

                f.visible=true;

                f.alpha=lerp(f.alpha,255,0.08);
                f.escala=lerp(f.escala,1,0.08);
                f.escala = 1 + sin(frameCount*0.08)*0.04;

            }

        }

        if(!this.clickAnterior && clickActual && dentro){

            for(let f of this.figuras){

                if(f.hijo){

                    let fx=this.x+f.x*this.w;
                    let fy=this.y+f.y*this.h;

                    if(dist(mouseX,mouseY,fx,fy)<40){
                        this.estado=2;
                        break;
                    }

                }

            }

        }

    }

    if(this.estado==2){

        padre.escala = 1 + sin(frameCount*0.08)*0.05;

        for(let f of this.figuras){

            if(f.nieto){

                f.visible=true;

                f.alpha=lerp(f.alpha,255,0.08);
                f.escala=lerp(f.escala,1,0.08);

            }

        }

        if(!this.clickAnterior && clickActual && dentro && dist(mouseX,mouseY,px,py)<60){
            this.estado=3;
            this.dragging = true;
            this.offsetX = mouseX - px;
            this.offsetY = mouseY - py;
            this.desplazamientoX = 0;
            this.desplazamientoY = 0;
        }

    }

    if(this.estado==3){

        if(this.dragging && mouseIsPressed && dentro){

            this.desplazamientoX = mouseX - px - this.offsetX;
            this.desplazamientoY = mouseY - py - this.offsetY;
            this.tiempoInactividad = null;

        }
        else if(this.dragging){

            this.desplazamientoX = lerp(this.desplazamientoX,0,0.12);
            this.desplazamientoY = lerp(this.desplazamientoY,0,0.12);

        }

        if(!mouseIsPressed){
            this.dragging = false;
        }

        if(this.dragging){
            this.tiempoInactividad = null;
        }
        else if(this.tiempoInactividad === null){
            this.tiempoInactividad = millis();
        }
        else if(millis() - this.tiempoInactividad >= 2000){
            this.reset();
        }

        this.followX = lerp(this.followX, this.desplazamientoX, 0.18);
        this.followY = lerp(this.followY, this.desplazamientoY, 0.18);

        for(let f of this.figuras){

            if(f.hijo){
                f.followX = lerp(f.followX || 0, this.followX, 0.13);
                f.followY = lerp(f.followY || 0, this.followY, 0.13);
            }

            if(f.nieto){
                f.followX = lerp(f.followX || 0, this.followX, 0.09);
                f.followY = lerp(f.followY || 0, this.followY, 0.09);
            }

        }

        padre.escala = 1;

    }

    this.clickAnterior = clickActual;

}

    dibujarFigura(f){

        let px=this.x+f.x*this.w;
        let py=this.y+f.y*this.h;

        let moverX=0;
        let moverY=0;

        if(this.estado==3 && this.dragging){
            if(f.padre){
                moverX=this.followX;
                moverY=this.followY;
            }
            else if(f.hijo){
                moverX=f.followX;
                moverY=f.followY;
            }
            else if(f.nieto){
                moverX=f.followX;
                moverY=f.followY;
            }
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

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

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

        drawingContext.restore();
        pop();

    }

}