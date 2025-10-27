export default class MapNode extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,targetScene,scale=1){
        super(scene,x,y,texture)

        this.targetScene=targetScene;

        scene.add.existing(this);
        this.setInteractive();

        this.setScale(scale);

        this.on('pointerover', () => this.setTintFill(0xffffff));
        this.on('pointerout', () => this.clearTint());
        this.on('pointerup', () => scene.scene.start(this.targetScene));
    }
}