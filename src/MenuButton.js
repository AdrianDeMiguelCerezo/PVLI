
export default class MenuButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, skillKey, pointerDownAction) {
        if (!!pointerDownAction) {
            super(scene, x, y, skillKey,
                {
                fontFamily: 'Arial',
                fontSize: '25px',
                color: '#ffffff',
                align: 'center',
                fixedWidth: 0,
                backgroundColor: '#2d2d2d'
                }
            )

            scene.add.existing(this);


            //establece interaccion
            this.setInteractive();
            this.on('pointerdown', () => {
                pointerDownAction();
            })
        }
        else {
            super(scene, x, y, scene.habilidades[skillKey].nombre,
                {
                fontFamily: 'Arial',
                fontSize: '25px',
                color: '#ffffff',
                align: 'center',
                fixedWidth: 0,
                backgroundColor: '#2d2d2d'
                }
            )

            scene.add.existing(this);

            //establece interaccion
            this.setInteractive();
            this.on('pointerdown', () => {
                console.log(scene.habilidades[skillKey].descripcion)
            })
        }
    }


}