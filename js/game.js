// Phaser init
var game = new Phaser.Game(1000, 900, Phaser.AUTO, 'gameDiv');
// Globalna promenliva
game.global = {
    score: 0
};
// Dodaj gi site sostojbi
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
// Pocni od 'boot' sostojba
game.state.start('boot');
