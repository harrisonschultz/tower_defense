import { Tower } from './tower'
import { TowerDefinition } from '../../../types'

const stats: TowerDefinition = {
   name: 'bomb',
   attackSpeed: 1000,
   range: 100,
   cost: 20,
   projectile: {
     speed:  Phaser.Math.GetSpeed(600, 1),
      damage: 0,
      texture: 'bomb',
      splashDamage: 15,
      splashRange: 40,
   }
}

export class BombTower extends Tower {
   constructor(scene: Phaser.Scene, x: number, y: number) {
      super(stats, scene, x, y, 'bookshelf')
    }
}