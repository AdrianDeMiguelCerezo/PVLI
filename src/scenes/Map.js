import MapNode from '../MapNode.js'

const NodeType = {
    COMMON: 0,
    TOWN: 1,
    CITY: 2
}

const State = {
    OPEN: 0,
    LOCKED: 1,
    CURRENT: 2
}
export default class Map extends Phaser.Scene {
    constructor() {
        super({ key: 'Map' })
    }

    init() {

    }

    create() {

        this.add.image(0, 0, 'map').setOrigin(0).setDepth(0);

        this.graphics = this.add.graphics();
        this.graphics.setDepth(2);

        this.areaGraphics = this.add.graphics({ lineStyle: { width: 1, color: 0xff0000 }, fillStyle: { color: 0xff0000 } }).setDepth(1);



        if (!this.registry.get("nodes")) {

            /**@type {Array<MapNode>}*/
            this.nodes = []

            this.nodes.push(new MapNode(this, 100, 100, 'node', 'Test', NodeType.COMMON, State.CURRENT, false, 100));   // CURRENT
            this.nodes.push(new MapNode(this, 200, 120, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 150, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 80, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, true, 300));
            this.nodes.push(new MapNode(this, 250, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));

            this.nodes.push(new MapNode(this, 320, 150, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 400, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 420, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 300, 300, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 380, 280, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));

            this.nodes.push(new MapNode(this, 500, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 480, 180, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 520, 260, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 450, 320, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 550, 350, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 600, 120, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 650, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 600, 280, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 680, 320, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 720, 240, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 700, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 740, 180, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 740, 360, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 700, 420, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 200));
            this.nodes.push(new MapNode(this, 620, 400, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 540, 440, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 460, 420, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 400, 480, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 320, 440, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 250, 400, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 180, 350, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 100, 400, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 150, 500, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 250, 520, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 350, 550, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));






        }
        else {
            this.nodes = []
            for (const n of this.registry.get("nodes")) {
                this.nodes.push(new MapNode(this, n.x, n.y, "node", n.targetScene, n.nodeType, n.state, n.difficulty, n.isFocus, n.visited, n.scale, n.radius))
            }
        }

        for (const n of this.nodes) n.setDepth(2);


        /**@type {MapNode}*/
        const nodoActual = this.nodes.find(n => n.state === State.CURRENT);
        if (!nodoActual) throw "No hay nodo current. xd";

        nodoActual.openNearbyNodes();
        nodoActual.drawConnectionsFromCurrent();

        this.RecalculateNodeDifficulties();
        this.GenerateDifficultyZones();

        this.events.emit("update_tint")

    }

    UpdateFociDifficulties(ammount) {
        for (const n of this.fociNodes) {
            n.difficulty += ammount;
        }
    }

    GenerateDifficultyZones() {
        console.log(this.nodes)
        for (let x = 0; x < this.game.config.width; x++) {
            for (let y = 0; y < this.game.config.height; y++) {
                
                const miAltura = this.IDWFormula(this.nodes, x, y,2.5)

                if (miAltura < 95) { }
                else if (miAltura < 195) { this.drawPixel(x, y, 0xFFB600) }
                else if (miAltura < 295) { this.drawPixel(x, y, 0xFF8500) }
                else { this.drawPixel(x, y, 0xEB2900) }
                    
                    
                
            }

        }
    }
    /**
     * 
     * @param {Array<MapNode>} arrayPuntos
     * @param {number} x
     * @param {number} y
     * @param {number} power
     * @returns
     */
    IDWFormula(arrayPuntos,x,y,power) {
        let sumaDividendo = 0;
        let sumaDivisor = 0;
        for (const n of arrayPuntos) {
            const d = Math.hypot(x - n.x, y - n.y);

            if (d == 0) {
                sumaDividendo = n.difficulty;
                sumaDivisor = 1;
                break;
            }

            const distanceMult = 1 / (Math.pow(d, power))

            sumaDividendo += n.difficulty * distanceMult;
            sumaDivisor += distanceMult;

        }

        return sumaDividendo / sumaDivisor
    }

    RecalculateNodeDifficulties()
    {

        /**@type {Array<MapNode>}*/
        this.fociNodes = []

        /**@type {Array<MapNode>}*/
        this.nonFociNodes = []

        for (const n of this.nodes) {
            if (n.isFocus) this.fociNodes.push(n)
            else this.nonFociNodes.push(n)
        }


        for (const n of this.nonFociNodes)
        {
            n.difficulty = 0;
            for (const f of this.fociNodes)
            {
                n.difficulty +=  Math.max(0, f.difficulty - Math.hypot(f.x - n.x, f.y - n.y));
            }
        }
    }

    drawPixel(x, y, color) {
        this.areaGraphics.fillStyle(color);
        this.areaGraphics.fillRect(x, y, 1, 1);
    }
}
