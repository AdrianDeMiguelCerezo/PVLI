
class SubStateNode {


    constructor(combate,texto,opciones,consecuencias,subState_Huida) {
        this.combate = combate;

        /**
         * @type {string} texto del diálogo
         */
        this.texto = texto;


        /**
         * [{textoOpción,Nodo al q se va},{textoOpción,Nodo al q se va},...] 
         * @type {{"texto":string,"salto":SubStateNode}[]}
         */
        this.opciones = opciones;


        /**van los nombres de atributos del player y los cambios en estos {"dinero":... ,"items": ["",""],"equipamiento":["","",],"efectos":["",""],"habilidades":[],HP:... } si no hay cambio en un atributo, no se pone;
         */
        this.consecuencias = consecuencias;

        /**
         * @type {SubStateNode} subestado al que se va si se huye del combate.
         */
        this.EventFragment_Huida = subState_Huida;
    }

    /**
     * 
     * @param {object} combate
     * @param {string} texto
     * @param {{"texto":string,"salto":SubStateNode}[]} opciones
     * @param {} consecuencias
     * @param {SubStateNode} eventFragment_Huida
     */
    Create(combate, texto, opciones, consecuencias, eventFragment_Huida) {
        this.combate = combate;


        this.texto = texto;

        this.opciones = opciones;



        this.consecuencias = consecuencias;


        this.EventFragment_Huida = eventFragment_Huida;
    }


}