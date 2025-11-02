import PlayerData from '../PlayerData.js'
import CombatManager from '../combatManager.js'
import Enemy from '../Enemy.js'
import Player from '../Player.js'
import MenuButton from '../MenuButton.js'
import Menu from '../Menu.js'

export default class BattleScene extends Phaser.Scene {
    /**
     * Guarda el objeto del jugador
     * @type {Player}
     */
    player;

    /**
     * Guarda a todos los enemigos del combate
     * @type {Enemy} 
     */
    enemies;
    /**
     * @type {CombatManager}
     */
    combatManager;
    /**
     * @type {number}
     */
    turn;

    /**
     * 
     * @type {object}
     */
    habilidades;
    constructor() {
        super({ key: 'BattleScene' })
        this.enemies = [];

    }

    /**
     * Array de Keys de los enemigos del combate
     * @param {string} enemyKeys
     */
    init(enemyKeys) {


        for (let i = 0; i < enemyKeys.length; i++) {
            console.log(enemyKeys)
            this.enemies[i] = new Enemy(enemyKeys[i], this, enemyKeys[i])
        }

        this.player = new Player(new PlayerData(), this, 200, 200, "player")
    }



    create() {

        this.habilidades = this.cache.json.get('habilidades');

        this.combatManager = new CombatManager(0, this.enemies, this.player, this);


        this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");



        //Para que cuando toque elegir enemigos los enemigos, todo menois lo enemigos se ponga más oscuro, primero se colocan en la escena todos los objetos no enemigos, 
        //luego el rectángulo oscuro que ocupa la pantalla, y luego los enemigos.

        //fondo ui
        let fondoUI = this.add.rectangle(25, 400, 750, 200, 0xB7B7B7);
        fondoUI.setOrigin(0, 0);
        this.add.rectangle(fondoUI.x + 200, 400, 10, 200, 0x1F4D4F).setOrigin(0, 0);
        this.menuHabilidades = new Menu(this, fondoUI.x + 210, fondoUI.y, 540, 200, 0xB7B7B7, 5, 3)
        this.menuItems = new Menu(this, fondoUI.x + 210, fondoUI.y, 540, 200, 0xB7B7B7, 5, 3)

        //botones generales
        let botonAtacar = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 15, 'ATQ_BASICO');
        let botonDefender = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 50, 'DEFENDER');
        let botonHabilidades = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 85, 'Habilidades', () => { this.menuHabilidades.setVisible(true); this.menuItems.setVisible(false) });
        let botonItems = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 120, 'Items', () => { this.menuHabilidades.setVisible(false); this.menuItems.setVisible(true) });
        let botonHuir = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 155, 'HUIR');

        
        
      

        for (let i = 0; i < this.player.playerData.habilidades.length; i++) {
            this.menuHabilidades.AddButton(new MenuButton(this,0,0,this.player.playerData.habilidades[i]))
        }
        

        this.descriptionTextbox = this.add.text(0, 0, "", {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000000',
            align: 'center',
            fixedWidth: 0,
            backgroundColor: '#fadd87',
            padding: {
                x: 3
            }
        }).setOrigin(0, 1).setVisible(false);

        /**
         * Rectángulo negro translúcido que tapa todo a la hora de elegir target
         */
        this.blackFullRect = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, '#000000', 0.5).setOrigin(0, 0).setVisible(false);


        for (let i = 0; i < this.enemies.length; i++) {
            //enemies[i].setTexture(this.enemies[i].key)
            this.enemies[i].setCoords(600+30*i, 100+350*i/this.enemies.length)
            this.add.existing(this.enemies[i])
        }

        this.events.on("select_skill", this.OnSelectSkill,this);
        this.events.on("select_target", this.OnSelectTarget,this);
        this.events.on("target_selected", this.OnTargetSelected,this);

        //let q = this.input.keyboard.addKey('Q');
        //q.on('down', () => { this.menuHabilidades.AddButton(new MenuButton(this, 0, 0, 'ATQ_BASICO')) });


    }
    update() {
        if (this.descriptionTextbox.visible) {
            this.descriptionTextbox.x = this.input.activePointer.x;
            this.descriptionTextbox.y = this.input.activePointer.y;
        }
        
    }
    OnSelectSkill() {

    }

    OnSelectTarget(skillKey) {
        this.blackFullRect.setVisible(true)
    }
    OnTargetSelected() {
        this.blackFullRect.setVisible(false)
    }

    ShowTextbox(text) {
        this.descriptionTextbox.text = text;
        this.descriptionTextbox.setVisible(true);
    }
    HideTextbox() {

        this.descriptionTextbox.setVisible(false);
    }
}
