
/**
 * Representa un enemigo en la escena del combate
 */
export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(key, scene)
    {

        super(scene,0,0, null)

        this.key = key;
        this.Hp = key.Hp
        this.sigHabilidad = 0; //poner entero random entre 0 y el numero de habilidads.
        this.turno = 0;

    }
    /**
     * Setea la textura.
     * @param {Phaser.Textures.Texture} texture
     */
    setTexture(texture) { this.texture = texture }

    setCoords(x, y) { this.x = x; this.y = y; }

}