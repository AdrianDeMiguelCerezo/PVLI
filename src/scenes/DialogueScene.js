import DialogText from "../dialog_plugin.js";

export default class DialogueScene extends Phaser.Scene {
	/**
	 * Escena de texto cargado con archivos TTF locales.
	 * @extends Phaser.Scene
	 * 
	 * 
	 */
	constructor() {
		super({ key: 'base' });
		this.dialogos = ["dialogo 1", "dialogo 2", "dialogo 3"];
		this.index = 0;

	}

	/**
	 * Cargamos todos los assets que vamos a necesitar
	 */
	preload(){
		this.load.image('fondo', 'assets/fondoPlaceHolderDialogos.png');

	}
	
	create() {
		this.add.image(0, 0, 'fondo').setOrigin(0, 0);

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
			fontSize: 100,
			//fontFamily: "pixel"
		});
		this.dialog.setText(this.dialogos[this.index], true);
		this.index++;
		this.buttonContinue();
	}

	buttonContinue(){
		let btnText = this.add.text(400,525, "CONTINUE");
		btnText.setOrigin(0.5,0.5);

		btnText.setInteractive();
		btnText.on('pointerover', function () {
			this.setTint(0xff0000);
		});
		btnText.on('pointerout', function () {
			this.clearTint();
		});
		btnText.on('pointerdown', ()=>{
			if(this.index < 3){
				this.dialog.setText(this.dialogos[this.index], true);
				this.index++;
			}
			else{
				this.dialog.closeText();
				btnText.visible = false;
			}
		});
	}

}
