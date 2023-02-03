import Phaser from "Phaser";
import Forest from "./scenes/Forest";
import Garden from "./scenes/Garden";
import Hearts from "./scenes/hearts";
import Underwater from "./scenes/Underwater";

const config = {
  type: Phaser.AUTO,
  width: 650,
  height: 480,
  parent: "toad",
  //backgroundColor: "#BCEDF6",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  scene: [Garden, Hearts, Forest, Underwater],
};

new Phaser.Game(config);
