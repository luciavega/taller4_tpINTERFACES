class Expectativa {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.progresoInteraccion = 0; 
        this.escalaFiguras = 1;     
        
        this.crearGrilla();
    }

    crearGrilla() {
        this.grillaLayout = [
            ["Q", "Q", "Q"],
            ["Q", "C", "C"],
            ["Q", "C", "Q"]
        ];

        this.figuras = [];
        let sep = 55; 

        for (let fila = 0; fila < 3; fila++) {
            for (let col = 0; col < 3; col++) {
                let posX = this.w / 2 + (col - 1) * sep;
                let posY = this.h / 2 + (fila - 1) * sep;

                this.figuras.push({
                    x: posX,
                    y: posY,
                    tipo: this.grillaLayout[fila][col],
                    tam: 36
                });
            }
        }
    }

    update() {
        if (mouseIsPressed) {
            this.progresoInteraccion = lerp(this.progresoInteraccion, 1.0, 0.04);
        } else {
            this.progresoInteraccion = lerp(this.progresoInteraccion, 0.0, 0.08);
        }

        this.factorEncaje = pow(this.progresoInteraccion, 5); 

        if (this.factorEncaje > 0.95) {
            this.escalaFiguras = lerp(this.escalaFiguras, 1.12, 0.2);
        } else {
            this.escalaFiguras = lerp(this.escalaFiguras, 1.0, 0.1);
        }
    }

    draw() {
        this.update();

        push();
        translate(this.x, this.y);
        
        noStroke();
        fill(245);
        rect(0, 0, this.w, this.h);

        // Paleta de colores segura
        let cRosa = color(255, 0, 120);
        let cVioleta = color(180, 0, 255);
        let cNaranja = color(255, 140, 0);

        for (let f of this.figuras) {
            push();
            translate(f.x, f.y);
            scale(this.escalaFiguras);
            noStroke();

            if (f.tipo === "Q") {
                fill(cVioleta);
                rectMode(CENTER);
                square(0, 0, f.tam);
            } else if (f.tipo === "C") {
                fill(cRosa);
                circle(0, 0, f.tam);
            }
            pop();
        }

        let margenEncaje = 85; 
        let centroX = this.w / 2;
        let centroY = this.h / 2;

        let desarmado = (1 - this.factorEncaje) * 35; 
        let desalineado = (1 - this.factorEncaje) * 15; 

        stroke(cNaranja);
        strokeWeight(3.5);
        noFill();

        line(
            centroX - margenEncaje + desalineado, 
            centroY - margenEncaje - desarmado, 
            centroX + margenEncaje + desalineado, 
            centroY - margenEncaje - desarmado
        );

        line(
            centroX - margenEncaje - desalineado, 
            centroY + margenEncaje + desarmado, 
            centroX + margenEncaje - desalineado, 
            centroY + margenEncaje + desarmado
        );

        line(
            centroX - margenEncaje - desarmado, 
            centroY - margenEncaje + desalineado, 
            centroX - margenEncaje - desarmado, 
            centroY + margenEncaje + desalineado
        );

        line(
            centroX + margenEncaje + desarmado, 
            centroY - margenEncaje - desalineado, 
            centroX + margenEncaje + desarmado, 
            centroY + margenEncaje - desalineado
        );

        pop();
    }
}