class Sistema {

    constructor() {
        this.currentScreen = "menu";
        this.paneles = [];
        this.crearGrilla();
    }

    crearGrilla() {
        this.paneles = [
            new Memoria(0, 0, width, height),
            new Herencia(0, 0, width, height),
            new Caducidad(0, 0, width, height),
            new Identidad(0, 0, width, height),
            new Empatia(0, 0, width, height),
            new Colaboracion(0, 0, width, height),
            new Incertidumbre(0, 0, width, height),
            new Ansiedad(0, 0, width, height),
            new Expectativa(0, 0, width, height)
        ];
    }

    update() {
        if (this.currentScreen !== "menu") {
            this.paneles[this.currentScreen].update();
        }
    }

    calcularMiniaturas() {
        const columnas = width < 768 ? 2 : 3;
        const filas = ceil(this.paneles.length / columnas);
        const margen = constrain(min(width, height) * (width < 768 ? 0.035 : 0.055), 12, 56);
        const separacion = constrain(min(width, height) * (width < 768 ? 0.016 : 0.018), 8, 20);
        const ancho = (width - margen * 2 - separacion * (columnas - 1)) / columnas;
        const alto = (height - margen * 2 - separacion * (filas - 1)) / filas;

        return this.paneles.map((panel, indice) => ({
            x: width < 768 && indice === this.paneles.length - 1
                ? (width - ancho) / 2
                : margen + (indice % columnas) * (ancho + separacion),
            y: margen + floor(indice / columnas) * (alto + separacion),
            w: ancho,
            h: alto
        }));
    }

    obtenerNombrePanel(indice) {
        return [
            "Memoria",
            "Herencia",
            "Caducidad",
            "Identidad",
            "Empatia",
            "Colaboracion",
            "Incertidumbre",
            "Ansiedad",
            "Expectativa"
        ][indice];
    }

    dibujarBotonVolver() {
        const tam = constrain(min(width, height) * 0.065, 38, 54);
        const x = 14;
        const y = 14;
        const encima = mouseX >= x && mouseX <= x + tam &&
            mouseY >= y && mouseY <= y + tam;

        push();
        noFill();
        stroke(255, encima ? 240 : 165);
        strokeWeight(encima ? 2.5 : 1.8);
        line(x + tam * 0.68, y + tam * 0.5, x + tam * 0.28, y + tam * 0.5);
        line(x + tam * 0.28, y + tam * 0.5, x + tam * 0.48, y + tam * 0.30);
        line(x + tam * 0.28, y + tam * 0.5, x + tam * 0.48, y + tam * 0.70);
        pop();
    }

