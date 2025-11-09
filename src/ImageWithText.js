

export default class ImageWithText extends Phaser.GameObjects.Container {

    /**
     * 
     * @param {Phaser.Scene} scene
     * @param {any} x
     * @param {any} y
     * @param {any} text
     * @param {any} texture
     * @param {any} centered
     * @param {any} textX
     * @param {any} textY
     * @param {any} borderSize
     * @param {any} fontSize
     * @param {any} size
     */
    constructor(scene, x, y, text, texture, centered = true, borderSize = 0,alpha=1, textX = 0, textY = 0, fontSize = -1, size = 1) {

        super(scene, x, y)

        this.setSize(size, size);

        this.image = new Phaser.GameObjects.Image(scene, 0, 0, texture).setOrigin(0, 0)
        this.add(this.image)


        if (fontSize == -1) fontSize = this.image.height - 2 * borderSize;

        if (centered) {
            var text = new Phaser.GameObjects.Text(scene, borderSize, borderSize, text,
                {
                    fontFamily: 'Arial',
                    fontSize: fontSize,
                    align: 'center',
                    color: '#ffffff',
                    fixedWidth: this.image.width - 2 * borderSize
                }
            )
        }
        else {
            var text =new Phaser.GameObjects.Text(scene, textX, textY, text,
                {
                    fontFamily: 'Arial',
                    fontSize: fontSize,
                    align: 'center',
                    color: '#ffffff',
                    fixedWidth: this.image.width - 2 * borderSize
                }
            )
        }
        text.alpha = alpha;
        this.add(text)
        scene.add.existing(this)
    }
    get width() {
        return this.image.width;
    }
    get height() {
        return this.image.height;
    }
}