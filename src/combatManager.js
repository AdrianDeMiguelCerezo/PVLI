// combatManager.js
import Enemy from "./Enemy.js";

const Target = { SELF:0, ENEMY:1, RND_ENEMY:2, ALL_ENEMIES:3 };

export default class CombatManager extends Phaser.Events.EventEmitter {
  constructor(turn = 0, enemies, player = null, scene) {
    super();
    this.turn = turn;
    /** @type {Enemy[]} */ this.enemies = enemies;
    this.player = player;           // Player (tiene .playerData)
    /** @type {Phaser.Scene} */ this.scene = scene;

    this.actionsLeft = 2;           // según GDD
    this.currentSkillKey = null;    // puede ser string de JSON o un token __SKOBJ__...
    this._skillObjLut = Object.create(null); // token -> skill normalizada

    // UI events
    this.scene.events.on("use_skill", this.Use_Skill, this);
    this.scene.events.on("target_selected", this.Target_Selected, this);

    // telegrafía inicial simple
    this.prepareEnemyIntentions();
  }

  // ===== Input de UI =====
  /**
   * Acepta: string (clave del json) O un objeto de habilidad "inline" (desde UI/equipo)
   */
  Use_Skill(skillLike) {
    if (this.actionsLeft <= 0) return;

    let skill, emittedKey;

    if (typeof skillLike === 'string') {
      const raw = this.scene.jsonHabilidades?.[skillLike];
      if (!raw) return;
      skill = this.normalizeSkillFromJSON(skillLike, raw);   // ← JSON habilidades
      emittedKey = skillLike;                                // ← lo que verá Enemy
    } else if (skillLike && typeof skillLike === 'object') {
      skill = this.normalizeSkillFromObject(skillLike);      // ← Objeto en memoria
      // Creamos token único para que Enemy lo “devuelva”
      emittedKey = `__SKOBJ__${Date.now()}_${Math.random().toString(36).slice(2)}`;
      this._skillObjLut[emittedKey] = skill;
    } else {
      return;
    }

    // Resolver directo si NO requiere selección
    if (skill.target === Target.RND_ENEMY) {
      const rnd = this.getRandomAliveEnemy();
      if (rnd) {
        rnd.preFX?.addGlow?.('0xffffaa', 1, 1, false, 1, 0);
        this.scene.time.delayedCall(120, () => rnd.preFX?.clear?.());
        this.resolvePlayerSkill(skill, rnd);
      }
      // Cierra overlay / re-habilita UI en flujos sin selección
      this.scene.events.emit("target_selected");
      return this.afterPlayerAction();
    }
    if (skill.target === Target.ALL_ENEMIES) {
      const vivos = this.getAliveEnemies();
      this.resolvePlayerSkill(skill, vivos);
      this.scene.events.emit("target_selected");
      return this.afterPlayerAction();
    }
    if (skill.target === Target.SELF) {
      this.resolvePlayerSkill(skill, null);
      this.scene.events.emit("target_selected");
      return this.afterPlayerAction();
    }


    // Objetivo unitario → pasar a selección (Enemy devolverá emittedKey)
    this.currentSkillKey = emittedKey;
    this.scene.events.emit("select_target", emittedKey);
  }

  Target_Selected(enemy, skillKey) {
    // skillKey puede ser una clave string del json o un token __SKOBJ__*
    if (this.currentSkillKey !== skillKey) return;

    // Recuperar la skill según el origen
    let skill;
    if (typeof skillKey === 'string' && skillKey.startsWith('__SKOBJ__')) {
      skill = this._skillObjLut[skillKey];
    } else {
      const raw = this.scene.jsonHabilidades?.[skillKey];
      if (!raw) return;
      skill = this.normalizeSkillFromJSON(skillKey, raw);
    }
    if (!skill) return;

    this.resolvePlayerSkill(skill, enemy);

    // limpiar estado de selección
    delete this._skillObjLut[skillKey];
    this.currentSkillKey = null;

    // cerrar overlay / reactivar UI
    this.scene.events.emit("target_selected");

    this.afterPlayerAction();
  }

  afterPlayerAction() {
    this.actionsLeft--;
    this.scene.RedrawEnemies?.();

    this.checkEndOfCombat();
    if (this.actionsLeft <= 0 && !this.ended) {
      this.startEnemyTurns();
      return;
    }
    // habilitar de nuevo botones de skill/item
    this.scene.events.emit("select_skill");
  }

