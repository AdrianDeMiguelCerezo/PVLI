# GDD The South Border

# MECÁNICAS

## GENERAL

Este juego es un juego roguelike de combates por turnos estilo rpg y aventura de texto.  
Juegas como un forajido en el salvaje oeste intentando llegar a la frontera sur de América para escapar del lugar mientras está en búsqueda y captura.

## MAPA

El jugador se mueve viajando entre nodos a menos de una distancia determinada en un mapa. Estos nodos representan lugares como ciudades, pueblos, etc. Empiezas en el nodo verde de arriba y debes llegar a uno de los nodos de abajo rojos. Se viaja a un nodo desde la pantalla de “mapa” haciendo click en el nodo destino. Hay líneas que indican visualmente a qué nodo puedes ir desde tu nodo actual.

* Objetivo primario: 35 nodos de los cuales, 4 son ciudades y 15, pueblos; Pre Colocados en el mapa por el dev; Con el evento que ocurre al entrar al nodo ya puesto por el dev;   
* Objetivo secundario:Al ser el propio mapa más grande que la pantalla, también se puede hacer scroll vertical y horizontal para ver el mapa entero.

En este caso, nodo verde \= inicio, nodo morado \= jefe, nodo azul oscuro= ciudad, nodo azul claro=pueblo. 
<img width="512" height="469" alt="unnamed" src="https://github.com/user-attachments/assets/6d8287a4-a010-4585-af00-107520a4152f" />

## NODOS Y EVENTOS

Cuando entras en un nodo, se sale automáticamente de la pantalla de mapa y ocurre algún evento.   
Los eventos son una serie de cosas que pueden ser escenas de diálogo con o sin elecciones, combates o tienda.  
Estas decisiones pueden ser cosas sencillas como elegir si ir a una tienda, o salvar a alguien, atacar, …; pueden haber elecciones que desencadenan combates (salvar a alguien de unos bandidos, por ej.); y pueden haber otras que desencadenan quests u otras cadenas de elecciones.   
Los eventos son plantillas y son parametrizables. Pueden tener parámetros predefinidos fijos o aleatorios. Algunos ejemplos de parámetros son nombres de lugares, personajes, etc, fechas, dinero que cuesta algo, recompensas,etc.  
¿Cuándo el resultado de una elección es otro evento y cuándo es una continuación de el mismo? En principio cada situación es un evento hasta que se cambie a otra situación grande que vale como evento en sí mismo (tiene sentido por sí mismo). Se deja a discreción del programador/diseñador. (EJEMPLOS LUEGO)

Cuando se acaba la cadena de elecciones del nodo, puedes volver a abrir la pestaña “mapa” para viajar al siguiente nodo en tu camino.

La mayoría de las elecciones son de no retorno (no puedes volver al momento de antes de la elección), pero algunas, como las tiendas, pueden saltarse esta regla.También existe la posibilidad de encontrarse en combates forzados nada más llegar a un nodo.

Las quests son cadenas de eventos(la mayoría con recompensas al final) que pueden desarrollarse enteramente a un único nodo.

Cantidad de quests/eventos:

* Objetivo primario: 10 eventos primarios (pueden ocurrir nada más entrar al nodo), 1 evento secundario(no puede ocurrir nada más entrar al nodo)  
* Objetivo secundario: 20 plantillas para eventos individuales, 20 plantillas para quest de 1 nodo, 10 para quests de 2 nodos, quest del geraldo de rivio de muchos nodos.  
* Objetivo terciario: Sí, cantidad grande de plantillas. 20 plantillas para quest de 1 nodo, 20 plantillas para quests de 2 nodos, 15 para quests de 3, 10 para quests de 4, 5 para quests de 5\. (por revisar).   
  El 50% de las quest que te encuentres serán de 2 nodos, el 35% de 3 nodos, el 10% de 4 nodos, el 5% de 5 nodos, la de gerald de rivia de 6 nodos(por revisar) aprox.


Hay 3 tipos de nodos: los nodos de pueblo, ciudad y comunes.  
Los tipos de eventos que ocurran en el nodo dependen del tipo de nodo en el que estés y de la zona de peligro de este. Por lo general, en pueblos y ciudades hay más quests, pero también hay más presencia del ejército, ergo más dificultad.

Ejemplos de quests y eventos:  
Leyenda:

