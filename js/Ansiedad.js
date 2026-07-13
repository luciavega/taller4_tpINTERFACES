class Ansiedad {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.factorDisolucion = 0; 
        
        this.cuadrados = [];
        this.circulos = [];
        this.crearComposicion();
    }

    crearComposicion() {
        let sepX = 48; 
        let sepY = 40; 
        let inicioY = 60;

        for (let fila = 0; fila < 6; fila++) {
            let cantidad = fila + 1;
            let y = inicioY + fila * sepY;
            let inicioX = this.w / 2 - ((cantidad - 1) * sepX) / 2;

            for (let i = 0; i < cantidad; i++) {
                let x = inicioX + i * sepX;

                let dirX = x - this.w / 2;
                let dirY = y - (inicioY + 100);
                let mag = sqrt(dirX * dirX + dirY * dirY);
                
                let escapeX = mag > 0 ? (dirX / mag) * 70 : 0;
                let escapeY = mag > 0 ? (dirY / mag) * 50 : -30; 

                let faseAleatoria = random(TWO_PI);

                if (fila === 0 || fila === 5) {
                    this.circulos.push({
                        origenX: x,
                        origenY: y,
                        escapeX: escapeX,
                        escapeY: escapeY,
                        x: x,
                        y: y,
                        tam: fila === 0 ? 34 : 36,
                        fase: faseAleatoria,
                        vibracion: 0
                    });
                } else {
                    this.cuadrados.push({
                        origenX: x,
                        origenY: y,
                        escapeX: escapeX,
                        escapeY: escapeY,
                        x: x,
                        y: y,
                        tam: 28,
                        fase: faseAleatoria,
                        vibracion: 0
                    });
                }
            }
        }
    }

    update() {
        let targetDisolucion = mouseIsPressed ? 0.15 : 1.0; 
        this.factorDisolucion = lerp(this.factorDisolucion, targetDisolucion, 0.05);

        for (let q of this.cuadrados) {
            let targetX = q.origenX + q.escapeX * this.factorDisolucion;
            let targetY = q.origenY + q.escapeY * this.factorDisolucion;
            
            q.x = lerp(q.x, targetX, 0.1);
            q.y = lerp(q.y, targetY, 0.1);

            q.vibracion = mouseIsPressed ? map(this.factorDisolucion, 0.3, 0.15, 0.5, 3.0) : 0;
        }

        for (let c of this.circulos) {
            let targetX = c.origenX + c.escapeX * this.factorDisolucion;
            let targetY = c.origenY + c.escapeY * this.factorDisolucion;

            c.x = lerp(c.x, targetX, 0.1);
            c.y = lerp(c.y, targetY, 0.1);

            c.vibracion = mouseIsPressed ? map(this.factorDisolucion, 0.3, 0.15, 0.5, 3.0) : 0;
        }
    }

    draw() {
        this.update();

        push();
        translate(this.x, this.y);
        noStroke();

        fill(245);
        rect(0, 0, this.w, this.h);

        fill(180, 0, 255);
        for (let q of this.cuadrados) {
            push();
            let reposoX = sin(frameCount * 0.03 + q.fase) * 1.0;
            let reposoY = cos(frameCount * 0.025 + q.fase) * 1.0;
            let vibX = random(-q.vibracion, q.vibracion);
            let vibY = random(-q.vibracion, q.vibracion);

            translate(q.x + reposoX + vibX, q.y + reposoY + vibY);
            rotate(PI / 4); // Rotados a 45 grados como en la imagen
            rectMode(CENTER);
            square(0, 0, q.tam);
            pop();
        }

        fill(255, 0, 120);
        for (let c of this.circulos) {
            push();
            let reposoX = sin(frameCount * 0.03 + c.fase) * 1.0;
            let reposoY = cos(frameCount * 0.025 + c.fase) * 1.0;
            let vibX = random(-c.vibracion, c.vibracion);
            let vibY = random(-c.vibracion, c.vibracion);

            translate(c.x + reposoX + vibX, c.y + reposoY + vibY);
            circle(0, 0, c.tam);
            pop();
        }

        pop();
    }
}