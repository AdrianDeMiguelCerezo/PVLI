import DialogText from "../dialog_plugin.js";
import PlayerData from "../PlayerData.js";
import MenuButton from "../MenuButton.js";
import SubStateNode from "../SubStateNode.js"
import MapNode from "../MapNode.js";

const NodeType = {
    COMMON: 0,
    TOWN: 1,
    CITY: 2
}
const State = {
    OPEN: 0,
    LOCKED: 1,
    CURRENT: 2
}
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


        this.fragmentoEvento = !!fragmentoEvento ? fragmentoEvento : {
            tipo: "dialogue",
            texto: "ERROR: no hay un diálogo asociado a esta escena",
            opciones: [{
                texto: "CONTINUAR",
                salto: null
            }]
        };

        //si le paso un playerdata, coge ese.
        if (playerData) {
            this.playerData = playerData
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
        console.log(this.fragmentoEvento);
        //mira el fragmento de evento
        this.checkEvent(this.fragmentoEvento);
    }

    /**
     * //pone el texto, crea las opciones y aplica las consecuencias
     * @param {SubStateNode} evento
     */
    checkEvent(evento) {

        if (!this.rewardsGiven) {
            this.rewardsGiven = true;
            this.handleConsecuencias(evento.consecuencias);
        }
        console.log(evento);
        this.dialog.setText(evento.texto, true);
        this.createOptions(evento.opciones);

    }

    /**
     * Modifica el PlayerData con el contenido de la accion del fragmento actual (si hay)
     * y devuelve un texto que dice que ha cambiado
     * @param {{}} consecuencias 
     */
    handleConsecuencias(consecuencias) {

        /**
         * @type {{x: number ,y: number ,event: SubStateNode,nodeType: NodeType ,state: State,isFocus:boolean,isAwake:boolean,visited: boolean,scale:idk,difficulty: number, radius: number}[]}
         */
        let mapNodes = this.registry.get("nodes");
        let currentNode;

        if (mapNodes === undefined) { mapNodes = []; console.log("POSIBLE ERROR: no hay nada en el registry de \"nodes\"") }

        if (mapNodes.length != 0) {
            let i = 0;
            while (currentNode === undefined && i < mapNodes.length) {
                if (mapNodes[i].state === State.CURRENT) { currentNode = mapNodes[i]; }
                i++;
            }
            if (currentNode === undefined) { throw "ERROR: No hay un nodo current" }
        }


        const objEntries = Object.entries(consecuencias);

        //si es un pago
        if (consecuencias.hasOwnProperty("pago") && consecuencias["pago"] > this.playerData.dinero) {
            this.restart(this.fragmentoEvento.nodoNoPay, this.playerData);
        }
        else {
            for (let k = 0; k < objEntries.length; k++) {
                const key = objEntries[k][0];
                const value = objEntries[k][1];
                switch (key) {

                    case "dinero": {
                        this.playerData.dinero += value;
                        break;
                    }
                    case "pago": {
                        break;
                    }
                    case "HP": {
                        console.log("HP" + value);
                        this.playerData.HP += value;
                        break;
                    }

                    case "SP": {
                        this.playerData.SP += value;
                        break;
                    }

                    case "hambre": {
                        this.playerData.hambre += value;
                        break;
                    }

                    case "habilidades": {
                        for (let i = 0; i < value.length; i++) {
                            let j = 0;
                            while (j < this.playerData.habilidades.length && this.playerData.habilidades[i] != value[i]) {
                                j++;
                            }
                            if (j == this.playerData.habilidades.length) {
                                this.playerData.habilidades.push(value[i]);
                            }
                        }
                        break;
                    }
                    case "equipamiento": {
                        for (let i = 0; i < value.length; i++) {
                            let j = 0;
                            while (j < this.playerData.equipamiento.length && this.playerData.equipamiento[i] != value[i]) {
                                j++;
                            }
                            if (j == this.playerData.equipamiento.length) {
                                this.playerData.equipamiento.push(value[i]);
                            }
                        }
                        break;
                    }

                    case "items": {
                        for (let i = 0; i < value.length; i++) {
                            let j = 0;
                            while (j < this.playerData.items.length && this.playerData.items[i].item != value[i].item) {
                                j++;
                            }
                            if (j == this.playerData.items.length) {
                                this.playerData.items.push(value[i]);
                            }
                            else {
                                this.playerData.items[j].count += value[i].count;
                            }
                        }
                        break;
                    }

                    case "efectos": {
                        for (let i = 0; i < value.length; i++) {
                            let j = 0;
                            while (j < this.playerData.efectos.length && this.playerData.efectos[i].effect != value[i].effect) {
                                j++;
                            }
                            if (j == this.playerData.efectos.length) {
                                this.playerData.efectos.push(value[i]);
                            }
                            else {
                                this.playerData.efectos[j].effectDuration += value[i].effectDuration;
                            }
                        }
                        break;
                    }

                    case "dificultadGlobal": {
                        for (let i = 0; i < mapNodes.length; i++) {
                            if (mapNodes[i].isFocus && mapNodes[i].isAwake) { mapNodes[i].difficulty += value; }
                        }
                        break;
                    }

                    case "dificultadCercano": {

                        let smallestDistance = 100000000;
                        let closestIndex = -1;
                        for (let i = 0; i < mapNodes.length; i++) {
                            const d = Math.hypot(mapNodes[i].x - currentNode.x, mapNodes[i].y - currentNode.y);
                            if (mapNodes[i].isFocus && mapNodes[i].isAwake && d < smallestDistance) { smallestDistance = d; closestIndex = i; }
                        }
                        if (closestIndex = -1) {
                            for (let i = 0; i < mapNodes.length; i++) {
                                const d = Math.hypot(mapNodes[i].x - currentNode.x, mapNodes[i].y - currentNode.y);
                                if (mapNodes[i].isFocus && d < smallestDistance) { smallestDistance = d; closestIndex = i; }
                            }
                            if (closestIndex != -1) { mapNodes[closestIndex].isAwake = true; mapNodes[closestIndex].difficulty = value; }
                        }
                        else {
                            mapNodes[closestIndex].difficulty = + value;
                        }
                        break;
                    }
                    case "dificultadRadio": {
                        for (let i = 0; i < mapNodes.length; i++) {
                            const d = Math.hypot(mapNodes[i].x - currentNode.x, mapNodes[i].y - currentNode.y);
                            if (mapNodes[i].isFocus && mapNodes[i].isAwake && d < value.r) { mapNodes[i].difficulty += value.diff }
                        }
                        break;
                    }

                    case "despertarGlobal": {
                        for (let i = 0; i < mapNodes.length; i++) {
                            if (mapNodes[i].isFocus && !mapNodes[i].isAwake) { mapNodes[i].isAwake = true; mapNodes[i].difficulty += value.diff }
                        }
                        break;
                    }
                    case "despertarCercano":
                        {
                            let smallestDistance = 100000000;
                            let closestIndex = -1;

                            for (let i = 0; i < mapNodes.length; i++) {
                                const d = Math.hypot(mapNodes[i].x - currentNode.x, mapNodes[i].y - currentNode.y);
                                if (mapNodes[i].isFocus && !mapNodes[i].isAwake && d < smallestDistance) { smallestDistance = d; closestIndex = i; }
                            }
                            if (smallestDistance<=value.r && closestIndex!=-1) { mapNodes[closestIndex].isAwake = true; mapNodes[closestIndex].difficulty += value.diff; }

                            break;
                        }
                    case "despertarCercanoCrear": {
                        let smallestDistance = 100000000;
                        let closestIndex = -1;

                        for (let i = 0; i < mapNodes.length; i++) {
                            const d = Math.hypot(mapNodes[i].x - currentNode.x, mapNodes[i].y - currentNode.y);
                            if (mapNodes[i].isFocus && !mapNodes[i].isAwake && d < smallestDistance) { smallestDistance = d; closestIndex = i; }
                        }
                        if (smallestDistance <= value.r && closestIndex != -1) { mapNodes[closestIndex].isAwake = true; mapNodes[closestIndex].difficulty += value.diff; }
                        else {
                            currentNode.isFocus = true; currentNode.isAwake = true; currentNode.difficulty += value.diff;
                        }
                        break; }

                    case "despertarRadio": {
                        for (let i = 0; i < mapNodes.length; i++) {
                            const d = Math.hypot(mapNodes[i].x - currentNode.x, mapNodes[i].y - currentNode.y);
                            if (mapNodes[i].isFocus && !mapNodes[i].isAwake && d < value.r) { mapNodes[i].isAwake = true; mapNodes[i].difficulty += value.diff }
                        }
                        break;
}
                }


            }
            console.log(this.playerData);
            this.registry.set("nodes", mapNodes);
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
            const btn = this.add.text(400, baseY + offsetY, opt.texto, { fontFamily: 'Arial', fontSize: '24px', color: '#fff', backgroundColor: '#828181', padding: { x: 5 } });
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

                if (opt.salto === null) {
                    this.scene.start('Map');
                }
                else if (opt.salto.tipo == "dialogue") {
                    this.scene.start(this.scene.key, opt.salto, this.playerData)
                }
                //si el tipo es combate comienza combate con los atributos
                else if (opt.salto.tipo == "combat") {
                    this.scene.start('BattleScene', opt.salto, this.playerData);
                }
                else if (opt.salto.tipo == "fin") {
                    this.scene.start('WinScene');
                }

            });
            //añade boton al grupo de botones de opciones
            this.optionsButtons.push(btn);
            //incrementa el offset
            offsetY += 40;
        });

    }

}
