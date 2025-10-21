export default class Personaje extends Phaser.GameObjects{

    constructor(name="",HP=0, HPMax=0, Habilidades=[0], StatusEffects=[0]){
        super(name,HP,HPMax,Habilidades,StatusEffects);

        this.scene.add.existing(this)
    }

}