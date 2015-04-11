"use strict";

var game = new Phaser.Game(1800, 1080, Phaser.AUTO, 'game');

var PhaserGame = function(game) {
  // map
  this.map = null;
  this.layer = null;
  this.gridsize = 90;

  // Player
  this.player1 = null;
};

PhaserGame.prototype = {
  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function() {
    this.load.crossOrigin = 'anonymous';

    this.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('floor', 'img/tiles/floor.png');
    this.load.image('wall', 'img/tiles/wall.png');

    this.load.image('player1', 'img/player.png');
  },

  create: function() {
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('floor', 'floor');
    this.map.addTilesetImage('wall', 'wall');

    this.layer = this.map.createLayer('Map1');

    // Add the player to the game
    this.player1 = this.add.sprite(150, 150, 'player1');
    this.player1.anchor.set(0.5);

    // physics
    this.map.setCollision(20, true, this.layer);
    this.physics.arcade.enable(this.player1);

    // Player's control
    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function ()
  {
    this.physics.arcade.collide(this.player1, this.layer);
    this.checkKeys();
  },

  checkKeys: function () {
    if (this.cursors.left.isDown)
    {
      this.move(Phaser.LEFT)
    }
    else if (this.cursors.right.isDown)
    {
      this.move(Phaser.RIGHT)
    }
    else if (this.cursors.up.isDown)
    {
      this.move(Phaser.UP)
    }
    else if (this.cursors.down.isDown)
    {
      this.move(Phaser.DOWN);
    }
    else
    {
      this.move()
    }
  },

  move: function (direction)
  {
    var speed = 200;
    if (direction === Phaser.LEFT)
    {
      this.player1.body.velocity.x = -speed;
      this.player1.body.velocity.y = 0;
    }

    else if (direction === Phaser.UP)
    {
      this.player1.body.velocity.x = 0;
      this.player1.body.velocity.y = -speed;
    }

    else if (direction === Phaser.RIGHT)
    {
      this.player1.body.velocity.x = speed;
      this.player1.body.velocity.y = 0;
    }

    else if (direction === Phaser.DOWN)
    {
      this.player1.body.velocity.x = 0;
      this.player1.body.velocity.y = speed;
    }
    else
    {
      this.player1.body.velocity.x = 0;
      this.player1.body.velocity.y = 0;
    }
  },
};

game.state.add('game', PhaserGame, true);
