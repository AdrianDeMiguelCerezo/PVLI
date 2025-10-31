
import CombatManager from '../combatManager.js'
import Enemy from '../Enemy.js'
import Player from '../Player.js'
import MenuButton from '../MenuButton.js'

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
    }



    create() {

        this.habilidades = this.cache.json.get('habilidades');

        this.combatManager = new CombatManager(0,this.enemies,this.player,this);


        this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");

        // player = new Player() //hago que un nuevo gameObject player se cree aquí para el combate, ergo hago dos clases player, o le paso un player ya creado antes, pero que no se veía en pantalla porque patata?

        for (let i = 0; i < this.enemies.length; i++) {
            //enemies[i].setTexture(this.enemies[i].key)
            this.enemies[i].setCoords(300, 100 + 100 * i)
            this.add.existing(this.enemies[i])
        }

        //fondo ui
        let fondoUI = this.add.rectangle(50, 400, 700, 200, 0xB7B7B7);
        fondoUI.setOrigin(0, 0);
        this.add.rectangle(fondoUI.x + 200, 400, 10, 200, 0x1F4D4F).setOrigin(0, 0);
        //botones generales
        let botonAtacar = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 15, 'ATQ_BASICO');
        let botonDefender = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 50, 'DEFENDER');
        let botonHabilidades = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 85, 'Habilidades', () => { console.log(this.habilidades) });
        let botonItems = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 120, 'Items', () => { console.log("Under construction") });
        let botonHuir = new MenuButton(this, fondoUI.x + 10, fondoUI.y + 155, 'HUIR');


        this.events.on("select_skill", this.OnSelectSkill, this);
        this.events.on("select_target", this.OnSelectTarget, this);
        this.scene.events.on('use_skill', this.OnUseSkill);


    }
    OnUseSkill(key) {
        
    }
    OnSelectTarget(skillKey) {

    }

}
