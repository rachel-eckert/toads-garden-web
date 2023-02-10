import Phaser from "phaser";
import generateAnimations from "../config/animations";

var cursors;
var player;
var score = 0;
var text;
var bubbles;
var EnemyLayerCrab;
var EnemyLayerOct;
var octopuses;
var crabs;
var gameOver = false;
var cameras;
var pipe;
var waterMusic;
var collectSound;
var pipeSound;

class Underwater extends Phaser.Scene {
  constructor() {
    super({
      key: "Underwater",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 50 },
        },
      },
    });
  }
  preload() {
    this.load.audio("water", "../assets/audio/water.mp3"); //water audio
    this.load.audio("collect", "../assets/audio/collect.mp3"); // collect audio
    this.load.audio("pipeSound", "../assets/audio/pipeSound.mp3"); //pipe audio
    this.load.image("waterbg", "../assets/img/waterbg.png"); //background
    this.load.image("audioOn", "../assets/img/audioOn.png"); //musicOn
    this.load.image("audioOff", "../assets/img/audioOff.png"); //musicOff
    this.load.image("water", "../assets/img/water.png"); //terrain
    this.load.image("bubbles", "../assets/img/bubble_1.png"); //icons
    this.load.image("pauseWhite", "../assets/img/pauseWhite.png");
    this.load.tilemapTiledJSON("waterMap", "../assets/json/watermap.json"); //map.json
    this.load.image("pipe", "../assets/img/pipe.png"); //pipe
    this.load.spritesheet("toad", "assets/img/toad.png", {
      frameWidth: 48,
      frameHeight: 44,
    });

    this.load.on("complete", () => {
      generateAnimations(this);
    });

    this.load.atlas(
      "octopus",
      "./assets/img/oct.png",
      "./assets/json/oct_atlas.json"
    ); //octupus
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
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBounds(0, 0, 1920, 480);
    this.physics.world.setBounds(0, 0, 1920, 480);
    let isPaused = false;
    //cursors
    this.inputs = this.input.keyboard.createCursorKeys();
    cursors = this.input.keyboard.createCursorKeys();

    //platforms and ground
    this.add.image(960, 240, "waterbg");
    const waterMap = this.make.tilemap({ key: "waterMap" });
    const waterTile = waterMap.addTilesetImage("water", "water");
    const waterPipe = waterMap
      .createLayer("water-pipe", waterTile)
      .setVisible(false);
    const waterGround = waterMap
      .createLayer("water-ground", waterTile)
      .setVisible(false);
    const invisEnemyBlock = waterMap
      .createLayer("invisEnemyBlock", waterTile)
      .setVisible(false);
    const bubbleInvis = waterMap
      .createLayer("bubble-layer", waterTile)
      .setVisible(false);
    invisEnemyBlock.setCollisionByExclusion(-1);
    bubbleInvis.setCollisionByExclusion(-1);
    waterPipe.setCollisionByExclusion(-1);
    waterGround.setCollisionByExclusion(-1);

    //pipe image
    let pipe = this.add.image(1850, 420, "pipe");

    //collectibles
    bubbles = this.physics.add.group({
      key: "bubbles",
    });

    function createBubbles() {
      bubbles.create(
        100 + Math.random() * 1850,
        100 + Math.random() * 300,
        "bubbles"
      );
    }
    for (let i = 0; i < 16; i++) {
      createBubbles();
    }
    bubbles.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.9, 1.0));
    });
    this.physics.add.collider(bubbles, waterGround);
    this.physics.add.collider(bubbles, waterPipe);
    this.physics.add.collider(bubbles, bubbleInvis);

    //music
    let click = 0;
    var collectSound = this.sound.add("collect", { loop: false, volume: 0.5 });
    var pipeSound = this.sound.add("pipeSound", { loop: false, volume: 0.5 });
    var waterMusic = this.sound.add("water", { loop: true, volume: 0.1 });
    waterMusic.play();
    let audioOn = this.add
      .image(620, 30, "audioOn")
      .setScale(0.5)
      .setScrollFactor(0);
    audioOn.setInteractive();
    audioOn.on("pointerup", () => {
      if (click % 2 || click === 0) {
        collectSound.play({ volume: 0 });
        waterMusic.pause();
        audioOn = this.add
          .image(620, 30, "audioOff")
          .setScale(0.5)
          .setScrollFactor(0);
        click++;
      } else {
        collectSound.play({ volume: 0.5 });
        waterMusic.resume();
        audioOn = this.add
          .image(620, 30, "audioOn")
          .setScale(0.5)
          .setScrollFactor(0);
        click++;
      }
      return click;
    });

    //octopuses
    EnemyLayerOct = waterMap.getObjectLayer("EnemyLayerOct")["objects"];
    octopuses = this.physics.add.group({ key: "octopus" });
    EnemyLayerOct.forEach((object) => {
      let octObj = octopuses.create(object.x, object.y, "octopus");
      octObj.setScale(object.width / 12, object.height / 12);
      octObj.setOrigin(0);
      octObj.setSize(14, 16, true);
      octObj.setOffset(8, 6);
      octObj.body.width = object.width;

      octObj.direction = "DOWN";

      octObj.body.height = object.height;
    });
    this.physics.add.collider(octopuses, waterGround);
    this.physics.add.collider(octopuses, invisEnemyBlock);

    //crabs
    EnemyLayerCrab = waterMap.getObjectLayer("EnemyLayerCrab")["objects"];
    crabs = this.physics.add.group({ key: "crab" });
    EnemyLayerCrab.forEach((object) => {
      let crabObj = crabs.create(object.x, object.y, "crab");
      crabObj.setScale(object.width / 16, object.height / 16);
      crabObj.setOrigin(0);
      crabObj.setSize(20, 16, true);
      crabObj.setOffset(6, 0);
      crabObj.body.width = object.width;
      crabObj.direction = "RIGHT";
      crabObj.body.height = object.height;
    });
    this.physics.add.collider(crabs, waterGround);
    this.physics.add.collider(crabs, invisEnemyBlock);

    //score
    text = this.add
      .text(20, 23, `Bubbles Collected: ${score} / 15`, {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setScrollFactor(0);

    //collect bubbles
    function collect(player, collectibleBubble) {
      collectibleBubble.destroy(collectibleBubble.x, collectibleBubble.y);
      collectSound.play();
      score++;
      text.setText(`Bubbles Collected: ${score} / 15`);
      return false;
    }

    //TOAD
    player = this.physics.add.sprite(100, 400, "toad");
    player.setCollideWorldBounds("true");
    player.setBounce(0.2);
    player.setSize(40, 40);
    player.setOffset(4, 4);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);
    this.physics.add.collider(player, waterGround);
    this.physics.add.collider(player, waterPipe);
    this.physics.add.collider(player, bubbles, collect, null, this);
    this.physics.add.collider(player, octopuses, die, null, this);
    this.physics.add.collider(player, crabs, die, null, this);
    cursors = this.input.keyboard.createCursorKeys();
    function die(player) {
      waterMusic.stop();
      player.setTint(0xff0000);
      this.cameras.main.fade(800);
      player.setVelocity(0, -500);

      function restart() {
        this.scene.restart();
        score = 0;
      }
      this.time.delayedCall(800, restart, [], this);
    }
    let pauseButton = this.add
      .image(590, 31, "pauseWhite")
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
  }

  update() {
    //octopus movement
    for (const oct of octopuses.children.entries) {
      if (oct.body.blocked.up) {
        oct.direction = "DOWN";
        oct.play("octSwimDown", true);
      }
      if (oct.body.blocked.down) {
        oct.direction = "UP";
        oct.play("octSwimUp", true);
      }
      if (oct.direction === "DOWN") {
        oct.setVelocityY(100);
      } else {
        oct.setVelocityY(-100);
      }
    }
    //crab movement
    for (const crab of crabs.children.entries) {
      if (crab.body.blocked.left) {
        crab.direction = "RIGHT";
        crab.play("crabWalkLeft", true);
      }
      if (crab.body.blocked.right) {
        crab.direction = "LEFT";
        crab.play("crabWalkRight", true);
      }
      if (crab.direction === "RIGHT") {
        crab.setVelocityX(80).setFlipX(false);
      } else {
        crab.setVelocityX(-80).setFlipX(true);
      }
    }
    //toad movement
    if (cursors.left.isDown) {
      player.setVelocityX(-75).setFlipX(true);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(75).setFlipX(false);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-75);
    }
    if (cursors.down.isDown) {
      player.setVelocityY(75);
    }

    //pipe to next scene location
    var xDifference = Math.abs(Math.floor(player.body.x) - 1825);
    var yDifference = Math.abs(Math.floor(player.body.y) - 340);
    var threshhold = 5;
    var xThreshhold = 30;
    if (
      xDifference <= xThreshhold &&
      yDifference <= threshhold &&
      score >= 15
    ) {
      this.scene.start("Outro");
      score = 0;
      this.sound.play("pipeSound");
      this.sound.removeByKey("water");
    }
  }
}

export default Underwater;
