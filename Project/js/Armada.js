
function Player(game, key, frame, size)
{// Player Constructor 

	var scale_x = Math.random() * 0.5;
	var scale_y = Math.random() * 0.5;
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(0, game.world.width - size * scale_x), 
		game.rnd.integerInRange(0, game.world.height - size * scale_y), key, frame);
	
	this.scale.x = scale_x; // set the scales 
	this.scale.y = scale_y; 
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	this.body.velocity.x = game.rnd.integerInRange(-180, 180); // random velocity 
	
	// used addKey instead of putting it in the update function, 
	// can comment out and use the commented section in update function instead (details in README)
	var direction = game.input.keyboard.addKey(Phaser.Keyboard.R);
	direction.onDown.add(() => { // add keyboard event
		this.body.velocity.x *= -1;
	}, this);
	
}// End Armada constructor 

Armada.prototype = Object.create(Phaser.Sprite.prototype);
Armada.prototype.constructor = Armada;

Armada.prototype.update = function()
{// update, change direction when the ship reaches the end of the screen 
	
	/*
	if(game.input.keyboard.isDown(Phaser.Keyboard.R))
	{// can be used as change direction key
		this.body.velocity.x *= -1;
	}
	*/
	
	if(this.body.x <= 0 - this.body.width )
	{
		this.body.x = game.world.width;
	}
	else if(this.body.x >= game.world.width)
	{
		this.body.x = 0 - this.body.width;
	}
	
}// End update 