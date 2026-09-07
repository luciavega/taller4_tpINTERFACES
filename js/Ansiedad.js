class Ansiedad {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "futuro";

        this.cuadrados = [];
        this.circulos = [];
        this.triangulos = [];
        this.figuras = [];

        this.figuraControl = null;
        this.figuraEnCentro = null;
        this.centrosOrganizacion = [];
        this.centroOrganizacion = { x: this.w * 0.50, y: this.h * 0.50 };
        this.radioOrganizacion = min(this.w, this.h) * 0.18;
        this.tamano = constrain(min(w, h) * 0.06, 22, 38);
        this.intensidadTemblor = 0;
        this.prevMouse = false;

        this.crearComposicion();
    }

    crearComposicion() {
        this.cuadrados = [];
        this.circulos = [];
        this.triangulos = [];
        this.figuras = [];

        this.centrosOrganizacion = [
            { x: this.w * 0.175, y: this.h * 0.50 },
            { x: this.w * 0.50, y: this.h * 0.50 },
            { x: this.w * 0.825, y: this.h * 0.50 }
        ];
        this.centroOrganizacion = this.centrosOrganizacion[1];
        this.radioOrganizacion = min(this.w, this.h) * 0.18;

        const grupos = [
            {
                tipos: ["C", "T", "Q", "C", "T", "Q"],
                posiciones: [[0, -0.18], [0.156, -0.09], [0.156, 0.09], [0, 0.18], [-0.156, 0.09], [-0.156, -0.09]]
            },
            {
                tipos: ["T", "C", "Q", "T", "C", "Q"],
                posiciones: [[0, -0.18], [0.156, -0.09], [0.156, 0.09], [0, 0.18], [-0.156, 0.09], [-0.156, -0.09]]
            },
            {
                tipos: ["Q", "T", "C", "Q", "T", "C"],
                posiciones: [[0, -0.18], [0.156, -0.09], [0.156, 0.09], [0, 0.18], [-0.156, 0.09], [-0.156, -0.09]]
            }
        ];

        for (let grupo = 0; grupo < grupos.length; grupo++) {
            const centro = this.centrosOrganizacion[grupo];
            const configuracion = grupos[grupo];
            for (let indice = 0; indice < configuracion.tipos.length; indice++) {
                const tipo = configuracion.tipos[indice];
                const posicion = configuracion.posiciones[indice];
                const posicionX = centro.x + posicion[0] * this.h;
                const posicionY = centro.y + posicion[1] * this.h;
                const figura = {
                    tipo,
                    grupo: this.grupo,
                    grupoOrganizacion: grupo,
                    origenX: posicionX,
                    origenY: posicionY,
                    x: posicionX,
                    y: posicionY,
                    indice: this.figuras.length,
                    tam: this.tamano,
                    vibracion: 0,
                    fase: random(TWO_PI)
                };

                this.figuras.push(figura);
                if (tipo === "C") this.circulos.push(figura);
                else if (tipo === "T") this.triangulos.push(figura);
                if (tipo === "Q") this.cuadrados.push(figura);
            }
        }
    }

    update() {
        let candidato = null;
        for (let figura of this.figuras) {
            const dx = mouseX - (this.x + figura.x);
            const dy = mouseY - (this.y + figura.y);
            if (sqrt(dx * dx + dy * dy) < figura.tam * 0.8) {
                candidato = figura;
                break;
            }
        }

        if (mouseIsPressed && this.figuraControl === null && candidato) {
            this.figuraControl = candidato;
            if (this.figuraEnCentro === candidato) this.figuraEnCentro = null;
        }

        if (this.figuraControl) {
            this.figuraControl.x = constrain(mouseX - this.x, this.figuraControl.tam / 2, this.w - this.figuraControl.tam / 2);
            this.figuraControl.y = constrain(mouseY - this.y, this.figuraControl.tam / 2, this.h - this.figuraControl.tam / 2);
        }

        const figuraActiva = this.figuraControl || this.figuraEnCentro;
        const centroActivo = figuraActiva
            ? this.centrosOrganizacion[figuraActiva.grupoOrganizacion]
            : this.centroOrganizacion;
        const distanciaCentro = figuraActiva
            ? dist(figuraActiva.x, figuraActiva.y, centroActivo.x, centroActivo.y)
            : this.w;
        this.intensidadTemblor = figuraActiva
            ? map(constrain(distanciaCentro, 0, this.radioOrganizacion), this.radioOrganizacion, 0, 0, 1)
            : 0;

        const reorganizando = figuraActiva && distanciaCentro < this.radioOrganizacion * 0.72;
        const figurasEnFormacion = figuraActiva
            ? this.figuras.filter(figura => figura.grupoOrganizacion === figuraActiva.grupoOrganizacion && figura !== figuraActiva)
            : [];

        for (let figura of this.figuras) {
            const perteneceAlGrupoActivo = figuraActiva && figura.grupoOrganizacion === figuraActiva.grupoOrganizacion;
            if (perteneceAlGrupoActivo && figura !== figuraActiva) {
                let destinoX = figura.origenX;
                let destinoY = figura.origenY;
                if (reorganizando) {
                    const posicion = figurasEnFormacion.indexOf(figura);
                    const angulo = -PI / 2 + posicion * TWO_PI / figurasEnFormacion.length;
                    const radioReorganizado = this.radioOrganizacion * 0.96;
                    destinoX = centroActivo.x + cos(angulo) * radioReorganizado;
                    destinoY = centroActivo.y + sin(angulo) * radioReorganizado;
                }
                figura.x = lerp(figura.x, destinoX, reorganizando ? 0.035 : 0.12);
                figura.y = lerp(figura.y, destinoY, reorganizando ? 0.035 : 0.12);
            }
        }

        const desordenPorGrupo = this.centrosOrganizacion.map(() => 0);
        for (let figura of this.figuras) {
            const distanciaDesorden = dist(
                figura.x,
                figura.y,
                figura.origenX,
                figura.origenY
            );
            const intensidadFigura = map(
                constrain(distanciaDesorden, 0, this.radioOrganizacion),
                0,
                this.radioOrganizacion,
                0,
                1
            );
            desordenPorGrupo[figura.grupoOrganizacion] = max(
                desordenPorGrupo[figura.grupoOrganizacion],
                intensidadFigura
            );
        }

        const gruposDesordenados = desordenPorGrupo.filter(intensidad => intensidad > 0.08).length;
        const multiplicadorTemblor = gruposDesordenados === 0
            ? 0
            : Math.pow(1.45, gruposDesordenados - 1);

        for (let figura of this.figuras) {
            const intensidadExponencial = Math.pow(
                desordenPorGrupo[figura.grupoOrganizacion],
                2.2
            );
            figura.vibracion = intensidadExponencial * 5 * multiplicadorTemblor;
        }

        if (!mouseIsPressed && this.prevMouse && this.figuraControl) {
            const distanciaOrigen = dist(
                this.figuraControl.x,
                this.figuraControl.y,
                this.figuraControl.origenX,
                this.figuraControl.origenY
            );
            const distanciaCentroAlSoltar = dist(
                this.figuraControl.x,
                this.figuraControl.y,
                this.centrosOrganizacion[this.figuraControl.grupoOrganizacion].x,
                this.centrosOrganizacion[this.figuraControl.grupoOrganizacion].y
            );
            if (distanciaOrigen < this.figuraControl.tam * 1.8) {
                this.figuraControl.x = this.figuraControl.origenX;
                this.figuraControl.y = this.figuraControl.origenY;
                this.figuraEnCentro = null;
            } else if (distanciaCentroAlSoltar < this.radioOrganizacion * 0.72) {
                this.figuraEnCentro = this.figuraControl;
            }
            this.figuraControl = null;
        }
        this.prevMouse = mouseIsPressed;
    }

    draw(actualizar = true) {
        if (actualizar) this.update();
        EfectoVisualGlobal.grupoActual = this.grupo;

        push();

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, this.h);
        drawingContext.clip();

        translate(this.x, this.y);

        noStroke();
        fill(34, 34, 34);
        rect(0, 0, this.w, this.h);

        // Renderizado de la formaciÃ³n circular mediante EfectoVisualGlobal
        for (let figura of this.figuras) {
            push();

            let reposoX = sin(frameCount * 0.03 + figura.fase) * figura.vibracion;
            let reposoY = cos(frameCount * 0.025 + figura.fase) * figura.vibracion;

            let vibX = random(-figura.vibracion, figura.vibracion);
            let vibY = random(-figura.vibracion, figura.vibracion);

            translate(
                figura.x + reposoX + vibX,
                figura.y + reposoY + vibY
            );

        //    if (figura.tipo === "Q") rotate(PI / 4);
            scale(1.15);

            EfectoVisualGlobal.dibujar(figura, figura.tipo, figura.tam);

            pop();
        }

        drawingContext.restore();
        pop();
    }
}