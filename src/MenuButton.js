
export default class MenuButton extends Phaser.GameObjects.Text
{
    constructor(scene, x, y, SkillKey) {

        this.add.text(400, 300, 'Play Game', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 260,
            backgroundColor: '#2d2d2d'
        }).setPadding(32).setOrigin(0.5);

    
        //establece interaccion
        boton.setInteractive();
        boton.on('pointerdown', () => {
            console.log(this.enemies);
        })
    }

}