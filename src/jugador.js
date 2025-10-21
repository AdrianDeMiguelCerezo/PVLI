import Personaje from "./personaje.js"
export default class Jugador extends Personaje{
    constructor(name="",HP=0, HPMax=0, Habilidades=[0], StatusEffects=[0],SP=0,SPMax=0,critDMG=0,critRate=0,dinero=0,hambre=0,atacar,defender,huir,arma,pechera,pantalones){
        super(name,HP, HPMax, Habilidades, StatusEffects)
    }

    Defend(defender){
        defgain=defender.defense
        if(acciones==1){
            defgain/=2
        }
        acciones-=2
    }

    Huir(huir){
        if(acciones>=huir.reqacciones){
            acciones-=2
            flee=true
        }
    }
}