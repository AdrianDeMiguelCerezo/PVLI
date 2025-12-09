import EventParser from "./EventParser.js";
import PlayerData from "./PlayerData.js";

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


export default class MapNode extends Phaser.GameObjects.Sprite {
    /**
     * 
     * @param {any} scene
     * @param {any} x
     * @param {any} y
     * @param {any} texture
     * @param {any} eventKeys
     * @param {any} playerData
     * @param {any} nodeType
     * @param {any} state
     * @param {any} isFocus
     * @param {any} visited
     * @param {any} scale
     * @param {any} difficulty
     * @param {any} radius
     */
    constructor(scene, x, y, texture,eventKeys, playerData, nodeType, state, isFocus = false,isAwake = false, difficulty = 0, visited = false, scale = 0.2, radius = 130,event = null) {
        super(scene, x, y, texture)
        /**
         * Guarda la escena que carga al entrar al nodo
         * @type {Scene}
         */

        
        this.name = "node"

        //this.eventKeys = eventKeys;
        this.playerData = playerData;
        this.nodeType = nodeType;
        this.state = state;
        this.radius = radius;
        this.visited = visited;
        this.isFocus = isFocus;
        this.difficulty = difficulty;
        this.isAwake = isAwake;

        if(eventKeys === undefined){
            let jsonEvent = Object.keys(this.scene.jsonEventos);
            let easyEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            while(easyEvent === undefined){
                easyEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            }
            jsonEvent.splice(jsonEvent.indexOf(easyEvent), 1);
            let midEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            while(midEvent === undefined){
                midEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            }
            jsonEvent.splice(jsonEvent.indexOf(midEvent), 1);
            let hardEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            while(hardEvent === undefined){
                hardEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            }
            jsonEvent.splice(jsonEvent.indexOf(hardEvent), 1);
            let fkcedEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            while(fkcedEvent === undefined){
                fkcedEvent = jsonEvent[Phaser.Math.Between(1, jsonEvent.length)];
            }
            jsonEvent.splice(jsonEvent.indexOf(fkcedEvent), 1);
            this.eventKeys = {easyEvent: easyEvent, midEvent: midEvent, hardEvent: hardEvent, fkcedEvent: fkcedEvent};
            console.log(this.eventKeys);
        }
        else{
            this.eventKeys = eventKeys;
        }

        //if(this.difficulty )
        let eventoParserer = new EventParser(this.scene.jsonEventos,this.scene.jsonHabilidades,this.scene.jsonEquipamiento,this.scene.jsonItems,this.scene.jsonEfectos);

        if(this.difficulty < DifficultyLimits.MEDIUM){
            this.chosenEvent = this.eventKeys.easyEvent;
        }
        else if(this.difficulty < DifficultyLimits.HARD){
            this.chosenEvent = this.eventKeys.midEvent;
        }
        else if(this.difficulty < DifficultyLimits.FUCKED){
            this.chosenEvent = this.eventKeys.hardEvent;
        }
        else{
            this.chosenEvent = this.eventKeys.fkcedEvent;
        }
        let eventoParseado = eventoParserer.generateEvent(this.chosenEvent);

        scene.add.existing(this);
        this.setInteractive();
        this.setScale(scale);

        if (this.state === State.CURRENT) {
            this.visited = true;

        }
        this.updateTint();


        this.on('pointerover', () => {
            if (this.state === State.OPEN) this.setTintFill(0xffffff);

            this.drawConnectionsFromCurrent()
            this.drawConnectionsFromMe()


        });
        this.on('pointerout', () => {
            this.updateTint();
            this.drawConnectionsFromCurrent();
        });
        this.on('pointerup', () => {
            
            if (this.state === State.OPEN) {
                // Reset old current node
                const oldCurrent = this.scene.nodes.find(n => n.state === State.CURRENT);
                if (oldCurrent) oldCurrent.state = State.OPEN;
                oldCurrent?.updateTint();

                // Set this node as current
                this.state = State.CURRENT;

                this.updateTint();
                this.drawConnectionsFromCurrent();

                
                this.openNearbyNodes();

                this.scene.UpdateFociDifficulties(10);


                if (this.visited == false) {
                    this.visited = true;

                    let nodeData = this.scene.nodes.map(n => ({
                        x: n.x,
                        y: n.y,
                        event: n.eventKeys,
                        playerData: n.playerData,
                        nodeType: n.nodeType,
                        state: n.state,
                        isFocus: n.isFocus,
                        isAwake:n.isAwake,
                        visited: n.visited,
                        scale: n.scale,
                        difficulty: n.difficulty,
                        radius: n.radius

                    }));

                    this.scene.registry.set("nodes", nodeData);

                    this.scene.events.removeAllListeners("update_tint");
                    
                    this.scene.scene.start('DialogueScene', {fragmentoEvento: eventoParseado, playerData: this.playerData});

                }
                
            }
        });

        this.scene.events.on("update_tint", this.updateTint,this)
    }


    updateTint() {
        this.clearTint();
        if (this.visited == true && this.state !== State.CURRENT) this.setTintFill(0x8b0000);
        else {
            if (this.state === State.LOCKED) this.setTintFill(0x555555);
            else if (this.state === State.OPEN) this.setTintFill(0x000000);
            else if (this.state === State.CURRENT) this.setTintFill(0x00ff00);
        }
        
        //if (this.scene.game.config.physics.arcade.debug) {
            if (this.difficulty < 100) { }
            else if (this.difficulty < 200) { this.setTintFill(0x8B6300) }
            else if (this.difficulty < 300) { this.setTintFill(0x8B4800) }
            else { this.setTintFill(0x8B1800) }
        //}

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

    drawConnectionsFromMe() {

        if (this.state === State.CURRENT) {
            this.drawConnectionsFromCurrent()
        }
        else {
            this.scene.graphics.lineStyle(3, 0xAABBAA, 0.8);

            // Draw line to all nearby nodes
            for (const other of this.scene.nodes) {
                if (other === this || other.state === State.CURRENT) continue;

                const dist = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
                if (dist <= this.radius) {
                    this.scene.graphics.beginPath();
                    this.scene.graphics.moveTo(this.x, this.y);
                    this.scene.graphics.lineTo(other.x, other.y);
                    this.scene.graphics.strokePath();
                }

            }
        }


    }
    drawConnectionsFromCurrent() {

        this.scene.graphics.clear();

        this.scene.graphics.lineStyle(4, 0xffffff, 0.8);

        /** 
         * @type {MapNode} 
         */
        const currentNode = this.scene.nodes.find(n => n.state === State.CURRENT); //CURRENT
        
        if (!currentNode) return;

        // Draw line from current to OPEN, nearby nodes
        for (const other of this.scene.nodes) {
            if (other === currentNode) continue;

            if (other.state === State.OPEN) { //OPEN 
                const dist = Phaser.Math.Distance.Between(currentNode.x, currentNode.y, other.x, other.y);
                if (dist <= currentNode.radius) {
                    this.scene.graphics.beginPath();
                    this.scene.graphics.moveTo(currentNode.x, currentNode.y);
                    this.scene.graphics.lineTo(other.x, other.y);
                    this.scene.graphics.strokePath();
                }
            }
        }
    }  
}
