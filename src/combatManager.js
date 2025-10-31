//Logica del combate
import CombatUI from "./scenes/combatui.js"

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
    
export default class CombatManager {

    /**
     * 
     * @param {number} turn
     * @param {any} enemies
     * @param {any} player
     * @param {any} combatInfo
     */
    constructor(turn = 0, enemies, player = null, battleScene) {
        
        this.turn=turn;
        this.enemies=enemies;
        this.player = player;
        this.battleScene = battleScene;

        this.battleScene.events.on("use_skill", this.Use_Skill, this)
        this.battleScene.events.on("target_selected", this.Target_Selected, this)
        
    }

    Use_Skill(skillKey) {
        console.log(skillKey)
    }

    Target_Selected(index, skillKey) {

    }


}