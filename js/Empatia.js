class Empatia {

    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.grupo = "presente";

        this.figuraArrastrada = null;
        this.grupoOrigen = null;
        this.grupoDestino = null;

        this.crearComposicion();
    }


    // =========================================================
    // CREAR COMPOSICIÓN
    // =========================================================

    crearComposicion() {

        let rosa = color(255, 0, 120);
        let amarillo = color(255, 200, 0);
        let azul = color(40, 120, 255);


        this.figuras = [

            // CÍRCULOS

            {
                id: 0,
                tipo: "C",
                grupo: "circulos",
                grupoOriginal: "circulos",
                tam: 30,
                tamVisual: 30,
                x: 0.16 + random(-0.018, 0.018),
                y: 0.35 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: rosa,
                offsetFase: 0,
                fase: random(TWO_PI)
            },

            {
                id: 1,
                tipo: "C",
                grupo: "circulos",
                grupoOriginal: "circulos",
                tam: 30,
                tamVisual: 30,
                x: 0.27 + random(-0.018, 0.018),
                y: 0.52 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: rosa,
                offsetFase: 2,
                fase: random(TWO_PI)
            },

            {
                id: 2,
                tipo: "C",
                grupo: "circulos",
                grupoOriginal: "circulos",
                tam: 30,
                tamVisual: 30,
                x: 0.18 + random(-0.018, 0.018),
                y: 0.68 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: rosa,
                offsetFase: 4,
                fase: random(TWO_PI)
            },


            // CUADRADOS

            {
                id: 3,
                tipo: "Q",
                grupo: "cuadrados",
                grupoOriginal: "cuadrados",
                tam: 52,
                tamVisual: 52,
                x: 0.46 + random(-0.018, 0.018),
                y: 0.30 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: amarillo,
                offsetFase: 0,
                fase: random(TWO_PI)
            },

            {
                id: 4,
                tipo: "Q",
                grupo: "cuadrados",
                grupoOriginal: "cuadrados",
                tam: 52,
                tamVisual: 52,
                x: 0.55 + random(-0.018, 0.018),
                y: 0.50 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: amarillo,
                offsetFase: 2,
                fase: random(TWO_PI)
            },

            {
                id: 5,
                tipo: "Q",
                grupo: "cuadrados",
                grupoOriginal: "cuadrados",
                tam: 52,
                tamVisual: 52,
                x: 0.45 + random(-0.018, 0.018),
                y: 0.68 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: amarillo,
                offsetFase: 4,
                fase: random(TWO_PI)
            },


            // TRIÁNGULOS

            {
                id: 6,
                tipo: "T",
                grupo: "triangulos",
                grupoOriginal: "triangulos",
                tam: 110,
                tamVisual: 110,
                x: 0.72 + random(-0.018, 0.018),
                y: 0.35 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: azul,
                offsetFase: 0,
                fase: random(TWO_PI)
            },

            {
                id: 7,
                tipo: "T",
                grupo: "triangulos",
                grupoOriginal: "triangulos",
                tam: 110,
                tamVisual: 110,
                x: 0.83 + random(-0.018, 0.018),
                y: 0.50 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: azul,
                offsetFase: 2,
                fase: random(TWO_PI)
            },

            {
                id: 8,
                tipo: "T",
                grupo: "triangulos",
                grupoOriginal: "triangulos",
                tam: 110,
                tamVisual: 110,
                x: 0.72 + random(-0.018, 0.018),
                y: 0.67 + random(-0.025, 0.025),
                baseX: 0,
                baseY: 0,
                c: azul,
                offsetFase: 4,
                fase: random(TWO_PI)
            }
        ];

        for (const figura of this.figuras) {
            figura.baseX = figura.x;
            figura.baseY = figura.y;
            figura.tamObjetivo = figura.tam;
        }
    }


    // =========================================================
    // DETECTAR ZONA
    // =========================================================

    detectarGrupo(x) {

        let posicion =
            (x - this.x) / this.w;


        if (posicion < 1 / 3) {
            return "circulos";
        }

        if (posicion < 2 / 3) {
            return "cuadrados";
        }

        return "triangulos";
    }


    // =========================================================
    // CAMBIAR VISUALMENTE TODO EL GRUPO
    // =========================================================

    cambiarTamanoGrupo(nombreGrupo, nuevoTamano) {

        for (let f of this.figuras) {

            // IMPORTANTE:
            // solamente modificamos las figuras
            // ORIGINALES de ese grupo.

            if (
                f.grupoOriginal === nombreGrupo
            ) {

                f.tamObjetivo =
                    nuevoTamano;
            }
        }
    }


    // =========================================================
    // RESTAURAR TODO EL GRUPO
    // =========================================================

    restaurarGrupo(nombreGrupo) {

        for (let f of this.figuras) {

            if (
                f.grupoOriginal === nombreGrupo
            ) {

                f.tamObjetivo =
                    f.tam;
            }
        }
    }


    // =========================================================
    // UPDATE
    // =========================================================

    update() {

        let dentroPanel =
            mouseX >= this.x &&
            mouseX <= this.x + this.w &&
            mouseY >= this.y &&
            mouseY <= this.y + this.h;


        // =====================================================
        // MOUSE PRESIONADO
        // =====================================================

        if (
            dentroPanel &&
            mouseIsPressed
        ) {


            // =================================================
            // SELECCIONAR FIGURA
            // =================================================

            if (!this.figuraArrastrada) {

                for (let f of this.figuras) {

                    let px =
                        this.x + f.x * this.w;

                    let py =
                        this.y + f.y * this.h;


                    if (
                        dist(
                            mouseX,
                            mouseY,
                            px,
                            py
                        ) < f.tamVisual / 2
                    ) {

                        this.figuraArrastrada =
                            f;

                        this.grupoOrigen =
                            f.grupo;

                        this.grupoDestino =
                            null;


                        // -------------------------------------
                        // SI ESTABA DENTRO DE OTRO GRUPO,
                        // LO RESTAURAMOS
                        // -------------------------------------

                        if (
                            this.grupoOrigen &&
                            this.grupoOrigen !== f.grupoOriginal
                        ) {

                            this.restaurarGrupo(
                                this.grupoOrigen
                            );
                        }


                        // Si era una figura original de su grupo
                        // y ese grupo estaba modificado,
                        // también vuelve a su tamaño base.

                        if (this.grupoOrigen) {

                            this.restaurarGrupo(
                                this.grupoOrigen
                            );
                        }


                        // La figura queda temporalmente fuera.

                        f.grupo = null;


                        // Conserva SIEMPRE su tamaño original.

                        f.tamVisual =
                            f.tam;


                        break;
                    }
                }
            }


            // =================================================
            // MOVER FIGURA
            // =================================================

            if (this.figuraArrastrada) {

                let f =
                    this.figuraArrastrada;


                let nuevoX =
                    constrain(
                        mouseX,
                        this.x,
                        this.x + this.w
                    );


                let nuevoY =
                    constrain(
                        mouseY,
                        this.y,
                        this.y + this.h
                    );


                f.x =
                    (nuevoX - this.x) / this.w;


                f.y =
                    (nuevoY - this.y) / this.h;


                // ---------------------------------------------
                // DETECTAR ZONA
                // ---------------------------------------------

                let grupoActual =
                    this.detectarGrupo(
                        nuevoX
                    );


                // ---------------------------------------------
                // ENTRÓ EN OTRO GRUPO
                // ---------------------------------------------

                if (
                    grupoActual &&
                    grupoActual !== this.grupoOrigen
                ) {


                    // Si cambió de grupo destino,
                    // restauramos el anterior.

                    if (
                        this.grupoDestino &&
                        this.grupoDestino !== grupoActual
                    ) {

                        this.restaurarGrupo(
                            this.grupoDestino
                        );
                    }


                    this.grupoDestino =
                        grupoActual;


                    // =================================================
                    // ACÁ ESTÁ LA CLAVE
                    // =================================================
                    //
                    // Modificamos explícitamente las 3 figuras.
                    // =================================================

                    this.cambiarTamanoGrupo(
                        grupoActual,
                        f.tam
                    );


                    // La figura arrastrada mantiene
                    // su propio tamaño.

                    f.tamVisual =
                        f.tam;
                }


                // ---------------------------------------------
                // VOLVIÓ AL GRUPO ORIGINAL
                // ---------------------------------------------

                else if (
                    grupoActual === this.grupoOrigen
                ) {

                    if (this.grupoDestino) {

                        this.restaurarGrupo(
                            this.grupoDestino
                        );
                    }


                    this.restaurarGrupo(
                        this.grupoOrigen
                    );


                    this.grupoDestino =
                        null;


                    f.tamVisual =
                        f.tam;
                }
            }
        }


        // =====================================================
        // MOUSE SOLTADO
        // =====================================================

        else {

            if (this.figuraArrastrada) {

                let f =
                    this.figuraArrastrada;


                if (this.grupoDestino) {

                    // La figura queda en el nuevo grupo.

                    f.grupo =
                        this.grupoDestino;


                    // PERO mantiene su tamaño propio.

                    f.tamVisual =
                        f.tam;
                }

                else {

            for (const figura of this.figuras) {
                if (figura !== this.figuraArrastrada) {
                    const objetivoX = figura.baseX + sin(frameCount * 0.012 + figura.fase) * 0.018;
                    const objetivoY = figura.baseY + cos(frameCount * 0.010 + figura.fase) * 0.018;
                    figura.x = lerp(figura.x, objetivoX, 0.035);
                    figura.y = lerp(figura.y, objetivoY, 0.035);
                }
            }
                    f.grupo = null;

                    f.tamVisual =
                        f.tam;
                }

                    f.baseX = f.x;
                    f.baseY = f.y;

                this.figuraArrastrada =
                    null;

                this.grupoOrigen =
                    null;
            }
        }

        for (const figura of this.figuras) {
            figura.tamVisual = lerp(figura.tamVisual, figura.tamObjetivo, 0.12);
        }
    }


    // =========================================================
    // DIBUJAR
    // =========================================================

    dibujarFigura(f) {
        const px = this.x + f.x * this.w;
        const py = this.y + f.y * this.h;
        const tam = f.tamVisual;

        push();
        translate(px, py);
        noStroke();

        if (f !== this.figuraArrastrada) {
            translate(
                sin(frameCount * 0.03 + f.fase) * 10,
                cos(frameCount * 0.025 + f.fase) * 10
            );
        }

        if (f.tipo === "Q") {
            rotate(frameCount * 0.012 + f.fase);
        }

        if (f.tipo === "T") {
            translate(
                sin(frameCount * 0.12 + f.fase) * 3.5,
                cos(frameCount * 0.16 + f.fase) * 3.5
            );
            rotate(sin(frameCount * 0.28 + f.fase) * 0.025);
        }

        const escalaVisual = f.tipo === "C"
            ? 1 + sin(frameCount * 0.032 + f.fase) * 0.16
            : 1.06;
        scale(escalaVisual);
        EfectoVisualGlobal.dibujar(f, f.tipo, tam);
        pop();
    }


    // =========================================================
    // DRAW
    // =========================================================

    draw(actualizar = true) {

        if (actualizar) {
            this.update();
        }


        EfectoVisualGlobal.grupoActual =
            this.grupo;


        push();


        drawingContext.save();

        drawingContext.beginPath();

        drawingContext.rect(
            this.x,
            this.y,
            this.w,
            this.h
        );

        drawingContext.clip();


        // Fondo

        noStroke();

        fill(34, 34, 34);

        rect(
            this.x,
            this.y,
            this.w,
            this.h
        );


        // Figuras

        for (let f of this.figuras) {

            this.dibujarFigura(f);
        }


        drawingContext.restore();

        pop();
    }
}
