import PlayerData from '../PlayerData.js'
import CombatManager from '../combatManager.js'
import Enemy from '../Enemy.js'
import Player from '../Player.js'
import MenuButton from '../MenuButton.js'
import Menu from '../Menu.js'
import HealthBar from '../HealthBar.js'
import ImageWithText from '../ImageWithText.js'

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

        this.jsonEquipamiento = this.cache.json.get('equipamiento');
        this.jsonEfectos = this.cache.json.get('efectos');
        this.jsonItems = this.cache.json.get('items');
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
        this.fondoUI = this.add.rectangle(25, 400, 750, 200, 0xB7B7B7).setOrigin(0, 0);
        
        this.add.rectangle(this.fondoUI.x + 200, 400, 10, 200, 0x1F4D4F).setOrigin(0, 0);
        

        //botones generales
        
        let botonAtacar = new MenuButton(this, this.fondoUI.x + 10, this.fondoUI.y + 15, this.player.playerData.arma, this.player.atacar);
        let botonDefender = new MenuButton(this, this.fondoUI.x + 10, this.fondoUI.y + 50, this.player.defender);
        let botonHabilidades = new MenuButton(this, this.fondoUI.x + 10, this.fondoUI.y + 85, 'Habilidades', null, () => { this.menuHabilidades.setVisible(true); this.menuItems.setVisible(false) });
        let botonItems = new MenuButton(this, this.fondoUI.x + 10, this.fondoUI.y + 120, 'Items',null, () => { this.menuHabilidades.setVisible(false); this.menuItems.setVisible(true) });
        //let botonHuir = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 155, 'HUIR');



        this.UpdateMenus();


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
        }).setOrigin(0, 1).setVisible(false).setDepth(2);

        /**
         * Rect�ngulo negro transl�cido que tapa todo a la hora de elegir target
         */
        this.blackFullRect = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, '#000000', 0.5).setOrigin(0, 0).setVisible(false);


        for (let i = 0; i < this.enemiesTam; i++) {
            this.add.existing(this.enemies[i])
        }
        this.add.existing(this.player.setOrigin(0,0))
        this.RedrawEnemies();



        //barras de hp y sp del jugador

        this.barraVida = new HealthBar(this, this.fondoUI.x+100, this.fondoUI.y-30, 200, 30, this.player.playerData.HPMax, 3)
        this.add.existing(this.barraVida)
        this.barraVida.targetValue = this.player.playerData.HP;

        this.barraSp = new HealthBar(this, this.fondoUI.x + 310, this.fondoUI.y - 30, 200, 30, this.player.playerData.SPMax, 3, 0x1B73CF)
        this.add.existing(this.barraSp)
        this.barraSp.targetValue = this.player.playerData.SP;


        //listeners de eventos

        this.events.on("select_skill", this.OnSelectSkill, this);
        this.events.on("select_target", this.OnSelectTarget, this);
        this.events.on("target_selected", this.OnTargetSelected, this);
        this.events.on("use_skill", this.UpdateMenus, this);

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
        this.barraVida.targetValue = this.player.playerData.HP;
        
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
        
        this.RedrawEnemies();
    }
    RedrawEnemies() {
        for (let i = 0; i < this.enemiesTam; i++) {
            this.enemies[i].updateEnemy(500 + 35 * i, 220- 85 * (this.enemiesTam / 2 - i))
        }
        for (let i = 0; i < this.enemiesTam; i++)
        {
            let menuEffects = new Menu(this, this.enemies[i].x + this.enemies[i].image.width + 5, this.enemies[i].y, 90, 50, 2, 5, null ,0,1)
            for (let j = 0; j < this.enemies[i].efectosTam; j++)
            {
                menuEffects.AddItem(new ImageWithText(this, 0, 0, this.enemies[i].efectos[j].duration, this.enemies[i].efectos[j].key,true,2,0.8))
            }

        }
        let menuEffects = new Menu(this, this.player.x + this.player.width + 5, this.player.y, 90, 50, 2, 5, null, 0, 1)
        for (let j = 0; j < this.player.playerData.efectosTam; j++) {
            menuEffects.AddItem(new ImageWithText(this, 0, 0, this.player.playerData.efectos[j].duration, this.player.playerData.efectos[j].key,true,2,0.8))
        }
    }
    OnSelectTarget(skillKey) {
        this.blackFullRect.setVisible(true)
    }
    OnTargetSelected() {
        this.blackFullRect.setVisible(false)
    }

    UpdateMenus() {
        this.menuHabilidades = new Menu(this, this.fondoUI.x + 210, this.fondoUI.y, 540, 200, 5, 3, 0xB7B7B7).setVisible(false).setDepth(1)
        this.menuItems = new Menu(this, this.fondoUI.x + 210, this.fondoUI.y, 540, 200, 5, 2, 0xB7B7B7).setVisible(false).setDepth(1)
        for (let i = 0; i < this.player.playerData.habilidades.length; i++) {
            this.menuHabilidades.AddButton(new MenuButton(this, 0, 0, this.player.playerData.habilidades[i]))
        }

        for (let i = 0; i < this.player.playerData.items.length; i++) {
            if (this.jsonItems[this.player.playerData.items[i].item].usedInCombat)
            {
                this.menuItems.AddButton(new MenuButton(this, 0, 0, this.player.playerData.items[i]))
            }
        }
    }

    ShowTextbox(text) {
        this.descriptionTextbox.text = text;
        this.descriptionTextbox.setVisible(true);
    }
    HideTextbox() {

        this.descriptionTextbox.setVisible(false);
    }
}
