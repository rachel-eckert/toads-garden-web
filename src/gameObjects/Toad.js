export class Toad extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, hp = null, heartCount = null) {
    super(scene, x, y, "toad");
    const useDeadZone = false;
    this.scene = scene;
    this.sprite = this.scene.physics.add.sprite(x, y, "toad");
    this.sprite.isDed = false;

    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0.1);
    this.sprite.setSize(40, 40);
    this.sprite.setOffset(4, 4);
    //camera follow and deadzones
    scene.cameras.main.setBounds(0, 0, 1920, 480).startFollow(this.sprite);

    if (useDeadZone) {
      scene.cameras.main.setDeadzone(
        scene.game.config.width / 4,
        scene.game.config.height
      );
    }

    return this;
  }
  //toad colliders
  collideWith(gameObject) {
    this.collider = this.scene.physics.add.collider(this.sprite, gameObject);
    return this;
  }
  overlapWith(gameObject, func) {
    this.collider = this.scene.physics.add.overlap(
      this.sprite,
      gameObject,
      func
    );
    return this;
  }

  hitEnemy(gameObject, func) {
    this.collider = this.scene.physics.add.collider(
      this.sprite,
      gameObject,
      func
    );
    return this;
  }
  //camera following player
  reFollowPlayer() {
    this.scene.physics.world.bounds.setPosition(
      this.scene.cameras.main.worldView.x,
      0
    );

    if (
      this.sprite.body.position.x + this.sprite.body.width / 2 >
        this.scene.cameras.main.midPoint.x &&
      !this.scene.cameras.main._follow
    ) {
      this.scene.cameras.main.startFollow(this.sprite);
    }
  }

  create() {}

  update(input) {
    if (this.gameOver) {
      return;
    }
    //movements
    if (input.left.isDown) {
      this.sprite.setVelocityX(-200).setFlipX(true);
      this.sprite.play("left", true);
      this.reFollowPlayer();
    } else if (input.right.isDown) {
      this.sprite.setVelocityX(200).setFlipX(false);
      this.sprite.play("right", true);
      this.reFollowPlayer();
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.play("turn", true);
    }

    if (input.up.isDown && this.sprite.body.onFloor()) {
      this.sprite.setVelocityY(-250);
      this.sprite.play("turn", true);
    }
  }
  //death function
  die() {
    this.sprite.setTint(0xff0000);
    this.sprite.isDed = true;
    this.sprite.setVelocity(0, -500);
    this.scene.cameras.main.fade(800);
    this.sprite.setCollideWorldBounds("false");
    this.scene.physics.world.removeCollider(this.scene.collider);

    function restart() {
      this.scene.scene.restart();
    }
    this.scene.time.delayedCall(800, restart, [], this);
  }
}
