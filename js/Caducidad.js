class Caducidad {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.figuras = [];
        this.crearFiguras();
    }

    crearFiguras() {
        // Paletas extraídas de EfectoVisualGlobal:

        // Verde y Amarillo (Paleta T) -> Triángulos
        const paletaVerdeAmarillo = [
            [255, 230, 30],
            [180, 240, 60],
            [80, 230, 180],
            [30, 190, 230]
        ];

        // Naranja y Amarillo (Paleta Q) -> Cuadrados
        const paletaNaranjaAmarillo = [
            [255, 30, 40],
            [255, 70, 20],
            [255, 150, 20],
            [255, 220, 40]
        ];

        // Azul y Rosa (Paleta C) -> Círculos
        const paletaAzulRosa = [
            [20, 50, 255],
            [80, 20, 255],
            [220, 20, 220],
            [255, 70, 150]
        ];

        const izquierda      = this.w * 0.30;
        const izquierdaCerca = this.w * 0.43;
        const derechaCerca   = this.w * 0.57;
        const derecha        = this.w * 0.70;

        const arriba = this.h * 0.27;
        const medio  = this.h * 0.50;
        const abajo  = this.h * 0.73;

        // Generamos puntos de grano estáticos para cada figura
        const generarGrano = (tam) => {
            const puntos = [];
            for (let i = 0; i < 180; i++) {
                puntos.push({
                    x: random(-tam / 2, tam / 2),
                    y: random(-tam / 2, tam / 2),
                    tam: random(1.0, 2.0),
                    opacidad: random(0.03, 0.08)
                });
            }
            return puntos;
        };

        this.figuras = [
            // Fila superior
            { tipo: "triangulo", x: izquierda,      y: arriba, tam: 38, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaVerdeAmarillo,  fase: random(TWO_PI), grano: generarGrano(38) },
            { tipo: "cuadrado",  x: izquierdaCerca, y: arriba, tam: 30, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaNaranjaAmarillo, fase: random(TWO_PI), grano: generarGrano(30) },
            { tipo: "cuadrado",  x: derechaCerca,   y: arriba, tam: 30, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaNaranjaAmarillo, fase: random(TWO_PI), grano: generarGrano(30) },
            { tipo: "triangulo", x: derecha,        y: arriba, tam: 38, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaVerdeAmarillo,  fase: random(TWO_PI), grano: generarGrano(38) },

            // Centro
            { tipo: "circulo", x: izquierdaCerca, y: medio, tam: 46, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaAzulRosa, fase: random(TWO_PI), grano: generarGrano(46) },
            { tipo: "circulo", x: derechaCerca,   y: medio, tam: 46, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaAzulRosa, fase: random(TWO_PI), grano: generarGrano(46) },

            // Fila inferior
            { tipo: "triangulo", x: izquierda,      y: abajo, tam: 38, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaVerdeAmarillo,  fase: random(TWO_PI), grano: generarGrano(38) },
            { tipo: "cuadrado",  x: izquierdaCerca, y: abajo, tam: 30, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaNaranjaAmarillo, fase: random(TWO_PI), grano: generarGrano(30) },
            { tipo: "cuadrado",  x: derechaCerca,   y: abajo, tam: 30, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaNaranjaAmarillo, fase: random(TWO_PI), grano: generarGrano(30) },
            { tipo: "triangulo", x: derecha,        y: abajo, tam: 38, escala: 1, deterioro: 0, opacidad: 255, paleta: paletaVerdeAmarillo,  fase: random(TWO_PI), grano: generarGrano(38) }
        ];
    }

    mousePressed() {
        const mx = mouseX - this.x;
        const my = mouseY - this.y;

        if (mx < 0 || mx > this.w || my < 0 || my > this.h) return;

        for (let f of this.figuras) {
            if (this.figuraFueTocada(f, mx, my)) {
                // El deterioro aumenta el tono amarronado permanentemente
                f.deterioro = min(1, f.deterioro + 0.20);
                f.escala = max(0.62, f.escala - 0.065);
                f.opacidad = max(25, f.opacidad - 38);
                return;
            }
        }
    }

    figuraFueTocada(f, mx, my) {
        const radio = (f.tam * f.escala) / 2;
        const d = dist(mx, my, f.x, f.y);

        if (f.tipo === "circulo") {
            return d <= radio;
        }
        return d <= radio * 1.05;
    }

    update() {
        // Mantiene la estructura limpia
    }

    // Dibuja la figura internamente con su propio gradiente y tono amarronado
    dibujarEfectoPropio(f) {
        const ctx = drawingContext;
        const tiempo = millis() * 0.0002 + f.fase;
        const tam = f.tam;

        // Movimiento sutil del gradiente interno
        const x1 = sin(tiempo) * tam * 0.5;
        const y1 = cos(tiempo) * tam * 0.5;
        const x2 = -x1;
        const y2 = -y1;

        const gradiente = ctx.createLinearGradient(x1, y1, x2, y2);

        // Definimos la mezcla de colores hacia tonos amarronados/sepia
        for (let i = 0; i < f.paleta.length; i++) {
            const base = f.paleta[i];
            
            // Paleta destino amarronada (Sepia/Café)
            const rMarron = 135 + (i * 15);
            const gMarron = 85 + (i * 10);
            const bMarron = 45 + (i * 5);

            // Interpolación directa
            const r = lerp(base[0], rMarron, f.deterioro);
            const g = lerp(base[1], gMarron, f.deterioro);
            const b = lerp(base[2], bMarron, f.deterioro);

            gradiente.addColorStop(i / (f.paleta.length - 1), `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`);
        }

        ctx.save();

        // 1. Crear Trazado de la forma
        ctx.beginPath();
        if (f.tipo === "cuadrado") {
            ctx.rect(-tam / 2, -tam / 2, tam, tam);
        } else if (f.tipo === "circulo") {
            ctx.arc(0, 0, tam / 2, 0, TWO_PI);
        } else if (f.tipo === "triangulo") {
            ctx.moveTo(0, -tam / 2);
            ctx.lineTo(tam / 2, tam / 2);
            ctx.lineTo(-tam / 2, tam / 2);
            ctx.closePath();
        }

        // 2. Rellenar con Gradiente
        ctx.fillStyle = gradiente;
        ctx.fill();

        // 3. Aplicar Textura Estática de Grano
        ctx.clip();
        ctx.fillStyle = "white";
        for (let p of f.grano) {
            ctx.globalAlpha = p.opacidad;
            ctx.fillRect(p.x, p.y, p.tam, p.tam);
        }

        ctx.restore();
    }

    draw() {
        push();

        // Delimitación segura de recuadro
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

        // Línea central
        stroke(255, 140, 0);
        strokeWeight(4);
        line(this.w / 2, this.h * 0.20, this.w / 2, this.h * 0.80);

        // Dibujar figuras de forma aislada
        for (let f of this.figuras) {
            push();
            translate(f.x, f.y);
            scale(f.escala);

            drawingContext.save();
            drawingContext.globalAlpha = map(f.opacidad, 0, 255, 0, 1);

            // Efecto visual propio autocontenido
            this.dibujarEfectoPropio(f);

            drawingContext.restore();
            pop();
        }

        // Restauración completa del lienzo
        drawingContext.restore();
        drawingContext.globalAlpha = 1.0;
        pop();
    }
}