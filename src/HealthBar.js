export default class HealthBar extends Phaser.GameObjects.Container {

    constructor(scene, x, y, barWidth, barHeight,initialValue,borderThickness=2) {
        super(scene,x-barWidth/2, y)

        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.borderThickness=borderThickness
        this.value = initialValue;
        this.p = (barWidth-2*borderThickness) / initialValue;
        this.barHeight = barHeight
        this.barWidth = barWidth

        this.hpText = new Phaser.GameObjects.Text(scene, this.borderThickness, this.borderThickness, this.value,
            {

                fontFamily: 'Arial',
                fontSize: this.barHeight-2*this.borderThickness,
                color: '#000000',
                align: 'center',
                fixedWidth: this.barWidth-2*this.borderThickness,
               
            }
        )

        this.add(this.bar);
        this.add(this.hpText);
        console.log(this)
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(0, 0, this.barWidth, this.barHeight);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.borderThickness, this.borderThickness, this.barWidth-2*this.borderThickness, this.barHeight-2*this.borderThickness);

        
        this.bar.fillStyle(0xff0000);
        

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.borderThickness, this.borderThickness, d, this.barHeight - 2 * this.borderThickness);
        console.log(this)

        this.hpText.text = this.value;

        
    }

}