* \- →linea de diálogo   
* “...” →diálogo no narración(con guiones en el texto que ve el jugador)  
* \- … (a/b/c/etc) →línea de diálogo con opciones.  
* a → opción seleccionada por el jugador  
* // → comentario  
* \[...\] → pasa lo escrito entre los corchetes  
* \=\> se pasa al evento tal.  
* Lo rojo o verde son diálogos que aparecen en rojo o en verde e indican que has ganado o perdido algo. Ocupan una línea entera.

Ej quest 1:

Viajas a un nodo común:  
//Tienda de campaña al anochecer (evento)  
\-Ya está anocheciendo en medio de la nada.  
\-Te encuentras una tienda de campaña. Estás cansado.¿Quieres entrar en la tienda de campaña a descansar un poco? (Sí/No)  
Sí.  
\-Dentro de la tienda de campaña te encuentras a una mujer atractiva que te mira precavida. Te pregunta: “¿Qué haces aquí?” (atacar/”No sabía que aquí hubiera alguien, me voy”/ “Necesito un lugar para dormir, ¿me puedes hacer hueco?”/”¿Quién eres?”)  
“Necesito un lugar para dormir, ¿me puedes hacer hueco?.”  
\-”¿Ehmmmm, no? ¿Por qué te debería dejar a tí dormir aquí conmigo?” (atacar/”Esque eres demasiado bella como para que yo duerma en otra parte”/ ”cuánto pides a cambio”)  
“Esque eres demasiado bella como para que yo duerma en otra parte.”  
\-”Que dices, cabrón.” \=\>\[Comienza combate con mujer atractiva\]

<img width="602" height="425" alt="Imagen1" src="https://github.com/user-attachments/assets/780d773e-a9eb-4aa2-9133-acd7981a0163" />

<img width="602" height="425" alt="Imagen2" src="https://github.com/user-attachments/assets/2696eec2-8675-4b14-8279-55df26d4d841" />

<img width="602" height="425" alt="Imagen3" src="https://github.com/user-attachments/assets/04cf8208-0854-4b40-b76d-25a922c3478a" />

<img width="602" height="425" alt="Imagen4" src="https://github.com/user-attachments/assets/d82bf70e-e3cd-46ca-85e5-690cbff23214" />

<img width="602" height="425" alt="Imagen5" src="https://github.com/user-attachments/assets/c4bfccca-248d-45fc-9f7b-37f4b19ff640" />


Ej quest 2:  
//juego de los vasos(evento)  
Viajas a un nodo pueblo:  
\-Llegas a un pueblo por la tarde.  
\-Mientras caminas por la calle principal, ves a un hombre sentado en una manta mientras anuncia en voz alta: “¡Vengan, vengan\! ¡Es el juego de los vasos, ganen mucho, pierdan poco\!” (Acercarse/pasar de largo)  
Acercarse  
\-”Hola, soy Julio, veo que le ha interesado mi propuesta. Le explico las normas del juego.”  
\-Julio saca 3 vasos y una pepita de oro de una bolsa y los coloca sobre la mesa. Por la agilidad que ha tenido al sacar los vasos, supones que tiene experiencia en el negocio.  
\-”Voy a poner los tres vasos boca abajo sobre la mesa, y voy a poner la pepita bajo el vaso del centro. Luego moveré los vasos y tendrás que decir dónde está la pepita. Si aciertas, te llevarás 200 de oro. Jugar cuesta 50 de oro. ¿Te apuntas?” (Sí/no)  
Sí   
\-Julio comienza a mover los vasos diestramente.  
\-Has perdido de vista el vaso correcto.(muy probable en esta dificultad)  
\-Julio para de mover los vasos y pregunta:” ¿En qué vaso está la pepita?” (Izquierda/centro/derecha)  
Derecha  
\-Julio muestra lo que hay bajo cada vaso, y por desgracia, la pepita estaba bajo el vaso de la izquierda. \\n \-50 oro \[-50 oro\] \\n “Lo siento, compañero, ¿quiere volver a jugar? Esta vez seguro que lo consigue” (Sí/no, me voy/atacar a Julio)  
Sí   
\-Julio comienza a mover los vasos diestramente.  
\-Sigues correctamente el vaso con la vista.(poco probable en esta dificultad)  
\-Julio para de mover los vasos y pregunta: ¿En qué vaso está la pepita? (Izquierda/centro/derecha)  
Centro  
\-Julio muestra lo que hay bajo cada vaso, y por desgracia, la pepita estaba bajo el vaso de la derecha.\\n \-50 oro \[-50 oro\] \\n “Lo siento, compañero, ¿quiere volver a jugar? Esta vez seguro que lo consigue” (Sí / no, me voy / Esto es una estafa, te he pillado / atacar a Julio)  
Esto es una estafa, te he pillado.  
\-”Eso no es verdad, pero no se lo digas a nadie, que tengo una reputación que mantener. ¿Aceptarías este regalo de buena fe?. Son 300 oros” (Sí, pero como te vuelva a ver… / quizá por 400 oros…/ atacar a Julio)  
Sí, pero como te vuelva a ver…  
\- \+300 oros \[+300 oros\]  
\-Para cuando te das cuenta, julio ya se ha ido.  
<img width="602" height="425" alt="Imagen6" src="https://github.com/user-attachments/assets/4b211c6e-2607-4b3a-bb67-dd7fe3c3d938" />

