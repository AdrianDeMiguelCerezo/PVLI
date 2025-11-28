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

        let eventParser = new EventParser(this.jsonEventos)
        console.log(this.jsonEventos)
        let evento = eventParser.generateEvent("EVENTO_TEST1");
        console.log(evento)


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
        console.log(this.jsonEventos)
        console.log(eventKey, '\n', this.jsonEventos[eventKey])

        /**@type {Array} abreviatura de evento_Json["eventFragments"]*/
        this.eventFragments_Json = this.evento_Json["eventFragments"];

        //por motivos de eficiencia, se tiene una tabla de equivalencias (map);  "tag": posición en event_fragments_Json.

        this.tags = {}
        for (let i = 0; i < this.eventFragments_Json.length; i++) {
            if (!!this.eventFragments_Json[i].tag) { this.tags[this.eventFragments_Json[i].tag] = i }
        }
        console.log("Tags: ", this.tags);

        this.params = {};


        for (const par_nombre in this.evento_Json["params"]) {
            this.params[par_nombre] = this.GetJsonParamValue(this.evento_Json["params"][par_nombre]);
            //console.log(this.evento_Json["params"][par_nombre]);
        }
        console.log("Params: ", this.params);

        this.taggedEventFragmentsArray = {}


        let event = this.GenerateEventFragment(0)




        return event;
    }



    GenerateEventFragment(index) {
        /** abreviatura de this.eventFragments_Json[index] */
        const thisFragment_json = this.eventFragments_Json[index];

        //console.log("yo json:", thisFragment_json)

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
                eventFragmentNode.texto = this.ParseStringWithParams(thisFragment_json.text, expReg);

                //si hay múltiples opciones custom
                if (!!thisFragment_json.options) {
                    for (let i = 0; i < thisFragment_json.options.length; i++) {

                        //en eventFragmentNode.opciones[i] hay un objeto
                        eventFragmentNode.opciones[i] = {};

                        //seteo su texto
                        eventFragmentNode.opciones[i].texto = this.ParseStringWithParams(thisFragment_json.options[i].text, expReg);

                        //seteo su salto:
                        const jumpTag = thisFragment_json.options[i].j;

                        //Saltar al mapa
                        if (jumpTag === "null" || jumpTag === null) {
                            eventFragmentNode.opciones[i].salto = null;
                        }
                        //saltar al fragmento que está directamente a continuación de este en el json.
                        else if (jumpTag === undefined || jumpTag === "undefined") {
                            const indexSalto = ++index;
                            eventFragmentNode.opciones[i].salto = this.GenerateEventFragment(indexSalto)
                        }
                        //saltar a la tag tal si existe
                        else if (this.tags.hasOwnProperty(jumpTag)) {
                            eventFragmentNode.opciones[i].salto = this.GenerateEventFragment(this.tags[jumpTag])
                        }
                        //si la tag con este nombre no existe
                        else {
                            console.log("la tag llamada ", jumpTag, " no existe.");
                            eventFragmentNode.opciones[i].salto = null;
                        }

                    }

                }
                //si es un continue, salta siempre a el fragmento en la siguiente pos del json. 
                //Si no quedan fragmentos a continuación, sale al mapa.
                else {
                    //en eventFragmentNode.options[0] hay un objeto
                    eventFragmentNode.opciones[0] = {};

                    //si el texto del continue es custom:
                    if (!!thisFragment_json.continue) {
                        eventFragmentNode.opciones[0].texto = this.ParseStringWithParams(thisFragment_json.continue, expReg);
                    }
                    else {
                        eventFragmentNode.opciones[0].texto = "Continue";
                    }

                    eventFragmentNode.opciones[0].salto = this.GenerateEventFragment(++index)

                }

                break;
            }
            case "combat":
                {
                    eventFragmentNode.tipo = "combat";
                    eventFragmentNode.combate = thisFragment_json.combat;

                    if (thisFragment_json.flee) {
                        const jumpTag = thisFragment_json.flee;
                        //Saltar al mapa
                        if (jumpTag === "null" || jumpTag === null ) {
                            eventFragmentNode.nodoHuida = null;
                        }
                        //saltar al fragmento que está directamente a continuación de este en el json.
                        else if (jumpTag === undefined || jumpTag === "undefined") {
                            const indexSalto = ++index;
                            eventFragmentNode.nodoHuida = this.GenerateEventFragment(indexSalto)
                        }
                        //saltar a la tag tal si existe
                        else if (this.tags.hasOwnProperty(jumpTag)) {
                            eventFragmentNode.nodoHuida = this.GenerateEventFragment(this.tags[jumpTag])
                        }
                        //si la tag con este nombre no existe
                        else {
                            console.log("la tag llamada", jumpTag, " no existe.");
                            eventFragmentNode.nodoHuida = null;
                        }
                    }

                    //generar nodo de diálogo al que se va al ganar
                    eventFragmentNode.opciones[0].salto =
                        new SubStateNode("dialigue", undefined, "Has ganadoel combate. Falta  decirte cuáles son las recompensas.",
                            [{ texto: "Continue", salto: this.GenerateEventFragment(++index) }],
                            thisFragment_json.rewards, undefined);

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

        //console.log("string: ", string, "matches: ", string.match(expReg))

        //si no matchea con nada, devuelve null
        if (string.match(expReg) != null) {
            for (let parameter of string.match(expReg)) {

                //si es un objeto => es algo de tipo recompensa (un objeto con... explicado en FormatoJsonEventos)
                if (typeof (this.params[parameter.substring(1)]) === "object") {
                    string = string.replace(parameter, "ESTO ES UNA RECOMPENSA")
                }
                //console.log("Reemplazo " + parameter + " por ", this.params[parameter.substring(1)])
                string = string.replace(parameter, this.params[parameter.substring(1)])
            }
        }
        return string;
    }


    /**
     * 
     * @param {object} rewards
     */
    WriteRewards(rewards) {
        const rewardsArray = Object.keys(rewards)
        let returnString = "";
        //for (let i = 0; i < rewardsArray.length - 1; i++) {
        //    returnString+= 
        //}
    }
}