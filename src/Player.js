import PlayerData from './PlayerData.js'
export default class Player extends Phaser.GameObjects.Image //no hecha
{
    /**
     * referencia al objeto con la info del player
     * @type {PlayerData}
     */
    player;

    /**
     * 
     * @param {PlayerData} playerData
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(player, scene, x, y, texture)
    {
        super(scene, x, y, texture);
        this.playerData = playerData;
    }
}