import DialogText from "../dialog_plugin.js";
import PlayerData from "../PlayerData.js";
import MenuButton from "../MenuButton.js";

export default class DialogueScene extends Phaser.Scene {
	/**
	 * Escena de texto cargado con archivos TTF locales.
	 * @extends Phaser.Scene
	 * 
	 * 
	 */
	constructor() {
		super({ key: 'DialogueScene' });
	}

	/**
	 * 
	 * @param {any} nodeType
	 * @param {any} difficultyLevel
	 * @param {PlayerData} playerData
	 * 
	 */
	init(nodeType, difficultyLevel, playerData) {
		this.index = 0;
		this.nodeType = nodeType;
		this.difficultyLevel = difficultyLevel;
		this.playerData = playerData;
	}
	create() {
		this.add.image(0, 0, 'fondo').setOrigin(0, 0);
		 //Boton de desplegar opciones
		this.desplegableButton = new MenuButton(this, 750, 50, "Opciones", null, ()=>{ 
			this.mainMenuButton.visible = !this.mainMenuButton.visible;
			this.inventoryButton.visible = !this.inventoryButton.visible;
		}, 15, 0, "#c8d9d0", false).setOrigin(1);
		//boton de ir al inventario
		this.inventoryButton = new MenuButton(this, this.desplegableButton.x, this.desplegableButton.y + 30, "Ir al inventario", null, 
			()=>{ this.scene.start('MenuTest', {playerData: new PlayerData(), oldScene: this.scene.key})}, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1);
		//boton de ir al menu principal
		this.mainMenuButton = new MenuButton(this, this.desplegableButton.x, this.inventoryButton.y + 30, "Volver al menu principal", null, 
			()=>{ this.scene.start('MainMenu')}, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1);
		
		//carga el dialogo de su json
		let data = this.cache.json.get('dialogos');
		
		this.dialogos = data.dialogo2;

		this.dialog = new DialogText(this, {
			borderThickness: 4,
			borderColor: 0x555555,
			borderAlpha: 1,
			windowAlpha: 0.6,
			windowColor: 0x828181,
			windowHeight: 150,
			padding: 32,
			closeBtnColor: 'darkgoldenrod',
			dialogSpeed: 3,
			fontSize: 24,
			fontFamily: "Arial",
			posY: 175
		});
		
		this.nextDialog();
	}

	//pone botones de opciones y si no hay ninguna opcion, pone boton de continuar
	createButtons(){
		//dialogo actual
		const dlAct = this.dialogos[this.index-1];
		
		//crea dialogos si hay
		if(dlAct.options){
			this.createOptions(dlAct.options);
			return;
		}

		//boton de continuar
		let btnText = this.add.text(400, 425, "CONTINUE", {fontFamily: 'Arial', fontSize: '24px', color: '#fff', backgroundColor:'#828181'});
		btnText.setOrigin(0.5,0.5);
		btnText.setInteractive();
		btnText.on('pointerover', function () {
			this.setTint(0xff0000);
		});
		btnText.on('pointerout', function () {
			this.clearTint();
		});
		btnText.on('pointerdown', ()=>{
			//continua al siguiente dialogo y destruye el boton
			this.nextDialog();
			btnText.destroy();
		});
	}

	/**
	 * Salta a una linea del dialogo
	 * @param {number} jumpLine
	 */
	jumpDialog(jumpLine){
		this.index = jumpLine;
		this.nextDialog();
	}


	nextDialog(){
		//pasa al siguiente dialogo
		if(this.index < this.dialogos.length){
			this.dialog.setText(this.dialogos[this.index].name, this.dialogos[this.index].text, true);
			this.index++;
			this.createButtons();
		}
		else{
			this.dialog.closeText();
		}
	}

	//crea botones de opciones
	createOptions(options){
		//posicion original y offset para cada nuevo boton
		const baseY = 425;
		let offsetY = 0;

		//grupo de botones de opciones
		this.optionsButtons = [];

		options.forEach(opt => {
			//añade el texto
			const btn = this.add.text(400, baseY + offsetY, opt.text, {fontFamily: 'Arial', fontSize: '24px', color: '#fff', backgroundColor:'#828181'});
			btn.setOrigin(0.5);
			//interaccion con botones
			btn.setInteractive();
			btn.on('pointerover', function () {
				this.setTint(0xff0000);
			});
			btn.on('pointerout', function () {
				this.clearTint();
			});
			btn.on('pointerdown', ()=>{
				//destruye cada boton
				this.optionsButtons.forEach(btn => btn.destroy());
				this.optionsButtons = [];
				//accion del boton
				this.handleAction(opt);
			});
			//añade boton al grupo de botones de opciones
			this.optionsButtons.push(btn);
			//incrementa el offset
			offsetY += 40;
		});

	}

	handleAction(opt) {
		//mira el el json del dialogo las opciones
		switch(opt.action) {
			case "startCombat":
				this.scene.start('BattleScene',opt.combatEnemies);
				break;
			case "goToMap":
				this.scene.start('Map');
				break;
			case "giveItem":
				this.playerData.items.push({item: opt.item, count: 1});
				break;
			case "skillPoints":
				this.playerData.SP += opt.sp;
				break;
			case "moneyCost":
				this.playerData.dinero += opt.cant;
				break;
			case "jumpDialogue":
				console.log(opt.jump);
				//salta a cierta linea de dialogo
				this.jumpDialog(opt.jump);
				break;
			default:
				this.nextDialog();
				break;
		}
	}

}
