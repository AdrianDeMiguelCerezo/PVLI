import Menu from './Menu.js'
import PlayerData from './PlayerData.js'
export default class PlayerInfoMenu extends Phaser.GameObjects.Container
{
    /**
     * 
     * @param {Phaser.Scene} scene
     * @param {any} x
     * @param {any} y
     * @param {PlayerData} playerData
     */
    constructor(scene,x,y,playerData)
    {
        super(scene, x, y)
        
        this.menuGrande = new Menu(scene, 0, scene.sys.canvas.height * 7 / 8, scene.sys.canvas.width, scene.sys.canvas.height * 1 / 8, 1, 3, 0x222222)

        this.menuItems = new Menu(scene, 0, 0, scene.sys.canvas.width, scene.sys.canvas.height-this.menuGrande.height, 1, 3, 0x999999,50).setVisible(true)

        this.menuPlayer = new Menu(scene, 0, 0, scene.sys.canvas.width, 400, 1, 3, 0x444444).setVisible(false)

        this.menuHabilidades = new Menu(scene, 0, 0, scene.sys.canvas.width, 400, 1, 3, 0x444444).setVisible(false)

    }

}