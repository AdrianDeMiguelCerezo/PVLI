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
        this.id=id;

        scene.add.existing(this);
        this.setInteractive();
        this.setScale(scale);
        
        if(this.state===State.CURRENT)this.visited=true;
        this.updateTint();
        this.on('pointerover', () => {
            if(this.state==State.OPEN)this.setTintFill(0xffffff);
        });
        this.on('pointerout', () => {
            this.updateTint();
        });
        this.on('pointerup', () => {
            if (this.state == State.OPEN) {
                // Reset old current node
                const oldCurrent = this.scene.nodes.find(n => n.state === State.CURRENT);
                if(oldCurrent) oldCurrent.state = State.OPEN;
                oldCurrent?.updateTint();

                // Set this node as current
                this.state = State.CURRENT;
                
                this.updateTint();

                this.openNearbyNodes();

                // Send node data to target scene
                const nodeData = this.scene.nodes.map(n => ({
                    id: n.id,
                    state: n.state,
                    visited: n.visited
                }));
                if(this.visited==false){
                    this.scene.scene.start(this.targetScene, { nodes: nodeData }); 
                }
                this.visited=true;
            }
        });
    }

    init(nodeInfo){
        if(nodeInfo && this.id in nodeInfo){
            this.state = nodeInfo[this.id].state;
            this.visited = nodeInfo[this.id].visited;
        }
    }
    

    updateTint() {
        this.clearTint();
        if(this.visited==true&&this.state!==State.CURRENT) this.setTintFill(0x8b0000);
        else{
             if (this.state === State.LOCKED) this.setTintFill(0x555555);
            else if (this.state === State.OPEN) this.setTintFill(0x000000);
            else if (this.state === State.CURRENT) this.setTintFill(0x00ff00);
        }
       
    }

    openNearbyNodes() {
    if (!this.scene.nodes) return;

    for (const other of this.scene.nodes) {
        if (other === this) continue;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);

        if (dist <= this.radius && other.state === State.LOCKED) {
            other.state = State.OPEN;
            other.updateTint();
        }
    }
}
}
