class Empatia {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.figuraArrastrada = null;
        this.crearComposicion();
    }

    crearComposicion() {
        let rosa = color(255, 0, 120);
        let azul = color(40, 120, 255);

        // Se mapean los tipos a "C" y "T" para que coincidan con las claves de EfectoVisualGlobal
        this.figuras = [
            { id: 0, tipo: "C", grupo: "circulos", x: 0.20, y: 0.35, tam: 55, c: rosa, sync: 0, offsetFase: 0 },
            { id: 1, tipo: "C", grupo: "circulos", x: 0.30, y: 0.65, tam: 55, c: rosa, sync: 0, offsetFase: 2 },
            { id: 2, tipo: "C", grupo: "circulos", x: 0.15, y: 0.50, tam: 55, c: rosa, sync: 0, offsetFase: 4 },
            
            { id: 3, tipo: "T", grupo: "triangulos", x: 0.75, y: 0.35, tam: 60, c: azul, sync: 0, offsetFase: 0 },
            { id: 4, tipo: "T", grupo: "triangulos", x: 0.85, y: 0.50, tam: 60, c: azul, sync: 0, offsetFase: 2.5 },
            { id: 5, tipo: "T", grupo: "triangulos", x: 0.70, y: 0.65, tam: 60, c: azul, sync: 0, offsetFase: 5 }
        ];
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

        for (let f of this.figuras) {
            const umbral = 0.5;
            const margen = 0.03;
            let targetSync = 0;

            if (f.grupo === "circulos" && f.x > umbral + margen) {
                targetSync = 1;
            } else if (f.grupo === "triangulos" && f.x < umbral - margen) {
                targetSync = 1;
            }

            f.sync = lerp(f.sync, targetSync, 0.08);
        }
    }

    dibujarFigura(f) {
        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        let patronCirculoX = sin(frameCount * 0.05 + f.offsetFase) * 18;
        let patronCirculoY = 0;

        let patronTrianguloX = 0;
        let patronTrianguloY = sin(frameCount * 0.05 + f.offsetFase) * 18;

        let despX = 0;
        let despY = 0;

        if (f.grupo === "circulos") {
            despX = lerp(patronCirculoX, patronTrianguloX, f.sync);
            despY = lerp(patronCirculoY, patronTrianguloY, f.sync);
        } else {
            despX = lerp(patronTrianguloX, patronCirculoX, f.sync);
            despY = lerp(patronTrianguloY, patronCirculoY, f.sync);
        }

        push();
        translate(px + despX, py + despY);
        noStroke();

        // Aplicar la representación visual desde EfectoVisualGlobal
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