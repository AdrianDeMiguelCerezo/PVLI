

export default class MenuButton extends Phaser.GameObjects.Text {
    
    
    constructor(scene, x, y, skillKey, pointerDownAction) {
        super(scene, x, y, " ",
            {
                fontFamily: 'Arial',
                fontSize: '25px',
                color: '#000000',
                align: 'center',
                fixedWidth: 0,
                backgroundColor: '#707070',
                padding: {
                    x: 5
                }
            },
        )
        if (!!pointerDownAction)//undefined == false
        {
            this.text = skillKey;
            scene.add.existing(this);

            //establece interaccion
            this.setInteractive();
            this.on('pointerdown',
                () =>
                {
                if (this.canBeClicked) pointerDownAction();
                }
            )
            
        }
        else {
            this.text = scene.habilidades[skillKey].nombre;
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
        this.scene.events.on('use_skill', () => { this.canBeClicked = false; this.scene.HideTextbox() });
        this.scene.events.on('select_skill', ()=> { this.canBeClicked = true });
        this.scene.events.on('select_target', ()=> { this.canBeClicked = false });
        this.scene.events.on('target_selected', ()=> { this.canBeClicked = true});

    }

    
}