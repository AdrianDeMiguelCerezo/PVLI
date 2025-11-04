export default class HealthBar extends Phaser.GameObjects.Container {

    constructor(scene, x, y, barWidth, barHeight,initialValue,borderThickness=2) {
        super(scene, x - barWidth / 2, y)

        this.borderThickness = borderThickness;

        this.targetValue = initialValue;

        this.actualValue = initialValue;

        this.p = (barWidth - 2 * borderThickness) / initialValue; //cuantos píxeles por cada value

        this.barHeight = barHeight
        this.barWidth = barWidth


        this.backgroundRectangle = new Phaser.GameObjects.Rectangle(this.scene,0, 0, barWidth, barHeight, 0x000000).setOrigin(0,0);

        this.healthBackgroundRectangle = new Phaser.GameObjects.Rectangle(this.scene, this.borderThickness, this.borderThickness, this.barWidth - 2 * this.borderThickness, this.barHeight - 2 * this.borderThickness, 0xffffff).setOrigin(0, 0);

        this.healthRectangle = new Phaser.GameObjects.Rectangle(this.scene, this.borderThickness, this.borderThickness, this.barWidth - 2 * this.borderThickness, this.barHeight - 2 * this.borderThickness, 0xff0000).setOrigin(0, 0);


        this.hpText = new Phaser.GameObjects.Text(scene, this.borderThickness, this.borderThickness, this.targetValue,
            {

                fontFamily: 'Arial',
                fontSize: this.barHeight-2*this.borderThickness,
                color: '#000000',
                align: 'center',
                fixedWidth: this.barWidth-2*this.borderThickness,
               
            }
        )

        console.log('vidaBarra',this)
        
        this.add(this.backgroundRectangle);
        this.add(this.healthBackgroundRectangle);
        this.add(this.healthRectangle);
        this.add(this.hpText);
        
    }
    preUpdate(t, dt) {
        
        if (this.actualValue != this.targetValue) {
            this.actualValue = Math.floor(this.actualValue + (this.targetValue - this.actualValue) / (dt))
            console.log(this.actualValue,'aaa ',this.targetValue, 'eee ',dt)
        }

        this.healthRectangle.width = this.actualValue*this.p;

        this.hpText.text = this.targetValue;
    }


    

}