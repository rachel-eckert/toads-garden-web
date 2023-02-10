import Phaser from "phaser";
import generateAnimations from "../config/animations";

var witch;
var player;
var cursors;
var pipe;
var cameras;
var pipeSound;
var singlePlatform;

class Transition1 extends Phaser.Scene {
  constructor() {
    super("Transition1");
  }
  preload() {
    this.load.image("garden-forest", "../assets/img/garden-forest.png");
    this.load.image("pipe", "../assets/img/pipe.png");
    this.load.tilemapTiledJSON("beachmap", "../assets/json/beach-scene.json");
    this.load.image("water", "../assets/img/water.png");
    this.load.audio("pipeSound", "../assets/audio/pipeSound.mp3");
    this.load.image("singlePlatform", "../assets/img/singlePlatform.png");
    this.load.spritesheet("toad", "assets/img/toad.png", {
      frameWidth: 48,
      frameHeight: 44,
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
    this.load.on("complete", () => {
      generateAnimations(this);
    });
  }
  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.add.image(325, 240, "garden-forest");
    pipe = this.add.image(575, 450, "pipe");
    const beachmap = this.make.tilemap({ key: "beachmap" });
    const tileset = beachmap.addTilesetImage("water", "water");
    const terrain = beachmap.createLayer("beach-floor", tileset);
    terrain.setCollisionByExclusion(-1);
    terrain.setVisible(false);
    var pipeSound = this.sound.add("pipeSound", { loop: false, volume: 0.5 });
    singlePlatform = this.physics.add.staticGroup();
    singlePlatform
      .create(575, 415, "singlePlatform")
      .setScale(1.2)
      .refreshBody()
      .setVisible(false);

    //add witch
    witch = this.physics.add
      .sprite(400, 400, "witch")
      .setFlipX(true)
      .setScale(2.5);
    witch.setCollideWorldBounds("true");
    witch.play("witchIdle");
    //toad
    player = this.physics.add.sprite(300, 400, "toad");
    player.setCollideWorldBounds("true");
    player.setBounce(0.2);
    player.setSize(40, 40);
    player.setOffset(4, 4);
    this.physics.add.collider(player, terrain);
    this.physics.add.collider(player, singlePlatform);

    cursors = this.input.keyboard.createCursorKeys();
    //text
    this.add.text(175, 90, "Congrats on completing Level 1!", {
      fontSize: "15px",
      fill: "#29465B",
      align: "center",
    });
    this.add.text(170, 120, "I'll make medicine with the herbs!", {
      fontSize: "15px",
      fill: "#29465B",
      align: "center",
    });
    this.add.text(135, 150, "To go to the next world, jump into the pipe!", {
      fontSize: "15px",
      fill: "#29465B",
      align: "center",
    });
  }
  update() {
    //toad movement
    if (cursors.left.isDown) {
      player.setVelocityX(-160).setFlipX(true);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160).setFlipX(false);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.onFloor()) {
      player.setVelocityY(-250);
    }
    //pipe to next scene location

    var xDifference = Math.abs(Math.floor(player.body.x) - 557);
    var yDifference = Math.abs(Math.floor(player.body.y) - 366);
    var threshhold = 5;
    var xThreshhold = 30;
    if (xDifference <= xThreshhold && yDifference <= threshhold) {
      this.scene.start("Forest");
      this.sound.play("pipeSound");
    }
  }
}

export default Transition1;
