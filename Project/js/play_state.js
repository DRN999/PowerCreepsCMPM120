// play state of the game 

var play_state = 
{// the main play mode 
	
	preload: function()
	{// preload assets
		
		var name = images[0].split('.')[0].split('/');
		var name2 = images[1].split('.')[0].split('/');
		game.load.image(name[name.length - 1], images[0]);
		game.load.image(name2[name2.length - 1], images[1]);
		
	},// End preload 
	
	create: function()
	{// create play_state
		
		console.log('play_state:create');
		
		player = new Player(game, 'Square', 0, 512, 375, 750, 0.1); // 512 is the size of the image 
		game.add.existing(player); // add the new armada to the game 
		
		var rand = Math.floor(Math.random() * 10 + 1)
		for(var i = 0; i < rand; i++)
		{
			var enem = new Enemy(game, 'Square', 0, 512, Math.floor(Math.random() * 700), Math.floor(Math.random() * 600), 0.1); // 512 is the size of the image
			game.add.existing(enem); // add the new armada to the game 
			enemies.push(enem);
		}
		
		
	},// End create 

	update: function()
	{// check or collisions and other events 
		if(player.body.y < -50)
		{
			move_up = false;
			move_down = false;
			move_left = false;
			move_right = false;
			game.state.start('play_state');
		}
		//console.log(enemies);
		for(var i = 0; i < enemies.length; i++)
		{
			game.physics.arcade.overlap(player, enemies[i], this.player_hit , null, this);
			game.physics.arcade.overlap(player, enemies[i].graphics, this.player_hit , null, this);
		}
		
	}, // End update 
	
	player_hit: function()
	{// when the player is hit by an enemy
		// more details will be here when there is more game mechianics implemented 
		game.state.start('game_over');
		
	}// End player_hit
	
	
};
