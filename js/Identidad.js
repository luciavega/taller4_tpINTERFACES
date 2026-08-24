class Identidad {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        // Atributos numéricos de color para el protagonista (independientes)
        this.protagonista = {
            x: 0.50,
            y: 0.50,
            tamBase: 65,
            tam: 65,
            // RGB Relleno Base (Rosa)
            rBase: 255, gBase: 0, bBase: 120,
            r: 255, g: 0, b: 120,
            
            // RGB Borde Base (Naranja)
            rBordeBase: 255, gBordeBase: 140, bBordeBase: 0,
            rBorde: 255, gBorde: 140, bBorde: 0,
            grosorBorde: 3,

            rotacion: 0,
            vibracion: 0,
            respiracion: 1
        };

        this.arrastrando = false;
        this.crearComposicion();
    }

    crearComposicion() {
        this.figuras = [
            {
                tipo: "T",
                x: 0.20,
                y: 0.25,
                tam: 75,
                // Triángulo Verde
                r: 0, g: 200, b: 100,
                rBorde: 0, gBorde: 255, bBorde: 150, // Borde con brillo/textura verde
                c: color(0, 200, 100),
                color: color(0, 200, 100),
                propiedad: "color"
            },
            {
                tipo: "Q",
                x: 0.80,
                y: 0.60,
                tam: 90, 
                r: 180, g: 0, b: 255,
                c: color(180, 0, 255),
                color: color(180, 0, 255),
                propiedad: "tamaño"
            },
            {
                tipo: "Q",
                x: 0.15,
                y: 0.75,
                tam: 35,  
                r: 180, g: 0, b: 255,
                c: color(180, 0, 255),
                color: color(180, 0, 255),
                propiedad: "vibracion"
            },
            {
                tipo: "C",
                x: 0.50,
                baseX: 0.50,
                y: 0.20,
                tam: 60,
                r: 180, g: 0, b: 255,
                c: color(180, 0, 255),
                color: color(180, 0, 255),
                propiedad: "respiracion",
                respiracion: 1,
                fase: random(TWO_PI)
            }
        ];
    }

    update() {
        const dentro = mouseX >= this.x &&
            mouseX <= this.x + this.w &&
            mouseY >= this.y &&
            mouseY <= this.y + this.h;

        let px = this.x + this.protagonista.x * this.w;
        let py = this.y + this.protagonista.y * this.h;

        if (dentro && mouseIsPressed) {
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

        let figuraInteractuada = null;
        let pRealX = this.x + this.protagonista.x * this.w;
        let pRealY = this.y + this.protagonista.y * this.h;

        for (let f of this.figuras) {
            let fRealX = this.x + f.x * this.w;
            let fRealY = this.y + f.y * this.h;
            
            // Radio de detección por contacto físico
            let radioActivacion = (f.tam / 2) + (this.protagonista.tam / 2);

            if (dist(pRealX, pRealY, fRealX, fRealY) < radioActivacion) {
                figuraInteractuada = f;
                break; 
            }
        }

        let circuloVioleta = this.figuras.find(f => f.tipo === "C" && f.propiedad === "respiracion");
        if (circuloVioleta) {
            let movimiento = sin(frameCount * 0.06 + circuloVioleta.fase) * 0.08;
            circuloVioleta.x = constrain(circuloVioleta.baseX + movimiento, 0.1, 0.9);

            let fRealX = this.x + circuloVioleta.x * this.w;
            let fRealY = this.y + circuloVioleta.y * this.h;
            let distancia = dist(pRealX, pRealY, fRealX, fRealY);
            let estaSobreFigura = distancia < circuloVioleta.tam * 0.5;

            let destinoResp = 1 + sin(frameCount * 0.1 + circuloVioleta.fase) * 0.12;
            if (estaSobreFigura) {
                destinoResp = this.protagonista.respiracion;
                if (!this.arrastrando) {
                    this.protagonista.x = lerp(this.protagonista.x, circuloVioleta.x, 0.08);
                }
            }
            circuloVioleta.respiracion = lerp(circuloVioleta.respiracion, destinoResp, 0.08);
        }

        // Metas de color base (Rosa / Borde Naranja)
        let targetR = this.protagonista.rBase;
        let targetG = this.protagonista.gBase;
        let targetB = this.protagonista.bBase;

        let targetRborde = this.protagonista.rBordeBase;
        let targetGborde = this.protagonista.gBordeBase;
        let targetBborde = this.protagonista.bBordeBase;
        
        let targetTam = this.protagonista.tamBase;
        let targetRot = 0;
        let targetVib = 0;
        let targetResp = 1;

        if (figuraInteractuada) {
            let propiedadActiva = figuraInteractuada.propiedad;
            
            if (propiedadActiva === "color") {
                // Copia el color de relleno y el borde del triángulo verde
                targetR = figuraInteractuada.r;
                targetG = figuraInteractuada.g;
                targetB = figuraInteractuada.b;

                targetRborde = figuraInteractuada.rBorde || figuraInteractuada.r;
                targetGborde = figuraInteractuada.gBorde || figuraInteractuada.g;
                targetBborde = figuraInteractuada.bBorde || figuraInteractuada.b;
            }
            if (propiedadActiva === "tamaño") targetTam = 110;
            if (propiedadActiva === "rotacion") targetRot = frameCount * 0.03;
            if (propiedadActiva === "vibracion") targetVib = 1;
            if (propiedadActiva === "respiracion") targetResp = 1 + sin(frameCount * 0.1) * 0.25;
        }

        // Transición suave de color independiente (Lerp en RGB)
        this.protagonista.r = lerp(this.protagonista.r, targetR, 0.15);
        this.protagonista.g = lerp(this.protagonista.g, targetG, 0.15);
        this.protagonista.b = lerp(this.protagonista.b, targetB, 0.15);

        this.protagonista.rBorde = lerp(this.protagonista.rBorde, targetRborde, 0.15);
        this.protagonista.gBorde = lerp(this.protagonista.gBorde, targetGborde, 0.15);
        this.protagonista.bBorde = lerp(this.protagonista.bBorde, targetBborde, 0.15);

        this.protagonista.tam = lerp(this.protagonista.tam, targetTam, 0.08);
        this.protagonista.rotacion = lerp(this.protagonista.rotacion, targetRot, 0.08);
        this.protagonista.vibracion = lerp(this.protagonista.vibracion, targetVib, 0.1);
        this.protagonista.respiracion = lerp(this.protagonista.respiracion, targetResp, 0.08);
    }

    dibujarFigura(f) {
        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        let vibX = 0;
        let vibY = 0;
        if (f.propiedad === "vibracion") {
            vibX = random(-2, 2);
            vibY = random(-2, 2);
        }

        push();
        translate(px + vibX, py + vibY);

        if (f.propiedad === "respiracion") {
            scale(f.respiracion || 1);
        }

        // Las figuras estáticas siguen usando la textura del EfectoVisualGlobal
        EfectoVisualGlobal.dibujar(f, f.tipo, f.tam);
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

        // DIBUJO INDEPENDIENTE (Sin pasar por EfectoVisualGlobal)
        // 1. Estilo de borde personalizado (Textura/Grosor propio)
        strokeWeight(this.protagonista.grosorBorde);
        stroke(this.protagonista.rBorde, this.protagonista.gBorde, this.protagonista.bBorde);

        // 2. Relleno dinámico independiente
        fill(this.protagonista.r, this.protagonista.g, this.protagonista.b);

        // 3. Dibujo directo del círculo protagonista
        circle(0, 0, this.protagonista.tam);

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

        // Dibuja el protagonista con su renderizado nativo
        this.dibujarProtagonista();

        drawingContext.restore();
        pop();
    }
}