var menuState = {
    create: function() {
        // dodadi pozadina
        game.add.image(0, 0, 'pozadina1');
        // prikazi ime na igra
        var naslov = game.add.text(game.world.centerX, -50, 'Собирај парички',
                                      { font: '50px Arial', fill: '#ffffff' });      
        naslov.anchor.setTo(0.5, 0.5);      
        /* tweens, svojstvo za vizuelni efekti
         go pridvizuva naslovot do 300px za vreme  od 1s(1000ms) 
         default e konstantna brzina, easing - funkcija za dopolnitelni efekti 
        */
        game.add.tween(naslov).to({y:300},1000).easing(Phaser.Easing.Bounce.Out).start();

              
        
        // Objasnenie kako da se startuva igrata
        var startuvaj = game.add.text(game.world.centerX, game.world.centerY + 60,
                                       'за Старт на играта, притиснете ја стрелката за надолу',
                                       { font: '25px Arial', fill: '#ffffff' });
        startuvaj.anchor.setTo(0.5, 0.5);
        /*
            1. ja rotira labelata za -2 stepeni za vreme od  pola sekunda
            2. ja rotira labelata za +2 stepeni za vreme od  pola sekunda
            3. beskonecen ciklus
            4. vkluci go seto toa so povik na start();
        */       
        game.add.tween(startuvaj).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();

        
        // promenliva za prifakjanje na user input (dolna strelka)    
        var key = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        
        /*
            onDown.addOnce(contexFunction, context);
            Koga e pritistano soodvetnoto kopce, povikaj ja navedenata contexFunction
        */
        key.onDown.addOnce(this.start, this);
        
        // localStorage.setItem('name', value)
        if (!localStorage.getItem('najdobriPoeni')) {     
            localStorage.setItem('najdobriPoeni', 0);
        }
        
        if (game.global.rezultat > localStorage.getItem('najdobriPoeni')) {
            localStorage.setItem('najdobriPoeni', game.global.rezultat);
        }

        var text = 'Поени: ' + game.global.rezultat + '\n Најдобри поени: ' +
            localStorage.getItem('najdobriPoeni');
        
        var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text,
                                       { font: '25px Arial', fill: '#ffffff', align: 'center' });
        scoreLabel.anchor.setTo(0.5, 0.5);
    },
    start: function() {
        // Startuvaj ja igrata
        game.state.start('play');
    }
};
