import PlayerData from './PlayerData.js'
export default class Player extends Phaser.GameObjects.Image//no hecha
{
    /**
     * referencia al objeto con la info del player
     * @type {PlayerData}
     */
    player;

    /**
     * 
     * @param {PlayerData} playerData
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(playerData, scene, x, y, texture)
    {
        super(scene, x, y, texture);
        this.playerData = playerData;

        this.atacar = this.scene.jsonEquipamiento[this.playerData.arma].habilidades[0];
        this.defender = this.scene.jsonHabilidades["DEFENDER"];
        //this.huir
        this.efectos = []
    }
}