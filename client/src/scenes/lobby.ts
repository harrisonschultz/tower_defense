import Phaser from "phaser";
import { Enemy } from "../enemies/enemy";
import { Projectile } from "../projectiles/projectile";
import { globals } from "../globals";
import { BasicTower } from '../towers/basic'
import { BombTower } from '../towers/bomb'
import { Tower } from "../towers/tower";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    key: "lobby",
};

export class LobbyScene extends Phaser.Scene {
    public graphics: Phaser.GameObjects.Graphics | undefined;
    public lives: number;
    public path: Phaser.Curves.Path | undefined;
    private nextEnemy: number;

    constructor() {
        super(sceneConfig);
        this.nextEnemy = 1;
        this.lives = 100;
        this.setListeners()
    }

    public setListeners() {
        if (globals.socket) {
            globals.socket.on('startGame', (msg) => {
                if (globals.game) {
                    globals.game.scene.switch('lobby', 'main')
                }
            })
        }
    }

    private startGame() {
        if (globals.game) {
            globals.socket?.emit('startGame')
            globals.game.scene.switch('lobby', 'main')
        }
    }

    public create() {
        this.graphics = this.add.graphics();

        const startButton = this.add.text(100, 100, 'Start Game');
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', () => this.startGame())
    }
}
