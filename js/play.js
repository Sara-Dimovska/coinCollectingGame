/*
    Fixing list:
    - enemy time
    - enemy teleport
    
*/
var zivotPocetokX = 640;
var zivotPocetokY = 10;
var zivotDolzina = 35;
var prostor_PomegjuZivoti = 20;
var brojZivoti;
var zivoti = [];

var playState = {
    sozdadiSvet: function() {
       
        this.zidovi = game.add.group();  // Kreiranje grupa 
        this.zidovi.enableBody = true; // dodadi Arcade physics svojstva za celata grupa
        
        
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
        
        this.paricka = game.add.sprite(100,340,'paricka');       
        game.physics.arcade.enable(this.paricka);
        
    
        this.neprijateli = game.add.group();
        this.neprijateli.enableBody = true;
        // Kreiraj "n" neprijateli od istata slika
        // grupata e "dead" pod default, neaktivna
        this.neprijateli.createMultiple(2, 'neprijatel');
        game.time.events.loop(4000, this.dodajNeprijatel, this); // na sekoi 4s dodadi neprijatel vo scenata


        brojZivoti = 5; 

        for(var i=0;i<5;i++){
            zivoti.push(game.add.sprite(zivotPocetokX + i *(zivotDolzina + prostor_PomegjuZivoti),zivotPocetokY,'zivot'));
        }         

       
    },
    create: function(){ // default Phaser funkcija
 
        game.add.image(0,0,'pozadina2');
        this.cursor = game.input.keyboard.createCursorKeys(); // za strelki

        this.sozdadiSvet();

        this.igrac = game.add.sprite(game.world.centerX,0,'igrac');       
        this.igrac.frame = 1;

        game.physics.arcade.enable(this.igrac);
        this.igrac.body.gravity.y = 500;

        // Prikazi rezultat
        this.rezultatLabela = game.add.text(50, 10, 'парички: 0/50',{ font: '30px "Arial Black", Gadget, sans-serif', 
                                                             fill: '#600000',
                                                             fontWeight: 'bold'});

        game.global.rezultat = 0;
        
        this.skokaZvuk = game.add.audio('skoka');
        this.skokaZvuk.volume = 0.3;
        this.zemaParickaZvuk = game.add.audio('zemaParicka');
        this.zemaParickaZvuk.volume = 0.4;
        this.mrtovZvuk = game.add.audio('mrtov');
        this.mrtovZvuk.volume = 0.35;

    },
    
    update: function(){ // default Phaser funkcija
        
        // kje ima kolizija pomegju igracot i zidovite
        game.physics.arcade.collide(this.igrac, this.zidovi);
        
        
        this.igracDvizenje();

        if (!this.igrac.inWorld) {
            this.igracUmira();
        }
      
        // povikaj 'zemiParicka' koga igracot se preklopuva so parickata
        game.physics.arcade.overlap(this.igrac, this.paricka, this.zemiParicka, null, this);
        
        // ovozmozi kolizija megju neprijatel i zid
         game.physics.arcade.collide(this.neprijateli, this.zidovi);
        // povikaj funkcija odzemiZivot sekoj pat koga kje se sudrat igrac i neprijatel
        game.physics.arcade.overlap(this.igrac, this.neprijateli, this.odzemiZivot,null, this);
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
            this.skokaZvuk.play();
        }

    },
    odzemiZivot:function(igrac,neprijatel){
        if(brojZivoti > 0){
            this.mrtovZvuk.play();
            neprijatel.kill();
            zivoti[brojZivoti-1].kill();
            zivoti.pop(); 
            brojZivoti--;
        }

        else {
            this.playerDie();
        }


    },
    igracUmira: function() {
        this.mrtovZvuk.play();
        game.state.start('menu');   
        zivoti.length = 0;
        game.state.start('menu');
    },
    zemiParicka: function(igrac, paricka) {
        this.zemaParickaZvuk.play();
        
        // obnovi rezultat
        game.global.rezultat += 5;
        this.rezultatLabela.text = 'парички: ' + game.global.rezultat + '/50';
        
        // napravi nevidliva paricka
        this.paricka.scale.setTo(0, 0);
        
        // Skaliraj paricka za vremeod 300ms
        game.add.tween(this.paricka.scale).to({x: 1, y: 1}, 300).start();     
        // game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
        
        
        this.obnoviPozicijaParicka();
    },
    obnoviPozicijaParicka: function() {
        // Zacuvaj site mozni pozicii na paricka vo niza
        var pozicijaParicka = [
            {x: 300, y: 140}, {x: 650, y: 140}, // Goren red
            {x: 100, y: 340}, {x: 865, y: 340}, // Sreden red
            {x: 300, y: 790}, {x: 640, y: 790} // Dolen red

        ];
        // Izbrisi ja tekovnata pozicija od nizata
        for (var i = 0; i < pozicijaParicka.length; i++) {
            if (pozicijaParicka[i].x === this.paricka.x) {
                pozicijaParicka.splice(i, 1);
            }
        }
        // biranje random pozicija od nizata
        var novaPozicija = pozicijaParicka[game.rnd.integerInRange(0, pozicijaParicka.length-1)];
        this.paricka.reset(novaPozicija.x, novaPozicija.y);
    },
    /*
    addEnemy() 

    1. Get a dead sprite from the group
    2. If there isn’t any dead sprite, do nothing
    3. Initialise the sprite: position, physics values, autokill

    */

    dodajNeprijatel: function() {
        
        var neprijatel = this.neprijateli.getFirstDead();
        
        // ako ima max broj na neprijateli vo scenata
        if (!neprijatel) {
            return;
        }
        
        // Init
        neprijatel.anchor.setTo(0.5, 1);
        neprijatel.reset(game.world.centerX, 0);
        neprijatel.body.gravity.y = 500; 
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        neprijatel.body.velocity.x = 100 *plusOrMinus; // 100 or -100
        neprijatel.body.collideWorldBounds = true;
        neprijatel.body.bounce.set(1);
        neprijatel.checkWorldBounds = true;
        neprijatel.outOfBoundsKill = true;     
    }
};