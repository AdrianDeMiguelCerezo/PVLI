

export default class MenuButton extends Phaser.GameObjects.Text {

    /**
     * 
     * @param {any} scene
     * @param {any} x
     * @param {any} y
     * @param {any} fontSize
     * @param {any} backgroundColor
     * @param {any} skillKey
     * @param {any} pointerDownAction
     */
    constructor(scene, x, y, skillKey, pointerDownAction, fontSize = 21, fixedWidth = 0, backgroundColor = '#707070') {
        console.log(arguments)
        super(scene, x, y, " ",
            {
                fontFamily: 'Arial',
                fontSize: fontSize,
                color: '#000000',
                align: 'center',
                fixedWidth: fixedWidth,
                backgroundColor: backgroundColor,
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
                () => {
                    if (this.canBeClicked) {
                        pointerDownAction();
                        this.preFX.clear();
                    }
                }
            )
            this.on('pointerover', () => {
                if (this.canBeClicked) {
                    this.preFX.addGlow('0xfaf255', 1, 1, false, 1, 1)
                }
            })
            this.on('pointerout', () =>
            {
                this.preFX.clear()
            })
            
        }
        else {
            this.text = scene.jsonHabilidades[skillKey].nombre;
            scene.add.existing(this);

            //establece interaccion
            this.setInteractive();

            this.on('pointerdown', () => {
                if (this.canBeClicked) {
                    this.scene.events.emit("use_skill", skillKey);
                    this.preFX.clear();
                }
            })
            this.on('pointerover', () => {
                if (this.canBeClicked) {
                    this.scene.ShowTextbox(this.scene.jsonHabilidades[skillKey].descripcion);
                    this.preFX.addGlow('0xfaf255', 1, 1, false, 1, 1)
                }
            })
            this.on('pointerout', () => {
                if (this.canBeClicked) this.scene.HideTextbox();
                this.preFX.clear()
            })
        }
        this.canBeClicked = true;
        this.scene.events.on('use_skill', () => { this.canBeClicked = false; this.scene.HideTextbox() });
        this.scene.events.on('select_skill', () => { this.canBeClicked = true });
        this.scene.events.on('select_target', () => { this.canBeClicked = false });
        this.scene.events.on('target_selected', () => { this.canBeClicked = true });

    }

    

}