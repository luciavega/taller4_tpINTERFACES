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
        const violeta = color(180,0,255);
        const rosa    = color(255,0,120);
        const azul    = color(20,110,255);

        // Distribución centrada y con aire alrededor de cada figura.
        // Todo está calculado en relación al tamaño del recuadro.
        const cx = this.w / 2;
        const cy = this.h / 2;

        const izquierda = this.w * 0.30;
        const izquierdaCerca = this.w * 0.43;
        const derechaCerca = this.w * 0.57;
        const derecha = this.w * 0.70;

        const arriba = this.h * 0.27;
        const medio = this.h * 0.50;
        const abajo = this.h * 0.73;

        this.figuras = [
            // Fila superior: cuatro figuras, separadas del borde y de la línea.
            { tipo:"triangulo", x:izquierda,      y:arriba, tam:38, escala:1, deterioro:0, opacidad:255, colorOriginal:azul },
            { tipo:"cuadrado",  x:izquierdaCerca, y:arriba, tam:30, escala:1, deterioro:0, opacidad:255, colorOriginal:violeta },
            { tipo:"cuadrado",  x:derechaCerca,   y:arriba, tam:30, escala:1, deterioro:0, opacidad:255, colorOriginal:violeta },
            { tipo:"triangulo", x:derecha,        y:arriba, tam:38, escala:1, deterioro:0, opacidad:255, colorOriginal:azul },

            // Centro: dos círculos, uno a cada lado de la línea.
            { tipo:"circulo", x:izquierdaCerca, y:medio, tam:46, escala:1, deterioro:0, opacidad:255, colorOriginal:rosa },
            { tipo:"circulo", x:derechaCerca,   y:medio, tam:46, escala:1, deterioro:0, opacidad:255, colorOriginal:rosa },

            // Fila inferior: cuatro figuras.
            { tipo:"triangulo", x:izquierda,      y:abajo, tam:38, escala:1, deterioro:0, opacidad:255, colorOriginal:azul },
            { tipo:"cuadrado",  x:izquierdaCerca, y:abajo, tam:30, escala:1, deterioro:0, opacidad:255, colorOriginal:violeta },
            { tipo:"cuadrado",  x:derechaCerca,   y:abajo, tam:30, escala:1, deterioro:0, opacidad:255, colorOriginal:violeta },
            { tipo:"triangulo", x:derecha,        y:abajo, tam:38, escala:1, deterioro:0, opacidad:255, colorOriginal:azul }
        ];
    }

    // Este método es llamado desde sketch.js cuando se hace un click.
    // SOLO se modifica la figura que recibió el click.
    mousePressed(){
        const mx = mouseX - this.x;
        const my = mouseY - this.y;

        // Si el click no fue dentro de este recuadro, no hacemos nada.
        if(mx < 0 || mx > this.w || my < 0 || my > this.h) return;

        for(let f of this.figuras){
            if(this.figuraFueTocada(f, mx, my)){
                // El deterioro es permanente: nunca vuelve hacia 0.
                f.deterioro = min(1, f.deterioro + 0.18);

                // Cada toque la hace un poco más pequeña.
                f.escala = max(0.62, f.escala - 0.065);

                // Y también la desvanece.
                f.opacidad = max(25, f.opacidad - 38);

                // Solo una figura por click.
                return;
            }
        }
    }

    figuraFueTocada(f, mx, my){
        // Calculamos el área de la figura teniendo en cuenta su escala.
        const radio = (f.tam * f.escala) / 2;
        const d = dist(mx, my, f.x, f.y);

        if(f.tipo === "circulo"){
            return d <= radio;
        }

        // Para cuadrados y triángulos usamos un área de toque ligeramente
        // más cómoda, sin hacer que una figura pueda robar el click de otra.
        return d <= radio * 1.05;
    }

    update(){
        // La caducidad NO depende del movimiento del mouse.
        // No hay nada que resetear: el deterioro queda guardado.
    }

    draw(){
        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        translate(this.x, this.y);

        // Fondo del recuadro
        noStroke();
        rectMode(CORNER);
        fill(235);
        rect(0, 0, this.w, this.h);

        // Línea central. No se modifica al tocar una figura: la interacción
        // es individual para cada objeto.
        stroke(255,140,0);
        strokeWeight(4);
        line(this.w/2, this.h*0.20, this.w/2, this.h*0.80);

        const sepia = color(140,115,80);

        for(let f of this.figuras){
            // Transición permanente del color original al sepia.
            const c = lerpColor(f.colorOriginal, sepia, f.deterioro);

            fill(red(c), green(c), blue(c), f.opacidad);
            noStroke();

            push();
            translate(f.x, f.y);
            scale(f.escala);

            if(f.tipo === "cuadrado"){
                rectMode(CENTER);
                square(0, 0, f.tam);
            }

            if(f.tipo === "circulo"){
                circle(0, 0, f.tam);
            }

            if(f.tipo === "triangulo"){
                triangle(
                    0, -f.tam/2,
                    -f.tam/2, f.tam/2,
                    f.tam/2, f.tam/2
                );
            }

            pop();
        }

        drawingContext.restore();
        pop();
    }
}
