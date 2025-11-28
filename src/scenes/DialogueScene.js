import DialogText from "../dialog_plugin.js";
import PlayerData from "../PlayerData.js";
import SubStateNode from "../SubStateNode.js"
import Player from "../Player.js";

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
	init(eventName, fragmentoEvento, nodeType, difficultyLevel, playerData) {
		this.fragmentoEvento = fragmentoEvento;
		this.eventName = eventName;
		this.index = 0;
		this.nodeType = nodeType;
		this.difficultyLevel = difficultyLevel;
		this.playerData = playerData;
	}
	create() {
		this.add.image(0, 0, 'fondo').setOrigin(0, 0);

		//Se carga el evento del json
		/**
		 * evento generado por hardcode para testear los fragmentos, quitar cuando haya una forma de leerlos
		 * @type {SubStateNode}
		 */
		this.currentEvento = {
			tipo : "dialogue",
			texto: "Hola, esta es la primera linea de dialogo",
			opciones: [{
				texto: "CONTINUAR",
				salto: {
					tipo: "dialogue",
					texto: "Esta es la segunda opcion y ademas tiene consequencia",
					consecuencias: {
						dinero: 3
					},
					opciones: [{
						texto: "CONTINUAR",
						salto: {
							tipo: "dialogue",
							texto: "Esta linea tiene opciones, ejige bien: ",
							opciones: [
								{
									texto: "Luchar",
									salto: {
										tipo: "combat",
										combate: {
											enemies: [ "BANDIDO_COMUN", "BANDIDO_COMUN" ]
										},
										opciones:[{
											texto: "",
											salto: {
												tipo: "dialogue",
												texto: "Has ganado",
												opciones: [{
													texto: "CONTINUAR",
													salto: null
												}]
											}
										}],
										nodoHuida: {
											tipo: "dialogue",
											texto: "Has huido",
											opciones: [
												{
													texto: "CONTINUAR",
													salto: null
												}
											]
										}
									}
								},
								{
									texto: "Continuar hablando",
									salto: {
										tipo: "dialogue",
										texto: "Este ya es otro evento",
										opciones: [
											{
												texto: "IRSE",
												salto: null
											}
										]
									}
								},
								{
									texto: "terminar conversacion",
									salto: null
								}
							]
						}
					}]
				}
			}]
		};

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
		//si el tipo es combate comienza combate con los atributos
		else if(evento.tipo == "combat"){
			this.scene.start('BattleScene', evento.combate.enemies, evento.opciones[0].salto, evento.nodoHuida);
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
