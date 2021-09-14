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
  TILE_SIZE: number

  constructor() {
    this.TILE_SIZE = 64
  }
}

export const globals = new Globals();
