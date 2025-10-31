import StatusEffect from './StatusEffect.js'

/**
 * Representa un enemigo en la escena del combate
 */
export default class Enemy extends Phaser.GameObjects.Image {
    constructor(key, scene, image)
    {
        

        console.log(image)
        super(scene,100,100, image)

        this.key = key;
        this.Hp = key.Hp
        this.sigHabilidad = 0; //poner entero random entre 0 y el numero de habilidads.
        this.turno = 0;
        /**
         * Guarda todos sus StatusEffects
         * @type {StatusEffects}
         */
        this.efectos = [];

        //clikar enemigos para apuntar
        this.canBeClicked = false;
        this.setInteractive();
        this.on('pointerdown', () => {
            this.scene.events.emit("target_selected", skillKey);
        })
        this.scene.events.on('target_selected', function () {this.canBeClicked = false })
    }



    /**
     * Setea la textura.
     * @param {Phaser.Textures.Texture} texture
     */
    //setTexture(texture) { this.texture = texture }

    setCoords(x, y) { this.x = x; this.y = y; }

}