<img width="602" height="425" alt="Imagen7" src="https://github.com/user-attachments/assets/e36a5651-42fc-4852-a14a-e32e4682d577" />

<img width="602" height="425" alt="Imagen8" src="https://github.com/user-attachments/assets/416a4393-e925-46e4-80ce-62ce0c7a5a2a" />

<img width="602" height="425" alt="Imagen9" src="https://github.com/user-attachments/assets/18fcd847-f6e0-42e9-bc4f-240872f248a3" />

<img width="602" height="425" alt="Imagen10" src="https://github.com/user-attachments/assets/529b2e86-607e-4a8b-89ad-734413c66984" />

<img width="602" height="425" alt="Imagen11" src="https://github.com/user-attachments/assets/3f85c5af-e3da-4f25-b934-252f8a2b2dab" />


Ej quest 3

Viajas a un nodo pueblo:

\-LLegas a un pueblo por la mañana.  
\-Qué quieres hacer (Pasear por las calles / ir al mercado / ir a la herrería/ ir a la taverna)  
Ir al mercado

El jugador estará de media 3 min en cada nodo.

* Objetivo primario: Camino más rápido:6 nodos y un camino de los más lentos serían 13\. 3-4 pueblos por cada ciudad. 1 ciudad por cada 14 nodos. 30 nodos. (Veremos si se necesita mayor concentración de ciudades/pueblos en esta mini versión).  
* Objetivo secundario: Camino más rápido:12 nodos y un camino de los más lentos serían 26\. 3-4 pueblos por cada ciudad. 1 ciudad por cada 14 nodos. 60 nodos o así.

## ZONAS DE PELIGRO

Hay 4 zonas de peligro. Las zonas de peligro representan principalmente los territorios mejor controlados por el estado, en los que te están buscando. 

* Objetivo primario: Cuanta mayor sea la zona de dificultad, mayor es la probabilidad de que ocurra un evento de combate con el ejército al entrar al nodo. Cuanta mayor sea la dificultad, más recompensas obtienes.   
  Ubicación y tamaño de zonas de dificultad iniciales predefinidos. Las zonas de dificultad cuyo foco está activo crecen cada **n** viajes.  
  Cuando huyes de un combate (con enemigos que avisen al estado de ello(unos bandidos no van a avisar al estado)) o como resultado de eventos, el foco más cercano se activa, y las zonas de dificultad crecen hacia ese nodo(se crea un nuevo foco activo a partir del que crecen las zonas de dificultad en ese nodo. Las zonas de dificultad alrededor de este foco aumentan más lentamente).  
* Objetivo secundario: Aumentar las diferencias entre zonas de dificultad y generación procedural del estado inicial.

Estas son las diferentes zonas de peligro que pueden existir:

* Zona segura: No hay apenas riesgo. Probabilidad mínima de combates obligatorios. Fácil pero ofrece pocas recompensas.  
* Zona alerta: Dificultad media y recompensas medias. Para un jugador medianamente fuerte en early game, es una decisión difícil si entrar en esta zona o no.  
* Zona peligrosa: Difícil. A no ser que el jugador sea muy fuerte, el riesgo suele superar las recompensas, por lo que no se debería entrar en estas hasta muy adelante en la partida. Altas recompensas.  
* Zona muy peligrosa: Muy difícil hasta el punto de que podrías estar en peligro aún más adelante en la partida. Mismas recompensas que la zona peligrosa.

