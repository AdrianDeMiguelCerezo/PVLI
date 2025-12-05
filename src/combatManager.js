// combatManager.js
import Enemy from "./Enemy.js";

const Target = {
  SELF: 0,
  ENEMY: 1,
  RND_ENEMY: 2,
  ALL_ENEMIES: 3
};

export default class CombatManager extends Phaser.Events.EventEmitter {
  /**
   * @param {number} turn
   * @param {Enemy[]} enemies
   * @param {any} player
   * @param {Phaser.Scene} scene
   */
  constructor(turn = 0, enemies, player, scene) {
    super();

    this.turn = turn;
    this.enemies = enemies || [];
    this.player = player;
    this.scene = scene;

    this.maxActionsPerTurn = 2;
    this.actionsLeft = this.maxActionsPerTurn;

    this.currentSkillToken = null;
    this._skillLut = Object.create(null);

    this.ended = false;

    this.scene.events.on("use_skill", this.Use_Skill, this);
    this.scene.events.on("target_selected", this.Target_Selected, this);

    console.log("[CM] CombatManager inicializado");

    // primer turno del jugador
    this.startPlayerTurn();
  }

  // =================== Helpers ===================

  getAliveEnemies() {
    return this.enemies.filter(e => e && e.isAlive);
  }

  getRandomAliveEnemy() {
    const vivos = this.getAliveEnemies();
    if (!vivos.length) return null;
    const i = Math.floor(Math.random() * vivos.length);
    return vivos[i];
  }

  // =================== Turno jugador ===================

  startPlayerTurn() {
    if (this.ended) return;

    this.actionsLeft = this.maxActionsPerTurn;

    // aplicar efectos de estado al principio del turno
    this.applyStatusEffectsAtTurnStart();

    // re-telegrafiar intenciones enemigos
    this.prepareEnemyIntentions();

    // refrescar UI (enemigos + iconos de estados)
    this.scene.RedrawEnemies?.();

    // actualizar circulitos de acciones
    this.scene.events.emit(
      "actions_updated",
      this.actionsLeft,
      this.maxActionsPerTurn
    );

    // vuelve el menú de habilidades
    this.scene.events.emit("select_skill");
  }

  // =================== Entrada desde UI ===================

  Use_Skill(skillLike) {
    if (this.ended) return;
    if (this.actionsLeft <= 0) {
      console.log("[CM] No quedan acciones, ignorando skill");
      return;
    }

    const { skill, token } = this.normalizeSkillEntry(skillLike);
    if (!skill) return;

    const actionsCost = this.getActionsCostForSkill(skill);

    // check de SP antes de nada
    if (!this.hasEnoughSP(skill)) {
      console.log("[CM] No hay SP suficiente para", skill.name);
      this.scene.events.emit("not_enough_sp", skill);
      return;
    }

    console.log("[CM] Use_Skill", {
      name: skill.name,
      key: skill.key,
      target: skill.target,
      actionsCost,
      spCost: skill.spCost || 0,
      actionsLeftAntes: this.actionsLeft
    });

    switch (skill.target) {
      case Target.SELF: {
        this.resolvePlayerSkill(skill, null);
        this.spendResourcesForSkill(skill);

        this.scene.events.emit("target_selected");
        return this.afterPlayerAction(actionsCost);
      }

      case Target.RND_ENEMY: {
        const rnd = this.getRandomAliveEnemy();
        if (rnd) {
          this.resolvePlayerSkill(skill, rnd);
          this.spendResourcesForSkill(skill);
        } else {
          console.log("[CM] No hay enemigos vivos para RND_ENEMY");
        }
        this.scene.events.emit("target_selected");
        return this.afterPlayerAction(actionsCost);
      }

      case Target.ALL_ENEMIES: {
        const vivos = this.getAliveEnemies();
        if (vivos.length) {
          this.resolvePlayerSkill(skill, vivos);
          this.spendResourcesForSkill(skill);
        } else {
          console.log("[CM] No hay enemigos vivos para ALL_ENEMIES");
        }
        this.scene.events.emit("target_selected");
        return this.afterPlayerAction(actionsCost);
      }

      // ENEMY → pasar a modo selección de objetivo
      case Target.ENEMY:
      default: {
        this.currentSkillToken = token;
        this.scene.events.emit("select_target", token);
        return;
      }
    }
  }

