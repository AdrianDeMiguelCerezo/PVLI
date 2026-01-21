import SubStateNode from "../SubStateNode.js"
import PlayerData from "../PlayerData.js"
import EventParser from "../EventParser.js"

//esta escena es xd. Hay pocas cosas más xd. Has vivido la experiencia xd. Este archivo ha cumplido su objetivo. Equis the.
export default class xd extends Phaser.Scene {

    constructor() {
        super({ key: 'xd' })
    }


    init() {
        console.log("init1")
        this.jsonEventos = this.cache.json.get('eventos');
        this.jsonHabilidades = this.cache.json.get('habilidades');
        this.jsonEquipamiento = this.cache.json.get('equipamiento');
        this.jsonItems = this.cache.json.get('items');
        this.jsonEfectos = this.cache.json.get('efectos');
        console.log("init2")
    }
    create() {

        let eventParser = new EventParser(this.jsonEventos, this.jsonHabilidades, this.jsonEquipamiento, this.jsonItems, this.jsonEfectos)
        console.log("jsonEventos:", this.jsonEventos)

        let evento = eventParser.generateEvent("FINAL");

        console.log("evento:", evento)

        this.scene.start("DialogueScene", {fragmentoEvento: evento, playerData: new PlayerData()})

    }


}

