import PlayerData from "../PlayerData.js";

export default class MainMenu extends Phaser.Scene{
    constructor(){
        super({key:'MainMenu'});
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
        this.load.image('PIROMANO','assets/piromano.png');
        this.load.image('MEDICO','assets/medico.png');
        this.load.image('TANQUE','assets/tanque.png');
        this.load.image('TORRETA','assets/torreta.png');
        this.load.image('PERRO_RABIOSO','assets/perro.png');
        this.load.image('MUJER_DESCONFIADA','assets/mujer.png');
        this.load.image('SOLDADO_ESTADO','assets/soldado_estado.png');
        this.load.image('BUFEADOR','assets/bufeador.png');
        this.load.image('DEBUFEADOR','assets/debufeador.png');
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

    create(){
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width * 2, height * 2, 0x202040).setOrigin(0);

        this.add.text(width / 2, height / 3 - 50, 'The South Border', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const makeButton = (y, text, onClick) => {
            const button = this.add.text(width / 2, y, text, {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#00ff99',
                backgroundColor: '#00000055',
                padding: { x: 20, y: 10 },
                align: 'center'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            button.on('pointerover', () => button.setStyle({ color: '#ffff00', backgroundColor: '#00000099' }));
            button.on('pointerout', () => button.setStyle({ color: '#00ff99', backgroundColor: '#00000055' }));
            button.on('pointerdown', onClick);

            return button;
        };

        makeButton(height / 2, 'Play', () => {
            this.playerData = new PlayerData();
            this.scene.start('Map', this.playerData);
        });
    }
}