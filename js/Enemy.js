
function Enemy(game, key, frame, size, p_x, p_y, scalex, scaley, c_wall, t_data, allies, st) 
{
	Phaser.Sprite.call(this, game, p_x, p_y, key, frame);
	counter = 1;
	this.scale.x = scalex; // set the scales 
	this.scale.y = scaley; 
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	this.stats = { // status of the ally 
		movement: 8,
		health: 20,
		maxhealth:20,
		def: 5,
		atk: 7,
		spd: 5,
		acc: 5
	};
	
	this.id = 0;
	
	this.ai_movement = [
		{x:1, y: 0},
		{x:1, y: 0},
		{x:-1, y: 0},
		{x:-1, y: 0}
	];
	
	this.ai_counter = 0;
	
	this.ai_max = 3;
	
	this.map_wall = this.get_new_map();
	
	this.map_bool = this.get_new_map_boolean();
	
	this.collide_wall = c_wall;
	this.tile_data = t_data;
	
	this.allies = allies;
	
	this.state = st;
	
	this.tile_coord = 
	{// gets the tile coordinate of this character 
		x: () => this.collide_wall.getTileX(this.x),
		y: () => this.collide_wall.getTileX(this.y)
	};
	
	this.bounds = game.add.graphics();
	this.update_bounds();
	this.dijikstra_tree;
	this.bounds.alpha = 0.0;
	
	this.death_event = () => {};
	
	
	
}// End create 

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.get_new_map = function()
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

Enemy.prototype.update_bounds = function()
{// updates the movement bound of the ally  
	
	this.dijkstra();
	this.bounds.clear();
    this.bounds.lineStyle(2, 0xF88383, 1);
	this.bounds.beginFill(0xF88383);
	for(var i = 0; i <= this.stats.movement * 2; i++)
	{
		for(var j = 0; j <= this.stats.movement * 2; j++)
		{
			
			var draw = true;
			var bound_x = i - this.stats.movement;
			var bound_y = j - this.stats.movement;
			
			if(this.map_bool[j][i])
				var rect = this.bounds.drawRect((this.tile_coord.x() + bound_x) * 48, (this.tile_coord.y() + bound_y) * 48, 48, 48);
		}
	}
}// End update_bounds 

Enemy.prototype.update_darkness = function(dark)
{// updates the tile light 
	var tree = this.darkness_dijikstra();
	for( var i = 0; i < tree.length; i++)
	{
		for(var j = 0; j < tree[i].length; j++)
		{
			var change_x = tree[i][j].x - this.stats.movement;
			var change_y = tree[i][j].y - this.stats.movement;
			if(this.tile_coord.x() + change_x >= 0 && this.tile_coord.x() + change_x < 50
			&& this.tile_coord.y() + change_y >= 0 && this.tile_coord.y() + change_x < 50)
				dark.add_coord(this.tile_coord.x() + change_x, this.tile_coord.y() + change_y, 1 - (i - 1) / this.stats.movement);
		}
	}
}// End update_darkness


Enemy.prototype.update = function()
{// update, change direction when the ship reaches the end of the screen 
	
	
}// End update 

Enemy.prototype.get_new_map_boolean = function()
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

Enemy.prototype.update_map_wall = function()
{// fills in the space that are out-of-bound and finds the unwalkable tiles 
	var wall_arr = this.collide_wall.getTiles(this.tile_coord.x() * 48 - this.stats.movement * 48, 
	this.tile_coord.y() * 48 - this.stats.movement * 48, (this.stats.movement * 2 + 1) * 48, (this.stats.movement * 2 + 1) * 48);
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
	
	
	for(var i = 0; i < this.map_wall.length; i++)
	{
		for(var j = 0; j < this.map_wall[i].length; j++)
		{
			
			var x =  j + this.tile_coord.x() - this.stats.movement;
			var y =  i + this.tile_coord.y() - this.stats.movement;
			
			if( x >= 0 && y >= 0 && x < 50 && y < 50 && this.tile_data[x][y].occupant instanceof Enemy && this.tile_data[x][y].occupant !== this)
			{
				this.map_wall[i][j] = 99;
			}
			else if(wall_arr[i * this.map_wall.length + j].index == -1)
				this.map_wall[i][j] = 1;
			else
				this.map_wall[i][j] = 99;
		}
	}
	
}// End update_map_wall 

