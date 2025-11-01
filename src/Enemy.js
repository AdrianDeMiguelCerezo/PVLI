import StatusEffect from './StatusEffect.js'

/**
 * Representa un enemigo en la escena del combate
 */
export default class Enemy extends Phaser.GameObjects.Image {

    /**
     * @description Guarda la última habilidad que ha pasado el select_target para poder devolverla en el evento target_selected
     */
    skillKey;

    /**
     * 
     * @param {any} key
     * @param {any} scene
     * @param {any} image
     */
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
            if(this.canBeClicked) this.scene.events.emit("target_selected", this, this.skillKey);
        })
        this.scene.events.on('target_selected', ()=> { this.canBeClicked = false })
        this.scene.events.on('select_target', (skillKey)=> { this.canBeClicked = true,this.skillKey=skillKey })
    }



    /**
     * Setea la textura.
     * @param {Phaser.Textures.Texture} texture
     */
    //setTexture(texture) { this.texture = texture }

    setCoords(x, y) { this.x = x; this.y = y; }

}