## INVENTARIO

El inventario contiene una lista de equipamiento, los items y las habilidades que el jugador posee. Aquí el jugador puede equipar/desequipar el equipamiento que tiene equipado, usar items y mirar los efectos que causan las habilidades se usan en combate.  
La escena de inventario se puede acceder desde el mapa y desde los eventos. 

Lista de items:

- Mejunje extraño:Descripción:”comestible,”, Habilidad:quita 20 de hambre y no restaura sp al jugador. Fuera del combate.  
- Ración seca: Descripción:”comestible,”, Habilidad:quita 20 de hambre y restaura muy pocos sp al jugador. Fuera del combate.  
- Ración de calidad: Descripción:”comestible,”, Habilidad:quita 30 de hambre y restaura pocos sp al jugador. Fuera del combate.  
- Ración gourmet: Descripción:”comestible,”, Habilidad:quita 60 de hambre y restaura medios sp al jugador. Fuera del combate.  
- Poción de salud mini: Habilidad:cura poca hp al jugador. Dentro y fuera de combate.  
- Poción de salud fuerte: Habilidad:cura bastante hp al jugador. Dentro y fuera de combate.  
- Poción de recuperación de SP pequeña: Habilidad: Restaura una cantidad media de sp al jugador. Dentro y fuera del combate.  
- Poción de recuperación de SP fuerte: Habilidad: Restaura una cantidad alta de sp al jugador. Dentro y fuera del combate.  
- Antídoto: Habilidad: cura veneno al jugador. Dentro y fuera del combate.

- Dardo envenenado:Habilidad: Daño: poco, Efecto: aplica veneno a un enemigo. Dentro del combate.  
- Molotov :Habilidad: Daño: poco, Efecto: aplica quemado a un enemigo. Dentro del combate.  
- Extraño coso que brilla: Habilidad: Efecto: aplica paralizado a un enemigo durante 2 turnos. Dentro del combate.  
- Nabo: Cura poca HP y cura algo de hambre  
- Nabo pocho: Quita poca HP y cura algo de hambre

## HAMBRE

Existe un contador de hambre. La barra de hambre crece cuanto más hambre tengas. El máximo de hambre es 100 y el mínimo de hambre que puedes tener es 0\. Si se llena la barra de hambre, mueres de hambre. No es un peligro máximo pero es otra cosa siempre a tener en cuenta para el jugador a la hora de gestionar sus recursos. Sube entre 20 y 30 puntos cada vez que viajas de nodo. La comida (items que disminuyen el hambre) se puede conseguir en tiendas, y como recompensas de combates y eventos.

## COMBATE

El combate es estilo RPG por turnos, y se lleva a cabo en una pantalla especial, que tiene en ella a los enemigos, al jugador, y un menú con las posibles acciones del jugador durante el combate.

Hay varias estadísticas orientadas al combate:

HP (vida): si llega a 0, mueres.  
Def: defensa contra ataques.  
Crit chance & damage. De ti hacia el enemigo, no viceversa. Sólo se aplica para la habilidad básica del arma.  
Puntos de habilidad(SP): se usan para efectuar habilidades activas. Persisten entre combates. La cantidad máxima de SP que puedes tener almacenada es lo necesario para acabar 2-3 combates contra enemigos con un poder más o menos igual o un poco menor al tuyo atacando solamente con habilidades activas. Se restauran en ciertos eventos o con ciertos items.

En el juego y en combate sólo hay un personaje controlable.   
El orden de turnos en combate es este: primero es el turno jugador y luego juegan su turno todos los enemigos de izquierda a derecha.  
Al principio del combate siempre es el turno del jugador, salvo en casos especiales(una emboscada enemiga por ejemplo). 

## HABILIDADES

Las habilidades son todas las acciones que pueden realizar el jugador y los enemigos. Se pueden utilizar dentro y fuera del combate(La mayoría de estas solo dentro). Pueden hacer daño y o aplicar una serie de efectos de estado, o curar.

El jugador puede hacer dos acciones por turno, mientras que los enemigos solo una.  
Durante el turno del jugador, puede realizar las siguientes acciones. Todas son habilidades:

