import { Scene } from "Phaser";

class Intro extends Scene {
  constructor(data) {
    super("Intro");
  }
  preload() {
    this.load.audio("garden", "../assets/audio/garden.mp3");
    this.load.image("background", "../assets/img/garden.png");
    this.load.image("tiles", "../assets/img/terrain.png");
    this.load.image("collectible", "../assets/img/icons.png");
    this.load.image("play-btn", "../assets/img/playButton.png");
    this.load.image("heartFull", "../assets/img/heartFull.png");
    this.load.image("heartEmpty", "../assets/img/heartEmpty.png");
    this.load.tilemapTiledJSON("map", "../assets/json/map.json");
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
    this.load.image("playButton", "../assets/img/playButton.png");
  }
  create(data) {
    const x = innerWidth / 2;
    const y = innerHeight / 2;
    this.add.image(960, 240, "background");

    //Text
    this.story = this.add
      .text(325, 220 / 1.2, "", {
        fill: "#29465B",
        align: "center",
      })
      .setOrigin(0.5)
      .setScale(x * 0.0018);

    this.typewriteText(
      "                \nToad's village is suffering. \n                \nThe toadspeople are victims of\na capitalist society.\n                 \nPlease help Toad collect \nmedicine, wood, and water to  \nprovide basic necessities.\n                \nYour mission is to collect 15 items in \neach stage to help build houses, \n provide medicine, and\n establish access to clean water.\n                \nThe fate of this village depends on you."
    );

    // Let's go button
    let gameButton = this.add.image(325, y + 15, "playButton").setScale(0.3);

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
      this.scene.start("Learn", {
        music: data.music,
      });
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
