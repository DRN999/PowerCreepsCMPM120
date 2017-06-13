// boot state, optional loading screen
var boot = function(game){};
boot.prototype = {
	preload: function() {
		// preload the loading bar for preload state
	},
	create: function() {
		// move to preload state
		this.game.state.start('Preload');
	}
}