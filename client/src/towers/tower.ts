import Phaser from "phaser";
import { Enemy } from "../enemies/enemy";
import { globals } from "../globals";
import { ProjectileDefinition, TowerDefinition } from '../../../types'
import { Projectile } from "../projectiles/projectile";


export class Tower extends Phaser.GameObjects.Sprite {
  nextTic: number | undefined;
  rangeDisplay: Phaser.GameObjects.Shape
  readyToFire: boolean
  lastFired: number
  attackSpeed: number
  range: number
  cost: number
  projectile: ProjectileDefinition

  constructor(stats: TowerDefinition, scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number | undefined) {
    super(scene, x, y, texture, frame)
    this.name = stats.name;
    this.lastFired = 0;
    this.cost = stats.cost;
    this.attackSpeed = stats.attackSpeed;
    this.range = stats.range
    this.readyToFire = true;
    this.rangeDisplay = this.scene.add.circle(this.x, this.y, this.range, 0x6666ff, 0.2);
    this.rangeDisplay.setVisible(false);
    this.projectile = stats.projectile
    this.setInteractive()
    this.on('pointerover', () => this.rangeDisplay.setVisible(true))
    this.on('pointerout', () => this.rangeDisplay.setVisible(false))
  }

  initialize = (scene: Phaser.Scene) => {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "sprites", "turret");
  };

  payForTower = () => {
    globals.gold -= this.cost
  }

  place = (i: number, j: number) => {
    this.y = j
    this.x = i

    this.rangeDisplay.setX(this.x)
    this.rangeDisplay.setY(this.y)
    this.rangeDisplay.setDepth(-1)
  };

  reload(time: number) {
    if (!this.readyToFire && time - this.lastFired > this.attackSpeed) {
      this.readyToFire = true
    }
  }

  update = (time: number, delta: number) => {
    // time to shoot
    if (this.readyToFire && this.fire(time)) {
      this.readyToFire = false
    }
    this.reload(time)
  };

  fire = (time: number) => {
    var enemy = this.getEnemy(this.x, this.y, this.range);
    if (enemy) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, (enemy as Enemy).x, (enemy as Enemy).y);
      this.addProjectile(this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      this.lastFired = time;
      return true
    }
    return false
  };

  getEnemy(x: number, y: number, distance: number) {
    var enemyUnits = globals.enemies!.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, (enemyUnits[i] as Enemy).x, (enemyUnits[i] as Enemy).y) <= distance)
        return enemyUnits[i];
    }
    return false;
  }


  public addProjectile(x: number, y: number, angle: number) {
    var projectile = new Projectile(this.projectile, this.scene, x, y)
    globals.projectiles?.add(projectile, true)
    if (projectile) {
      projectile.fire(x, y, angle);
    }
  }


}
