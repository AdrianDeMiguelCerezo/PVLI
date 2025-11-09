import PlayerInfoMenu from '../PlayerInfoMenu.js'



export default class MenuTest extends Phaser.Scene {

    constructor()
    {
        super({ key: 'MenuTest' })
        
    }

    init(playerData) {

        this.playerData = playerData;
        this.menu = new PlayerInfoMenu(this,0,0,playerData)
    }

    create() {

    }
}