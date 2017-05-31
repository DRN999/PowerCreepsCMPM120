
function Ally(game, key, frame, size, p_x, p_y, scale) 
{// constructor 
	Phaser.Sprite.call(this, game, p_x, p_y, key, frame);
	
	this.scale.x = scale // set the scales 
	this.scale.y = scale; 
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	this.stats = { // status of the ally 
		movement: 7,
		health: 20,
		def: 0,
		atk: 5,
		spd: 8
	};
	
	this.map_wall = this.get_new_map(); // init wall map 
	
	this.map_bool = this.get_new_map_boolean(); // init movement boolean 
	
	this.tile_coord = 
	{// gets the tile coordinate of this character 
		x: () => layer1.getTileX(this.x),
		y: () => layer1.getTileX(this.y)
	};
	
	this.bounds = game.add.graphics();
	this.update_bounds();
	this.bounds.alpha = 0.0;
	
}// End create 

Ally.prototype = Object.create(Phaser.Sprite.prototype);
Ally.prototype.constructor = Ally;

Ally.prototype.update_bounds = function()
{// updates the movement bound of the ally  
	this.dijkstra();
	this.bounds.clear();
    this.bounds.lineStyle(2, 0x0000FF, 1);
	this.bounds.beginFill(0x0000FF);
	for(var i = 0; i <= this.stats.movement * 2; i++)
	{// draw blue into movement area 
		for(var j = 0; j <= this.stats.movement * 2; j++)
		{
			
			var draw = true;
			var bound_x = i - this.stats.movement;
			var bound_y = j - this.stats.movement;
			
			if(this.map_bool[j][i])
				this.bounds.drawRect((this.tile_coord.x() + bound_x) * 48, (this.tile_coord.y() + bound_y) * 48, 48, 48);
		}
	}
}// End update_bounds 

Ally.prototype.update = function()
{// update, change direction when the ship reaches the end of the screen 
	
	
}// End update 

Ally.prototype.get_new_map = function()
{// create initial map 
	var ret = new Array();
	for(var i = 0; i < this.stats.movement * 2 + 1; i++)
	{
		var temp = new Array();
		for(var j = 0; j < this.stats.movement * 2 + 1; j++)
		{
			temp.push(1);
		}
		ret.push(temp);
	}
	return ret;
}// End get_new_map 

Ally.prototype.get_new_map_boolean = function()
{// returns a new 17x17 array filled with boolean:false 
	var ret = new Array();
	for(var i = 0; i < this.stats.movement * 2 + 1; i++)
	{
		var temp = new Array();
		for(var j = 0; j < this.stats.movement * 2 + 1; j++)
		{
			temp.push(false);
		}
		ret.push(temp);
	}
	return ret;
}// End get_new_map_boolean 

Ally.prototype.update_map_wall = function()
{// updates the wall information of the surrounding tiles 
	
	// get tiles of the surrounding area with the movement area 
	var wall_arr = layer2.getTiles(this.tile_coord.x() * 48 - this.stats.movement * 48, 
	this.tile_coord.y() * 48 - this.stats.movement * 48, (this.stats.movement * 2 + 1) * 48, (this.stats.movement * 2 + 1) * 48);
	
	// check for x-axis overflow 
	if(this.tile_coord.x() - this.stats.movement < 0)
	{
		for(var i = 0; i < this.stats.movement * 2 + 1; i++)
		{
			for(var j = 0; j < this.stats.movement - this.tile_coord.x(); j++)
				wall_arr.splice(i * (this.stats.movement * 2 + 1), 0, {index: 100});
		}	
	}
	else if(this.tile_coord.x() + this.stats.movement > 49)
	{
		for(var i = 0; i < this.stats.movement * 2 + 1; i++)
		{
			for(var j = 0; j < this.tile_coord.x() + this.stats.movement - 49; j++)
				wall_arr.splice(i * (this.stats.movement * 2 + 1) + (this.stats.movement * 2 + 1) - (this.tile_coord.x() + this.stats.movement - 49), 0, {index: 100});
		}
		
	}
	// check for y-axis overflow 
	if(this.tile_coord.y() - this.stats.movement < 0)
	{
		for(var i = 0; i < this.stats.movement - this.tile_coord.y(); i++)
			for(var j = 0; j < this.stats.movement * 2 + 1; j++)
				wall_arr.unshift({index: 100});
	}
	else if(this.tile_coord.y() + this.stats.movement > 49)
	{
		for(var i = 0; i < this.tile_coord.y() + this.stats.movement - 49; i++)
			for(var j = 0; j < this.stats.movement * 2 + 1; j++)
				wall_arr.push({index: 100});
	}
	
	// convert the information into array 
	for(var i = 0; i < this.map_wall.length; i++)
	{
		for(var j = 0; j < this.map_wall[i].length; j++)
		{
			if(wall_arr[i * this.map_wall.length + j].index == -1)
				this.map_wall[i][j] = 1;
			else
				this.map_wall[i][j] = 99;
		}
	}
	
}// End update_map_wall 

Ally.prototype.dijkstra = function() 
{// uses dijkstra's algorithm to compute the movement range of the character given the map_wall 
	var map_b = this.get_new_map_boolean(); // init boolean 
	this.update_map_wall(); // update the wall information 
	var current_x = this.stats.movement; // current node location x
	var current_y = this.stats.movement; // current node location y 
	var current_node = new Array(); // current node tree 
	current_node.push([{x: this.stats.movement, y: this.stats.movement}]);
	map_b[current_y][current_x] = true // init first boolean array point 
	for(var iter = 0; iter < this.stats.movement; iter++)
	{// iterates through the number of movements the character can make 
		var temp = new Array(); 
		for(var tr = 0; tr < current_node[iter].length; tr++)
		{// iterates through the array of object, pushes the unused tiles 
			current_x = current_node[iter][tr].x;
			current_y = current_node[iter][tr].y;
			
			// checks each side if it was already searched, and markes them as moveable  
			if(this.map_wall[current_y - 1][current_x] != 99 && map_b[current_y - 1][current_x] == false)
			{
				temp.push({x: current_x, y: current_y - 1});
				map_b[current_y - 1][current_x] = true;
			}
			if(this.map_wall[current_y][current_x - 1] != 99 && map_b[current_y][current_x - 1] == false)
			{
				temp.push({x: current_x - 1, y: current_y});
				map_b[current_y][current_x - 1] = true;
			}
			if(this.map_wall[current_y + 1][current_x] != 99 && map_b[current_y + 1][current_x] == false)
			{
				temp.push({x: current_x, y: current_y + 1});
				map_b[current_y + 1][current_x] = true;
			}
			if(this.map_wall[current_y][current_x + 1] != 99 && map_b[current_y][current_x + 1] == false)
			{
				temp.push({x: current_x + 1, y: current_y});
				map_b[current_y][current_x + 1] = true;
			}
		}
		
		current_node.push(temp);// add the collected object-array to the main array 
	}
	console.log(current_node);
	this.map_bool = map_b;// convert the main boolean map to this updated one 
}// End dijkstra 

