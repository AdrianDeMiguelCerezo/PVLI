// combatManager.js
// Gestiona el flujo del combate por turnos jugador vs enemigos.
// Se comunica SOLO por eventos de la escena:
//
//  - La UI emite:
//      "use_skill", skillObjOrKey
//      "target_selected", enemy, skillToken   (lo emiten los Enemy al hacer click)
//  - El CombatManager emite:
//      "select_skill"   -> los botones vuelven a estar clicables
//      "select_target", skillToken -> los enemigos pasan a ser clicables
//      "combat_ended", { result: 'win' | 'lose' }
//
// Y se apoya en los listeners ya existentes de MenuButton y Enemy.

import Enemy from "./Enemy.js";

// Debe coincidir con enums.json["Target"]
const Target = {
  SELF:        0,
  ENEMY:       1,
  RND_ENEMY:   2,
  ALL_ENEMIES: 3
};

export default class CombatManager extends Phaser.Events.EventEmitter {

  /**
   * @param {number} turn              Índice de turno inicial (normalmente 0)
   * @param {Enemy[]} enemies          Array de enemigos en la escena
   * @param {any} player               Objeto Player que tenga .playerData
   * @param {Phaser.Scene} scene       Escena de Phaser
   */
  constructor(turn = 0, enemies, player, scene) {
    super();

    this.turn   = turn;
    this.enemies = enemies || [];
    this.player  = player;
    this.scene   = scene;

    // --- Gestión de acciones del turno del jugador ---
    this.maxActionsPerTurn = 2;       // según GDD
    this.actionsLeft        = this.maxActionsPerTurn;

    // Skill pendiente de elegir objetivo (cuando target == ENEMY)
    this.currentSkillToken = null;
    this._skillLut = Object.create(null); // token -> skill normalizada

    this.ended = false;

    // Suscribir eventos de la escena
    this.scene.events.on("use_skill",       this.Use_Skill,       this);
    this.scene.events.on("target_selected", this.Target_Selected, this);

    // Estado inicial
    this.prepareEnemyIntentions();
    this.scene.events.emit("select_skill");

    console.log("[CM] CombatManager inicializado");
  }

  // =================== Utilidades básicas ===================

  /** Enemigos vivos actualmente. */
  getAliveEnemies() {
    return this.enemies.filter(e => e.isAlive);
  }

  /** Devuelve un enemigo vivo aleatorio o null si no quedan. */
  getRandomAliveEnemy() {
    const vivos = this.getAliveEnemies();
    if (!vivos.length) return null;
    const i = Math.floor(Math.random() * vivos.length);
    return vivos[i];
  }

  // =================== Entrada desde la UI ===================

  /**
   * Handler del evento "use_skill" que dispara la UI.
   * Acepta tanto:
   *  - string: key de habilidades.json
   *  - objeto: habilidad inline (equipamiento, items, etc.)
   */
  Use_Skill(skillLike) {
    if (this.ended) return;
    if (this.actionsLeft <= 0) {
      console.log("[CM] No quedan acciones, ignorando skill");
      return;
    }

    // Normalizar habilidad y generar token interno
    const { skill, token } = this.normalizeSkillEntry(skillLike);
    if (!skill) return;

    const actionsCost = this.getActionsCostForSkill(skill);

    console.log("[CM] Use_Skill", {
      name:   skill.name,
      key:    skill.key,
      target: skill.target,
      actionsCost,
      actionsLeftAntes: this.actionsLeft
    });

    // Skills que NO requieren seleccionar enemigo manualmente
    switch (skill.target) {

      case Target.SELF: {
        this.resolvePlayerSkill(skill, null);

        // Resetear estados de UI (los botones se reactivan con target_selected + select_skill)
        this.scene.events.emit("target_selected");
        return this.afterPlayerAction(actionsCost);
      }

      case Target.RND_ENEMY: {
        const rnd = this.getRandomAliveEnemy();
        if (rnd) {
          this.resolvePlayerSkill(skill, rnd);
        } else {
          console.log("[CM] No hay enemigos vivos para objetivo aleatorio");
        }

        this.scene.events.emit("target_selected");
        return this.afterPlayerAction(actionsCost);
      }

      case Target.ALL_ENEMIES: {
        const vivos = this.getAliveEnemies();
        if (vivos.length) {
          this.resolvePlayerSkill(skill, vivos);
        } else {
          console.log("[CM] No hay enemigos vivos para MULTI");
        }

        this.scene.events.emit("target_selected");
        return this.afterPlayerAction(actionsCost);
      }

      // Skills de objetivo unitario: pasamos a modo selección de enemigo
      case Target.ENEMY:
      default: {
        this.currentSkillToken = token;
        this.scene.events.emit("select_target", token);
        return;
      }
    }
  }

