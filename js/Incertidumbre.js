

class Incertidumbre {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "futuro";
        this.tamano = constrain(min(w, h) * 0.06, 22, 38);
        this.arrastrada = null;
        this.mousePresionadoPrevio = false;
        this.ultimaReagrupacion = -1;
        this.reagrupoDuranteArrastre = false;
        this.ultimoMouseX = 0;
        this.ultimoMouseY = 0;
        this.formaciones = [
            {
                centroX: 0.19,
                centroY: 0.50,
                principal: "C",
                intruso: "Q",
                intrusoDesplazamiento: [0.07, 0.16],
                posiciones: [[0, -0.165], [-0.047, -0.01], [0.047, -0.01], [-0.07, 0.165], [0, 0.175]]
            },
            {
                centroX: 0.51,
                centroY: 0.51,
                principal: "Q",
                intruso: "T",
                intrusoDesplazamiento: this.crearPosicionesCirculares(0.12, 6)[0],
                posiciones: this.crearPosicionesCirculares(0.12, 6).slice(1)
            },
            {
                centroX: 0.805,
                centroY: 0.50,
                principal: "T",
                intruso: "C",
                intrusoDesplazamiento: [-0.075, 0.015],
                posiciones: [[-0.075, -0.165], [0, -0.165], [0.075, -0.165], [0.08, 0], [-0.075, 0.165], [0, 0.165], [0.075, 0.165]]
            }
        ];
        this.paletasPorTipo = {
            T: [[65, 215, 150], [110, 245, 190], [210, 255, 175]],
            Q: [[255, 135, 35], [255, 190, 65], [255, 235, 145]],
            C: [[235, 75, 185], [255, 125, 215], [125, 205, 255]]
        };
        this.crearComposicion();
    }

    crearPosicionesCirculares(radioX, cantidad) {
        const radioY = radioX * this.w / this.h;
        return Array.from({ length: cantidad }, (_, indice) => {
            const angulo = -HALF_PI + indice * TWO_PI / cantidad;
            return [cos(angulo) * radioX, sin(angulo) * radioY];
        });
    }

    crearComposicion() {
        this.figuras = [];
        for (let grupo = 0; grupo < this.formaciones.length; grupo++) {
            const formacion = this.formaciones[grupo];
            formacion.posiciones.forEach((posicion, indice) => {
                this.figuras.push(this.crearFigura(formacion.principal, grupo, posicion[0], posicion[1], false, indice));
            });
            this.figuras.push(this.crearFigura(
                formacion.intruso,
                grupo,
                formacion.intrusoDesplazamiento[0],
                formacion.intrusoDesplazamiento[1],
                true,
                formacion.posiciones.length
            ));
        }
    }

    crearFigura(tipo, grupo, desplazamientoX, desplazamientoY, interactuable, orden) {
        const formacion = this.formaciones[grupo];
        const x = formacion.centroX + desplazamientoX;
        const y = formacion.centroY + desplazamientoY;
        return {
            tipo,
            grupoFormacion: grupo,
            orden,
            x,
            y,
            objetivoX: x,
            objetivoY: y,
            interactuable,
            arrastrable: true,
            paleta: this.paletasPorTipo[tipo],
            arrastrando: false,
            movio: false,
            fase: random(TWO_PI),
            escala: 1
        };
    }

    update() {
        const dentro = mouseX >= this.x && mouseX <= this.x + this.w &&
            mouseY >= this.y && mouseY <= this.y + this.h;
        const movimientoX = mouseX - this.ultimoMouseX;
        const movimientoY = mouseY - this.ultimoMouseY;
        const movimiento = sqrt(movimientoX ** 2 + movimientoY ** 2);

        if (dentro && mouseIsPressed) {
            if (!this.arrastrada && !this.mousePresionadoPrevio) this.iniciarArrastre();

            if (this.arrastrada) {
                this.arrastrada.x = constrain((mouseX - this.x) / this.w, 0.04, 0.96);
                this.arrastrada.y = constrain((mouseY - this.y) / this.h, 0.12, 0.92);
                if (movimiento > 1.5) this.arrastrada.movio = true;
                if (this.arrastrada.movio && !this.reagrupoDuranteArrastre &&
                    this.estaCercaDeSuFormacion()) {
                    this.reagrupar();
                }
            }
            this.mousePresionadoPrevio = true;
        } else {
            this.mousePresionadoPrevio = false;
        }

        this.ultimoMouseX = mouseX;
        this.ultimoMouseY = mouseY;

        for (const figura of this.figuras) {
            if (!figura.arrastrando) {
                figura.x = lerp(figura.x, figura.objetivoX, 0.14);
                figura.y = lerp(figura.y, figura.objetivoY, 0.14);
            }
            figura.escala = lerp(figura.escala, 1, 0.08);
        }

        if (!mouseIsPressed && this.arrastrada) this.mouseReleased();
    }

    iniciarArrastre() {
        const localX = mouseX - this.x;
        const localY = mouseY - this.y;
        const candidatas = this.figuras.filter(figura => figura.arrastrable);
        for (let indice = candidatas.length - 1; indice >= 0; indice--) {
            const figura = candidatas[indice];
            if (dist(localX, localY, figura.x * this.w, figura.y * this.h) < this.tamano * 0.9) {
                this.arrastrada = figura;
                figura.arrastrando = true;
                figura.movio = false;
                this.reagrupoDuranteArrastre = false;
                return;
            }
        }
    }

    estaCercaDeSuFormacion() {
        const grupoObjetivo = this.formaciones.findIndex(formacion => formacion.principal === this.arrastrada.tipo);
        if (grupoObjetivo < 0) return false;
        const formacion = this.formaciones[grupoObjetivo];
        return dist(this.arrastrada.x * this.w, this.arrastrada.y * this.h,
            formacion.centroX * this.w, formacion.centroY * this.h) < this.tamano * 3.4;
    }

    reagrupar() {
        this.ultimaReagrupacion = millis();
        this.reagrupoDuranteArrastre = true;
        const tiposAnteriores = this.formaciones.map(formacion => formacion.principal);
        const tiposNuevos = shuffle(["C", "Q", "T"], true);
        while (tiposNuevos.every((tipo, indice) => tipo === tiposAnteriores[indice])) {
            shuffle(tiposNuevos, true);
        }

        for (let grupo = 0; grupo < this.formaciones.length; grupo++) {
            const formacion = this.formaciones[grupo];
            const posiciones = shuffle(formacion.posiciones.slice(), true);
            formacion.principal = tiposNuevos[grupo];
            formacion.intruso = tiposNuevos[(grupo + 1) % tiposNuevos.length];
            const principales = this.figuras.filter(figura => figura.grupoFormacion === grupo && !figura.interactuable);
            principales.forEach((figura, indice) => {
                figura.tipo = formacion.principal;
                figura.paleta = this.paletasPorTipo[figura.tipo];
                EfectoVisualGlobal.configuraciones.delete(figura);
                figura.objetivoX = formacion.centroX + posiciones[indice][0];
                figura.objetivoY = formacion.centroY + posiciones[indice][1];
                figura.escala = 1.14;
            });
            const intruso = this.figuras.find(figura => figura.grupoFormacion === grupo && figura.interactuable);
            intruso.tipo = formacion.intruso;
            intruso.paleta = this.paletasPorTipo[intruso.tipo];
            EfectoVisualGlobal.configuraciones.delete(intruso);
            intruso.objetivoX = formacion.centroX + formacion.intrusoDesplazamiento[0];
            intruso.objetivoY = formacion.centroY + formacion.intrusoDesplazamiento[1];
            intruso.escala = 1.14;
        }
        this.arrastrada.escala = 1.14;
    }

    mousePressed() {
        this.ultimoMouseX = mouseX;
        this.ultimoMouseY = mouseY;
        this.mousePresionadoPrevio = false;
        this.reagrupoDuranteArrastre = false;
        if (this.arrastrada) {
            this.arrastrada.arrastrando = false;
            this.arrastrada = null;
        }
    }

    mouseReleased() {
        if (!this.arrastrada) return;
        this.arrastrada.arrastrando = false;
        this.arrastrada.x = this.arrastrada.objetivoX;
        this.arrastrada.y = this.arrastrada.objetivoY;
        this.arrastrada = null;
        this.ultimaReagrupacion = -1;
        this.reagrupoDuranteArrastre = false;
    }

    dibujarFigura(figura) {
        const derivaX = figura.interactuable ? sin(frameCount * 0.035 + figura.fase) * 2.5 : 0;
        const derivaY = figura.interactuable ? cos(frameCount * 0.028 + figura.fase) * 2.5 : 0;
        push();
        translate(this.x + figura.x * this.w + derivaX, this.y + figura.y * this.h + derivaY);
        scale(1.15 * figura.escala);
        EfectoVisualGlobal.dibujar(figura, figura.tipo, this.tamano);
        pop();
    }

    draw(actualizar = true) {
        if (actualizar) this.update();
        EfectoVisualGlobal.grupoActual = this.grupo;
        push();
        noStroke();
        fill(34, 34, 34);
        rect(this.x, this.y, this.w, this.h);
        for (const figura of this.figuras) this.dibujarFigura(figura);
        pop();
    }
}