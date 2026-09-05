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
        this.centroOrganizacion = { x: this.w * 0.52, y: this.h * 0.50 };
        this.radioOrganizacion = min(this.w, this.h) * 0.34;
        this.intensidadTemblor = 0;
        this.prevMouse = false;

        this.crearComposicion();
    }

    crearComposicion() {
        this.cuadrados = [];
        this.circulos = [];
        this.triangulos = [];
        this.figuras = [];

        this.centroOrganizacion = { x: this.w * 0.52, y: this.h * 0.50 };
        this.radioOrganizacion = min(this.w, this.h) * 0.34;

        const tipos = ["C", "T", "Q", "C", "Q", "T", "C", "T", "Q", "C", "Q", "T"];
        for (let indice = 0; indice < tipos.length; indice++) {
            const angulo = -PI / 2 + indice * TWO_PI / tipos.length;
            const posicionX = this.centroOrganizacion.x + cos(angulo) * this.radioOrganizacion;
            const posicionY = this.centroOrganizacion.y + sin(angulo) * this.radioOrganizacion;
            const figura = {
                tipo: tipos[indice],
                origenX: posicionX,
                origenY: posicionY,
                x: posicionX,
                y: posicionY,
                indice: indice,
                tam: min(this.w, this.h) * (tipos[indice] === "C" ? 0.075 : 0.07),
                vibracion: 0,
                fase: random(TWO_PI)
            };

            this.figuras.push(figura);
            if (figura.tipo === "C") this.circulos.push(figura);
            else this.triangulos.push(figura);
            if (figura.tipo === "Q") this.cuadrados.push(figura);
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
        const distanciaCentro = figuraActiva
            ? dist(figuraActiva.x, figuraActiva.y, this.centroOrganizacion.x, this.centroOrganizacion.y)
            : this.w;
        this.intensidadTemblor = figuraActiva
            ? map(constrain(distanciaCentro, 0, this.radioOrganizacion), this.radioOrganizacion, 0, 0, 1)
            : 0;

        const reorganizando = figuraActiva && distanciaCentro < this.radioOrganizacion * 0.72;
        const figurasEnFormacion = this.figuras.filter(figura => figura !== figuraActiva);
        for (let figura of this.figuras) {
            figura.vibracion = figura === figuraActiva
                ? this.intensidadTemblor * 9
                : reorganizando ? this.intensidadTemblor * 3.5 : 0;

            if (figura !== figuraActiva) {
                let destinoX = figura.origenX;
                let destinoY = figura.origenY;
                if (reorganizando) {
                    const posicion = figurasEnFormacion.indexOf(figura);
                    const angulo = -PI / 2 + posicion * TWO_PI / figurasEnFormacion.length;
                    const radioReorganizado = this.radioOrganizacion * 0.96;
                    destinoX = this.centroOrganizacion.x + cos(angulo) * radioReorganizado;
                    destinoY = this.centroOrganizacion.y + sin(angulo) * radioReorganizado;
                }
                figura.x = lerp(figura.x, destinoX, reorganizando ? 0.035 : 0.12);
                figura.y = lerp(figura.y, destinoY, reorganizando ? 0.035 : 0.12);
            }
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
                this.centroOrganizacion.x,
                this.centroOrganizacion.y
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

        // Renderizado de la formación circular mediante EfectoVisualGlobal
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

            if (figura.tipo === "Q") rotate(PI / 4);
            scale(1.25);

            EfectoVisualGlobal.dibujar(figura, figura.tipo, figura.tam);

            pop();
        }

        drawingContext.restore();
        pop();
    }
}