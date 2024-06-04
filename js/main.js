class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', 'assets/bg.png'); // Use uma imagem existente para o fundo
        this.load.image('playButton', 'assets/play.png'); // Substitua pelo caminho correto do botão de play
        this.load.image('title', 'assets/title.png');
    }

    create() {
        this.backgorund = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.backgorund.displayWidth = 800;
        this.backgorund.displayHeight = 600;

        let playButton = this.add.image(400, 400, 'playButton').setInteractive();
        playButton.setScale(0.5); // Ajuste a escala conforme necessário
    
        this.title = this.add.image(400, 250, 'title').setOrigin(0.5).setScale(0.2);

        playButton.on('pointerdown', () => {
            this.scene.start('Scene01');
        });

        // let titleText = this.add.text(400, 150, 'Jungle Adventure', { 
        //     fontFamily: '"Bungee Spice", sans-serif',
        //     fontSize: '64px', 
        //     fill: '#fff',
        //     stroke: '#000',
        //     strokeThickness: 6
        // });
        // titleText.setOrigin(0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenu, Scene01],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
