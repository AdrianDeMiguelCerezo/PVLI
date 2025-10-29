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

        new MapNode(this,400,100,'node','Test',0.5,0,0,'node1');
        new MapNode(this,380,150,'node','Test',0.5,0,1,'node2');
        new MapNode(this,350,100,'node','Test',0.5,0,1,'node3');
        
       
    }
}