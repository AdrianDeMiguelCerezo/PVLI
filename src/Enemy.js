
import HealthBar from './HealthBar.js'

/**
 * Representa un enemigo en la escena del combate
 */
export default class Enemy extends Phaser.GameObjects.Container {

    /**
     * @description Guarda la �ltima habilidad que ha pasado el select_target para poder devolverla en el evento target_selected
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
        
        super(scene,100,100)

        this.image = new Phaser.GameObjects.Image(scene, 0, 0, image).setOrigin(0, 0);
        this.add(this.image)



        this.key = key;
        this.hp = this.scene.jsonEnemigos[key].HpMax;
        this.sigHabilidad = 0; //poner entero random entre 0 y el numero de habilidads.
        this.turno = 0;
        /**
         * Guarda todos sus StatusEffects
         * @type {StatusEffects}
         */
        this.efectos = [];

        this.healthBar = new HealthBar(scene, this.image.width / 2, -22, 100, 18, this.hp, 2);

        this.scene.add.existing(this.healthBar)
        this.add(this.healthBar);
        
        

        this.Pompa = new Phaser.GameObjects.Image(scene, -50, 0, 'neutro').setOrigin(0, 0);
        this.add(this.Pompa);

        //clikar enemigos para apuntar
        this.canBeClicked = false;
        this.setInteractive(new Phaser.Geom.Rectangle(0,0,this.image.width,this.image.height),Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', () => {
            if (this.canBeClicked) {

                this.scene.events.emit("target_selected", this, this.skillKey)
                this.image.preFX.clear();
            }
        })
        this.scene.events.on('target_selected', ()=> { this.canBeClicked = false })
        this.scene.events.on('select_target', (skillKey) => { this.canBeClicked = true; this.skillKey = skillKey; })

        this.on('pointerout', () => {
            this.image.preFX.clear()
        })
        this.on('pointerover', () => {
            if (this.canBeClicked) {
                this.image.preFX.addGlow('0xfaf255', 1, 1, false, 1, 0)
            }
        })
    }

    get isAlive() {
        return this.hp > 0;
    }

    takeDamage(amount) {
        const dmg = Math.max(0, Math.floor(amount));
        this.hp = Math.max(0, this.hp - dmg);
        this.healthBar.targetValue = this.hp;
        if (this.hp <= 0) {
            this.canBeClicked = false;
            this.setAlpha(0.6);
        }
    }

    setIntention(textureKey = 'neutro') {
        this.cambiaPompa(textureKey);
    }



    /**
     * Setea la textura.
     * @param {Phaser.Textures.Texture} texture
     */
    //setTexture(texture) { this.texture = texture }

    updateEnemy(x, y) {
        this.x = x; this.y = y; this.healthBar.targetValue = this.hp;
    }

    /**
     * Cambia la pompa cuando en acorde a su intención
     * @param {Phaser.Textures.Texture} newTexture 
     */
    cambiaPompa(newTexture){
        this.Pompa.setTexture(newTexture);
    }

}
