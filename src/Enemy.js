export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(key, scene, x, y, texture, frame) {
        
        this.key = key;
        this.Hp = 100; //poner la hp del key
        this.sigHabilidad = 0; //poner entero random entre 0 y el numero de habilidads.
        this.turno = 0;

    }
}