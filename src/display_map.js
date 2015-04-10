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
    
    this.load.tilemap('map', 'json/test.json', null, Phaser.Tilemap.TILED_JSON);
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
    this.player1 = this.add.sprite(45, 45, 'player1');
    this.player1.anchor.set(0.5);

    // Player's control
    this.physics.arcade.enable(this.player1);
    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {
    this.checkKeys();
  },

  checkKeys: function () {
      if (this.cursors.left.isDown) {
        this.move(Phaser.LEFT)
      } else if (this.cursors.right.isDown) {
          this.move(Phaser.RIGHT)
      }
      
      if (this.cursors.up.isDown) {
         this.move(Phaser.UP)
      } else if (this.cursors.down.isDown) {
          this.move(Phaser.DOWN);
      }
  },
};

game.state.add('game', PhaserGame, true);
