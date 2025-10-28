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
     * @param {*} enemies 
     * @param {*} player 
     * @param {*} CombatUI 
     */
    
    constructor(turn=0,enemies,player=null,CombatUI=null){
        this.turn=turn;
        this.enemies=enemies;
        this.player=player;
        this.CombatUI = CombatUI;
            switch(key.Target){
                case Target.ENEMY:
                    objetivo=CombatUI.chooseEnemy();
                    break;
                case Target.SELF:
                    objetivo=this.player;
                    break;
                case Target.RND_ENEMY:

    }

    
    
}