  Target_Selected(enemy, skillToken) {
    if (this.ended) return;
    if (!enemy || !skillToken) return;
    if (skillToken !== this.currentSkillToken) return;

    const skill = this._skillLut[skillToken];
    if (!skill) {
      console.warn("[CM] Target_Selected sin skill asociada", skillToken);
      return;
    }

    const actionsCost = this.getActionsCostForSkill(skill);

    // check SP otra vez por si algo cambió
    if (!this.hasEnoughSP(skill)) {
      console.log("[CM] No hay SP suficiente en Target_Selected");
      this.scene.events.emit("not_enough_sp", skill);
      this.currentSkillToken = null;
      delete this._skillLut[skillToken];
      this.scene.events.emit("target_selected");
      return;
    }

    console.log("[CM] Target_Selected", {
      enemyKey: enemy.key,
      skillName: skill.name,
      actionsCost
    });

    this.resolvePlayerSkill(skill, enemy);
    this.spendResourcesForSkill(skill);

    delete this._skillLut[skillToken];
    this.currentSkillToken = null;

    this.scene.events.emit("target_selected");
    this.afterPlayerAction(actionsCost);
  }

  // =================== Acciones / turnos ===================

  afterPlayerAction(actionsUsed = 1) {
    this.actionsLeft -= actionsUsed;
    if (this.actionsLeft < 0) this.actionsLeft = 0;

    console.log("[CM] afterPlayerAction => acciones restantes:", this.actionsLeft);

    this.scene.RedrawEnemies?.();

    // actualizar circulitos
    this.scene.events.emit(
      "actions_updated",
      this.actionsLeft,
      this.maxActionsPerTurn
    );

    this.checkEndOfCombat();
    if (this.ended) return;

    if (this.actionsLeft <= 0) {
      // turno de enemigos
      this.startEnemyTurns();
    } else {
      // aún puede seguir actuando
      this.scene.events.emit("select_skill");
    }
  }

  getActionsCostForSkill(skill) {
    if (Number.isFinite(skill.actionCost) && skill.actionCost > 0) {
      return skill.actionCost;
    }
    if (Number.isFinite(skill.actions) && skill.actions > 0) {
      return skill.actions;
    }
    return 1;
  }

  hasEnoughSP(skill) {
    const pd = this.player?.playerData;
    if (!pd) return true;
    const cost = Number.isFinite(skill.spCost) ? skill.spCost : 0;
    const current = Number.isFinite(pd.SP) ? pd.SP : 0;
    return current >= cost;
  }

  spendResourcesForSkill(skill) {
    const pd = this.player?.playerData;
    if (!pd) return;

    // SP
    const cost = Number.isFinite(skill.spCost) ? skill.spCost : 0;
    if (cost > 0) {
      pd.SP = Math.max(0, (pd.SP ?? 0) - cost);
    }

    // Ítem de un solo uso
    if (skill.sourceItemRef) {
      const itemRef = skill.sourceItemRef;
      itemRef.count = Math.max(0, (itemRef.count ?? 0) - 1);

      if (itemRef.count <= 0) {
        const items = pd.items || [];
        const idx = items.indexOf(itemRef);
        if (idx !== -1) items.splice(idx, 1);
      }

      // refrescar menús de items
      this.scene.UpdateMenus?.();
    }
  }

  // =================== Resolución de skills ===================

  resolvePlayerSkill(skill, enemyOrArray) {
    const applyAll = (targets) => {
      if (!targets) return;
      const arr = Array.isArray(targets) ? targets : [targets];
      if (!arr.length) return;

      // Daño directo
      if (skill.tipo === "dmg") {
        const base = Math.max(0, Math.floor(skill.power ?? 0));
        const damage = this.modifyDamageByStatuses(base);

        console.log(
          "[CM] Daño",
          damage,
          "a",
          arr.map(t => t.key)
        );

        arr.forEach(t => {
          if (t instanceof Enemy && t.isAlive) {
            t.takeDamage(damage);
          }
        });
      }

      // efectos secundarios (estado / curas / pociones)
      this.applySecondaryEffects(skill, arr);
    };

    switch (skill.target) {
      case Target.SELF:
        this.applySecondaryEffectsToPlayer(skill);
        break;

      case Target.ENEMY:
      case Target.RND_ENEMY:
        if (enemyOrArray && enemyOrArray.isAlive) {
          applyAll(enemyOrArray);
        }
        break;

      case Target.ALL_ENEMIES:
        applyAll(enemyOrArray ?? this.getAliveEnemies());
        break;

      default:
        if (enemyOrArray && enemyOrArray.isAlive) {
          applyAll(enemyOrArray);
        }
        break;
    }

    // Actualizar iconos de estados
    this.scene.RedrawEnemies?.();
  }

