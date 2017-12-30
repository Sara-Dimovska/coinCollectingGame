var gameOverState = {
    create: function() {
        
        game.add.image(0, 0, 'pozadina1');
        
        var naslov = game.add.text(game.world.centerX, -50, 'Крај на играта',
                                      { font: '100px Arial', fill: '#ffffff' });      
        naslov.anchor.setTo(0.5, 0.5);      
        game.add.tween(naslov).to({y:300},1000).easing(Phaser.Easing.Bounce.Out).start();
        
        
        
        // localStorage.setItem('name', value)
        if (!localStorage.getItem('najdobriPoeni')) {     
            localStorage.setItem('najdobriPoeni', 0);
        }
        
        if (game.global.rezultat > localStorage.getItem('najdobriPoeni')) {
            localStorage.setItem('najdobriPoeni', game.global.rezultat);
        }

        var text = 'Поени: ' + game.global.rezultat + '\n Најдобри поени: ' +
            localStorage.getItem('najdobriPoeni');
        
        var scoreLabelа = game.add.text(game.world.centerX, game.world.centerY, text,
                                       { font: '25px Arial', fill: '#ffffff', align: 'center' });
        scoreLabelа.anchor.setTo(0.5, 0.5);
        
        

       
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
        game.global.brojZivoti = 5;
        zivoti.length = 0;
        // Startuvaj ja igrata
        game.state.start('level1');
    }
};
