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
        this.add.image(0, 0, 'map').setOrigin(0);
        new MapNode(this,400,100,'node','CombatUI',0.5);
    }
}