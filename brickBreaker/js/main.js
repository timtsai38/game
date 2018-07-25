var main = {
    preload: function() {
      // Image
      game.load.image('paddle', 'assets/paddle.png');
      game.load.image('greenBrick', 'assets/greenBrick.png');
      game.load.image('purpleBrick', 'assets/purpleBrick.png');
      game.load.image('redBrick', 'assets/redBrick.png');
      game.load.image('yellowBrick', 'assets/yellowBrick.png');
      game.load.image('ball', 'assets/ball.png');
      game.load.image('background', 'assets/background.jpg');
      game.load.image('bottomBackground', 'assets/bottomBackground.jpg');

      // Audio
      game.load.audio('sfxHitBrick', 'assets/fx_hit_brick.wav');
      game.load.audio('sfxHitPaddle', 'assets/fx_hit_paddle.wav');
      game.load.audio('bgmMusic', 'assets/bgm_electric_air.ogg');
    },
    create: function() {
      // Audio
      this.sfxHitBrick = game.add.audio('sfxHitBrick');
      this.sfxHitPaddle = game.add.audio('sfxHitPaddle');
      this.bgmMusic = game.add.audio('bgmMusic');
      this.bgmMusic.loop = true;
      this.bgmMusic.play();

      // Physics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // background
      this.background = game.add.image(0, 0, 'background');
      this.background.width = game.width;
      this.background.height = game.height;
      
      // Keyboard
      this.cursors = game.input.keyboard.createCursorKeys();

      // Bricks
      this.numCols = 10;
      this.numRows = 4;
      this.bricks = game.add.group();
      this.bricks.enableBody = true;
      this.bricks.bodyType = Phaser.Physics.ARCADE;

      var brickAssets = [
        'greenBrick',
        'purpleBrick',
        'redBrick',
        'yellowBrick'
      ];

      for(var i=0; i<this.numRows; i++) {
        var brickAsset = brickAssets[i];
        for(var j=0; j<this.numCols; j++) {
          var brick = this.bricks.create(0, 0, brickAsset);
          brick.scale.setTo(0.1, 0.1);
          brick.x = brick.width*j;
          brick.y = brick.height*i;
        }
      }
      this.bricks.setAll('body.immovable', true);

      // Paddle
      this.paddleVelX = 500/1000;
      this.paddlePrevX = game.input.x;
      this.paddle = game.add.sprite(0, 0, 'paddle');
      this.paddle.scale.setTo(0.15, 0.15);
      this.paddle.anchor.setTo(0.5, 1);
      this.paddleHalf = this.paddle.width/2;
      game.physics.arcade.enable(this.paddle);
      this.paddle.body.immovable = true;

      // bottom background
      var blackLine = game.add.tileSprite(0, 0, game.world.width, this.paddle.height + 10, 'bottomBackground');
      blackLine.anchor.set(0, 1);
      blackLine.y = game.world.height;

      // Ball
      this.ball = game.add.sprite(100, 100, 'ball');
      this.ball.scale.setTo(0.04, 0.04);
      game.physics.arcade.enable(this.ball);
      this.ball.body.enable = true;
      this.ball.anchor.setTo(0.5, 1);
      this.ball.body.bounce.set(1);
      this.ball.body.collideWorldBounds = true;
      game.physics.arcade.checkCollision.down = false;
      this.ball.initVelX = 200;
      this.ball.initVelY = -300;
      game.input.onDown.add(this.shootBall, this);

      this.ball.checkWorldBounds = true;
      this.ball.events.onOutOfBounds.add(this.loseLife, this);
      
      this.resetPaddleBall();

      // Lives
      var txtConfig = {
        fontSize: '15px',
        fill: '#ffffff'
      };
      this.lifeText = '生命數: ';
      this.lives = 3;
      this.txtLives = game.add.text(0, 0, this.lifeText+this.lives, txtConfig);
      this.txtLives.align = 'left';
      this.txtLives.anchor.set(0, 1);
      this.txtLives.y = game.world.height;

      // Points
      this.pointText = ' 點';
      this.points = 0;
      this.txtPoints = game.add.text(0, 0, this.points+this.pointText, txtConfig);
      this.txtPoints.align = 'right';
      this.txtPoints.anchor.set(1);
      this.txtPoints.x = game.world.width;
      this.txtPoints.y = game.world.height;
    },
    update: function() {
      if(this.paddlePrevX != game.input.x) {
        this.paddle.x = game.input.x;
      }else if(this.cursors.left.isDown) {
        this.paddle.x -= this.paddleVelX*game.time.physicsElapsedMS;
      }else if(this.cursors.right.isDown) {
        this.paddle.x += this.paddleVelX*game.time.physicsElapsedMS;
      }

      this.paddlePrevX = game.input.x;

      if(this.paddle.x-this.paddleHalf < 0) {
        this.paddle.x = this.paddleHalf;
      }
      if(this.paddle.x+this.paddleHalf > game.world.width) {
        this.paddle.x = game.world.width - this.paddleHalf;
      }

      game.physics.arcade.collide(this.ball, this.paddle, this.hitPaddle, null, this);
      game.physics.arcade.collide(this.ball, this.bricks, this.removeBrick, null, this);

      if(!this.ball.isShot) {
        this.ball.x = this.paddle.x;
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.shootBall();
      }
    },
    resetPaddleBall: function() {
      this.paddle.x = game.world.centerX;
      this.paddle.y = game.world.height - this.paddle.height - 20;

      this.ball.x = this.paddle.x;
      this.ball.y = this.paddle.y - this.paddle.height;
      this.ball.body.velocity.set(0);
      this.ball.isShot = false;
    },
    shootBall: function() {
      if(this.ball.isShot) {
        return;
      }
      var velX = this.ball.initVelX;
      var velY = this.ball.initVelY;
      var rand = Math.floor(Math.random()*2);
      if(rand % 2) {
        velX *= -1;
      }
      this.ball.isShot = true;
      this.ball.body.velocity.set(velX, velY);
      this.sfxHitPaddle.play();
    },
    hitPaddle: function() {
      this.sfxHitPaddle.play();
    },
    removeBrick: function(ball, brick) {
      brick.kill();
      this.points += 10;
      this.txtPoints.text = this.points + this.pointText;
      this.sfxHitBrick.play();
    },
    loseLife: function() {
      this.lives--;
      this.txtLives.text = this.lifeText + this.lives;
      this.resetPaddleBall();
    }
  };
  
  var game = new Phaser.Game(558, 480, Phaser.AUTO, 'gameDiv');
  game.state.add('main', main);
  game.state.start('main');