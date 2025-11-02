import MenuButton from "./MenuButton.js"
export default class Menu extends Phaser.GameObjects.Container {

    constructor(scene, x, y, width, height, backgroundColour, rows, columns) {
        super(scene, x, y)

        /**Space between menu edges and buttons
         * @type {number} 
         */
        this.SBMEAB = 10;

        /**Space between buttons and buttons
         * @type {number} 
         */
        this.SBB = 10;

        /**Lugares donde pueden haber botones
         * @type {MenuButton}
         */
        this.positions = []
        for (let i = 0; i < rows; i++) {
            this.positions[i] = []
            for (let j = 0; j < columns; j++) {
                this.positions[i][j] = null;
            }
        }
        this.height = height;
        this.width = width;
        this.rows = rows;
        this.columns = columns;
        const background = this.scene.add.rectangle(0, 0, width, height, backgroundColour).setOrigin(0, 0)

        this.add(background);

        scene.add.existing(this);
    }
    /**
     * 
     * @param {MenuButton} button
     * @param {number} row
     * @param {number} column
     */
    AddButton(button, row = -1, column = -1) {
        console.log(this.rows, 'cols:', this.columns)
        console.log(row, 'col:', column)
        if (row == -1) {
            if (column == -1) {
                let i = 0;
                let j = 0;
                let found = false;
                while (i < this.rows && !found) {
                    j = 0;
                    while (j < this.columns && !found) { found = !this.positions[i][j]; j++ }
                    i++;
                }
                i--; j--;

                if (!this.positions[i][j]) {

                    this._AddButton(button, i, j)

                }
                else {
                    button.destroy();
                }
            }
            else {
                let i = 0;
                let found = false;
                while (i < this.rows && !found) {found = !this.positions[i][column];i++;}
                i--; j--;
                if (!this.positions[i][column]) { this._AddButton(button, i, column) }
                else { button.destroy(); }
            }
        }
        else {
            if (column == -1) {
                let j = 0;
                let found = false;
                while (j < this.columns && !found) { found = !this.positions[row][j]; j++ }
                j--;
                if (!this.positions[row][j]) { this._AddButton(button, row, j) }
                else { button.destroy(); }
            }
            else {
                this.positions[row][column].destroy();
                this._AddButton(button, row, column)

            }
        }
        console.log(this.positions)
    }

    /**
     * 
     * @param {MenuButton} button
     * @param {number} row
     * @param {number} column
     */
    _AddButton(button, row, column) {
        this.positions[row][column] = button;

        this.add(button);


        button.style.fixedWidth = (this.width - 2 * this.SBMEAB - (this.columns - 1) * this.SBB) / this.columns;
        console.log('fixedWidth: ',button.style.fixedWidth);
        //console.log(this.SBMEAB, '+ (', this.width, ' - ', this.SBMEAB, ' - ', button.style.fixedWidth, ') * ', column, ' / ', this.columns, ' + ',this.SBB,' * ',column)
        button.x = this.SBMEAB + (this.width - this.SBMEAB - button.style.fixedWidth) * column/ this.columns + this.SBB * column;
        
        button.y = this.SBMEAB + (this.height - this.SBMEAB) * row / this.rows;
        console.log(button.x)
        console.log(button.y)
    }
}