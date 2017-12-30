// Phaser init
var game = new Phaser.Game(1000, 900, Phaser.AUTO, 'gameDiv');
// Globalni promenlivi 
game.global = {
    rezultat: 0,
    brojZivoti : 5
};
// Dodaj gi site sostojbi
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('level1', playStateLvl1);
game.state.add('level2', playStateLvl2);
game.state.add('level3', playStateLvl3);
game.state.add('gameOver', gameOverState);
game.state.add('congrats',congratsState);
// Pocni od 'boot' sostojba
game.state.start('boot');
