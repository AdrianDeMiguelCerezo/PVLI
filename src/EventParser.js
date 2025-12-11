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
        this.lastEventFragment = null;
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
            //console.log(par_nombre);
            this.params[par_nombre] = this.GetJsonParamValue(this.evento_Json["params"][par_nombre]);
            //console.log(this.evento_Json["params"][par_nombre]);
        }
        console.log("Params: ", this.params);

        this.taggedEventFragmentsArray = {}


        let event = this.GenerateEventFragment(0)




        return event;
    }



    GenerateEventFragment(index,callerEventFragment) {
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
                            this.SetFragmentOption(eventFragmentNode.opciones[i], thisFragment_json.permanentOptions[j], expReg, index,eventFragmentNode)
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

                        //console.log("Hay optionsAmmount:", (!!thisFragment_json.optionsAmmount))
                        const optionsAmmount = (!!thisFragment_json.optionsAmmount) ? thisFragment_json.optionsAmmount : thisFragment_json.options.length
                        j = 0;
                        while (i < this.MAX_OPTIONS && j < thisFragment_json.options.length && j < optionsAmmount) {
                            eventFragmentNode.opciones[i] = {};
                            this.SetFragmentOption(eventFragmentNode.opciones[i], thisFragment_json.options[array[j]], expReg, index,eventFragmentNode)
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

                    eventFragmentNode.opciones[0].salto = this.GenerateEventFragment(++index,eventFragmentNode)

                }

                if (thisFragment_json.rewards) {
                    eventFragmentNode.consecuencias = {}
                    switch (typeof thisFragment_json.rewards) {
                        //si es un string, se refiere al par�metro con ese nombre
                        case "string":
                            {
                                console.log(thisFragment_json, " params:", this.params, "rewards: ", thisFragment_json.rewards)

                                for (const [key, value] of Object.entries(this.params[thisFragment_json.rewards])) {
                                    eventFragmentNode.consecuencias[this.rewardsJsonToAttribute[key]] = value;
                                }
                                break;
                            }
                        //si es un objeto, es un literal
                        case "object":
                            {
                                //console.log(thisFragment_json, " params:", this.params, "rewards: ", thisFragment_json.rewards)
                                for (const [key, value] of Object.entries(thisFragment_json.rewards)) {
                                    eventFragmentNode.consecuencias[this.rewardsJsonToAttribute[key]] = value;
                                }
                                break;
                            }
                    }
                }


                //si el evento tiene un pago
                if (eventFragmentNode.consecuencias.hasOwnProperty("pago")) {

                    //si hay un noPayFragment al que se salta, se salta a ese, si es null o undefined se vuelve al anterior(que es quien ha llamado a que se genere este fragmento).
                    if (thisFragment_json.noPayFragment) {
                        eventFragmentNode.nodoNoPay = this.GenerateEventFragment(this.tags[thisFragment_json.noPayFragment],eventFragmentNode);
                    }
                    else {
                        if (!(thisFragment_json.tag === "undefined" || thisFragment_json.tag === undefined)) { console.warn("Los eventos de pago con mensaje de \"no hay dinero\" default (noPayFragment es undefined) con tag son exclusivos para un único fragmento de evento. Sino, generan comportamiento indefinido.") }
                        //genera el fragment oal que se va si no dinero suficiente
                        console.log("callerEventFragment:", callerEventFragment)
                        eventFragmentNode.nodoNoPay = new SubStateNode("dialogue", null, "Cuando miras tu bolsa, te das cuenta de que no tienes dinero suficiente.")
                        eventFragmentNode.nodoNoPay.opciones = [{ texto: "\"No tengo dinero suficiente\"", salto: callerEventFragment }]
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
                            eventFragmentNode.nodoHuida = this.GenerateEventFragment(indexSalto,eventFragmentNode)
                        }
                        //saltar a la tag tal si existe
                        else if (this.tags.hasOwnProperty(jumpTag)) {
                            eventFragmentNode.nodoHuida = this.GenerateEventFragment(this.tags[jumpTag],eventFragmentNode)
                        }
                        //si la tag con este nombre no existe
                        else {
                            console.warn("la tag llamada", jumpTag, " no existe. (se queda como null de momento). LLamada desde ", thisFragment_json);
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
                                    if (!this.params.hasOwnProperty(combatRewards_json)) { throw "La recompensa:" + combatRewards_json + "no existe en el array de parámetros.", this.params }
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
                    eventFragmentNode.opciones[0] = {}
                    //generar nodo de di�logo al que se va al ganar
                    eventFragmentNode.opciones[0].salto =
                        new SubStateNode("dialogue", undefined, "Has ganado el combate. \nRecompensas:" + this.WriteRewards(consecuencias),
                            [{ texto: "Continuar", salto: this.GenerateEventFragment(++index,eventFragmentNode) }],
                            consecuencias, undefined);

                    break;
                }
            case "fin": {

                eventFragmentNode.tipo = "fin";
                break;
            }
            default: break;
        }

        return eventFragmentNode;
    }

    SetFragmentOption(fragmentOption, jsonOption, expReg, index,eventFragmentNode) {
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
            fragmentOption.salto = this.GenerateEventFragment(indexSalto,eventFragmentNode)
        }
        //saltar a la tag tal si existe
        else if (this.tags.hasOwnProperty(jumpTag)) {
            fragmentOption.salto = this.GenerateEventFragment(this.tags[jumpTag],eventFragmentNode)
        }
        //si la tag con este nombre no existe
        else {
            console.warn("la tag llamada", jumpTag, " no existe. (se queda como null de momento). LLamada desde ", this.eventFragments_Json[index]);
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
        console.log(paramValue);
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


                //si tiene "__" delante y un objeto => Es una transacción.
                if (parameter[1] === '_' && typeof (this.params[parameter.substring(2)]) === "object") {
                    console.log("Pago. reward:", this.params[parameter.substring(2)], "WrittenReward:", this.WriteTransaction(this.params[parameter.substring(2)]))
                    string = string.replace(parameter, this.WriteRewards(this.params[parameter.substring(2)]))
                }
                //si es un objeto => es algo de tipo recompensa (un objeto con... explicado en FormatoJsonEventos)
                else if (typeof (this.params[parameter.substring(1)]) === "object") {
                    console.log("Normal. reward:", this.params[parameter.substring(1)], "WrittenReward:", this.WriteRewards(this.params[parameter.substring(1)]))
                    string = string.replace(parameter, this.WriteRewards(this.params[parameter.substring(1)]))
                }

                else {
                    {
                        console.log("Written Reward:", this.params[parameter.substring(1)])
                        //console.log("Reemplazo " + parameter + " por ", this.params[parameter.substring(1)])
                        string = string.replace(parameter, this.params[parameter.substring(1)])
                    }
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
                case "pago": { returnString += value + " de dinero, "; break; }
                case "HP": { returnString += (value > 0 ? "+" : "") + value + " de vida, "; break; }
                case "SP": { returnString += (value > 0 ? "+" : "") + value + " de sp, "; break; }
                case "hambre": { returnString += (value > 0 ? "+" : "") + value + " de hambre, "; break; }

                case "habilidades":
                    {

                        returnString += value.length > 1 ? "las habilidades " : "la habilidad ";
                        for (let j = 0; j < value.length; j++) {
                            //console.log("habilidad:",value[j])
                            returnString += this.jsonHabilidades[value[j]].name + ", ";
                        }
                        break;

                    }
                case "items":
                    {
                        //console.log("itemKeyValue:",value,"jsonItems:",this.jsonItems)
                        let itemCount = 0;
                        let secondaryReturnString = "";
                        for (const itemReward of value) {
                            secondaryReturnString += this.jsonItems[itemReward.item].name + " (x" + itemReward.count + "), ";
                            itemCount += itemReward.count;
                        }
                        let primaryReturnString = itemCount > 1 ? "+ los objetos " : "+ el objeto ";
                        returnString += primaryReturnString + secondaryReturnString
                        break;

                    }
                case "equipamiento":
                    {

                        returnString += value.length > 1 ? "+ los equipamientos " : "+ el equipamiento ";
                        for (let j = 0; j < value.length; j++) {
                            //console.log("equipamiento:",value[j])
                            returnString += this.jsonEquipamiento[value[j]].name + ", ";
                        }
                        break;

                    }
                case "efectos": {
                    returnString += value.length > 1 ? "+ los efectos de " : "+ el efecto de ";
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

    /**
     * 
     * @param {object} rewards
     */
    WriteTransaction(rewards) {

        let returnString = "";
        let primaryReturnString = "";
        let array = Object.entries(rewards);


        //decidido seg�n representaci�n en el json
        if (rewards.hasOwnProperty("pago")) {
            primaryReturnString += rewards["pago"] + "de dinero"
        }
        let hayRecompensa = false;
        for (let i = 0; i < array.length; i++) {
            const key = array[i][0]
            const value = array[i][1]

            //console.log(key, ":", value);
            if (i == array.length - 2) { returnString = returnString.slice(0, -2); returnString += "y " }
            switch (key) {
                case "equipamiento":
                    {

                        returnString += value.length > 1 ? "los equipamientos " : "el equipamiento ";
                        for (let j = 0; j < value.length; j++) {
                            //console.log("equipamiento:",value[j])
                            returnString += this.jsonEquipamiento[value[j]].name + ", ";
                        }

                        hayRecompensa = true;
                        break;

                    }
                case "habilidades":
                    {

                        returnString += value.length > 1 ? "las habilidades " : "la habilidad ";
                        for (let j = 0; j < value.length; j++) {
                            console.log("habilidad:", value[j])
                            console.log(value[j]);
                            returnString += this.jsonHabilidades[value[j]].name + ", ";

                        }
                        hayRecompensa = true;
                        break;

                    }
                case "items":
                    {
                        let itemCount = 0;
                        let secondaryReturnString = "";
                        for (const itemReward of value) {
                            secondaryReturnString += this.jsonItems[itemReward.item].name + " (x" + itemReward.count + "), ";
                            itemCount += itemReward.count;
                        }
                        let primaryReturnString = itemCount > 1 ? "los objetos " : "el objeto ";
                        returnString += primaryReturnString + secondaryReturnString;
                        hayRecompensa = true;
                        break;

                    }

            }

        }
        //quitar el �ltimo ", "
        returnString = returnString.slice(0, -2);

        if (!hayRecompensa) {
            returnString = primaryReturnString;
        } else {
            returnString = primaryReturnString + " a cambio de " + returnString;
        }

        return returnString;

    }

}