  /**
   * Handler del evento "target_selected" que emiten los Enemy
   * cuando el jugador hace click sobre uno de ellos.
   *
   * @param {Enemy} enemy        Enemigo clicado
   * @param {string} skillToken  Token interno de la skill que estaba esperando objetivo
   */
  Target_Selected(enemy, skillToken) {
    if (this.ended) return;

    // Ignorar eventos "target_selected" que no vengan de un click real
    if (!enemy || !skillToken) return;
    if (skillToken !== this.currentSkillToken) return;

    const skill = this._skillLut[skillToken];
    if (!skill) {
      console.warn("[CM] Target_Selected sin skill asociada", skillToken);
      return;
    }

    const actionsCost = this.getActionsCostForSkill(skill);

    console.log("[CM] Target_Selected", {
      enemyKey: enemy.key,
      skillName: skill.name,
      actionsCost
    });

    this.resolvePlayerSkill(skill, enemy);

    // Limpiar estado
    delete this._skillLut[skillToken];
    this.currentSkillToken = null;

    // Los botones ya se han reactivado al recibir este mismo evento en MenuButton.
    this.afterPlayerAction(actionsCost);
  }

  // =================== Gestión de acciones / turnos ===================

  /**
   * Aplica el gasto de acciones del jugador y decide si pasan a jugar los enemigos
   * o si el jugador puede volver a seleccionar skill.
   * @param {number} actionsUsed
   */
  afterPlayerAction(actionsUsed = 1) {
    this.actionsLeft -= actionsUsed;
    if (this.actionsLeft < 0) this.actionsLeft = 0;

    console.log("[CM] afterPlayerAction => acciones restantes:", this.actionsLeft);

    // Refrescar barra de vida de los enemigos, etc.
    this.scene.RedrawEnemies?.();

    // ¿ha terminado el combate?
    this.checkEndOfCombat();
    if (this.ended) return;

    // Si ya no quedan acciones, pasan a jugar los enemigos
    if (this.actionsLeft <= 0) {
      return this.startEnemyTurns();
    }

    // Si aún queda alguna acción, reactivamos el menú de habilidades
    this.scene.events.emit("select_skill");
  }

  /**
   * Dado un skill normalizada, devuelve cuántas acciones consume.
   * Lee 'actionCost' o 'actions' si existen; si no, 1.
   */
  getActionsCostForSkill(skill) {
    if (Number.isFinite(skill.actionCost) && skill.actionCost > 0) {
      return skill.actionCost;
    }
    if (Number.isFinite(skill.actions) && skill.actions > 0) {
      return skill.actions;
    }
    return 1;
  }

  // =================== Resolución de skills del jugador ===================

  /**
   * Aplica los efectos de la skill sobre los objetivos.
   * De momento sólo implementa daño (tipo 'dmg').
   *
   * @param {any} skill         Objeto skill normalizado
   * @param {Enemy|Enemy[]|null} enemyOrArray
   */
  resolvePlayerSkill(skill, enemyOrArray) {
    const aplicar = (targets) => {
      if (!targets) return;

      const arr = Array.isArray(targets) ? targets : [targets];
      if (!arr.length) return;

      // Daño directo
      if (skill.tipo === "dmg") {
        const power = Math.max(0, Math.floor(skill.power ?? 0));
        console.log("[CM] Aplicando daño", power, "a", arr.map(t => t.key));

        arr.forEach(t => {
          if (t instanceof Enemy && t.isAlive) {
            t.takeDamage(power);
          }
        });
      }

      // TODO: aquí se pueden aplicar efectos de estado, curas, buffs...
      // usando skill.effect, skill.effectDuration, etc.
    };

    switch (skill.target) {
      case Target.SELF:
        // TODO: curas / buffs al jugador.
        break;

      case Target.ENEMY:
      case Target.RND_ENEMY:
        if (enemyOrArray && enemyOrArray.isAlive) {
          aplicar(enemyOrArray);
        }
        break;

      case Target.ALL_ENEMIES:
        aplicar(enemyOrArray ?? this.getAliveEnemies());
        break;

      default:
        if (enemyOrArray && enemyOrArray.isAlive) {
          aplicar(enemyOrArray);
        }
        break;
    }
  }

