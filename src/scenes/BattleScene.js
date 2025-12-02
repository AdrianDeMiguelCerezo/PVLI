// BattleScene.js
import PlayerData from "../PlayerData.js";
import CombatManager from "../combatManager.js";
import Enemy from "../Enemy.js";
import Player from "../Player.js";
import MenuButton from "../MenuButton.js";
import Menu from "../Menu.js";
import HealthBar from "../HealthBar.js";
import ImageWithText from "../ImageWithText.js";

export default class BattleScene extends Phaser.Scene {
  /** @type {Player} */
  player;

  /** @type {Enemy[]} */
  enemies;

  /** @type {CombatManager} */
  combatManager;

  /** @type {object} */
  jsonHabilidades;

  constructor() {
    super({ key: "BattleScene" });
    this.enemies = [];
  }

  /**
   * @param {string[]} enemyKeys Array de keys de enemigos para este combate
   */
  init(enemyKeys) {
    this.jsonEquipamiento = this.cache.json.get("equipamiento");
    this.jsonEfectos = this.cache.json.get("efectos");
    this.jsonItems = this.cache.json.get("items");
    this.jsonHabilidades = this.cache.json.get("habilidades");
    this.jsonEnemigos = this.cache.json.get("enemigos");

    this.enemiesTam = 0;
    for (let i = 0; i < enemyKeys.length; i++) {
      this.enemies[i] = new Enemy(enemyKeys[i], this, enemyKeys[i]);
      this.enemiesTam++;
    }

    this.player = new Player(new PlayerData(), this, 200, 200, "player");
  }

  create() {
    // === CombatManager ===
    this.combatManager = new CombatManager(0, this.enemies, this.player, this);

    this.events.on("combat_ended", ({ result }) => {
      if (result === "win") {
        this.scene.start("Map");
      } else {
        this.scene.start("GameOver");
      }
    });

    this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");

    // === UI de fondo ===
    this.fondoUI = this.add
      .rectangle(25, 400, 750, 200, 0xb7b7b7)
      .setOrigin(0, 0);

    this.add
      .rectangle(this.fondoUI.x + 200, 400, 10, 200, 0x1f4d4f)
      .setOrigin(0, 0);

    // === Botones principales ===
    const botonAtacar = new MenuButton(
      this,
      this.fondoUI.x + 10,
      this.fondoUI.y + 15,
      this.player.playerData.arma,
      this.player.atacar
    );

    const botonDefender = new MenuButton(
      this,
      this.fondoUI.x + 10,
      this.fondoUI.y + 50,
      this.player.defender
    );

    const botonHabilidades = new MenuButton(
      this,
      this.fondoUI.x + 10,
      this.fondoUI.y + 85,
      "Habilidades",
      null,
      () => {
        this.menuHabilidades.setVisible(true);
        this.menuItems.setVisible(false);
      }
    );

    const botonItems = new MenuButton(
      this,
      this.fondoUI.x + 10,
      this.fondoUI.y + 120,
      "Items",
      null,
      () => {
        this.menuHabilidades.setVisible(false);
        this.menuItems.setVisible(true);
      }
    );

    // Menús de habilidades / items
    this.UpdateMenus();

    // Tooltip de descripción
    this.descriptionTextbox = this.add
      .text(0, 0, "", {
        fontFamily: "Arial",
        fontSize: "15px",
        color: "#000000",
        align: "center",
        fixedWidth: 0,
        backgroundColor: "#fadd87",
        padding: { x: 3 }
      })
      .setOrigin(0, 1)
      .setVisible(false)
      .setDepth(2);

    // Rectángulo negro al elegir target
    this.blackFullRect = this.add
      .rectangle(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "#000000",
        0.5
      )
      .setOrigin(0, 0)
      .setVisible(false);

    // Añadir enemigos y jugador a la escena
    for (let i = 0; i < this.enemiesTam; i++) {
      this.add.existing(this.enemies[i]);
    }
    this.add.existing(this.player.setOrigin(0, 0));
    this.RedrawEnemies();

    // Barras de vida / SP del jugador
    this.barraVida = new HealthBar(
      this,
      this.fondoUI.x + 100,
      this.fondoUI.y - 30,
      200,
      30,
      this.player.playerData.HPMax,
      3
    );
    this.add.existing(this.barraVida);
    this.barraVida.targetValue = this.player.playerData.HP;

    this.barraSp = new HealthBar(
      this,
      this.fondoUI.x + 310,
      this.fondoUI.y - 30,
      200,
      30,
      this.player.playerData.SPMax,
      3,
      0x1b73cf
    );
    this.add.existing(this.barraSp);
    this.barraSp.targetValue = this.player.playerData.SP;

    // === Listeners de eventos ===
    this.events.on("select_skill", this.OnSelectSkill, this);
    this.events.on("select_target", this.OnSelectTarget, this);
    this.events.on("target_selected", this.OnTargetSelected, this);

    // IMPORTANTE: antes se hacía UpdateMenus() en 'use_skill',
    // lo que mezclado con el bloqueo de botones daba problemas.
    // Ahora sólo refrescamos cuando vuelve a tocar elegir habilidad.
    // this.events.on("use_skill", this.UpdateMenus, this);  // <- eliminado

    // Teclas de debug rápido
    const q = this.input.keyboard.addKey("Q");
    q.on(
      "down",
      () => {
        return this.OnDeleteEnemy(this.enemies[0]);
      },
      this
    );

    const e = this.input.keyboard.addKey("E");
    e.on(
      "down",
      () => {
        console.log(this);
        this.enemies[1].hp -= 20;
        this.RedrawEnemies();
      },
      this
    );
  }

