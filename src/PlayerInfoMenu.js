import HealthBar from './HealthBar.js';
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

        this.w=this.scene.sys.canvas.width;
        this.h=this.scene.sys.canvas.height;

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
             
        this.showEquip();
        
        this.menuSelect=new Menu(this.scene, 0,this.h*0.9,this.w,this.h*0.2,1,3);
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Objetos",null,()=>this.showItems()));
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Equipamiento",null,()=>this.showEquip()));
        this.menuSelect.AddButton(new MenuButton(this.scene,0,0,"Habilidades",null,()=>this.showHab()));

        this.menuDesc=new Menu(this.scene,this.w*(2.1/3),50,this.w*(0.85/3),this.h*(0.8/3),4,1,0x222222);
        this.desc="" 

        this.menuPlayer=new Menu(this.scene,this.w*(2.1/3),50+this.h*(0.86/3),this.w*(0.85/3),this.h*(0.6/3),12,1,0x222222);
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,0,"Arma equipada: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.6/3)*(2/6),"Torso equipado: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.6/3)*(4/6),"Piernas equipadas: "));
        this.addPlayer();

        this.menuStats=new Menu(this.scene,this.w*(2.1/3),60+this.h*(0.86/3)+this.h*(0.6/3),this.w*(0.85/3),this.h*(0.89/3),12,1,0x222222);
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,0,"Defensa: "+this.def));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(1/12),"Daño crítico: "+this.critDMG));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(2/12),"Prob. crítica: "+this.critRate));
        this.menuStats.add(new Phaser.GameObjects.Image(this.scene,20,this.h*(0.89/3)*(6/12),'player'));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(8/12),"Dinero: "+this.dinero));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(9/12),"HP: "));
        this.menuStats.add(new HealthBar(this.scene,100,this.h*(0.89/3)*(9/12),150,15,this.HP));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(10/12),"SP: "));
        this.menuStats.add(new HealthBar(this.scene,100,this.h*(0.89/3)*(10/12),150,15,this.SP,2,0x0000ff));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(11/12),"Hambre: "+this.hambre));

        //Usados en todos los menus
        this.scene.add.rectangle(23,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (1 / 3)+22,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (2 / 3)+18,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5)+17,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1); 
        this.scene.add.rectangle(this.w/3+20,this.h*0.8+48,this.w/1.5,5,0xcf303f,1);

        //Usados en todos, pero este no se borra al no estar dentro de los confines del menú
        this.scene.add.rectangle(this.w/3+20,48,this.w/1.5,5,0xcf303f,1);

        //Usado en el menú de equipamiento
        this.scene.add.rectangle(this.w/3+20,68,this.w/1.5,5,0xcf303f,1);

        //Para el menuDesc
        this.scene.add.rectangle(this.w*(2.525/3),50,this.w*(0.85/3),2,0xcf303f,1);
        this.scene.add.rectangle(this.w*(2.525/3),50+this.h*(0.8/3),this.w*(0.85/3),2,0xcf303f,1);
        this.scene.add.rectangle(this.w*(2.1/3),50+this.h*(0.4/3),2,this.h*(0.81/3),0xcf303f,1);
        this.scene.add.rectangle(this.w*(2.95/3),50+this.h*(0.4/3),2,this.h*(0.81/3),0xcf303f,1);
        this.start();
    }
    /**
     * Realiza las cosas que no se deberían hacer en el constructor al principio de la escena
     */
    start(){
        this.scene.events.on("show_description",this.OnButtonClicked,this);
    }

    /**
     * Solo deja visible el menu de equipamiento
     */
    showEquip(){
        this.menuItems?.destroy();
        this.menuHab?.destroy();

        this.menuEquip = new Menu(this.scene, 20, 50, this.w/1.5, this.h * 0.8, 20, 3, 0x6f9090);
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, 70, 0, "Armas", { align: 'center' }));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, 65+(this.w / 1.5) * (1 / 3), 0, "Torso", { align: 'center' }));
        this.menuEquip.add(new Phaser.GameObjects.Text(this.scene, 50+(this.w / 1.5) * (2 / 3), 0, "Piernas", { align: 'center' }));
        this.menuEquip.AddButton(new MenuButton(this.scene,0,0,"PONCHO",null,null,0,0,"#222222",false),-1,0);
        this.menuEquip.AddButton(new MenuButton(this.scene,0,0,"PONCHO",null,null,0,0,"#222222",false),-1,1);
        this.menuEquip.AddButton(new MenuButton(this.scene,0,0,"PONCHO",null,null,0,0,"#222222",false),-1,2);

        //Usados en todos los menus
        this.scene.add.rectangle(23,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (1 / 3)+22,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (2 / 3)+18,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5)+17,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1); 
        this.scene.add.rectangle(this.w/3+20,this.h*0.8+48,this.w/1.5,5,0xcf303f,1);

        //Usado en el menú de equipamiento
        this.scene.add.rectangle(this.w/3+20,68,this.w/1.5,5,0xcf303f,1);


        this.addEquip();
    }
    /**
     * Solo deja visible el menu de items
     */
    showItems(){
        this.menuEquip?.destroy();
        this.menuHab?.destroy();
        

        this.menuItems = new Menu(this.scene, 20, 50, this.w/1.5, this.h*0.8, 20, 3, 0x6f9090);
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, 40, 0, "Fuera \nde combate", { align: 'center' }));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, 40+(this.w / 1.5) * (1 / 3), 0, "Dentro \nde combate", { align: 'center' }));
        this.menuItems.add(new Phaser.GameObjects.Text(this.scene, 20+(this.w / 1.5) * (2 / 3), 0, "Fuera y dentro \nde combate", { align: 'center' }));
        this.menuItems.AddButton(new MenuButton(this.scene,0,0,"PONCHO",null,null,0,0,"#222222",false),-1,0);
        this.menuItems.AddButton(new MenuButton(this.scene,0,0,"PONCHO",null,null,0,0,"#222222",false),-1,1);
        this.menuItems.AddButton(new MenuButton(this.scene,0,0,"PONCHO",null,null,0,0,"#222222",false),-1,2);


        //Usados en todos los menus
        this.scene.add.rectangle(23,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (1 / 3)+22,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (2 / 3)+18,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5)+17,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1); 
        this.scene.add.rectangle(this.w/3+20,this.h*0.8+48,this.w/1.5,5,0xcf303f,1);

        //Usado en el menú de equipamiento
        this.scene.add.rectangle(this.w/3+20,80,this.w/1.5,2,0xcf303f,1);

        this.addItems();
    }
    /**
     * Solo deja visible el menu de habilidades
     */
    showHab(){
        this.menuEquip?.destroy();
        this.menuItems?.destroy();
        this.menuHab = new Menu(this.scene, 20, 50, this.w/1.5, this.h*0.8, 20, 3, 0x6f9090);

        //Usados en todos los menus
        this.scene.add.rectangle(23,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (1 / 3)+22,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5) * (2 / 3)+18,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1);
        this.scene.add.rectangle((this.w / 1.5)+17,this.h*0.4+50,5,this.h * 0.8,0xcf303f,1); 
        this.scene.add.rectangle(this.w/3+20,this.h*0.8+48,this.w/1.5,5,0xcf303f,1);

        this.addHab();
    }

    /**
     * Actualiza los valores que se saca de playerData para cuando cambien
     */
    updateValues(){
        this.HP=this.playerData.HP;
        this.SP=this.playerData.SP;
        this.arma=this.playerData.arma;
        this.torso=this.playerData.torso;
        this.pantalones=this.playerData.pantalones;
        let weapon=null;
        let torso=null;
        let pants=null;
        if(this.arma){
            weapon=this.scene.jsonEquipamiento[this.arma];
        }
        if(this.torso){
            torso=this.scene.jsonEquipamiento[this.torso];
        }
        if(this.pantalones){
            pants=this.scene.jsonEquipamiento[this.pantalones];
        }
        this.def = (torso?.defense ?? 0) + (pants?.defense ?? 0);

        this.critDMG =
            (weapon?.crit_damage ?? 0) +
            (torso?.crit_damage ?? 0) +
            (pants?.crit_damage ?? 0);

        this.critRate =
            (weapon?.crit_chance ?? 0) +
            (torso?.crit_chance ?? 0) +
            (pants?.crit_chance ?? 0);
        this.dinero=this.playerData.dinero;
        this.hambre=this.playerData.hambre;
    }

    /**
     * Añade botones en el menu de equipamiento para representar el array de equipamiento no equipado de playerData
     */
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
            this.menuEquip.AddButton(new MenuButton(this.scene,0,0,key,null,null,15,0,"#c8d9d0",false),-1,column);
        }
    }
    /**
     * Lo mismo que addEquip pero para Items
     */
    addItems(){
        for(let entry of this.playerData.items){
            const key=entry.item;
            const item=this.scene.jsonItems[key];
            let column=0;
            if(item.usedInCombat){
                if(item.usedOutOfCombat){
                    column=2;
                }
                else{
                    column=1;
                }
            }
            this.menuItems.AddButton(new MenuButton(this.scene,0,0,key,null,null,15,0,"#c8d9d0",false),-1,column);
        }
    }

    /**
     * Añade al menuHab las habilidades que tengas
     */
    addHab(){
        for(let key of this.playerData.habilidades){
            this.menuHab.AddButton(new MenuButton(this.scene,0,0,key,null,null,15,0,"#c8d9d0",false),-1,-1);
        }
    }

    /**
     * Añade al menuPlayer el equipamiento que tiene equipado
     */
    addPlayer(){
        if(this.arma!=null){
            this.menuPlayer.AddButton(new MenuButton(this.scene,0,0,this.arma,null,null,15,0,"#c8d9d0",false),1,0);
        }
        if(this.torso!=null){
            this.menuPlayer.AddButton(new MenuButton(this.scene,0,0,this.torso,null,null,15,0,"#c8d9d0",false),5,0);
        }
        if(this.pantalones!=null){
            this.menuPlayer.AddButton(new MenuButton(this.scene,0,0,this.pantalones,null,null,15,0,"#c8d9d0",false),9,0);
        }
    }

    /**
     * Borra y vuelve a crear los menus para cambiar secciones con variable
     * @param {number} menuShow Indica el menu que está activo cuando se llama a la función para que se mantenga en ese menu
     * @param {number} habIndex Indica la habilidad en la que te encuentras en caso de que hubiera más de una habilidad por equipamiento
     */
    updateMenus(menuShow=0,habIndex=0){
        this.menuDesc.destroy();
        this.menuPlayer.destroy();
        this.menuStats.destroy();
        
        

        this.menuDesc=new Menu(this.scene,this.w*(2.1/3),50,this.w*(0.85/3),this.h*(0.8/3),4,1,0x222222);
        if(this.k!=null){
            this.menuDesc.add(new Phaser.GameObjects.Text(this.scene,0,0,this.desc,{wordWrap:{width:this.w*(0.85/3)}}));
            if(this.scene.jsonEquipamiento[this.k]){
                if(habIndex==0){
                    if(this.playerData.equipamiento.includes(this.k)){
                        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Equipar",null,()=>this.equipar(),15,0,"#c8d9d0",false),2);
                    }
                    else if(this.playerData.arma==this.k||this.playerData.torso==this.k||this.playerData.pantalones==this.k){
                        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Desequipar",null,()=>this.desequipar(),15,0,"#c8d9d0",false),2);  
                    }
                }
                
                if(this.scene.jsonEquipamiento[this.k].habilidades){
                    if(habIndex==0){
                        this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Habilidades",null,()=>this.habDesc(habIndex),15,0,"#c8d9d0",false),3);
                    }
                    else{
                        if(this.scene.jsonEquipamiento[this.k].habilidades[habIndex]){
                            this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Siguiente",null,()=>this.habDesc(habIndex),15,0,"#c8d9d0",false),3);
                        }
                        else{
                            this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Volver",null,()=>this.OnButtonClicked(this.k),15,0,"#c8d9d0",false),3);
                        }
                    }
                    
                }
            }
            else if(this.scene.jsonItems[this.k]){
                this.menuDesc.AddButton(new MenuButton(this.scene,0,0,"Usar",null,()=>this.usar(),15,0,"#c8d9d0",false),3);
            }
        }
         
        this.menuPlayer=new Menu(this.scene,this.w*(2.1/3),50+this.h*(0.86/3),this.w*(0.85/3),this.h*(0.6/3),12,1,0x222222);
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,0,"Arma equipada: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.6/3)*(2/6),"Torso equipado: "));
        this.menuPlayer.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.6/3)*(4/6),"Piernas equipadas: "));
        

        this.menuStats=new Menu(this.scene,this.w*(2.1/3),60+this.h*(0.86/3)+this.h*(0.6/3),this.w*(0.85/3),this.h*(0.89/3),12,1,0x222222);
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,0,"Defensa: "+this.def));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(1/12),"Daño crítico: "+this.critDMG));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(2/12),"Prob. crítica: "+this.critRate));
        this.menuStats.add(new Phaser.GameObjects.Image(this.scene,20,this.h*(0.89/3)*(6/12),'player'));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(8/12),"Dinero: "+this.dinero));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(9/12),"HP: "));
        this.menuStats.add(new HealthBar(this.scene,100,this.h*(0.89/3)*(9/12),150,15,this.HP));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(10/12),"SP: "));
        this.menuStats.add(new HealthBar(this.scene,100,this.h*(0.89/3)*(10/12),150,15,this.SP,2,0x0000ff));
        this.menuStats.add(new Phaser.GameObjects.Text(this.scene,0,this.h*(0.89/3)*(11/12),"Hambre: "+this.hambre));

        //Para el menuDesc
        this.scene.add.rectangle(this.w*(2.525/3),50,this.w*(0.85/3),2,0xcf303f,1);
        this.scene.add.rectangle(this.w*(2.525/3),50+this.h*(0.8/3),this.w*(0.85/3),2,0xcf303f,1);
        this.scene.add.rectangle(this.w*(2.1/3),50+this.h*(0.4/3),2,this.h*(0.81/3),0xcf303f,1);
        this.scene.add.rectangle(this.w*(2.95/3),50+this.h*(0.4/3),2,this.h*(0.81/3),0xcf303f,1);
        
        this.addPlayer();


        

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
    

    /**
     * Se llama cuando se hace click a un boton relacionado a un json
     * @param {string} key la llave del json
     */
    OnButtonClicked(key){
        /**
         * parámetro para saber el elemento que tenemos seleccionado
         */
        this.k;
        
        if(this.scene.jsonEquipamiento[key]){
            this.k=key;
            this.desc=this.scene.jsonEquipamiento[key].name+"\n-"+this.scene.jsonEquipamiento[key].description;
            if(this.scene.jsonEquipamiento[key].crit_chance){
                this.desc+="\n-Prob. crit: "+this.scene.jsonEquipamiento[key].crit_chance;
            }
            if(this.scene.jsonEquipamiento[key].crit_damage){
                this.desc+="\n-Daño crit: "+this.scene.jsonEquipamiento[key].crit_damage;
            }
            if(this.scene.jsonEquipamiento[key].defense){
                this.desc+="\n-Defensa: "+this.scene.jsonEquipamiento[key].defense;
            }
            if(this.playerData.equipamiento.includes(key)){
                this.updateMenus(1);
            }
            else{
                this.updateMenus(0);
            }
            
        }
        else if(this.scene.jsonItems[key]){
            
            this.k=key;
            const entry = this.playerData.items.find(obj => obj.item === key);
            this.desc=this.scene.jsonItems[key].name+"\n-"+this.scene.jsonItems[key].description+"\n-Cantidad: "+entry.count;
            this.updateMenus(2);
        }
        else if(this.scene.jsonHabilidades[key]){
            this.k=key;
            const item=this.scene.jsonHabilidades[key];
            this.desc=item.name+"\n-"+item.description;
            this.updateMenus(3);
        }
        
        
        
    }
    /**
     * Equipa lo que tengas seleccionado
     */
    equipar(){
        
        if(this.playerData.equipamiento.includes(this.k)){
            let tag=this.scene.jsonEquipamiento[this.k];
            if(tag.type=='WEAPON'){
                if(this.playerData.arma!=null){
                    this.playerData.equipamiento.push(this.playerData.arma);
                }
                this.playerData.arma=this.k;
                this.playerData.equipamiento.splice(this.playerData.equipamiento.indexOf(this.k),1);
            }
            else if(tag.type=='TORSO'){
                if(this.playerData.torso!=null){
                    this.playerData.equipamiento.push(this.playerData.torso);
                }
                this.playerData.torso=this.k;
                this.playerData.equipamiento.splice(this.playerData.equipamiento.indexOf(this.k),1);
            }
            else if(tag.type=='LEGGINS'){
                if(this.playerData.pantalones!=null){
                    this.playerData.equipamiento.push(this.playerData.pantalones);
                }
                this.playerData.pantalones=this.k;
                this.playerData.equipamiento.splice(this.playerData.equipamiento.indexOf(this.k),1);
            }
            this.updateValues();
            this.updateMenus(1);
        }
    }

    /**
     * Desequipa lo que tengas seleccionado
     */
    desequipar(){
        
        let tag=this.scene.jsonEquipamiento[this.k];
        if(tag.type=='WEAPON'&&this.playerData.arma==this.k){          
            this.playerData.equipamiento.push(this.playerData.arma);           
            this.playerData.arma=null;
        }
        else if(tag.type=='TORSO'&&this.playerData.torso==this.k){
            
            this.playerData.equipamiento.push(this.playerData.torso);          
            this.playerData.torso=null;
        }
        else if(tag.type=='LEGGINS'&&this.playerData.pantalones){           
            this.playerData.equipamiento.push(this.playerData.pantalones);           
            this.playerData.pantalones=null;
        }
        this.updateValues();
        this.updateMenus(1);
        
    }

    /**
     * Usa el item que tengas seleccionado
     */
    usar(){
        const item=this.scene.jsonItems[this.k];
        if(item.usedOutOfCombat){
            //codigo para usar item

            const entry = this.playerData.items.find(obj => obj.item === this.k);

            entry.count--;
            if(entry.count<=0){
                this.playerData.items.splice(this.playerData.items.indexOf(entry),1);
                this.desc="";
            }
            else{
                this.desc=this.scene.jsonItems[this.k].name+"\n-"+this.scene.jsonItems[this.k].description+"\n-Cantidad: "+entry.count;
            }
            this.updateValues();
            this.updateMenus(2);
        }
    }

    /**
     * Muestra en la ventana de descripción la descripción de la habilidad correspondiente
     * @param {*} index En el caso de que hubiera más de una habilidad por equipamiento, esto enseñaría en la que te encuentras para poner botón del siguiente
     */
    habDesc(index){
        const item=this.scene.jsonEquipamiento[this.k].habilidades[index];
        this.desc=item.name+"\n-"+item.description+"\n-Daño: "+item.damage;
        this.updateMenus(0,index+1);
    }

}