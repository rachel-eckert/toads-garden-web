import { Scene } from "phaser";
import generateAnimations from "../config/animations";
var witch;
var singlePlatform;
var contributions;

class Intro extends Scene {
  constructor() {
    super("Intro");
  }
  preload() {
    //load all assets
    this.load.image("background", "../assets/img/garden.png");
    this.load.image("tiles", "../assets/img/terrain.png");
    this.load.image("collectible", "../assets/img/icons.png");
    this.load.image("play-btn", "../assets/img/playButton.png");
    this.load.tilemapTiledJSON("map", "../assets/json/map.json");
    this.load.image("singlePlatform", "../assets/img/singlePlatform.png");
    this.load.image("plantTiles", "../assets/img/mushroom.png");
    this.load.image("pipe", "../assets/img/pipe.png");
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
    this.load.image("playButton", "../assets/img/playButton.png");
  }
  create() {
    this.add.image(960, 240, "background");
    //add invisible platform
    contributions = this.add.text(
      475,
      410,
      "Developed By: Catherine Onia, Rachel Eckert, Marcela Alonso, and Lindsay Powell",
      { fontSize: "10px", fill: "#29465B" }
    );
    this.add.text(
      470,
      420,
      "Rachel Eckert, Marcela Alonso, and Lindsay Powell",
      { fontSize: "10px", fill: "#29465B" }
    );
    this.add.text(505, 430, "and Lindsay Powell", {
      fontSize: "10px",
      fill: "#29465B",
    });
    this.add.text(545, 440, "2023", {
      fontSize: "10px",
      fill: "#29465B",
    });
    singlePlatform = this.physics.add.staticGroup();
    singlePlatform
      .create(580, 410, "singlePlatform")
      .setScale(2)
      .refreshBody()
      .setVisible(false);

    //add witch
    witch = this.physics.add
      .sprite(580, 300, "witch")
      .setFlipX(true)
      .setScale(2.5);
    witch.setCollideWorldBounds("true");
    this.physics.add.collider(witch, singlePlatform);
    witch.play("witchIdle");

    //Text
    this.story = this.add
      .text(325, 220 / 1.2, "", {
        fill: "#29465B",
        align: "center",
      })
      .setOrigin(0.5);

    this.typewriteText(
      "                \nToad's village is suffering. \n                \nThe toadspeople are victims of\na capitalist society.\n                 \nPlease help Toad collect \nmedicine, wood, and water to  \nprovide basic necessities.\n                \nYour mission is to collect 15 items in \neach stage to help build houses, \n provide medicine, and\n establish access to clean water.\n                \nThe fate of this village depends on you."
    );

    // Let's go button
    let gameButton = this.add.image(325, 415, "playButton").setScale(0.3);

    gameButton.setInteractive();

    gameButton.on("pointerup", () => {
      this.scene.start("Learn");
    });
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

export default Intro;
