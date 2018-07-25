var main = {
    preload: function() {
        game.load.image('sky', 'assets/sky.jpg');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.background = game.add.image(0, 0, 'sky');
        this.background.width = game.width;
        this.background.height = game.height;

        this.platforms = game.add.group();
        this.platforms.enableBody = true;
 
        var ground = this.platforms.create(0, game.world.height-64, 'ground');
        ground.scale.setTo(game.width,2);

        var ledge_right = this.platforms.create(300, 350, 'ground');
        ledge_right.scale.setTo(game.width-500, 1.2);
        var ledege_left = this.platforms.create(0, 150, 'ground');
        ledege_left.scale.setTo(5, 1.2);

        this.platforms.setAll('body.immovable', true);

        this.player = game.add.sprite(32, game.world.height-150, 'dude');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.4;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(20, 32, 5, 16);

        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.cursors = game.input.keyboard.createCursorKeys();

        this.stars = game.add.group();
        this.stars.enableBody = true;
        for (var i=0; i<12; i++) {
            var star = this.stars.create(i*70, 0, 'star');
            star.scale.setTo(0.2, 0.2);
            star.body.gravity.y = 70;
            star.body.bounce.y = 0.5 + Math.random()*0.2;
        }

        this.score = 0;
        this.scoreText = game.add.text(16, 16, '分數: 0', {fontSize: '26px', fill: '#FFFFFF'});
    },
    update: function() {
        game.physics.arcade.collide(this.player, this.platforms);

        this.player.body.velocity.x = 0;
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }else if(this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }else {
            this.player.animations.stop();
            this.player.frame = 4;
        }
        if(this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -350;
        }

        game.physics.arcade.collide(this.stars, this.platforms);
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    },
    collectStar: function(player, star) {
        star.kill();
        this.score += 10;
        this.scoreText.text = '分數: ' + this.score;
    }
  };
  
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
  game.state.add('main', main);
  game.state.start('main');