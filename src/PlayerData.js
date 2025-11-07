
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
 * @param {any} arma
 * @param {any} pechera
 * @param {any} pantalones
 */
    constructor(name = "", HP = 200, HPMax = 200, habilidades = ["GRITO_BATALLA", 'DISPARO_MULTIPLE', 'ATAQUE_FURIOSO', 'CURACION'], items = [{ item: 'MOLOTOV', count: 2 }, { item: "POTI_HP_MINI", count: 1 }], estados = [], SP = 100, SPMax = 100, critDMG = 0, critRate = 0, dinero = 0, hambre = 0, arma = "REVOLVER_OXIDADO", pechera = "CHAQUETA_PIEL", pantalones = "PANTALONES_REFORZADOS") {
        
        this.habilidadesOriginales = habilidades;
        this.habilidades = this.habilidadesOriginales;
        this.HP = HP;
        this.HPMax = HPMax;
        this.items = items;
        this.estados = [];
        this.SP = SP;
        this.SPMax = SPMax;
        this.arma = arma;
        this.pechera = pechera;
        this.pantalones = pantalones;

    }
}