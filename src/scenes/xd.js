


export default class xd extends Phaser.Scene {

    constructor() {
        super({ key: 'xd' })
    }

    preload() {
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/gradient11.png');
    }

    create() {

        let rt;
        let graphics;
        this.add.image(400, 300, 'sky');

        graphics = new Phaser.GameObjects.Graphics(this);
        graphics.lineStyle(4, 0x00ff00);
        graphics.fillStyle(0x00ff00); // how to fill it??

        rt = this.add.renderTexture(100, 100, 100, 100).setOrigin(0.5);

        var circle = this.add
            .circle(0, 0, 50, 0xff7e00)
            .setAlpha(0.8)
            .setVisible(false);

        rt.draw(circle, 50, 50);

        const path = new Phaser.Curves.Path();
        path.lineTo(50, 0);
        path.lineTo(50, 50);
        path.add(new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(50, 50), new Phaser.Math.Vector2(100, 50), new Phaser.Math.Vector2(100, 100)));
        path.closePath();
        graphics.fillPoints(path.getPoints())
        this.add.existing(graphics);
        
    }

}