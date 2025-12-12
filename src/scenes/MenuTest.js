import PlayerInfoMenu from '../PlayerInfoMenu.js'
import MenuButton from '../MenuButton.js';


export default class MenuTest extends Phaser.Scene {

    constructor()
    {
        super({ key: 'MenuTest' })
        
    }

    init(initParams) {
        this.playerData = initParams.playerData;
        this.oldScene = initParams.oldScene;
        console.log(this.jsonEquipamiento);
        if(this.jsonEquipamiento === undefined) {
            console.log("miau");
            this.jsonEquipamiento = this.cache.json.get('equipamiento');
        }
        console.log(this.jsonEquipamiento);
        this.jsonEfectos = this.cache.json.get('efectos');
        this.jsonItems = this.cache.json.get('items');
        this.jsonHabilidades = this.cache.json.get('habilidades');
        console.log(this.oldScene);
    }

    create() {

        this.menu = new PlayerInfoMenu(this,0,0,this.playerData);

        this.goBackButton = new MenuButton(this, 50, 10, "Volver", null, ()=>{
            this.scene.start(this.oldScene);
        }, 15, 0, "#c8d9d0", false);
    }
}