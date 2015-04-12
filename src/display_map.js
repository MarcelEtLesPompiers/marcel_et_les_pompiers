"use strict";

//
// Config
//

// Starting fire, picked at random
var startFire = [
  [1,6],
  [5,4],
  [9,7],
  [13,9],
  [18,7],
  [12,3],
];

var startObstacles = [
  [3,4],
  [7,2],
  [11,8],
  [11,9],
  [16,7],
  [16,8],
  [16,9],
  [18,6],
  [13,3],
];

var numStartFire = 2;
var fireDelay = 750; // Higher is slower
var fireRate = 2; // Divides the number of starting fires
var waterLife = 150; // in Ms
var requiredSpam = 5;
var hitInvincibility = 1500; // in Ms
var obstacleHealth = 4; // number of hits to clear an obstacle
var player1Range = 120; // range in pixel of the axe attack (an attack starts from centerpoint to centerpoint)

//
// Game starts here
//
var game = new Phaser.Game(1800, 1080, Phaser.AUTO, 'game');

var PhaserGame = {
  // map
  map: null,
  layer: null,
  layer2: null,
  layer3: null,
  gridsize: 90,

  //ecran
  in_game: null,
  ecran_titre: null,

  // Player
  player1: null,
  player2: null,

  player1Wait: false,
  player1Charge: 0,
  player1Counter: null,

  player2Wait: false,
  player2Delay: 500,
  player2Ammo: 3,
  player2Counter: null,

  cursors1: null,
  attack1: null,
  attack1Up: false,
  attack2: null,

  pump: null,
  pumpDown: false,
  pumpPompier: true,
  pumpSwitch:true,
  pumpModeCounter: null,
  pumpSwitchKey: null,

  // pad
  pad1: null,

  // music
  musette: null,
  fire_sound : null,

  // Sprite attachements
  fire: null,
  water: null,
  waterLife: waterLife,

  // HUD
  timer: null,
  timeCounter: null,
  lifePlayer1: null,
  lifePlayer2: null,

  /**
   * Phaser init
   *
   * @returns {undefined}
   */
  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  /**
   * Loads the assets
   *
   * @returns {undefined}
   */
  preload: function () {
    this.load.crossOrigin = 'anonymous';

    this.load.image('ecran_titre', 'img/screen/ecran_titre.png');

    this.load.tilemap('map', 'map/lvl.json.txt', null, Phaser.Tilemap.TILED_JSON);

    // Floor tiles
    this.load.image('parquetDroite', 'img/sols/parquetDroite.png');
    this.load.image('Porte', 'img/sols/Porte.png');
    this.load.image('sol_carrelage', 'img/sols/sol_carrelage.png');
    this.load.image('BurnWoodenFloor1', 'img/sols/BurnWoodenFloor1.png');
    this.load.image('BurnWoodenFloor2', 'img/sols/BurnWoodenFloor2.png');
    this.load.image('BurnWoodenFloor3', 'img/sols/BurnWoodenFloor3.png');

    // Wall tiles
    this.load.image('mur_border_bottom', 'img/Walls/mur_border_bottom.png');
    this.load.image('mur_border_left', 'img/Walls/mur_border_left.png');
    this.load.image('mur_border_link_bottom', 'img/Walls/mur_border_link_bottom.png');
    this.load.image('mur_border_link_left', 'img/Walls/mur_border_link_left.png');
    this.load.image('mur_border_link_right', 'img/Walls/mur_border_link_right.png');
    this.load.image('mur_border_link_top', 'img/Walls/mur_border_link_top.png');
    this.load.image('mur_border_right', 'img/Walls/mur_border_right.png');
    this.load.image('mur_border_top', 'img/Walls/mur_border_top.png');
    this.load.image('mur_coin1', 'img/Walls/mur_coin1.png');
    this.load.image('mur_coin2', 'img/Walls/mur_coin2.png');
    this.load.image('mur_coin3', 'img/Walls/mur_coin3.png');
    this.load.image('mur_coin4', 'img/Walls/mur_coin4.png');
    this.load.image('mur_cross', 'img/Walls/mur_cross.png');
    this.load.image('mur_end_bottom', 'img/Walls/mur_end_bottom.png');
    this.load.image('mur_end_left', 'img/Walls/mur_end_left.png');
    this.load.image('mur_end_right', 'img/Walls/mur_end_right.png');
    this.load.image('mur_end_top', 'img/Walls/mur_end_top.png');
    this.load.image('mur_horizontal', 'img/Walls/mur_horizontal.png');
    this.load.image('mur_horizontal2', 'img/Walls/mur_horizontal2.png');
    this.load.image('mur_horizontal3', 'img/Walls/mur_horizontal3.png');
    this.load.image('mur_L1', 'img/Walls/mur_L1.png');
    this.load.image('mur_L2', 'img/Walls/mur_L2.png');
    this.load.image('mur_L3', 'img/Walls/mur_L3.png');
    this.load.image('mur_L4', 'img/Walls/mur_L4.png');
    this.load.image('mur_vertical', 'img/Walls/mur_vertical.png');
    this.load.image('mur_vertical2', 'img/Walls/mur_vertical2.png');
    this.load.image('wall_Full', 'img/Walls/wall_Full.png');
    this.load.image('mur_border_coin2', 'img/Walls/mur_border_coin2.png');

    // Carpet tiles
    this.load.image('Centre', 'img/Carpets/Centre.png');
    this.load.image('centreBas', 'img/Carpets/centreBas.png');
    this.load.image('centreBas2', 'img/Carpets/centreBas2.png');
    this.load.image('centreDroit', 'img/Carpets/centreDroit.png');
    this.load.image('centreGauche', 'img/Carpets/centreGauche.png');
    this.load.image('centreHaut', 'img/Carpets/centreHaut.png');
    this.load.image('centreHaut2', 'img/Carpets/centreHaut2.png');
    this.load.image('coinBasDroit', 'img/Carpets/coinBasDroit.png');
    this.load.image('coinBasDroit2', 'img/Carpets/coinBasDroit2.png');
    this.load.image('coinBasGauche', 'img/Carpets/coinBasGauche.png');
    this.load.image('coinHautDroit', 'img/Carpets/coinHautDroit.png');
    this.load.image('coinHautDroit2', 'img/Carpets/coinHautDroit2.png');
    this.load.image('coinHautGacuhe', 'img/Carpets/coinHautGacuhe.png');
    this.load.image('coinHautGauche', 'img/Carpets/coinHautGauche.png');
    this.load.image('coinsBasGauche', 'img/Carpets/coinsBasGauche.png');

    // Furniture
    this.load.image('Atari_Idle', 'img/Furnitures/Atari_Idle.png');
    this.load.image('Bed_Iddle2', 'img/Furnitures/Bed_Iddle2.png');
    this.load.image('Canape_Idle', 'img/Furnitures/Canape_Idle.png');
    this.load.image('ChairEgg_Idle2', 'img/Furnitures/ChairEgg_Idle2.png');
    this.load.image('ChairEgg_Idle7', 'img/Furnitures/ChairEgg_Idle7.png');
    this.load.image('Fauteuil_Idle2', 'img/Furnitures/Fauteuil_Idle2.png');
    this.load.image('Fauteuil_Idle6', 'img/Furnitures/Fauteuil_Idle6.png');
    this.load.image('Fauteuil_Idle7', 'img/Furnitures/Fauteuil_Idle7.png');
    this.load.image('lava_lamp', 'img/Furnitures/lava_lamp.png');
    this.load.image('Table_Idle', 'img/Furnitures/Table_Idle.png');
    this.load.image('Table_Idle2', 'img/Furnitures/Table_Idle2.png');
    this.load.image('wc', 'img/Furnitures/wc.png');

    // Players
    this.load.image('player1', 'img/player1.png');
    this.load.image('player2', 'img/player2.png');
    this.load.image('player2Pour', 'img/Marcel_Pour.png');

    this.load.image('fire1', 'img/sprites/feu.png');
    this.load.image('fire2', 'img/sprites/feu2.png');
    this.load.image('fire3', 'img/sprites/feu3.png');
    this.load.image('water', 'img/sprites/water.png');
    this.load.image('water2', 'img/sprites/Water_marcel.png');
    this.load.image('pump', 'img/sprites/pompe.png');

    this.load.image('heart', 'img/hud/Heart.png');
    this.load.image('heartEmpty', 'img/hud/heartEmpty.png');

    this.load.image('debris', 'img/sprites/Debris.png');
    this.load.image('debris2', 'img/sprites/Debris2.png');

    // music
    game.load.audio('musette', ['sound/marcel_musette.mp3', 'sound/marcel_musette.ogg']);
    game.load.audio('fire_sound', ['sound/fire_sound.ogg']);
  },

  /**
   * First game's initialisation
   *
   * @returns {undefined}
   */
  create: function () {
    this.ecran_titre = this.add.sprite(0, 0, 'ecran_titre');
    this.in_game = false;
    this.pumpSwitchKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },

  lauch_game: function () {
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage("Wooden_floor", "parquetDroite");
    this.map.addTilesetImage("BurnWoodenFloor1", "BurnWoodenFloor1");
    this.map.addTilesetImage("BurnWoodenFloor2", "BurnWoodenFloor2");
    this.map.addTilesetImage("BurnWoodenFloor3", "BurnWoodenFloor3");
    this.map.addTilesetImage("hWall", "mur_horizontal");
    this.map.addTilesetImage("vWall", "mur_vertical");
    this.map.addTilesetImage("cWall", "mur_cross");
    this.map.addTilesetImage("vWall_End", "mur_end_bottom");
    this.map.addTilesetImage("vWall_Top", "mur_end_top");
    this.map.addTilesetImage("hWall_L", "mur_end_left");
    this.map.addTilesetImage("hWall_R", "mur_end_right");
    this.map.addTilesetImage("hWall_Cross_Top", "mur_horizontal2");
    this.map.addTilesetImage("hWall_Cross_End", "mur_horizontal3");
    this.map.addTilesetImage("vWall_Cross_L", "mur_vertical");
    this.map.addTilesetImage("vWall_Cross_R", "mur_vertical2");
    this.map.addTilesetImage("Corner1", "mur_coin1");
    this.map.addTilesetImage("Corner2", "mur_coin2");
    this.map.addTilesetImage("Corner3", "mur_coin3");
    this.map.addTilesetImage("Corner4", "mur_coin4");
    this.map.addTilesetImage("hWall_Border_Top", "mur_border_top");
    this.map.addTilesetImage("hWall_Border_End", "mur_border_bottom");
    this.map.addTilesetImage("hWall_Border_L", "mur_border_left");
    this.map.addTilesetImage("vWall_Border_R", "mur_border_right");
    this.map.addTilesetImage("Wall_Full", "wall_Full");
    this.map.addTilesetImage("paving", "sol_carrelage");
    this.map.addTilesetImage("wCorner", "mur_border_coin2");
    this.map.addTilesetImage("wCorner2c", "mur_L2");
    this.map.addTilesetImage("fDoor", "Porte");
    this.map.addTilesetImage("Carpet1", "Centre");
    this.map.addTilesetImage("wCorner1", "mur_L1");
    this.map.addTilesetImage("wCorner2", "mur_L2");
    this.map.addTilesetImage("wCorner3", "mur_L3");
    this.map.addTilesetImage("wCorner4", "mur_L4");
    this.map.addTilesetImage("Full_corner1", "mur_border_link_bottom");
    this.map.addTilesetImage("full_corner2", "mur_border_link_left");
    this.map.addTilesetImage("full_corner3", "mur_border_link_right");
    this.map.addTilesetImage("full_corner4", "mur_border_link_top");

    this.map.addTilesetImage("carpetCoinTopLeft", "coinHautGauche");
    this.map.addTilesetImage("carpetCenterTop", "centreHaut");
    this.map.addTilesetImage("carpetCoinTopRight", "coinHautDroit");
    this.map.addTilesetImage("carpetCenter", "Centre");
    this.map.addTilesetImage("carpetSideRight", "centreDroit");
    this.map.addTilesetImage("carpetSideLeft", "centreGauche");
    this.map.addTilesetImage("carpetCoinBotLeft", "coinsBasGauche");
    this.map.addTilesetImage("carpetCenterBot", "centreBas");
    this.map.addTilesetImage("carpetCoinBotRight", "coinBasDroit");
    this.map.addTilesetImage("carpet2CoinTopLeft", "coinHautGacuhe");


    this.map.addTilesetImage("Egg", "ChairEgg_Idle2");
    this.map.addTilesetImage("bed", "Bed_Iddle2");
    this.map.addTilesetImage("table", "Table_Idle2");
    this.map.addTilesetImage("table2", "Table_Idle");
    this.map.addTilesetImage("lamp", "lava_lamp");
    this.map.addTilesetImage("computer", "Atari_Idle");
    this.map.addTilesetImage("chair", "Fauteuil_Idle2");
    this.map.addTilesetImage("chair2", "Fauteuil_Idle6");
    this.map.addTilesetImage("chair3", "Fauteuil_Idle7");
    this.map.addTilesetImage("egg2", "ChairEgg_Idle7");
    this.map.addTilesetImage("canap", "Canape_Idle");
    this.map.addTilesetImage("Wc", "wc");

    this.layer = this.map.createLayer('lvl_01');
    this.layer2 = this.map.createLayer('Carpet');
    this.layer3 = this.map.createLayer('Wall');

    // World assets
    this.pump = this.add.sprite(1625, 225, 'pump');
    this.pump.anchor.set(0.5);

    // Fire / Water group collision
    this.water = this.add.group();
    this.water.physicsBodyType = Phaser.Physics.ARCADE;
    this.water.enableBody = true;
    this.fire = this.add.group();
    this.fire.physicsBodyType = Phaser.Physics.ARCADE;
    this.fire.enableBody = true;

    this.lifePlayer1 = this.add.group();
    this.lifePlayer2 = this.add.group();

    // Add the player to the game
    this.player1 = this.add.sprite(150, 150, 'player1');
    this.player1Invincible = false;
    this.player1.anchor.set(0.5);
    this.player1.health = 3;
    this.player1.angle = -180;
    this.player2 = this.add.sprite(1600, 900, 'player2');
    this.player2.anchor.set(0.5);
    this.player2Invincible = false;
    this.player2.health = 3;

    // physics
    this.map.setCollision([2,3,4], true, this.layer);
    this.physics.arcade.enable(this.player1);
    this.physics.arcade.enable(this.player2);

    // Player's control
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attack1 = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.attack2 = this.input.keyboard.addKey(Phaser.Keyboard.M);
    this.cursors1 = {
        up: this.input.keyboard.addKey(Phaser.Keyboard.Z),
        down: this.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.input.keyboard.addKey(Phaser.Keyboard.Q),
        right: this.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    this.pumpSwitchKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),

    // music
    this.musette = game.add.audio('musette');
    this.musette.play();
    this.musette.volume = 20;
    this.fire_sound = game.add.audio('fire_sound');
    this.fire_sound.play();
    this.fire_sound.volume = 100;

    // Starts the fire
    //fireManager.init();

    // Places obstacles
    obstacles.init();

    // Interface timeCounter
    this.timer = this.time.create(true);
    this.timeCounter = this.add.text(90, 10, '0', {font: "64px Arial", fill: "#FFFFFF"});
    this.startTimer();

    this.player2Counter = this.add.text(1580, 1000, this.player2Ammo, {font: "64px Arial", fill: "#FFFFFF"});

    this.player1Counter = this.add.text(90, 1000, this.player1Charge, {font: "64px Arial", fill: "#FFFFFF"});
    this.setPlayer1Counter();

    this.pumpModeCounter = this.add.text(500, 1000, 'Pompe vers pompier', {font: "64px Arial", fill: "#FFFFFF"});

    // Iterface lifes
    var i;
    for(i = 0; i < 3; i++) {
      var heart = this.lifePlayer1.create(260 + (i * 100), 30, 'heart');
      heart.name = 'heart-' + i;
      heart.scale.setTo(0.25, 0.25);
    }
    for(i = 0; i < 3; i++) {
      var heart = this.lifePlayer2.create(1260 + (i * 100), 30, 'heart');
      heart.name = 'heart-' + i;
      heart.scale.setTo(0.25, 0.25);
    }
  },

  /**
   * Frame update
   *
   * @returns {undefined}
   */
  update: function () {
    if (this.in_game)
    {
      this.physics.arcade.collide(this.player1, this.layer);
      this.physics.arcade.collide(this.player2, this.layer);
      this.checkKeys();
      this.physics.arcade.overlap(this.water, this.fire, this.waterCollision);

      this.physics.arcade.overlap(this.player1, this.fire, this.damagePlayer);
      this.physics.arcade.overlap(this.player2, this.fire, this.damagePlayer);
    }
    else
    {
      this.checkSpace()
    }
  },

  /**
   * Both players control
   * For each player, the 'wait' variable must be false to allow movement.
   *
   * @returns {undefined}
   */
  checkKeys: function () {
    //Common
    if(this.pumpSwitchKey.isDown) {
      if(this.pumpSwitch) {
        this.switchWaterMode();
        this.pumpSwitch = false;
      }
    } else if(!this.pumpSwitch) {
      this.pumpSwitch = true;
    }

    // Player 1
    if(!this.player1Wait) {
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

      if(this.attack1.isDown) {
        if(this.attack1Up) {
          this.player1Attack();
          this.attack1Up = false;
        }
      } else {
        this.attack1Up = true;
      }
    }

    // Player 2
    if(!this.player2Wait) {
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

      if(this.attack2.isDown) {
        if(this.player2.overlap(this.pump)) {
          if(!this.pumpDown) {
           this.pumpAction();
          }
        } else {
          this.throwWater(this.player2);
        }
      } else if(this.pumpDown) {
        this.pump.tint = 0xFFFFFF;
        this.pumpDown = false;
      }
    }
  },

  checkSpace: function ()
  {
    if (this.pumpSwitchKey.isDown)
    {
      this.lauch_game();
      this.in_game = true;
    }
  },

  /**
   * Damage a player
   *
   * @param {type} player
   * @param {type} fire
   * @returns {undefined}
   */
  damagePlayer: function(player, fire) {
    if('player1' === player.key && PhaserGame.player1Invincible) {
      return;
    } else if('player2' === player.key && PhaserGame.player2Invincible) {
      return;
    }

    player.health--;
    player.alpha = 0.75;

    switch(player.key) {
      case 'player1' :
        PhaserGame.player1Invincible = true;
        PhaserGame.timer.add(hitInvincibility, function() {
          PhaserGame.player1Invincible = false;
          PhaserGame.player1.alpha = 1;
        });
        break;


      case 'player2' :
        PhaserGame.player2Invincible = true;
        PhaserGame.timer.add(hitInvincibility, function() {
          PhaserGame.player2Invincible = false;
          PhaserGame.player2.alpha = 1;
        });
        break;
    }

    PhaserGame.updateHealth(player);
    PhaserGame.knockBack(player);

    if(0 >= player.health) {
      PhaserGame.game.debug.geom(new Phaser.Rectangle(0, 0, 1800, 1200), 'rgba(255,0,0,0.3)', true);
      this.endGame();
    }
  },

  /**
   * Stops the game, blocks controls and clear all the timers.
   *
   * @returns {undefined}
   */
  endGame: function() {
    PhaserGame.player1Wait = true;
    PhaserGame.player2Wait = true;
    PhaserGame.move(false, PhaserGame.player1);
    PhaserGame.move(false, PhaserGame.player2);
    PhaserGame.timer.stop();
    PhaserGame.timer.clearPendingEvents();

    fireManager.stop();
  },

  /**
   * Update one of the healths HUD according to the player's health.
   *
   * @param {sprite} player
   * @returns {undefined}
   */
  updateHealth: function(player) {
    var group;
    var i;

    switch(player.key) {
      case 'player1' :
        group = PhaserGame.lifePlayer1;
        break;

      case 'player2' :
        group = PhaserGame.lifePlayer2;
    }

    if(3 === player.health) {
      for(i = 0; i < 3; i++) {
        var heart = group.next();
          heart.loadTexture('heart');
      }
    } else if(2 === player.health) {
      for(i = 0; i < 3; i++) { // Bad fix, boo!
        var heart = group.next();
        if('heart-0' === heart.name) {
          heart.loadTexture('heartEmpty');
        } else {
          heart.loadTexture('heart');
        }
      }
    } else if(1 === player.health) {
      for(i = 0; i < 3; i++) {
        var heart = group.next();
        if('heart-2' === heart.name) {
          heart.loadTexture('heart');
        } else {
          heart.loadTexture('heartEmpty');
        }
      }
    } else {
      for(i = 0; i < 3; i++) {
        var heart = group.next();
        heart.loadTexture('heartEmpty');
      }
    }
  },

  /**
   * Pushes the player back and stuns him.
   *
   * @param {sprite} player
   * @returns {undefined}
   */
  knockBack: function(player) {
    switch(player.key) {
      case 'player1' :
        PhaserGame.player1Wait = true;
        PhaserGame.timer.add(250, function() {
          PhaserGame.player1Wait = false;
        });
        PhaserGame.timer.add(100, function() {
          PhaserGame.move(false, PhaserGame.player1);
        });
        break;

      case 'player2' :
        PhaserGame.player2Wait = true;
        PhaserGame.timer.add(250, function() {
          PhaserGame.player2Wait = false;
        });
        PhaserGame.timer.add(100, function() {
          PhaserGame.move(false, PhaserGame.player2);
        });
    }

    PhaserGame.move(false, player);

    switch(player.angle) {
      case 0 :
        player.body.velocity.x = 0;
        player.body.velocity.y = 500;
        break;

      case 90 :
        player.body.velocity.x = -500;
        player.body.velocity.y = 0;
        break;

      case -180 :
        player.body.velocity.x = 0;
        player.body.velocity.y = -500;
        break;

      case -90 :
        player.body.velocity.x = 500;
        player.body.velocity.y = 0;
        break;

    }
  },

  /**
   * Setup the velocity of one player
   *
   * @param {int} direction If false, will stop the player
   * @param {obj} player player1 or player2
   * @returns {undefined}
   */
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
    var sprite;

    // Extra actions for Marcel
    if('player2' === player.key) {
      if(0 === this.player2Ammo) {
        return;
      }

      this.player2Ammo--;
      this.player2Counter.setText(this.player2Ammo);
      this.player2Wait = true;
      this.move(false, PhaserGame.player2);
      this.player2.loadTexture('player2Pour');

      this.timer.add(this.player2Delay, function() {
        PhaserGame.player2Wait = false;
        PhaserGame.player2.loadTexture('player2');
      });
    }

    switch(player.angle) {
      case 0 :
        y = y - 70;
        x = x - 3;
        break;

      case 90 :
        x = x + 70;
        y = y- 3;
        break;

      case -180 :
        y = y + 70;
        x = x + 3;
        break;

      case -90 :
        x = x - 70;
        y = y + 3;
        break;
    }

    switch(player.key) {
      case 'player1' :
        sprite = 'water';
        break;

      case 'player2Pour' :
        sprite = 'water2';
        break;
    }

    var water = this.water.create(x, y, sprite);
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

  /**
   * Fireman's attack
   * - Blocks movement for a little while
   * - Check for nearby obstacles
   * - Damages the obstacle is found
   *
   * @returns {undefined}
   */
  player1Attack: function() {
    this.player1Wait = true;
    this.move(false, this.player1);
    this.timer.add(250, function() {
      PhaserGame.player1Wait = false;
    });

    obstacles.checkHits(this.player1);
  },

  pumpAction: function() {
    this.pumpDown = true;

    this.pump.tint = 0.5 * 0xFFFFFF;

    if(this.pumpPompier) {
      this.player1Charge++;
      if(this.player1Charge >= requiredSpam) {
        this.player1Charge = 0;
        this.throwWater(this.player1);
      }

      this.setPlayer1Counter();

    } else if(this.player2Ammo < 3) {
      this.player2Ammo++;
      this.player2Counter.setText(this.player2Ammo);
    }
  },

  /**
   * Invert the fireman's or marcel water mode
   *
   * @returns {undefined}
   */
  switchWaterMode: function() {
    this.pumpPompier = !this.pumpPompier;

    if(this.pumpPompier) {
      this.pumpModeCounter.setText('Pompe vers pompier');
    } else {
      this.pumpModeCounter.setText('Pompe vers Marcel');
    }
  },

  /**
   * Handles the collision between one water sprite and a fire.
   *
   * @param {sprite} waterSprite
   * @param {sprite} fireSprite
   * @returns {undefined}
   */
  waterCollision: function(waterSprite, fireSprite) {
    var removed = false;
    removed = fireManager.extinguish([fireSprite.x, fireSprite.y]) || removed;

    if(removed)
    {
      fireManager.display();
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

  /**
   * Start the main game's timer
   *
   * @returns {undefined}
   */
  startTimer: function() {
    this.timer.loop(1000, function() {
      PhaserGame.setTime();
    });
    this.timer.start();
  },

  /**
   * Update the HUD timer
   *
   * @returns {undefined}
   */
  setTime: function() {
    this.timeCounter.setText(Math.floor(this.game.time.totalElapsedSeconds()));
  },

  setPlayer1Counter: function() {
    this.player1Counter.setText(this.player1Charge + ' / ' + requiredSpam);
  }
};

/**
 * Start the fire and propagate it
 *
 * @type object
 */
var fireManager = {
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
      fireManager.tick();
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

    PhaserGame.fire.removeAll();

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
  },

  stop: function() {
    this.timer.stop();
    this.timer.clearPendingEvents();
  }
};

/**
 * Obstaces management
 * - Adds obstacles ot the play field.
 * - Check if the player is in range of hitting.
 * - Delete destoryed obstacles
 */
var obstacles = {

  group: null,

  init: function() {
    var parent = this;
    this.group = PhaserGame.add.group();
    this.group.physicsBodyType = Phaser.Physics.ARCADE;
    this.group.enableBody = true;

    startObstacles.map(function(coords) {
      var texture = Math.random() > 0.5 ? 'debris' : 'debris2';
      var obstacle = parent.group.create(45 + (coords[0] * 90), 45 + (coords[1] * 90), texture);
      obstacle.health = obstacleHealth;
      obstacle.body.immovable = true;
      obstacle.exists = true;
      obstacle.anchor.set(0.5);
    });
  },

  /**
   * Search for obstacles located withing a box extended from the player
   *
   * @param {type} player
   * @returns {undefined}
   */
  checkHits: function(player) {
    var box;

    if(0 === this.group.length) {
      return;
    }

    switch(player.angle) {
      case 0 :
        box = {
          x1: player.x - 40,
          x2: player.x + 40,
          y1: player.y - player1Range,
          y2: player.y,
        };
        break;

      case -180 :
        box = {
          x1: player.x - 40,
          x2: player.x + 40,
          y1: player.y,
          y2: player.y + player1Range,
        };
        break;

      case 90 :
        box = {
          x1: player.x,
          x2: player.x + player1Range,
          y1: player.y - 40,
          y2: player.y + 40,
        };
        break;
      case -90 :
        box = {
          x1: player.x - player1Range,
          x2: player.x,
          y1: player.y - 40,
          y2: player.y + 40,
        };
    }

    this.group.children.map(function(obstacle) {
      if(
        obstacle.x >= box.x1 &&
        obstacle.x <= box.x2 &&
        obstacle.y >= box.y1 &&
        obstacle.y <= box.y2
      ) {
        obstacles.damage(obstacle);
      }
    });

  },

  damage: function(obstacle) {
    obstacle.health--;

    if(0 >= obstacle.health) {
      this.group.remove(obstacle, true);
      return;
    }
    obstacle.alpha = 0.5;

    PhaserGame.timer.add(150, function() {
      obstacles.group.children.map(function(obstacle) {
        obstacle.alpha = 1;
      });
    });
  },

  /**
   * Deletes all the obstacles
   *
   * @returns {undefined}
   */
  cleanup: function() {
    this.group.removeAll(true);
  }
};

game.state.add('game', PhaserGame, true);
