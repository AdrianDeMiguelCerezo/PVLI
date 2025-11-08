

export default class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BootScene' })
    }

    preload() {
        this.load.image('node', 'assets/Node.png');
        this.load.image('map', 'assets/MapTemplate.png');
        this.load.image('fondo', 'assets/fondoPlaceholderDialogos.png');
        this.load.image('malo', 'assets/malo.png');
        this.load.image('BANDIDO_COMUN', 'assets/bandido.png');
        this.load.image('player', 'assets/player.png');

        //carga img intents
        this.load.image('espada','assets/Espada.png');
        this.load.image('dobleEspada','assets/DobleEspada.png');
        this.load.image('bufo','assets/Bufo.png');
        this.load.image('debufo','assets/Debufo.png');
        this.load.image('neutro', 'assets/Neutro.png');

        //carga img statusEffects
        this.load.image('QUEMADO', 'assets/QUEMADO.png');





        //Carga .json
        this.load.json('habilidades', 'src/json/habilidades.json');
        this.load.json('enemigos', 'src/json/enemigos.json'); 
        this.load.json('equipamiento', 'src/json/equipamiento.json'); 
        this.load.json('efectos', 'src/json/efectos.json'); 
        this.load.json('items', 'src/json/items.json'); 
        this.load.json('dialogos', 'src/json/dialogos.json');
    }
    create() {

        
        this.uiButton(100, 400, "Go to Map", 'Map')
        this.uiButton(100, 300, "Go to DialogueScene", 'DialogueScene')
        this.uiButton(100, 200, "Go to BattleScene", 'BattleScene', ['BANDIDO_COMUN', 'BANDIDO_COMUN', 'BANDIDO_COMUN', 'BANDIDO_COMUN',])
    }
    /**
     * 
     * @param {number} x
     * @param {number} y
     * @param {string} message
     * @param {string} sceneKey
     * @param {any} paramsInit
     */
    uiButton(x, y, message,sceneKey,paramsInit) {
        //crea el texto del boton con la posicion y el texto
        let botonFondo = this.add.rectangle(x, y, 100, 25, 0x15C6CC).setOrigin(0, 0);
        let boton = this.add.text(x, y, message);
        boton.setFontSize(25);
        botonFondo.width = boton.width;
        //establece interaccion
        boton.setInteractive();
        boton.on('pointerdown', () => {
            this.scene.start(sceneKey,paramsInit);
        })
    }
};