import Phaser from "phaser";
import generateAnimations from "../config/animations";

var player;
var wood;
var plant;
var cursors;
var pipe;
var singlePlat;
var introMusic;
var collectSound;
var pipeSound;
var bubble;
var cameras;
class Learn extends Phaser.Scene {
  constructor(data) {
    super("Learn");
  }

  preload() {
    this.load.audio("intro", "../assets/audio/intro.mp3");
    this.load.audio("collect", "../assets/audio/collect.mp3");
    this.load.audio("pipeSound", "../assets/audio/pipeSound.mp3");
    this.load.image("audioOnBlack", "../assets/img/audioOnBlack.png");
    this.load.image("audioOffBlack", "../assets/img/audioOffBlack.png");
    this.load.image("background", "../assets/img/garden.png");
    this.load.image("tiles", "../assets/img/terrain.png");
    this.load.image("plant", "../assets/img/icons.png");
    this.load.image("play-btn", "../assets/img/playButton.png");
    this.load.tilemapTiledJSON("learnmap", "../assets/json/learnmap.json");
    this.load.image("plantTiles", "../assets/img/mushroom.png");
    this.load.image("wood", "../assets/img/wood.png");
    this.load.image("pipe", "../assets/img/pipe.png");
    this.load.image("bubbles", "../assets/img/bubble_1.png"); //icons
    this.load.image("singlePlatform", "../assets/img/singlePlatform.png");
    this.load.spritesheet("toad", "assets/img/toad.png", {
      frameWidth: 48,
      frameHeight: 44,
    });
    this.load.on("complete", () => {
      generateAnimations(this);
    });
    //LOAD ALL ATLASES
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
    this.add.image(960, 240, "background");

    //music
    let click = 0;
    var collectSound = this.sound.add("collect", { loop: false, volume: 0.5 });
    var pipeSound = this.sound.add("pipeSound", { loop: false, volume: 0.5 });
    var introMusic = this.sound.add("intro", { loop: true, volume: 0.1 });
    introMusic.play();
    let audioOn = this.add
      .image(620, 30, "audioOnBlack")
      .setScale(0.5)
      .setScrollFactor(0);
    audioOn.setInteractive();
    audioOn.on("pointerup", () => {
      if (click % 2 || click === 0) {
        collectSound.play({ volume: 0 });
        introMusic.pause();
        audioOn = this.add.image(620, 30, "audioOffBlack").setScale(0.5);
        click++;
      } else {
        introMusic.resume();
        audioOn = this.add.image(620, 30, "audioOnBlack").setScale(0.5);
        click++;
      }
      return click;
    });

    //creating items + terrain for scene
    this.physics.world.setBounds(0, 0, 650, 480);
    pipe = this.add.image(575, 420, "pipe");
    const learnmap = this.make.tilemap({ key: "learnmap" });
    const tileset = learnmap.addTilesetImage("terrain", "tiles");
    const ground = learnmap.createLayer("learn-terrain", tileset);

    ground.setCollisionByExclusion(-1);
    singlePlat = this.physics.add.staticGroup();
    singlePlat.create(100, 350, "singlePlatform").setScale(2).refreshBody();
    singlePlat.create(300, 300, "singlePlatform").setScale(2).refreshBody();
    singlePlat.create(550, 250, "singlePlatform").setScale(2).refreshBody();
    singlePlat.create(575, 384, "singlePlatform").setScale(2).setVisible(false);
    plant = this.physics.add.staticGroup();
    plant.create(100, 200, "plant").setScale(1.5);
    wood = this.physics.add.staticGroup();
    wood.create(300, 400, "wood").setScale(1.5);
    bubble = this.physics.add.staticGroup();
    bubble.create(550, 175, "bubbles").setScale(1.5);
    player = this.physics.add.sprite(100, 400, "toad");
    player.setCollideWorldBounds("true");
    player.setBounce(0.2);
    player.setSize(40, 40);
    player.setOffset(4, 4);

    cursors = this.input.keyboard.createCursorKeys();

    //functions
    function collect(player, obj) {
      obj.destroy(obj.x, obj.y);
      collectSound.play();
      return false;
    }

    //add colliders
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, singlePlat);
    this.physics.add.overlap(player, plant, collect, null, this);
    this.physics.add.overlap(player, wood, collect, null, this);
    this.physics.add.overlap(player, bubble, collect, null, this);

    //text
    this.story = this.add
      .text(325, 155 / 1.2, "", {
        fill: "#29465B",
        align: "center",
      })
      .setOrigin(0.5);

    this.typewriteText(
      "                \nUse left, right, and up to move.\n                 \nYou must collect 15 items to move on.\n                \nThere aren't any enemies here but \nwatch out for wildlife on your journey!"
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

    //pipe to next scene location
    var xDifference = Math.abs(Math.floor(player.body.x) - 548);
    var yDifference = Math.abs(Math.floor(player.body.y) - 336);
    var threshhold = 5;
    var xThreshhold = 30;
    if (xDifference <= xThreshhold && yDifference <= threshhold) {
      this.scene.start("Garden");
      this.sound.play("pipeSound");
      this.sound.removeByKey("intro");
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

export default Learn;
