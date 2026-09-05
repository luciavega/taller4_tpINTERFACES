class Colaboracion {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "presente";
        this.figuraArrastrada = null;
        this.figuraAncla = null;
        this.progresoAtraccion = 0;
        this.huboMovimiento = false;
        this.ultimoMouseX = 0;
        this.ultimoMouseY = 0;
        this.crearComposicion();
    }

    crearComposicion() {
        this.figuras = [];
        const tipos = ["C", "Q", "T", "C", "Q", "T", "C", "Q", "T"];
        const centrosPorTipo = {
            C: { x: 0.35, y: 0.43 },
            Q: { x: 0.65, y: 0.43 },
            T: { x: 0.50, y: 0.66 }
        };

        for (let i = 0; i < tipos.length; i++) {
            const centro = centrosPorTipo[tipos[i]];
            const xRandom = constrain(random(centro.x - 0.15, centro.x + 0.15), 0.18, 0.82);
            const yRandom = constrain(random(centro.y - 0.15, centro.y + 0.15), 0.22, 0.78);

            this.figuras.push({
                x: xRandom,
                y: yRandom,
                baseX: xRandom,
                baseY: yRandom,
                origenX: xRandom,
                origenY: yRandom,
                targetX: xRandom,
                targetY: yRandom,
                tipo: tipos[i],
                index: i,
                tam: 42,
                fase: random(TWO_PI)
            });
        }
    }

    posicionEnForma(baseX, baseY, indice, total, tipo) {
        if (tipo === "C") {
            const angulo = (indice / total) * TWO_PI;
            const radio = 0.20;
            return {
                x: constrain(baseX + cos(angulo) * radio, 0, 1),
                y: constrain(baseY + sin(angulo) * radio, 0, 1)
            };
        }

        if (tipo === "Q") {
            const paso = (indice / total) * 4;
            const lado = floor(paso);
            const t = paso - lado;

            let x = 0;
            let y = 0;

            if (lado === 0) {
                x = lerp(-0.26, 0.26, t);
                y = -0.26;
            } else if (lado === 1) {
                x = 0.26;
                y = lerp(-0.26, 0.26, t);
            } else if (lado === 2) {
                x = lerp(0.26, -0.26, t);
                y = 0.26;
            } else {
                x = -0.26;
                y = lerp(0.26, -0.26, t);
            }

            return {
                x: constrain(baseX + x, 0, 1),
                y: constrain(baseY + y, 0, 1)
            };
        }

        const a = { x: 0, y: -0.28 };
        const b = { x: 0.28, y: 0.25 };
        const c = { x: -0.28, y: 0.25 };
        const paso = (indice / total) * 3;
        const lado = floor(paso);
        const t = paso - lado;

        let p1;
        let p2;

        if (lado === 0) {
            p1 = a;
            p2 = b;
        } else if (lado === 1) {
            p1 = b;
            p2 = c;
        } else {
            p1 = c;
            p2 = a;
        }

        return {
            x: constrain(baseX + lerp(p1.x, p2.x, t), 0, 1),
            y: constrain(baseY + lerp(p1.y, p2.y, t), 0, 1)
        };
    }

    update() {
        const dentro = mouseX >= this.x &&
            mouseX <= this.x + this.w &&
            mouseY >= this.y &&
            mouseY <= this.y + this.h;

        if (dentro && mouseIsPressed) {
            if (!this.figuraArrastrada) {
                for (let f of this.figuras) {
                    const fx = this.x + f.x * this.w;
                    const fy = this.y + f.y * this.h;
                    if (dist(mouseX, mouseY, fx, fy) < f.tam * 0.75) {
                        this.figuraArrastrada = f;
                        this.ultimoMouseX = mouseX;
                        this.ultimoMouseY = mouseY;
                        this.huboMovimiento = false;
                        break;
                    }
                }
            }

            if (this.figuraArrastrada) {
                const desplazamiento = dist(mouseX, mouseY, this.ultimoMouseX, this.ultimoMouseY);
                if (desplazamiento > 4) {
                    this.huboMovimiento = true;
                    this.figuraAncla = this.figuraArrastrada;
                }

                const nuevoX = constrain(mouseX, this.x, this.x + this.w);
                const nuevoY = constrain(mouseY, this.y, this.y + this.h);
                this.figuraArrastrada.x = (nuevoX - this.x) / this.w;
                this.figuraArrastrada.y = (nuevoY - this.y) / this.h;

                this.ultimoMouseX = mouseX;
                this.ultimoMouseY = mouseY;
            }
        } else {
            this.figuraArrastrada = null;
            this.figuraAncla = null;
            this.huboMovimiento = false;
            for (let f of this.figuras) {
                f.targetX = f.baseX;
                f.targetY = f.baseY;
                f.origenX = f.baseX;
                f.origenY = f.baseY;
            }
        }

        const targetAtraccion = this.figuraAncla && this.huboMovimiento ? 1 : 0;
        this.progresoAtraccion = lerp(this.progresoAtraccion, targetAtraccion, 0.08);

        if (this.figuraAncla && this.huboMovimiento) {
            const otrasFiguras = this.figuras.filter(f => f !== this.figuraAncla);
            for (let i = 0; i < otrasFiguras.length; i++) {
                const posicion = this.posicionEnForma(
                    this.figuraAncla.x,
                    this.figuraAncla.y,
                    i,
                    otrasFiguras.length,
                    this.figuraAncla.tipo
                );

                otrasFiguras[i].targetX = posicion.x;
                otrasFiguras[i].targetY = posicion.y;
            }
        }

        for (let f of this.figuras) {
            if (f === this.figuraArrastrada) {
                f.origenX = f.x;
                f.origenY = f.y;
                continue;
            }

            const destinoX = lerp(f.origenX, f.targetX, this.progresoAtraccion);
            const destinoY = lerp(f.origenY, f.targetY, this.progresoAtraccion);

            f.x = lerp(f.x, destinoX, 0.08);
            f.y = lerp(f.y, destinoY, 0.08);
        }
    }

    mouseReleased() {
        this.figuraArrastrada = null;
        this.figuraAncla = null;
        this.huboMovimiento = false;
        this.progresoAtraccion = 0;

        for (let f of this.figuras) {
            f.targetX = f.baseX;
            f.targetY = f.baseY;
            f.origenX = f.baseX;
            f.origenY = f.baseY;
        }
    }

    dibujarFigura(f) {
        let px = this.x + f.x * this.w;
        let py = this.y + f.y * this.h;

        let flotar = (1 - this.progresoAtraccion) * 2;
        let offsetReposoX = sin(frameCount * 0.03 + f.fase) * flotar;
        let offsetReposoY = cos(frameCount * 0.025 + f.fase) * flotar;

        push();
        translate(px + offsetReposoX, py + offsetReposoY);
        scale(1.28);

        if (typeof EfectoVisualGlobal !== "undefined" && typeof EfectoVisualGlobal.dibujar === "function") {
            EfectoVisualGlobal.dibujar(f, f.tipo, f.tam);
        } else {
            noStroke();
            fill(180, 0, 255);
            rectMode(CENTER);
            square(0, 0, f.tam);
        }

        pop();
    }

    draw(actualizar = true) {
        if (actualizar) this.update();
        EfectoVisualGlobal.grupoActual = this.grupo;

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        noStroke();
        fill(34, 34, 34);
        rect(this.x, this.y, this.w, this.h);

        for (let f of this.figuras) {
            this.dibujarFigura(f);
        }

        drawingContext.restore();
        pop();
    }
}
