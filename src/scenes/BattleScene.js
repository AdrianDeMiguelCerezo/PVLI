
import CombatManager from '../combatManager.js'
import Enemy from '../Enemy.js'
import Player from '../Player.js'

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

    constructor() {
        super({key: 'BattleScene'})
    }

    init(enemyKeys) {
        for (i = 0; i < enemyKeys.length; i++) {
            this.enemies[i]=new Enemy(enemyKeys[i],this)
        }
    }

    

    preload() {
        this.load.image('player', 'player.png')


        for (i = 0; i < enemies.length; i++) {
            this.load.image(enemies[i].key, 'assets/'+enemies[i].key + '.png')
        }
    }

    create() {
        this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");

        player = new Player() //hago que un nuevo gameObject player se cree aquí para el combate, ergo hago dos clases player, o le paso un player ya creado antes, pero que no se veía en pantalla porque patata?

        for (i = 0; i < enemies.length; i++) {
            enemies[i].setTexture(this.enemies[i].key)
            enemies[i].setCoords(300,100+100*i)
            this.add.existing(enemies[i])
        }

        this.events.on("select_skill", this.OnSelectSkill, this);
        this.events.on("select_target", this.OnSelectTarget, this);
    }
    OnSelectSkill() {

    }
    OnSelectTarget(skillKey) {

    }

    update() {

    }
}
