import Jugador from "./jugador"

const Target={
    SELF,
    ENEMY,
    RNDENEMY,
    ALLENEMIES
}
const Tipo={
    ACTIVA,
    PASIVA,
    TURNO1
}

export class Habilidad extends Phaser.GameObjects{
    constructor(Target,Tipo,id=0,nombre="",descripcion="",coste,damage,efecto){
        super(Target,Tipo,id,nombre,descripcion,coste,damage,efecto)
    }

    Execute(){
        switch(Tipo){
            case ACTIVA:
            if(SP>=coste){
                switch(Target){
                    case SELF:
                        efecto.apply(Jugador)
                        break
                    case ENEMY:
                        t=Combat.chooseTarget()
                        t.Hit(damage)
                        efecto.apply(t)
                        break
                    case RNDENEMY:
                        t=Math.floor(Math.random*Combat.enemies.length)
                        t.Hit(damage)
                        efecto.apply(t)
                        break
                    case ALLENEMIES:
                        for(e in Combat.enemies){
                            t.Hit(damage)
                            efecto.apply(t)
                        }
                        break
                }
            }
                break
            case PASIVA:
                efecto.apply(Jugador)
                break
            case TURNO1:
                if(Combate.turno=1){
                    efecto.apply(Jugador)
                }
                break
        }
        
    }
}