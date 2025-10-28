import CombatManager from '../combatManager.js'

export default class BattleScene extends Phaser.Scene
{
	player;
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
}