import SubStateNode from "../SubStateNode.js"


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
            "dinero": "dinero",
            "HP": "HP",
            "SP": "SP",
            "hambre": "hambre",
            "equipamiento": "equipamiento",
            "habilidades": "habilidades",
            "items": "items",
            "efectos": "efectos"

        }


    }


    generateEvent(eventKey) {

        this.evento_Json = this.jsonEventos[eventKey];


        /**@type {Array} abreviatura de evento_Json["eventFragments"]*/
        this.eventFragments_Json = evento_Json["eventFragments"];

        //por motivos de eficiencia, se tiene una tabla de equivalencias (map);  "tag": posición en event_fragments_Json.
        console.log("Tags:\n");
        this.tags = {}
        for (let i = 0; i < this.eventFragments_Json.length; i++) {
            if (!!this.eventFragments_Json[i].tag) { this.tags[this.eventFragments_Json[i].tag] = i }
        }

        this.params = {};

        console.log("Params:\n");
        for (const par_nombre in this.evento_Json["params"]) {
            this.params[par_nombre] = this.GetJsonParamValue(this.evento_Json["params"][par_nombre]);
            console.log(this.evento_Json["params"][par_nombre]);
        }

        this.taggedEventFragmentsArray = {}


        let event = this.GenerateEventFragments(this.eventFragments_Json[0])


        console.log(this.params);

        return event;
    }



    GenerateSingleEventFragment(index) {
        /** abreviatura de this.eventFragments_Json[index] */
        const thisFragment_json = this.eventFragments_Json[index];
        /**Expresión regular usada para parsear los params del json que son palabras que empiezan por "_" */
        let expReg = new RegExp("_\\w*", "g");

        /**@type {SubStateNode} */
        let eventFragmentNode = new SubStateNode();

        //si no soy, al mapa
        if (thisFragment_json === undefined) {
            return null;
        }
        //si tengo tag
        if (thisFragment_json.tag !== undefined) {
            //si ya se ha creado el nodo con esa tag antes, la tag y el nodo están en taggedEventFragmentsArray.
            if (this.taggedEventFragmentsArray.hasOwnProperty(thisFragment_json.tag)) {
                return this.taggedEventFragmentsArray[thisFragment_json.tag];
            }
            //sino, lo añado al array.
            else {
                this.taggedEventFragmentsArray[thisFragment_json.tag] = eventFragmentNode;
            }



        }

        //generar/dar valores al fragmento de evento
        switch (thisFragment_json.type) {
            case "dialogue": {
                eventFragmentNode.tipo = "dialogue";
                eventFragmentNode.texto = this.ParseStringWithParams(thisFragment_json.text);

                //si hay múltiples opciones custom
                if (!!thisFragment_json.options) {
                    for (let i = 0; i < thisFragment_json.options.length; i++) {

                        eventFragmentNode.opciones[i].texto = this.ParseStringWithParams(thisFragment_json.options[i].text);

                        const jumpTag = thisFragment_json.options[i].j;

                        //Saltar al mapa
                        if (jumpTag === null) {
                            eventFragmentNode.opciones[i].salto = null;
                        }
                        //saltar al fragmento que está directamente a continuación de este en el json.
                        else if (jumpTag === undefined) {
                            const indexSalto = ++index;
                            eventFragmentNode.opciones[i].salto = this.GenerateSingleEventFragment(indexSalto)
                        }

                    }

                }
                //si es un continue, salta siempre a el fragmento en la siguiente pos del json. 
                //Si no quedan fragmentos a continuación, sale al mapa.
                else {
                    //si el texto del continue es custom:
                    if (!!thisFragment_json.continue) {
                        eventFragmentNode.opciones[0].texto = this.ParseStringWithParams(thisFragment_json.continue);
                    }
                    else {
                        eventFragmentNode.opciones[0].texto = "Continue";
                    }

                    eventFragmentNode.opciones[0].salto = this.GenerateSingleEventFragment(++index)

                }

                break;
            }
            case "combat":
            {
                    eventFragmentNode.tipo = "combat";
                    eventFragmentNode.combate = thisFragment_json.combat;
                    eventFragmentNode.opciones[0].salto = new SubStateNode("dialigue",undefined,"Has ganado")

                break;
            }
            default: break;
        }

        return eventFragmentNode;
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
     * @param {string} string
     * @param {RegExp} expReg
     */
    ParseStringWithParams(string, expReg) {

        for (let parameter of string.match(expReg)) {
            //si es un objeto => es algo de tipo recompensa (un objeto con... explicado en FormatoJsonEventos)
            if (typeof (this.params[parameter.substring(1)]) === object) {
                string = string.replace(parameter, "ESTO ES UNA RECOMPENSA")
            }
            string = string.replace(parameter, this.params[parameter.substring(1)])
        }
        return string;
    }

    ParseRewards
}