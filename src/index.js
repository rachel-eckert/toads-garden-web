import Phaser from "phaser";
import Forest from "./scenes/Forest";
import Garden from "./scenes/Garden";
import Intro from "./scenes/Intro";
import Learn from "./scenes/Learn";
import Outro from "./scenes/Outro";
import Town from "./scenes/Town";
import Transition1 from "./scenes/Transition1";
import Transition2 from "./scenes/Transition2";
import Underwater from "./scenes/Underwater";

const config = {
  type: Phaser.AUTO,

  scale: {
    parent: "toad",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 650,
    height: 480,
  },

  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
  scene: [
    Intro,
    Learn,
    Garden,
    Transition1,
    Forest,
    Transition2,
    Underwater,
    Outro,
    Town,
  ],
};

new Phaser.Game(config);
