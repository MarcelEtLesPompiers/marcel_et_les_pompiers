"use strict";

//
// Config
//
var startFire = [
  [5, 4],
  [3, 6],
  [15, 8],
  [4, 10],
  [16, 2],
  [8, 2],
];
var numStartFire = 2;

var game = new Phaser.Game(1800, 1080, Phaser.AUTO, 'game');

var PhaserGame = {
  // map
  map: null,
  layer: null,
  gridsize: 90,
  // Player
  player1: null,
  player2: null,
  // pad
  pad1: null,
  // Tiles attachements
  fire: [],

  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.crossOrigin = 'anonymous';

    this.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('floor', 'img/tiles/floor.png');
    this.load.image('wall', 'img/tiles/wall.png');

    this.load.image('player1', 'img/player1.png');
    this.load.image('player2', 'img/player2.png');

    this.load.image('fire1', 'img/sprites/feu.png');
    this.load.image('fire2', 'img/sprites/feu2.png');
    this.load.image('fire3', 'img/sprites/feu3.png');
  },

  create: function () {
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('floor', 'floor');
    this.map.addTilesetImage('wall', 'wall');

    this.layer = this.map.createLayer('Map1');

    // Add the player to the game
    this.player1 = this.add.sprite(150, 150, 'player1');
    this.player1.anchor.set(0.5);

    this.player2 = this.add.sprite(1600, 900, 'player2');
    this.player2.anchor.set(0.5);

    // physics
    this.map.setCollision(2, true, this.layer);
    this.physics.arcade.enable(this.player1);

    // Player's control
    this.cursors = this.input.keyboard.createCursorKeys();

    // pad
    game.input.gamepad.start();
    this.pad1 = game.input.gamepad.pad1;

    // Starts the fire
    fire.init();
  },

  update: function ()
  {
    this.physics.arcade.collide(this.player1, this.layer);
    this.checkKeys();
    this.checkPad();
  },

  checkKeys: function () {
    if (this.cursors.left.isDown)
    {
      this.move(Phaser.LEFT);
      this.turn_sprit(Phaser.LEFT);
    }
    else if (this.cursors.right.isDown)
    {
      this.move(Phaser.RIGHT);
      this.turn_sprit(Phaser.RIGHT);
    }
    else if (this.cursors.up.isDown)
    {
      this.move(Phaser.UP);
      this.turn_sprit(Phaser.UP);
    }
    else if (this.cursors.down.isDown)
    {
      this.move(Phaser.DOWN);
      this.turn_sprit(Phaser.DOWN);
    }
    else
    {
      this.move();
    }
  },

  move: function (direction)
  {
    var speed = 300;
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

  turn_sprit: function (direction)
  {
    if (direction === Phaser.LEFT)
    {
      this.player1.angle = -90;
    }

    else if (direction === Phaser.UP)
    {
      this.player1.angle = 0;
    }

    else if (direction === Phaser.RIGHT)
    {
      this.player1.angle = 90;
    }

    else if (direction === Phaser.DOWN)
    {
      this.player1.angle = 180;
    }
  },

  checkPad: function () {
    if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
    {
      this.player2.x--;
    }
    else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    {
      this.player2.x++;
    }
    else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    {
      this.player2.y--;
    }
    else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
    {
      this.player2.y++;
    }
  },
};

/**
 * Start the fire and propagate it
 *
 * @type object
 */
