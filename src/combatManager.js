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
    constructor(enemies=[],player=null,CombatUI=null){
        super(enemies,player,CombatUI)
    }
    
    Execute(objetivo) { //el combatManager ejecuta la habilidad y le pasa quien la esta casteando.

        switch (objetivoEnum) {
            
            case Target.SELF: //lo aplico sobre mi
                me.Hit(damage);
                me.apply();
                break;
            case Target.ENEMY: // lo aplico sobre un objetivo que me pasan (de la clase personaje)
                objetivo = GetSelectedTarget();
                objetivo.Hit(damage);
                objetivo.apply();
                break;
            case Target.RND_ENEMY: // lo aplico sobre un objetivo random de los enemigos
                objetivo = this.enemies[Math.floor(Math.random * this.enemies.length)];
                objetivo.Hit(damage);
                objetivo.apply();
                break;
            case Target.ALL_ENEMIES: // lo aplico sobre todos los enemigos
                for (e in enemies) {
                    e.Hit(damage)
                    e.apply()
                }
                break;
        }



    }
}