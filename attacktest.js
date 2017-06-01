//After clicking attack in menu
//draw four light red squares around the characters to show the range
//if right click the mouse and somewhere else, go back to the menu
//if it occupied by enemies, enemies' health minus the attacker's damage, 
//if occupied by no one, nothing happen
//after attack, end character's turn, cannot do anything again.

function draw(ally){
	squareup = new Phaser.Rectangle(ally.x,ally.y-32,ally.x+32,ally.y);
	squarebot = new Phaser.Rectangle(ally.x,ally.y+32,ally.x+32,ally.y+32);
	squareleft = new Phaser.Rectangle(ally.x-32,ally.y,ally.x,ally.y+32);
	squareright = new Phaser.Rectangle(ally.x+32,ally.y,ally.x+32,ally.y+32);
	
	game.debug.geom(squareup,'#EE6F6F');
	game.debug.geom(squarebot,'#EE6F6F');
	game.debug.geom(squareleft,'#EE6F6F');
	game.debug.geom(squareright,'#EE6F6F');
	//really dumb way to draw four squares around characters, melee range.
	
	game.input.onDown.add(clickcheck, this); 
}

function clickcheck(){
	map_x = layer1.getTileX(game.input.activePointer.worldX);
	map_y = layer1.getTileY(game.input.activePointer.worldY);
	tile = tile_data[index_x][index_y];
	//ally.map[map_x-1][map_y]
	//ally.map[map_x+1][map_y]
	//ally.map[map_x][map_y-1]
	//ally.map[map_x][map_y+1]
	
	if(tile == ally.map[map_x-1][map_y] || tile ==	ally.map[map_x+1][map_y] ||ally.map[map_x][map_y-1] || ally.map[map_x][map_y+1]){
			if (tile.occupant instanceof enemy){ //if enemy, attack
				enemy.stats.health = enemy.stats.health - (ally.stats.atk + enemy.stats.def);
			}
	}
	console.log(enemy.stats.health);
}