* Ataque básico: No gasta puntos de habilidad.  
* Defender:Puede gastar 1 o 2 acciones dependiendo de cuántas te queden. Te da el efecto de DEF+ / DEF++ dependiendo de si gastas 1 o 2 acciones.No gasta puntos de habilidad.  
* Usar la habilidad de un objeto. Gasta 1 acción.  
* Huir: Usas tus 2 acciones. Cuando vuelva a ser tu turno, huyes del combate y no consigues recompensas. Hay combates de los que no se puede huir. Si huyes de un combate, el juego actúa como si te hubieras pasado el nodo, pero no recibes recompensas.  
* Objetivo secundario: Equipar o intercambiar un objeto equipado por otro. Gasta 1 acción.


Cada tipo de enemigo usa una acción por turno, de 3 acciones que dependen del enemigo en [concreto. El](http://concreto.El) orden de los turnos del enemigo es según la posición del enemigo. Se telegrafía el tipo de acción que el enemigo va a realizar en su turno durante el turno previo del jugador mediante una señal encima de su cabeza. Todas estas acciones son habilidades con su información escrita en estas.  
Estas pueden ser de los siguientes tipos:

* Ataque básico: habilidad que hace daño y ya.  
* Ataque especial: más fuerte que el básico/con efectos adicionales.  
* Bufo: Habilidad que da un efecto de estado positivo a los enemigos.  
* Debufo: Habilidad que da un efecto de estado negativo al jugador.  
* Nula: null.

## EFECTOS DE ESTADO

Existen diferentes efectos de estado aplicables tanto al jugador como a los enemigos. Están pendientes de balancear y se irán añadiendo más si la situación lo requiere.  
En principio estos son:

* Quemado: quita 5% hp por turno en el combate aprox. 3 turnos.  
* Envenenado: quita 2% hp por turno en el combate, hasta que te lo cures. Persiste entre combates, por lo cual te lo tienes que quitar usando un objeto de un solo uso “antídoto” que se puede conseguir en combates, quests o tiendas.  
* Hambre 1: disminuye tu defensa en un 30% y todos tus ataques hacen un 30% menos de daño. Se te da cuando el hambre pasa a ser \>= 50%. Se quita cuando baja del 50%.  
* Hambre 2: El jugador solo tiene una acción por turno. Se te aplica cuando el hambre pasa a ser \>= 80%. Se quita cuando baja del 80%.  
* Att-: todos tus ataques hacen un 30% menos de daño. Dura 2 turnos.  
* Def-: 30% disminuye el daño recibido en un 30%. Dura 2 turnos.  
* Paralizado: Solo lo puede aplicar el jugador.Si los enemigos están paralizados, no actúan. Dura n turnos.  
* Obj. secundario Cansado: Solo lo pueden aplicar los enemigos. El jugador solo tiene una acción por turno.

## EQUIPAMIENTO 

* Obj primario: 3 ranuras: arma , pechera y pantalones.  
* Obj. secundario: Añadir slots artefactos, que tienen diversos efectos

No hay un sistema de subida de nivel como tal, la manera de aumentar tu fuerza es consiguiendo equipamiento mejor y habilidades.  
Los objetos de equipamiento no tienen usos limitados ni durabilidad.  
Puedes equipar objetos de equipamiento tanto dentro como(obj.secundario) fuera de combate.

Las armas mejoran sobre todo lo relacionado con el daño. Las armaduras se centran más en la defensa.  
El equipamiento puede tener efectos adicionales, desde simples aumentos de otras stats, por ejemplo.  
El equipamiento se puede conseguir en tiendas,como resultado de quests o como loot de un combate.  
<img width="602" height="320" alt="Imagen2" src="https://github.com/user-attachments/assets/8db504cb-3d8c-4707-940d-c537729cbc20" />


# DINÁMICA 

## OBJETIVOS Y CONFLICTOS 

El objetivo es llegar a uno de varios nodos del mapa, que son los que más al sur están, donde debes derrotar a un jefe muy fuerte para ganar.  
En tu camino a la derrota del boss se interponen:

* El límite de distancia de viaje entre dos nodos cualquiera.  
* La gestión de recursos como el hambre, la vida, etc.  
* Enemigos en combates.  
* El propio jefe final y la idea de que para derrotarlo, hay que arriesgarse yendo por zonas más complicadas.

## DIFICULTAD 

El juego es difícil.   
Es un juego más castigador que permisivo.  
En general la curación es escasa, lo que hace que la salud pase a ser un recurso más que gestionar a la hora de tomar decisiones.   
Los enemigos dan relativamente poco loot. Hay una mecánica de hambre que disminuye lentamente que hace que el jugador tenga que gestionar mejor el dinero. 

## SISTEMAS RIESGO-RECOMPENSA

Uno de los núcleos del juego son las mecánicas de riesgo-recompensa.   
Debido a la escasez de curaciones, la vida es un recurso. Por lo general, los recursos son escasos así que va a haber que gestionarlos bien.  
Las zonas más seguras, por ende menos arriesgadas, dan poco loot. Cuánto más peligrosa sea la zona de peligro en la que se encuentre un nodo, mayores recompensas obtendrá el jugador en este.  
Al haber un jefe final muy fuerte que el jugador no podrá vencer si solamente ha viajado por las zonas más seguras, se hace que el jugador tenga que ir tomando riesgos viajando por zonas de peligro más difíciles para equiparse lo suficiente para vencer al boss final.   
Aquí habrá de calcular qué le merece más la pena: arriesgarse a ir por una zona más difícil y perder puntos de habilidad, vida, que es escasa, o incluso llegar a morir, o limitarse a nodos más seguros por el momento hasta tener la fuerza suficiente para afrontar una zona de peligro mayor sin tanto riesgo.   
Mecánicas como el manejo del dinero, el hambre, encontrar un antídoto porque te han envenenado, que el siguiente nodo de una quest esté en una zona de peligro más complicada, o que el estado te encuentre en un pueblo, que causará más presencia militar en la zona ergo aumentará el nivel de peligro de la zona, afectarán a estos juicios que el jugador tiene que hacer.  
Las mecánicas riesgo-recompensa también existirán en los eventos, a la hora de tomar decisiones: ¿Te viene mejor ayudar a este mercader que está siendo atacado por unos bandidos o mejor miras a otro lado y te vas?  
¿Aceptarás dinero de alguien importante para ignorar un cruel acto de esta persona que has presenciado?  
El crecimiento progresivo (o no tan progresivo) de las zonas de peligro te fuerza a ir avanzando hacia los nodos finales para evitar llegar con poca vida, o no llegar al boss final.

# 

# ESTÉTICA

Pantalla 4/3. El juego tiene estilo pixelart del salvaje oeste.

Interfaz

Interfaz de combate

Cuando usas una habilidad o item singleTarget, se pone todo oscuro menos los enemigos y todo se vuelve no interactuable menos los enemigos, cuando clikes en uno usas la habilidad o item sobre ese, el fondo vuelve a ser normal y puedes volver a pulsar los botones.  
Los enemigos tienen barras de vida encima de siu cabeza y un indicador con el tipo de ataque de su siguiente ataque (básico, especial,...).  
La barra de vida (roja) y de sp(puntos de habilidad, azul oscuro) del jugador se sitúan una al lado de otra a la izquierda, encima del menú de selección de acciones en combate.  
Cuando pasas el ratón por encima de una habilidad activa o item, sale un pop-up en el ratón diciendo sus características.  
Cuando empieza tu turno, el menú NO scrolleable de la derecha está vacío, se llena cuando clicas "items" o "habilidades" si pasas el ratón por encima de cualquier botón, te dice en un pequeño cuadro adonde está el ratón el nombre y la descripción la habilidad en última instancia, asociada. El estilo de las 2 segundas imágenes es el de la primera.  
<img width="301" height="276" alt="Imagen3" src="https://github.com/user-attachments/assets/320c59fc-3b80-45a2-aad3-939c225ccf38" />
<img width="301" height="276" alt="Imagen4" src="https://github.com/user-attachments/assets/1a65441b-ea41-45d3-b0e9-92aff6da0e89" />
<img width="301" height="295" alt="Imagen5" src="https://github.com/user-attachments/assets/9967bd6f-b39f-48aa-8795-c692284bc5e2" />

# Esquemas de implementación
![Imagen de WhatsApp 2025-10-27 a las 23 14 41_b3f3e360](https://github.com/user-attachments/assets/d8f0ed4e-b624-47d1-b7be-4685d152b5fe)
![Imagen de WhatsApp 2025-10-27 a las 23 14 41_8e94daf2](https://github.com/user-attachments/assets/de30a143-07c5-4068-904e-bd3ba22c9b3b)
![Imagen de WhatsApp 2025-10-27 a las 23 14 41_54cad22b](https://github.com/user-attachments/assets/1024f71f-6e75-47e9-9131-43ac94e36c65)
