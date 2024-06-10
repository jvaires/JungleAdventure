class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', 'assets/bg.png'); // Use uma imagem existente para o fundo
        this.load.image('playButton', 'assets/play.png'); // Substitua pelo caminho correto do botão de play
        this.load.image('title', 'assets/title.png');
        this.load.image('tutorialButton', 'assets/leader.png'); // Substitua pelo caminho correto do botão de tutorial
        this.load.audio('backgroundMusic', 'sound/snd_musica.ogg'); // Carrega a música de fundo
    }

    create() {
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.displayWidth = 800;
        this.background.displayHeight = 600;

        let playButton = this.add.image(500, 450, 'playButton').setInteractive();
        playButton.setScale(0.5); // Ajuste a escala conforme necessário
    
        this.title = this.add.image(400, 250, 'title').setOrigin(0.5).setScale(0.2);

        playButton.on('pointerdown', () => {
            this.scene.start('Scene01');
        });

        let tutorialButton = this.add.image(300, 450, 'tutorialButton').setInteractive();
        tutorialButton.setScale(0.5); 

        tutorialButton.on('pointerdown', () => {
            this.scene.start('Tutorial');
        });

        // Toca a música de fundo
        this.backgroundMusic = this.sound.add('backgroundMusic');

        // Verifica se o áudio está carregado e pronto para tocar
        if (this.backgroundMusic) {
            console.log("Background music loaded successfully.");
            this.backgroundMusic.play({ loop: true });
        } else {
            console.log("Failed to load background music.");
        }
    }

    shutdown() {
        // Para a música de fundo
        this.backgroundMusic.stop();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenu, Scene01, Tutorial],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
