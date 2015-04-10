"use strict";

var game = new Phaser.Game(1020, 1080, Phaser.AUTO, 'game');

var PhaserGame = function(game) {

  //...

};

PhaserGame.prototype = {
  preload: function() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('logo', 'img/phaser.png');
  },

  create: function() {
    var logo = this.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
  },
};

game.state.add('game', PhaserGame, true);
