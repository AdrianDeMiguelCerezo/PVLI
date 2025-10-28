import CombatManager from '../combatManager.js'
import Enemy from '../Enemy.js'
import Player from '../Player.js'

export default class BattleScene extends Phaser.Scene
{
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

	
	constructor() {
		super({ key: 'BattleScene' });
		/**
		 * tumadreee
		 * @type {number}
		 * @description 
		 */
		this.x = 0;
		this.y = 0;
	}

	preload() {

	}

	create() {

	}

	update() {

	}

}