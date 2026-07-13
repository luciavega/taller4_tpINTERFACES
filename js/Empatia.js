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

        this.figuras = [
            { id: 0, tipo: "circulo", grupo: "circulos", x: 0.20, y: 0.35, tam: 55, c: rosa, sync: 0, offsetFase: 0 },
            { id: 1, tipo: "circulo", grupo: "circulos", x: 0.30, y: 0.65, tam: 55, c: rosa, sync: 0, offsetFase: 2 },
            { id: 2, tipo: "circulo", grupo: "circulos", x: 0.15, y: 0.50, tam: 55, c: rosa, sync: 0, offsetFase: 4 },
            
            { id: 3, tipo: "triangulo", grupo: "triangulos", x: 0.75, y: 0.35, tam: 60, c: azul, sync: 0, offsetFase: 0 },
            { id: 4, tipo: "triangulo", grupo: "triangulos", x: 0.85, y: 0.50, tam: 60, c: azul, sync: 0, offsetFase: 2.5 },
            { id: 5, tipo: "triangulo", grupo: "triangulos", x: 0.70, y: 0.65, tam: 60, c: azul, sync: 0, offsetFase: 5 }
        ];
    }

    update() {
        if (mouseIsPressed) {
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
            let fRealX = this.x + f.x * this.w;
            let fRealY = this.y + f.y * this.h;
            let cercaDeOpuesto = false;

            for (let otro of this.figuras) {
                if (f.grupo !== otro.grupo) {
                    let oRealX = this.x + otro.x * this.w;
                    let oRealY = this.y + otro.y * this.h;

                    if (dist(fRealX, fRealY, oRealX, oRealY) < 100) {
                        cercaDeOpuesto = true;
                        break;
                    }
                }
            }

            let targetSync = cercaDeOpuesto ? 1 : 0;
            f.sync = lerp(f.sync, targetSync, 0.07);
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
        fill(f.c);

        switch (f.tipo) {
            case "circulo":
                circle(0, 0, f.tam);
                break;

            case "triangulo":
                let h = f.tam * 0.86;
                triangle(0, -h / 2, -f.tam / 2, h / 2, f.tam / 2, h / 2);
                break;
        }
        pop();
    }

    draw() {
        this.update();

        noStroke();
        fill(245);
        rect(this.x, this.y, this.w, this.h);

        for (let f of this.figuras) {
            this.dibujarFigura(f);
        }
    }
}