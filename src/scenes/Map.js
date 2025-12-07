import MapNode from '../MapNode.js'
import MenuButton from '../MenuButton.js'
import PlayerData from '../PlayerData.js'

const NodeType = {
    COMMON: 0,
    TOWN: 1,
    CITY: 2
}

const DifficultyLimits = {
    MEDIUM:100,
    HARD:200,
    FUCKED:300
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
        this.jsonEventos = this.cache.json.get("eventos");
    }

    create() {

        this.add.image(0, 0, 'map').setOrigin(0).setDepth(0);

        this.graphics = this.add.graphics();
        this.graphics.setDepth(2);

        this.areaGraphics = this.add.graphics({ lineStyle: { width: 1, color: 0xff0000 }, fillStyle: { color: 0xff0000 } }).setDepth(1);

        //Boton de desplegar opciones
        this.desplegableButton = new MenuButton(this, 750, 50, "Opciones", null, ()=>{ 
            this.mainMenuButton.visible = !this.mainMenuButton.visible;
            this.inventoryButton.visible = !this.inventoryButton.visible;
        }, 15, 0, "#c8d9d0", false).setOrigin(1).setDepth(4);
        //boton de ir al inventario
        this.inventoryButton = new MenuButton(this, this.desplegableButton.x, this.desplegableButton.y + 30, "Ir al inventario", null, 
            ()=>{ this.scene.start('MenuTest', {playerData: new PlayerData(), oldScene: this.scene.key})}, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1).setDepth(4);
        //boton de ir al menu principal
        this.mainMenuButton = new MenuButton(this, this.desplegableButton.x, this.inventoryButton.y + 30, "Volver al menu principal", null, 
            ()=>{ this.scene.start('MainMenu')}, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1).setDepth(4);
        //console.log(this.registry.get("nodes"));

        if (!this.registry.get("nodes")) {
            this.nodes = []

            this.nodes.push(new MapNode(this, 100, 100, 'node', 'Test', NodeType.COMMON, State.CURRENT, false,false));   // CURRENT
            this.nodes.push(new MapNode(this, 200, 120, 'node', 'Test', NodeType.COMMON, State.LOCKED, false,false));
            this.nodes.push(new MapNode(this, 150, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 80, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, true,true,250));
            this.nodes.push(new MapNode(this, 250, 250, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));

            this.nodes.push(new MapNode(this, 320, 150, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 400, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 420, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 300, 300, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 380, 280, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));

            this.nodes.push(new MapNode(this, 500, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 480, 180, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 520, 260, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 450, 320, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 550, 350, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));

            this.nodes.push(new MapNode(this, 600, 120, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 650, 200, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 600, 280, 'node', 'Test', NodeType.COMMON, State.LOCKED, true, false,350));
            this.nodes.push(new MapNode(this, 680, 320, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 720, 240, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));

            this.nodes.push(new MapNode(this, 700, 100, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 740, 180, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 740, 360, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 700, 420, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 620, 400, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));

            this.nodes.push(new MapNode(this, 540, 440, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 460, 420, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 400, 480, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 320, 440, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 250, 400, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));

            this.nodes.push(new MapNode(this, 180, 350, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 100, 400, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 150, 500, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 250, 520, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));
            this.nodes.push(new MapNode(this, 350, 550, 'node', 'Test', NodeType.COMMON, State.LOCKED, false, false));

            for(let node of this.nodes){
                node.setDepth(3);
            }

        }
        else {
            this.nodes = []
            for (const n of this.registry.get("nodes"))
            {
                this.nodes.push(new MapNode(this, n.x, n.y, "node", n.targetScene, n.nodeType, n.state, n.isFocus,n.isAwake, n.difficulty, n.visited, n.scale, n.radius))
                
            }
            for(let node of this.nodes){
                node.setDepth(3);
            }
        }



        /**@type {MapNode}*/
        const nodoActual = this.nodes.find(n => n.state === State.CURRENT);
        if (!nodoActual) throw "No hay nodo current. xd";
        nodoActual.openNearbyNodes();
        nodoActual.drawConnectionsFromCurrent();

        this.RecalculateNodeDifficulties();
        for (let node of this.nodes) {
            console.log(node.difficulty)
        }
        this.GenerateDifficultyZones();


    }

    UpdateFociDifficulties(ammount) {
        for (const n of this.fociNodes) {
            n.difficulty += ammount;
        }
        this.RecalculateNodeDifficulties();
        this.GenerateDifficultyZones();
    }


    //complejidad O(n^3) si eliminar un elemento de un array tiene complejidad O(n)
    GenerateDifficultyZones() {
        this.areaGraphics.destroy();
        this.areaGraphics = this.add.graphics({ lineStyle: { width: 1, color: 0xff0000 }, fillStyle: { color: 0xff0000 } }).setDepth(1);
        for (let x = 0; x < this.game.config.width; x++) {
            for (let y = 0; y < this.game.config.height; y++) {
                
                const miAltura = this.IDWFormula(this.nodes, x, y,3)

                if (miAltura < DifficultyLimits.MEDIUM-20) { }
                else if (miAltura < DifficultyLimits.HARD-20) { this.drawPixel(x, y, 0xFFB600,2) }
                else if (miAltura < DifficultyLimits.FUCKED-20) { this.drawPixel(x, y, 0xFF8500,2) }
                else { this.drawPixel(x, y, 0xEB2900,2) }
                    
                    
                
            }

        }
        this.events.emit("update_tint")
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

            sumaDividendo += this.TruncateDifficulty(n.difficulty) * distanceMult;
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
        console.log(this.fociNodes)

        for (const n of this.nonFociNodes){
            n.difficulty = 0;
            for (const f of this.fociNodes) {
                const newDifficulty = Math.max(0, f.difficulty - Math.pow(Math.hypot(f.x - n.x, f.y - n.y) / 15, 2.2));
                if (n.difficulty < newDifficulty) { n.difficulty = newDifficulty; }
               
            }
        }
    }


    drawPixel(x, y, color,scale) {
        this.areaGraphics.fillStyle(color);
        this.areaGraphics.fillRect(x, y, scale, scale);
    }

    TruncateDifficulty(diff) {
        if (diff < DifficultyLimits.MEDIUM) return 0;
        else if (diff < DifficultyLimits.HARD) return DifficultyLimits.MEDIUM;
        else if (diff < DifficultyLimits.FUCKED) return DifficultyLimits.HARD+20;
        else return DifficultyLimits.FUCKED+30;
    }
}

