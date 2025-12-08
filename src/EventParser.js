import SubStateNode from "./SubStateNode.js"

export default class EventParser {
    constructor(jsonEventos, jsonHabilidades, jsonEquipamiento, jsonItems, jsonEfectos) {
        this.jsonEventos = jsonEventos;
        this.jsonItems = jsonItems;
        this.jsonHabilidades = jsonHabilidades;
        this.jsonEquipamiento = jsonEquipamiento;
        this.jsonEfectos = jsonEfectos;

        if (!jsonEventos || !jsonItems || !jsonHabilidades || !jsonEquipamiento || !jsonEfectos) { throw "EventParser no est� inicializado correctamente" }

        /**Guarda conversiones par�metroJson a atributo de la implementaci�n interna/playerData
         * "paramJson":"attributePlayerData"
         */
        this.rewardsJsonToAttribute =
        {
            "dinero": "dinero",
            "pago": "pago",
            "HP": "HP",
            "SP": "SP",
            "hambre": "hambre",
            "equipamiento": "equipamiento",
            "habilidades": "habilidades",
            "items": "items",
            "efectos": "efectos",

            "dificultadGlobal": "dificultadGlobal",
            "dificultadCercano": "dificultadCercano",
            "dificultadRadio": "dificultadRadio",

            "despertarGlobal": "despertarGlobal",
            "despertarCercano": "despertarCercano",
            "despertarRadio": "despertarRadio",

            "despertarCercanoCrear": "despertarCercanoCrear",

        }
        this.MAX_OPTIONS = 3;

    }


