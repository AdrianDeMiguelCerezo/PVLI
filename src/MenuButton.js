// MenuButton.js
import BattleScene from "./scenes/BattleScene.js";
import PlayerData from "./PlayerData.js";

export default class MenuButton extends Phaser.GameObjects.Text {
  /**
   *
   * @param {BattleScene} scene
   * @param {number} x
   * @param {number} y
   * @param {any} key Indica o la key de la habilidad si se guarda en habilidades.json;
   *                  o la key de equipamiento, o es una tupla { item, count }
   * @param {string} skill Indica la skill a utilizar si se trata de una pieza de equipamiento
   * @param {Function} pointerDownAction Acción directa si NO es un botón de combate
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

    // ==== BOTONES GENÉRICOS (Se les pasa un callback) ====
    if (!!pointerDownAction) {
      this.text = key;
      scene.add.existing(this);

      this.setInteractive();
      this.on("pointerdown", () => {
          if (this.canBeClicked) {
              this.preFX.clear();
          pointerDownAction();
          
        }
      });
      this.on("pointerover", () => {
        if (this.canBeClicked) {
          this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
        }
      });
      this.on("pointerout", () => {
        this.preFX.clear();
      });
    }
    else {
      // ==== BOTONES DE COMBATE (usar habilidades e items) ====
      if (isCombat) {
        // --- Habilidad de equipamiento (arma, torso, etc.) ---
        if (!!skill) {
          this.text = scene.jsonEquipamiento[key].habilidades[skill].name;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
              if (this.canBeClicked) {
                  this.preFX.clear();
              scene.events.emit(
                "use_skill",
                scene.jsonEquipamiento[key].habilidades[skill]
              );
              
            }
          });

          this.on("pointerover", () => {
              if (this.canBeClicked) {
                  this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
              scene.ShowTextbox(
                scene.jsonEquipamiento[key].habilidades[skill].description
              );
              
            }
          });

            this.on("pointerout", () => {
                this.preFX.clear();
            if (this.canBeClicked) scene.HideTextbox();
            
          });
        }
        // --- Habilidad definida en habilidades.json ---
        else if (scene.jsonHabilidades.hasOwnProperty(key)) {
          this.text = scene.jsonHabilidades[key].name;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
              if (this.canBeClicked) {
                  this.preFX.clear();
              // Aquí emitimos la KEY, el CombatManager ya la resuelve en jsonHabilidades
              scene.events.emit("use_skill", key);
              
            }
          });

          this.on("pointerover", () => {
              if (this.canBeClicked) {
                  this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
              scene.ShowTextbox(scene.jsonHabilidades[key].description);
              
            }
          });

            this.on("pointerout", () => {
                this.preFX.clear();
            if (this.canBeClicked) scene.HideTextbox();
          });
        }
        // --- Botón de item (MOLOTOV, pociones, etc.) ---
        else {
          this.itemKey = key.item;
          this.itemCount = key.count;
          this.text = scene.jsonItems[key.item].name + ": " + key.count;
          scene.add.existing(this);

          this.setInteractive();

          this.on("pointerdown", () => {
              if (this.canBeClicked) {
              this.preFX.clear();
              // De momento usamos la primera habilidad del item
              scene.events.emit(
                "use_skill",
                scene.jsonItems[key.item].habilidades[0]
              );

            }
          });

          this.on("pointerover", () => {
            if (this.canBeClicked) {
              scene.ShowTextbox(scene.jsonItems[key.item].description);
              this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
            }
          });

            this.on("pointerout", () => {
                this.preFX.clear();
            if (this.canBeClicked) scene.HideTextbox();
          });
        }
      }

      // ==== BOTONES DE MENÚ (fuera de combate, bestiario, inventario...) ====
      else {
        
        if (scene.jsonEquipamiento.hasOwnProperty(key)) {
          if (!!skill) {
            this.text = scene.jsonEquipamiento[key].habilidades[skill].name;
          } else {
            this.text = scene.jsonEquipamiento[key].name;
          }
        } else if (scene.jsonHabilidades.hasOwnProperty(key)) {
          this.text = scene.jsonHabilidades[key].name;
        } else if (scene.jsonItems.hasOwnProperty(key)) {
          this.text = scene.jsonItems[key].name;
        } else {
          throw "esta key no es un item, equipamiento, ni habilidad ubicada en habilidades.json";
        }

        scene.add.existing(this);

        this.setInteractive();

          this.on("pointerdown", () => {
              this.preFX.clear();
          scene.events.emit("show_description", key, skill);
          
        });

        this.on("pointerover", () => {
          this.preFX.addGlow("0xfaf255", 1, 1, false, 1, 1);
        });

        this.on("pointerout", () => {
          this.preFX.clear();
        });
      }
    }

    // ====== GESTIÓN DE HABILITAR / DESHABILITAR BOTONES ======

    this.canBeClicked = true;

    // OJO: antes se hacía this.canBeClicked = false en 'use_skill' y
    // luego no siempre se reactivaban bien. Ahora solo cerramos el tooltip;
    // el bloqueo real lo gestionan 'select_target' y 'select_skill'.
    this.scene.events.on("use_skill", () => {
      this.scene.HideTextbox();
    });

    this.scene.events.on("select_skill", () => {
      this.canBeClicked = true;
    });

    this.scene.events.on("select_target", () => {
      this.canBeClicked = false;
    });

    this.scene.events.on("target_selected", () => {
      this.canBeClicked = true;
    });
  }

    destroy() {
        console.log(this.text,", destruido")
        this.removeAllListeners();
        super.destroy();
  }


  // (los métodos Equipar / Desequipar los dejo tal cual estaban; no influyen en el bug)
}