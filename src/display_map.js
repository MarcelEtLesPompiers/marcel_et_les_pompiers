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
var fireDelay = 750; // Higher is slower
var fireRate = 2; // Divides the number of starting fires
var waterLife = 50; // in Ms

//
// Game starts here
//
var game = new Phaser.Game(1800, 1080, Phaser.AUTO, 'game');

var PhaserGame = {
  // map
  map: null,
  layer: null,
  gridsize: 90,

  // Player
  player1: null,
  player2: null,
  cursors1: null,
  attack1: null,
  attack2: null,

  // pad
  pad1: null,

  // music
  musette: null,
  fire_sound : null,

  // Sprite attachements
  fire: null,
  water: null,
  waterLife: waterLife,

  // HUS
  timer: null,
  timeCounter: null,

  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.crossOrigin = 'anonymous';

    this.load.tilemap('map', 'map/Lvl_01.json.txt', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('Floor', 'img/tiles/sol_parquet.png');
    this.load.image('floor2', 'img/tiles/Centre.png');
    this.load.image('hWall', 'img/tiles/mur_horizontal.png');
    this.load.image('vWall', 'img/tiles/mur_vertical.png');
    this.load.image('cWall', 'img/tiles/mur_cross.png');

    this.load.image('player1', 'img/player1.png');
    this.load.image('player2', 'img/player2.png');

    this.load.image('fire1', 'img/sprites/feu.png');
    this.load.image('fire2', 'img/sprites/feu2.png');
    this.load.image('fire3', 'img/sprites/feu3.png');
    this.load.image('water', 'img/sprites/water.png');

    // music
    game.load.audio('musette', ['sound/marcel_musette.mp3', 'sound/marcel_musette.ogg']);
    game.load.audio('fire_sound', ['sound/fire_sound.ogg']);

  },

  create: function () {
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('Floor', 'Floor');
    this.map.addTilesetImage('floor2', 'floor2');
    this.map.addTilesetImage('hWall', 'hWall');
    this.map.addTilesetImage('vWall', 'vWall');
    this.map.addTilesetImage('cWall', 'cWall');

    this.layer = this.map.createLayer('lvl_01');

    // Fire / Water group collision
    this.water = this.add.group();
    this.water.physicsBodyType = Phaser.Physics.ARCADE;
    this.water.enableBody = true;
    this.fire = this.add.group();
    this.fire.physicsBodyType = Phaser.Physics.ARCADE;
    this.fire.enableBody = true;

    // Add the player to the game
    this.player1 = this.add.sprite(150, 150, 'player1');
    this.player1.anchor.set(0.5);
    this.player2 = this.add.sprite(1600, 900, 'player2');
    this.player2.anchor.set(0.5);

    // physics
    this.map.setCollision([2,3,4], true, this.layer);
    this.physics.arcade.enable(this.player1);
    this.physics.arcade.enable(this.player2);

    // Player's control
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attack1 = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.cursors1 = {
        up: this.input.keyboard.addKey(Phaser.Keyboard.Z),
        down: this.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.input.keyboard.addKey(Phaser.Keyboard.Q),
        right: this.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    /*game.input.gamepad.start();
    this.pad1 = game.input.gamepad.pad1;*/

    // music
    this.musette = game.add.audio('musette');
    this.musette.play();
    this.musette.volume = 20;
    this.fire_sound = game.add.audio('fire_sound');
    this.fire_sound.play();
    this.fire_sound.volume = 100;

    // Starts the fire
    fire.init();

    // Interface timeCounter
    this.timer = this.time.create(true);
    this.timeCounter = this.add.text(90, 10, '0', {font: "64px Arial", fill: "#000000"});
    this.startTimer();
  },

  update: function () {
    this.physics.arcade.collide(this.player1, this.layer);
    this.physics.arcade.collide(this.player2, this.layer);
    this.checkKeys();
    this.physics.arcade.overlap(this.water, this.fire, this.waterCollision);
  },

  checkKeys: function () {

    // Player 1
    if (this.cursors.left.isDown)
    {
      this.move(Phaser.LEFT, this.player2);
      this.turn_sprit(Phaser.LEFT, this.player2);
    }
    else if (this.cursors.right.isDown)
    {
      this.move(Phaser.RIGHT, this.player2);
      this.turn_sprit(Phaser.RIGHT, this.player2);
    }
    else if (this.cursors.up.isDown)
    {
      this.move(Phaser.UP, this.player2);
      this.turn_sprit(Phaser.UP, this.player2);
    }
    else if (this.cursors.down.isDown)
    {
      this.move(Phaser.DOWN, this.player2);
      this.turn_sprit(Phaser.DOWN, this.player2);
    }
    else
    {
      this.move(false, this.player2);
    }

    // Player 2
    if (this.cursors1.left.isDown)
    {
      this.move(Phaser.LEFT, this.player1);
      this.turn_sprit(Phaser.LEFT, this.player1);
    }
    else if (this.cursors1.right.isDown)
    {
      this.move(Phaser.RIGHT, this.player1);
      this.turn_sprit(Phaser.RIGHT, this.player1);
    }
    else if (this.cursors1.up.isDown)
    {
      this.move(Phaser.UP, this.player1);
      this.turn_sprit(Phaser.UP, this.player1);
    }
    else if (this.cursors1.down.isDown)
    {
      this.move(Phaser.DOWN, this.player1);
      this.turn_sprit(Phaser.DOWN, this.player1);
    }
    else
    {
      this.move(false, this.player1);
    }

    if (this.attack1.isDown)
    {
      this.throwWater(this.player1);
    }
  },

  move: function (direction, player) {
    var speed = 300;

    switch(direction) {
      case Phaser.UP :
        player.body.velocity.x = 0;
        player.body.velocity.y = -speed;
        break;

      case Phaser.RIGHT :
        player.body.velocity.x = speed;
        player.body.velocity.y = 0;
        break;

      case Phaser.DOWN :
        player.body.velocity.x = 0;
        player.body.velocity.y = speed;
        break;

      case Phaser.LEFT :
        player.body.velocity.x = -speed;
        player.body.velocity.y = 0;
        break;

      case Phaser.LEFT + '-' + Phaser.UP :
        player.body.velocity.x = -speed;
        player.body.velocity.y = -speed;
        break;

      default :
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        break;

    }
  },

  /**
   * Add some water
   *
   * @param {object} player
   * @returns {undefined}
   */
  throwWater: function(player) {
    var x = player.x;
    var y = player.y;

    switch(player.angle) {
      case 0 :
        y = y - 75;
        break;

      case 90 :
        x = x + 75;
        break;

      case -180 :
        y = y + 75;
        break;

      case -90 :
        x = x - 75;
        break;

    }

    var water = this.water.create(x, y, 'water');
    water.anchor.set(0.5, 0.5);
    water.angle = player.angle;

    // Delete this water afterwards
    this.timer.add(this.waterLife, function() {
      var water = PhaserGame.water.getFirstExists();
      if(water) {
        PhaserGame.water.remove(water);
      }
    });
  },

  waterCollision: function(waterSprite, fireSprite) {
    var removed = false;
    removed = fire.extinguish([fireSprite.x, fireSprite.y]) || removed;

    if(removed)
    {
      fire.display();
    }
  },

  turn_sprit: function (direction, player)
  {
    if (direction === Phaser.LEFT)
    {
      player.angle = -90;
    }
    else if (direction === Phaser.UP)
    {
      player.angle = 0;
    }
    else if (direction === Phaser.RIGHT)
    {
      player.angle = 90;
    }
    else if (direction === Phaser.DOWN)
    {
      player.angle = 180;
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

  startTimer: function() {
    this.timer.loop(1000, function() {
      PhaserGame.setTime();
    });
    this.timer.start();
  },

  setTime: function() {
    this.timeCounter.setText(Math.floor(this.game.time.totalElapsedSeconds()));
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
  tilesCandidate: [],
  interval: null,
  delay: fireDelay,
  step: 0,

  timer: null,

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
    this.timer = PhaserGame.time.create(true);
    this.timer.loop(this.delay, function () {
      fire.tick();
    });
    this.timer.start();
  },

  /**
   * Displays the fire and refresh the game playfield.
   *
   * @returns {undefined}
   */
  display: function () {
    var step = this.step;
    var k;

    PhaserGame.fire.removeAll();

    console.log(this.tilesInProgress);

    this.tiles.map(function (coords) {
      var x = coords[0];
      var y = coords[1];

      var tile = PhaserGame.map.getTile(x, y);

      PhaserGame.fire.create(tile.worldX, tile.worldY, 'fire1');
    });

    this.tilesInProgress.map(function (coords) {

      if(typeof(coords) === 'undefined') {
        return;
      }

      var x = coords[0];
      var y = coords[1];
      var sprite;
      var tile = PhaserGame.map.getTile(x, y);

      switch (step) {
        case 0 :
          sprite = 'fire3';
          break;

        default :
          sprite = 'fire2';
      }

      PhaserGame.fire.create(tile.worldX, tile.worldY, sprite);
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

      returnTiles.push(tileCoords);
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

    for (k in this.tilesCandidate) {
      savedTile = this.tilesCandidate[k];
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
          if(typeof(coords) === 'undefined') {
            return;
          }

          parent.tilesCandidate = parent.tilesCandidate.concat(parent.propagate(coords));
        });

        var maxTiles = Math.ceil(this.tilesCandidate.length / fireRate);
        var i;
        for(i = 0; i < maxTiles; i++) {
          var key = Math.floor(Math.random() * startFire.length);
          if(this.tilesCandidate[key]) {
            this.tilesInProgress.push(this.tilesCandidate[key]);
          }
          delete this.tilesCandidate[key];
        }

        this.tilesCandidate = [];
        break;

      case 1 :
        break;

      case 2 :
        this.tilesInProgress.map(function (coords) {
          if(typeof(coords) === 'undefined') {
            return;
          }

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
    var k;

    for (k in this.tiles) {
      savedTile = this.tiles[k];
      if (coords[0] === savedTile[0] * 90 && coords[1] === savedTile[1] * 90) {
        delete this.tiles[k];
        return true;
      }
    }

    for (k in this.tilesInProgress) {
      savedTile = this.tilesInProgress[k];
      if (coords[0] === savedTile[0] * 90 && coords[1] === savedTile[1] * 90) {
        delete this.tilesInProgress[k];
        return true;
      }
    }

    return false;
  }
};

game.state.add('game', PhaserGame, true);
