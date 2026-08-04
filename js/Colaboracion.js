class Colaboracion {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.figuraArrastrada = null;
        this.progresoAtraccion = 0;
        this.crearComposicion();
    }

    crearComposicion() {
        this.figuras = [];
        
        let posicionesFinales = [
            { targetX: 0.50, targetY: 0.50, tipo: "circulo" },
            { targetX: 0.38, targetY: 0.38, tipo: "cuadrado" },
            { targetX: 0.62, targetY: 0.38, tipo: "cuadrado" },
            { targetX: 0.38, targetY: 0.62, tipo: "cuadrado" },
            { targetX: 0.62, targetY: 0.62, tipo: "cuadrado" }
        ];

        // Offsets (en coordenadas normalizadas) para los 4 cuadrados alrededor del círculo
        this.offsetsByIndex = {
            1: { dx: -0.12, dy: -0.12 },
            2: { dx:  0.12, dy: -0.12 },
            3: { dx: -0.12, dy:  0.12 },
            4: { dx:  0.12, dy:  0.12 }
        };

        for (let i = 0; i < 5; i++) {
            let xRandom = random(0.15, 0.85);
            let yRandom = random(0.20, 0.80);

            this.figuras.push({
                x: xRandom,
                y: yRandom,
                origenX: xRandom,
                origenY: yRandom,
                targetX: posicionesFinales[i].targetX,
                targetY: posicionesFinales[i].targetY,
                tipo: posicionesFinales[i].tipo,
                index: i,
                tam: 42,
                fase: random(TWO_PI)
            });
        }
    }

    update() {
        const dentro = mouseX >= this.x &&
            mouseX <= this.x + this.w &&
            mouseY >= this.y &&
            mouseY <= this.y + this.h;

        if (dentro && mouseIsPressed) {
            if (!this.figuraArrastrada) {
                for (let f of this.figuras) {
                    let fx = this.x + f.x * this.w;
                    let fy = this.y + f.y * this.h;
                    if (dist(mouseX, mouseY, fx, fy) < f.tam / 2) {
                        this.figuraArrastrada = f;
                        break;
                    }
                }
            }
            if (this.figuraArrastrada) {
                let nuevoX = constrain(mouseX, this.x, this.x + this.w);
                let nuevoY = constrain(mouseY, this.y, this.y + this.h);
                this.figuraArrastrada.x = (nuevoX - this.x) / this.w;
                this.figuraArrastrada.y = (nuevoY - this.y) / this.h;
            }
        } else {
            this.figuraArrastrada = null;
        }

        let targetAtraccion = this.figuraArrastrada ? 1.0 : 0.0;
        this.progresoAtraccion = lerp(this.progresoAtraccion, targetAtraccion, 0.05);

        // Recalcular objetivos de los cuadrados alrededor del círculo actual
        let circulo = this.figuras.find(ff => ff.tipo === "circulo");
        if (circulo) {
            for (let ff of this.figuras) {
                if (ff.tipo === "cuadrado") {
                    let off = this.offsetsByIndex[ff.index];
                    if (off) {
                        ff.targetX = constrain(circulo.x + off.dx, 0, 1);
                        ff.targetY = constrain(circulo.y + off.dy, 0, 1);
                    }
                }
            }
        }

        for (let f of this.figuras) {
            if (f === this.figuraArrastrada) {
                f.origenX = f.x;
                f.origenY = f.y;
                continue;
            }

            let destinoX = lerp(f.origenX, f.targetX, this.progresoAtraccion);
            let destinoY = lerp(f.origenY, f.targetY, this.progresoAtraccion);

            f.x = lerp(f.x, destinoX, 0.08);
            f.y = lerp(f.y, destinoY, 0.08);
        }
    }

    dibujarFigura(f) {
        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        let cRosa = color(255, 0, 120);
        let cVioleta = color(180, 0, 255);

        let flotar = (1 - this.progresoAtraccion) * 2;
        let offsetReposoX = sin(frameCount * 0.03 + f.fase) * flotar;
        let offsetReposoY = cos(frameCount * 0.025 + f.fase) * flotar;

        push();
        translate(px + offsetReposoX, py + offsetReposoY);
        noStroke();

        if (f.tipo === "circulo") {
            let brillo = map(sin(frameCount * 0.1 + f.fase), -1, 1, 210, 255);
            fill(255, 0, 120, brillo);
            let tamCirculo = f.tam + sin(frameCount * 0.08 + f.fase) * 1.8;
            circle(0, 0, tamCirculo);
        } else if (f.tipo === "cuadrado") {
            fill(cVioleta);
            rectMode(CENTER);
            square(0, 0, f.tam);
        }
        pop();
    }

    draw() {
        this.update();

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        noStroke();
        fill(245);
        rect(this.x, this.y, this.w, this.h);

        for (let f of this.figuras) {
            this.dibujarFigura(f);
        }

        drawingContext.restore();
        pop();
    }
}
