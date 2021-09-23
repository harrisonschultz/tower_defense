import Phaser from "phaser";
import { ProjectileDefinition } from "types";
import { Enemy } from "../enemies/enemy";
import { globals } from "../globals";

export class Projectile extends Phaser.GameObjects.Image {
  dx: number;
  dy: number;
  lifespan: number;
  speed: number;
  damage: number;
  splashDamage: number | undefined;
  splashRange: number | undefined;

  constructor(stats: ProjectileDefinition, scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, stats.texture);
    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    this.speed = stats.speed;
    this.damage = stats.damage;
    this.splashDamage = stats.splashDamage;
    this.splashRange = stats.splashRange;
    this.setDepth(globals.zIndex.projectile)
  }

  fire = (x: number, y: number, angle: number) => {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setRotation(angle + 0.785398);
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
    this.lifespan = 300;
  };

  update = (time: number, delta: number) => {
    this.lifespan -= delta;
    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  };

  getEnemiesInRange() {
    let enemyUnits = globals.enemies!.getChildren();
    let enemiesInRange = [];
    if (this.splashRange) {
      for (let enemy of enemyUnits) {
        if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, (enemy as Enemy).x, (enemy as Enemy).y) <= this.splashRange) {
          enemiesInRange.push(enemy);
        }
      }
    }
    return enemiesInRange;
  }

  activate = (enemy: Enemy) => {
    if (enemy.active === true && this.active === true) {
      // we remove the this right away
      this.setActive(false);
      this.setVisible(false);

      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(this.damage);

      // Deal Splash
      if (this.splashDamage) {
        for (let enemy of this.getEnemiesInRange()) {
          (enemy as Enemy).receiveDamage(this.splashDamage);
        }
      }
    }
  };
}
