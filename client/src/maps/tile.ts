import Phaser from "phaser";

export class Tile extends Phaser.GameObjects.Sprite {

    constructor(callback: (event: any) => void, scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.setInteractive()
            .on('pointerup', callback);
    }

}