  /**
   * Modifica el daño base según los efectos de estado del jugador (ATT+, ATT-, HAMBRIENTO_1, etc.)
   * De momento solo mira diffs de daño porcentuales de efectos en playerData.efectos
   */
  modifyDamageByStatuses(baseDamage) {
    const pd = this.player?.playerData;
    if (!pd || !Array.isArray(pd.efectos) || !baseDamage) return baseDamage;

    const efectosDef = this.scene.jsonEfectos || {};
    let percent = 0;

    for (const eff of pd.efectos) {
      const def = efectosDef[eff.key];
      if (!def || !def.diffDmgPercent) continue;
      percent += def.diffDmgPercent;
    }

    const final = Math.round(baseDamage * (1 + percent / 100));
    return Math.max(0, final);
  }

  applySecondaryEffects(skill, targets) {
    if (!skill.effect) return;

    // Efecto instantáneo como los de pociones (objeto)
    if (typeof skill.effect === "object") {
      for (const t of (Array.isArray(targets) ? targets : [targets])) {
        if (t instanceof Enemy) {
          this.applyInstantEffectToEnemy(t, skill.effect);
        }
      }
      // si el target era SELF pero se ha resuelto como array vacío, aplicamos al jugador
      if (skill.target === Target.SELF) {
        this.applyInstantEffectToPlayer(skill.effect);
      }
      return;
    }

    // Efecto de estado (string, tipo "QUEMADO", "ATT+", etc.)
    if (typeof skill.effect === "string") {
      const key = skill.effect;
      const duration = Number.isFinite(skill.effectDuration)
        ? skill.effectDuration
        : 0;

      if (duration <= 0) {
        // efecto instantáneo definido en efectos.json (HP+, SP+, etc.)
        const def = (this.scene.jsonEfectos || {})[key];
        if (!def) return;

        if (skill.target === Target.SELF) {
          this.applyEffectDefToPlayer(def);
        } else {
          for (const t of (Array.isArray(targets) ? targets : [targets])) {
            if (t instanceof Enemy) {
              this.applyEffectDefToEnemy(t, def);
            }
          }
        }
        return;
      }

      // efecto persistente por turnos
      if (skill.target === Target.SELF) {
        this.addStatusToPlayer(key, duration);
      } else {
        for (const t of (Array.isArray(targets) ? targets : [targets])) {
          if (t instanceof Enemy) {
            this.addStatusToEnemy(t, key, duration);
          }
        }
      }
    }
  }

  applySecondaryEffectsToPlayer(skill) {
    if (!skill.effect) return;

    if (typeof skill.effect === "object") {
      this.applyInstantEffectToPlayer(skill.effect);
      return;
    }

    if (typeof skill.effect === "string") {
      const key = skill.effect;
      const duration = Number.isFinite(skill.effectDuration)
        ? skill.effectDuration
        : 0;

      if (duration <= 0) {
        const def = (this.scene.jsonEfectos || {})[key];
        if (def) this.applyEffectDefToPlayer(def);
      } else {
        this.addStatusToPlayer(key, duration);
      }
    }
  }

  // ===== Instant effects (pociones, etc) =====

  applyInstantEffectToPlayer(effectObj) {
    const pd = this.player?.playerData;
    if (!pd) return;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    if (Number.isFinite(effectObj.diffHealth)) {
      const maxHp = pd.HPMax ?? pd.HP ?? 0;
      pd.HP = clamp((pd.HP ?? maxHp) + effectObj.diffHealth, 0, maxHp);
    }

    if (Number.isFinite(effectObj.diffSp)) {
      const maxSp = pd.SPMax ?? pd.SP ?? 0;
      pd.SP = clamp((pd.SP ?? maxSp) + effectObj.diffSp, 0, maxSp);
    }
  }

  applyInstantEffectToEnemy(enemy, effectObj) {
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const maxHp =
      this.scene.jsonEnemigos?.[enemy.key]?.HpMax ??
      enemy.hp ??
      0;

    if (Number.isFinite(effectObj.diffHealth)) {
      const newHp = clamp(enemy.hp + effectObj.diffHealth, 0, maxHp);
      if (effectObj.diffHealth < 0) {
        enemy.takeDamage(-effectObj.diffHealth);
      } else {
        enemy.hp = newHp;
        enemy.healthBar.targetValue = newHp;
      }
    }
  }

  // ===== Añadir / aplicar efectos de estado de efectos.json =====

