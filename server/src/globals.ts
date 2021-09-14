import { Player } from "./player";
import Phaser from "phaser";

class Globals {
   enemies: Phaser.GameObjects.Group | undefined;
   towers: Phaser.GameObjects.Group | undefined;
   projectiles: Phaser.GameObjects.Group | undefined;
   map: Array<Array<number>> | undefined;
}

export const globals = new Globals();
export const players: { [id: string]: Player } = {};
