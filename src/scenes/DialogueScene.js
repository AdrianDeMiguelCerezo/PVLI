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
	 * @param {SubStateNode} fragmentoEvento
	 * @param {string} eventName
	 * @param {any} nodeType
	 * @param {any} difficultyLevel
	 * @param {PlayerData} playerData
	 * 
	 */
	init(data) {
		// Soporte dual: por si acaso se llama de la forma antigua o nueva
		if (data.fragmentoEvento || data.playerData) {
			this.fragmentoEvento = data.fragmentoEvento;
			this.playerData = data.playerData;
		} else {
			// Fallback por si data es directamente el fragmento (antiguo)
			this.fragmentoEvento = data;
			if (!this.playerData) this.playerData = new PlayerData();
		}
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
			()=>{ this.scene.start('MenuTest', {playerData: this.playerData, oldScene: this.scene.key})}, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1);
		//boton de ir al menu principal
		this.mainMenuButton = new MenuButton(this, this.desplegableButton.x, this.inventoryButton.y + 30, "Volver al menu principal", null, 
			()=>{ this.scene.start('MainMenu')}, 15, 0, "#c8d9d0", false).setVisible(false).setOrigin(1);
		
		//carga el dialogo de su json
		let data = this.cache.json.get('dialogos');
		
		this.dialogos = data.dialogo2;

		//si al iniciar la escena ya hay un fragmento cargado, reescribe con ese evento (por testear para cuando se vuelva de la escena de combate)
		if(this.fragmentoEvento != undefined){
			this.currentEvento = this.fragmentoEvento;
			console.log(this.fragmentoEvento);
		}
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
		//mira el primer evento
		this.checkEvent(this.currentEvento);
	}

	/**
	 * comprueba el tipo del fragmento actual
	 * @param {SubStateNode} evento
	 */
	checkEvent(evento){
		//si el evento es null, vuelve al mapa
		if(evento === null){
			this.scene.start('Map');
		}
		//comprueba si hay acciones
		let textoConsequencias = this.handleConsecuencias(evento.consecuencias);
		//si el tipo es dialogue, pon el texto y crea las opciones
		if(evento.tipo == "dialogue"){
			this.dialog.setText(textoConsequencias + evento.texto, true);
			this.createOptions(evento.opciones);
		}
		// Empaquetar datos para el combate
		else if(evento.tipo == "combat"){
			// Obtenemos el nodo de victoria (primer salto en opciones)
			const winNode = (evento.opciones && 
				evento.opciones.length > 0) ? evento.opciones[0].salto : null;

			this.scene.start('BattleScene', {
				enemies: evento.combate.enemies,
				winNode: winNode,
				fleeNode: evento.nodoHuida,
				playerData: this.playerData // Pasamos el estado actual del jugador
			});
		}
	}

	/**
	 * Modifica el PlayerData con el contenido de la accion del fragmento actual (si hay)
	 * y devuelve un texto que dice que ha cambiado
	 * 
	 */
	handleConsecuencias(consecuencias){
		let textoConsequencias = "";
		if(consecuencias){
			if(consecuencias.dinero){
				textoConsequencias += "Dinero: " + consecuencias.dinero + " oros \n";
			}
			if(consecuencias.sp){
				textoConsequencias += "SP: " + consecuencias.sp + "\n";
			}
			//... demas atributos
		}
		return textoConsequencias;
	}

	/**
	 * Pone botones de opciones por cada opcion en el fragmento
	 * 
	 */
	createOptions(opciones){

		//posicion original y offset para cada nuevo boton
		const baseY = 425;
		let offsetY = 0;

		//grupo de botones de opciones
		this.optionsButtons = [];

		opciones.forEach(opt => {
			//añade el texto
			const btn = this.add.text(400, baseY + offsetY, opt.texto, {fontFamily: 'Arial', fontSize: '24px', color: '#fff', backgroundColor:'#828181'});
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
				//comprueba el siguiente fragmento
				this.checkEvent(opt.salto);
			});
			//añade boton al grupo de botones de opciones
			this.optionsButtons.push(btn);
			//incrementa el offset
			offsetY += 40;
		});

	}

}
