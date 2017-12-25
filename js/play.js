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
var laserVreme = 0;
var laseri;
var laseriTriger;

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
        this.neprijateli.createMultiple(10, 'neprijatel');
        this.neprijateli.setAll('outOfBoundsKill', true);
        this.neprijateli.setAll('checkWorldBounds',true);
        //game.time.events.loop(4000, this.dodajNeprijatel, this); // na sekoi 4s dodadi neprijatel vo scenata


        brojZivoti = 5; 

        for(var i=0;i<5;i++){
            zivoti.push(game.add.sprite(zivotPocetokX + i *(zivotDolzina + prostor_PomegjuZivoti),zivotPocetokY,'zivot'));
        }         


    },
    create: function(){ // default Phaser funkcija

        game.add.image(0,0,'pozadina2');
        this.cursor = game.input.keyboard.createCursorKeys(); // za strelki

        this.wasd = {                                         // za wasd kopcinja
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        this.sozdadiSvet();

        this.igrac = game.add.sprite(game.world.centerX,0,'igrac');       
        this.igrac.frame = 1;

        game.physics.arcade.enable(this.igrac);
        this.igrac.body.gravity.y = 500;

        // Prikazi rezultat
        this.rezultatLabela = game.add.text(50, 10, 'парички: 0/100',{ font: '30px "Arial Black", Gadget, sans-serif', 
                                                                     fill: '#600000',
                                                                     fontWeight: 'bold'});

        game.global.rezultat = 0;

        this.skokaZvuk = game.add.audio('skoka');
        this.skokaZvuk.volume = 0.3;
        this.zemaParickaZvuk = game.add.audio('zemaParicka');
        this.zemaParickaZvuk.volume = 0.4;
        this.mrtovNeprijatel = game.add.audio('mrtovNeprijatel');
        this.mrtovNeprijatel.volume = 0.35;
        this.mrtovIgrac = game.add.audio('mrtovIgrac');
        this.mrtovIgrac.volume = 0.35;

        // pukanje
        laseri =game.add.group();
        laseri.enableBody = true;
        laseri.physicsBodyType = Phaser.Physics.ARCADE;
        laseri.createMultiple(3000,'puka');
        laseri.setAll('anchor.x',1);
        laseri.setAll('anchor.x',0.5);
        laseri.setAll('outOFBoundsKill',true);
        laseri.setAll('checkWorldBounds',true);

        laseriTriger = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.sledenNeprijatelVreme = 3200;
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

        game.physics.arcade.collide(laseri, this.zidovi,this.laserVoZid,null,this);
        game.physics.arcade.overlap(this.neprijateli,laseri,this.ubijNeprijatel,null,this);


        if (this.sledenNeprijatelVreme < game.time.now) {
            // pomoshni
            var pocetok = 4000, kraj = 1000, poeni = 50;
           
            /*
             presmetki za namaluvanje na vremetraenje pomegju sekoj nov neprijatel:
             
            za 0la paricki:
                – docnenje = max(4000 - 3000 * 0/100, 1000) = max(4000 - 0, 1000) = 4000 // na  sekoi 4s po eden
                
            za 25 paricki sobrani:
                – docnenje = max(4000 - 3000*50/100, 1000) = max(4000 - 1500, 1000) = 2500 // na  sekoi 2.5s po eden
                
            za 50 paricki sobrani:
                – docnenje = max(4000 - 3000*100/100, 1000) = max(4000 - 3000, 1000) = 1000 // po eden neprijatel za 1s              
            */
            var docnenje = Math.max(pocetok - (pocetok-kraj)*game.global.rezultat / poeni, kraj);
            this.dodajNeprijatel();
            this.sledenNeprijatelVreme = game.time.now + docnenje;
        }


    },
    ubijNeprijatel:function(neprijatel, laser){
        neprijatel.kill();
        this.mrtovNeprijatel.play();
    },
    laserVoZid:function(laser,zid){
        laser.kill();
    },
    igracDvizenje: function(){
        if(this.cursor.left.isDown || this.wasd.left.isDown){ // pomestuvanje na igracot na levo ako e pritisnata  strelka na levo                   
            this.igrac.body.velocity.x = -300;
            this.igrac.frame = 0;

        }
        else if(this.cursor.right.isDown || this.wasd.right.isDown){ // desno
            this.igrac.body.velocity.x = 300;
            this.igrac.frame = 1;
        }

        else if(this.cursor.down.isDown || this.wasd.down.isDown){  // zabrzaj pagjanje za nadolu           
            this.igrac.body.velocity.y = 300;
        }
        else{ // nema promeni
            this.igrac.body.velocity.x = 0;
        }

        // ako e pritisnata gorna strelka i igracot e na zemja
        if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.igrac.body.touching.down) {
            // treba da skoka
            this.igrac.body.velocity.y = -520;  
            this.skokaZvuk.play();
        }

        if(laseriTriger.isDown){
            this.pukajFunkcija();
        }
    },
    pukajFunkcija: function(){
        if(game.time.now > laserVreme){
            var laser = laseri.getFirstExists(false);

            if(laser){
                laser.reset(this.igrac.x + 5,this.igrac.y + 40);
                if(this.igrac.frame == 0) // nasocen levo
                    laser.body.velocity.x = - 400;
                else if(this.igrac.frame == 1)
                    laser.body.velocity.x = 400;
                laserVreme = game.time.now + 200;
            }
        }
    },
    odzemiZivot:function(igrac,neprijatel){
        if(brojZivoti > 0){
            this.mrtovIgrac.play();
            neprijatel.kill();
            zivoti[brojZivoti-1].kill();
            zivoti.pop(); 
            brojZivoti--;
        }

        else {
            this.igracUmira();
        }


    },
    igracUmira: function() {
        this.mrtovIgrac.play(); 
        zivoti.length = 0;
        game.state.start('gameOver');
    },
    zemiParicka: function(igrac, paricka) {
        this.zemaParickaZvuk.play();

        // obnovi rezultat
        game.global.rezultat += 5;
        this.rezultatLabela.text = 'парички: ' + game.global.rezultat + '/100';

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
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        neprijatel.anchor.setTo(0.5, 1);
        neprijatel.reset(game.world.centerX, 0);
        neprijatel.body.gravity.y = 100;        
        neprijatel.body.velocity.x = 90 *plusOrMinus; // 100 or -100
        neprijatel.body.bounce.set(1);

    }
};