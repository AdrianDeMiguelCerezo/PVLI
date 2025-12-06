import DialogText from "../dialog_plugin.js";
import PlayerData from "../PlayerData.js";
import MenuButton from "../MenuButton.js";
import SubStateNode from "../SubStateNode.js"

export default class DialogueScene extends Phaser.Scene {
    /**
     * Escena de texto cargado con archivos TTF locales.
     * @extends Phaser.Scene
     * 
     * 
     */
    constructor() {

        super({ key: 'DialogueScene' });
        this.rewardsGiven = false;
    }

    /**
     * 
     * @param {SubStateNode} fragmentoEvento
     * @param {string} eventName
     * @param {any} nodeType
     * @param {any} difficultyLevel
     * @param {PlayerData} playerData
     * 
     */
    init(fragmentoEvento, playerData) {


        this.fragmentoEvento = fragmentoEvento;

        //si le paso un playerdata, coge ese.
        if (playerData) {
            this.playerData = playerData;
        }
        else {
            //si no, se lo paso y no lo tiene de antes, lo crea.
            if (!this.playerData) {
                console.log("NO EXISTE PLAYERDDATA O NO ME LO HAN PASADO")
                this.playerData = new PlayerData()
            }
        }
    }
    create() {
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);
        //Boton de desplegar opciones
        this.desplegableButton = new MenuButton(this, 750, 50, "Opciones", null, () => {
            this.mainMenuButton.visible = !this.mainMenuButton.visible;
            this.inventoryButton.visible = !this.inventoryButton.visible;
        }, 15, 0, "#c8d9d0", false).setOrigin(1);
        //boton de ir al inventario
        this.inventoryButton = new MenuButton(this, this.desplegableButton.x, this.desplegableButton.y + 30, "Ir al inventario", null,
            () => { this.scene.start('MenuTest', { playerData: this.playerData, oldScene: this.scene.key }) }, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1);
        //boton de ir al menu principal
        this.mainMenuButton = new MenuButton(this, this.desplegableButton.x, this.inventoryButton.y + 30, "Volver al menu principal", null,
            () => { this.scene.start('MainMenu') }, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1);


        //Se carga el evento del json
        /**
         * evento generado por hardcode para testear los fragmentos, quitar cuando haya una forma de leerlos
         * @type {SubStateNode}
         */
        this.currentEvento = {
            tipo: "dialogue",
            texto: "ERROR: no hay un diálogo asociado a esta escena",
            opciones: [{
                texto: "CONTINUAR",
                salto: null
            }]
        };

        //si al iniciar la escena ya hay un fragmento cargado, reescribe con ese evento (por testear para cuando se vuelva de la escena de combate)
        if (this.fragmentoEvento != undefined) {
            this.currentEvento = this.fragmentoEvento;
            console.log(this.fragmentoEvento);
        }

        this.dialog = new DialogText(this, {
            borderThickness: 4,
            borderColor: 0x555555,
            borderAlpha: 1,
            windowAlpha: 0.6,
            windowColor: 0x828181,
            windowHeight: 150,
            padding: 32,
            closeBtnColor: 'darkgoldenrod',
            dialogSpeed: 4.2,
            fontSize: 24,
            fontFamily: "Arial",
            posY: 175
        });

        //mira el fragmento de evento
        this.checkEvent(this.currentEvento);
    }

    /**
     * //pone el texto, crea las opciones y aplica las consecuencias
     * @param {SubStateNode} evento
     */
    checkEvent(evento) {
        

        this.handleConsecuencias(evento.consecuencias);
        this.dialog.setText(evento.texto, true);
        this.createOptions(evento.opciones);

    }

    /**
     * Modifica el PlayerData con el contenido de la accion del fragmento actual (si hay)
     * y devuelve un texto que dice que ha cambiado
     * 
     */
    handleConsecuencias(consecuencias) {
        this.rewardsGiven = true;
        let mapNodes = this.registry.get("nodes");
        
        for (const [key, value] in Object.entries(consecuencias)) {


            switch (key) {


                case "dificultadGlobal": {
                    for (let i = 0; i < mapNodes.length;i++) {
                        if (mapNodes[i].isFocus && mapNodes[i].isAwake) { mapNodes[i].difficulty += value; }
                    }
                    break;
                }

                case "dificultadCercano": {

                    let smallestDistance = 100000000;
                    let closestIndex = -1;
                    for (let i = 0; i < mapNodes.length; i++) {
                        const d = Math.hypot(x - n.x, y - n.y);
                        if (mapNodes[i].isFocus && d<smallestDistance) { mapNodes[i].difficulty += value; }
                    }
                    break;
                }
                case "dificultadRadio": { returnString += "el estado conoce la zona aproximada en la que te encuentras, "; break; }
                case "despertarGlobal": { returnString += "el estado está llevando a cabo una persecución a gran escala, "; break; }
                case "despertarCercano": { returnString += "los esfuerzos de búsqueda se están focalizando en un cuartel cercano, "; break; }
                case "despertarCercanoCrear": { returnString += "el estado ha establecido un cuartel en una ubicación cercana, "; break; }

                case "despertarRadio": { returnString += "el estado conoce la zona aproximada en la que te encuentras, "; break; }
            }
        
        }
    }

    /**
     * Pone botones de opciones por cada opcion en el fragmento
     * 
     */
    createOptions(opciones) {

        //posicion original y offset para cada nuevo boton
        const baseY = 425;
        let offsetY = 0;

        //grupo de botones de opciones
        this.optionsButtons = [];

        opciones.forEach(opt => {
            //añade el texto
            const btn = this.add.text(400, baseY + offsetY, opt.texto, { fontFamily: 'Arial', fontSize: '24px', color: '#fff', backgroundColor: '#828181' });
            btn.setOrigin(0.5);
            //interaccion con botones
            btn.setInteractive();
            btn.on('pointerover', function () {
                this.setTint(0xff0000);
            });
            btn.on('pointerout', function () {
                this.clearTint();
            });
            btn.on('pointerdown', () => {

                this.rewardsGiven = false;

                if (evento === null) {
                    this.scene.start('Map');
                }
                if (evento.tipo == "dialogue") {
                    this.scene.start(this.scene.key, opt.salto, this.playerData)
                }
                //si el tipo es combate comienza combate con los atributos
                else if (evento.tipo == "combat") {
                    this.scene.start('BattleScene', opt.salto, this.playerData);
                }

            });
            //añade boton al grupo de botones de opciones
            this.optionsButtons.push(btn);
            //incrementa el offset
            offsetY += 40;
        });

    }

}
