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
        this.HP;
        this.SP;
        this.arma;
        this.torso;
        this.pantalones;
        this.def;
        this.critDMG;
        this.critRate;
        this.dinero;
        this.hambre;
        this.updateValues();
        
        this.menuEquip = new Menu(this.scene, 20, 50, w/1.5, h * 0.8, 20, 3, 0x222222);
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
        this.desc=""
        this.menuDesc.add(new Phaser.GameObjects.Text(this.scene,0,0,this.desc));
        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Usar/equipar",null,()=>this.usar(clickedKey),15),2);
        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Desequipar",null,()=>this.desequipar(clickedKey),15),2);   

        this.menuPlayer=new Menu(this.scene,w*(2.1/3),50+h*(0.86/3),w*(0.85/3),h*(0.6/3),6,1,0x222222);
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,0,"Arma equipada: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(1/6),this.arma));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(2/6),"Torso equipado: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(3/6),this.torso));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(4/6),"Piernas equipadas: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(5/6),this.pantalones)); 

        this.menuStats=new Menu(this.scene,w*(2.1/3),60+h*(0.86/3)+h*(0.6/3),w*(0.85/3),h*(0.89/3),12,1,0x222222);
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,0,"Defensa: "+this.def));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(1/12),"Daño crítico: "+this.critDMG));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(2/12),"Prob. crítica: "+this.critRate));
        this.menuStats.add(new Phaser.GameObjects.Image(this.scene,20,h*(0.89/3)*(6/12),'player'));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(8/12),"Dinero: "+this.dinero));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(9/12),"HP: "+this.HP));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(10/12),"SP: "+this.SP));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(11/12),"Hambre: "+this.hambre));
        this.create()
    }
    create(){
        this.scene.events.on("show_description",this.OnButtonClicked,this);
        this.addEquip();
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
    updateValues(){
        this.HP=this.playerData.HP;
        this.SP=this.playerData.SP;
        this.arma=this.playerData.arma;
        this.torso=this.playerData.torso;
        this.pantalones=this.playerData.pantalones;
        this.def=0;
        this.critDMG=this.playerData.critDMG;
        this.critRate=this.playerData.critRate;
        this.dinero=this.playerData.dinero;
        this.hambre=this.playerData.hambre;
    }

    addEquip(){
        
        for(let key of this.playerData.equipamiento){
            const item=this.scene.jsonEquipamiento[key];
            let column=0;
            switch(item.type){
                case 'WEAPON':
                    column=0;
                    break;
                case 'TORSO':
                    column=1;
                    break;
                case 'LEGGINS':
                    column=2;
                    break;
            }     
            let button=new MenuButton(this.scene,0,0,key,null,null,21,0,"#707070",false);
            this.menuEquip.AddButton(button,1,column);
        }
    }

    updateMenus(menuShow){
        delete this.menuEquip;
        delete this.menuItems;
        delete this.menuHab;
        delete this.menuDesc;
        delete this.menuPlayer;
        delete this.menuStats;

        let w=this.scene.sys.canvas.width;
        let h=this.scene.sys.canvas.height;

        this.menuEquip = new Menu(this.scene, 20, 50, w/1.5, h * 0.8, 20, 3, 0x222222);
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, 0, 0, "Armas", { align: 'center' }));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (1 / 3), 0, "Torso", { align: 'center' }));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (2 / 3), 0, "Piernas", { align: 'center' }));

        this.menuItems = new Menu(this.scene, 20, 50, w/1.5, h*0.8, 20, 3, 0x222222);
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, 0, 0, "Fuera \nde combate", { align: 'center' }));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (1 / 3), 0, "Dentro \nde combate", { align: 'center' }));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, (w / 1.5) * (2 / 3), 0, "Fuera y dentro \nde combate", { align: 'center' }));

        this.menuHab = new Menu(this.scene, 20, 50, w/1.5, h*0.8, 20, 3, 0x222222);

        this.menuDesc=new Menu(this.scene,w*(2.1/3),50,w*(0.85/3),h*(0.8/3),3,2,0x222222);
        this.menuDesc.add(new Phaser.GameObjects.Text(this.scene,0,0,this.desc));
        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Usar/equipar",null,()=>this.usar(clickedKey),15),2);
        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Desequipar",null,()=>this.desequipar(clickedKey),15),2);   

        this.menuPlayer=new Menu(this.scene,w*(2.1/3),50+h*(0.86/3),w*(0.85/3),h*(0.6/3),6,1,0x222222);
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,0,"Arma equipada: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(1/6),this.arma));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(2/6),"Torso equipado: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(3/6),this.torso));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(4/6),"Piernas equipadas: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.6/3)*(5/6),this.pantalones)); 

        this.menuStats=new Menu(this.scene,w*(2.1/3),60+h*(0.86/3)+h*(0.6/3),w*(0.85/3),h*(0.89/3),12,1,0x222222);
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,0,"Defensa: "+this.def));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(1/12),"Daño crítico: "+this.critDMG));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(2/12),"Prob. crítica: "+this.critRate));
        this.menuStats.add(new Phaser.GameObjects.Image(this.scene,20,h*(0.89/3)*(6/12),'player'));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(8/12),"Dinero: "+this.dinero));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(9/12),"HP: "+this.HP));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(10/12),"SP: "+this.SP));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,h*(0.89/3)*(11/12),"Hambre: "+this.hambre));

        this.addEquip();

        if(menuShow==1){
            this.showEquip();
        }
        else if(menuShow==2){
            this.showItems();
        }
        else if(menuShow==3){
            this.showHab();
        }
    }

    OnButtonClicked(key){
        this.desc=this.scene.jsonEquipamiento[key].description;
        this.updateMenus(1);
    }

}