class Herencia {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "pasado";
        this.figuras = [];
        this.reinicioPendienteDesde = null;
        this.crearComposicion();
    }

    crearComposicion() {
        const tipos = [
            "C", "C", "C", "C",
            "Q", "Q", "Q", "Q",
            "T", "T", "T", "T"
        ];
        const tamanos = [
            48, 44, 40, 36,
            46, 42, 38, 34,
            44, 40, 36, 32
        ];
        const posiciones = [];

        for (let i = 0; i < tipos.length; i++) {
            const posicion = this.buscarPosicionInicial(tamanos[i], posiciones);
            const figura = this.crearFigura(
                tipos[i],
                tamanos[i],
                posicion.x,
                posicion.y,
                null,
                0,
                255
            );
            posiciones.push(figura);
            this.figuras.push(figura);
        }
    }

    crearFigura(tipo, tam, x, y, padre, generacion, opacidad) {
        return {
            tipo,
            tam,
            x,
            y,
            xObjetivo: x,
            yObjetivo: y,
            nacimientoX: x,
            nacimientoY: y,
            padre,
            hijos: [],
            generacion,
            visible: true,
            alpha: opacidad,
            targetOpacity: opacidad,
            escala: 1,
            activada: generacion === 0,
            reavivada: false,
            fijadaAl100: false,
            impulsoInicio: 0,
            nacimientoInicio: 0,
            nacimientoDuracion: 720,
            desvanecerDesde: Infinity
        };
    }

    buscarPosicionInicial(tam, ocupadas) {
        return this.buscarPosicion(null, tam, ocupadas, 0, true);
    }

    buscarPosicion(padre, tam, ocupadas, distanciaExtra, inicial = false) {
        const escalaVisual = 1.22;
        const separacion = 12;
        const radio = tam * escalaVisual / 2;
        const centroX = this.x + this.w / 2;
        const centroY = this.y + this.h / 2;
        const padreX = padre ? this.x + padre.xObjetivo * this.w : centroX;
        const padreY = padre ? this.y + padre.yObjetivo * this.h : centroY;
        const distanciaBase = inicial
            ? 0
            : padre.tam * escalaVisual / 2 + radio + distanciaExtra;
        const distanciaMaxima = inicial
            ? min(this.w, this.h) * 0.30
            : distanciaBase + (padre.generacion === 0 ? 82 : 58);
        const margen = radio + 18;
        let mejor = null;
        let mejorEspacio = -Infinity;

        for (let intento = 0; intento < 1400; intento++) {
            const angulo = random(TWO_PI);
            const distancia = inicial
                ? sqrt(random()) * distanciaMaxima
                : random(distanciaBase, distanciaMaxima);
            const candidato = {
                x: constrain(padreX + cos(angulo) * distancia, this.x + margen, this.x + this.w - margen),
                y: constrain(padreY + sin(angulo) * distancia, this.y + margen, this.y + this.h - margen)
            };
            let espacio = Infinity;

            for (let otra of ocupadas) {
                const otraRadio = otra.tam * escalaVisual / 2;
                const distanciaEntre = dist(
                    candidato.x,
                    candidato.y,
                    this.x + otra.xObjetivo * this.w,
                    this.y + otra.yObjetivo * this.h
                );
                espacio = min(espacio, distanciaEntre - radio - otraRadio - separacion);
            }

            if (espacio >= 0) {
                return {
                    x: (candidato.x - this.x) / this.w,
                    y: (candidato.y - this.y) / this.h
                };
            }

            if (espacio > mejorEspacio) {
                mejorEspacio = espacio;
                mejor = candidato;
            }
        }

        return {
            x: (mejor.x - this.x) / this.w,
            y: (mejor.y - this.y) / this.h
        };
    }

    obtenerTipoHijo(tipo) {
        return tipo === "C" ? "Q" : tipo === "Q" ? "T" : "C";
    }

    crearDescendencia(figura) {
        if (figura.hijos.length > 0) return;

        const tipoHijo = this.obtenerTipoHijo(figura.tipo);
        const tipoNieto = this.obtenerTipoHijo(tipoHijo);
        const ocupadas = this.figuras;
        const tamanosHijos = [
            max(18, figura.tam * 0.42),
            max(16, figura.tam * 0.35)
        ];

        for (let tam of tamanosHijos) {
            const posicion = this.buscarPosicion(figura, tam, ocupadas, 22);
            const hijo = this.crearFigura(tipoHijo, tam, posicion.x, posicion.y, figura, 1, 24);
            figura.hijos.push(hijo);
            this.figuras.push(hijo);
            ocupadas.push(hijo);

            const posicionNieto = this.buscarPosicion(hijo, tam * 0.64, ocupadas, 16);
            const nieto = this.crearFigura(tipoNieto, tam * 0.64, posicionNieto.x, posicionNieto.y, hijo, 2, 16);
            hijo.hijos.push(nieto);
            this.figuras.push(nieto);
            ocupadas.push(nieto);
        }
    }

    iniciarNacimiento(figura, inicio) {
        figura.nacimientoX = figura.padre.x;
        figura.nacimientoY = figura.padre.y;
        figura.x = figura.nacimientoX;
        figura.y = figura.nacimientoY;
        figura.nacimientoInicio = inicio;
        figura.escala = 0.18;
        figura.alpha = 16;
        figura.targetOpacity = 255;
    }

    activarRama(figura) {
        const ahora = millis();
        const cola = [{ figura, profundidad: 0 }];

        while (cola.length > 0) {
            const actual = cola.shift();
            const f = actual.figura;
            const inicio = ahora + actual.profundidad * 140;

            f.visible = true;
            f.activada = true;
            f.reavivada = true;
            f.impulsoInicio = inicio;
            f.targetOpacity = 255;
            f.desvanecerDesde = f.fijadaAl100 ? Infinity : inicio + 900;

            if (f.generacion > 0 && !f.fijadaAl100) {
                this.iniciarNacimiento(f, inicio);
            }

            for (let hijo of f.hijos) {
                cola.push({ figura: hijo, profundidad: actual.profundidad + 1 });
            }
        }
    }

    fijarRamaAl100(figura) {
        const cola = [figura];

        while (cola.length > 0) {
            const f = cola.shift();
            f.visible = true;
            f.activada = true;
            f.reavivada = true;
            f.fijadaAl100 = true;
            f.alpha = 255;
            f.targetOpacity = 255;
            f.impulsoInicio = millis();
            f.desvanecerDesde = Infinity;
            f.nacimientoInicio = 0;
            f.escala = 1;

            for (let hijo of f.hijos) cola.push(hijo);
        }
    }

    actualizarNacimiento(figura, ahora) {
        if (figura.generacion === 0 || figura.nacimientoInicio === 0 || ahora < figura.nacimientoInicio) return;

        const progreso = constrain((ahora - figura.nacimientoInicio) / figura.nacimientoDuracion, 0, 1);
        const suave = 1 - pow(1 - progreso, 3);
        figura.x = lerp(figura.nacimientoX, figura.xObjetivo, suave);
        figura.y = lerp(figura.nacimientoY, figura.yObjetivo, suave);
        figura.escala = lerp(0.18, 1, suave);
        figura.alpha = lerp(16, 255, suave);

        if (progreso >= 1) figura.nacimientoInicio = 0;
    }

    actualizarFigura(figura, ahora) {
        if (figura.fijadaAl100) {
            figura.alpha = 255;
            figura.targetOpacity = 255;
            return;
        }

        this.actualizarNacimiento(figura, ahora);
        if (ahora >= figura.impulsoInicio) {
            figura.alpha = lerp(figura.alpha, figura.targetOpacity, 0.12);
        }

        if (ahora >= figura.desvanecerDesde) {
            const opacidadResidual = figura.generacion === 0 ? 105 : figura.generacion === 1 ? 92 : 32;
            figura.targetOpacity = opacidadResidual;
            figura.alpha = lerp(figura.alpha, figura.targetOpacity, 0.018);
        }
    }

    update() {
        const ahora = millis();
        for (let figura of this.figuras) {
            if (figura.visible) this.actualizarFigura(figura, ahora);
        }

        const escenaCompleta = this.figuras.length > 0 && this.figuras.every(figura =>
            figura.fijadaAl100 && figura.alpha >= 255
        );
        if (escenaCompleta && this.reinicioPendienteDesde === null) {
            this.reinicioPendienteDesde = ahora;
        }
        if (this.reinicioPendienteDesde !== null) {
            if (ahora - this.reinicioPendienteDesde >= 1500) this.reset();
        } else if (!escenaCompleta) {
            this.reinicioPendienteDesde = null;
        }
    }

    reset() {
        this.figuras = [];
        this.reinicioPendienteDesde = null;
        this.crearComposicion();
    }

    obtenerPosicion(figura) {
        return {
            x: this.x + figura.x * this.w,
            y: this.y + figura.y * this.h
        };
    }

    mousePressed() {
        const dentro = mouseX >= this.x && mouseX <= this.x + this.w &&
            mouseY >= this.y && mouseY <= this.y + this.h;
        if (!dentro) return;

        for (let figura of this.figuras) {
            if (!figura.visible) continue;
            const posicion = this.obtenerPosicion(figura);
            if (dist(mouseX, mouseY, posicion.x, posicion.y) < figura.tam * 0.7) {
                const estabaDesvaneciendose = figura.activada &&
                    figura.reavivada &&
                    !figura.fijadaAl100 &&
                    figura.alpha < 250;

                if (estabaDesvaneciendose) {
                    this.fijarRamaAl100(figura);
                } else {
                    this.crearDescendencia(figura);
                    this.activarRama(figura);
                }
                break;
            }
        }
    }

    dibujarFigura(figura) {
        const posicion = this.obtenerPosicion(figura);
        push();
        translate(posicion.x, posicion.y);
        scale(figura.escala * 1.22);
        drawingContext.globalAlpha = map(figura.alpha, 0, 255, 0, 1);
        EfectoVisualGlobal.dibujar(figura, figura.tipo, figura.tam);
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

        for (let figura of this.figuras) {
            if (figura.visible) this.dibujarFigura(figura);
        }

        drawingContext.restore();
        pop();
    }
}
