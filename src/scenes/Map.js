import MapNode from '../MapNode.js'

export default class Map extends Phaser.Scene{
    constructor(){
        super({key:'Map'})
    }

    create(){

        if (!this.registry.has('nodeStates')) {
            this.registry.set('nodeStates', {});
        }

        if(!this.registry.has('nodeVisited')){
            this.registry.set('nodeVisited',{});
        }

        if(!this.registry.has('nodeHeight')){
            this.registry.set('nodeHeight',{});
        }

        if(!this.registry.has('nodeFocus')){
            this.registry.set('nodeFocus',{});
        }

        this.nodes = [];

        this.add.image(0, 0, 'map').setOrigin(0).setDepth(0);

        this.graphics = this.add.graphics();
        this.graphics.setDepth(1);

        this.connGraphics = this.add.graphics();
        this.connGraphics.setDepth(2);


        new MapNode(this, 100, 100, 'node', 'Test', 0.2, 0, 2, 'node1');   // CURRENT
        new MapNode(this, 200, 120, 'node', 'Test', 0.2, 0, 0, 'node2');
        new MapNode(this, 150, 200, 'node', 'Test', 0.2, 0, 0, 'node3');
        new MapNode(this, 80, 250, 'node', 'Test', 0.2, 0, 1, 'node4');
        new MapNode(this, 250, 250, 'node', 'Test', 0.2, 0, 1, 'node5');

        new MapNode(this, 320, 150, 'node', 'Test', 0.2, 0, 1, 'node6');
        new MapNode(this, 400, 100, 'node', 'Test', 0.2, 0, 1, 'node7');
        new MapNode(this, 420, 200, 'node', 'Test', 0.2, 0, 1, 'node8');
        new MapNode(this, 300, 300, 'node', 'Test', 0.2, 0, 1, 'node9');
        new MapNode(this, 380, 280, 'node', 'Test', 0.2, 0, 1, 'node10');

        new MapNode(this, 500, 100, 'node', 'Test', 0.2, 0, 1, 'node11');
        new MapNode(this, 480, 180, 'node', 'Test', 0.2, 0, 1, 'node12');
        new MapNode(this, 520, 260, 'node', 'Test', 0.2, 0, 1, 'node13',true);
        new MapNode(this, 450, 320, 'node', 'Test', 0.2, 0, 1, 'node14');
        new MapNode(this, 550, 350, 'node', 'Test', 0.2, 0, 1, 'node15');

        new MapNode(this, 600, 120, 'node', 'Test', 0.2, 0, 1, 'node16');
        new MapNode(this, 650, 200, 'node', 'Test', 0.2, 0, 1, 'node17');
        new MapNode(this, 600, 280, 'node', 'Test', 0.2, 0, 1, 'node18');
        new MapNode(this, 680, 320, 'node', 'Test', 0.2, 0, 1, 'node19');
        new MapNode(this, 720, 240, 'node', 'Test', 0.2, 0, 1, 'node20');

        new MapNode(this, 700, 100, 'node', 'Test', 0.2, 0, 1, 'node21');
        new MapNode(this, 740, 180, 'node', 'Test', 0.2, 0, 1, 'node22');
        new MapNode(this, 740, 360, 'node', 'Test', 0.2, 0, 1, 'node23');
        new MapNode(this, 700, 420, 'node', 'Test', 0.2, 0, 1, 'node24',true);
        new MapNode(this, 620, 400, 'node', 'Test', 0.2, 0, 1, 'node25');

        new MapNode(this, 540, 440, 'node', 'Test', 0.2, 0, 1, 'node26');
        new MapNode(this, 460, 420, 'node', 'Test', 0.2, 0, 1, 'node27');
        new MapNode(this, 400, 480, 'node', 'Test', 0.2, 0, 1, 'node28');
        new MapNode(this, 320, 440, 'node', 'Test', 0.2, 0, 1, 'node29');
        new MapNode(this, 250, 400, 'node', 'Test', 0.2, 0, 1, 'node30');

        new MapNode(this, 180, 350, 'node', 'Test', 0.2, 0, 1, 'node31');
        new MapNode(this, 100, 400, 'node', 'Test', 0.2, 0, 1, 'node32');
        new MapNode(this, 150, 500, 'node', 'Test', 0.2, 0, 1, 'node33');
        new MapNode(this, 250, 520, 'node', 'Test', 0.2, 0, 1, 'node34');
        new MapNode(this, 350, 550, 'node', 'Test', 0.2, 0, 1, 'node35');

        for (const n of this.nodes)n.setDepth(3);
        

        this.needsPerimeterRedraw = true;

        this.drawConnections();
        this.drawHeightPerimeters();
        this.expand();

    }

