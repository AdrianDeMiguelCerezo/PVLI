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
            this.nodes.push(new MapNode(this, 80, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, 100));
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

        /**@type {MapNode}*/
        const nodoActual = this.nodes.find(n => n.state === State.CURRENT);
        if (!nodoActual) throw "No hay nodo current. xd";
        nodoActual.openNearbyNodes();

        nodoActual.drawConnectionsFromCurrent();


        for (const n of this.nodes) n.setDepth(2);


        this.GenerateDifficultyZonesFunctions()

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
        console.log(this.nodes)
        for (let x = 0; x < this.game.config.width; x++) {
            for (let y = 0; y < this.game.config.height; y++) {

                //let suma = 0;
                //let cantNodosCercanos = 0;

                let closestEz = [10000, 10000, 10000, 10000];
                let closestMed = [10000, 10000, 10000, 10000];
                let closestHard = 1000;
                let closestHell = 1000;
                for (const n of this.nodes) {


                    if (n.radius == NaN) {
                        console.log("x: ", x, ", y: ", y, "n.x: ", n.x, ", n.y: ", n.y, "hyp: ", Math.hypot(x - n.x, y - n.y), ", n.r: ", n.radius);
                        throw "n.radius is NaN";
                    }
                    const d = Math.hypot(x - n.x, y - n.y);


                    if (n.difficulty < 100) {



                        if (d < closestEz[0] && d <= n.radius) closestEz[0] = d

                        closestEz.sort((a, b) => b - a)


                    }
                    else {
                        if (d < closestMed[0] && d <= n.radius) closestMed[0] = d

                        closestMed.sort((a, b) => b - a)
                    }


                    //if (Math.round((n.radius*n.radius) / (d*d))>0)
                    //{ suma += (n.difficulty-50) *n.radius*n.radius/ (d*d); cantNodosCercanos++; }
                }

                //const diffSum = cantNodosCercanos != 0 ? suma / cantNodosCercanos : 0


                let mediaEz = 0;
                let n = 0;
                for (const num of closestEz) {
                    if (num != 10000) { mediaEz += num; n++; }
                }
                if (n !== 0) mediaEz = mediaEz / n;
                else mediaEz = 10000;

                let mediaMed = 0;
                n = 0;
                for (const num of closestMed) {
                    if (num != 10000) { mediaMed += num; n++; }
                }
                if (n !== 0) mediaMed = mediaMed / n;
                else mediaMed = 10000;



                if (mediaMed < mediaEz) {
                    this.drawPixel(x, y, 0x111111)
                }
            }
        }
    }


    GenerateDifficultyZonesClosest() {
        console.log(this.nodes)
        for (let x = 0; x < this.game.config.width; x++) {
            for (let y = 0; y < this.game.config.height; y++) {

                //let suma = 0;
                //let cantNodosCercanos = 0;

                let closest = 0;
                let closestD = 10000;

                for (let i = 0; i < this.nodes.length; i++) {
                    const d = Math.hypot(x - this.nodes[i].x, y - this.nodes[i].y);
                    if (d < closestD) {
                        closestD = d;
                        closest = i;
                    }
                }

                //const diffSum = cantNodosCercanos != 0 ? suma / cantNodosCercanos : 0


                if (this.nodes[closest].difficulty >= 100) {
                    this.drawPixel(x, y, 0x111111)
                }
            }
        }
    }
    // Create a Graphics object

    GenerateDifficultyZonesFunctions() {
        console.log(this.nodes)
        for (let x = 0; x < this.game.config.width; x++) {
            for (let y = 0; y < this.game.config.height; y++) {
                let sumaDividendo = 0;
                let sumaDivisor = 0;
                for (const n of this.nodes)
                {
                    const d = Math.hypot(x - n.x, y - n.y);

                    if (d == 0) {
                        sumaDividendo = n.difficulty;
                        sumaDivisor = 1;
                        break;
                    }

                    const distanceMult = 1/(Math.pow(d,2.5))

                    sumaDividendo += n.difficulty*distanceMult;
                    sumaDivisor += distanceMult;
                    
                }
                
                const miAltura = sumaDividendo/sumaDivisor

                if (miAltura < 50) { }
                else if (miAltura < 150) { this.drawPixel(x, y, 0xFFB600) }
                else if (miAltura < 250) { this.drawPixel(x, y, 0xFF8500) }
                else { this.drawPixel(x, y, 0xEB2900) }
                    
                    
                
            }

        }
    }



    drawPixel(x, y, color) {
        this.areaGraphics.fillStyle(color);
        this.areaGraphics.fillRect(x, y, 1, 1);
    }
}
