var loadState = {
    preload: function () {
        // dodaj 'loading...' oznaka na ekranot dodeka se vlecat izvorite
        // moze i da bide nezabelezitelna
        var pricekajLabela = game.add.text(game.world.centerX, 300, 'Причекајте...',
                                           { font: '40px Arial', fill: '#ffffff' });
        pricekajLabela.anchor.setTo(0.5, 0.5);

        // prikazi go barot za progress 
        var progress = game.add.sprite(game.world.centerX, 400, 'progress');
        progress.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progress);

        // izvleci gi site potrebni resursi za igrata
        game.load.spritesheet('igrac', 'resursi/spritesheet.png',85,100);       
        game.load.image('zidV', 'resursi/vertikalen.png');
        game.load.image('zidH', 'resursi/horizontalen.png');
        game.load.image('neprijatel', 'resursi/neprijatel.png');
        game.load.image('paricka', 'resursi/paricka.png');
        game.load.audio('skoka', ['resursi/skoka.ogg', 'resursi/skoka.mp3']);
        game.load.audio('zemaParicka', ['resursi/zemaParicka.ogg', 'resursi/zemaParicka.mp3']);
        game.load.audio('mrtov', ['resursi/mrtov.ogg', 'resursi/mrtov.mp3']);

        // resurs koj kje bide iskoristen za slednata sostojba
        game.load.image('background', 'resursi/pozadinskaSlika.jpg');

    },
    create: function() {
        // startuvaj sledna sostojba
        game.state.start('menu');
    }
};
