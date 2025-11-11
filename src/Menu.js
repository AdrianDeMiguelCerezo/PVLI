import CombatMenuButton from "./CombatMenuButton.js"
export default class Menu extends Phaser.GameObjects.Container {

    /**
     * 
     * @param {any} scene
     * @param {any} x
     * @param {any} y
     * @param {any} width
     * @param {any} height
     * @param {any} backgroundColour Si no quieres que haya fondo, no pongas nada
     * @param {any} rows
     * @param {any} columns
     * @param {number} SBMEAB Space between menu edges and buttons
     * @param {number} SBB Space between buttons and buttons
     */
    constructor(scene, x, y, width, height, rows, columns, backgroundColour = null ,SBMEAB =10,SBB=10) {
        console.log(scene, x, y, width, height, rows, columns, backgroundColour)
        super(scene, x, y)

        
        /**Space between menu edges and buttons
         * @type {number} 
         */
        this.SBMEAB = SBMEAB;

        /**Space between buttons and buttons
         * @type {number} 
         */
        this.SBB = SBB;

        /**Lugares donde pueden haber botones
         * @type {CombatMenuButton}
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

        if (backgroundColour != null) this.add(this.scene.add.rectangle(0, 0, width, height, backgroundColour).setOrigin(0, 0));


        scene.add.existing(this);
    }
    /**
     * 
     * @param {CombatMenuButton} button
     * @param {number} row
     * @param {number} column
     */
    AddButton(button, row = -1, column = -1) {

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
                while (i < this.rows && !found) { found = !this.positions[i][column]; i++; }
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
                if (this.positions[row][column]) { this.positions[row][column].destroy(); }
                this._AddButton(button, row, column)

            }
        }

    }

    /**
     * 
     * @param {CombatMenuButton} button
     * @param {number} row
     * @param {number} column
     */
    _AddButton(button, row, column) {
        this.positions[row][column] = button;

        this.add(button);


        button.setFixedSize((this.width - 2 * this.SBMEAB - (this.columns - 1) * this.SBB) / this.columns, 0)

        //console.log(this.SBMEAB, '+ (', this.width, ' - ', this.SBMEAB, ' - ', button.style.fixedWidth, ') * ', column, ' / ', this.columns, ' + ',this.SBB,' * ',column)
        button.x = this.SBMEAB + (button.style.fixedWidth + this.SBB) * column;

        button.y = this.SBMEAB + (this.height - this.SBMEAB) * row / this.rows;

    }

    AddItem(item, row = -1, column = -1) {
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

                    this._AddItem(item, i, j)

                }
                else {
                    item.destroy();
                }
            }
            else {
                let i = 0;
                let found = false;
                while (i < this.rows && !found) { found = !this.positions[i][column]; i++; }
                i--; j--;
                if (!this.positions[i][column]) { this._AddItem(item, i, column) }
                else { item.destroy(); }
            }
        }
    }

    _AddItem(item, row, column) {

        this.positions[row][column] = item;

        this.add(item);

        item.x = this.SBMEAB + (item.width + this.SBB) * column;

        item.y = this.SBMEAB + (item.height + this.SBB) * row;
    }
}