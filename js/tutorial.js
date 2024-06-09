class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    preload() {
        this.load.image('background', 'assets/bg.png'); // Use uma imagem existente para o fundo
        this.load.image('backButton', 'assets/back.png'); 
    }

    create() {
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.displayWidth = 800;
        this.background.displayHeight = 600;

        this.add.text(400, 100, 'Como Jogar?', {
            fontFamily: '"Bungee Spice", sans-serif',
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(400, 300, '1- Use as setas do teclado para mover \n o personagem \n 2- Colete as moedas que caem do céu \n 3- Não deixe o minotauro te pegar \n\n Boa sorte!', {
            fontFamily: '"REM", sans-serif',
            fontSize: '32px', 
            fill: '#fff',
            stroke: '#FF4D00',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        let backButton = this.add.image(400, 500, 'backButton')
        .setOrigin(0.5)
        .setInteractive()
        .setScale(0.5)

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
