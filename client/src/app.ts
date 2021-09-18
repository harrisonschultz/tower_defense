import Phaser from "phaser";
import io from "socket.io-client";
import { ScenarioScene } from './scenes/scenario'
import { LobbyScene } from './scenes/lobby'
import { globals } from "./globals";
import { BombTower } from "./towers/bomb";
import { Tower } from "./towers/tower";

const config: Phaser.Types.Core.GameConfig = {
   type: Phaser.AUTO,
   width: 1024,
   height: 768,
   scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
   },
   physics: {
      default: "arcade",
   },
   scene: [LobbyScene, ScenarioScene],
};


globals.socket = io();


globals.socket.on('connect', () => {
   globals.game = new Phaser.Game(config);
})