  // =================== Normalización de skills ===================

  /**
   * Recibe o bien una key (string) de habilidades.json o bien
   * un objeto de habilidad (equipamiento, items…).
   *
   * Devuelve siempre:
   *   - skill: objeto normalizado
   *   - token: id interno que usamos cuando hay que seleccionar objetivo
   */
  normalizeSkillEntry(skillLike) {
    let raw = null;
    let key = null;

    if (typeof skillLike === "string") {
      key = skillLike;
      raw = this.scene.jsonHabilidades?.[skillLike];
      if (!raw) {
        console.warn("[CM] normalizeSkillEntry: no existe habilidad con key", skillLike);
        return { skill: null, token: null };
      }
    } else if (skillLike && typeof skillLike === "object") {
      raw = skillLike;
      key = skillLike.key || skillLike.name || "SKILL_OBJ";
    } else {
      return { skill: null, token: null };
    }

    const skill = this.normalizeSkillFromObject(raw, key);

    const token = `SK_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this._skillLut[token] = skill;

    return { skill, token };
  }

  /**
   * Normaliza cualquier objeto de habilidad a un formato interno común.
   *
   * @param {object} obj      Objeto habilidad original
   * @param {string} keyHint  Identificador "humano" de la skill
   */
  normalizeSkillFromObject(obj, keyHint = "SKILL") {
    const desc   = obj.description ?? obj.descripcion ?? "";
    const tgtRaw = obj.target ?? obj.objetivo ?? "";

    const target = this.mapTargetToEnum(tgtRaw, desc, keyHint);

    // Daño: intenta usar 'damage'. Si no, intenta sacarlo de la descripción.
    let damage = Number.isFinite(obj.damage) ? obj.damage : 0;
    if (!damage) {
      const m = desc.match(/(\d+)\s*(?:de\s*)?dañ|(\d+)\s*damage/i);
      const n = m ? parseInt(m[1] || m[2], 10) : 0;
      if (n > 0) damage = n;
    }

    const tipo = damage > 0 ? "dmg" : "effect";

    const actionCost = Number.isFinite(obj.actionCost)
      ? obj.actionCost
      : (Number.isFinite(obj.actions) ? obj.actions : 1);

    return {
      key:   keyHint,
      name:  obj.name ?? obj.nombre ?? keyHint,
      description: desc,

      tipo,               // 'dmg' o 'effect'
      power: damage,      // daño base
      target,             // enum Target
      actionCost,         // nº de acciones del GDD
      actions: actionCost,

      spCost: (obj.spCost ?? obj.coste ?? 0),
      effect: (obj.effect ?? obj.efecto ?? null),
      effectDuration: (obj.effectDuration ?? obj["duraciónEfecto"] ?? obj.duracionEfecto ?? 0),

      raw: obj            // por si hace falta consultar algo más adelante
    };
  }

  /**
   * Mapea el string de objetivo ("SELF", "ENEMY", "RNDENEMY", "ALLENEMIES", etc.)
   * al enum Target, con cierta tolerancia y overrides útiles.
   */
  mapTargetToEnum(objetivoStr, description, skillKey) {
    const s = (objetivoStr || "").toUpperCase();

    // enums oficiales
    if (s === "SELF")       return Target.SELF;
    if (s === "ENEMY")      return Target.ENEMY;
    if (s === "RNDENEMY")   return Target.RND_ENEMY;
    if (s === "ALLENEMIES") return Target.ALL_ENEMIES;

    // variantes toleradas
    if (s === "RND_ENEMY" || s === "RANDOM_ENEMY") return Target.RND_ENEMY;
    if (s === "ALL" || s === "ALL_ENEMIES")        return Target.ALL_ENEMIES;

    // Heurística por descripción
    if (description && /todos|all/i.test(description)) {
      return Target.ALL_ENEMIES;
    }

    // Override explícito (por si en datos 'DISPARO_MULTIPLE' viene mal)
    if (skillKey === "DISPARO_MULTIPLE") {
      return Target.ALL_ENEMIES;
    }

    // Por defecto, objetivo unitario ENEMY
    return Target.ENEMY;
  }

    // =================== Turno de los enemigos ===================

  /**
   * Turno de los enemigos: actúan de izquierda a derecha.
   * Cada enemigo:
   *  - hace una pequeña animación de ataque
   *  - al "impactar" baja la vida del jugador
   *  - esperamos un poco a que se vea la bajada de la barra
   *  - pasamos al siguiente enemigo vivo
   */
  startEnemyTurns() {
    console.log("[CM] Empieza turno de enemigos");

    const scene  = this.scene;
    const player = this.player;

    const doAttack = (index = 0) => {
      // saltar enemigos muertos
      while (index < this.enemies.length && !this.enemies[index].isAlive) {
        index++;
      }

      // si ya no queda ninguno, vuelve el turno al jugador
      if (index >= this.enemies.length) {
        const maxActions =
          this.maxActionsPerTurn ??
          this.actionsPerTurn ??
          2;

        this.actionsLeft = maxActions;
        this.prepareEnemyIntentions();

        if (!this.ended) {
          scene.events.emit("select_skill");
        }
        console.log("[CM] Fin turno enemigos, vuelve turno jugador");
        return;
      }

      const enemy  = this.enemies[index];
      const damage = 5; // aquí puedes luego enganchar daño desde jsonEnemigos

      const doHit = () => {
        // impacto visual en el jugador (flash rojo rápido)
        if (player && typeof player.setTint === "function") {
          player.setTint(0xff0000);
          scene.time.delayedCall(120, () => {
            if (player && typeof player.clearTint === "function") {
              player.clearTint();
            }
          });
        }

        // aplicar daño (la barra se irá animando sola porque usa targetValue)
        this.damagePlayer(damage);

        // pequeño delay para que se note la bajada de vida antes del siguiente ataque
        scene.time.delayedCall(400, () => {
          this.checkEndOfCombat();
          if (!this.ended) {
            doAttack(index + 1);
          }
        });
      };

      // si el Enemy tiene animación de ataque, la usamos
      if (enemy && typeof enemy.playAttackAnimation === "function") {
        enemy.playAttackAnimation(player, doHit);
      } else {
        // fallback sin animación
        doHit();
      }
    };

    doAttack(0);
  }

  // =================== Utilidades de estado / fin de combate ===================

  /** Pone la "pompa" de intención de cada enemigo (placeholder). */
  prepareEnemyIntentions() {
    this.enemies.forEach(e => e.setIntention(e.isAlive ? "espada" : "neutro"));
  }

  /** Aplica daño al jugador y comprueba derrota. */
  damagePlayer(amount) {
    const dmg = Math.max(0, Math.floor(amount));

    const pd = this.player?.playerData ?? {};
    const currentHp =
      pd.HP ??
      pd.Hp ??
      pd.hp ??
      50;

    const newHp = Math.max(0, currentHp - dmg);

    pd.HP = newHp;
    pd.Hp = newHp;
    pd.hp = newHp;

    console.log("[CM] damagePlayer", { amount: dmg, hpAntes: currentHp, hpDespues: newHp });

    if (newHp <= 0) {
      this.finishCombat("lose");
    }
  }

  /** Comprueba victoria (todos los enemigos muertos). */
  checkEndOfCombat() {
    if (!this.enemies.some(e => e.isAlive)) {
      this.finishCombat("win");
    }
  }

  /** Marca el combate como terminado y emite evento 'combat_ended'. */
  finishCombat(result) {
    if (this.ended) return;
    this.ended = true;
    console.log("[CM] Combate terminado:", result);
    this.scene.events.emit("combat_ended", { result });
  }
}