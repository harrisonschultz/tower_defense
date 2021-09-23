import Phaser from "phaser";
import { globals } from "../globals";
import { Tile } from "./tile";
import { TileSet } from "./tileSets/tileSet";

export class TileMap {
    scene: Phaser.Scene;
    tileSet: TileSet
    callback: (event: any) => void

    constructor(scene: Phaser.Scene, tileset: string, callback: (event: any) => void) {
        this.scene = scene;
        globals.tileMap = scene.add.group({ classType: Phaser.GameObjects.Sprite, runChildUpdate: true });
        this.tileSet = new TileSet(scene, tileset)
        this.callback = callback
    }

    load() {
        this.tileSet.load()
    }

    buildMap(tiles: Array<Array<string>>) {
        for (let y in tiles) {
            for (let x in tiles[y]) {
                const tileX = parseInt(x, 10) * globals.TILE_SIZE + (globals.TILE_SIZE / 2);
                const tileY = parseInt(y, 10) * globals.TILE_SIZE + (globals.TILE_SIZE / 2);
                const tile = new Tile(this.callback, this.scene, tileX, tileY, tiles[y][x])
                tile.setDepth(globals.zIndex.map)
                globals.tileMap && globals.tileMap.add(tile, true)
            }
        }
    }
}