  addStatusToPlayer(key, duration) {
    const pd = this.player?.playerData;
    if (!pd) return;
    if (!Array.isArray(pd.efectos)) pd.efectos = [];

    pd.efectos.push({ key, duration });
    pd.efectosTam = pd.efectos.length;
  }

  addStatusToEnemy(enemy, key, duration) {
    if (!enemy.efectos) enemy.efectos = [];
    enemy.efectos.push({ key, duration });
    enemy.efectosTam = enemy.efectos.length;
  }

  applyEffectDefToPlayer(def) {
    const pd = this.player?.playerData;
    if (!pd) return;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    if (Number.isFinite(def.diffHealthPercent)) {
      const maxHp = pd.HPMax ?? pd.HP ?? 0;
      const delta = Math.round(maxHp * (def.diffHealthPercent / 100));
      if (delta < 0) {
        this.damagePlayer(-delta);
      } else {
        pd.HP = clamp((pd.HP ?? maxHp) + delta, 0, maxHp);
      }
    }

    if (Number.isFinite(def.diffHealth)) {
      if (def.diffHealth < 0) {
        this.damagePlayer(-def.diffHealth);
      } else {
        const maxHp = pd.HPMax ?? pd.HP ?? 0;
        pd.HP = clamp((pd.HP ?? maxHp) + def.diffHealth, 0, maxHp);
      }
    }

    if (Number.isFinite(def.diffSp)) {
      const maxSp = pd.SPMax ?? pd.SP ?? 0;
      pd.SP = clamp((pd.SP ?? maxSp) + def.diffSp, 0, maxSp);
    }
  }

  applyEffectDefToEnemy(enemy, def) {
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const maxHp =
      this.scene.jsonEnemigos?.[enemy.key]?.HpMax ??
      enemy.hp ??
      0;

    if (Number.isFinite(def.diffHealthPercent)) {
      const delta = Math.round(maxHp * (def.diffHealthPercent / 100));
      if (delta < 0) {
        enemy.takeDamage(-delta);
      } else {
        enemy.hp = clamp(enemy.hp + delta, 0, maxHp);
        enemy.healthBar.targetValue = enemy.hp;
      }
    }

    if (Number.isFinite(def.diffHealth)) {
      if (def.diffHealth < 0) {
        enemy.takeDamage(-def.diffHealth);
      } else {
        enemy.hp = clamp(enemy.hp + def.diffHealth, 0, maxHp);
        enemy.healthBar.targetValue = enemy.hp;
      }
    }
  }

  applyStatusEffectsAtTurnStart() {
    const efectosDef = this.scene.jsonEfectos || {};
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // jugador
    const pd = this.player?.playerData;
    if (pd) {
      if (!Array.isArray(pd.efectos)) pd.efectos = [];
      const nuevos = [];

      for (const eff of pd.efectos) {
        const def = efectosDef[eff.key];
        let duration = eff.duration ?? 0;

        if (def) {
          // por ahora solo aplicamos cosas de HP/SP por turno
          this.applyEffectDefToPlayer(def);
        }

        duration--;
        if (duration > 0) {
          nuevos.push({ key: eff.key, duration });
        }
      }

      pd.efectos = nuevos;
      pd.efectosTam = nuevos.length;
      pd.HP = clamp(pd.HP, 0, pd.HPMax ?? pd.HP);
      if (pd.HP <= 0) {
        this.finishCombat("lose");
        return;
      }
    }

    // enemigos
    for (const enemy of this.enemies) {
      if (!enemy) continue;
      if (!Array.isArray(enemy.efectos)) enemy.efectos = [];
      const nuevos = [];

      for (const eff of enemy.efectos) {
        const def = efectosDef[eff.key];
        let duration = eff.duration ?? 0;

        if (def) {
          this.applyEffectDefToEnemy(enemy, def);
        }

        duration--;
        if (duration > 0 && enemy.isAlive) {
          nuevos.push({ key: eff.key, duration });
        }
      }

      enemy.efectos = nuevos;
      enemy.efectosTam = nuevos.length;
    }
  }

  // =================== Normalización de skills ===================

  normalizeSkillEntry(skillLike) {
    let raw = null;
    let key = null;

    if (typeof skillLike === "string") {
      key = skillLike;
      raw = this.scene.jsonHabilidades?.[skillLike];
      if (!raw) {
        console.warn("[CM] normalizeSkillEntry: habilidad no encontrada", skillLike);
        return { skill: null, token: null };
      }
    } else if (skillLike && typeof skillLike === "object") {
      raw = skillLike;
      key = skillLike.key || skillLike.name || "SKILL_OBJ";
    } else {
      return { skill: null, token: null };
    }

    const skill = this.normalizeSkillFromObject(raw, key);

    // arrastrar metadatos (por ejemplo, referencia al item de PlayerData)
    if (skillLike._sourceItemRef) {
      skill.sourceItemRef = skillLike._sourceItemRef;
    }

    const token =
      "SK_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2);

    this._skillLut[token] = skill;

    return { skill, token };
  }

