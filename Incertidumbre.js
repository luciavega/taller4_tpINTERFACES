class Incertidumbre {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.filas = 3;
        this.columnas = 4;
        this.mousePresionadoPrevio = false;
        
        this.crearComposicion();
    }

    crearComposicion() {
        this.figuras = [];

        let tipos = ["circulo", "triangulo", "cuadrado", "vacio"];

        for (let f = 0; f < this.filas; f++) {
            for (let c = 0; c < this.columnas; c++) {
                
               let posX = map(c, 0, this.columnas - 1, 0.25, 0.7);
               let posY = map(f, 0, this.filas - 1, 0.25, 0.7);

                let tipoAleatorio = random(tipos);
                
                if ((f === 0 && c === 1) || (f === 0 && c === 4) || (f === 1 && c === 3) || (f === 2 && c === 1)) {
                    tipoAleatorio = "vacio";
                } else if (tipoAleatorio === "vacio") {
                    tipoAleatorio = random(["circulo", "triangulo", "cuadrado"]); 
                }

                this.figuras.push({
                    fila: f,
                    columna: c,
                    x: posX,
                    y: posY,
                    tamBase: 46,
                    tam: 46,
                    tipo: tipoAleatorio,
                    targetEsfuerzo: 0 
                });
            }
        }
    }

    update() {
        const dentro = mouseX >= this.x &&
            mouseX <= this.x + this.w &&
            mouseY >= this.y &&
            mouseY <= this.y + this.h;

        if (dentro && mouseIsPressed && !this.mousePresionadoPrevio) {
            this.mousePresionadoPrevio = true;

            for (let f of this.figuras) {
                let px = this.x + f.x * this.w;
                let py = this.y + f.y * this.h;

                if (dist(mouseX, mouseY, px, py) < f.tamBase / 2) {
                    this.mutarFiguraYVecinos(f);
                    break;
                }
            }
        }

        if (!mouseIsPressed) {
            this.mousePresionadoPrevio = false;
        }

        for (let f of this.figuras) {
            f.tam = lerp(f.tam, f.tamBase + f.targetEsfuerzo, 0.1);
            f.targetEsfuerzo = lerp(f.targetEsfuerzo, 0, 0.08); 
        }
    }

    mutarFiguraYVecinos(figuraCentral) {
        let tipos = ["circulo", "triangulo", "cuadrado", "vacio"];

        let indexActual = tipos.indexOf(figuraCentral.tipo);
        let siguienteIndex = (indexActual + 1) % tipos.length;
        figuraCentral.tipo = tipos[siguienteIndex];
        figuraCentral.targetEsfuerzo = 12; 

        for (let f of this.figuras) {
            let esVecino = (Math.abs(f.fila - figuraCentral.fila) + Math.abs(f.columna - figuraCentral.columna)) === 1;
            
            if (esVecino) {
                let tipoVecino = random(["circulo", "triangulo", "cuadrado", "vacio"]);
                f.tipo = tipoVecino;
                f.targetEsfuerzo = 6; 
            }
        }
    }

    dibujarFigura(f) {
        if (f.tipo === "vacio") return;

        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        let cRosa = color(255, 0, 120);
        let cAzul = color(40, 120, 255);
        let cVioleta = color(180, 0, 255);

        push();
        translate(px, py);
        noStroke();

        switch (f.tipo) {
            case "circulo":
                fill(cRosa);
                circle(0, 0, f.tam);
                break;

            case "cuadrado":
                fill(cVioleta);
                rectMode(CENTER);
                square(0, 0, f.tam);
                break;

            case "triangulo":
                fill(cAzul);
                let h = f.tam * 0.86;
                triangle(0, -h / 2, -f.tam / 2, h / 2, f.tam / 2, h / 2);
                break;
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