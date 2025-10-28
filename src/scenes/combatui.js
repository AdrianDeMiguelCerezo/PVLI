import Enemy from '../ Enemy.js'

import CombatManager from '../combatManager.js'

//UI del combate

import CombatManager from './combatManager.js'
export default class CombatUI extends Phaser.Scene {


    /**
     * 
     * @param {number} turn -turno
     * @param {*} enemies 
     * @param {*} player 
     * @param {CombatManager}CombatManager 
     */
    constructor(){
        super({ key: 'CombatUI' });
        /**
         * @type {Enemy}
         */
        this.enemies
        this.player = null;
        this.caca = 'pfpfppfpfffpffpff'
        this.CombatManager = new CombatManager(0,this.enemies,this.player,this)
    }

   preload(){

   }

   create(){
    //placeholders visuales de jugador y enemigos segun la imagen del GDD
    let enemigoPlaceholder2 = this.add.rectangle(525, 50, 100, 200,0xC82E2F)
    enemigoPlaceholder2.setOrigin(0,0);
    let enemigoPlaceholder1 = this.add.rectangle(600, 100, 100, 200,0xffff0000)
    enemigoPlaceholder1.setOrigin(0,0);
    let playerPlaceholder = this.add.rectangle(200, 100, 100, 200,0x7DDA58)
    playerPlaceholder.setOrigin(0,0);
    //fondo ui
    let fondoUI = this.add.rectangle(100, 400, 600, 200, 0xB7B7B7);
    fondoUI.setOrigin(0,0);
    this.add.rectangle(fondoUI.getCenter().x, 400, 10, 200, 0x1F4D4F).setOrigin(0,0);
    //botones generales
    let botonAtacar = this.uiButton(fondoUI.x + 10, fondoUI.y+10, 'Atacar');
    let botonDefender = this.uiButton(fondoUI.x + 180, fondoUI.y+10, 'Defender');
    let botonHabilidades = this.uiButton(fondoUI.x + 10, fondoUI.y+40, 'Habilidades');
    let botonItems =  this.uiButton(fondoUI.x + 180, fondoUI.y+40, 'Items');
    let botonHuir =  this.uiButton(fondoUI.x + 125, fondoUI.y+70, 'Huir');

       console.log(this.enemies)
       this.CombatManager.Coutear("enemies")
       console.log('pito')
   }
   //creacion botones
   uiButton(x, y, message){
    //crea el texto del boton con la posicion y el texto
    let botonFondo = this.add.rectangle(x,y,100, 25, 0x15C6CC).setOrigin(0,0);
    let boton = this.add.text(x, y, message);
    boton.setFontSize(25);
    botonFondo.width = boton.width;
    //establece interaccion
    boton.setInteractive();
    boton.on('pointerdown', ()=>{
        console.log(this.enemies);
    })
   }
}