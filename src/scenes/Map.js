import MapNode from '../MapNode.js'

export default class Map extends Phaser.Scene{
    constructor(){
        super({key:'Map'})
    }

    preload(){
        this.load.image('node','assets/Node.png')
        this.load.image('map','assets/MapTemplate.png')
    }

    create(){

        if (!this.registry.has('nodeStates')) {
            this.registry.set('nodeStates', {});
        }

        this.nodes = [];

        this.add.image(0, 0, 'map').setOrigin(0);


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
        new MapNode(this, 520, 260, 'node', 'Test', 0.2, 0, 1, 'node13');
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
        new MapNode(this, 700, 420, 'node', 'Test', 0.2, 0, 1, 'node24');
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

    }
}