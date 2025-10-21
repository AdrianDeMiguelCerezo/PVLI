import Jugador from "./jugador"

const Target = {
    SELF:'SELF',
    ENEMY:'ENEMY',
    RND_ENEMY:'RND_ENEMY',
    ALL_ENEMIES:'ALL_ENEMIES'
}
const Tipo = {
    ACTIVA:'ACTIVA',
    PASIVA:'PASIVA',
    TURNO1:'TURNO1',
}

export class Habilidad {
    constructor(Target, Tipo, id = 0, nombre = "", descripcion = "", coste, damage, efecto) {
        
    }

    Execute(me) { //el combatManager ejecuta la habilidad y le pasa quién la está casteando.

        objetivo;
        switch (objetivo) {
            //
            case Target.SELF: //lo aplico sobre mí
                objetivo = me;
                objetivo.Hit(damage);
                objetivo.apply();
                break;
            case 'ENEMY': // lo aplico sobre un objetivo que me pasan (de la clase personaje)
                objetivo = Combat.GetSelectedTarget();
                objetivo.Hit(damage);
                objetivo.apply();
                break;
            case 'RND_ENEMY': // lo aplico sobre un objetivo random de los enemigos
                objetivo = this.enemies[Math.floor(Math.random * this.enemies.length)];
                objetivo.Hit(damage);
                objetivo.apply();
                break;
            case 'ALL_ENEMIES': // lo aplico sobre todos los enemigos
                for (e in Combat.enemies) {
                    objetivo.Hit(damage)
                    objetivo.apply()
                }
                break;
        }



    }

}


