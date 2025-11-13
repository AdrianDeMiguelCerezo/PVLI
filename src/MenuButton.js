import BattleScene from "./scenes/BattleScene.js";
import PlayerData from './PlayerData.js'

export default class MenuButton extends Phaser.GameObjects.Text {


   
    




    /**
     * 
     * @param {BattleScene} scene
     * @param {any} x
     * @param {any} y
     * @param {any} fontSize
     * @param {any} backgroundColor
     * @param {any} key Indica o la key de la habilidad si se guarda en habilidades.json, o la key equipamiento, o es una tupla de {key(del item), count(cantidad del item)}
     * @param {string} skill Indica la skill a utilizar si se trata de una pieza de equipamiento
     * @param {any} pointerDownAction
     */
    constructor(scene, x, y, key,skill, pointerDownAction, fontSize = 21, fixedWidth = 0, backgroundColor = '#707070',isCombat = true) {

        super(scene, x, y, " ",
            {
                fontFamily: 'Arial',
                fontSize: fontSize,
                color: '#000000',
                align: 'center',
                fixedWidth: fixedWidth,
                backgroundColor: backgroundColor,
                
                padding: {
                    x: 5
                }
            },
        )
        
        if (!!pointerDownAction)//undefined == false
        {
            this.text = key;
            scene.add.existing(this);

            //establece interaccion
            this.setInteractive();
            this.on('pointerdown',
                () => {
                    if (this.canBeClicked) {
                        pointerDownAction();
                        this.preFX.clear();
                    }
                }
            )
            this.on('pointerover', () => {
                if (this.canBeClicked) {
                    this.preFX.addGlow('0xfaf255', 1, 1, false, 1, 1)
                }
            })
            this.on('pointerout', () => {
                this.preFX.clear()
            })

        }
        else {
            if (isCombat) {
                //si es equipamiento, las skill de este son individuales
                if (!!skill) {

                    this.text = scene.jsonEquipamiento[key].habilidades[skill].name;
                    scene.add.existing(this);

                    //establece interaccion
                    this.setInteractive();

                    this.on('pointerdown', () => {
                        if (this.canBeClicked) {
                            this.scene.events.emit("use_skill", scene.jsonEquipamiento[key].habilidades[skill]);
                            this.preFX.clear();
                        }
                    })
                    this.on('pointerover', () => {
                        if (this.canBeClicked) {
                            this.scene.ShowTextbox(this.scene.jsonEquipamiento[key].habilidades[skill].description);
                            this.preFX.addGlow('0xfaf255', 1, 1, false, 1, 1)
                        }
                    })
                    this.on('pointerout', () => {
                        if (this.canBeClicked) this.scene.HideTextbox();
                        this.preFX.clear()
                    })
                }
                //si está en el jsonHabilidades, la skill se saca de ahí
                else if (scene.jsonHabilidades.hasOwnProperty(key)) {
                    this.text = scene.jsonHabilidades[key].name;
                    scene.add.existing(this);

                    //establece interaccion
                    this.setInteractive();

                    this.on('pointerdown', () => {
                        if (this.canBeClicked) {
                            this.scene.events.emit("use_skill", scene.jsonHabilidades[key]);
                            this.preFX.clear();
                        }
                    })
                    this.on('pointerover', () => {
                        if (this.canBeClicked) {
                            this.scene.ShowTextbox(this.scene.jsonHabilidades[key].description);
                            this.preFX.addGlow('0xfaf255', 1, 1, false, 1, 1)
                        }
                    })
                    this.on('pointerout', () => {
                        if (this.canBeClicked) this.scene.HideTextbox();
                        this.preFX.clear()
                    })
                }
                //si no es ninguna de las anteriores, la key contiene {string item(del json de items),number cantidad}
                else {

                    this.itemKey = key.item;
                    this.itemCount = key.count;
                    this.text = scene.jsonItems[key.item].name + ": " + key.count;
                    scene.add.existing(this);

                    //establece interaccion
                    this.setInteractive();

                    this.on('pointerdown', () => {
                        if (this.canBeClicked) {
                            this.scene.events.emit("use_skill", scene.jsonItems[key.item].habilidades[0]);
                            this.preFX.clear();
                        }
                    })
                    this.on('pointerover', () => {
                        if (this.canBeClicked) {
                            this.scene.ShowTextbox(this.scene.jsonItems[key.item].description);
                            this.preFX.addGlow('0xfaf255', 1, 1, false, 1, 1)
                        }
                    })
                    this.on('pointerout', () => {
                        if (this.canBeClicked) this.scene.HideTextbox();
                        this.preFX.clear()
                    })
                }
            }
            else {
                if (scene.jsonHabilidades.hasOwnProperty(key)) {
                    if (!!skill) {
                        this.text = scene.jsonEquipamiento[key].habilidades[skill].name
                    } else {
                        this.text = scene.jsonEquipamiento[key].name
                    }
                }
                else if (scene.jsonEquipamiento.hasOwnProperty(key)) { this.text = scene.jsonHabilidades[key].name }
                else if (scene.jsonItems.hasOwnProperty(key)) { this.text = scene.jsonItems[key].name }
                else {throw "esta key no es un item, equipamiento, ni habilidad ubicada en habilidades.js" }
                
                scene.add.existing(this);

                //establece interaccion
                this.setInteractive();

                this.on('pointerdown',
                    () => {
                        
                            scene.events.emit("show_description", key,skill)
                            this.preFX.clear();
                        
                    }
                )
                this.on('pointerover', () => {
                    
                        this.preFX.addGlow('0xfaf255', 1, 1, false, 1, 1)
                    
                })
                this.on('pointerout', () => {
                    this.preFX.clear()
                })
            }
        }

        this.canBeClicked = true;
        this.scene.events.on('use_skill', () => { this.canBeClicked = false; this.scene.HideTextbox() });
        this.scene.events.on('select_skill', () => { this.canBeClicked = true });
        this.scene.events.on('select_target', () => { this.canBeClicked = false });
        this.scene.events.on('target_selected', () => { this.canBeClicked = true });

    }

