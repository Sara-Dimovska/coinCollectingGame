/*
    my Bugs:
   
*/

var playState = {
    sozdadiSvet: function() {
        // Kreiranje grupa so pomosh na vklucen Arcade physics
        this.zidovi = game.add.group();
        this.zidovi.enableBody = true;
        
        
        // Kreiraj 10 zidovi
        game.add.sprite(0, 0, 'zidV', 0, this.zidovi); // Lev
        game.add.sprite(950, 0, 'zidV', 0, this.zidovi); // Desen
        game.add.sprite(0, 0, 'zidH', 0, this.zidovi); // Goren lev
        game.add.sprite(600, 0, 'zidH', 0, this.zidovi); // Goren desen
        game.add.sprite(0, 850, 'zidH', 0, this.zidovi); // Dolen lev
        game.add.sprite(600, 850, 'zidH', 0, this.zidovi); // Dolen desen
        game.add.sprite(-200, 400, 'zidH', 0, this.zidovi); // Sreden lev
        game.add.sprite(800, 400, 'zidH', 0, this.zidovi); // Sreden desen

        var gorenSreden = game.add.sprite(230, 200, 'zidH', 0, this.zidovi);
        //  scale x = 120% y=100% (ako e 100% nema promena)
        gorenSreden.scale.setTo(1.2, 1);
        
        var dolenSreden = game.add.sprite(230, 600, 'zidH', 0, this.zidovi);
        dolenSreden.scale.setTo(1.2, 1);
        
        // Postavi gi site zidovi da bidat nepodvizni koga  kje bidat dopreni
        this.zidovi.setAll('body.immovable', true);
       
    },
    create: function(){ // default Phaser funkcija
 
        this.cursor = game.input.keyboard.createCursorKeys(); // za strelki

        this.sozdadiSvet();

        this.igrac = game.add.sprite(game.world.centerX,0,'igrac');       
        this.igrac.frame = 1;

        game.physics.arcade.enable(this.igrac);
        this.igrac.body.gravity.y = 500;

        // Prikazi rezultat
        this.rezultat = game.add.text(50, 10, 'резултат: 0',{ font: '30px Arial', fill: '#ffffff' });

        game.global.score = 0;


    },
    
    update: function(){ // default Phaser funkcija
        
        // kje ima kolizija pomegju igracot i zidovite
        game.physics.arcade.collide(this.igrac, this.zidovi);
        
        
        this.igracDvizenje();

        if (!this.igrac.inWorld) {
            this.igracUmira();
        }
      
    },
  
    igracDvizenje: function(){
        if(this.cursor.left.isDown){ // pomestuvanje na igracot na levo ako e pritisnata  strelka na levo                   
            this.igrac.body.velocity.x = -300;
            this.igrac.frame = 0;

        }
        else if(this.cursor.right.isDown){ // desno
            this.igrac.body.velocity.x = 300;
            this.igrac.frame = 1;
        }

        else if(this.cursor.down.isDown){  // zabrzaj pagjanje za nadolu           
            this.igrac.body.velocity.y = 300;
        }
        else{ // nema promeni
            this.igrac.body.velocity.x = 0;
        }
        
        // ako e pritisnata gorna strelka i igracot e na zemja
        if (this.cursor.up.isDown && this.igrac.body.touching.down) {
            // treba da skoka
            this.igrac.body.velocity.y = -520;         
        }

    },
    igracUmira: function() {
        game.state.start('menu');      
    }
};