    generateEvent(eventKey) {

        this.evento_Json = this.jsonEventos[eventKey];


        console.log("eventKey:", eventKey, "\nthis.jsonEventos[eventKey]", this.jsonEventos[eventKey])

        if (this.evento_Json == undefined) { throw "No hay un evento con el nombre: " + eventKey }

        /**@type {Array} abreviatura de evento_Json["eventFragments"]*/
        this.eventFragments_Json = this.evento_Json["eventFragments"];

        /** por motivos de eficiencia, se tiene una tabla de equivalencias (map);  "tag": posici�n en event_fragments_Json. */
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

        /**Expresi�n regular usada para parsear los params del json que son palabras que empiezan por "_" */
        let expReg = new RegExp("_\\w*", "g");

        /**@type {SubStateNode} */
        let eventFragmentNode = new SubStateNode();



        //si no soy, al mapa
        if (thisFragment_json === undefined) {
            return null;
        }
        //si tengo tag
        if (thisFragment_json.tag !== undefined) {
            //si ya se ha creado el nodo con esa tag antes, la tag y el nodo est�n en taggedEventFragmentsArray.
            if (this.taggedEventFragmentsArray.hasOwnProperty(thisFragment_json.tag)) {
                return this.taggedEventFragmentsArray[thisFragment_json.tag];
            }
            //sino, lo a�ado al array.
            else {
                this.taggedEventFragmentsArray[thisFragment_json.tag] = eventFragmentNode;
            }



        }

        //generar/dar valores al fragmento de evento
        switch (thisFragment_json.type) {
            case "dialogue": {
                eventFragmentNode.tipo = "dialogue";
                eventFragmentNode.texto = this.ParseStringWithParams(thisFragment_json.text, expReg);

                //si hay opciones custom
                if (thisFragment_json.options || thisFragment_json.permanentOptions) {

                    let i = 0;
                    let j = 0;

                    //si existen opciones permanentes
                    if (thisFragment_json.permanentOptions) {
                        while (i < this.MAX_OPTIONS && (j < thisFragment_json.permanentOptions.length)) {

                            //en eventFragmentNode.opciones[i] hay un objeto
                            eventFragmentNode.opciones[i] = {};
                            this.SetFragmentOption(eventFragmentNode.opciones[i], thisFragment_json.permanentOptions[j], expReg, index)
                            i++;
                            j++;

                        }
                    }

                    //si existen opciones random
                    if (thisFragment_json.options) {
                        //genero un array ordenado de enteros que representan cada opci�n y luego lo desordeno para generar opciones random.
                        let array = [];

                        for (let n = 0; n < thisFragment_json.options.length; n++) {
                            array[n] = n;
                        }
                        for (let n = 0; n < 20; n++) {
                            let o1 = Phaser.Math.Between(0, array.length - 1);
                            let o2 = Phaser.Math.Between(0, array.length - 1);

                            const temp = array[o1];
                            array[o1] = array[o2];
                            array[o2] = temp;

                        }

                        console.log("Hay optionsAmmount:", (!!thisFragment_json.optionsAmmount))
                        const optionsAmmount = (!!thisFragment_json.optionsAmmount) ? thisFragment_json.optionsAmmount : thisFragment_json.options.length
                        j = 0;
                        while (i < this.MAX_OPTIONS && j < thisFragment_json.options.length && j < optionsAmmount) {
                            eventFragmentNode.opciones[i] = {};
                            this.SetFragmentOption(eventFragmentNode.opciones[i], thisFragment_json.options[array[j]], expReg, index)
                            i++;
                            j++;
                        }
                    }

                }
                //si es un continue, salta siempre a el fragmento en la siguiente pos del json. 
                //Si no quedan fragmentos a continuaci�n, sale al mapa.
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

                if (thisFragment_json.rewards) {
                    eventFragmentNode.consecuencias = {}
                    switch (typeof thisFragment_json.rewards) {
                        //si es un string, se refiere al par�metro con ese nombre
                        case "string":
                            {
                                console.log(thisFragment_json, " params:", this.params, "reward: ", thisFragment_json.rewards)

                                for (const [key, value] of Object.entries(this.params[thisFragment_json.rewards])) {
                                    eventFragmentNode.consecuencias[this.rewardsJsonToAttribute[key]] = value;
                                }
                                break;
                            }
                        //si es un objeto, es un literal
                        case "object":
                            {
                                console.log(thisFragment_json, " params:", this.params, "reward: ", thisFragment_json.rewards)
                                for (const [key, value] of Object.entries(thisFragment_json.rewards)) {
                                    eventFragmentNode.consecuencias[this.rewardsJsonToAttribute[key]] = value;
                                }
                                break;
                            }
                    }
                }

                //si el evento tiene un pago
                if (eventFragmentNode.consecuencias.hasOwnProperty("pago")) {

                    //genera el fragment oal que se va si no dinero suficiente
                    eventFragmentNode.nodoNoPay = new SubStateNode("dialogue", null, "Cuando miras tu bolsa, te das cuenta de que no tienes dinero suficiente.")

                    //si hay un noPayFragment al que se salta, se salta a ese, si es null o undefined se vuelve al anterior.
                    if (thisFragment_json.noPayFragment) {
                        eventFragmentNode.nodoNoPay.opciones = [{
                            texto: "\"No tengo dinero suficiente\"",
                            j: this.GenerateEventFragment(this.tags[thisFragment_json.noPayFragment])
                        }]
                    }
                    else {
                        eventFragmentNode.nodoNoPay.opciones = [{ texto: "\"No tengo dinero suficiente\"", j: eventFragmentNode }]
                    }

                }

                break;
            }
            case "combat":
                {
                    eventFragmentNode.tipo = "combat";
                    eventFragmentNode.combate = thisFragment_json.combat; //cuidado, aquí se copia una referencia creo

                    if (thisFragment_json.flee) {
                        const jumpTag = thisFragment_json.flee;
                        //Saltar al mapa
                        if (jumpTag === "null" || jumpTag === null) {
                            eventFragmentNode.nodoHuida = null;
                        }
                        //saltar al fragmento que est� directamente a continuaci�n de este en el json.
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
                            console.log("la tag llamada", jumpTag, " no existe. (se queda como null de momento)");
                            eventFragmentNode.nodoHuida = null;
                        }
                    }

                    const combatRewards_json = thisFragment_json.combat.rewards;
                    let consecuencias;
                    if (combatRewards_json) {
                        consecuencias = {}

                        switch (typeof combatRewards_json) {
                            //si es un string, se refiere al par�metro con ese nombre
                            case "string":
                                {
                                    console.log(thisFragment_json, " params:", this.params, "reward: ", combatRewards_json)
                                    for (const [key, value] of Object.entries(this.params[combatRewards_json])) {
                                        consecuencias[this.rewardsJsonToAttribute[key]] = value;
                                    }
                                    break;
                                }
                            //si es un objeto, es un literal
                            case "object":
                                {
                                    console.log(thisFragment_json, " params:", this.params, "reward: ", combatRewards_json)
                                    for (const [key, value] of Object.entries(combatRewards_json)) {
                                        consecuencias[this.rewardsJsonToAttribute[key]] = value;
                                    }
                                    break;
                                }
                        }
                    }

                    //generar nodo de di�logo al que se va al ganar
                    eventFragmentNode.opciones[0].salto =
                        new SubStateNode("dialigue", undefined, "Has ganado el combate. \nRecompensas:"+this.WriteRewards(consecuencias),
                            [{ texto: "Continuar", salto: this.GenerateEventFragment(++index) }],
                            consecuencias, undefined);

                    break;
                }
            default: break;
        }

