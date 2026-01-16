// MenuButton.js
import BattleScene from "./scenes/BattleScene.js";
import PlayerData from "./PlayerData.js";

export default class MenuButton extends Phaser.GameObjects.Text {
  /**
   *
   * @param {BattleScene} scene
   * @param {number} x
   * @param {number} y
   * @param {any} key   Si pointerDownAction es null:
   *                    - string: key de habilidad en habilidades.json
   *                    - string: key de equipamiento
   *                    - { item, count }: item de PlayerData.items
   * @param {string} skill   Nombre de la habilidad interna si es equipamiento
   * @param {Function} pointerDownAction Acción directa si NO es botón de combate
   * @param {number} fontSize
   * @param {number} fixedWidth
   * @param {string} backgroundColor
   * @param {boolean} isCombat
   */
  constructor(
    scene,
    x,
    y,
    key,
    skill,
    pointerDownAction,
    fontSize = 21,
    fixedWidth = 0,
    backgroundColor = "#707070",
    isCombat = true
  ) {
    super(
      scene,
      x,
      y,
      " ",
      {
        fontFamily: "Arial",
        fontSize: fontSize,
        color: "#000000",
        align: "center",
        fixedWidth: fixedWidth,
        backgroundColor: backgroundColor,
        padding: { x: 5 }
      }
    );

    this.scene = scene;
    this.canBeClicked = true;

    // =================== BOTONES GENÉRICOS (Atacar, Defender, pestañas...) ===================
    if (pointerDownAction) {
      this.text = key;
      scene.add.existing(this);

      this.setInteractive();

      this.on("pointerdown", () => {
        if (!this.canBeClicked) return;
        if (this.preFX) this.preFX.clear();
        pointerDownAction();
      });

      this.on("pointerover", () => {
        if (this.canBeClicked && this.preFX) {
          this.preFX.addGlow(0xfaf255, 1, 1, false, 1, 1);
        }
      });

      this.on("pointerout", () => {
        if (this.preFX) this.preFX.clear();
      });
    } else {
      // =================== BOTONES DE COMBATE (skills, equipamiento, items) ===================
      if (isCombat) {
        // --- EQUIPAMIENTO (arma / torso / pantalones con habilidades activas) ---
        if (skill) {
          const eq = scene.jsonEquipamiento[key];
          this.text = eq.habilidades[skill].name;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
            if (!this.canBeClicked) return;
            const raw = eq.habilidades[skill];
            this.scene.events.emit("use_skill", raw);
            if (this.preFX) this.preFX.clear();
          });

          this.on("pointerover", () => {
            if (!this.canBeClicked) return;
            if (typeof this.scene.ShowTextbox === "function") {
              this.scene.ShowTextbox(eq.habilidades[skill].description);
            }
            if (this.preFX) {
              this.preFX.addGlow(0xfaf255, 1, 1, false, 1, 1);
            }
          });

          this.on("pointerout", () => {
            if (this.canBeClicked && typeof this.scene.HideTextbox === "function") {
              this.scene.HideTextbox();
            }
            if (this.preFX) this.preFX.clear();
          });
        }
        // --- HABILIDAD de habilidades.json ---
        else if (scene.jsonHabilidades && scene.jsonHabilidades.hasOwnProperty(key)) {
          const hab = scene.jsonHabilidades[key];
          this.text = hab.name;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
            if (!this.canBeClicked) return;
            // emitimos la KEY; CombatManager ya la mira en jsonHabilidades
            this.scene.events.emit("use_skill", key);
            if (this.preFX) this.preFX.clear();
          });

          this.on("pointerover", () => {
            if (!this.canBeClicked) return;
            if (typeof this.scene.ShowTextbox === "function") {
              this.scene.ShowTextbox(hab.description);
            }
            if (this.preFX) {
              this.preFX.addGlow(0xfaf255, 1, 1, false, 1, 1);
            }
          });

