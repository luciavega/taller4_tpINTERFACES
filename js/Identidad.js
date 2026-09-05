class Identidad {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "presente";
        this.figuraArrastrada = null;
        this.ultimoMouseX = mouseX;
        this.ultimoMouseY = mouseY;
        this.crearComposicion();
    }

    crearComposicion() {
        const tipos = ["T", "Q", "C", "T", "Q", "C", "T", "Q", "C"];
        const posiciones = [];
        this.figuras = [];
        const centrosPorTipo = {
            T: { x: 0.50, y: 0.64 },
            Q: { x: 0.36, y: 0.44 },
            C: { x: 0.65, y: 0.42 }
        };

        for (let indice = 0; indice < tipos.length; indice++) {
            const centro = centrosPorTipo[tipos[indice]];
            let posicion;
            let intentos = 0;

            do {
                posicion = {
                    x: constrain(random(centro.x - 0.16, centro.x + 0.16), 0.18, 0.82),
                    y: constrain(random(centro.y - 0.16, centro.y + 0.16), 0.20, 0.80)
                };
                intentos++;
            } while (posiciones.some(otra =>
                dist(posicion.x, posicion.y, otra.x, otra.y) < 0.12
            ) && intentos < 100);

            posiciones.push(posicion);
            this.figuras.push(this.crearFigura(tipos[indice], posicion.x, posicion.y));
        }
    }

    crearFigura(tipo, x, y) {
        const colores = {
            T: [255, 230, 30],
            Q: [255, 120, 20],
            C: [20, 50, 255]
        };
        const color = colores[tipo];

        return {
            tipo,
            x,
            y,
            baseX: x,
            baseY: y,
            tam: 52,
            fase: random(TWO_PI),
            rot: 0,
            escala: 1,
            dragging: false,
            opacidad: 0.55,
            intensidad: 0,
            intensidadObjetivo: 0,
            nivelInteraccion: 0,
            interaccionRegistrada: false,
            baseR: color[0],
            baseG: color[1],
            baseB: color[2],
            r: color[0],
            g: color[1],
            b: color[2],
            paleta: EfectoVisualGlobal.paletas[tipo][0]
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
                    if (dist(mouseX, mouseY, fx, fy) < f.tam * 0.7) {
                        this.figuraArrastrada = f;
                        f.dragging = true;
                        this.ultimoMouseX = mouseX;
                        this.ultimoMouseY = mouseY;
                        break;
                    }
                }
            }

            if (this.figuraArrastrada) {
                const nuevoX = constrain(mouseX, this.x + 20, this.x + this.w - 20);
                const nuevoY = constrain(mouseY, this.y + 20, this.y + this.h - 20);
                this.figuraArrastrada.x = (nuevoX - this.x) / this.w;
                this.figuraArrastrada.y = (nuevoY - this.y) / this.h;
                const movimientoX = mouseX - this.ultimoMouseX;
                const movimientoY = mouseY - this.ultimoMouseY;
                const movimiento = constrain(sqrt(movimientoX ** 2 + movimientoY ** 2) / 12, 0, 1);

                if (movimiento > 0.08 && !this.figuraArrastrada.interaccionRegistrada) {
                    this.figuraArrastrada.nivelInteraccion = min(
                        this.figuraArrastrada.nivelInteraccion + 1 / 3,
                        1
                    );
                    this.figuraArrastrada.interaccionRegistrada = true;
                }

                this.figuraArrastrada.intensidadObjetivo = movimiento > 0.08
                    ? this.figuraArrastrada.nivelInteraccion * constrain(movimiento * 1.5, 0.55, 1)
                    : 0;
            }
        } else {
            if (this.figuraArrastrada) {
                this.figuraArrastrada.dragging = false;
                this.figuraArrastrada.intensidadObjetivo = 0;
                this.figuraArrastrada.interaccionRegistrada = false;
            }
            this.figuraArrastrada = null;
        }

        this.ultimoMouseX = mouseX;
        this.ultimoMouseY = mouseY;

        for (let f of this.figuras) {
            if (!f.dragging) {
                const objetivoX = f.baseX + sin(frameCount * 0.012 + f.fase) * 0.018;
                const objetivoY = f.baseY + cos(frameCount * 0.010 + f.fase) * 0.018;

                f.x = lerp(f.x, objetivoX, 0.035);
                f.y = lerp(f.y, objetivoY, 0.035);
                f.dragging = false;
            }

            f.intensidad = lerp(f.intensidad, f.intensidadObjetivo, 0.08);
            f.intensidadObjetivo = lerp(f.intensidadObjetivo, 0, 0.12);
            f.opacidad = 0.55;
        }
    }

    dibujarFigura(f) {
        const px = this.x + f.x * this.w;
        const py = this.y + f.y * this.h;

        push();
        translate(px, py);

        if (!f.dragging) {
            const driftX = sin(frameCount * 0.03 + f.fase) * 10;
            const driftY = cos(frameCount * 0.025 + f.fase) * 10;
            translate(driftX, driftY);
        }

        if (f.tipo === "Q") {
            const velocidadRotacion = 0.012 + f.intensidad * 0.07;
            rotate(frameCount * velocidadRotacion + f.fase);
        }

        if (f.tipo === "T") {
            const vibracion = 3.5 + f.intensidad * 13;
            translate(
                sin(frameCount * (0.12 + f.intensidad * 0.3) + f.fase) * vibracion,
                cos(frameCount * (0.16 + f.intensidad * 0.36) + f.fase) * vibracion
            );
            rotate(sin(frameCount * (0.28 + f.intensidad * 0.32) + f.fase) *
                (0.025 + f.intensidad * 0.10));
        }

        const escalaVisual = f.tipo === "C"
            ? 1 + sin(frameCount * (0.032 + f.intensidad * 0.055) + f.fase) *
                (0.16 + f.intensidad * 0.16)
            : 1.06;

        scale(escalaVisual);

        drawingContext.save();
        drawingContext.globalAlpha = 0.55;
        EfectoVisualGlobal.dibujar(f, f.tipo, f.tam);
        drawingContext.restore();

        pop();
    }

    draw(actualizar = true) {
        if (actualizar) this.update();
        EfectoVisualGlobal.grupoActual = this.grupo;

        const glowAnterior = EfectoVisualGlobal.intensidadGlow;
        EfectoVisualGlobal.intensidadGlow = 1.6;

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

        EfectoVisualGlobal.intensidadGlow = glowAnterior;
    }
}