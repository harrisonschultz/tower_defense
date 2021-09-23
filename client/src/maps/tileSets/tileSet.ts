const TILES_FOLDER = "./"

export class TileSet {
    scene: Phaser.Scene
    tiles: Array<string>
    tileSet: string

    constructor(scene: Phaser.Scene, tileSet: string) {
        this.scene = scene
        this.tileSet = tileSet
        this.tiles = Array<string>();
    }

    load() {
        import(`${TILES_FOLDER}${this.tileSet}`).then((module: { default: Array<string> }) => {
            const tiles = module.default
            for (let path of tiles) {
                const split = path.split('/')
                const imageName = split[split.length - 1].split('.')[0];
                this.tiles.push(imageName)
                this.scene.load.image(imageName, path)
            }
        })
    }
}