import Phaser from "phaser";
import { ENEMY_SPEED } from "../../../server/src/globals";

// Extends: Phaser.GameObjects.Image

export class Enemy extends Phaser.GameObjects.Sprite {
  follower: { t: number; vector: Phaser.Math.Vector2 };
  path: Phaser.Curves.Path;
  constructor(
    scene: Phaser.Scene,
    path: Phaser.Curves.Path,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.path = path;
    this.follower = { t: 0, vector: new Phaser.Math.Vector2() };
  }

  create = () => {};

  public initialize = (scene: Phaser.Scene) => {
    Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "sprites", "enemy");
  };

  update = (time: number, delta: number) => {
    // move the t point along the path, 0 is the start and 0 is the end
    this.follower.t += ENEMY_SPEED * delta;

    // get the new x and y coordinates in vec
    this.path.getPoint(this.follower.t, this.follower.vector);

    // update enemy x and y to the newly obtained x and y
    this.setPosition(this.follower.vector.x, this.follower.vector.y);
    // if we have reached the end of the path, remove the enemy
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
    }
  };

  startOnPath = (path: Phaser.Curves.Path) => {
    if (!this.path) {
      this.path = path;
    }
    // set the t parameter at the start of the path
    this.follower.t = 0;

    // get x and y of the given t point
    this.path.getPoint(this.follower.t, this.follower.vector);

    // set the x and y of our enemy to the received from the previous step
    this.setPosition(this.follower.vector.x, this.follower.vector.y);
  };
}
