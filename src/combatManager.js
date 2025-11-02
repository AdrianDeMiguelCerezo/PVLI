//Logica del combate

import Enemy from "./Enemy.js";

const Target = {
SELF:0,
ENEMY:1,
RND_ENEMY:2,
ALL_ENEMIES:3
}
const Tipo = {
ACTIVA:0,
PASIVA:1,
TURNO1:2,
}
    
export default class CombatManager extends Phaser.Events.EventEmitter {

    /**
     * 
     * @param {number} turn
     * @param {any} enemies
     * @param {any} player
     * @param {any} combatInfo
     * @param {Phaser.Scene} scene
     */
    constructor(turn = 0, enemies, player = null, scene) {

        super();

        this.turn = turn;
        /**@type {Enemy}*/
        this.enemies=enemies;
        this.player = player;

        /**
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        this.scene.events.on("use_skill", this.Use_Skill, this)
        this.scene.events.on("target_selected", this.Target_Selected, this)
        
    }
    /**
     * @param {string} skillKey
     */
    Use_Skill(skillKey) {
        console.log(skillKey)
        this.scene.events.emit("select_target",skillKey)
    }
    /**
     * @param {Enemy} enemy
     * @param {string} skillKey
     */
    Target_Selected(enemy, skillKey) {
        console.log(enemy , "\nSkill:" ,skillKey)
    }


}