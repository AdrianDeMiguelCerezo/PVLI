import PlayerData from '../PlayerData.js'

export default class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BootScene' })
    }

    preload() {
        this.load.image('node', 'assets/Node.png');
        this.load.image('map', 'assets/MapTemplate.png');
        this.load.image('fondo', 'assets/fondoPlaceholderDialogos.png');
        this.load.image('malo', 'assets/malo.png');
        this.load.image('player', 'assets/cowboy.png');
        this.load.image('cowboy','assets/cowboy.png');
        this.load.image('swimsuit','assets/swimsuit.png');
        this.load.image('halloween','assets/halloween.png');
        this.load.image('christmas','assets/christmas.png');
        this.load.image('butler','assets/butler.png');
        this.load.image('school','assets/school.png');
        this.load.image('cat','assets/cat.png');

        //carga img intents
        this.load.image('ATTACK','assets/Espada.png');
        this.load.image('SPECIAL_ATTACK','assets/DobleEspada.png');
        this.load.image('BUFF','assets/Bufo.png');
        this.load.image('DEBUFF','assets/Debufo.png');
        this.load.image('NULL', 'assets/Neutro.png');

        //carga img statusEffects
        this.load.image('QUEMADO', 'assets/QUEMADO.png');
        this.load.image('ENVENENADO', 'assets/ENVENENADO.png');
        this.load.image('PARALIZADO', 'assets/PARALIZADO.png');
        this.load.image('ATT+', 'assets/ATT+.png');
        this.load.image('ATT++', 'assets/ATT++.png');
        this.load.image('ATT-', 'assets/ATT-.png');
        this.load.image('ATT--', 'assets/ATT--.png');
        this.load.image('DEF+', 'assets/DEF+.png');
        this.load.image('DEF++', 'assets/DEF++.png');
        this.load.image('DEF-', 'assets/DEF-.png');
        this.load.image('DEF--', 'assets/DEF--.png');
        this.load.image('HAMBRE_1', 'assets/HAMBRE_1.png');
        this.load.image('HAMBRE_2', 'assets/HAMBRE_2.png');

        //Enemigos
        this.load.image('BANDIDO_COMUN','assets/bandido_comun.png');
        this.load.image('BANDIDO_PIROMANO','assets/piromano.png');
        this.load.image('BANDIDO_MEDICO','assets/medico.png');
        this.load.image('BANDIDO_TANQUE','assets/tanque.png');
        this.load.image('TORRETA','assets/torreta.png');
        this.load.image('PERRO_RABIOSO','assets/perro.png');
        this.load.image('MUJER_DESCONFIADA','assets/mujer.png');
        this.load.image('SOLDADO_ESTADO','assets/soldado_estado.png');
        this.load.image('BANDIDO_BUFEADOR','assets/bufeador.png');
        this.load.image('BANDIDO_NERFEADOR','assets/debufeador.png');
        this.load.image('GRAN_BLOQUEO','assets/gran_bloqueo.png');






        //Carga .json
        this.load.json('habilidades', 'src/json/habilidades.json');
        this.load.json('enemigos', 'src/json/enemigos.json'); 
        this.load.json('equipamiento', 'src/json/equipamiento.json'); 
        this.load.json('efectos', 'src/json/efectos.json'); 
        this.load.json('items', 'src/json/items.json'); 
        this.load.json('dialogos', 'src/json/dialogos.json');
        this.load.json('eventos', 'src/json/eventos.json');
    }
    create() {

        /*this.playerData = new PlayerData();
        this.uiButton(100, 400, "Go to Map", 'Map', this.playerData)
        this.uiButton(100, 300, "Go to DialogueScene", 'DialogueScene')
        this.uiButton(100, 200, "Go to BattleScene", 'BattleScene', ['BANDIDO_COMUN', 'BANDIDO_COMUN', 'BANDIDO_COMUN', 'BANDIDO_COMUN',])
        this.uiButton(100, 100, "Go to MenuTest", 'MenuTest', {playerData: this.playerData, oldScene: this.scene.key})
        this.uiButton(100, 500, "Go to xd", 'xd',)*/

        // --- PREPARACIÓN DEL JUGADOR DE PRUEBA (Veneno, Skin y Antídoto) ---
       /* const testPlayer = new PlayerData();
        testPlayer.HP = 80; // Vida un poco baja
        testPlayer.skinIndex = 6; // 0 = Cowboy, 6 = Cat, etc.
        
        // Inyectamos veneno para probar el daño verdadero y el antídoto
        testPlayer.efectos.push({ key: "ENVENENADO", duration: 99 }); 
        
        // Aseguramos antídoto
        if (!testPlayer.items.some(i => i.item === "ANTIDOTO")) {
            testPlayer.items.push({ item: "ANTIDOTO", count: 3 });
        }*/


        // --- BOTÓN 1: TEST COMBATE -> MAPA (Caso estándar) ---
        // Al ganar, debería llevarte a la escena 'Map' directamente.
        /*this.uiButton(400, 100, "TEST: Battle -> Map", 'BattleScene', {
            enemies: ['BANDIDO_COMUN'], // Un enemigo facilito
            playerData: testPlayer,
            winNode: null,  // null significa "volver al mapa"
            fleeNode: null
        });


        // --- BOTÓN 2: TEST COMBATE -> DIÁLOGO (Caso evento encadenado) ---
        // Al ganar, debería llevarte a una nueva escena de diálogo.
        
        // Creamos un "nodo falso" para simular el siguiente paso de la historia
        const nodoVictoria = {
            tipo: "dialogue",
            texto: "¡Has vencido al bandido! Encuentras una nota en su bolsillo...",
            opciones: [], // Aquí podrías poner opciones de salir
            consecuencias: {} // ej: { dinero: 50 }
        };

        this.uiButton(400, 200, "TEST: Battle -> Dialog", 'BattleScene', {
            enemies: ['BANDIDO_COMUN'],
            playerData: testPlayer,
            winNode: nodoVictoria, // Al ganar, pasamos este nodo
            fleeNode: null
        });*/


        this.scene.start('MainMenu');
    }
    
};