

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
                if (this.canBeClicked) pointerDownAction();
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
                },
            )
            
            scene.add.existing(this);

            //establece interaccion
            this.setInteractive();

            this.on('pointerdown', () => {
                if (this.canBeClicked) this.scene.events.emit("use_skill", skillKey);
            })
            this.on('pointerover', (pointer) => {
                if (this.canBeClicked) this.scene.ShowTextbox(pointer.x,pointer.y,this.scene.habilidades[skillKey].descripcion);
            })
            this.on('pointerout', () => {
                if (this.canBeClicked) this.scene.HideTextbox();
            })
        }
        this.canBeClicked = true;
        this.scene.events.on('use_skill', function () { this.canBeClicked = false });
        this.scene.events.on('select_skill', function () { this.canBeClicked = true });

    }

    
}