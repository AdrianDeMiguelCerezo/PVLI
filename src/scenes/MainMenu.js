import PlayerData from "../PlayerData.js";
export default class MainMenu extends Phaser.Scene{
    constructor(){
        super({key:'MainMenu'});
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
                color: '#0066ff',
                backgroundColor: '#00000055',
                padding: { x: 20, y: 10 },
                align: 'center'
            })
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

            button.on('pointerover', () => button.setStyle({ color: '#ffff00', backgroundColor: '#00000099' }));
            button.on('pointerout', () => button.setStyle({ color: '#00ff99', backgroundColor: '#00000055' }));
            button.on('pointerdown', onClick);

            return button;
        };

        /*makeButton(height / 2, 'Play', () => {
            this.scene.start('Map',new PlayerData());
        });*/

        this.playerData=new PlayerData();
        this.uiButton(width/2,height/2,'Play','Map',this.playerData);
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
        let botonFondo = this.add.rectangle(x+20, y, 100, 25, 0x15C6CC).setOrigin(0.5);
        let boton = this.add.text(x, y, message).setOrigin(0.5);
        boton.setFontSize(25);
        botonFondo.width = boton.width;
        //establece interaccion
        boton.setInteractive();
        boton.on('pointerdown', () => {
            this.registry.reset();
            this.scene.stop('Map');

            this.scene.start(sceneKey, {
                playerData: new PlayerData()
            });
        })
    }
}