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

        if (!this.registry.get("nodes")) {
            this.nodes = []

            this.nodes.push(new MapNode(this, 100, 100, 'node', 'Test', NodeType.COMMON, State.CURRENT, false));   // CURRENT
            this.nodes.push(new MapNode(this, 200, 120, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 150, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 80, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 250, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

            this.nodes.push(new MapNode(this, 320, 150, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 400, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 420, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 300, 300, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));
            this.nodes.push(new MapNode(this, 380, 280, 'node', 'Test', NodeType.COMMON, State.LOCKED, false));

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
            for (n of this.registry.get("nodes"))
            {
                nodes.push(new MapNode(this,n.x,n.y,"node",n.targetScene,n.nodeType,n.state,n.isFocus,n.visited,n.scale,n.difficulty,n.radius))
            }
        }

        /**@type {MapNode}*/
        const nodoActual = this.nodes.find(n => n.state === State.CURRENT);
        if (!nodoActual) throw "No hay nodo current. xd";
        nodoActual.openNearbyNodes();

        nodoActual.drawConnectionsFromCurrent();


        for (const n of this.nodes) n.setDepth(2);

        


    }



   

}