class Expectativa {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.grupo = "futuro";

        this.cellSize = constrain(min(w, h) * 0.07, 20, 48);
        this.dragging = null;
        this.completed = false;
        this.celebrationStart = 0;
        this.celebrationDuration = 1300;
        this.resetDelay = 5000;
        this.finalScale = 1;

        this.setupGroups();
    }

    setupGroups() {
        const separation = this.w * 0.30;
        const centerY = this.h * 0.55;
        const centers = [
            this.w / 2 - separation,
            this.w / 2,
            this.w / 2 + separation
        ];
        const step = this.cellSize * 1.7;
        const layouts = [
            [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]],
            [[0, -0.9], [-0.8, 0.5], [0.8, 0.5]],
            [[0, -1.1], [-0.95, -0.35], [0.95, -0.35], [-0.6, 0.8], [0.6, 0.8]]
        ];

        this.groups = [
            { name: "cuadrados", type: "Q", centerX: centers[0], centerY, slots: layouts[0] },
            { name: "triangulos", type: "T", centerX: centers[1], centerY, slots: layouts[1] },
            { name: "circulos", type: "C", centerX: centers[2], centerY, slots: layouts[2] }
        ];
        this.figures = [];
        const impostors = {
            "0:2": { type: "C", targetGroupIndex: 2, targetSlotIndex: 1 },
            "1:0": { type: "Q", targetGroupIndex: 0, targetSlotIndex: 2 },
            "2:1": { type: "T", targetGroupIndex: 1, targetSlotIndex: 0 }
        };

        for (let groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
            const group = this.groups[groupIndex];
            for (let slotIndex = 0; slotIndex < group.slots.length; slotIndex++) {
                const slot = group.slots[slotIndex];
                const homeX = group.centerX + slot[0] * step;
                const homeY = group.centerY + slot[1] * step;

                const impostor = impostors[`${groupIndex}:${slotIndex}`];
                this.figures.push({
                    groupIndex,
                    slotIndex,
                    type: impostor ? impostor.type : group.type,
                    targetGroupIndex: impostor ? impostor.targetGroupIndex : null,
                    targetSlotIndex: impostor ? impostor.targetSlotIndex : null,
                    homeX,
                    homeY,
                    x: homeX,
                    y: homeY,
                    draggable: Boolean(impostor),
                    visible: true
                });
            }
        }
    }

    update() {
        if (this.completed) {
            const elapsed = millis() - this.celebrationStart;
            if (elapsed >= this.resetDelay) {
                this.setupGroups();
                this.completed = false;
                this.celebrationStart = 0;
                this.finalScale = 1;
                return;
            }

            const progress = constrain(elapsed / this.celebrationDuration, 0, 1);
            this.finalScale = 1 + sin(progress * PI) * 0.20;
        } else {
            this.finalScale = lerp(this.finalScale, 1, 0.12);
        }

        for (const figure of this.figures) {
            if (figure !== this.dragging) {
                figure.x = lerp(figure.x, figure.homeX, 0.12);
                figure.y = lerp(figure.y, figure.homeY, 0.12);
            }
        }

        if (this.dragging) {
            this.dragging.x = mouseX - this.x;
            this.dragging.y = mouseY - this.y;
        }

        if (!mouseIsPressed && this.dragging) this.mouseReleased();
    }

    draw(actualizar = true) {
        if (actualizar) this.update();
        EfectoVisualGlobal.grupoActual = this.grupo;

        push();
        translate(this.x, this.y);
        noStroke();
        fill(34, 34, 34);
        rect(0, 0, this.w, this.h);
        for (const figure of this.figures) {
            if (!figure.visible) continue;
            push();
            translate(figure.x, figure.y);
            scale(this.finalScale);
            this.drawCelebrationGlow(figure);
            EfectoVisualGlobal.dibujar(figure, figure.type, this.cellSize);
            pop();
        }
        pop();
    }

    drawCelebrationGlow(figure) {
        if (!this.completed) return;

        const progress = constrain(
            (millis() - this.celebrationStart) / this.celebrationDuration,
            0,
            1
        );
        const strength = sin(progress * PI);
        const context = drawingContext;

        context.save();
        EfectoVisualGlobal.trazarRutaForma(context, figure.type, this.cellSize * 1.08);
        context.globalAlpha = 0.32 * strength;
        context.fillStyle = "rgba(255, 236, 160, 1)";
        context.shadowColor = "rgba(255, 220, 110, 0.95)";
        context.shadowBlur = this.cellSize * (1.1 + strength * 1.3);
        context.fill();
        context.restore();
    }

    mousePressed() {
        if (this.completed) return;

        const localX = mouseX - this.x;
        const localY = mouseY - this.y;
        for (let index = this.figures.length - 1; index >= 0; index--) {
            const figure = this.figures[index];
            if (!figure.visible) continue;
            if (!figure.draggable) continue;
            if (dist(localX, localY, figure.x, figure.y) < this.cellSize * 0.85) {
                this.dragging = figure;
                return;
            }
        }
    }

    mouseReleased() {
        if (!this.dragging) return;

        const figure = this.dragging;
        const localX = mouseX - this.x;
        const localY = mouseY - this.y;
        const targetGroup = this.groups.find(group =>
            dist(localX, localY, group.centerX, group.centerY) < this.cellSize * 3.1
        );
        const targetGroupIndex = targetGroup ? this.groups.indexOf(targetGroup) : -1;
        const targetSlotIndex = figure.targetSlotIndex;
        const target = this.figures.find(item =>
            item.groupIndex === targetGroupIndex && item.slotIndex === targetSlotIndex
        );

        if (targetGroup && target && targetGroup.type === figure.type &&
            figure.targetGroupIndex === targetGroupIndex &&
            targetSlotIndex < targetGroup.slots.length) {
            const sourceGroupIndex = figure.groupIndex;
            const sourceSlotIndex = figure.slotIndex;
            const targetSlot = targetGroup.slots[targetSlotIndex];
            const sourceSlot = this.groups[sourceGroupIndex].slots[sourceSlotIndex];

            target.groupIndex = sourceGroupIndex;
            target.slotIndex = sourceSlotIndex;
            target.homeX = this.groups[sourceGroupIndex].centerX + sourceSlot[0] * this.cellSize * 1.7;
            target.homeY = this.groups[sourceGroupIndex].centerY + sourceSlot[1] * this.cellSize * 1.7;
            target.draggable = true;

            figure.homeX = targetGroup.centerX + targetSlot[0] * this.cellSize * 1.7;
            figure.homeY = targetGroup.centerY + targetSlot[1] * this.cellSize * 1.7;
            figure.groupIndex = targetGroupIndex;
            figure.slotIndex = targetSlotIndex;
            figure.draggable = false;
            this.completed = this.figures.every(item =>
                item.type === this.groups[item.groupIndex].type
            );
            if (this.completed) this.celebrationStart = millis();
        }

        this.dragging = null;
    }
}
