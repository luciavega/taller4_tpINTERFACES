class Caducidad {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "pasado";
        this.figuras = [];
        this.ultimoTiempo = millis();
        this.tiempoInicio = millis();
        this.reinicioPendiente = false;
        this.tiempoReinicioInicio = 0;
        this.crearFiguras();
    }

    crearFiguras() {
        const centroX = this.w * 0.5;
        const centroY = this.h * 0.52;

        const disposicion = [
            { tipo: "triangulo", x: 0.24, y: 0.34, tam: 42, margen: 10 },
            { tipo: "cuadrado", x: 0.38, y: 0.24, tam: 34, margen: 12 },
            { tipo: "circulo", x: 0.46, y: 0.42, tam: 48, margen: 8 },
            { tipo: "cuadrado", x: 0.56, y: 0.30, tam: 32, margen: 14 },
            { tipo: "triangulo", x: 0.72, y: 0.38, tam: 41, margen: 22 },
            { tipo: "circulo", x: 0.34, y: 0.58, tam: 44, margen: 10 },
            { tipo: "triangulo", x: 0.50, y: 0.64, tam: 40, margen: 6 },
            { tipo: "cuadrado", x: 0.65, y: 0.60, tam: 36, margen: 12 },
            { tipo: "triangulo", x: 0.42, y: 0.76, tam: 35, margen: 10 },
            { tipo: "circulo", x: 0.28, y: 0.80, tam: 42, margen: 18 },
            { tipo: "cuadrado", x: 0.60, y: 0.80, tam: 33, margen: 12 },
            { tipo: "circulo", x: 0.74, y: 0.72, tam: 38, margen: 24 }
        ];

        this.figuras = disposicion.map((base, index) => {
            const offsetX = random(-base.margen, base.margen);
            const offsetY = random(-base.margen * 0.8, base.margen * 0.8);
            const baseTam = base.tam + random(-4, 6);
            const tipoVisual = base.tipo === "circulo" ? "C" : base.tipo === "cuadrado" ? "Q" : "T";
            const x = centroX + (base.x - 0.5) * (this.w * 0.8) + offsetX;
            const y = centroY + (base.y - 0.5) * (this.h * 0.7) + offsetY;

            return {
                tipo: base.tipo,
                tipoVisual,
                x,
                y,
                tam: baseTam,
                escala: 1,
                deterioro: 0,
                opacidad: 255,
                activada: false,
                retardada: 0,
                marchitando: false,
                propagada: false,
                link: null
            };
        });
    }

    activarCaducidad(fig, retraso = 0) {
        if (!fig || fig.activada || fig.marchitando) return;

        fig.activada = true;
        fig.marchitando = false;
        fig.retardada = retraso;
        fig.propagada = false;
        fig.link = null;
    }

    propagarCaducidad(figura) {
        if (!figura || figura.propagada) return;

        figura.propagada = true;

        for (const vecino of this.figuras) {
            if (vecino === figura || vecino.activada || vecino.marchitando) continue;

            const distancia = dist(figura.x, figura.y, vecino.x, vecino.y);
            const umbral = max(80, (figura.tam + vecino.tam) * 0.8);

            if (distancia <= umbral) {
                const retraso = distancia * 12 + random(35, 115);
                this.activarCaducidad(vecino, retraso);
            }
        }
    }

    figuraFueTocada(f, mx, my) {
        const radio = (f.tam * f.escala) / 2;
        const d = dist(mx, my, f.x, f.y);

        if (f.tipo === "circulo") {
            return d <= radio * 1.05;
        }
        return d <= radio * 1.12;
    }

    mousePressed() {
        const mx = mouseX - this.x;
        const my = mouseY - this.y;

        if (mx < 0 || mx > this.w || my < 0 || my > this.h) return;

        for (const f of this.figuras) {
            if (this.figuraFueTocada(f, mx, my)) {
                this.activarCaducidad(f, 0);
                return;
            }
        }
    }

    todasLasFigurasCaducadas() {
        if (this.figuras.length === 0) return false;

        return this.figuras.every(f => {
            const terminada = !f.activada && !f.marchitando && f.opacidad <= 2 && f.escala <= 0.30;
            return terminada;
        });
    }

    update() {
        const ahora = millis();
        const delta = ahora - this.ultimoTiempo;
        this.ultimoTiempo = ahora;

        if (this.reinicioPendiente) {
            if (ahora - this.tiempoReinicioInicio >= 2000) {
                this.reinicioPendiente = false;
                this.tiempoReinicioInicio = 0;
                this.crearFiguras();
            }
            return;
        }

        if (this.todasLasFigurasCaducadas()) {
            this.reinicioPendiente = true;
            this.tiempoReinicioInicio = ahora;
            return;
        }

        for (const f of this.figuras) {
            if (!f.activada) continue;

            if (!f.marchitando) {
                f.retardada -= delta;
                if (f.retardada <= 0) {
                    f.marchitando = true;
                }
                continue;
            }

            f.deterioro = min(1, f.deterioro + 0.013 * (delta / 16.7));
            f.escala = max(0.22, f.escala - 0.005 * (delta / 16.7));
            f.opacidad = max(0, f.opacidad - 0.85 * (delta / 16.7));

            if (f.deterioro > 0.12 && !f.propagada) {
                this.propagarCaducidad(f);
            }

            if (f.opacidad <= 0 || f.escala <= 0.22) {
                f.activada = false;
                f.marchitando = false;
                f.propagada = false;
                f.opacidad = 0;
            }
        }
    }

    draw(actualizar = true) {
        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        translate(this.x, this.y);

        noStroke();
        rectMode(CORNER);
        fill(34, 34, 34);
        rect(0, 0, this.w, this.h);

        for (let f of this.figuras) {
            push();
            translate(f.x, f.y);
            scale(f.escala * 1.3);

            drawingContext.save();
            drawingContext.globalAlpha = map(f.opacidad, 0, 255, 0, 1);
            EfectoVisualGlobal.dibujar(f, f.tipoVisual, f.tam);
            drawingContext.restore();
            pop();
        }

        drawingContext.restore();
        drawingContext.globalAlpha = 1.0;
        pop();
    }
}