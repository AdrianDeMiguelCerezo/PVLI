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
        this.graphics.setDepth(1);

        this.areaGraphics = this.add.graphics().setDepth(0.5);

        console.log(this.registry.get("nodes"))

        if (!this.registry.get("nodes")) {
            this.nodes = []

            this.nodes.push(new MapNode(this, 100, 100, 'node', 'Test', NodeType.COMMON, State.CURRENT, false,100));   // CURRENT
            this.nodes.push(new MapNode(this, 200, 120, 'node', 'Test', NodeType.COMMON, State.LOCKED, false,100));
            this.nodes.push(new MapNode(this, 150, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false,100));
            this.nodes.push(new MapNode(this, 80, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, false,100));
            this.nodes.push(new MapNode(this, 250, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, false,100));

            this.nodes.push(new MapNode(this, 320, 150, 'node', 'Test', NodeType.COMMON, State.LOCKED, false,100));
            this.nodes.push(new MapNode(this, 400, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 420, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 300, 300, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
            this.nodes.push(new MapNode(this, 380, 280, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));

            this.nodes.push(new MapNode(this, 500, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 480, 180, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 520, 260, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 450, 320, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 550, 350, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 600, 120, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 650, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 600, 280, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 680, 320, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 720, 240, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 700, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 740, 180, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 740, 360, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 700, 420, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 620, 400, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 540, 440, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 460, 420, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 400, 480, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
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
            for (const n of this.registry.get("nodes"))
            {
                this.nodes.push(new MapNode(this, n.x, n.y, "node", n.targetScene, n.nodeType, n.state, n.difficulty,n.isFocus,n.visited,n.scale,n.radius))
            }
        }

        /**@type {MapNode}*/
        const nodoActual = this.nodes.find(n => n.state === State.CURRENT);
        if (!nodoActual) throw "No hay nodo current. xd";
        nodoActual.openNearbyNodes();

        nodoActual.drawConnectionsFromCurrent();


        for (const n of this.nodes) n.setDepth(2);

        
        this.GenerateDifficultyZones()

    }


    //complejidad O(n^3) si eliminar un elemento de un array tiene complejidad O(n)
    //GenerateDifficultyZones() {
    //    let difficulty100nodes = []
    //    let difficulty100arists = []
    //    for (const node of this.nodes)
    //    {
    //        if (node.difficulty >= 100) { difficulty100nodes.push(node) }
    //    }
    //    for (const node of difficulty100nodes)
    //    {
    //        for (const other of this.nodes)
    //        {
    //            if (other.difficulty < 100 && Math.sqrt((node.x - other.x) * (node.x - other.x) + (node.y - other.y) * (node.y - other.y))<node.radius)
    //            {
    //                difficulty100arists.push(new Phaser.Math.Vector2(node.x + other.x, node.y + other.y).scale(0.5));
    //            }
    //        }
    //    }
    //    const path = new Phaser.Curves.Path();
    //    path.lineTo(difficulty100arists[0]);
    //    difficulty100arists.splice(0, 1)
    //    console.log("arr: ",difficulty100arists)
    //    for (let i = 0; i < difficulty100arists.length; i++)
    //    {

    //    }
    //}


    GenerateDifficultyZones() {
        for (let x = 0; x < this.game.canvas.width; x++) {
            for (let y = 0; y < this.game.canvas.height; y++) {

                let suma = 0;
                let cantNodosCercanos = 0;

                for (const n of this.nodes) {
                    let d = Math.hypot([x - n.x, y - n.y]);
                    if (d < n.radius) { suma += d; cantNodosCercanos++; }
                }

                const diffSum = cantNodosCercanos != 0 ? suma / cantNodosCercanos : 0

                if (diffSum > 50) {
                    this.drawPixel(x, y, 0x666666)
                }
            }
        }
    }
    // Create a Graphics object



    drawPixel(x, y, color) {
        this.areaGraphics.fillStyle(color);
        this.areaGraphics.fillRect(x, y, 1, 1);
    }
}