
function Player(game, key, frame, size, p_x, p_y, scale)
{// Player Constructor 

	
	Phaser.Sprite.call(this, game, p_x, p_y, key, frame);
	
	this.scale.x = scale // set the scales 
	this.scale.y = scale; 
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	var key_up = game.input.keyboard.addKey(Phaser.Keyboard.W);
	key_up.onDown.add(() => { // add keyboard event
		move_up = true;
		this.counter = 0;
	}, this);
	key_up.onUp.add(() => {
		move_up = false;
	}, this);
	
	var key_down = game.input.keyboard.addKey(Phaser.Keyboard.S);
	key_down.onDown.add(() => { // add keyboard event
		move_down = true;
		this.counter = 0;
	}, this);
	key_down.onUp.add(() => {
		move_down = false;
	}, this);
	
	var key_left = game.input.keyboard.addKey(Phaser.Keyboard.A);
	key_left.onDown.add(() => { // add keyboard event
		move_left = true;
		this.counter = 0;
	}, this);
	key_left.onUp.add(() => {
		move_left = false;
	}, this);
	
	var key_right = game.input.keyboard.addKey(Phaser.Keyboard.D);
	key_right.onDown.add(() => { // add keyboard event
		move_right = true;
		this.counter = 0;
	}, this);
	key_right.onUp.add(() => {
		move_right = false;
	}, this);
	
	var key_shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	key_shift.onDown.add(() => {
		this.counter_delta = 2;
	}, this)
	key_shift.onUp.add(() => {
		this.counter_delta = 5;
	}, this);
	
	game.input.onDown.add(unpause, self);
	
	function unpause(event)
	{
		if(game.paused){
				
				var key_esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
				key_esc.onDown.add(function(){
				//else{
					// Remove the menu and the label
					placeholder.destroy();
					standbutton.destroy();
					attackbutton.destroy();
					//choiseLabel.destroy();

					// Unpause the game
					game.paused = false;
				//}
				});
			}
	}
	
	
	this.counter = 0;
	this.counter_delta = 5;
	
}// End Player constructor 

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{// update, change direction when the ship reaches the end of the screen 
	if(this.counter % this.counter_delta == 0)
		this.movement();
	this.counter++;
	
}// End update 

Player.prototype.movement = function()
{
	if(move_up)
	{
		this.y -= 48;
	}
	if(move_down)
	{
		this.y += 48;
	}
	if(move_left)
	{
		this.x -= 48;
	}
	if(move_right)
	{
		this.x += 48;
	}
}