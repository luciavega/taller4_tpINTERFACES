// =====================================================
// EFECTO VISUAL GLOBAL (Versión Optimizada 60 FPS)
// =====================================================

const EfectoVisualGlobal = {

    grupoActual: "pasado",

    paletas: {
        C: [
            [[140, 94, 52], [188, 128, 75], [217, 170, 110], [242, 210, 150]],
            [[115, 205, 136], [72, 120, 255], [165, 108, 255], [255, 145, 75]],
            [[255, 92, 182], [255, 159, 72], [101, 216, 255], [92, 101, 255]]
        ],
        Q: [
            [[155, 96, 52], [203, 135, 82], [232, 170, 110], [245, 210, 145]],
            [[120, 210, 145], [75, 128, 255], [180, 95, 255], [255, 120, 90]],
            [[255, 100, 183], [255, 175, 65], [95, 225, 255], [99, 110, 255]]
        ],
        T: [
            [[135, 90, 52], [185, 125, 75], [221, 167, 104], [245, 214, 158]],
            [[100, 198, 150], [87, 122, 255], [188, 101, 255], [255, 155, 80]],
            [[255, 94, 180], [255, 170, 70], [92, 220, 255], [94, 110, 255]]
        ]
    },

    estilos: {
        pasado: {
            paletas: {
                C: [
                    [[196, 70, 54], [180, 80, 48], [207, 112, 54], [150, 63, 46]],
                    [[178, 62, 52], [197, 89, 48], [216, 125, 58], [143, 58, 46]],
                    [[205, 82, 55], [185, 75, 48], [212, 118, 58], [155, 65, 47]]
                ],
                Q: [
                    [[150, 62, 48], [183, 78, 45], [222, 124, 48], [238, 160, 70]],
                    [[166, 67, 48], [190, 86, 46], [226, 132, 52], [242, 174, 78]],
                    [[143, 58, 47], [177, 74, 44], [216, 116, 46], [235, 153, 67]]
                ],
                T: [
                    [[215, 108, 34], [232, 143, 54], [242, 190, 103], [247, 239, 211]],
                    [[201, 92, 30], [226, 132, 47], [239, 181, 91], [245, 235, 204]],
                    [[222, 116, 37], [235, 151, 59], [244, 197, 109], [248, 241, 218]]
                ]
            },
            intensidadColor: 0.008,
            intensidadGlow: 0.5,
            ruidoMin: 0.09,
            ruidoMax: 0.1,
            sombra: "rgba(72, 28, 18, 0.16)",
            sombraBrillante: "rgba(255, 176, 92, 0.12)",
            blur: 0.18
        },
        presente: {
            paletas: {
                C: [
                    [[205, 35, 220], [175, 35, 220], [75, 80, 220], [15, 125, 210]],
                    [[220, 40, 210], [185, 38, 220], [80, 88, 228], [18, 135, 220]],
                    [[195, 25, 225], [165, 28, 225], [65, 72, 215], [10, 115, 200]]
                ],
                Q: [
                    [[255, 85, 0], [255, 125, 0], [255, 180, 0], [255, 220, 25]],
                    [[255, 72, 0], [255, 112, 0], [255, 170, 0], [255, 210, 18]],
                    [[255, 96, 0], [255, 138, 0], [255, 190, 0], [255, 228, 32]]
                ],
                T: [
                    [[25, 190, 70], [55, 215, 45], [180, 230, 20], [255, 225, 30]],
                    [[18, 178, 62], [48, 207, 38], [168, 222, 15], [250, 216, 22]],
                    [[32, 202, 78], [65, 222, 50], [190, 235, 24], [255, 232, 36]]
                ]
            },
            intensidadColor: 0.012,
            intensidadGlow: 1.15,
            ruidoMin: 0.018,
            ruidoMax: 0.056,
            sombra: "rgba(0, 0, 0, 0.64)",
            sombraBrillante: "rgba(4, 4, 5, 0.72)",
            sombraOffsetX: -0.14,
            sombraOffsetY: 0.12,
          
            blur: 0.12
        },
        futuro: {
            paletas: {
                C: [
                    [[219, 42, 218], [239, 73, 202], [255, 255, 255], [44, 124, 222]],
                    [[229, 53, 210], [244, 91, 194], [255, 255, 255], [49, 137, 231]],
                    [[210, 34, 222], [235, 64, 207], [255, 255, 255], [38, 114, 214]]
                ],
                Q: [
                    [[244, 91, 15], [255, 144, 22], [255, 255, 255], [255, 211, 57]],
                    [[238, 82, 13], [255, 132, 19], [255, 255, 255], [255, 202, 49]],
                    [[250, 101, 17], [255, 153, 25], [255, 255, 255], [255, 219, 65]]
                ],
                T: [
                    [[38, 190, 83], [102, 220, 75], [255, 255, 255], [247, 219, 54]],
                    [[31, 177, 77], [94, 211, 69], [255, 255, 255], [241, 209, 47]],
                    [[47, 201, 91], [111, 226, 81], [255, 255, 255], [250, 224, 62]]
                ]
            },
            intensidadColor: 0.024,
            intensidadGlow: 1.9,
            ruidoMin: 0.002,
            ruidoMax: 0.02,
            sombra: "rgba(153, 215, 238, 0.5)",
            sombraBrillante: "rgba(255, 255, 255, 0.82)",
            blur: 0.7
        }
    },

    intensidadColor: 0.012,
    cantidadTextura: 250,
    intensidadGlow: 1.35,
    configuraciones: new WeakMap(),

    obtenerEstilo(grupo = this.grupoActual) {
        return this.estilos[grupo] || this.estilos.presente;
    },

    obtenerPaleta(tipo, grupo = this.grupoActual) {
        const estilo = this.obtenerEstilo(grupo);
        return estilo.paletas[tipo] || this.paletas[tipo];
    },

    dibujar(fig, tipo, tamano) {
        this.inicializarFigura(fig, tipo, tamano);
        this.aplicarGradienteYTextura(fig, tipo, tamano);
    },

    inicializarFigura(fig, tipo, tamano) {
        if (this.configuraciones.has(fig)) return;

        const grupo = (fig && fig.grupo) || this.grupoActual;
        const paleta = random(this.obtenerPaleta(tipo, grupo));
        const fase = random(TWO_PI);
        const estilo = this.obtenerEstilo(grupo);

        const texturaPuntos = [];
        for (let i = 0; i < this.cantidadTextura; i++) {
            texturaPuntos.push({
                x: random(-tamano / 2, tamano / 2),
                y: random(-tamano / 2, tamano / 2),
                tam: random(1.2, 2.2),
                opacidad: random(estilo.ruidoMin, estilo.ruidoMax)
            });
        }

        this.configuraciones.set(fig, { paleta, fase, texturaPuntos, grupo, estilo });
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
        const estilo = config?.estilo || this.obtenerEstilo(this.grupoActual);
        const tiempo = millis() * 0.00015 + config.fase;

        const offsetX = sin(tiempo * 0.7) * tamano * 0.18 + cos(tiempo * 1.3) * tamano * 0.08;
        const offsetY = cos(tiempo * 0.5) * tamano * 0.18 + sin(tiempo * 1.1) * tamano * 0.08;
        const angulo = sin(tiempo * 0.4) * PI + cos(tiempo * 0.15) * 0.7;
        const radio = tamano * 0.9;

        const x1 = offsetX + cos(angulo) * radio;
        const y1 = offsetY + sin(angulo) * radio;
        const x2 = offsetX - cos(angulo) * radio;
        const y2 = offsetY - sin(angulo) * radio;

        const gradiente = ctx.createLinearGradient(x1, y1, x2, y2);

        for (let i = 0; i < config.paleta.length; i++) {
            const base = config.paleta[i];
            const dif = sin(tiempo * (0.4 + i * 0.15)) * estilo.intensidadColor;

            const r = constrain(base[0] + base[0] * dif, 0, 255);
            const g = constrain(base[1] + base[1] * dif, 0, 255);
            const b = constrain(base[2] + base[2] * dif, 0, 255);

            gradiente.addColorStop(i / (config.paleta.length - 1), `rgb(${r},${g},${b})`);
        }

        const factorGlow = estilo.intensidadGlow;
        ctx.save();
        this.trazarRutaForma(ctx, tipo, tamano * 1.04);
        ctx.globalAlpha = 0.17 * factorGlow;
        ctx.fillStyle = gradiente;
        ctx.shadowColor = estilo.sombraBrillante;
        ctx.shadowOffsetX = tamano * (estilo.sombraOffsetX || 0);
        ctx.shadowOffsetY = tamano * (estilo.sombraOffsetY || 0);
        ctx.shadowBlur = tamano * (0.72 * estilo.blur);
        ctx.fill();
        ctx.restore();

        ctx.save();
        this.trazarRutaForma(ctx, tipo, tamano * 1.02);
        ctx.globalAlpha = 0.28 * factorGlow;
        ctx.fillStyle = gradiente;
        ctx.shadowColor = estilo.sombra;
        ctx.shadowOffsetX = tamano * (estilo.sombraOffsetX || 0);
        ctx.shadowOffsetY = tamano * (estilo.sombraOffsetY || 0);
        ctx.shadowBlur = tamano * (0.34 * estilo.blur);
        ctx.fill();
        ctx.restore();

        ctx.save();
        this.trazarRutaForma(ctx, tipo, tamano);
        ctx.fillStyle = gradiente;
        ctx.fill();

        ctx.clip();
        ctx.fillStyle = "white";
        for (let i = 0; i < config.texturaPuntos.length; i++) {
            const p = config.texturaPuntos[i];
            ctx.globalAlpha = p.opacidad;
            ctx.fillRect(p.x, p.y, p.tam, p.tam);
        }

        ctx.restore();
    }
};