import { Tower } from './tower'
import { TowerDefinition } from '../../../types'

const stats: TowerDefinition = {
   name: 'basic',
   attackSpeed: 1000,
   range: 100,
   cost: 10,
   projectile: {
     speed:  Phaser.Math.GetSpeed(600, 1),
      damage: 25,
      texture: 'green_arrow'
   }
}

export class BasicTower extends Tower {
   constructor(scene: Phaser.Scene, x: number, y: number) {
      super(stats, scene, x, y, 'barrel')
    }
}