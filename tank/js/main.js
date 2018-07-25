var main = {
    preload: function() {
      game.load.image('background', 'assets/background.jpg');
      game.load.image('tank', 'assets/tank.png');
      game.load.image('turret', 'assets/turret.png');
      game.load.image('bullet', 'assets/bullet.png');
      game.load.image('flame', 'assets/flame.png');
      game.load.image('target', 'assets/target.png');
    },
    create: function() {
      game.renderer.renderSession.roundPixels = true;
      game.world.setBounds(0, 0, 992, 480);
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.arcade.gravity.y = 200;

      this.background = game.add.image(0, 0, 'background');
      this.background.width = game.world.width;
      this.background.height = game.world.height;

      this.targets = game.add.group();
      this.targets.enableBody = true;
      cup_1 = this.targets.create(300, 350, 'target');
      cup_1.scale.setTo(0.2, 0.2);
      cup_2 = this.targets.create(500, 200, 'target');
      cup_2.scale.setTo(0.2, 0.2);
      cup_3 = this.targets.create(775, 250, 'target');
      cup_3.scale.setTo(0.2, 0.2);
      cup_4 = this.targets.create(700, 325, 'target');
      cup_4.scale.setTo(0.2, 0.2);

      this.targets.setAll('body.allowGravity', false);

      this.bullet = game.add.sprite(0, 0, 'bullet');
      this.bullet.scale.setTo(0.07, 0.07);
      this.bullet.exists = false;
      game.physics.arcade.enable(this.bullet);

      this.tank = game.add.image(10, 350, 'tank');
      this.tank.scale.setTo(0.15, 0.15);
      this.turret = game.add.sprite(this.tank.x + 75, this.tank.y + 10, 'turret');
      this.turret.scale.setTo(0.15, 0.15);

      this.flame = game.add.sprite(0, 0, 'flame');
      this.flame.anchor.set(0.5);
      this.flame.visible = false;

      this.power = 300;
      this.powerText = game.add.text(8, 8, 'Power: 300', {font: '18px Arial', fill: '#ffffff'});
      this.powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
      this.powerText.fixedToCamera = true;

      this.cursors = game.input.keyboard.createCursorKeys();
      this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.fireButton.onDown.add(this.fire, this);
    },
    update: function() {
      if(this.bullet.exists) {
        if(this.bullet.y > 424) {
          this.removeBullet();
        }else {
          this.physics.arcade.overlap(this.bullet, this.targets, this.hitTarget, null, this);
        }
      }else {
        if(this.cursors.left.isDown && this.power>200) {
          this.power -= 2;
        }else if(this.cursors.right.isDown && this.power<600) {
          this.power += 2;
        } 
        this.powerText.text = 'Power: ' + this.power;

        if(this.cursors.up.isDown && this.turret.angle>-90) {
          this.turret.angle--;
        }else if(this.cursors.down.isDown && this.turret.angle<0) {
          this.turret.angle++;
        }
      }
    },
    fire: function() {
      if(this.bullet.exists) {
        return;
      }

      this.bullet.reset(this.turret.x + 100, this.turret.y - 70);

      var p = new Phaser.Point(this.turret.x, this.turret.y);
      p.rotate(p.x, p.y, this.turret.rotation, false, 20);

      this.flame.x = p.x + 10;
      this.flame.y = p.y + 10;
      this.flame.alpha = 1;
      this.flame.visible = true;

      game.add.tween(this.flame).to({alpha:0}, 100, 'Linear', true);
      
      game.camera.follow(this.bullet);

      game.physics.arcade.velocityFromRotation(this.turret.rotation, this.power, this.bullet.body.velocity);
    },
    removeBullet: function() {
      this.bullet.kill();
      game.camera.follow();
      game.add.tween(game.camera).to({x:0}, 1000, 'Quint', true, 1000);
    },
    hitTarget: function(bullet, target) {
      target.kill();
      this.removeBullet();
      if(this.targets.total == 0) {
        game.state.start('main');
      }
    }
  };
  
  var game = new Phaser.Game(700, 480, Phaser.AUTO, 'gameDiv');
  game.state.add('main', main);
  game.state.start('main');