  normalizeSkillFromObject(obj, keyHint = "SKILL") {
    const desc = obj.description ?? obj.descripcion ?? "";
    const tgtRaw = obj.target ?? obj.objetivo ?? "";

    const target = this.mapTargetToEnum(tgtRaw, desc, keyHint);

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
      key: keyHint,
      name: obj.name ?? obj.nombre ?? keyHint,
      description: desc,

      tipo,
      power: damage,
      target,
      actionCost,
      actions: actionCost,

      spCost: obj.spCost ?? obj.coste ?? 0,
      effect: obj.effect ?? obj.efecto ?? null,
      effectDuration:
        obj.effectDuration ??
        obj["duraciónEfecto"] ??
        obj.duracionEfecto ??
        0,

      raw: obj
    };
  }

  mapTargetToEnum(objetivoStr, description, skillKey) {
    const s = (objetivoStr || "").toUpperCase();

    if (s === "SELF") return Target.SELF;
    if (s === "ENEMY") return Target.ENEMY;
    if (s === "RNDENEMY") return Target.RND_ENEMY;
    if (s === "ALLENEMIES") return Target.ALL_ENEMIES;

    if (s === "RND_ENEMY" || s === "RANDOM_ENEMY") return Target.RND_ENEMY;
    if (s === "ALL" || s === "ALL_ENEMIES") return Target.ALL_ENEMIES;

    if (description && /todos|all/i.test(description)) {
      return Target.ALL_ENEMIES;
    }

    if (skillKey === "DISPARO_MULTIPLE") {
      return Target.ALL_ENEMIES;
    }

    return Target.ENEMY;
  }

  // =================== Turno enemigos ===================

  startEnemyTurns() {
    console.log("[CM] Empieza turno de enemigos");

    const scene  = this.scene;
    const player = this.player;

    const doAttack = (index = 0) => {
      // saltar enemigos nulos o muertos
      while (
        index < this.enemies.length &&
        (!this.enemies[index] || !this.enemies[index].isAlive)
      ) {
        index++;
      }

      // si ya no queda ninguno, vuelve el turno al jugador
      if (index >= this.enemies.length) {
        console.log("[CM] Fin turno enemigos → vuelve turno jugador");
        this.startPlayerTurn();
        return;
      }

      const enemy  = this.enemies[index];
      const damage = 5; // TODO: sacar de enemigos.json

      const onHit = () => {
        if (player && typeof player.setTint === "function") {
          player.setTint(0xff0000);
          scene.time.delayedCall(120, () => {
            if (player && typeof player.clearTint === "function") {
              player.clearTint();
            }
          });
        }

        this.damagePlayer(damage);

        scene.time.delayedCall(400, () => {
          this.checkEndOfCombat();
          if (!this.ended) {
            doAttack(index + 1);
          }
        });
      };

      if (enemy && typeof enemy.playAttackAnimation === "function") {
        enemy.playAttackAnimation(player, onHit);
      } else {
        onHit();
      }
    };

    doAttack(0);
  }

  // =================== Utilidades / fin combate ===================

  prepareEnemyIntentions() {
    this.enemies.forEach(e =>
      e.setIntention(e.isAlive ? "espada" : "neutro")
    );
  }

  damagePlayer(amount) {
    const pd = this.player?.playerData;
    if (!pd) return;

    const dmg = Math.max(0, Math.floor(amount));
    const currentHp =
      pd.HP ??
      pd.Hp ??
      pd.hp ??
      50;

    const newHp = Math.max(0, currentHp - dmg);

    pd.HP = newHp;
    pd.Hp = newHp;
    pd.hp = newHp;

    console.log("[CM] damagePlayer", {
      amount: dmg,
      hpAntes: currentHp,
      hpDespues: newHp
    });

    if (newHp <= 0) {
      this.finishCombat("lose");
    }
  }

  checkEndOfCombat() {
    if (!this.enemies.some(e => e && e.isAlive)) {
      this.finishCombat("win");
    }
  }

  finishCombat(result) {
    if (this.ended) return;
    this.ended = true;
    console.log("[CM] Combate terminado:", result);
    this.scene.events.emit("combat_ended", { result });
  }
}