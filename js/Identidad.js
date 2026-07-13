class Identidad {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.protagonista = {
            x: 0.50,
            y: 0.50,
            tamBase: 65,
            tam: 65,
            cBase: color(255, 0, 120), 
            c: color(255, 0, 120),
            bordeC: color(255, 140, 0), 
            rotacion: 0,
            vibracion: 0,
            respiracion: 1
        };

        this.arrastrando = false;
        this.crearComposicion();
    }

    crearComposicion() {
        let rosa = color(255, 0, 120);
        let azul = color(40, 120, 255);
        let violeta = color(180, 0, 255);

        this.figuras = [
            {
                tipo: "triangulo",
                x: 0.20,
                y: 0.25,
                tam: 75,
                c: azul,
                propiedad: "color"
            },
            {
                tipo: "cuadrado",
                x: 0.80,
                y: 0.25,
                tam: 110, 
                c: violeta,
                propiedad: "tamaño"
            },
            {
                tipo: "cuadrado",
                x: 0.15,
                y: 0.75,
                tam: 35,  
                c: violeta,
                propiedad: "vibracion"
            },
            {
                tipo: "triangulo",
                x: 0.85,
                y: 0.75,
                tam: 65,
                c: rosa,
                propiedad: "rotacion"
            },
            {
                tipo: "circulo",
                x: 0.50,
                y: 0.15,
                tam: 60,
                c: violeta,
                propiedad: "respiracion"
            }
        ];
    }

    update() {
        let px = this.x + this.protagonista.x * this.w;
        let py = this.y + this.protagonista.y * this.h;

        if (mouseIsPressed) {
            if (!this.arrastrando && dist(mouseX, mouseY, px, py) < this.protagonista.tam / 2) {
                this.arrastrando = true;
            }
            if (this.arrastrando) {
                let nuevoX = constrain(mouseX, this.x, this.x + this.w);
                let nuevoY = constrain(mouseY, this.y, this.y + this.h);
                this.protagonista.x = (nuevoX - this.x) / this.w;
                this.protagonista.y = (nuevoY - this.y) / this.h;
            }
        } else {
            this.arrastrando = false;
        }

        let propiedadActiva = null;
        let pRealX = this.x + this.protagonista.x * this.w;
        let pRealY = this.y + this.protagonista.y * this.h;

        for (let f of this.figuras) {
            let fRealX = this.x + f.x * this.w;
            let fRealY = this.y + f.y * this.h;

            if (dist(pRealX, pRealY, fRealX, fRealY) < 80) {
                propiedadActiva = f.propiedad;
                break; 
            }
        }

        let targetColor = this.protagonista.cBase;
        let targetTam = this.protagonista.tamBase;
        let targetRot = 0;
        let targetVib = 0;
        let targetResp = 1;

        if (propiedadActiva === "color") targetColor = color(40, 120, 255);
        if (propiedadActiva === "tamaño") targetTam = 110;
        if (propiedadActiva === "rotacion") targetRot = frameCount * 0.03;
        if (propiedadActiva === "vibracion") targetVib = 1;
        if (propiedadActiva === "respiracion") targetResp = 1 + sin(frameCount * 0.1) * 0.25;

        this.protagonista.c = lerpColor(this.protagonista.c, targetColor, 0.08);
        this.protagonista.tam = lerp(this.protagonista.tam, targetTam, 0.08);
        this.protagonista.rotacion = lerp(this.protagonista.rotacion, targetRot, 0.08);
        this.protagonista.vibracion = lerp(this.protagonista.vibracion, targetVib, 0.1);
        this.protagonista.respiracion = lerp(this.protagonista.respiracion, targetResp, 0.08);
    }

    dibujarFigura(f) {
        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        push();
        translate(px, py);
        noStroke();
        fill(f.c);

        switch (f.tipo) {
            case "circulo":
                circle(0, 0, f.tam);
                break;

            case "cuadrado":
                rectMode(CENTER);
                square(0, 0, f.tam);
                break;

            case "triangulo":
                let h = f.tam * 0.86;
                triangle(0, -h / 2, -f.tam / 2, h / 2, f.tam / 2, h / 2);
                break;
        }
        pop();
    }

    dibujarProtagonista() {
        let px = this.x + this.protagonista.x * this.w;
        let py = this.y + this.protagonista.y * this.h;

        let vibX = 0;
        let vibY = 0;
        if (this.protagonista.vibracion > 0.05) {
            vibX = random(-3, 3) * this.protagonista.vibracion;
            vibY = random(-3, 3) * this.protagonista.vibracion;
        }

        push();
        translate(px + vibX, py + vibY);
        rotate(this.protagonista.rotacion);
        scale(this.protagonista.respiracion);

        // linea q identifica a la figura prota
        noFill();
        stroke(this.protagonista.bordeC);
        strokeWeight(3);
        circle(0, 0, this.protagonista.tam + 10);

        noStroke();
        fill(this.protagonista.c);
        circle(0, 0, this.protagonista.tam);

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

        this.dibujarProtagonista();
    }
}