    Equipar() {
        
        switch (scene.jsonEquipamiento[key].type)
        {
            
            case "WEAPON": { this.scene.playerData.equipamiento[this.scene.playerData.equipamiento.indexOf(key)] = this.scene.playerData.arma ; this.scene.playerData.arma = this.key; }
            case "TORSO": { this.scene.playerData.equipamiento[this.scene.playerData.equipamiento.indexOf(key)] = this.scene.playerData.torso; this.scene.playerData.torso = this.key; }
            case "LEGGINS": { this.scene.playerData.equipamiento[this.scene.playerData.equipamiento.indexOf(key)] = this.scene.playerData.pantalones; this.scene.playerData.pantalones = this.key; }
            default: throw "¿Esto dónde me lo pongo? ¿el la punta de "
        }
        //actualizarMenus
    }
    Desequipar() {
        
        
        switch (scene.jsonEquipamiento[key].type) {

            case "WEAPON": { this.scene.playerData.equipamiento.push(key); this.scene.playerData.arma = null; }
            case "TORSO": { this.scene.playerData.equipamiento.push(key); this.scene.playerData.torso = null; }
            case "LEGGINS": { this.scene.playerData.equipamiento.push(key); this.scene.playerData.pantalones = null; }
            default: throw "¿Donde está, no lo encuentro? ¿y qué es eso, se come?"
        }
        //actualizarMenus
    }
    //UsarItem()
    //{
    //    /**
    //     * @type {PlayerData}
    //     */
    //    let thissceneplayerData;
    //    let i = 0;
    //    let encontrado = false;
    //    while (i < thissceneplayerData.items.length&&!encontrado) {
    //        encontrado = thissceneplayerData.items[i].item==key
    //        i++;
    //    }
    //    if (encontrado) {
    //        i--;
    //        thissceneplayerData.items[i].item.count--;
    //    }
    //    for (let j = 0; j < this.scene.jsonItems[i].habilidades.length; j++)
    //    {
            
    //        thissceneplayerData.HP -= ? this.scene.jsonItems[i].habilidades[j].damage

    //    }
    //}
}