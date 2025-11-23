
class SubStateNode {


    constructor(combate,texto,opciones,consecuencias,subState_Huida) {
        this.combate = combate;

        /**
         * @type {string} texto del diálogo
         */
        this.texto = texto;

        /**
         * [{textoOpción,Nodo al q se va},{textoOpción,Nodo al q se va},...] 
         * @type {{string,SubStateNode}[]}
         */
        this.opciones = opciones;


        /**van los nombres de atributos del player y los cambios en estos {"dinero":... ,"items": ["",""],"equipamiento":["","",],"efectos":["",""],"habilidades":[],HP:... } si no hay cambio en un atributo, no se pone;
         */
        this.consecuencias = consecuencias;

        /**
         * @type {SubStateNode} subestado al que se va si se huye del combate.
         */
        this.subState_Huida = subState_Huida;
    }


}