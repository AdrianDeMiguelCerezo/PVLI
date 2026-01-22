// combatManager.js
import Enemy from "./Enemy.js";

const Target = {
    SELF: 0,
    ENEMY: 1,
    RNDENEMY: 2,
    ALLENEMIES: 3
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

        const pd = this.player.playerData;

        // Lógica de muerte por hambre
        if (pd.hambre >= 100) {
            console.log("[CM] El jugador ha muerto de inanición.");
            this.finishCombat("lose");
            return;
        }

        // Gestión de estados de HAMBRE (1 y 2)
        const umbralHambre1 = 50;
        const umbralHambre2 = 80;

        // Helper para saber si ya tiene el efecto
        const tieneHambre1 = pd.efectos.some(e => e.key === "HAMBRE_1");
        const tieneHambre2 = pd.efectos.some(e => e.key === "HAMBRE_2");

        // Limpiar estados según el nivel actual
        if (pd.hambre >= umbralHambre2) {
            // Fase 2: 1 Acción, quita fase 1
            if (!tieneHambre2) this.addStatusToPlayer("HAMBRE_2", 999);
            if (tieneHambre1) this.removeStatusFromEntity(this.player, "HAMBRE_1");

            this.maxActionsPerTurn = 1;
            console.log("[CM] HAMBRE_2 activo: acciones reducidas a 1");
        } else if (pd.hambre >= umbralHambre1) {
            // Fase 1: stats bajos, quita fase 2 si la hubiera
            if (!tieneHambre1) this.addStatusToPlayer("HAMBRE_1", 999);
            if (tieneHambre2) this.removeStatusFromEntity(this.player, "HAMBRE_2");

            this.maxActionsPerTurn = 2; // Recupera acciones normales is baja de 80
            console.log("[CM] HAMBRE_1 activo");
        } else {
            // Sano: quitar ambos
            if (tieneHambre1) this.removeStatusFromEntity(this.player, "HAMBRE_1");
            if (tieneHambre2) this.removeStatusFromEntity(this.player, "HAMBRE_2");
            this.maxActionsPerTurn = 2;
        }

        // Gestión de parálisis (anula el turno)
        const estaParalizado = pd.efectos.some(e => e.key === "PARALIZADO");
        if (estaParalizado) {
            console.log("[CM] Jugador PARALIZADO. Pierde el turno.");
            this.actionsLeft = 0;
        } else {
            // Si no está paralizado, asignamos las acciones calculadas (1 o 2)
            this.actionsLeft = this.maxActionsPerTurn;
        }

        // Aplicar efectos (reduce duraciones, aplica dots)
        this.applyStatusEffectsAtTurnStart();

        // UI y telegrafiado
        this.prepareEnemyIntentions();
        this.scene.RedrawEnemies?.();
        this.scene.events.emit("actions_updated", this.actionsLeft, this.maxActionsPerTurn);

        // Decidir flujo
        if (this.actionsLeft <= 0) {
            // Si parálisis o hambre extrema nos dejó a 0, pasamos turno automáticamente
            // Pequeño delay para que se note
            this.scene.time.delayedCall(1000, () => {
                this.startEnemyTurns();
            });
        } else {
            // Habilitiar input
            this.scene.events.emit("select_skill");
        }

        this.turn++;
    }

    /**
     * Calcula la defensa total del jugador (equipamiento + modificadores de estado)
     */
    getPlayerDefense() {
        const pd = this.player.playerData;
        // Accedemos al JSON de equipamiento cargado en la escena
        const equipJson = this.scene.jsonEquipamiento;
        const efectosJson = this.scene.jsonEfectos;

        let totalDef = 0;

        // Defensa base por equipamiento (Torso + Pantalones)
        if (pd.torso && equipJson[pd.torso]) {
            totalDef += equipJson[pd.torso].defense || 0;
        }
        if (pd.pantalones && equipJson[pd.pantalones]) {
            totalDef += equipJson[pd.pantalones].defense || 0;
        }

        // Modificadores por efectos de estado (Ej: HAMBRIENTO_1 baja defensa %)
        let percentMod = 0;
        if (pd.efectos) {
            pd.efectos.forEach(eff => {
                const def = efectosJson[eff.key];
                if (def && def.diffDefensePercent) {
                    percentMod += def.diffDefensePercent;
                    console.log(`[CM] Defensa: ` + def.diffDefensePercent);
                }
            });
        }

        // Aplicar porcentaje (Ej: Si percentMod es -30, multiplicamos por 0.7)
        // Math.max(0, ...) evita defensa negativa si los debuffs son muy fuertes
        totalDef = Math.max(0, Math.floor(totalDef * (1 + percentMod / 100)));

        return totalDef;
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
        if(this.actionsLeft < actionsCost){
            console.log("[CM] No tienes suficientes acciones, no hace nada");
            return;
        }
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

            case Target.RNDENEMY: {
                const rnd = this.getRandomAliveEnemy();
                if (rnd) {
                    this.resolvePlayerSkill(skill, rnd);
                    this.spendResourcesForSkill(skill);
                } else {
                    console.log("[CM] No hay enemigos vivos para RNDENEMY");
                }
                this.scene.events.emit("target_selected");
                return this.afterPlayerAction(actionsCost);
            }

            case Target.ALLENEMIES: {
                const vivos = this.getAliveEnemies();
                if (vivos.length) {
                    this.resolvePlayerSkill(skill, vivos);
                    this.spendResourcesForSkill(skill);
                } else {
                    console.log("[CM] No hay enemigos vivos para ALLENEMIES");
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

            if (skill.cureEffect) {
                arr.forEach(t => this.removeStatusFromEntity(t, skill.cureEffect));
            }
        };

        switch (skill.target) {
            case Target.SELF:
                // Aplicar efectos normales (HP, SP, Buffs...)
                this.applySecondaryEffectsToPlayer(skill);

                // Aplicar cura (antídoto)
                if (skill.cureEffect) {
                    console.log(`[CM] Aplicando cura a JUGADOR: ${skill.cureEffect}`);
                    this.removeStatusFromEntity(this.player, skill.cureEffect);
                }
                break;

            case Target.ENEMY:
            case Target.RNDENEMY:
                if (enemyOrArray && enemyOrArray.isAlive) {
                    applyAll(enemyOrArray);
                }
                break;

            case Target.ALLENEMIES:
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
        let flatDamage = 0; // Acumulador para daño directo

        for (const eff of pd.efectos) {
            const def = efectosDef[eff.key];
            if (!def) continue;

            // Acumular porcentajes
            if (def.diffDmgPercent) {
                percent += def.diffDmgPercent;
            }

            // Acumular daño plano directo
            if (def.diffDmg) {
                flatDamage += def.diffDmg;
            }
        }

        // Fórmula: (base + plano) * porcentaje
        // Primero se aplica el modificador plano
        let final = baseDamage + flatDamage;

        // Luego aplicamos el porcentaje
        final = Math.round(final * (1 + percent / 100));

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

                
            if (duration == 0) {
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
            else if(duration < 0){
                this.addStatusToPlayer(key, duration);
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
            if (duration == 0) {
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

        console.log( pd.efectos);
        let efectoPoseido = false;
        let i = 0;
        while (i < pd.efectosTam && !efectoPoseido) {
            efectoPoseido = pd.efectos[i].key == key;
            i++;
        }
        if (efectoPoseido) {
            i--;
            pd.efectos[i].duration += duration;
            if (pd.efectos[i].duration > 2 * duration) { pd.efectos[i].duration = 2 * duration }
        }
        else{ pd.efectos.push({ key, duration }); }

        pd.efectosTam = pd.efectos.length;
    }

    /**
     * Elimina un efecto de estado de una entidad (Player o Enemy) por su clave
     * @param {*} entity 
     * @param {*} keyToRemove 
     */
    removeStatusFromEntity(entity, keyToRemove) {
        // Detectar si es Player o Enemy y localizar su array de efectos
        let dataCtx = null;

        // Si la entidad tiene 'playerData', es el Player
        if (entity.playerData) {
            dataCtx = entity.playerData;
        } else {
            // Si no, asumimmos que es un Enemy
            dataCtx = entity;
        }

        if (!dataCtx || !Array.isArray(dataCtx.efectos)) return;

        // Comprobar si tiene el efecto
        const antes = dataCtx.efectos.length;
        dataCtx.efectos = dataCtx.efectos.filter(e => e.key !== keyToRemove);
        dataCtx.efectosTam = dataCtx.efectos.length;

        if (dataCtx.efectos.length < antes) {
            console.log(`[CM] Efecto ${keyToRemove} eliminado de ${dataCtx.name || "entidad"}`);
        }

        // Actualizar la UI inmediantamente
        this.scene.RedrawEnemies?.();
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
                // Pasamos a 'true' para ignorar defensa
                this.damagePlayer(-delta, true);
            } else {
                pd.HP = clamp((pd.HP ?? maxHp) + delta, 0, maxHp);
            }
        }

        if (Number.isFinite(def.diffHealth)) {
            if (def.diffHealth < 0) {
                // Pasamos a 'true' para ignorar defensa
                this.damagePlayer(-def.diffHealth, true);
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

                if(duration > 0 && this.turn > 0){
                    duration--;
                }
                if (duration > 0 || duration < 0) {
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

        const cureEffect = obj.cureEffect ?? obj.curarEfecto ?? null;

        return {
            key: keyHint,
            name: obj.name ?? obj.nombre ?? keyHint,
            description: desc,

            tipo,
            power: damage,
            target,
            actionCost,
            actions: actionCost,

            cureEffect: cureEffect,

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

        if (s !== "") { return Target[s] }

        return Target.ENEMY;
    }

    // =================== Turno enemigos ===================

    startEnemyTurns() {
        console.log("[CM] Empieza turno de enemigos");

        const scene = this.scene;
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

            const enemy = this.enemies[index];

            // Comprobamos si el enemigo actual tiene el efecto "PARALIZADO"
            const isParalyzed = enemy.efectos && enemy.efectos.some(e => e.key === "PARALIZADO");

            if (isParalyzed) {
                console.log(`[CM] Enemigo ${enemy.key || index} está PARALIZADO. Salta turno.`);

                // Hacemos una pequeña espera para que el jugador note que el enemigo ha perdido el turno
                scene.time.delayedCall(500, () => {
                    // Pasamos al siguiente enemigo sin atacar
                    doAttack(index + 1);
                });
                return;
            }

            // Lógica de ataque normal (si no está paralizado)
            const damage = 20; // TODO: sacar de enemigos.json

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
            e.chooseIntention()
        );
    }

    damagePlayer(amount, ignoreDefense = false) {
        const pd = this.player?.playerData;
        if (!pd) return;

        // Calculamos daño bruto
        let incomingDmg = Math.max(0, Math.floor(amount));

        // Solo aplicamos la defensa SI NO es daño verdadero (ignoreDefense es false)
        if (incomingDmg > 0 && !ignoreDefense) {
            const defense = this.getPlayerDefense();
            // Fórmula simple: daño - defensa (mínimo 1 de daño siempre que golpeen)
            incomingDmg = Math.max(0, incomingDmg - defense);

            console.log(`[CM] Daño recibido: ${amount} | Defensa: ${defense} | Daño final: ${incomingDmg}`);
        } else if (ignoreDefense) {
            console.log(`[CM] Daño VERDADERO recibido (ignora defensa) : ${incomingDmg}`);
        }

        const currentHp = pd.HP ?? pd.Hp ?? pd.hp ?? 50;
        const newHp = Math.max(0, currentHp - incomingDmg);

        // Unificar propiedades de HP por si acaso
        pd.HP = newHp;
        pd.Hp = newHp;
        pd.hp = newHp;

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