import PlayerInfoMenu from '../PlayerInfoMenu.js'



export default class MenuTest extends Phaser.Scene {

    constructor()
    {
        super({ key: 'MenuTest' })
        
    }

    init(playerData) {
        this.playerData = playerData;
        this.jsonEquipamiento = this.cache.json.get('equipamiento');
        this.jsonEfectos = this.cache.json.get('efectos');
        this.jsonItems = this.cache.json.get('items');
        this.jsonHabilidades = this.cache.json.get('habilidades');
    }

    create() {

        this.menu = new PlayerInfoMenu(this,0,0,this.playerData);
        this.add.existing(this.menu);
    }
}