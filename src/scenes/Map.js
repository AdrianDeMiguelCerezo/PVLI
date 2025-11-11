import MapNode from '../MapNode.js'
import AreaManager from '../AreaManager.js'

export default class Map extends Phaser.Scene{
    constructor(){
        super({key:'Map'})
    }

    init(nodeInfo){
        if(nodeInfo && nodeInfo.nodes){
            this.nodeData = nodeInfo.nodes; // plain array
        } 
        else {
            this.nodeData = null;
        }
    }

    create(){

        this.add.image(0, 0, 'map').setOrigin(0).setDepth(0);

        this.graphics = this.add.graphics();
        this.graphics.setDepth(1);

        this.areaGraphics = this.add.graphics().setDepth(0.5);

        
        this.nodes=[]
            this.nodes.push(new MapNode(this, 100, 100, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[0].state : 2, 0,this.nodeData ? this.nodeData[0].visited : false));   // CURRENT
            this.nodes.push(new MapNode(this, 200, 120, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[1].state : 0, 1,this.nodeData ? this.nodeData[1].visited : false));
            this.nodes.push(new MapNode(this, 150, 200, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[2].state : 0, 2,this.nodeData ? this.nodeData[2].visited : false));
            this.nodes.push(new MapNode(this, 80, 250, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[3].state : 1, 3,this.nodeData ? this.nodeData[3].visited : false));
            this.nodes.push(new MapNode(this, 250, 250, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[4].state : 1, 4,this.nodeData ? this.nodeData[4].visited : false));

            this.nodes.push(new MapNode(this, 320, 150, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[5].state : 1, 5,this.nodeData ? this.nodeData[5].visited : false));
            this.nodes.push(new MapNode(this, 400, 100, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[6].state : 1, 6,this.nodeData ? this.nodeData[6].visited : false));
            this.nodes.push(new MapNode(this, 420, 200, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[7].state : 1, 7,this.nodeData ? this.nodeData[7].visited : false));
            this.nodes.push(new MapNode(this, 300, 300, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[8].state : 1, 8,this.nodeData ? this.nodeData[8].visited : false));
            this.nodes.push(new MapNode(this, 380, 280, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[9].state : 1, 9,this.nodeData ? this.nodeData[9].visited : false));

            this.nodes.push(new MapNode(this, 500, 100, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[10].state : 1, 10,this.nodeData ? this.nodeData[10].visited : false));
            this.nodes.push(new MapNode(this, 480, 180, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[11].state : 1, 11,this.nodeData ? this.nodeData[11].visited : false));
            this.nodes.push(new MapNode(this, 520, 260, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[12].state : 1, 12,this.nodeData ? this.nodeData[12].visited : false));
            this.nodes.push(new MapNode(this, 450, 320, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[13].state : 1, 13,this.nodeData ? this.nodeData[13].visited : false));
            this.nodes.push(new MapNode(this, 550, 350, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[14].state : 1, 14,this.nodeData ? this.nodeData[14].visited : false));

            this.nodes.push(new MapNode(this, 600, 120, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[15].state : 1, 15,this.nodeData ? this.nodeData[15].visited : false));
            this.nodes.push(new MapNode(this, 650, 200, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[16].state : 1, 16,this.nodeData ? this.nodeData[16].visited : false));
            this.nodes.push(new MapNode(this, 600, 280, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[17].state : 1, 17,this.nodeData ? this.nodeData[17].visited : false));
            this.nodes.push(new MapNode(this, 680, 320, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[18].state : 1, 18,this.nodeData ? this.nodeData[18].visited : false));
            this.nodes.push(new MapNode(this, 720, 240, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[19].state : 1, 19,this.nodeData ? this.nodeData[19].visited : false));

            this.nodes.push(new MapNode(this, 700, 100, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[20].state : 1, 20,this.nodeData ? this.nodeData[20].visited : false));
            this.nodes.push(new MapNode(this, 740, 180, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[21].state : 1, 21,this.nodeData ? this.nodeData[21].visited : false));
            this.nodes.push(new MapNode(this, 740, 360, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[22].state : 1, 22,this.nodeData ? this.nodeData[22].visited : false));
            this.nodes.push(new MapNode(this, 700, 420, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[23].state : 1, 23,this.nodeData ? this.nodeData[23].visited : false));
            this.nodes.push(new MapNode(this, 620, 400, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[24].state : 1, 24,this.nodeData ? this.nodeData[24].visited : false));

            this.nodes.push(new MapNode(this, 540, 440, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[25].state : 1, 25,this.nodeData ? this.nodeData[25].visited : false));
            this.nodes.push(new MapNode(this, 460, 420, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[26].state : 1, 26,this.nodeData ? this.nodeData[26].visited : false));
            this.nodes.push(new MapNode(this, 400, 480, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[27].state : 1, 27,this.nodeData ? this.nodeData[27].visited : false));
            this.nodes.push(new MapNode(this, 320, 440, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[28].state : 1, 28,this.nodeData ? this.nodeData[28].visited : false));
            this.nodes.push(new MapNode(this, 250, 400, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[29].state : 1, 29,this.nodeData ? this.nodeData[29].visited : false));

            this.nodes.push(new MapNode(this, 180, 350, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[30].state : 1, 30,this.nodeData ? this.nodeData[30].visited : false));
            this.nodes.push(new MapNode(this, 100, 400, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[31].state : 1, 31,this.nodeData ? this.nodeData[31].visited : false));
            this.nodes.push(new MapNode(this, 150, 500, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[32].state : 1, 32,this.nodeData ? this.nodeData[32].visited : false));
            this.nodes.push(new MapNode(this, 250, 520, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[33].state : 1, 33,this.nodeData ? this.nodeData[33].visited : false));
            this.nodes.push(new MapNode(this, 350, 550, 'node', 'Test', 0.2, 0, this.nodeData ? this.nodeData[34].state : 1, 34,this.nodeData ? this.nodeData[34].visited : false));
            
        


        

        for (const n of this.nodes) n.setDepth(2);

        this.areaManager = new AreaManager(this, ['node10','node20']); 
        this.areaManager.updateAreas();

        this.drawConnections();


    }

    update(){
        this.drawConnections();
        this.areaManager.drawAreas();
    }

    drawConnections(){
        if (!this.nodes || this.nodes.length === 0) return;

        this.graphics.clear();
        this.graphics.lineStyle(4, 0xffffff, 0.8);

        // Find the current node
        const currentNode = this.nodes.find(n => n.state === 2); //CURRENT
        if (!currentNode) return;

        // Draw line to all nearby OPEN nodes
        for (const other of this.nodes) {
            if (other === currentNode) continue;
            if (other.state === 0 || other.state === 2) { //OPEN or CURRENT
                const dist = Phaser.Math.Distance.Between(currentNode.x, currentNode.y, other.x, other.y);
                if (dist <= currentNode.radius) {
                    this.graphics.beginPath();
                    this.graphics.moveTo(currentNode.x, currentNode.y);
                    this.graphics.lineTo(other.x, other.y);
                    this.graphics.strokePath();
                }
            }
        }
    }

    addFocus(nodeId){
        this.areaManager.addFocusNode(nodeId);
    }
}