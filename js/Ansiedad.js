class Ansiedad {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.cuadrados = [];
        this.circulos = [];

        this.circuloControl = null;

        this.minY = 60;
        this.maxY = 60 + (6 - 1) * 40;

        this.explosion = 0;
        this.prevMouse = false;

        this.crearComposicion();
    }

    crearComposicion() {
        this.cuadrados = [];
        this.circulos = [];

        let sepX = 80;
        let sepY = 30;
        let inicioY = 95;

        // Círculo interactuable
        this.circulos.push({
            tipo: "C",
            origenX: this.w / 2,
            origenY: 20,
            x: this.w / 2,
            y: 20,
            tam: 34,
            vibracion: 0,
            interactivo: true,
            fase: random(TWO_PI)
        });

        // Triángulo de cuadrados
        for (let fila = 0; fila < 4; fila++) {
            let cantidad = fila + 1;
            let y = inicioY + fila * sepY;
            let inicioX = this.w / 2 - ((cantidad - 1) * sepX) / 2;

            for (let i = 0; i < cantidad; i++) {
                let x = inicioX + i * sepX;

                // Hueco reservado para el círculo
                if (fila === 2 && i === 1) {
                    continue;
                }

                this.cuadrados.push({
                    tipo: "Q",
                    origenX: x,
                    origenY: y,
                    x: x,
                    y: y,
                    tam: 30,
                    vibracion: 0,
                    fase: random(TWO_PI)
                });
            }
        }

        // Fila inferior de círculos
        let cantidadCirculos = 5;
        let yCirculos = inicioY + 4 * sepY;
        let inicioXCirculos = this.w / 2 - ((cantidadCirculos - 1) * sepX) / 2;

        for (let i = 0; i < cantidadCirculos; i++) {
            let x = inicioXCirculos + i * sepX;

            this.circulos.push({
                tipo: "C",
                origenX: x,
                origenY: yCirculos,
                x: x,
                y: yCirculos,
                tam: 35,
                vibracion: 0,
                interactivo: false,
                fase: random(TWO_PI)
            });
        }
    }

    update() {
        let candidato = null;

        for (let c of this.circulos) {
            let dx = mouseX - (this.x + c.x);
            let dy = mouseY - (this.y + c.y);

            if (sqrt(dx * dx + dy * dy) < c.tam / 2) {
                candidato = c;
                break;
            }
        }

        if (mouseIsPressed && this.circuloControl === null && candidato) {
            this.circuloControl = candidato;
        }

        if (!mouseIsPressed && this.prevMouse && this.circuloControl) {
            this.explosion = 1;
            this.circuloControl = null;
        }

        this.prevMouse = mouseIsPressed;
        this.explosion *= 0.92;

        let intensidadAnsiedad = 0;

        if (this.circuloControl) {
            let centroX = this.w / 2;
            let centroY = 160;

            let d = dist(
                this.circuloControl.x,
                this.circuloControl.y,
                centroX,
                centroY
            );

            intensidadAnsiedad = map(
                constrain(d, 0, 180),
                180,
                0,
                0,
                1
            );
        }

        for (let c of this.circulos) {
            let targetX = c.origenX;
            let targetY = c.origenY;

            if (c === this.circuloControl) {
                let mouseLocalY = constrain(
                    mouseY - this.y,
                    this.minY,
                    this.maxY
                );

                c.y = mouseLocalY;
                c.x = c.origenX;
                c.vibracion = intensidadAnsiedad * 10;
                continue;
            }

            if (this.explosion > 0.01) {
                let dx = c.origenX - this.w / 2;
                let dy = c.origenY - this.h / 2;
                let mag = sqrt(dx * dx + dy * dy);

                if (mag > 0) {
                    targetX += (dx / mag) * 140 * this.explosion;
                    targetY += (dy / mag) * 140 * this.explosion;
                }
            }

            c.x = lerp(c.x, targetX, 0.12);
            c.y = lerp(c.y, targetY, 0.12);
            c.vibracion = intensidadAnsiedad * 8;
        }

        for (let q of this.cuadrados) {
            let targetX = q.origenX;
            let targetY = q.origenY;

            if (this.circuloControl) {
                let huecoX = this.w / 2;
                let huecoY = 160;

                let distanciaCentro = dist(
                    this.circuloControl.x,
                    this.circuloControl.y,
                    huecoX,
                    huecoY
                );

                let ansiedad = map(
                    constrain(distanciaCentro, 0, 180),
                    180,
                    0,
                    0,
                    1
                );

                let dx = q.origenX - this.circuloControl.x;
                let dy = q.origenY - this.circuloControl.y;

                let repulsion = map(
                    ansiedad,
                    0,
                    1,
                    0,
                    40
                );

                let magnitud = sqrt(dx * dx + dy * dy);

                if (magnitud > 0) {
                    targetX += (dx / magnitud) * repulsion;
                    targetY += (dy / magnitud) * repulsion;
                }

                q.vibracion = ansiedad * 10;
            } else {
                q.vibracion = 0;
            }

            if (this.explosion > 0.01) {
                let dx = q.origenX - this.w / 2;
                let dy = q.origenY - this.h / 2;
                let mag = sqrt(dx * dx + dy * dy);

                if (mag > 0) {
                    targetX += (dx / mag) * 160 * this.explosion;
                    targetY += (dy / mag) * 160 * this.explosion;
                }
            }

            q.x = lerp(q.x, targetX, 0.08);
            q.y = lerp(q.y, targetY, 0.08);
        }
    }

    draw() {
        this.update();

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        translate(this.x, this.y);

        noStroke();
        fill(245);
        rect(0, 0, this.w, this.h);

        // Renderizado de Cuadrados mediante EfectoVisualGlobal
        for (let q of this.cuadrados) {
            push();

            let reposoX = sin(frameCount * 0.03 + q.fase);
            let reposoY = cos(frameCount * 0.025 + q.fase);

            let vibX = random(-q.vibracion, q.vibracion);
            let vibY = random(-q.vibracion, q.vibracion);

            translate(
                q.x + reposoX + vibX,
                q.y + reposoY + vibY
            );

            // Inclinación característica del diseño original de cuadrados
            rotate(PI / 4);

            EfectoVisualGlobal.dibujar(q, q.tipo, q.tam);

            pop();
        }

        // Renderizado de Círculos mediante EfectoVisualGlobal
        for (let c of this.circulos) {
            push();

            let reposoX = sin(frameCount * 0.03 + c.fase);
            let reposoY = cos(frameCount * 0.025 + c.fase);

            let vibX = random(-c.vibracion, c.vibracion);
            let vibY = random(-c.vibracion, c.vibracion);

            translate(
                c.x + reposoX + vibX,
                c.y + reposoY + vibY
            );

            EfectoVisualGlobal.dibujar(c, c.tipo, c.tam);

            pop();
        }

        drawingContext.restore();
        pop();
    }
}