Enemy.prototype.dijkstra = function() 
{// uses dijkstra's algorithm to compute the movement range of the character given the map_wall 
	var map_b = this.get_new_map_boolean(); // init boolean 
	this.update_map_wall(); // update the wall information 
	var current_x = this.stats.movement; // current node location x
	var current_y = this.stats.movement; // current node location y 
	var current_node = new Array(); // current node tree 
	current_node.push([{x: this.stats.movement, y: this.stats.movement, next: new Array()}]);
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
				var obj = {x: current_x, y: current_y - 1, next: new Array()};
				current_node[iter][tr].next.push(obj);
				temp.push(obj);
				map_b[current_y - 1][current_x] = true;
			}
			if(this.map_wall[current_y][current_x - 1] != 99 && map_b[current_y][current_x - 1] == false)
			{
				var obj = {x: current_x - 1, y: current_y, next: new Array()};
				current_node[iter][tr].next.push(obj);
				temp.push(obj);
				map_b[current_y][current_x - 1] = true;
			}
			if(this.map_wall[current_y + 1][current_x] != 99 && map_b[current_y + 1][current_x] == false)
			{
				var obj = {x: current_x, y: current_y + 1, next: new Array()};
				current_node[iter][tr].next.push(obj);
				temp.push(obj);
				map_b[current_y + 1][current_x] = true;
			}
			if(this.map_wall[current_y][current_x + 1] != 99 && map_b[current_y][current_x + 1] == false)
			{
				var obj = {x: current_x + 1, y: current_y, next: new Array()};
				current_node[iter][tr].next.push(obj);
				temp.push(obj);
				map_b[current_y][current_x + 1] = true;
			}
		}
		
		current_node.push(temp);// add the collected object-array to the main array 
	}
	
	this.dijikstra_tree = current_node[0][0];
	
	this.map_bool = map_b;// convert the main boolean map to this updated one 
}// End dijkstra 


Enemy.prototype.darkness_dijikstra = function()
{// dijikstra search for light 

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
			
			if(this.map_wall[current_y][current_x] == 99)
				continue;
			
			// checks each side if it was already searched, and markes them as moveable  
			if(map_b[current_y - 1][current_x] == false)
			{
				temp.push({x: current_x, y: current_y - 1});
				map_b[current_y - 1][current_x] = true;
			}
			if(map_b[current_y][current_x - 1] == false)
			{
				temp.push({x: current_x - 1, y: current_y});
				map_b[current_y][current_x - 1] = true;
			}
			if(map_b[current_y + 1][current_x] == false)
			{
				temp.push({x: current_x, y: current_y + 1});
				map_b[current_y + 1][current_x] = true;
			}
			if(map_b[current_y][current_x + 1] == false)
			{
				temp.push({x: current_x + 1, y: current_y});
				map_b[current_y][current_x + 1] = true;
			}
		}
		
		current_node.push(temp);// add the collected object-array to the main array 
	}
	
	return current_node;
}// End darkness_dijikstra

Enemy.prototype.dijikstra_tree_search = function(x, y, tree, stack)
{// search shortest path 
	if(tree.next.length == 0)
	{
		if(tree.x == x && tree.y == y)
		{
			stack.push(tree);
			return true;
		}
		return false;
	}
	for(var i = 0; i < tree.next.length; i++)
	{
		stack.push(tree);
		if(tree.x == x && tree.y == y)
			return true;
		else if(this.dijikstra_tree_search(x, y, tree.next[i], stack))
			return true;
		stack.pop();
	}
	return false;
}// End dijikstra_tree 


