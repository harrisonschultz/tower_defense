import Phaser from "phaser";
import { Enemy } from "../enemies/enemy";
import { Projectile } from "../projectiles/projectile";
import { globals } from "../globals";
import { BasicTower } from '../towers/basic'
import { BombTower } from '../towers/bomb'
import { Tower } from "../towers/tower";
import { Towers } from '../towers/towers'
import { World } from "../maps/world";
import { ImageButton } from '../UI/ImageButton'
import { TileMap } from "../maps/tilemap";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "main",
};

export class ScenarioScene extends Phaser.Scene {
  public graphics: Phaser.GameObjects.Graphics | undefined;
  public buildMenu: Phaser.GameObjects.Graphics | undefined;
  public lives: number;
  public path: Phaser.Curves.Path | undefined;
  public tileMap: TileMap | undefined;
  private livesUI: Phaser.GameObjects.Text | undefined;
  private goldUI: Phaser.GameObjects.Text | undefined;
  private buildMenuVisible: boolean
  private nextEnemy: number;
  private buildMenuX: number;
  private buildMenuY: number;
  private roundStarted: boolean
  private roundsDefinition: any;
  private currentRound: number;

  constructor() {
    super(sceneConfig);
    this.nextEnemy = 1;
    this.lives = 100;
    this.setListeners()
    this.buildMenuVisible = false
    this.buildMenuX = -100
    this.buildMenuY = -100
    this.roundStarted = false;
    this.currentRound = 0;
    this.roundsDefinition = [{ spawnRate: 1, basic: 10 }, { spawnRate: 2, basic: 20 }]
  }

  public preload() {
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("barrel", "assets/barrel.png");
    this.load.image("bookshelf", "assets/bookshelf.png");
    this.load.image("green_arrow", "assets/green_arrow.png");
    this.tileMap = new TileMap(this, 'prairie', this.showBuildMenu)
    this.tileMap.load()
  }

  public setListeners() {
    if (globals.socket) {
      globals.socket.on('createTower', (msg) => {
        this.findAndAddTower(this, msg.name, msg.x, msg.y)
      })
    }
  }

  public findAndAddTower(scene: Phaser.Scene, name: string, x: number, y: number, send?: boolean) {
    const tower = Towers.createTower(scene, name, x, y)
    if (tower) {
      if (send)
        if (tower.cost <= globals.gold) {
          tower.payForTower()
          this.addTowerToWorld(tower, x, y)
        } else {
          this.addTowerToWorld(tower, x, y)
        }
    }

    if (send) {
      globals.socket?.emit('createTower', { name: name, x, y })
    }
  }

  private addTowerToWorld(tower: Tower | undefined, x: number, y: number) {
    if (globals.towers && tower) {
      globals.towers.add(tower, true)
      tower.setActive(true);
      tower.setVisible(true);
      tower.place(x, y);
      if (globals.map) {
        globals.map[World.getMapCoordinate(y)][World.getMapCoordinate(x)] = 1;
      }
    }
  }

  private startRound() {
    this.roundStarted = true;
  }

  private endRound() {
    this.roundStarted = false;
    this.currentRound++;
  }

  public create() {
    // this graphics element is only for visualization,
    // its not related to our path
    this.graphics = this.add.graphics();
    this.graphics.setDepth(globals.zIndex.path)
    this.buildMenu = this.add.graphics();
    this.buildMenu.setDepth(globals.zIndex.ui)
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


    this.tileMap && this.tileMap.buildMap([
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
    ])

    // Set map
    globals.map = [
      [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
    ];

    // Add UI elements
    globals.buildMenu = this.add.group({ classType: Phaser.GameObjects.Sprite, runChildUpdate: true });
    globals.uiElements = this.add.group({ classType: Phaser.GameObjects.Sprite, runChildUpdate: true });
    const roundButton = new ImageButton(this, 550, 480, 'enemy', () => this.startRound())
    roundButton.setDepth(globals.zIndex.ui)
    globals.uiElements.add(roundButton, true)

    this.livesUI = this.add.text(500, 30, `${globals.lives}`, { color: "#FF4433" })
    this.goldUI = this.add.text(550, 30, `${globals.gold}`, { color: "#FDDA0D" })
    this.livesUI.setDepth(globals.zIndex.ui)
    this.goldUI.setDepth(globals.zIndex.ui)

    // Add enemies
    globals.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 1;

    // Add towers
    globals.towers = this.add.group({ classType: Tower, runChildUpdate: true });

    // Add projectiles
    globals.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: true });

