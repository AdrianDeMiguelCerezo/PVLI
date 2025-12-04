
export default class PlayerData 
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
 * @param {any} arma
 * @param {any} torso
 * @param {any} pantalones
 */
    constructor(name = "", HP = 200, HPMax = 200, SP = 100, SPMax = 100, critDMG = 0, critRate = 0, dinero = 0, hambre = 0,
        habilidades = ["GRITO_BATALLA", 'DISPARO_MULTIPLE', 'ATAQUE_FURIOSO', 'CURACION'],
        items = [{ item: 'MOLOTOV', count: 2 }, { item: "POTI_HP_MINI", count: 3 }], 
        efectos = [],
        equipamiento = ["PANTALONES_REFORZADOS","PONCHO","ESCOPETA","VAQUEROS"],
        arma = "REVOLVER_OXIDADO", torso = "CHAQUETA_PIEL", pantalones = null, 
        skins=['cowboy','swimsuit','halloween','christmas','butler','school','cat'],
        skinIndex=0
    )

    {
        
        this.habilidadesOriginales = habilidades;
        this.habilidades = this.habilidadesOriginales;
        this.HP = HP;
        this.HPMax = HPMax;
        this.items = items;
        this.efectos = efectos;
        this.efectosTam = efectos.length;
        this.critDMG=critDMG;
        this.critRate=critRate;
        this.dinero=dinero;
        this.hambre=hambre;
        this.skins=skins;
        this.skinIndex=skinIndex;

        /**keys de equipamiento no equipado
         * @type {Array<string>} 
         */
        this.equipamiento = equipamiento;
        this.SP = SP;
        this.SPMax = SPMax;
        this.arma = arma;
        this.torso = torso;
        this.pantalones = pantalones;


    }
}
