import { BombTower } from "./bomb";
import { BasicTower } from "./basic";

export class Towers {
    public static createTower(scene: Phaser.Scene, tower: string, x: number, y: number) {
        if (tower == 'bomb') {
            return new BombTower(scene, x, y)
        } else if (tower == 'basic') {
            return new BasicTower(scene, x, y)
        }
    }
}