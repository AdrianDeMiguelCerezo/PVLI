
export default class SubStateNode {

    /**
 * 
 * @param {object} combate
 * @param {string} texto
 * @param {{"texto":string,"salto":SubStateNode}[]} opciones
 * @param {} consecuencias
 * @param {SubStateNode} eventFragment_Huida
 */
    constructor(tipo, combate, texto, opciones = [], consecuencias = [],eventFragment_Huida,eventFragment_noPay) {
        this.tipo = tipo; 

        this.combate = combate;

        /**
         * @type {string} texto del di�logo
         */
        this.texto = texto;


        /**
         * [{textoOpci�n,Nodo al q se va},{textoOpci�n,Nodo al q se va},...] 
         * @type {{"texto":string,"salto":SubStateNode}[]}
         */
        this.opciones = opciones;


        /**van los nombres de atributos del player y los cambios en estos {"dinero":... ,"items": ["",""],"equipamiento":["","",],"efectos":["",""],"habilidades":[],HP:... } si no hay cambio en un atributo, no se pone;
         */
        this.consecuencias = consecuencias;

        /**
         * @type {SubStateNode} subestado al que se va si se huye del combate.
         */
        this.nodoHuida = eventFragment_Huida;

        /**
         * @type {SubStateNode} subestado al que se va si no tienes suficiente dinero para un pago de este fragmento.
         */
        this.nodoNoPay = eventFragment_noPay
    }



}