import { globals } from "../globals";

export class World {

    public static getCenterOfTile(x: number) {
        return Math.floor(x / globals.TILE_SIZE) * globals.TILE_SIZE + globals.TILE_SIZE / 2
    }

    public static getMapCoordinate(x: number) {
        return Math.floor(x / globals.TILE_SIZE)
    }
}