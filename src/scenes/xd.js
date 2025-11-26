


export default class xd extends Phaser.Scene {

    constructor() {
        super({ key: 'xd' })
    }


    init() {
        console.log("init1")
        this.jsonEventos = this.cache.json.get('eventos');
        console.log("init2")
    }
    create() {

        console.log(1, this.jsonEventos)
        evento = this.generateEvent("PUEBLO_MEDIANO");
        


    }

    
}

class EventParser {
    constructor(jsonEventos) {
        this.jsonEventos = jsonEventos;
        /**Guarda conversiones parámetroJson a atributo del PlayerData*/
        this.rewardsJsonToAttribute =
        {
            "dinero":"dinero",
            "HP": "HP",
            "SP": "SP",
            "hambre": "hambre",
            "equipamiento": "equipamiento",
            "habilidades": "habilidades",
            "items": "items",
            "efectos":"efectos"

        }


    }


    generateEvent(eventKey) {

        this.eventoJson = this.jsonEventos[eventKey];
        this.params = {};
        
        for (const par_nombre in this.eventoJson["params"]) {

            this.params[par_nombre] = this.GetJsonParamValue(this.eventoJson["params"][par_nombre]);
            console.log(this.eventoJson["params"][par_nombre]);

        }

        let this.namedEventFragmentsArray = {}

        
        this.GenerateNamedEventFragment(this.eventoJson["eventFragments"][0], this.params, this.namedEventFragmentsArray)
        

        console.log(this.params);

        return event;
    }

    /**Setea el valor del objeto "param" al parseo de paramValue según la info del json de eventos.
     * @param {any} paramValue //valor en principio del parámetro del json
     */
    GetJsonParamValue(paramValue) {


        if (Array.isArray(paramValue)) {
            paramValue = paramValue[Phaser.Math.RND.between(0, paramValue.length - 1)];
        }

        //si el valor es el valor de un parámetro global:
        if (paramValue[0] == '_') {
            const infoGlobalParam = this.jsonEventos["globalParams"][paramValue.substring(1)];
            if (Array.isArray(infoGlobalParam)) {
                return infoGlobalParam[Phaser.Math.RND.between(0, paramValue.length - 1)];
            }
            else { return infoGlobalParam; }
        }
        else { return paramValue; }


    }

    /**
     * @param {object} namedEventFragmentsArray Array con todos los fragmentos de evento para 
     * @param {object} params guarda los parámetros del evento
     * @param {object} namedEventFragment objeto que guarda la info del subevento a parsear del json.
     * @returns {SubStateNode}
     */
    GenerateNamedEventFragment(namedEventFragment, params, namedEventFragmentsArray) {
        

        for(const eventFragment in namedEventFragment)




        return
    }

    GenerateSingleEventFragment() {

    }
}