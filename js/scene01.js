class Scene01 extends Phaser.Scene {
    constructor() {
        super('Scene01');
        
    }

    preload() {
        this.load.spritesheet('player', 'assets/Run.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('enemy', 'assets/enemy3.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('nuvem', 'assets/nuvem.png');
        this.load.image('chao', 'assets/chao.png');
        this.load.image('menu', 'assets/menu.png');
        this.load.image('restart', 'assets/restart.png'); 
        this.load.image('gameOver', 'assets/gameOver.png'); 
        this.load.audio('soundJump', 'sound/snd_jump.ogg')
        this.load.audio('soundGetCoin', 'sound/snd_getcoin.ogg')
    }

    create() {
        this.score = 0;
        this.scoreInterval = null;
        this.speedInterval = null;
        this.enemySpeed = 100;

        this.sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.sky.displayWidth = 800;
        this.sky.displayHeight = 600;

        this.player = this.physics.add.sprite(50, 50, 'player').setCollideWorldBounds(true);
        this.player.canJump = true;

        this.enemy = this.physics.add.sprite(800, 250, 'enemy')
            .setOrigin(0, 0)
            .setCollideWorldBounds(true)
            .setScale(0.3)
            .setVelocityX(-this.enemySpeed);

        this.enemy.body.setSize(200, 170, false);
        this.enemy.body.setOffset(150, 200);

        this.nuvem = this.add.image(800, 100, 'nuvem').setOrigin(0, 0).setScale(0.3);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        this.control = this.input.keyboard.createCursorKeys();
        
        //this.soundJump = this.soundJump.add('soundJump')
        this.platforms = this.physics.add.staticGroup();
        const groundHeight = 20;
        this.chao = this.add.tileSprite(0, 600 - groundHeight, 800, groundHeight, 'chao');
        this.chao.setOrigin(0, 0);
        this.physics.add.existing(this.chao, true);
        this.platforms.add(this.chao);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemy, this.platforms);

        this.coin = this.physics.add.sprite(800, Phaser.Math.Between(0, 200), 'coin').setOrigin(0, 0).setScale(0.05);
        this.coin.body.setGravityY(-5);
        this.coin.body.checkCollision.down = false;
        this.physics.add.overlap(this.player, this.coin, this.collectCoin, null, this);
        this.physics.add.collider(this.player, this.enemy, this.gameOver, null, this);
        
        this.tweens.add({
            targets: this.nuvem,
            x: -400,
            duration: 9000,
            ease: 'Linear',
            repeat: -1,
            onRepeat: () => {
                this.nuvem.x = 800;
            }
        });

        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontFamily: '"Bungee Spice", sans-serif',
            fontSize: '42px' });
        this.startScoreInterval();
        this.startSpeedInterval();

    }

    update() {
        if (this.control.left.isDown) {
            this.player.setVelocityX(-150);
            this.player.anims.play('walk', true);
            this.player.flipX = true;
        } else if (this.control.right.isDown) {
            this.player.setVelocityX(150);
            this.player.anims.play('walk', true);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
        }

        if (this.control.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
        }
        if (this.control.down.isDown) {
            this.player.setVelocityY(500);
        }

        this.chao.tilePositionX += 2;

        if (this.enemy.body.blocked.left || this.enemy.x <= 0) {
            this.enemy.setVelocityX(this.enemySpeed);
            this.enemy.flipX = false;
        } else if (this.enemy.body.blocked.right || this.enemy.x >= 800 - this.enemy.width * 0.3) {
            this.enemy.setVelocityX(-this.enemySpeed);
            this.enemy.flipX = true;
        }

        if (this.coin.y > 600) {
            this.resetCoinPosition();
        }
    }

    resetCoinPosition() {
        this.coin.x = Phaser.Math.Between(0, 800);
        this.coin.y = 0;
        this.coin.body.setVelocityY(0);
        this.coin.body.setVelocityX(Phaser.Math.Between(-200, 200));
    }

    collectCoin(player, coin) {
        this.resetCoinPosition();
        this.score += 25;
        this.scoreText.setText('Score: ' + this.score);
    }

    gameOver(player, enemy) {
        this.stopScoreInterval();
        this.stopSpeedInterval();
        this.player.setVelocity(0, 0);
        this.enemy.setVelocity(0, 0);
        this.showGameOverScreen();
    }

    startScoreInterval() {
        this.scoreInterval = setInterval(() => {
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
        }, 200);
    }

    stopScoreInterval() {
        if (this.scoreInterval) {
            clearInterval(this.scoreInterval);
            this.scoreInterval = null;
        }
    }

    startSpeedInterval() {
        this.speedInterval = setInterval(() => {
            this.enemySpeed += 50;
        }, 15000);
    }

    stopSpeedInterval() {
        if (this.speedInterval) {
            clearInterval(this.speedInterval);
            this.speedInterval = null;
        }
    }

    shutdown() {
        this.stopScoreInterval();
        this.stopSpeedInterval();
    }

    destroy() {
        this.stopScoreInterval();
        this.stopSpeedInterval();
    }

    showGameOverScreen() {
        // Desabilita as colisões e a entrada do jogador
        this.physics.pause();
        this.input.keyboard.enabled = false;
        
        // Cria a tela de Game Over
        let gameOverText = this.add.text(400, 200, 'GAME OVER', { 
            fontFamily: '"Bungee Spice", sans-serif',
            fontSize: '64px',
             fill: '#fff' });
        gameOverText.setOrigin(0.5);

        let scoreText = this.add.text(400, 300, 'Pontuação: ' + this.score, { 
            fontFamily: '"REM", sans-serif',
            fontSize: '32px', 
            fill: '#fff',
            stroke: '#FF4D00',
            strokeThickness: 6
        });
        scoreText.setOrigin(0.5);

        let restartButton = this.add.image(300, 400, 'restart').setInteractive().setScale(0.5);
        let menuButton = this.add.image(500, 400, 'menu').setInteractive().setScale(0.5);

        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
