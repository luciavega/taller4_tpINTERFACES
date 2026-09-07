class Memoria {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "pasado";

        this.figuras = [];
        this.crearComposicion();
    }

    crearComposicion() {
        let tiempoInicial = millis(); // Marca el inicio exacto para todas las figuras

        this.figuras = [
            { tipo: "C", tam: 36 },
            { tipo: "C", tam: 40 },
            { tipo: "C", tam: 44 },
            { tipo: "C", tam: 48 },
            { tipo: "Q", tam: 34 },
            { tipo: "Q", tam: 38 },
            { tipo: "Q", tam: 42 },
            { tipo: "Q", tam: 46 },
            { tipo: "T", tam: 35 },
            { tipo: "T", tam: 39 },
            { tipo: "T", tam: 43 },
            { tipo: "T", tam: 47 }
        ];

        this.distribuirFiguras();

        for (let f of this.figuras) {
            f.alpha = 255;          // Empiezan totalmente visibles
            f.escala = 1.2;
            f.escalaToque = 1.2;
            f.escalaObjetivo = 1.2;
            f.ultimoClick = tiempoInicial; // Temporizador iniciado al crear
        }
    }

    distribuirFiguras() {
        const margen = 30;
        const separacion = 12;
        const escalaMaxima = 1.3 * 1.2 * 1.05;
        const radioMaximo = max(...this.figuras.map(f => f.tam * escalaMaxima / 2));
        const areaX = max(0, min(this.w / 2 - radioMaximo - margen, this.w * 0.38));
        const areaY = max(0, min(this.h / 2 - radioMaximo - margen, this.h * 0.38));
        const posiciones = [];

        for (let f of this.figuras) {
            const radioFigura = f.tam * escalaMaxima / 2;
            let posicion = null;

            let intento = 0;
            while (!posicion) {
                const factor = min(1, 0.72 + intento / 2000 * 0.28);
                const angulo = random(TWO_PI);
                const distancia = sqrt(random()) * factor;
                const candidato = {
                    x: this.w / 2 + cos(angulo) * distancia * areaX,
                    y: this.h / 2 + sin(angulo) * distancia * areaY
                };
                const despejado = posiciones.every(otra => {
                    const otraRadio = otra.tam * escalaMaxima / 2;
                    const distanciaMinima = radioFigura + otraRadio + separacion;
                    return dist(
                        candidato.x,
                        candidato.y,
                        otra.x * this.w,
                        otra.y * this.h
                    ) >= distanciaMinima;
                });

                if (despejado) {
                    posicion = candidato;
                }

                intento++;
            }

            f.x = posicion.x / this.w;
            f.y = posicion.y / this.h;
            posiciones.push(f);
        }
    }

    update() {
        let tiempoEspera = 3000; // 3 segundos antes de empezar a desvanecerse

        for (let f of this.figuras) {
            // Si pasaron más de 1000 ms desde el último clic (o desde que arrancó el sketch)
            if (millis() - f.ultimoClick > tiempoEspera) {
                // Desvanecimiento suave
                f.alpha = lerp(f.alpha, 20, 0.025);
                f.escalaObjetivo = lerp(f.escalaObjetivo, 1, 0.025);
            }

            f.escalaToque = lerp(f.escalaToque, f.escalaObjetivo, 0.12);

            // ===== LATIDO =====
            let pulso = (sin(frameCount * 0.05) + 1) / 2;
            f.escala = (1 + pulso * 0.05) * f.escalaToque;
        }
    }

    mousePressed() {
        const dentro = mouseX >= this.x &&
            mouseX <= this.x + this.w &&
            mouseY >= this.y &&
            mouseY <= this.y + this.h;

        if (!dentro) return;

        for (let f of this.figuras) {
            let px = this.x + f.x * this.w;
            let py = this.y + f.y * this.h;

            let d = dist(mouseX, mouseY, px, py);

            if (d < f.tam * 0.7) {
                // Reinicia el temporizador al momento exacto del clic
                f.ultimoClick = millis();

                // Recupera la opacidad al tocarla
                f.alpha += 100;
                f.alpha = constrain(f.alpha, 20, 255);

                // Acumula un aumento suave hasta la escala máxima
                f.escalaObjetivo = constrain(f.escalaObjetivo + 0.05, 1, 1.2);
            }
        }
    }

    dibujarFigura(f) {
        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        push();
        translate(px, py);
        scale(f.escala * 1.3);

        // Control de opacidad mediante canvas context
        drawingContext.globalAlpha = map(f.alpha, 0, 255, 0, 1);

        EfectoVisualGlobal.dibujar(f, f.tipo, f.tam);

        pop();
    }

    draw(actualizar = true) {
        if (actualizar) this.update();
        EfectoVisualGlobal.grupoActual = this.grupo;

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        // Fondo
        noStroke();
        fill(34, 34, 34);
        rect(this.x, this.y, this.w, this.h);

        const interaccionActiva = mouseIsPressed &&
            mouseX >= this.x && mouseX <= this.x + this.w &&
            mouseY >= this.y && mouseY <= this.y + this.h;
        if (interaccionActiva) {
            drawingContext.save();
            drawingContext.globalAlpha = 0.24;
            stroke(234, 139, 47, 125);
            strokeWeight(1.2);
            for (let indice = 0; indice < 90; indice++) {
                const px = this.x + ((indice * 137 + frameCount * 0.7) % this.w);
                const py = this.y + ((indice * 79 + frameCount * 0.35) % this.h);
                line(px, py, px + 18, py - 12);
            }
            drawingContext.restore();
        }

        // Figuras
        for (let f of this.figuras) {
            this.dibujarFigura(f);
        }

        drawingContext.restore();
        pop();
    }
}