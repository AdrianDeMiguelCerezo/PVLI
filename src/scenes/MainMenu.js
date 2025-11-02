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
            this.scene.start('BootScene');
        });
    }
}