export default class PlayerData //no hecha
{
    /**
     * 
     * @param {any} name
     * @param {any} HP
     * @param {any} HPMax
     * @param {any} habilidades
     * @param {any} estados
     * @param {any} SP
     * @param {any} SPMax
     * @param {any} critDMG
     * @param {any} critRate
     * @param {any} dinero
     * @param {any} hambre
     * @param {any} atacar
     * @param {any} defender
     * @param {any} huir
     * @param {any} arma
     * @param {any} pechera
     * @param {any} pantalones
     */
    constructor(name = "", HP = 0, HPMax = 0, habilidades = [], estados = [], SP = 0, SPMax = 0, critDMG = 0, critRate = 0, dinero = 0, hambre = 0, atacar, defender, huir, arma, pechera, pantalones) {
        this.habilidades = ["GRITO_BATALLA",'DISPARO_MULTIPLE','ATQ_BASICO','DISPARO_MULTIPLE']
    }
}