var fire = {
  tiles: [],
  tilesInProgress: [],
  interval: null,
  delay: 200,
  step: 0,

  init: function () {
    var i;
    var savedStartKey = [];
    var startKey = null;

    for (i = 0; i < numStartFire; i++) {
      while (null === startKey || typeof (savedStartKey[startKey]) !== 'undefined') {
        startKey = Math.floor(Math.random() * startFire.length);
      }
      savedStartKey[startKey] = true;

      this.tiles.push(startFire[startKey]);
      startKey = null;
    }

    this.display();
    window.setInterval(function () {
      fire.tick();
    }, this.delay);
  },

  /**
   * Displays the fire
   *
   * @returns {undefined}
   */
  display: function () {
    var step = this.step;

    this.tiles.map(function (coords) {
      var x = coords[0];
      var y = coords[1];

      var tile = PhaserGame.map.getTile(x, y);
      PhaserGame.fire[x + '-' + y] = PhaserGame.add.sprite(tile.worldX, tile.worldY, 'fire1');
    });

    this.tilesInProgress.map(function (coords) {
      var x = coords[0];
      var y = coords[1];
      var sprite;

      var tile = PhaserGame.map.getTile(x, y);

      switch (step) {
        case 0 :
          sprite = 'fire3';
          break;

        case 1 :
          sprite = 'fire2';
      }

      PhaserGame.fire[x + '-' + y] = PhaserGame.add.sprite(tile.worldX, tile.worldY, sprite);

    });
  },

  /**
   * Gets the tiles eligible to burn in the next step
   *
   * @param {type} coords
   * @returns {fire.getFireCandidates.returnTiles|Array}
   */
  propagate: function (coords) {
    var x = coords[0];
    var y = coords[1];
    var nextTiles = [
      PhaserGame.map.getTileLeft(PhaserGame.layer.index, x, y),
      PhaserGame.map.getTileRight(PhaserGame.layer.index, x, y),
      PhaserGame.map.getTileAbove(PhaserGame.layer.index, x, y),
      PhaserGame.map.getTileBelow(PhaserGame.layer.index, x, y)
    ];

    var returnTiles = [];
    var parent = this;

    nextTiles.map(function (tile) {
      // Out of bounds
      if (null === tile) {
        return;
      }

      var tileCoords = [tile.x, tile.y];

      // Already on fire
      if (parent.isBurning(tileCoords)) {
        return;
      }

      // Cannot be walked on
      if (tile.collides) {
        return;
      }

      parent.tilesInProgress.push(tileCoords);
    });

    return returnTiles;
  },

  /**
   * Returns true if the tiles at the coords is on fire, in any progress.
   *
   * @param {array} coords [x, y]
   * @returns {Boolean}
   */
  isBurning: function (coords) {
    var k;
    var savedTile;

    for (k in this.tiles) {
      savedTile = this.tiles[k];
      if (coords[0] === savedTile[0] && coords[1] === savedTile[1]) {
        return true;
      }
    }

    for (k in this.tilesInProgress) {
      savedTile = this.tilesInProgress[k];
      if (coords[0] === savedTile[0] && coords[1] === savedTile[1]) {
        return true;
      }
    }

    return false;
  },

  /**
   * Cases fire to propagate, transfer in progress fire to real fire at step 2.
   *
   * @returns {undefined}
   */
  rise: function () {
    var parent = this;

    switch (this.step) {
      case 0 :
        this.tiles.map(function (coords) {
          parent.propagate(coords);
        });
        break;

      case 1 :
        break;

      case 2 :
        this.tilesInProgress.map(function (coords) {
          parent.tiles.push(coords);
        });
        this.tilesInProgress = [];
    }

    this.display();
  },

  /**
   * Add fire
   *
   * @returns {undefined}
   */
  tick: function () {
    this.rise();

    if (this.step < 2) {
      this.step++;
    } else {
      this.step = 0;
    }
  },

  /**
   * Removes the fire from this tile
   *
   * @param {array} coords [x, y]
   * @returns {Boolean} true is a fire was deleted
   */
  extinguish: function (coords) {
    var savedTile;

    for (k in this.tiles) {
      saveTile = this.tiles[k];
      if (savedTile === coords) {
        delete this.tiles[k];
        this.display();
        return true;
      }
    }

    for (k in this.tilesInProgress) {
      saveTile = this.tilesInProgress[k];
      if (savedTile === coords) {
        delete this.tilesInProgress[k];
        this.display();
        return true;
      }
    }

    return false;
  }
};

game.state.add('game', PhaserGame, true);
