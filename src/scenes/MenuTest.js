import PlayerInfoMenu from '../PlayerInfoMenu.js'



export default class MenuTest extends Phaser.Scene {

    constructor(playerData)
    {
        super({ key: 'MenuTest' })
        this.playerData = playerData;
    }

    init() {
        
        this.menu = new PlayerInfoMenu()
    }

    create() {

    }
}