    update(){
        this.drawConnections();

        if (this.needsPerimeterRedraw) {
            this.drawHeightPerimeters();
            this.needsPerimeterRedraw = false;
        }
        
    }

    drawConnections(){
        if (!this.nodes || this.nodes.length === 0) return;

        this.connGraphics.clear();
        this.connGraphics.lineStyle(4, 0xffffff, 0.8);

        // Find the current node
        const currentNode = this.nodes.find(n => n.state === 2); //CURRENT
        if (!currentNode) return;

        // Draw line to all nearby OPEN nodes
        for (const other of this.nodes) {
            if (other === currentNode) continue;
            if (other.state === 0 || other.state === 2) { //OPEN or CURRENT
                const dist = Phaser.Math.Distance.Between(currentNode.x, currentNode.y, other.x, other.y);
                if (dist <= currentNode.radius) {
                    this.connGraphics.beginPath();
                    this.connGraphics.moveTo(currentNode.x, currentNode.y);
                    this.connGraphics.lineTo(other.x, other.y);
                    this.connGraphics.strokePath();
                }
            }
        }
    }


    drawHeightPerimeters() {
        if (!this.nodes || this.nodes.length === 0) return;
        this.graphics.clear();

        const nodeHeight = this.registry.get('nodeHeight');
        if (!nodeHeight) return;

        const levels = [
            { min: 100, max: 199, color: 0x0000ff },
            { min: 200, max: 299, color: 0xffa500 },
            { min: 300, max: Infinity, color: 0xff0000 }
        ];

        this.graphics.lineStyle(3, 0xffffff, 1);

        for (const level of levels) {

            const nodesInLevel = this.nodes.filter(n => {
                const h = Number(nodeHeight[n.id] || 0);
                if (isNaN(h)) return false;
                return h >= level.min && h <= level.max;
            });

            if (nodesInLevel.length < 3) continue;

            let pts = nodesInLevel.map(n => ({ x: Number(n.x), y: Number(n.y) })).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
            if (pts.length < 3) continue;

            const hull = this.getConvexHull(pts);
            if (!hull || hull.length < 3) continue;

            this.graphics.beginPath();
            this.graphics.lineStyle(3, level.color, 1);
            this.graphics.strokePoints(hull,true);
            this.graphics.closePath();       
        }
    }

    getConvexHull(points) {
        points = points.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)).slice();

        if (points.length < 3) return points;

        points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

        const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

        const lower = [];
        for (const p of points) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
                lower.pop();
            }
            lower.push(p);
        }

        const upper = [];
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
                upper.pop();
            }
            upper.push(p);
        }

        lower.pop();
        upper.pop();

        return lower.concat(upper);
    }

    expand() {
        const nodeFocus = this.registry.get('nodeFocus') || {};
        const nodeHeight = this.registry.get('nodeHeight') || {};
        const growth = 100;

        for (const n of this.nodes) {
            if (!nodeFocus[n.id]) continue;

            const oldH = Number(nodeHeight[n.id] || 0);
            const newH = oldH + growth;
            nodeHeight[n.id] = newH;
        }

        this.registry.set('nodeHeight', nodeHeight);

        this.needsPerimeterRedraw = true;

    }
}

