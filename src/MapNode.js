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

    constructor(scene,x,y,texture,targetScene,scale=1,nodeType,state,id,visited=false,radius=120){
        super(scene,x,y,texture)
        /**
         * Guarda la escena que carga al entrar al nodo
         * @type {Scene}
         */
        this.targetScene=targetScene;

        this.nodeType=nodeType;
        this.state=state;
        this.radius=radius;
        this.visited=visited;

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

        if (!this.scene.registry.has('nodeVisited')) {
            this.scene.registry.set('nodeVisited', {});
        }
        const nodeVisited = this.scene.registry.get('nodeVisited');

        if (typeof nodeVisited[this.id] !== 'undefined') {
            this.visited = nodeVisited[this.id];
        } 
        else {
            nodeVisited[this.id] = this.visited;
            this.scene.registry.set('nodeVisited', nodeVisited);
        }
        
        if(this.state===State.CURRENT)this.setVisited();
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

                this.scene.areaManager.expand();

                if (this.nodeType===2) {
                    this.scene.areaManager.addFocusNode(this.id);
                }

                if(nodeVisited[this.id]==false){
                    
                    scene.scene.start(this.targetScene);
                }
                 
                    
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

    setVisited() {

        const nodeVisited = this.scene.registry.get('nodeVisited') || false;
        nodeVisited[this.id] = true;
        this.scene.registry.set('nodeVisited', nodeVisited);
    }
    

    updateTint() {
        const nodeVisited = this.scene.registry.get('nodeVisited');
        this.clearTint();
        if(nodeVisited[this.id]==true&&this.state!==State.CURRENT) this.setTintFill(0x8b0000);
        else{
             if (this.state === State.LOCKED) this.setTintFill(0x555555);
            else if (this.state === State.OPEN) this.setTintFill(0x000000);
            else if (this.state === State.CURRENT) this.setTintFill(0x00ff00);
        }
       
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
                    other.state = State.OPEN;
                    other.updateTint();
                    nodeStates[other.id] = other.state;
                    other.setVisited();
                
                }
            }
            else{
                other.state=State.LOCKED;
                other.updateTint();
                nodeStates[other.id] = other.state;  
            }
        }

        // persist updated map once
        this.scene.registry.set('nodeStates', nodeStates);
    }
}
