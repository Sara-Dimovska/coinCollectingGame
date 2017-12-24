var bootState = {
    preload: function () {
        // game.add.image namesto game.add.sprite , nema potreba od physics i animations svojstva
        game.load.image('progress', 'resursi/progress.png');
    },
    create: function() {
        // podesuvanja za game
        game.stage.backgroundColor = '#3498db';
        //dostapni 3 izvodi: P2(za kompleksni resenija kako Angry Birds), Ninja(pomokjen od P2) and Arcade(ednostaven za pravoagolni kolizii)
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Startuvaj jaslednata sostojba
        game.state.start('load');
    }
};