    // Add projectile collision
    if (globals.enemies && globals.projectiles) {
      this.physics.add.overlap(globals.enemies, globals.projectiles, this.damageEnemy as any);
    }
  }

  damageEnemy(enemy: Enemy, bullet: Projectile) {
    bullet.activate(enemy)
  }

  public showBuildMenu = (event: any) => {
    const centerX = World.getCenterOfTile(event.x)
    const centerY = World.getCenterOfTile(event.y)
    if (this.buildMenuVisible && (Math.abs(event.y - this.buildMenuY) > 54 || Math.abs(event.x - this.buildMenuX) > 54 || Math.abs(event.x - this.buildMenuX) + Math.abs(event.y - this.buildMenuY) > 79)) {
      // Clear previous menu
      this.buildMenu?.clear();
      globals.buildMenu?.clear(true, true)
      this.buildMenuVisible = false
    } else if (!this.buildMenuVisible) {
      if (this.canPlaceTower(World.getMapCoordinate(event.x), World.getMapCoordinate(event.y))) {

        this.buildMenuVisible = true;

        this.buildMenu?.lineStyle(1, 0xffffff, 0.5);
        this.buildMenu?.strokeCircle(centerX, centerY, 48)

        this.buildMenuX = centerX
        this.buildMenuY = centerY

        const bombTowerButton = new ImageButton(this, centerX + 48, centerY, 'bomb', () => { this.findAndAddTower(this, 'bomb', centerX, centerY, true); this.buildMenu?.clear(); globals.buildMenu?.clear(true, true); this.buildMenuVisible = false })
        const arrowTowerButton = new ImageButton(this, centerX - 48, centerY, 'green_arrow', () => { this.findAndAddTower(this, 'basic', centerX, centerY, true); this.buildMenu?.clear(); globals.buildMenu?.clear(true, true); this.buildMenuVisible = false })
        bombTowerButton.setDepth(globals.zIndex.ui)
        arrowTowerButton.setDepth(globals.zIndex.ui)
        globals.buildMenu?.add(bombTowerButton, true)
        globals.buildMenu?.add(arrowTowerButton, true)
      }
    }
  }

  private canPlaceTower = (i: number, j: number) => {
    if (globals.map) {
      return globals.map[j][i] === 0;
    }
  };

  public drawGrid() {
    if (this.graphics) {
      this.graphics.lineStyle(0.7, 0xffffff, 0.8);
      for (var i = 1; i < globals.MAP_HEIGHT / globals.TILE_SIZE; i++) {
        this.graphics.moveTo(0, i * globals.TILE_SIZE);
        this.graphics.lineTo(globals.MAP_WIDTH, i * globals.TILE_SIZE);
      }
      for (var j = 1; j < globals.MAP_WIDTH / globals.TILE_SIZE; j++) {
        this.graphics.moveTo(j * globals.TILE_SIZE, 0);
        this.graphics.lineTo(j * globals.TILE_SIZE, globals.MAP_HEIGHT);
      }
      this.graphics.strokePath();
    }
  }

  public update = (time: number, delta: number) => {
    // if its time for the next enemy
    if (this.roundStarted && !!this.nextEnemy && globals.enemies && this.roundsDefinition[this.currentRound] && this.roundsDefinition[this.currentRound].basic > 0 && time > this.nextEnemy) {
      var enemy = globals.enemies.get();
      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);

        // place the enemy at the start of the path
        enemy.startOnPath(this.path);
        this.roundsDefinition[this.currentRound].basic -= 1;

        this.nextEnemy = time + (1000 / this.roundsDefinition[this.currentRound].spawnRate);
      }
    }

    if (this.roundsDefinition[this.currentRound].basic == 0 && globals.enemies && globals.enemies.countActive(true) < 1) {
      this.endRound()
    }

    if (this.livesUI) {
      this.livesUI.setText(`${globals.lives}`)
    }
    if (this.goldUI) {
      this.goldUI.setText(`${globals.gold}`)
    }
  };
}
