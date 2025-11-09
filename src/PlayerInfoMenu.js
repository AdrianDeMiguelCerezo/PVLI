import Menu from './Menu'
import PlayerData from './PlayerData'
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
        
        this.menuGrande = new Menu(scene, 0, 400, scene.sys.canvas.width, 100, 1, 3, 0x222222)

        this.menuItems = new Menu(scene, 0, 50, scene.sys.canvas.width, 300, 1, 3, 0x444444).setVisible(true)

        this.menuPlayer = new Menu(scene, 0, 0, scene.sys.canvas.width, 400, 1, 3, 0x444444).setVisible(false)

        this.menuHabilidades = new Menu(scene, 0, 0, scene.sys.canvas.width, 400, 1, 3, 0x444444).setVisible(false)




    }

}