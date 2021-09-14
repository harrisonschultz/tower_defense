export class ImageButton extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, onClick: () => void) {
        super(scene, x, y, texture)
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', (event: any) => { this.enterButtonHoverState(); onClick() });
    }

    enterButtonHoverState() {
    }

    enterButtonRestState() {
    }

    enterButtonActiveState() {
    }

}