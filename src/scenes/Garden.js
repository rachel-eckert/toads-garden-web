import Phaser from "phaser";
import generateAnimations from "../config/animations";
import { Toad } from "../gameObjects/Toad.js";
var cursors;
var player;
var CollectibleLayer;
var EnemyLayer;
var cameras;
var collectibles;
var score = 0;
var text;
var bunnies;
var gardenMusic;
var collectSound;
var pipeSound;
var gameOver = false;
var pauseButton;

class Garden extends Phaser.Scene {
  constructor() {
    super("Garden");
  }
  preload() {
    this.load.audio("garden", "../assets/audio/garden.mp3"); //garden audio
    this.load.audio("collect", "../assets/audio/collect.mp3"); //collect audio
    this.load.audio("pipeSound", "../assets/audio/pipeSound.mp3"); //pipe audio
    this.load.image("background", "../assets/img/garden.png"); //background
    this.load.image("audioOnBlack", "../assets/img/audioOnBlack.png"); //musicOn
    this.load.image("audioOffBlack", "../assets/img/audioOffBlack.png"); //musicOff
    this.load.image("pauseBlack", "../assets/img/pauseBlack.png");
    this.load.image("tiles", "../assets/img/terrain.png"); //terrain
    this.load.image("collectible", "../assets/img/icons.png"); //icons
    this.load.image("play-btn", "../assets/img/playButton.png"); //playButton
    this.load.tilemapTiledJSON("map", "../assets/json/map.json"); //map.json
    this.load.image("plantTiles", "../assets/img/mushroom.png"); //plants
    this.load.image("pipe", "../assets/img/pipe.png"); //pipe
    this.load.spritesheet("toad", "assets/img/toad.png", {
      frameWidth: 48,
      frameHeight: 44,
    });
    this.load.on("complete", () => {
      generateAnimations(this);
    });
    this.load.atlas(
      "bunny",
      "./assets/img/bunny.png",
      "./assets/json/bunny_atlas.json"
    );
    this.load.atlas(
      "fox",
      "./assets/img/fox.png",
      "./assets/json/fox_atlas.json"
    );
    this.load.atlas(
      "octopus",
      "./assets/img/oct.png",
      "./assets/json/oct_atlas.json"
    );
    this.load.atlas(
      "crab",
      "./assets/img/crab.png",
      "./assets/json/crab_atlas.json"
    );
    this.load.atlas(
      "witch",
      "./assets/img/witch.png",
      "./assets/json/witch_atlas.json"
    );
  }
  create() {
    const x = innerWidth / 2;
    const y = innerHeight / 2;

    this.add.image(960, 240, "background");
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    //music
    let click = 0;
    let isPaused = false;
    var collectSound = this.sound.add("collect", { loop: false, volume: 0.5 });
    var pipeSound = this.sound.add("pipeSound", { loop: false, volume: 0.5 });
    var gardenMusic = this.sound.add("garden", { loop: true, volume: 0.1 });
    gardenMusic.play();
    let audioOn = this.add
      .image(620, 30, "audioOnBlack")
      .setScale(0.5)
      .setScrollFactor(0);
    audioOn.setInteractive();
    audioOn.on("pointerup", () => {
      if (click % 2 || click === 0) {
        collectSound.play({ volume: 0 });
        gardenMusic.pause();
        audioOn = this.add
          .image(620, 30, "audioOffBlack")
          .setScale(0.5)
          .setScrollFactor(0);
        click++;
      } else {
        collectSound.play({ volume: 0.5 });
        gardenMusic.resume();
        audioOn = this.add
          .image(620, 30, "audioOnBlack")
          .setScale(0.5)
          .setScrollFactor(0);
        click++;
      }
      return click;
    });
    let pauseButton = this.add
      .image(590, 31, "pauseBlack")
      .setScale(0.5)
      .setScrollFactor(0);

    pauseButton.setInteractive();
    pauseButton.on("pointerup", () => {
      this.isPaused = !this.isPaused;
      if (!this.isPaused) {
        this.game.loop.sleep();
      } else {
        this.game.loop.wake();
      }
    });

    //platforms and ground
    let pipe = this.add.image(1850, 420, "pipe");
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("terrain", "tiles");
    const plantTileset = map.addTilesetImage("plants", "plantTiles");

    const invisiblePlayer = map
      .createLayer("pipeInvisible", tileset)
      .setVisible(false);
    const ground = map.createLayer("ground", tileset);
    const platforms = map.createLayer("platform", tileset);
    const invisible = map.createLayer("invisible", tileset).setVisible(false);
    const plants = map.createLayer("mushroom", plantTileset);
    collectibles = this.physics.add.staticGroup();
    CollectibleLayer = map.getObjectLayer("CollectibleLayer")["objects"];
    EnemyLayer = map.getObjectLayer("EnemyLayer")["objects"];

    platforms.setCollisionByExclusion(-1);
    invisible.setCollisionByExclusion(-1);
    ground.setCollisionByExclusion(-1);

    //cursors
    cursors = this.input.keyboard.createCursorKeys();
    this.inputs = this.input.keyboard.createCursorKeys();
    invisiblePlayer.setCollisionByExclusion(-1);

    //bunnies
    bunnies = this.physics.add.group({
      key: "bunny",
    });

    EnemyLayer.forEach((object) => {
      let bunnyObj = bunnies.create(object.x, object.y, "bunny");
      bunnyObj.setScale(object.width / 28.5, object.height / 37);
      bunnyObj.setOrigin(0);
      bunnyObj.body.width = object.width;
      bunnyObj.direction = "RIGHT";
      bunnyObj.body.height = object.height;
      bunnyObj.setSize(50, 44, true);
      bunnyObj.setOffset(0, 32);
    });

    this.physics.add.collider(bunnies, ground);
    this.physics.add.collider(bunnies, invisible);

    //toad
    player = new Toad(this, 100, 400)
      .collideWith([ground, platforms, invisiblePlayer])
      .overlapWith(collectibles, collect)
      .hitEnemy(bunnies, hitBunny);

    //collectibles
    CollectibleLayer.forEach((object) => {
      let obj = collectibles.create(object.x, object.y, "collectible");
      obj.setScale(object.width / 16, object.height / 16);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
      obj.setSize(50, 44, true);
      obj.setOffset(16, 20);
    });

    //score
    text = this.add
      .text(20, 23, `Herbs Collected: ${score} / 15`, {
        fontSize: "20px",
        fill: "#000000",
      })
      .setScrollFactor(0);

    //collect
    function collect(player, collectible) {
      collectible.destroy(collectible.x, collectible.y);
      collectSound.play();
      score++;
      text.setText(`Herbs Collected: ${score} / 15`);
      return false;
    }
    //hit enemy
    function hitBunny(player, bunnies) {
      gardenMusic.stop();
      gameIsOver();
    }
    function gameIsOver() {
      gameOver = true;

      player.die();
      score = 0;
    }
    this.physics.add.overlap(player, collectibles, collect, null, this);
  }

  update() {
    player.update(this.inputs);
    //bunny movement
    for (const bunny of bunnies.children.entries) {
      if (bunny.body.blocked.left) {
        bunny.direction = "RIGHT";
        bunny.play("bunnyRunRight", true);
      }
      if (bunny.body.blocked.right) {
        bunny.direction = "LEFT";
        bunny.play("bunnyRunLeft", true);
      }
      if (bunny.direction === "RIGHT") {
        bunny.setVelocityX(100).setFlipX(true);
      } else {
        bunny.setVelocityX(-100).setFlipX(false);
      }
    }
    //pipe to next scene location
    var xDifference = Math.abs(Math.floor(player.sprite.x) - 1853);
    var yDifference = Math.abs(Math.floor(player.sprite.y) - 362);
    var threshhold = 5;
    var xThreshhold = 30;
    if (
      xDifference <= xThreshhold &&
      yDifference <= threshhold &&
      score >= 15
    ) {
      this.scene.start("Transition1");
      score = 0;
      this.sound.play("pipeSound");
      this.sound.removeByKey("garden");
    }
  }
}
export default Garden;
