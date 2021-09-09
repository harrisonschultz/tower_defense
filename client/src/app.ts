import Phaser from "phaser";
import io from "socket.io-client";
import { ScenarioScene } from './scenes/scenario'

const config: Phaser.Types.Core.GameConfig = {
   type: Phaser.AUTO,
   width: 640,
   height: 512,
   physics: {
      default: "arcade",
      arcade: {
         gravity: { y: 200 },
      },
   },
   scene: [ScenarioScene],
};


var game = new Phaser.Game(config);


(this as any).socket = io();
