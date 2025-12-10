// Enemy.js
import HealthBar from "./HealthBar.js";

/**
 * Representa un enemigo en la escena del combate
 */
export default class Enemy extends Phaser.GameObjects.Container {
  /**
   * @description Guarda la última habilidad que ha pasado el select_target
   * para poder devolverla en el evento target_selected
   */
  skillKey;

  /**
   * @param {string} key  Key del enemigo en jsonEnemigos
   * @param {Phaser.Scene} scene
   * @param {string} image Key de la textura del enemigo
   */
  constructor(key, scene, image) {
    super(scene, 100, 100);

    this.scene = scene;

    this.image = new Phaser.GameObjects.Image(scene, 0, 0, image).setOrigin(0, 0);
    this.add(this.image);

    this.key = key;
    this.hp = this.scene.jsonEnemigos[key].HpMax;
    this.sigHabilidad = 0;
    this.turno = 0;

    /**
     * Guarda todos sus StatusEffects
     * @type {{key:string, duration:number}[]}
     */
    this.efectos = this.efectos || [];
    this.efectosTam = this.efectos.length;

    this.healthBar = new HealthBar(
      scene,
      43,
      -6,
      100,
      18,
      this.hp,
      2
    );
    this.healthBar.setScale(0.3);
    this.add(this.healthBar);

    this.Pompa = new Phaser.GameObjects.Image(scene, -15, 2, "neutro").setOrigin(0, 0);
    this.Pompa.setScale(0.3);
    this.add(this.Pompa);

    // === INTERACCIÓN CLICK ENEMIGO ===
    this.canBeClicked = false;

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.image.width, this.image.height),
      Phaser.Geom.Rectangle.Contains
    );

    this.on("pointerdown", () => {
      if (this.canBeClicked && this.isAlive) {
        this.scene.events.emit("target_selected", this, this.skillKey);
        if (this.image.preFX) {
          this.image.preFX.clear();
        }
      }
    });

    this.scene.events.on("target_selected", () => {
      this.canBeClicked = false;
    });

    this.scene.events.on("select_target", skillKey => {
      if (this.isAlive) {
        this.canBeClicked = true;
        this.skillKey = skillKey;
      } else {
        this.canBeClicked = false;
      }
    });

    this.on("pointerout", () => {
      if (this.image.preFX) {
        this.image.preFX.clear();
      }
    });

    this.on("pointerover", () => {
      if (this.canBeClicked && this.isAlive && this.image.preFX) {
        this.image.preFX.addGlow("0xfaf255", 1, 1, false, 1, 0);
      }
    });
  }

  get isAlive() {
    return (this.hp ?? 0) > 0;
  }

  takeDamage(amount) {
    const dmg = Math.max(0, Math.floor(amount));
    this.hp = Math.max(0, (this.hp ?? 0) - dmg);

    if (this.healthBar) {
      this.healthBar.targetValue = this.hp;
    }

    if (this.hp <= 0) {
      this.canBeClicked = false;
      this.setAlpha(0.6);
      // avisar a la escena para que lo quite de la lista y reordene
      this.scene.events.emit("enemy_dead", this);
    }
  }

  setIntention(textureKey = "neutro") {
    this.cambiaPompa(textureKey);
  }

  updateEnemy(x, y) {
    this.x = x;
    this.y = y;
    if (this.healthBar) {
      this.healthBar.targetValue = this.hp;
    }
  }

  cambiaPompa(newTexture) {
    this.Pompa.setTexture(newTexture);
  }

  /**
   * Animación de ataque simple: se lanza hacia el jugador y vuelve
   * y luego llama a onHit.
   * @param {Phaser.GameObjects.Image|Phaser.GameObjects.Container} target
   * @param {Function} onHit
   */
  playAttackAnimation(target, onHit) {
    const scene = this.scene;
    const originalX = this.x;
    const originalY = this.y;

    let offsetX = 30;
    if (target && typeof target.x === "number") {
      offsetX = target.x < this.x ? -30 : 30;
    }

    scene.tweens.add({
      targets: this,
      x: originalX + offsetX,
      y: originalY,
      duration: 120,
      yoyo: true,
      ease: "Quad.easeOut",
      onComplete: () => {
        if (onHit) onHit();
      }
    });
  }
}