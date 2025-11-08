

export default class ImageWithText extends Phaser.GameObjects.Container {

    constructor(scene, x, y, text, texture, fontSize = -1, size = 1) {

        super(scene, x, y)

        this.setSize(size, size);

        this.image = new Phaser.GameObjects.Image(scene, 0, 0, texture).setOrigin(0, 0)
        this.add(this.image)
        this.scene.add.existing(this.image)

        if (fontSize==-1) fontSize = this.image.height;

        this.scene.add.existing(this.add(new Phaser.GameObjects.Text(scene, 0, 0, text,
            {
                fontFamily: 'Arial',
                fontSize: fontSize,
                align: 'center',
            }
        )))

        

        
    }










}