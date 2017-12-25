var menuState = {
    create: function() {
        // dodadi pozadina
        game.add.image(0, 0, 'pozadina1');
        // prikazi ime na igra
        var naslov = game.add.text(game.world.centerX, -50, 'Собирај парички',
                                      { font: '80px Arial', fill: '#ffffff' });      
        naslov.anchor.setTo(0.5, 0.5);      
        /* tweens, svojstvo za vizuelni efekti
         go pridvizuva naslovot do 300px za vreme  od 1s(1000ms) 
         default e konstantna brzina, easing - funkcija za dopolnitelni efekti 
        */
        game.add.tween(naslov).to({y:300},1000).easing(Phaser.Easing.Bounce.Out).start();

              
        
        // Objasnenie kako da se startuva igrata
        var startuvaj = game.add.text(game.world.centerX, game.world.centerY + 60,
                                       'Стартувајте со Enter или клик',
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
        var key = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        
        /*
            onDown.addOnce(contexFunction, context);
            Koga e pritistano soodvetnoto kopce, povikaj ja navedenata contexFunction
            ili na click od mouse
        */
        key.onDown.addOnce(this.start, this);
        game.input.onDown.add(this.start,this);
        
       
    },
    start: function() {
        // Startuvaj ja igrata
        game.state.start('play');
    }
};
