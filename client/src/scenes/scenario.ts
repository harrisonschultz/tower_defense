import Phaser from "phaser";
import { Enemy } from "../enemies/Enemy";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "main",
};

export class ScenarioScene extends Phaser.Scene {
  public graphics: Phaser.GameObjects.Graphics | undefined;
  public enemies: Phaser.GameObjects.Group | undefined;
  public path: Phaser.Curves.Path | undefined;
  private nextEnemy: number | undefined;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.atlas("sprites", "assets/spritesheet.png", "assets/spritesheet.json");
    this.load.image("bullet", "assets/bullet.png");
  }

  public create() {
    // this graphics element is only for visualization,
    // its not related to our path
    this.graphics = this.add.graphics();
    this.drawGrid();

    // the path for our enemies
    // parameters are the start x and y of our path
    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);

    this.graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    this.path.draw(this.graphics);

    // Add enemies
    this.enemies = this.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 1;
  }

  public drawGrid() {
     if (this.graphics) {
      this.graphics.lineStyle(1, 0x0000ff, 0.8);
      for (var i = 0; i < 8; i++) {
        this.graphics.moveTo(0, i * 64);
        this.graphics.lineTo(640, i * 64);
      }
      for (var j = 0; j < 10; j++) {
        this.graphics.moveTo(j * 64, 0);
        this.graphics.lineTo(j * 64, 512);
      }
      this.graphics.strokePath();
     }
    
  }

  public update = (time: number, delta: number) => {
    // if its time for the next enemy
    if (!!this.nextEnemy && this.enemies && time > this.nextEnemy) {
      var enemy = this.enemies.get();
      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);

        // place the enemy at the start of the path
        enemy.startOnPath(this.path);

        this.nextEnemy = time + 2000;
      }
    }
  };
}
