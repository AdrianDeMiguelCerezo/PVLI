

export default class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BootScene' })
    }

    preload() {
        this.load.image('node', 'assets/Node.png')
        this.load.image('map', 'assets/MapTemplate.png')
        this.load.image('malo', 'assets/malo.png')
        this.load.image('player', 'player.png')
    }
    create() {

        this.uiButton(100, 400, "Go to Map", 'Map')
        this.uiButton(100, 200, "Go to BattleScene", 'BattleScene')
    }
    uiButton(x, y, message,sceneKey) {
        //crea el texto del boton con la posicion y el texto
        let botonFondo = this.add.rectangle(x, y, 100, 25, 0x15C6CC).setOrigin(0, 0);
        let boton = this.add.text(x, y, message);
        boton.setFontSize(25);
        botonFondo.width = boton.width;
        //establece interaccion
        boton.setInteractive();
        boton.on('pointerdown', () => {
            this.scene.start(sceneKey);
        })
    }
};