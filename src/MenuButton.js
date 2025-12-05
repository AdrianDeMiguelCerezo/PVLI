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

    // =================== BOTONES GENÉRICOS (Atacar, Defender, Habilidades, Items...) ===================
    if (!!pointerDownAction) {
      this.text = key;
      scene.add.existing(this);

      this.setInteractive();
      this.on("pointerdown", () => {
        if (this.canBeClicked) {
          pointerDownAction();
          if (this.preFX) this.preFX.clear();
        }
      });
      this.on("pointerover", () => {
        if (this.canBeClicked && this.preFX) {
          this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
        }
      });
      this.on("pointerout", () => {
        if (this.preFX) this.preFX.clear();
      });
    } else {
      // =================== BOTONES DE COMBATE (skills, equipamiento, items) ===================
      if (isCombat) {
        // --- EQUIPAMIENTO (arma / torso / pantalones con habilidades) ---
        if (!!skill) {
          this.text = scene.jsonEquipamiento[key].habilidades[skill].name;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
            if (this.canBeClicked) {
              const raw = scene.jsonEquipamiento[key].habilidades[skill];
              this.scene.events.emit("use_skill", raw);
              if (this.preFX) this.preFX.clear();
            }
          });

          this.on("pointerover", () => {
            if (this.canBeClicked) {
              if (typeof this.scene.ShowTextbox === "function") {
                this.scene.ShowTextbox(
                  this.scene.jsonEquipamiento[key].habilidades[skill].description
                );
              }
              if (this.preFX) {
                this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
              }
            }
          });

          this.on("pointerout", () => {
            if (this.canBeClicked && typeof this.scene.HideTextbox === "function") {
              this.scene.HideTextbox();
            }
            if (this.preFX) this.preFX.clear();
          });
        }
        // --- HABILIDAD definida en habilidades.json ---
        else if (scene.jsonHabilidades.hasOwnProperty(key)) {
          this.text = scene.jsonHabilidades[key].name;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
            if (this.canBeClicked) {
              this.scene.events.emit("use_skill", key);
              if (this.preFX) this.preFX.clear();
            }
          });

          this.on("pointerover", () => {
            if (this.canBeClicked) {
              if (typeof this.scene.ShowTextbox === "function") {
                this.scene.ShowTextbox(this.scene.jsonHabilidades[key].description);
              }
              if (this.preFX) {
                this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
              }
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
          this.itemKey = key.item;
          this.itemRef = key; // referencia al objeto dentro de playerData.items
          this.text = scene.jsonItems[key.item].name + ": " + key.count;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
            if (this.canBeClicked) {
              const raw = scene.jsonItems[key.item].habilidades[0];
              const skillWithMeta = {
                ...raw,
                _sourceItemRef: this.itemRef
              };
              this.scene.events.emit("use_skill", skillWithMeta);
              if (this.preFX) this.preFX.clear();
            }
          });

          this.on("pointerover", () => {
            if (this.canBeClicked) {
              if (typeof this.scene.ShowTextbox === "function") {
                this.scene.ShowTextbox(this.scene.jsonItems[key.item].description);
              }
              if (this.preFX) {
                this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
              }
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
        // =================== BOTONES FUERA DE COMBATE (inventario, bestiario, etc.) ===================
        if (scene.jsonHabilidades.hasOwnProperty(key)) {
          if (!!skill) {
            this.text = scene.jsonEquipamiento[key].habilidades[skill].name;
          } else {
            this.text = scene.jsonEquipamiento[key].name;
          }
        } else if (scene.jsonEquipamiento.hasOwnProperty(key)) {
          this.text = scene.jsonHabilidades[key].name;
        } else if (scene.jsonItems.hasOwnProperty(key)) {
          this.text = scene.jsonItems[key].name;
        } else {
          throw "esta key no es un item, equipamiento, ni habilidad ubicada en habilidades.json";
        }

        scene.add.existing(this);

        this.setInteractive();

        this.on("pointerdown", () => {
          this.scene.events.emit("show_description", key, skill);
          if (this.preFX) this.preFX.clear();
        });

        this.on("pointerover", () => {
          if (this.preFX) {
            this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
          }
        });

        this.on("pointerout", () => {
          if (this.preFX) this.preFX.clear();
        });
      }
    }

    // =================== Gestión de habilitar/deshabilitar ===================

    // OJO: aquí usamos la 'scene' del constructor, no this.scene,
    // y comprobamos que HideTextbox exista, para que no pete fuera de BattleScene.
    scene.events.on("use_skill", () => {
      if (typeof scene.HideTextbox === "function") {
        scene.HideTextbox();
      }
    });

    scene.events.on("select_skill", () => {
      this.canBeClicked = true;
    });

    scene.events.on("select_target", () => {
      this.canBeClicked = false;
    });

    scene.events.on("target_selected", () => {
      this.canBeClicked = true;
    });
  }
}