    drawMenu() {
        const miniaturas = this.calcularMiniaturas();

        for (let i = 0; i < this.paneles.length; i++) {
            const panel = this.paneles[i];
            const miniatura = miniaturas[i];
            const encima = mouseX >= miniatura.x &&
                mouseX <= miniatura.x + miniatura.w &&
                mouseY >= miniatura.y &&
                mouseY <= miniatura.y + miniatura.h;
            const crecimiento = encima ? 1.018 : 1;
            const x = miniatura.x + miniatura.w * (1 - crecimiento) / 2;
            const y = miniatura.y + miniatura.h * (1 - crecimiento) / 2;
            const radio = constrain(min(miniatura.w, miniatura.h) * 0.08, 8, 18);
            const colores = i < 3
                ? [[156, 69, 32], [234, 139, 47]]
                : i < 6
                    ? [[20, 155, 68], [76, 225, 112]]
                    : [[12, 66, 190], [38, 137, 235], [224, 244, 255]];

            push();
            translate(x, y);
            scale(crecimiento);
            scale(miniatura.w / width, miniatura.h / height);
            const intensidadGlowAnterior = EfectoVisualGlobal.intensidadGlow;
            EfectoVisualGlobal.intensidadGlow = 0.58;
            panel.draw(false);
            EfectoVisualGlobal.intensidadGlow = intensidadGlowAnterior;
            pop();

            const ctx = drawingContext;
            const gradiente = ctx.createLinearGradient(
                miniatura.x, miniatura.y,
                miniatura.x + miniatura.w, miniatura.y + miniatura.h
            );
            gradiente.addColorStop(0, `rgba(${colores[0][0]},${colores[0][1]},${colores[0][2]},${encima ? 0.18 : 0.10})`);
            if (colores[2]) {
                gradiente.addColorStop(0.48, `rgba(${colores[1][0]},${colores[1][1]},${colores[1][2]},${encima ? 0.20 : 0.11})`);
                gradiente.addColorStop(0.58, `rgba(${colores[2][0]},${colores[2][1]},${colores[2][2]},${encima ? 0.30 : 0.18})`);
                gradiente.addColorStop(1, `rgba(${colores[0][0]},${colores[0][1]},${colores[0][2]},${encima ? 0.20 : 0.10})`);
            } else {
                gradiente.addColorStop(1, `rgba(${colores[1][0]},${colores[1][1]},${colores[1][2]},${encima ? 0.16 : 0.07})`);
            }

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(miniatura.x, miniatura.y, miniatura.w, miniatura.h, radio);
            ctx.fillStyle = gradiente;
            ctx.fill();
            ctx.shadowColor = `rgba(${colores[1][0]},${colores[1][1]},${colores[1][2]},${encima ? 0.50 : 0.24})`;
            ctx.shadowBlur = encima ? 22 : 14;
            ctx.lineWidth = encima ? 2 : 1;
            ctx.strokeStyle = `rgba(${colores[1][0]},${colores[1][1]},${colores[1][2]},${encima ? 0.70 : 0.38})`;
            ctx.stroke();

            if (i < 3) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(miniatura.x, miniatura.y, miniatura.w, miniatura.h, radio);
                ctx.clip();
                for (let punto = 0; punto < 772; punto++) {
                    const px = miniatura.x + ((punto * 167 + i * 19) % miniatura.w);
                    const py = miniatura.y + ((punto * 23 + i * 13) % miniatura.h);
                    const opacidad = 0.03 + ((punto * 17 + i * 7) % 8) / 1000;
                    const tamano = 0.55 + ((punto * 11 + i * 5) % 6) / 10;
                    ctx.fillStyle = `rgba(255, 220, 165, ${opacidad})`;
                    ctx.fillRect(px, py, tamano, tamano);
                }
                ctx.restore();
            }

            ctx.restore();

            const alturaEtiqueta = constrain(min(width, height) * 0.045, 22, 34);
            const nombre = this.obtenerNombrePanel(i);
            push();
            textSize(constrain(min(width, height) * 0.024, 12, 20));
            textStyle(NORMAL);
            noStroke();
            textAlign(LEFT, CENTER);
            fill(colores[1][0], colores[1][1], colores[1][2], 230);
            text(nombre, miniatura.x + 14, miniatura.y + 8 + alturaEtiqueta / 2);
            pop();
        }
    }

    draw() {
        if (this.currentScreen === "menu") {
            this.drawMenu();
            return;
        }

        this.paneles[this.currentScreen].draw();
        this.dibujarBotonVolver();
    }

    mousePressed() {
        if (this.currentScreen === "menu") {
            const miniaturas = this.calcularMiniaturas();
            for (let i = 0; i < miniaturas.length; i++) {
                const miniatura = miniaturas[i];
                if (mouseX >= miniatura.x && mouseX <= miniatura.x + miniatura.w &&
                    mouseY >= miniatura.y && mouseY <= miniatura.y + miniatura.h) {
                    this.currentScreen = i;
                    return;
                }
            }
            return;
        }

        const botonTam = constrain(min(width, height) * 0.065, 38, 54);
        if (mouseX >= 14 && mouseX <= 14 + botonTam &&
            mouseY >= 14 && mouseY <= 14 + botonTam) {
            this.currentScreen = "menu";
            this.crearGrilla();
            return;
        }

        const panel = this.paneles[this.currentScreen];
        if (typeof panel.mousePressed === "function") {
            panel.mousePressed();
        }
    }

    mouseReleased() {
        if (this.currentScreen === "menu") return;

        const panel = this.paneles[this.currentScreen];
        if (typeof panel.mouseReleased === "function") {
            panel.mouseReleased();
        }
    }
}