        return eventFragmentNode;
    }

    SetFragmentOption(fragmentOption, jsonOption, expReg, index) {
        //seteo su texto
        fragmentOption.texto = this.ParseStringWithParams(jsonOption.text, expReg);

        //seteo su salto:
        const jumpTag = jsonOption.j;

        //Saltar al mapa
        if (jumpTag === "null" || jumpTag === null) {
            fragmentOption.salto = null;
        }
        //saltar al fragmento que est� directamente a continuaci�n de este en el json.
        else if (jumpTag === undefined || jumpTag === "undefined") {
            const indexSalto = ++index;
            fragmentOption.salto = this.GenerateEventFragment(indexSalto)
        }
        //saltar a la tag tal si existe
        else if (this.tags.hasOwnProperty(jumpTag)) {
            fragmentOption.salto = this.GenerateEventFragment(this.tags[jumpTag])
        }
        //si la tag con este nombre no existe
        else {
            console.log("La tag llamada ", jumpTag, " no existe.");
            fragmentOption.salto = null;
        }
    }

    /**Setea el valor del objeto "param" al parseo de paramValue seg�n la info del json de eventos.
    * @param {any} paramValue //valor en principio del par�metro del json
    */
    GetJsonParamValue(paramValue) {


        if (Array.isArray(paramValue)) {
            paramValue = paramValue[Phaser.Math.RND.between(0, paramValue.length - 1)];
        }

        //si el valor es el valor de un par�metro global:
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



        //si no matchea con nada, devuelve null
        if (string.match(expReg) != null) {
            for (let parameter of string.match(expReg)) {


                //si es un objeto => es algo de tipo recompensa (un objeto con... explicado en FormatoJsonEventos)
                if (typeof (this.params[parameter.substring(1)]) === "object") {
                    console.log("reward:", this.params[parameter.substring(1)], "WrittenReward:", this.WriteRewards(this.params[parameter.substring(1)]))
                    string = string.replace(parameter, this.WriteRewards(this.params[parameter.substring(1)]))
                }
                else {
                    console.log("Written Reward:", this.params[parameter.substring(1)])
                    //console.log("Reemplazo " + parameter + " por ", this.params[parameter.substring(1)])
                    string = string.replace(parameter, this.params[parameter.substring(1)])
                }
            }
        }
        return string;
    }


    /**
     * 
     * @param {object} rewards
     */
    WriteRewards(rewards) {

        let returnString = "";
        let array = Object.entries(rewards);

        //console.log("WriteRewards() array:",array)
        //decidido seg�n representaci�n en el json
        for (let i = 0; i < array.length; i++) {
            const key = array[i][0]
            const value = array[i][1]

            //console.log(key, ":", value);
            if (i == array.length - 2) { returnString = returnString.slice(0, -2); returnString += "y " }
            switch (key) {
                case "dinero": { returnString += value + " de dinero, "; break; }
                case "pago": { returnString += "has pagado " + value + ", "; break; }
                case "HP": { returnString += (value > 0 ? "+" : "") + value + " de vida, "; break; }
                case "SP": { returnString += (value > 0 ? "+" : "") + value + " de sp, "; break; }
                case "hambre": { returnString += (value > 0 ? "+" : "") + value + " de hambre, "; break; }

                case "habilidades":
                    {

                        returnString += value.length > 1 ? "las habilidades " : "la habilidad ";
                        for (let j = 0; j < value.length; j++) {
                            console.log("habilidad:",value[j])
                            console.log(value[j]);
                            returnString += this.jsonHabilidades[value[j]].name + ", ";
                        }
                        break;

                    }
                case "items":
                    {

                        for (const item in value) {
                            returnString += this.jsonItems[item.item].name + " (x" + item.count + "), ";
                        }

                        break;

                    }
                case "efectos": {
                    returnString += value.length > 1 ? "los efectos de " : "el efecto de ";
                    for (const estado in value) {
                        returnString += this.jsonEfectos[estado.effect].name + ", ";

                        //falta incluir la duraci�n del efecto.
                    }
                }

                case "dificultadGlobal": { returnString += "se han aumentado en gran medida los esfuerzos del estado por capturate"; break; }

                case "dificultadCercano": { returnString += "el estado ha aumentado los esfuerzos de b�squeda desde un cuartel cercano, "; break; }
                case "dificultadRadio": { returnString += "el estado conoce la zona aproximada en la que te encuentras, "; break; }
                case "despertarGlobal": { returnString += "el estado est� llevando a cabo una persecuci�n a gran escala, "; break; }
                case "despertarCercano": { returnString += "los esfuerzos de b�squeda se est�n focalizando en un cuartel cercano, "; break; }
                case "despertarCercanoCrear": { returnString += "el estado ha establecido un cuartel en una ubicaci�n cercana, "; break; }

                case "despertarRadio": { returnString += "el estado conoce la zona aproximada en la que te encuentras, "; break; }

                default: throw "la key:" + key + " no existe en el objeto de rewards"
            }

        }
        //quitar el �ltimo ", "
        returnString = returnString.slice(0, -2);

        return returnString;

    }

}