          this.on("pointerout", () => {
            if (this.canBeClicked && typeof this.scene.HideTextbox === "function") {
              this.scene.HideTextbox();
            }
            if (this.preFX) this.preFX.clear();
          });
        }
        // --- ITEM de PlayerData.items: { item, count } ---
        else {
          // key = { item: 'MOLOTOV', count: 2, ... }
          this.itemRef = key;
          const itemKey = key.item;
          const def = scene.jsonItems[itemKey];

          this.text = def.name + ": " + key.count;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
            if (!this.canBeClicked) return;
            // primera habilidad del item, pero pasando metadato para que el CombatManager reste usos
            const raw = def.habilidades[0];
            const skillWithMeta = {
              ...raw,
              _sourceItemRef: this.itemRef
            };
            this.scene.events.emit("use_skill", skillWithMeta);
            if (this.preFX) this.preFX.clear();
          });

          this.on("pointerover", () => {
            if (!this.canBeClicked) return;
            if (typeof this.scene.ShowTextbox === "function") {
              this.scene.ShowTextbox(def.description);
            }
            if (this.preFX) {
              this.preFX.addGlow(0xfaf255, 1, 1, false, 1, 1);
            }
          });

          this.on("pointerout", () => {
            if (this.canBeClicked && typeof this.scene.HideTextbox === "function") {
              this.scene.HideTextbox();
            }
            if (this.preFX) this.preFX.clear();
          });
        }
      } else {
        // =================== BOTONES FUERA DE COMBATE (inventario, info jugador, etc.) ===================
        const je = scene.jsonEquipamiento || {};
        const jh = scene.jsonHabilidades || {};
        const ji = scene.jsonItems || {};

        if (je[key]) {
          // equipamiento
          if (skill && je[key].habilidades && je[key].habilidades[skill]) {
            this.text = je[key].habilidades[skill].name;
          } else {
            this.text = je[key].name;
          }
        } else if (jh[key]) {
          this.text = jh[key].name;
        } else if (ji[key]) {
          this.text = ji[key].name;
        } else {
          throw new Error(
            "Esta key no es un item, equipamiento ni habilidad conocida: " + key
          );
        }

        scene.add.existing(this);

        this.setInteractive();

        this.on("pointerdown", () => {
          if (this.preFX) this.preFX.clear();
          // PlayerInfoMenu escucha este evento y enseña la descripción
          this.scene.events.emit("show_description", key, skill);
        });

        this.on("pointerover", () => {
          if (this.preFX) {
            this.preFX.addGlow(0xfaf255, 1, 1, false, 1, 1);
          }
        });

        this.on("pointerout", () => {
          if (this.preFX) this.preFX.clear();
        });
      }
    }

    this.name = this.text;

    // =================== Gestión de habilitar/deshabilitar (turnos de combate) ===================

    // Usamos funciones guardadas para poder hacer off() en destroy()
    this._onUseSkill = () => {
      if (typeof this.scene?.HideTextbox === "function") {
        this.scene.HideTextbox();
      }
    };
    this._onSelectSkill = () => {
      this.canBeClicked = true;
    };
    this._onSelectTarget = () => {
      this.canBeClicked = false;
    };
    this._onTargetSelected = () => {
      this.canBeClicked = true;
    };

    scene.events.on("use_skill", this._onUseSkill);
    scene.events.on("select_skill", this._onSelectSkill);
    scene.events.on("select_target", this._onSelectTarget);
    scene.events.on("target_selected", this._onTargetSelected);
  }

  destroy() {
    // quitar listeners de puntero propios
    this.removeAllListeners();

    // quitar listeners globales a la escena
    if (this.scene && this.scene.events) {
      if (this._onUseSkill) this.scene.events.off("use_skill", this._onUseSkill);
      if (this._onSelectSkill) this.scene.events.off("select_skill", this._onSelectSkill);
      if (this._onSelectTarget) this.scene.events.off("select_target", this._onSelectTarget);
      if (this._onTargetSelected) {
        this.scene.events.off("target_selected", this._onTargetSelected);
      }
    }

    //this._onUseSkill = null; NACHEADA
    //this._onSelectSkill = null;
    //this._onSelectTarget = null;
    //this._onTargetSelected = null;

    super.destroy();
  }
}