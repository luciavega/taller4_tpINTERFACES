// =====================================================
// EFECTO VISUAL GLOBAL (Versión Optimizada 60 FPS)
// =====================================================

const EfectoVisualGlobal = {

    paletas: {
        C: [
            [[20, 50, 255], [80, 20, 255], [220, 20, 220], [255, 70, 150]],
            [[0, 110, 255], [40, 180, 255], [190, 50, 230], [255, 40, 170]],
            [[40, 20, 220], [100, 40, 255], [240, 30, 190], [255, 90, 180]],
            [[0, 80, 230], [80, 0, 255], [200, 0, 220], [255, 50, 120]]
        ],
        Q: [
            [[255, 30, 40], [255, 70, 20], [255, 150, 20], [255, 220, 40]],
            [[220, 20, 30], [255, 60, 20], [255, 130, 10], [255, 210, 30]],
            [[255, 40, 20], [255, 100, 10], [255, 180, 20], [255, 235, 60]],
            [[230, 20, 40], [255, 80, 20], [255, 160, 30], [255, 230, 50]]
        ],
        T: [
            [[255, 230, 30], [180, 240, 60], [80, 230, 180], [30, 190, 230]],
            [[255, 210, 20], [210, 240, 60], [80, 220, 190], [40, 170, 230]],
            [[255, 240, 50], [190, 235, 80], [60, 210, 200], [30, 160, 230]],
            [[255, 220, 30], [160, 240, 100], [70, 230, 190], [20, 180, 220]]
        ]
    },

    intensidadColor: 0.012,
    cantidadTextura: 250, // Optimizado: suficiente densidad visual
    configuraciones: new WeakMap(),

    dibujar(fig, tipo, tamano) {
        this.inicializarFigura(fig, tipo, tamano);
        this.aplicarGradienteYTextura(fig, tipo, tamano);
    },

    inicializarFigura(fig, tipo, tamano) {
        if (this.configuraciones.has(fig)) return;

        const grupo = this.paletas[tipo];
        const paleta = random(grupo);
        const fase = random(TWO_PI);

        // Generamos la textura estática de forma local una sola vez
        const texturaPuntos = [];
        for (let i = 0; i < this.cantidadTextura; i++) {
            texturaPuntos.push({
                x: random(-tamano / 2, tamano / 2),
                y: random(-tamano / 2, tamano / 2),
                tam: random(1.2, 2.2),
                opacidad: random(0.02, 0.06) // Mapeado directo a alfa CSS (0.0 a 1.0)
            });
        }

        this.configuraciones.set(fig, { paleta, fase, texturaPuntos });
    },

    trazarRutaForma(ctx, tipo, tamano) {
        ctx.beginPath();
        if (tipo === "Q") {
            ctx.rect(-tamano / 2, -tamano / 2, tamano, tamano);
        } else if (tipo === "C") {
            ctx.arc(0, 0, tamano / 2, 0, TWO_PI);
        } else if (tipo === "T") {
            ctx.moveTo(0, -tamano / 2);
            ctx.lineTo(tamano / 2, tamano / 2);
            ctx.lineTo(-tamano / 2, tamano / 2);
            ctx.closePath();
        }
    },

    aplicarGradienteYTextura(fig, tipo, tamano) {
        const config = this.configuraciones.get(fig);
        const ctx = drawingContext;
        const tiempo = millis() * 0.00015 + config.fase;

        // Cálculos del gradiente animado
        const offsetX = sin(tiempo * 0.7) * tamano * 0.18 + cos(tiempo * 1.3) * tamano * 0.08;
        const offsetY = cos(tiempo * 0.5) * tamano * 0.18 + sin(tiempo * 1.1) * tamano * 0.08;
        const angulo = sin(tiempo * 0.4) * PI + cos(tiempo * 0.15) * 0.7;
        const radio = tamano * 0.9;

        const x1 = offsetX + cos(angulo) * radio;
        const y1 = offsetY + sin(angulo) * radio;
        const x2 = offsetX - cos(angulo) * radio;
        const y2 = offsetY - sin(angulo) * radio;

        const gradiente = ctx.createLinearGradient(x1, y1, x2, y2);

        // Asignación de colores
        for (let i = 0; i < config.paleta.length; i++) {
            const base = config.paleta[i];
            const dif = sin(tiempo * (0.4 + i * 0.15)) * this.intensidadColor;

            const r = constrain(base[0] + base[0] * dif, 0, 255);
            const g = constrain(base[1] + base[1] * dif, 0, 255);
            const b = constrain(base[2] + base[2] * dif, 0, 255);

            gradiente.addColorStop(i / (config.paleta.length - 1), `rgb(${r},${g},${b})`);
        }

        ctx.save();

        // 1. DIBUJAR RELLENO GRADIENTE
        this.trazarRutaForma(ctx, tipo, tamano);
        ctx.fillStyle = gradiente;
        ctx.fill();

        // 2. APLICAR TEXTURA CON MÁSCARA DIRECTA
        ctx.clip(); // Limita el dibujo de las motas de polvo dentro de la forma activa
        ctx.fillStyle = "white";

        for (let i = 0; i < config.texturaPuntos.length; i++) {
            const p = config.texturaPuntos[i];
            ctx.globalAlpha = p.opacidad;
            ctx.fillRect(p.x, p.y, p.tam, p.tam); // fillRect es x100 más rápido que arc/ellipse
        }

        ctx.restore();
    }
};