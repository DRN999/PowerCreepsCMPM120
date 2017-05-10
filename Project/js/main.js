// main program, starts up phaser 

window.onload = function() 
{// main onload function 
	game = new Phaser.Game(800, 800, Phaser.AUTO); // init phaser 
	game.state.add('play_state', play_state);
	game.state.add('game_over', game_over);
	game.state.start('play_state'); // start game at menu 
}// End window.onload 