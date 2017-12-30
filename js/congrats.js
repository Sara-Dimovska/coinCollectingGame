var congratsState = {
    create: function() {

        game.add.image(0, 0, 'pozadina1');

        var naslov = game.add.text(game.world.centerX, -50, 'Честиткиии',
                                   { font: '80px Arial', fill: '#ffffff' });      
        naslov.anchor.setTo(0.5, 0.5);      
        game.add.tween(naslov).to({y:300},1000).easing(Phaser.Easing.Bounce.Out).start();

        // game.add.emitter(x,y,brojNaElementi);
        emitter = game.add.emitter(game.world.centerX, 100,30);

        emitter.makeParticles('paricka');

        emitter.setXSpeed(-200, 200);
        emitter.setYSpeed(-200, 200);
        emitter.gravity = 250;

        /*  burst/explode mod e aktiviran(site elementi emitirani na ednas)
          zivoten vek od10 sekundi
          tretiot  parametar se ignorira koga se koristi burst/explode mod
          posleden parametar- broj na elementi emitirani */
        emitter.start(true, 10000, null, 30);

        var startuvaj = game.add.text(game.world.centerX, game.world.centerY + 60,
                                      'Започнете одново со Enter или клик',
                                      { font: '25px Arial', fill: '#ffffff' });
        startuvaj.anchor.setTo(0.5, 0.5);    
        game.add.tween(startuvaj).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();


        var key = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        key.onDown.addOnce(this.start, this);
        game.input.onDown.add(this.start,this);


    },
    start: function() {
        // Startuvaj ja igrata
        game.state.start('level1');
    }
};
