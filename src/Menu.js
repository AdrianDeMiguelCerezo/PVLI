import MenuButton from "./MenuButton.js"
export default class Menu extends Phaser.GameObjects.Container
{
    
    constructor(scene,x,y,width,heigth,backgroundColour,columns,rows)
    {
        super(scene,x, y)

        this.positions = []
        for (let i = 0; i < rows; i++) {
            positions[i] = []
            for (let j = 0; j < columns; j++) {
                positions[i][j] = null;
            }
        }
        
        this.add.rectangle()

    }
}