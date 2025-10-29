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
            this.registry.set('nodeStates', {
                node1: 0,
                node2: 1,
                node3: 2
            });
        }

        const nodeStates = this.registry.get('nodeStates');

        this.add.image(0, 0, 'map').setOrigin(0);
        new MapNode(this,400,100,'node','Test',0.5,0,nodeStates.node1);
    }
}