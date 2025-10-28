
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
 * Guarda el array con los enemigos
 * @type {Enemy}
 */
	enemies;
	combatManager;
	turn;


	preload() {
		this.load.image('player', 'player.png')


		for (i = 0; i < enemies.length; i++) {
			this.load.image(enemies[i], enemies[i] + '.png')
		}
	}

	create() {
		this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");

		this.enemy
	}


	update() {

	}
}
