export default class HealthBar extends Phaser.GameObjects.Container {

    constructor(scene, x, y, barWidth, barHeight,initialValue,borderThickness=2,colour= 0xff0000) {
        super(scene, x - barWidth / 2, y)

        this.borderThickness = borderThickness;

        this.targetValue = initialValue;

        this._actualValue = initialValue;

        this.p = (barWidth - 2 * borderThickness) / initialValue; //cuantos p�xeles por cada value

        this.barHeight = barHeight
        this.barWidth = barWidth


        this.backgroundRectangle = new Phaser.GameObjects.Rectangle(this.scene,0, 0, barWidth, barHeight, 0x000000).setOrigin(0,0);

        this.healthBackgroundRectangle = new Phaser.GameObjects.Rectangle(this.scene, this.borderThickness, this.borderThickness, this.barWidth - 2 * this.borderThickness, this.barHeight - 2 * this.borderThickness, 0xffffff).setOrigin(0, 0);

        this.healthRectangle = new Phaser.GameObjects.Rectangle(this.scene, this.borderThickness, this.borderThickness, this.barWidth - 2 * this.borderThickness, this.barHeight - 2 * this.borderThickness, colour).setOrigin(0, 0);


        this.hpText = new Phaser.GameObjects.Text(scene, this.borderThickness, this.borderThickness, this.targetValue,
            {

                fontFamily: 'Arial',
                fontSize: this.barHeight-2*this.borderThickness,
                color: '#000000',
                align: 'center',
                fixedWidth: this.barWidth-2*this.borderThickness,
               
            }
        )


        
        this.add(this.backgroundRectangle);
        this.add(this.healthBackgroundRectangle);
        this.add(this.healthRectangle);
        this.add(this.hpText);

        scene.add.existing(this);
        
    }
    preUpdate(t, dt) {
        
        if (this._actualValue > this.targetValue) {
            this._actualValue = this._actualValue - 20 * dt / 1000
        } else if(this._actualValue < this.targetValue) {
            this._actualValue = this._actualValue + 20 * dt / 1000
        }
        if (Math.abs(this._actualValue) < Math.abs(this.targetValue) + 1 && Math.abs(this._actualValue) > Math.abs(this.targetValue)-1)
        {
            this._actualValue = this.targetValue;
        }
        
        this.healthRectangle.width = this._actualValue*this.p;

        this.hpText.text = this.targetValue;
    }
    /**
     * hace que la barra se setee en un valor instantaneamente. Si no hay valor, se setea al targetValue de la barra.
     * @param {any} targetValue
     */
    setInstantValue(targetValue=this.targetValue) { this._actualValue = targetValue; }
    

}