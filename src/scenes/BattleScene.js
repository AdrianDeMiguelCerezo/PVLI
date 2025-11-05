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
    jsonHabilidades;
    constructor() {
        super({ key: 'BattleScene' })
        this.enemies = [];
        
    } 

    /**
     * Array de Keys de los enemigos del combate
     * @param {string} enemyKeys
     */
    init(enemyKeys) {

        this.jsonHabilidades = this.cache.json.get('habilidades');
        this.jsonEnemigos = this.cache.json.get('enemigos');

        /** Tama�o del array de enemigos
         * @type {number}
         */
        this.enemiesTam = 0
        for (let i = 0; i < enemyKeys.length; i++) {
            console.log(enemyKeys)
            this.enemies[i] = new Enemy(enemyKeys[i], this, enemyKeys[i])
            this.enemiesTam++;
        }

        this.player = new Player(new PlayerData(), this, 200, 200, "player")
    }



    create() {


        

        this.combatManager = new CombatManager(0, this.enemies, this.player, this);

        this.events.on('combat_ended', ({result}) => {
            if (result === 'win') {
                this.scene.start('Map');
            } else {
                this.scene.start('GameOver');
            }
        });


        this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");



        //Para que cuando toque elegir enemigos los enemigos, todo menois lo enemigos se ponga m�s oscuro, primero se colocan en la escena todos los objetos no enemigos, 
        //luego el rect�ngulo oscuro que ocupa la pantalla, y luego los enemigos.

        //fondo ui
        let fondoUI = this.add.rectangle(25, 400, 750, 200, 0xB7B7B7);
        fondoUI.setOrigin(0, 0);
        this.add.rectangle(fondoUI.x + 200, 400, 10, 200, 0x1F4D4F).setOrigin(0, 0);
        this.menuHabilidades = new Menu(this, fondoUI.x + 210, fondoUI.y, 540, 200, 0xB7B7B7, 5, 3).setVisible(false)
        this.menuItems = new Menu(this, fondoUI.x + 210, fondoUI.y, 540, 200, 0xB7B7B7, 5, 3).setVisible(false)

        //botones generales
        let botonAtacar = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 15, 'ATQ_BASICO');
        let botonDefender = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 50, 'DEFENDER');
        let botonHabilidades = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 85, 'Habilidades', () => { this.menuHabilidades.setVisible(true); this.menuItems.setVisible(false) });
        let botonItems = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 120, 'Items', () => { this.menuHabilidades.setVisible(false); this.menuItems.setVisible(true) });
        let botonHuir = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 155, 'HUIR');





        for (let i = 0; i < this.player.playerData.habilidades.length; i++) {
            this.menuHabilidades.AddButton(new MenuButton(this, 0, 0, this.player.playerData.habilidades[i]))
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
         * Rect�ngulo negro transl�cido que tapa todo a la hora de elegir target
         */
        this.blackFullRect = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, '#000000', 0.5).setOrigin(0, 0).setVisible(false);


        for (let i = 0; i < this.enemiesTam; i++) {
            this.add.existing(this.enemies[i])
        }

        this.RedrawEnemies();

        this.events.on("select_skill", this.OnSelectSkill, this);
        this.events.on("select_target", this.OnSelectTarget, this);
        this.events.on("target_selected", this.OnTargetSelected, this);

        let q = this.input.keyboard.addKey('Q');
        q.on('down', () => { return this.OnDeleteEnemy(this.enemies[0]) }, this);

        let e = this.input.keyboard.addKey('E');
        e.on('down', () => { console.log(this); this.enemies[1].hp -= 20; this.RedrawEnemies() }, this);


    }
    update() {
        if (this.descriptionTextbox.visible) {
            this.descriptionTextbox.x = Math.min(this.input.activePointer.x + this.descriptionTextbox.width, this.sys.game.canvas.width) - this.descriptionTextbox.width;
            this.descriptionTextbox.y = Math.max(this.input.activePointer.y - this.descriptionTextbox.height, 0) + this.descriptionTextbox.height;
            
        }
        
    }
    OnSelectSkill() {

    }
    /**
     * 
     * @param {Enemy} enemy
     */
    OnDeleteEnemy(enemy) {
        let i = 0;
        let encontrado = false;
        while (i < this.enemiesTam && !encontrado) {
            encontrado = this.enemies[i] === enemy;
            i++;
        }
        if (encontrado) {
            enemy.destroy();
            for (i; i < this.enemiesTam; i++) {
                this.enemies[i-1]=this.enemies[i]
            }
            this.enemies[this.enemiesTam] = null;
            this.enemiesTam--;
        }
        console.log(this)
        this.RedrawEnemies();
    }
    RedrawEnemies() {
        for (let i = 0; i < this.enemiesTam; i++) {
            this.enemies[i].updateEnemy(500 + 35 * i, 220- 85 * (this.enemiesTam / 2 - i))
        }
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
