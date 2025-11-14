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

        let w=this.scene.sys.canvas.width;
        let h=this.scene.sys.canvas.height;
        
        this.menuEquip = new Menu(this.scene, 20, 50, w / 1.5, h * 0.8, 20, 3, 0x222222);
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, 0, 0, "Armas", { align: 'center' }));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (1 / 3), 0, "Torso", { align: 'center' }));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (2 / 3), 0, "Piernas", { align: 'center' }));

        this.menuItems = new Menu(this.scene, 20, 50, w/1.5, h*0.8, 20, 3, 0x222222).setVisible(false);
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, 0, 0, "Fuera \nde combate", { align: 'center' }));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (1 / 3), 0, "Dentro \nde combate", { align: 'center' }));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (2 / 3), 0, "Fuera y dentro \nde combate", { align: 'center' }));

        this.menuHab = new Menu(this.scene, 20, 50, w/1.5, h*0.8, 20, 3, 0x222222).setVisible(false);

        this.menuSelect=new Menu(this.scene, 0,h*0.9,w,h*0.2,1,3);
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Objetos",null,()=>this.showItems()));
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Equipamiento",null,()=>this.showEquip()));
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Habilidades",null,()=>this.showHab()));

        this.menuDesc=new Menu(this.scene,w*(2.1/3),50,w*(0.85/3),h*(0.8/3),3,2,0x222222);
        let clickedKey=""
        this.menuDesc.add(new Phaser.GameObjects.Text(this.scene,0,0,clickedKey.description));
        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Usar/equipar",null,()=>this.usar(clickedKey),15),2);
        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Desequipar",null,()=>this.desequipar(clickedKey),15),2);

        this.menuPlayer=new Menu(this.scene,w*(2.1/3),50+h*(0.86/3),w*(0.85/3),h*(0.6/3),2,2,0x222222);
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,0,"Arma equipada: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(1/3),"Torso equipado: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(2/3),"Piernas equipadas: "));
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