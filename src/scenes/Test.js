export default class Test extends Phaser.Scene{
    constructor(){
        super({key:'Test'})
    }

    preload(){
    }

    create(){
        this.uiButton(100,300,"Test. Click para volver al mapa.")
    }

    uiButton(x, y, message){
    //crea el texto del boton con la posicion y el texto
    let botonFondo = this.add.rectangle(x,y,100, 25, 0x15C6CC).setOrigin(0,0);
    let boton = this.add.text(x, y, message);
    boton.setFontSize(25);
    botonFondo.width = boton.width;
    //establece interaccion
    boton.setInteractive();
    boton.on('pointerdown', ()=>{
        this.scene.start('Map');
    })
   }
}