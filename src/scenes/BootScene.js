import PlayerData from '../PlayerData.js'

export default class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BootScene' })
    }

    preload() {
        this.load.image('node', 'assets/Node.png');
        this.load.image('map', 'assets/MapTemplate.png');
        this.load.image('fondo', 'assets/fondoPlaceholderDialogos.png');
        this.load.image('malo', 'assets/malo.png');
        this.load.image('player', 'assets/cowboy.png');
        this.load.image('cowboy','assets/cowboy.png');
        this.load.image('swimsuit','assets/swimsuit.png');
        this.load.image('halloween','assets/halloween.png');
        this.load.image('christmas','assets/christmas.png');
        this.load.image('butler','assets/butler.png');
        this.load.image('school','assets/school.png');
        this.load.image('cat','assets/cat.png');

        //carga img intents
        this.load.image('espada','assets/Espada.png');
        this.load.image('dobleEspada','assets/DobleEspada.png');
        this.load.image('bufo','assets/Bufo.png');
        this.load.image('debufo','assets/Debufo.png');
        this.load.image('neutro', 'assets/Neutro.png');

        //carga img statusEffects
        this.load.image('QUEMADO', 'assets/QUEMADO.png');
        this.load.image('ENVENENADO', 'assets/ENVENENADO.png');
        this.load.image('PARALIZADO', 'assets/PARALIZADO.png');
        this.load.image('ATT+', 'assets/ATT+.png');
        this.load.image('ATT++', 'assets/ATT++.png');
        this.load.image('ATT-', 'assets/ATT-.png');
        this.load.image('ATT--', 'assets/ATT--.png');
        this.load.image('DEF+', 'assets/DEF+.png');
        this.load.image('DEF++', 'assets/DEF++.png');
        this.load.image('DEF-', 'assets/DEF-.png');
        this.load.image('DEF--', 'assets/DEF--.png');
        this.load.image('HAMBRE_1', 'assets/HAMBRE_1.png');
        this.load.image('HAMBRE_2', 'assets/HAMBRE_2.png');

        //Enemigos
        this.load.image('BANDIDO_COMUN','assets/bandido_comun.png');
        this.load.image('BANDIDO_PIROMANO','assets/piromano.png');
        this.load.image('BANDIDO_MEDICO','assets/medico.png');
        this.load.image('BANDIDO_TANQUE','assets/tanque.png');
        this.load.image('TORRETA','assets/torreta.png');
        this.load.image('PERRO_RABIOSO','assets/perro.png');
        this.load.image('MUJER_DESCONFIADA','assets/mujer.png');
        this.load.image('SOLDADO_ESTADO','assets/soldado_estado.png');
        this.load.image('BANDIDO_BUFEADOR','assets/bufeador.png');
        this.load.image('BANDIDO_NERFEADOR','assets/debufeador.png');
        this.load.image('GRAN_BLOQUEO','assets/gran_bloqueo.png');






        //Carga .json
        this.load.json('habilidades', 'src/json/habilidades.json');
        this.load.json('enemigos', 'src/json/enemigos.json'); 
        this.load.json('equipamiento', 'src/json/equipamiento.json'); 
        this.load.json('efectos', 'src/json/efectos.json'); 
        this.load.json('items', 'src/json/items.json'); 
        this.load.json('dialogos', 'src/json/dialogos.json');
        this.load.json('eventos', 'src/json/eventos.json');
    }
    create() {

        //this.playerData = new PlayerData();
        this.uiButton(100, 400, "Go to Map", 'Map')
        this.uiButton(100, 300, "Go to DialogueScene", 'DialogueScene')
        this.uiButton(100, 200, "Go to BattleScene", 'BattleScene', ['BANDIDO_COMUN', 'BANDIDO_COMUN', 'BANDIDO_COMUN', 'BANDIDO_COMUN',])
        this.uiButton(100, 100, "Go to MenuTest", 'MenuTest', {playerData: new PlayerData(), oldScene: this.scene.key})
        this.uiButton(100, 500, "Go to xd", 'xd',)

        
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
            //this.scene.launch(sceneKey, paramsInit);
            //this.scene.pause();
        })
    }
};