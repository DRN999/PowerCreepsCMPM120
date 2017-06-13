

var gameOverScreen = function(game){};
gameOverScreen.prototype = {
	create:function(){
		game.stage.backgroundColor = '#FFFFFF';
		game.add.text(200, 200, 'Press Enter to restart the game', {} );
		enterkey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		enterkey.onDown.addOnce(this.restart,this);
	},
	restart:function(){
		game.state.start('TitleScreen');
		BM3.stop()
		click2.play();
	}
}