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
        let rosa = color(255, 0, 120);
        let azul = color(40, 120, 255);
        let violeta = color(180, 0, 255);

        let tiempoInicial = millis(); // Marca el inicio exacto para todas las figuras

        this.figuras = [
            // Círculos arriba
            { tipo: "C", x: 0.40, y: 0.25, tam: 50, c: rosa, color: rosa },
            { tipo: "C", x: 0.60, y: 0.25, tam: 50, c: rosa, color: rosa },

            // Triángulos
            { tipo: "T", x: 0.25, y: 0.50, tam: 45, c: azul, color: azul },
            { tipo: "T", x: 0.75, y: 0.50, tam: 45, c: azul, color: azul },

            // Cuadrados abajo
            { tipo: "Q", x: 0.40, y: 0.75, tam: 38, c: violeta, color: violeta },
            { tipo: "Q", x: 0.60, y: 0.75, tam: 38, c: violeta, color: violeta }
        ];

        for (let f of this.figuras) {
            f.alpha = 255;          // Empiezan totalmente visibles
            f.escala = 1;
            f.ultimoClick = tiempoInicial; // Temporizador iniciado al crear
        }
    }

    update() {
        let tiempoEspera = 1000; // 1 segundo antes de empezar a desvanecerse

        for (let f of this.figuras) {
            // Si pasaron más de 1000 ms desde el último clic (o desde que arrancó el sketch)
            if (millis() - f.ultimoClick > tiempoEspera) {
                // Desvanecimiento suave
                f.alpha = lerp(f.alpha, 20, 0.025);
            }

            // ===== LATIDO =====
            let pulso = (sin(frameCount * 0.05) + 1) / 2;
            f.escala = 1 + pulso * 0.05;
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
            }
        }
    }

    dibujarFigura(f) {
        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        push();
        translate(px, py);
        scale(f.escala);

        // Control de opacidad mediante canvas context
        drawingContext.globalAlpha = map(f.alpha, 0, 255, 0, 1);

        EfectoVisualGlobal.dibujar(f, f.tipo, f.tam);

        pop();
    }

    draw() {
        this.update();

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        // Fondo
        noStroke();
        fill(240);
        rect(this.x, this.y, this.w, this.h);

        // Figuras
        for (let f of this.figuras) {
            this.dibujarFigura(f);
        }

        drawingContext.restore();
        pop();
    }
}