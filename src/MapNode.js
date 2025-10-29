const NodeType={
    COMMON:0,
    TOWN:1,
    CITY:2
}

const State={
    OPEN:0,
    LOCKED:1,
    CURRENT:2,
    PERMALOCKED:3
}

export default class MapNode extends Phaser.GameObjects.Sprite{

    constructor(scene,x,y,texture,targetScene,scale=1,nodeType,state,id,radius=200){
        super(scene,x,y,texture)
        /**
         * Guarda la escena que carga al entrar al nodo
         * @type {Scene}
         */
        this.targetScene=targetScene;

        this.nodeType=nodeType;
        this.state=state;
        this.radius=radius;

        if (!scene.nodes) scene.nodes = [];
        scene.nodes.push(this);

        this.id = id || `node-${this.scene.nodes.length}`;

        scene.add.existing(this);
        this.setInteractive();
        this.setScale(scale);

        if (!this.scene.registry.has('nodeStates')) {
            this.scene.registry.set('nodeStates', {});
        }
        const nodeStates = this.scene.registry.get('nodeStates');

        if (typeof nodeStates[this.id] !== 'undefined') {
            this.state = nodeStates[this.id];
        } 
        else {
            nodeStates[this.id] = this.state;
            this.scene.registry.set('nodeStates', nodeStates);
        }

        this.updateTint();
        this.on('pointerover', () => {
            if(this.state==State.OPEN)this.setTintFill(0xffffff);
        });
        this.on('pointerout', () => {
            this.updateTint();
        });
        this.on('pointerup', () => {
            if (this.state == State.OPEN) {

                this.setState(State.CURRENT);

                this.openNearbyNodes();

                scene.scene.start(this.targetScene, ["malo" ]); 
                    
            }
        });
    }

    setState(newState) {
        this.state = newState;
        this.updateTint();

        const nodeStates = this.scene.registry.get('nodeStates') || {};
        nodeStates[this.id] = this.state;
        this.scene.registry.set('nodeStates', nodeStates);
    }

    updateTint() {
        this.clearTint();
        if (this.state === State.LOCKED) this.setTintFill(0x555555);
        else if (this.state === State.OPEN) this.setTintFill(0x000000);
        else if (this.state === State.CURRENT) this.setTintFill(0x00ff00);
        else if(this.state===State.PERMALOCKED)this.setTintFill(0x8b0000);
    }

     openNearbyNodes() {
        if (!this.scene.nodes || this.scene.nodes.length <= 1) return;

        const nodeStates = this.scene.registry.get('nodeStates') || {};

        for (const other of this.scene.nodes) {
            if (other === this) continue;

            const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);

            // console.log(`${this.id} -> ${other.id}: dist=${dist.toFixed(1)}, radius=${this.radius}`);

            if (dist <= this.radius) {
                if (other.state === State.LOCKED) {
                other.state = State.OPEN;
                other.updateTint();
                nodeStates[other.id] = other.state;
                }
                else if(other.state===State.CURRENT){
                    other.state = State.PERMALOCKED;
                    other.updateTint();
                    nodeStates[other.id] = other.state;
                
                }
            }
            else{
                if(other.state!==State.PERMALOCKED){
                    other.state=State.LOCKED;
                    other.updateTint();
                    nodeStates[other.id] = other.state;
                }
                
            }
        }

        // persist updated map once
        this.scene.registry.set('nodeStates', nodeStates);
  }
}
