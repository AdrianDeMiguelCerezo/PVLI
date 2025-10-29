const NodeType={
    COMMON:0,
    TOWN:1,
    CITY:2
}

const State={
    OPEN:0,
    LOCKED:1,
    CURRENT:2
}

export default class MapNode extends Phaser.GameObjects.Sprite{

    constructor(scene,x,y,texture,targetScene,scale=1,nodeType,state){
        super(scene,x,y,texture)
        /**
         * Guarda la escena que carga al entrar al nodo
         * @type {Scene}
         */
        this.targetScene=targetScene;

        this.nodeType=nodeType;
        this.state=state;

        scene.add.existing(this);
        this.setInteractive();

        this.setScale(scale);
        if(this.state==State.CURRENT)this.setTintFill(0x00ff00);
        this.on('pointerover', () => {
            if(this.state==State.OPEN)this.setTintFill(0xffffff);
        });
        this.on('pointerout', () => {
            if(this.state==State.CURRENT)this.setTintFill(0x00ff00);
            else this.clearTint();
        });
        this.on('pointerup', () => {
            if(this.state==State.OPEN){
                
                

                this.state=State.CURRENT;

                const nodeStates = this.scene.registry.get('nodeStates');
                nodeStates.node1 = this.state;
                this.scene.registry.set('nodeStates', nodeStates);

                scene.scene.start(this.targetScene); 
                    
            }
        });
    }
}