  update() {
    if (this.descriptionTextbox.visible) {
      this.descriptionTextbox.x =
        Math.min(
          this.input.activePointer.x + this.descriptionTextbox.width,
          this.sys.game.canvas.width
        ) - this.descriptionTextbox.width;

      this.descriptionTextbox.y =
        Math.max(
          this.input.activePointer.y - this.descriptionTextbox.height,
          0
        ) + this.descriptionTextbox.height;
    }

    // Sincronizar barra de vida del jugador
    this.barraVida.targetValue = this.player.playerData.HP;
  }

  // Cuando el CombatManager emite "select_skill":
  // refrescamos menús de habilidades/items.
  OnSelectSkill() {
    this.UpdateMenus();
  }

  /**
   * Elimina un enemigo concreto del array y reordena.
   * @param {Enemy} enemy
   */
  OnDeleteEnemy(enemy) {
    let i = 0;
    let encontrado = false;
    while (i < this.enemiesTam && !encontrado) {
      encontrado = this.enemies[i] === enemy;
      i++;
    }
    if (encontrado) {
      enemy.destroy();
      for (i; i < this.enemiesTam; i++) {
        this.enemies[i - 1] = this.enemies[i];
      }
      this.enemies[this.enemiesTam] = null;
      this.enemiesTam--;
    }

    this.RedrawEnemies();
  }

  RedrawEnemies() {
    for (let i = 0; i < this.enemiesTam; i++) {
      this.enemies[i].updateEnemy(
        500 + 35 * i,
        220 - 85 * (this.enemiesTam / 2 - i)
      );
    }
    for (let i = 0; i < this.enemiesTam; i++) {
      const menuEffects = new Menu(
        this,
        this.enemies[i].x + this.enemies[i].image.width + 5,
        this.enemies[i].y,
        80,
        50,
        2,
        5,
        null,
        0,
        1
      );
      for (let j = 0; j < this.enemies[i].efectosTam; j++) {
        menuEffects.AddItem(
          new ImageWithText(
            this,
            0,
            0,
            this.enemies[i].efectos[j].duration,
            this.enemies[i].efectos[j].key,
            true,
            2,
            0.8
          )
        );
      }
    }
    const menuEffectsPlayer = new Menu(
      this,
      this.player.x + this.player.width + 5,
      this.player.y,
      80,
      50,
      2,
      5,
      null,
      0,
      1
    );
    for (let j = 0; j < this.player.playerData.efectosTam; j++) {
      menuEffectsPlayer.AddItem(
        new ImageWithText(
          this,
          0,
          0,
          this.player.playerData.efectos[j].duration,
          this.player.playerData.efectos[j].key,
          true,
          2,
          0.8
        )
      );
    }
  }

  OnSelectTarget(skillKey) {
    this.blackFullRect.setVisible(true);
  }

  OnTargetSelected() {
    this.blackFullRect.setVisible(false);
  }

    UpdateMenus() {

        const menuItemsVisible = !!this.menuItems?.visible;
        const menuHabilidadesVisible = !!this.menuHabilidades?.visible;

        this.menuItems?.destroy();
        this.menuHabilidades?.destroy();
    // Menú de habilidades
    this.menuHabilidades = new Menu(
      this,
      this.fondoUI.x + 210,
      this.fondoUI.y,
      540,
      200,
      5,
      3,
      0xb7b7b7
    )
      .setVisible(menuHabilidadesVisible)
      .setDepth(1);

    // Menú de items
    this.menuItems = new Menu(
      this,
      this.fondoUI.x + 210,
      this.fondoUI.y,
      540,
      200,
      5,
      2,
      0xb7b7b7
    )
      .setVisible(menuItemsVisible)
      .setDepth(1);

    // Habilidades del jugador
    for (let i = 0; i < this.player.playerData.habilidades.length; i++) {
      this.menuHabilidades.AddButton(
        new MenuButton(this, 0, 0, this.player.playerData.habilidades[i])
      );
    }

    // Items utilizables en combate
    for (let i = 0; i < this.player.playerData.items.length; i++) {
      if (this.jsonItems[this.player.playerData.items[i].item].usedInCombat) {
        this.menuItems.AddButton(
          new MenuButton(this, 0, 0, this.player.playerData.items[i])
        );
      }
    }
  }

  ShowTextbox(text) {
    this.descriptionTextbox.text = text;
    this.descriptionTextbox.setVisible(true);
  }

  HideTextbox() {
    this.descriptionTextbox.setVisible(false);
  }
}