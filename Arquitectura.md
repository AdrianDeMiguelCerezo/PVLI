# ARQUITECTURA

El esquema de la arquitectura se encuentra en este archivo. Los cuadros verdes representan escenas y los amarillos objetos.  
[Esquema](https://drive.google.com/file/d/1hl9UctpKjcErAA7abpGZDFSpZW4wSLJK/view?usp=drive_link)

Primeramente, game hereda todas las escenas del juego.  
   
WinScene y GameOver no requieren heredar nada más ya que son sólo texto y un botón para volver al menú principal.

MenuTest sólo hereda MenuButton y PlayerInfoMenu, que hereda HealthBar, ya que se usa para crear el menú(que es PlayerInfoMenu).

Las demás escenas todas heredan PlayerData, ya que es el objeto que guarda la info del jugador.

DialogueScene hereda dialog\_plugin, MenuButton y SubStateNode para los diálogos, botones de elección y manejar los fragmentos de eventos, respectivamente.

BattleScene hereda combatManager, que hereda Enemy; Player, que hereda PlayerData; Enemy, que hereda HealthBar; Menu, que hereda MenuButton y HealthBar.

Map hereda MenuButton y MapNode, que hereda EventParser, que hereda SubStateNode(para el manejo de eventos desde los nodos del mapa).

