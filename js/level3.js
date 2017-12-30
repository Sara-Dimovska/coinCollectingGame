var playStateLvl3 = {
    sozdadiSvet: function() {
       
        this.map = game.add.tilemap('map3');
        this.map.addTilesetImage('walls');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1, 999, true, 'Tile Layer 1');
        // {x: 200, y: 790}
        this.paricka = game.add.sprite(855,790,'paricka');       
        game.physics.arcade.enable(this.paricka);


        this.neprijateli = game.add.group();
        this.neprijateli.enableBody = true;
        // Kreiraj "n" neprijateli od istata slika
        // grupata e "dead" pod default, neaktivna
        this.neprijateli.createMultiple(10, 'neprijatel');
        this.neprijateli.setAll('outOfBoundsKill', true);
        this.neprijateli.setAll('checkWorldBounds',true);
       

        for(var i=0;i<game.global.brojZivoti;i++){
            zivoti.push(game.add.sprite(zivotPocetokX + i *(zivotDolzina + prostor_PomegjuZivoti),zivotPocetokY,'zivot'));
        }         


    },
    create: function(){ // rezervirana Phaser funkcija

        game.add.image(0,0,'pozadina2');
        this.cursor = game.input.keyboard.createCursorKeys(); // za strelki

        this.wasd = {                                         // za wasd kopcinja
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        this.sozdadiSvet();

        this.igrac = game.add.sprite(450,630,'igrac');       
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
        laseri.createMultiple(50,'puka');
        laseri.setAll('anchor.x',1);
        laseri.setAll('anchor.x',0.5);
        laseri.setAll('outOFBoundsKill',true);
        laseri.setAll('checkWorldBounds',true);

        laseriTriger = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.sledenNeprijatelVreme = 3200;
    },

    update: function(){ // rezervirana Phaser funkcija

        // kje ima kolizija pomegju igracot i zidovite
        game.physics.arcade.collide(this.igrac, this.layer);


        this.igracDvizenje();

        if (!this.igrac.inWorld) {
            this.igracUmira();
        }

        // povikaj 'zemiParicka' koga igracot se preklopuva so parickata
        game.physics.arcade.overlap(this.igrac, this.paricka, this.zemiParicka, null, this);

        // ovozmozi kolizija megju neprijatel i zid
        game.physics.arcade.collide(this.neprijateli, this.layer);
        // povikaj funkcija odzemiZivot sekoj pat koga kje se sudrat igrac i neprijatel
        game.physics.arcade.overlap(this.igrac, this.neprijateli, this.odzemiZivot,null, this);

        game.physics.arcade.collide(laseri, this.layer,this.laserVoZid,null,this);
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
       
        if(game.global.rezultat == 100){
            game.state.start('congrats');
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
        if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.igrac.body.onFloor()) {
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
                
                
                if(this.igrac.frame == 0){ // igrac nasocen levo
                    laser.reset(this.igrac.x + 5,this.igrac.y + 40);
                    laser.body.velocity.x = - 400;
                }               
                else if(this.igrac.frame == 1){// igrac nasocen desno
                    laser.reset(this.igrac.x + 70,this.igrac.y + 40);
                    laser.body.velocity.x = 400;
                } 
                    
                
                laserVreme = game.time.now + 200;
            }
        }
    },
    odzemiZivot:function(igrac,neprijatel){
        if(game.global.brojZivoti > 0){
            this.mrtovIgrac.play();
            neprijatel.kill();
            zivoti[game.global.brojZivoti-1].kill();
            zivoti.pop(); 
            game.global.brojZivoti--;
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
            {x: 345, y: 390},  {x: 595, y: 390},
            {x: 225, y: 590}, {x: 725, y: 590},
            {x: 80, y: 790},  {x: 855, y: 790}
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
        neprijatel.body.velocity.x = 90 *plusOrMinus; 
        neprijatel.body.bounce.set(1);

    }
};