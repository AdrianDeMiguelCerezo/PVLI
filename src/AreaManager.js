export default class AreaManager {
    constructor(scene, focusNodeIds = []) {
        this.scene = scene;
        this.expansionStep = 50;
        this.areaColors = [0x2e8b57,0x2e8b57, 0xffff00,0xffff00, 0xffa500,0xffa500, 0xff0000,0xff0000];
        this.areaCount = 8;

        // Restore from registry or initialize
        if (!this.scene.registry.has('areaLevel')) {
            this.scene.registry.set('areaLevel', 0);
        }
        if (!this.scene.registry.has('focusNodeIds')) {
            this.scene.registry.set('focusNodeIds', focusNodeIds);
        }

        this.focusNodeIds = this.scene.registry.get('focusNodeIds');
        this.focusNodes = this.focusNodeIds
            .map(id => this.scene.nodes.find(n => n.id === id))
            .filter(Boolean);
    }

    expand() {
        let areaLevel = this.scene.registry.get('areaLevel') + 1;
        if (areaLevel >= this.areaCount) areaLevel = this.areaCount - 1;
        this.scene.registry.set('areaLevel', areaLevel);

        this.updateAreas();
    }

    updateAreas() {
        const areaLevel = this.scene.registry.get('areaLevel');
        if (this.focusNodes.length === 0) return;

        for (const node of this.scene.nodes) {
            let minDist = Infinity;
            let closestFocus = null;

            for (const focus of this.focusNodes) {
                const dist = Phaser.Math.Distance.Between(focus.x, focus.y, node.x, node.y);
                if (dist < minDist) {
                    minDist = dist;
                    closestFocus = focus;
                }
            }

            const ringIndex = Math.floor(minDist / this.expansionStep);
            const shifted = ringIndex - areaLevel;
            let level = -shifted;

            if (level < 0) level = 0;
            if (level >= this.areaCount) level = this.areaCount - 1;

            node.difficulty = level;
            node.areaOwner = closestFocus?.id || null;
        }
    }

    drawAreas() {
        if (this.focusNodes.length === 0) return;
        this.scene.areaGraphics.clear();

        const areaLevel = this.scene.registry.get('areaLevel');
        const maxVisible = this.areaCount - 1; // number of colored rings

        for (const focus of this.focusNodes) {
            for (let i = 0; i <= areaLevel; i++) {
                const shift = areaLevel - i;
                const inner = this.expansionStep * shift;
                const outer = this.expansionStep * (shift + 1);

                // If beyond max visible, make fully transparent
                if (i > maxVisible) continue;

                this.scene.areaGraphics.lineStyle(3, this.areaColors[i], 1);
                this.scene.areaGraphics.strokeCircle(focus.x, focus.y, inner);
                this.scene.areaGraphics.strokeCircle(focus.x, focus.y, outer);
            }
        }
    }



    addFocusNode(nodeId) {
        const node = this.scene.nodes.find(n => n.id === nodeId);
        if (node && !this.focusNodeIds.includes(nodeId)) {
            this.focusNodeIds.push(nodeId);
            this.scene.registry.set('focusNodeIds', this.focusNodeIds);
            this.focusNodes.push(node);
            this.updateAreas();
        }
    }

    removeFocusNode(nodeId) {
        this.focusNodeIds = this.focusNodeIds.filter(id => id !== nodeId);
        this.scene.registry.set('focusNodeIds', this.focusNodeIds);
        this.focusNodes = this.focusNodes.filter(n => n.id !== nodeId);
        this.updateAreas();
    }
}
