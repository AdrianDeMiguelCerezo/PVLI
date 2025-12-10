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
  /**
   * Jugador de la escena
   * @type {Player}
   */
  player;

  /**
   * Listado de enemigos
   * @type {Enemy[]}
   */
  enemies;

  /**
   * Puntero al gestor de combates
   * @type {CombatManager}
   */
  combatManager;

  constructor() {
    super({ key: "BattleScene" });
    this.enemies = [];

    // NUEVO: referencias a los menús de efectos
    this.enemyEffectMenus = [];
    this.playerEffectMenu = null;
  }

  /**
   * @param {string[]} enemyKeys
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

    // === Botones generales ===
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

    // === Menús de habilidades / items ===
    this.UpdateMenus();

    // === Tooltip de descripción ===
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

    // Añadir enemigos y jugador
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

    // === Círculos de acciones disponibles ===
    this.actionCircles = [];
    const baseX = this.fondoUI.x + 450;
    const baseY = this.fondoUI.y - 15;
    for (let i = 0; i < this.combatManager.maxActionsPerTurn; i++) {
      const circle = this.add.circle(
        baseX + i * 25,
        baseY,
        8,
        0xffff00,
        1
      );
      this.actionCircles.push(circle);
    }

    // === Eventos de combate / UI ===
    this.events.on("select_skill", this.OnSelectSkill, this);
    this.events.on("select_target", this.OnSelectTarget, this);
    this.events.on("target_selected", this.OnTargetSelected, this);

    // enemigos enviados a tomar viento cuando mueren
    this.events.on("enemy_dead", this.OnDeleteEnemy, this);

    // actualizar circulitos cuando cambian acciones
    this.events.on("actions_updated", this.OnActionsUpdated, this);

    // teclas debug
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

    // estado inicial de circulitos
    this.OnActionsUpdated(
      this.combatManager.actionsLeft,
      this.combatManager.maxActionsPerTurn
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

    // barras del jugador
    this.barraVida.targetValue = this.player.playerData.HP;
    this.barraSp.targetValue = this.player.playerData.SP;
  }

  OnSelectSkill() {
    // cuando el CombatManager dice "elige skill", refrescamos menús
    this.UpdateMenus();
  }

  OnActionsUpdated(remaining, max) {
    if (!this.actionCircles) return;
    for (let i = 0; i < this.actionCircles.length; i++) {
      const circle = this.actionCircles[i];
      if (!circle) continue;
      circle.setAlpha(i < remaining ? 1 : 0.2);
    }
  }

  /**
   * Elimina un enemigo concreto del array y reordena.
   * @param {Enemy} enemy
   */
  OnDeleteEnemy(enemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx === -1) return;

    enemy.destroy();

    // eliminar del array sin dejar nulls
    this.enemies.splice(idx, 1);
    this.enemiesTam = this.enemies.length;

    this.RedrawEnemies();
  }

  RedrawEnemies() {
    // 1) Limpiar menús de efectos anteriores
    if (this.enemyEffectMenus) {
      this.enemyEffectMenus.forEach(m => m.destroy(true));
    }
    this.enemyEffectMenus = [];

    if (this.playerEffectMenu) {
      this.playerEffectMenu.destroy(true);
      this.playerEffectMenu = null;
    }

    // 2) Recolocar sprites de enemigos
    for (let i = 0; i < this.enemiesTam; i++) {
      this.enemies[i].updateEnemy(
        500 + 35 * i,
        220 - 85 * (this.enemiesTam / 2 - i)
      );
    }

    // 3) Menús de efectos de los enemigos
    for (let i = 0; i < this.enemiesTam; i++) {
      const enemy = this.enemies[i];

      const menuEffects = new Menu(
        this,
        enemy.x + enemy.image.width + 5,
        enemy.y,
        80,
        50,
        2,
        5,
        null,
        0,
        1
      );

      for (let j = 0; j < enemy.efectosTam; j++) {
        const efecto = enemy.efectos[j];
        menuEffects.AddItem(
          new ImageWithText(
            this,
            0,
            0,
            efecto.duration,
            efecto.key,
            true,
            2,
            0.8
          )
        );
      }

      this.enemyEffectMenus.push(menuEffects);
    }

    // 4) Menú de efectos del jugador
    this.playerEffectMenu = new Menu(
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
      const efecto = this.player.playerData.efectos[j];
      this.playerEffectMenu.AddItem(
        new ImageWithText(
          this,
          0,
          0,
          efecto.duration,
          efecto.key,
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

  // ⬇️ MÉTODO FUSIONADO SIN CONFLICTOS
  UpdateMenus() {
    // conservar qué menú estaba abierto antes de refrescar
    const menuItemsVisible = !!this.menuItems?.visible;
    const menuHabilidadesVisible = !!this.menuHabilidades?.visible;

    // destruir menús antiguos (y sus hijos)
    if (this.menuHabilidades) this.menuHabilidades.destroy(true);
    if (this.menuItems) this.menuItems.destroy(true);

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

    // habilidades del jugador
    for (let i = 0; i < this.player.playerData.habilidades.length; i++) {
      this.menuHabilidades.AddButton(
        new MenuButton(this, 0, 0, this.player.playerData.habilidades[i])
      );
    }

    // items utilizables en combate
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