export default class HealthBar extends Phaser.GameObjects.Container {

    constructor(scene, x, y, barWidth, barHeight) {
        super(scene,x, y)

        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.value = 100;
        this.p = barWidth / 100;
        this.barHeight = barHeight
        this.barWidth = barWidth
        this.draw();

        this.text = new Phaser.GameObjects.Text(scene, this.barWidth/ 2, this.barHeight / 2, "",
            {

                fontFamily: 'Arial',
                fontSize: this.barHeight-5,
                color: '#000000',
                align: 'center',
               
            }
        )

        this.add(this.bar);
    }

    decrease(amount) {
        this.value -= amount;

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(0, 0, this.barWidth, this.barHeight);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(2, 2, this.barWidth-4, this.barHeight-4);

        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(2, 2, d, this.barHeight - 4);
    }

}