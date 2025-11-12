import Menu from './Menu.js'
import MenuButton from './MenuButton.js';
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
        scene.add.existing(this);
        this.scene=scene
        this.playerData=playerData
        
        this.menuEquip = new Menu(this.scene, 0, 0, this.scene.sys.canvas.width/1.5, this.scene.sys.canvas.height*0.8, 20, 3, 0x222222);
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene,0,0,"Armas"));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene,(this.scene.sys.canvas.width/1.5)*(1/3),0,"Torso"));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene,(this.scene.sys.canvas.width/1.5)*(2/3),0,"Piernas"));

        this.menuItems = new Menu(this.scene, 0, 0, this.scene.sys.canvas.width/1.5, this.scene.sys.canvas.height*0.8, 20, 3, 0x222222).setVisible(false);
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene,0,0,"Fuera de combate"));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene,(this.scene.sys.canvas.width/1.5)*(1/3),0,"Dentro de combate"));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene,(this.scene.sys.canvas.width/1.5)*(2/3),0,"Fuera y dentro de combate"));

        this.menuHab = new Menu(this.scene, 0, 0, this.scene.sys.canvas.width/1.5, this.scene.sys.canvas.height*0.8, 20, 3, 0x222222).setVisible(false);

        this.menuSelect=new Menu(this.scene, 0,this.scene.sys.canvas.height*0.8,this.scene.sys.canvas.width/1.5,this.scene.sys.canvas.height*0.2,1,3);
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Objetos",null,()=>this.showItems()));
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Equipamiento",null,()=>this.showEquip()));
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Habilidades",null,()=>this.showHab()));


    }

    showEquip(){
        this.menuEquip.setVisible(true);
        this.menuItems.setVisible(false);
        this.menuHab.setVisible(false);
    }
    showItems(){
        this.menuEquip.setVisible(false);
        this.menuItems.setVisible(true);
        this.menuHab.setVisible(false);
    }
    showHab(){
        this.menuEquip.setVisible(false);
        this.menuItems.setVisible(false);
        this.menuHab.setVisible(true);
    }

}