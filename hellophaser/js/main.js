var main = {
    preload: function() {
      game.load.image('logo', 'assets/logo.png');
    },
    create: function() {
      this.logoSprite = game.add.sprite(200, 150, 'logo');
    },
    update: function() {
      this.logoSprite.angle += 1;
    }
  };
  
  var game = new Phaser.Game(400, 300, Phaser.AUTO, 'gameDiv');
  game.state.add('main', main);
  game.state.start('main');