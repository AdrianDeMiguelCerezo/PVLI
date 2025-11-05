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

    this.actionsLeft = 2;           // según GDD: 2 acciones jugador
    this.currentSkillKey = null;

    // UI events
    this.scene.events.on("use_skill", this.Use_Skill, this);
    this.scene.events.on("target_selected", this.Target_Selected, this);

    // telegrafía inicial simple
    this.prepareEnemyIntentions();
  }

  // ===== Input de UI =====
  Use_Skill(skillKey) {
    if (this.actionsLeft <= 0) return;
    this.currentSkillKey = skillKey;
    this.scene.events.emit("select_target", skillKey);
  }

  Target_Selected(enemy, skillKey) {
    if (this.currentSkillKey !== skillKey) return;

    this.resolvePlayerSkill(skillKey, enemy);

    this.currentSkillKey = null;
    this.actionsLeft--;
    this.scene.events.emit("target_selected"); // reactivar botones
    this.scene.RedrawEnemies?.();

    // ¿Fin de turno del jugador?
    if (this.actionsLeft <= 0) {
      this.startEnemyTurns();
    }
  }

  // ===== Resolución jugador =====
  resolvePlayerSkill(skillKey, enemyClicked) {
    const raw = this.scene.jsonHabilidades[skillKey];
    if (!raw) return;


    const skill = this.normalizeSkillFromJSON(skillKey, raw);
    const alive = this.enemies.filter(e => e.isAlive);

    const apply = (targets) => {
      if (!targets?.length) return;
      if (skill.tipo === 'dmg') {
        const power = skill.power ?? 5;
        targets.forEach(t => t.takeDamage(power));
      }
      // conectar aquí debuffs/buffs/curas con StatusEffect
    };

    switch (skill.target) {
      case Target.SELF:        /* curas/buffs a jugador */ break;
      case Target.ENEMY:       if (enemyClicked?.isAlive) apply([enemyClicked]); break;
      case Target.RND_ENEMY:   if (alive.length) apply([alive[Math.floor(Math.random()*alive.length)]]); break;
      case Target.ALL_ENEMIES: apply(alive); break;
      default:                 if (enemyClicked?.isAlive) apply([enemyClicked]); break;
    }

    this.checkEndOfCombat();
  }

  // ===== Helpers de normalización =====
normalizeSkillFromJSON(skillKey, raw) {
  // Mapea objetivo string → enum interno
  const target = this.mapObjetivoToEnum(raw.objetivo, raw.descripcion, skillKey);
  // Si damage > 0 lo tratamos como ataque
  const tipo = (raw.damage && raw.damage > 0) ? 'dmg' : 'effect';
  return {
    tipo,
    power: raw.damage ?? 0,
    target,
    costSP: raw.coste ?? 0,
  };
}

mapObjetivoToEnum(objetivoStr, descripcion, skillKey) {
  // Nuestro enum: 0 SELF, 1 ENEMY, 2 RND_ENEMY, 3 ALL_ENEMIES
  const map = { 'SELF':0, 'ENEMY':1, 'RND_ENEMY':2, 'RANDOM_ENEMY':2, 'ALL':3, 'ALL_ENEMIES':3 };
  let t = map[(objetivoStr||'').toUpperCase()] ?? 1;

  // Heurística útil: si en la descripción pone "todos", lo tratamos como AOE.
  if (descripcion && /todos/i.test(descripcion)) t = 3;

  // Caso particular: si queréis que una habilidad concreta sea AOE por diseño:
  if (skillKey === 'DISPARO_MULTIPLE') t = 3;

  return t;
}

  // ===== Turno enemigos (placeholder secuencial L→R) =====
  startEnemyTurns() {
    const step = (i=0) => {
      // saltar KO
      while (i < this.enemies.length && !this.enemies[i].isAlive) i++;
      if (i >= this.enemies.length) {
        // vuelve al jugador
        this.actionsLeft = 2;
        this.prepareEnemyIntentions();
        return;
      }
      const enemy = this.enemies[i];
      // acción mínima: daño fijo 5
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
}