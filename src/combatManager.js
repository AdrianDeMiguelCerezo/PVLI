//Logica del combate
import CombatUI from "./scenes/combatui.js"
import Jugador from "./jugador.js"

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
    
export default class CombatManager extends Phaser.Events.EventEmitter{
    /**
     * 
     * @param {number} turn 
     * @param {*} enemies 
     * @param {*} player 
     * @param {*} CombatUI 
     */
    
    constructor(turn=0,enemies=[],player=null,CombatUI=null){
        this.turn=turn;
        this.enemies=enemies;
        this.player=player;
        this.CombatUI=CombatUI;
    }
    
    useAbility(key,accions){
        if(accions>=key.accions){
            objetivo;
            switch(key.Target){
                case Target.ENEMY:
                    objetivo=CombatUI.chooseEnemy();
                    break;
                case Target.SELF:
                    objetivo=this.player;
                    break;
                case Target.RND_ENEMY:
                    objetivo=enemies[Math.floor(Math.random()*this.enemies.length)];
                    break;
                case Target.ALL_ENEMIES:
                    objetivo=this.enemies;
                    break;
            }
            this.Execute(key,objetivo);
        }
    }
    useAbilityEnemy(key,enemy){
        objetivo;
            switch(key.Target){
                case Target.ENEMY:
                    objetivo=player;
                    break;
                case Target.SELF:
                    objetivo=enemy;
                    break;
                case Target.ALL_ENEMIES:
                    objetivo=this.enemies;
                    break;
            }
            this.Execute(key,objetivo);
    }
    Execute(key,objetivo) {
        objetivo.Hit(key,damage);
        objetivo.apply(key,turns);
    }
}