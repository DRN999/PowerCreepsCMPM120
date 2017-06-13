

window.onload = function() 
{
	game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, 'phaser');
	game.state.add('Boot', boot);
	game.state.add('Preload', preload);
	game.state.add('TitleScreen', titleScreen);
	game.state.add('IntroScreen', introScreen);
	game.state.add('PlayGame', playGame);
	game.state.add('TextScreen', textScreen);
	game.state.add('GameOverScreen', gameOverScreen);
	game.state.start("Boot");
}



