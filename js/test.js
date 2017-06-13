

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

function init_tiledata(width, height) 
{// inititalize tile_data 
	var ret = new Array();
	for(var i = 0; i < width; i++)
	{
		var temp = new Array();
		for(var j = 0; j < height; j++)
		{
			temp.push
			({
				collide: false,
				occupied: false,
				name: "floor",
				occupant: null
				
			});
		}
		ret.push(temp);
	}
	return ret;
}// End init_tiledata 