Enemy.prototype.move = function(last, prev)
{// movement AI/animation for the enemies 
	
	this.update_bounds();
	
	var allyindex_x = (this.allies[0].tile_coord.x() - this.tile_coord.x()) + this.stats.movement;
	var allyindex_y = (this.allies[0].tile_coord.y() - this.tile_coord.y()) + this.stats.movement;
	
	
	this.tile_data[this.collide_wall.getTileX(this.x)][this.collide_wall.getTileY(this.y)].occupied = false;
	this.tile_data[this.collide_wall.getTileX(this.x)][this.collide_wall.getTileY(this.y)].occupant = null;
	
	if( allyindex_y < this.stats.movement * 2 + 1 && allyindex_y >= 0 &&
		allyindex_x < this.stats.movement * 2 + 1 && allyindex_x >= 0 && 
		this.map_bool[allyindex_y][allyindex_x]
	){// movement when ally is in the movement range of the enemy 
		this.ai_counter = 0;
		walk1.play();
		var arr = new Array();
		//console.log(this.dijikstra_tree);
		this.dijikstra_tree_search(allyindex_x, allyindex_y, this.dijikstra_tree, arr);
		if(arr.length > 0)
			arr.pop();
		//console.log(arr);
		this.tile_data[this.tile_coord.x() + (arr[arr.length - 1].x - this.stats.movement)][this.tile_coord.y() + (arr[arr.length - 1].y - this.stats.movement)].occupied = true;
		this.tile_data[this.tile_coord.x() + (arr[arr.length - 1].x - this.stats.movement)][this.tile_coord.y() + (arr[arr.length - 1].y - this.stats.movement)].occupant = this;
		var prev_twn;
		var first_twn;
		for(var i = 0; i < arr.length; i++)
		{// create chained tweens
			
			var twn = game.add.tween(this);
			twn.onStart.add(function(){	if(walk1.isplaying){}else{walk1.play();}},this)
			if(i + 1 == arr.length && last)
			{
				twn.onComplete.add(() => {
					this.state.mode = 0;
					var c = new Combat(this, this.allies[0]);
					c.play();
						
					//this.update_bounds();
					this.bounds.alpha = 0.0;
					this.state.turn_start = 1;
				}, this);
			}
			else if(i + 1 == arr.length)
			{
				twn.onComplete.add(() => {
					//darkmap_redraw();
					var c = new Combat(this, this.allies[0]);
					c.play();
				}, this);
			}
			twn.to(
			{// tween to move one block 
				x: (this.tile_coord.x() + (arr[i].x - this.stats.movement)) * 48, 
				y: (this.tile_coord.y() + (arr[i].y - this.stats.movement)) * 48
			}, 50, 'Linear', false, 0);
			if(i != 0)
				prev_twn.chain(twn);
			else if (i == 0)
				first_twn = twn;
			prev_twn = twn;	
		}
		this.state.mode = 50;
		prev.chain(first_twn);
		
		return twn;
			
	}
	else
	{// movement if an ally is not in the range of enemy 
		var twn = game.add.tween(this);
		twn.onStart.add(function(){	if(walk1.isplaying){}else{walk1.play();}},this)
		if(last)
		{
			twn.onComplete.add(() => {
				walk1.play();
				this.state.mode = 0;
				this.state.turn_start = 1;
				this.update_bounds();
				this.bounds.alpha = 0.0;
			}, this);
		}
		if(this.tile_data[this.collide_wall.getTileX(this.x + this.ai_movement[this.ai_counter].x * 48)][this.collide_wall.getTileY(this.y)].occupied)
		{
			this.tile_data[this.collide_wall.getTileX(this.x)][this.collide_wall.getTileY(this.y)].occupied = true;
			this.tile_data[this.collide_wall.getTileX(this.x)][this.collide_wall.getTileY(this.y)].occupant = this;
			twn.to(
			{
				x: this.x,
				y: this.y
			}, 50, 'Linear', false, 0);
			this.state.mode = 50;
			prev.chain(twn);
			return twn;
		}
			
		this.tile_data[this.collide_wall.getTileX(this.x + this.ai_movement[this.ai_counter].x * 48)][this.collide_wall.getTileY(this.y)].occupied = true;
		this.tile_data[this.collide_wall.getTileX(this.x + this.ai_movement[this.ai_counter].x * 48)][this.collide_wall.getTileY(this.y)].occupant = this;
			
		twn.to(
		{
			x: this.x + this.ai_movement[this.ai_counter].x * 48,
			y: this.y
		}, 50, 'Linear', false, 0);
			
		this.ai_counter++;
		if(this.ai_counter > this.ai_max)
			this.ai_counter = 0;
		this.state.mode = 50;
		prev.chain(twn);
		return twn;
	}
	
	return 'err';
}// End move 

Enemy.prototype.erase =  function() 
{// removes enemy data 
	console.log('called');
	this.move = () => {};
	this.update_bounds = () => {};
	this.update_darkness = () => {};
	enemies.splice(this.id, 1);
	for(var i = this.id; i < enemies.length; i++)
		enemies[i].id -= 1;
	this.tile_data[this.tile_coord.x()][this.tile_coord.y()].occupied = false;
	this.tile_data[this.tile_coord.x()][this.tile_coord.y()].occupant = null;
	this.destroy();
}// End erase 

