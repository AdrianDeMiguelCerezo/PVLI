import MenuButton from "./MenuButton.js"
export default class Menu extends Phaser.GameObjects.Container
{
    
    constructor(scene,x,y,width,heigth,backgroundColour,columns,rows)
    {
        super(scene,x, y)

        this.positions = []
        for (let i = 0; i < rows; i++) {
            this.positions[i] = []
            for (let j = 0; j < columns; j++) {
                this.positions[i][j] = null;
            }
        }
        const background = this.scene.add.rectangle(0, 0, width, heigth, backgroundColour).setOrigin(0,0)
        
        this.add(background);

        scene.add.existing(this);
    }
    /**
     * 
     * @param {MenuButton} button
     * @param {any} row
     * @param {any} column
     */
    AddButton(button,row=-1,column=-1) {
        if (row == -1) {
            if (column == -1)
            {
                let i = 0;
                
                while (i < this.positions.length && this.positions[i][j])
                {
                    j = 0;
                    while(j<this.positions[i].length && this.positions[i][j])
                    i++;
                }
            }
            else
            {

            }
        }
        else
        {

        }
    }
}