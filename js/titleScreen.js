var titleScreen = function(game){};
titleScreen.prototype = {
	create: function() {
		// reset game
		chapter = 0;
		score = 3;

		// splash background
		game.add.sprite(0, 0, 'TitleBG');
		var startButton = game.add.button(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'playButton', this.startIntro);
		startButton.anchor.set(0.5);
		startButton.scale.setTo(0.1);
		game.add.text(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'Play', {font: "18px Courier New", fill: "#ffffff"});
	},
	startIntro: function(){
		game.state.start('TextScreen');
	}
}