  // ===== Resolución jugador =====
  resolvePlayerSkill(skill, enemyOrArray) {
    const apply = (targets) => {
      if (!targets?.length) return;
      if (skill.tipo === 'dmg') {
        const power = skill.power ?? 5;
        targets.forEach(t => t instanceof Enemy && t.takeDamage(power));
      }
      // TODO efectos/buffs/curas (conectar StatusEffect)
    };

    switch (skill.target) {
      case Target.SELF:        /* curas/buffs al jugador (pendiente) */ break;
      case Target.ENEMY:       if (enemyOrArray?.isAlive) apply([enemyOrArray]); break;
      case Target.RND_ENEMY:   /* resuelto en Use_Skill */ break;
      case Target.ALL_ENEMIES: apply(Array.isArray(enemyOrArray) ? enemyOrArray : this.enemies.filter(e=>e.isAlive)); break;
      default:                 if (enemyOrArray?.isAlive) apply([enemyOrArray]); break;
    }
  }

  // ===== Normalización =====
  normalizeSkillFromJSON(skillKey, raw) {
    const desc   = (raw.description ?? raw.descripcion ?? '');
    const tgtRaw = (raw.target ?? raw.objetivo ?? '');
    const target = this.mapObjetivoToEnum(tgtRaw, desc, skillKey);
    const tipo = (raw.damage && raw.damage > 0) ? 'dmg' : 'effect';
    return {
      key: skillKey,
      tipo,
      power: raw.damage ?? 0,
      target,
      costSP: (raw.spCost ?? raw.coste ?? 0),
      effect: (raw.effect ?? raw.efecto ?? null),
      effectDuration: (raw.effectDuration ?? raw['duraciónEfecto'] ?? 0),
      name: (raw.name ?? raw.nombre ?? skillKey),
      description: desc
    };
  }

  // objeto inline procedente de UI/equipo (formato parecido a JSON)
  normalizeSkillFromObject(obj) {
    const target = this.mapObjetivoToEnum(obj.target, obj.description || obj.descripcion, obj.key || obj.name);
    const tipo = (obj.damage && obj.damage > 0) ? 'dmg' : 'effect';
    return {
      key: obj.key || obj.name || 'SKILL_OBJ',
      tipo,
      power: obj.damage ?? 0,
      target,
      costSP: obj.spCost ?? obj.coste ?? 0,
      effect: obj.effect ?? obj.efecto ?? null,
      effectDuration: obj.effectDuration ?? obj['duraciónEfecto'] ?? 0,
      name: obj.name || obj.nombre || 'Skill',
      description: obj.description || obj.descripcion || ''
    };
  }

  mapObjetivoToEnum(objetivoStr, description, skillKey) {
    const s = (objetivoStr || '').toUpperCase();

    // enums.json ⇒ ["SELF","ENEMY","RNDENEMY","ALLENEMIES"]
    if (s === 'SELF')       return Target.SELF;
    if (s === 'ENEMY')      return Target.ENEMY;
    if (s === 'RNDENEMY')   return Target.RND_ENEMY;    // ← importante
    if (s === 'ALLENEMIES') return Target.ALL_ENEMIES;  // ← importante

    // tolerancia a variantes antiguas
    if (s === 'RND_ENEMY' || s === 'RANDOM_ENEMY') return Target.RND_ENEMY;
    if (s === 'ALL' || s === 'ALL_ENEMIES')        return Target.ALL_ENEMIES;

    // heurística por descripción (por si algún diseño dice “todos”)
    if (description && /todos|all/i.test(description)) return Target.ALL_ENEMIES;

    return Target.ENEMY;
  }


  // ===== Turno enemigos (placeholder L→R) =====
  startEnemyTurns() {
    const step = (i=0) => {
      while (i < this.enemies.length && !this.enemies[i].isAlive) i++;
      if (i >= this.enemies.length) {
        this.actionsLeft = 2;
        this.prepareEnemyIntentions();
        // reactivar UI al volver el turno del jugador
        this.scene.events.emit("select_skill");
        return;
      }
      const enemy = this.enemies[i];
      // acción mínima: daño fijo 5 al jugador
      this.damagePlayer(5);
      this.scene.time.delayedCall(200, () => {
        this.checkEndOfCombat();
        if (!this.ended) step(i+1);
      });
    };
    step(0);
  }

  // ===== Utilidades =====
  prepareEnemyIntentions() {
    // simple: todos “atk” si vivos
    this.enemies.forEach(e => e.setIntention(e.isAlive ? 'espada' : 'neutro'));
  }

  damagePlayer(amount) {
    const pd = this.player.playerData;
    pd.HP = Math.max(0, (pd.HP ?? 50) - Math.max(0, Math.floor(amount)));
    if (pd.HP <= 0) this.finishCombat('lose');
  }

  checkEndOfCombat() {
    if (!this.enemies.some(e => e.isAlive)) this.finishCombat('win');
  }

  finishCombat(result) {
    if (this.ended) return;
    this.ended = true;
    this.scene.events.emit('combat_ended', { result });
  }


  getAliveEnemies() { return this.enemies.filter(e => e.isAlive); }

  getRandomAliveEnemy() {
    const arr = this.getAliveEnemies();
    return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
  }

}