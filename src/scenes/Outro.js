import Phaser from "phaser";
import generateAnimations from "../config/animations";

var player;

var cursors;
var collectSound;
var witch;
var beachMusic;
var bunny;
var fox;
var octopus;
var crab;
var octPop;
var singlePlatform;
var foxy;
var bunny2;
var crab2;

class Outro extends Phaser.Scene {
  constructor(data) {
    super("Outro");
  }

  preload() {
    this.load.audio("beach", "../assets/audio/beach.mp3");
    this.load.audio("collect", "../assets/audio/collect.mp3");
    this.load.image("audioOnBlack", "../assets/img/audioOnBlack.png");
    this.load.image("audioOffBlack", "../assets/img/audioOffBlack.png");
    this.load.image("beach", "../assets/img/beach.png");
    this.load.image("tiles", "../assets/img/terrain.png");
    this.load.image("replay", "../assets/img/replay.png");

    this.load.image("play-btn", "../assets/img/playButton.png");

    this.load.tilemapTiledJSON("beachmap", "../assets/json/beach-scene.json");
    this.load.image("water", "../assets/img/water.png");
    this.load.image("singlePlatform", "../assets/img/singlePlatform.png");

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
    this.load.spritesheet("toad", "assets/img/toad.png", {
      frameWidth: 48,
      frameHeight: 44,
    });

    this.load.on("complete", () => {
      generateAnimations(this);
    });
  }

  create() {
    this.add.image(325, 240, "beach");

    // music;
    let click = 0;
    var beachMusic = this.sound.add("beach", { loop: true, volume: 0.1 });
    var collectSound = this.sound.add("collect", { loop: false, volume: 0.5 });
    beachMusic.play();
    let audioOn = this.add
      .image(620, 30, "audioOnBlack")
      .setScale(0.5)
      .setScrollFactor(0);
    audioOn.setInteractive();
    audioOn.on("pointerup", () => {
      if (click % 2 || click === 0) {
        collectSound.play({ volume: 0 });
        beachMusic.pause();
        audioOn = this.add.image(620, 30, "audioOffBlack").setScale(0.5);
        click++;
      } else {
        beachMusic.resume();
        audioOn = this.add.image(620, 30, "audioOnBlack").setScale(0.5);
        click++;
      }
      return click;
    });
    let gameButton = this.add.image(590, 30, "replay").setScale(0.6);

    gameButton.setInteractive();

    // gameButton.on("pointerover", () => {
    //   gameButton = this.add
    //     .image(x + 200, y * 1.85, "letsGo-red")
    //     .setScale(x * 0.0018);
    // });
    // gameButton.on("pointerout", () => {
    //   gameButton = this.add
    //     .image(x + 200, y * 1.85, "letsGo-white")
    //     .setScale(x * 0.0018);
    // });

    gameButton.on("pointerup", () => {
      this.scene.start("Garden");
      this.sound.removeByKey("beach");
    });
    this.physics.world.setBounds(0, 0, 650, 480);
    //invisible terrain
    const beachmap = this.make.tilemap({ key: "beachmap" });
    const tileset = beachmap.addTilesetImage("water", "water");
    const terrain = beachmap.createLayer("beach-floor", tileset);
    terrain.setCollisionByExclusion(-1);
    terrain.setVisible(false);
    singlePlatform = this.physics.add.staticGroup();
    singlePlatform
      .create(425, 375, "singlePlatform")
      .setScale(2)
      .refreshBody()
      .setVisible(false);

    singlePlatform
      .create(570, 400, "singlePlatform")
      .setScale(2)
      .refreshBody()
      .setVisible(false);

    singlePlatform
      .create(170, 395, "singlePlatform")
      .refreshBody()
      .setVisible(false);

    singlePlatform
      .create(75, 300, "singlePlatform")
      .refreshBody()
      .setVisible(false);
    //all npcs
    witch = this.physics.add
      .sprite(270, 400, "witch")
      .setFlipX(true)
      .setScale(2.5);
    witch.setCollideWorldBounds("true");
    witch.play("witchIdle");

    bunny = this.physics.add.sprite(500, 350, "bunny");
    bunny.play("bunnyIdle");
    bunny.setCollideWorldBounds("true");
    bunny2 = this.physics.add.sprite(166, 300, "bunny");
    bunny2.play("bunnyIdle");
    bunny2.setCollideWorldBounds("true");

    fox = this.physics.add.sprite(425, 375, "fox").setFlipX(true).setScale(2);
    foxy = this.physics.add.sprite(580, 300, "fox").setFlipX(true).setScale(2);
    fox.play("foxIdle");
    fox.setCollideWorldBounds("true");
    foxy.play("foxIdle");
    foxy.setCollideWorldBounds("true");

    octopus = this.physics.add
      .sprite(350, 400, "octopus")
      .setFlipX(true)
      .setScale(2);
    octopus.play("octIdle");
    octopus.setCollideWorldBounds("true");

    crab = this.physics.add.sprite(570, 375, "crab").setScale(2);
    crab.play("crabIdle");
    crab.setCollideWorldBounds("true");
    crab2 = this.physics.add.sprite(68, 200, "crab").setScale(2);
    crab2.play("crabIdle");
    crab2.setCollideWorldBounds("true");

    octPop = this.physics.add.sprite(425, 300, "octopus").setScale(2);
    octPop.play("octShow");
    octPop.setCollideWorldBounds("true");
    player = this.physics.add.sprite(80, 250, "toad");
    player.setCollideWorldBounds("true");
    player.setBounce(0.2);
    //all colliders
    this.physics.add.collider(player, terrain);
    this.physics.add.collider(octPop, singlePlatform);
    this.physics.add.collider(foxy, singlePlatform);
    this.physics.add.collider(bunny2, singlePlatform);
    this.physics.add.collider(crab2, singlePlatform);
    this.physics.add.collider(witch, terrain);
    this.physics.add.collider(bunny, terrain);
    this.physics.add.collider(fox, terrain);
    this.physics.add.collider(octopus, terrain);
    this.physics.add.collider(crab, terrain);
    this.physics.add.collider(octPop, terrain);

    cursors = this.input.keyboard.createCursorKeys();
    //text
    this.story = this.add
      .text(325, 155 / 1.2, "", {
        fill: "#29465B",
        align: "center",
      })
      .setOrigin(0.5);

    this.typewriteText(
      "                \nToad, you did it!!\n                 \nWith your help our village can build houses,\nprovide free medical care, and have \naccess to clean water!! \n                 \nThe bunnies, foxes, crabs, and octopuses have \ncome together to celebrate this achievement! \n                \nPlay again to gather even more supplies \nfor the village!\n                \nBut for now...\n                \nLet's party!!!"
    );
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
  }

  typewriteText(text) {
    const length = text.length;
    let i = 0;
    this.time.addEvent({
      callback: () => {
        this.story.text += text[i];
        i++;
      },
      repeat: length - 1,
      delay: 40,
    });
  }
}

export default Outro;
