class Expectativa {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.cellSize = 40;
        this.spacing = 46;

        this.dragging = null;
        this.completed = false;

        this.finalScale = 1.5;

        this.setupGrid();
    }

    setupGrid() {

        // Configuración final esperada
        this.correctLayout = [
            ["Q","Q","Q","Q","C"],
            ["Q","Q","Q","C","C"],
            ["Q","Q","C","C","C"],
            ["Q","C","C","C","C"]
        ];

        this.figures = [];

        const rows = this.correctLayout.length;
        const cols = this.correctLayout[0].length;

        const offsetX = this.w / 2 - ((cols - 1) * this.spacing) / 2;
        const offsetY = this.w > 0
            ? this.h / 2 - ((rows - 1) * this.spacing) / 2
            : 0;

        // Separación inicial entre agrupaciones
        const splitAmount = 70;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {

                const homeX = offsetX + c * this.spacing;
                const homeY = offsetY + r * this.spacing;

                let startX = homeX;

                if (this.correctLayout[r][c] === "Q") {
                    startX -= splitAmount;
                } else {
                    startX += splitAmount;
                }

                this.figures.push({
                    row: r,
                    col: c,

                    startX: startX,
                    startY: homeY,

                    homeX: homeX,
                    homeY: homeY,

                    x: startX,
                    y: homeY,

                    type: this.correctLayout[r][c],

                    draggable: false
                });
            }
        }

        // Piezas desordenadas e interactuables
        // círculo correcto en fila 2 col 2
        // cuadrado correcto en fila 3 col 4

        this.posA = this.figures.find(
            f => f.row === 1 && f.col === 1
        );

        this.posB = this.figures.find(
            f => f.row === 2 && f.col === 3
        );

        // Intercambiar tipos para generar el error inicial
        const temp = this.posA.type;
        this.posA.type = this.posB.type;
        this.posB.type = temp;

        this.posA.draggable = true;
        this.posB.draggable = true;
    }

    update() {

     /*   if (this.completed) {
            // Crecimiento final suave y lento
            this.finalScale = lerp(this.finalScale, 1.05, 0.015);
        } else {
            this.finalScale = lerp(this.finalScale, 1.0, 0.08);
        }
*/
if (!this.completed) {

    this.finalScale = lerp(this.finalScale, 1.0, 0.08);

} else {

    let agrupacionCompleta = true;

    for (let fig of this.figures) {

        const dx = abs(fig.x - fig.homeX);
        const dy = abs(fig.y - fig.homeY);

        if (dx > 1 || dy > 1) {
            agrupacionCompleta = false;
            break;
        }
    }

    if (agrupacionCompleta) {
        this.finalScale = lerp(this.finalScale, 1.05, 0.01);
    }
}
        for (let fig of this.figures) {

            if (fig !== this.dragging) {

                const targetX = this.completed
                    ? fig.homeX
                    : fig.startX;

                const targetY = this.completed
                    ? fig.homeY
                    : fig.startY;

                fig.x = lerp(fig.x, targetX, 0.03);
                fig.y = lerp(fig.y, targetY, 0.03);
            }
        }

        if (this.dragging) {
            this.dragging.x = mouseX - this.x;
            this.dragging.y = mouseY - this.y;
        }

        // Evita figuras pegadas al mouse
        if (!mouseIsPressed && this.dragging) {
            this.mouseReleased();
        }
    }

draw() {

    this.update();

    push();

    translate(this.x, this.y);

    noStroke();

    // Fondo de la escena
    fill(245);
    rect(0, 0, this.w, this.h);


    // ---------------------------------------------
    // FIGURAS
    // ---------------------------------------------

    for (let fig of this.figures) {

        push();

        translate(fig.x, fig.y);

        scale(this.finalScale);


        // La apariencia ahora la controla
        // EfectoVisualGlobal
       /* EfectoVisualGlobal.dibujar(
            {
                ...fig,
                x: 0,
                y: 0
            },
            fig.type,
            this.cellSize
        ); */
        EfectoVisualGlobal.dibujar(
            fig,
            fig.type,
            this.cellSize
        );

        pop();
    }

    pop();
}
    mousePressed() {

        if (this.completed) return;

        const localX = mouseX - this.x;
        const localY = mouseY - this.y;

        for (let fig of this.figures) {

            if (!fig.draggable) continue;

            const d = dist(
                localX,
                localY,
                fig.x,
                fig.y
            );

            if (d < this.cellSize) {
                this.dragging = fig;
                return;
            }
        }
    }

    mouseReleased() {

        if (this.completed || !this.dragging) return;

        const localX = mouseX - this.x;
        const localY = mouseY - this.y;

        const other =
            this.dragging === this.posA
                ? this.posB
                : this.posA;

        const d = dist(
            localX,
            localY,
            other.x,
            other.y
        );

        if (d < this.cellSize) {

            const tempType = this.dragging.type;
            this.dragging.type = other.type;
            other.type = tempType;

            this.completed = true;
        }

        this.dragging.x = this.dragging.homeX;
        this.dragging.y = this.dragging.homeY;

        this.dragging = null;
    }
}