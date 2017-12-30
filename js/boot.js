var bootState = {
    preload: function () {
        // game.add.image namesto game.add.sprite , nema potreba od physics i animations svojstva
        game.load.image('progress', 'resursi/progress.png');
    },
    create: function() { 
        
        
        // vo ovaa sostojba se pisuvaat opstite podesuvanja za igrata
        game.stage.backgroundColor = '#3498db';
        //dostapni 3 izvori: P2(za kompleksni resenija kako Angry Birds), Ninja(pomokjen od P2) i Arcade(ednostaven za pravoagolni kolizii)
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Startuvaj jaslednata sostojba
        game.state.start('load');
    }
};
