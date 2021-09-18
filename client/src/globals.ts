import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

class Globals {
  uiElements: Phaser.GameObjects.Group | undefined;
  enemies: Phaser.GameObjects.Group | undefined;
  towers: Phaser.GameObjects.Group | undefined;
  projectiles: Phaser.GameObjects.Group | undefined;
  map: Array<Array<number>> | undefined;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  game: Phaser.Game | undefined
  gold: number
  lives: number
  MAP_HEIGHT: number
  MAP_WIDTH: number
  TILE_SIZE: number

  constructor() {
    this.gold = 100;
    this.lives = 10;
    this.TILE_SIZE = 64
    this.MAP_HEIGHT = 668;
    this.MAP_WIDTH = 924;
  }
}

export const globals = new Globals();
