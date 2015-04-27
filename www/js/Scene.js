var Scene = function(game)
{
	var self = this;
	this.game = game;
	this.background = new Image();
	this.background = this.game.assetManager.getImage("forest");
	this.backgroundX = 2000;
	this.backgroundY = 1400;
	this.targetX = this.backgroundX;
	this.targetY = this.backgroundY;
	
	this.player = new Player(this);
	
	this.enemyList = [
		
	];
	
	this.listCharacter = [];
	
	this.nextEnemyPop = 0;
	
	this.player.addMoveListener(function(x,y)
	{
		self.onPlayerMove(x,y);
	});
	
	this.player.moveTo(2200,1900);
	this.listCharacter[0] = this.player;
}

Scene.prototype.onPlayerMove = function(x, y)
{	
	this.targetX = x - this.game.canvas.width /2;
	this.targetY = y - this.game.canvas.height * 0.7;
};


SCENE_CAMERA_SPEED = 0.008;

Scene.prototype.popEnemy = function()
{
	var id = this.enemyList.length;
	var id2 = this.listCharacter.length;
	this.enemyList[id] = new Enemy(this);
	this.listCharacter[id2] = this.enemyList[id];
	this.enemyList[id].baseScale = 0.5;
	this.enemyList[id].setPosition((Math.random()*(Enemy.MaxEnemyX-Enemy.MinEnemyX)) + Enemy.MinEnemyX, (Math.random()*(Enemy.MaxEnemyY-Enemy.MinEnemyY)) + Enemy.MinEnemyY);
	/*this.enemyList.sort(function(a,b){
		return a.y - b.y;
	});*/
	this.sortCharact();
}

Scene.prototype.update = function(timeData)
{
	if(timeData.local > this.nextEnemyPop)
	{
		this.popEnemy();
		this.nextEnemyPop = timeData.local + Math.random() * (Enemy.MaxPopDelay - Enemy.MinPopDelay) + Enemy.MinPopDelay;
	}
	
	
	if(this.backgroundX != this.targetX)
	{
		this.backgroundX += (this.targetX - this.backgroundX) * SCENE_CAMERA_SPEED * timeData.localDelta;
	}
	if(this.backgroundY != this.targetY)
	{
		this.backgroundY += (this.targetY - this.backgroundY) * SCENE_CAMERA_SPEED * timeData.localDelta;
	}

	this.player.update(timeData);
	
	for(var i=0; i<this.enemyList.length; i++)
	{
		this.enemyList[i].update(timeData);
	}
}

Scene.prototype.removeEnemy = function(Character)
{
    for (var i = 0; i < this.enemyList.length; i++) {
        if(this.enemyList[i] == Character)
        {
            this.enemyList.splice(i, 1);
            return;
        }
    }
    for (var i = 0; i < this.listCharacter.length; i++) {
        if (this.listCharacter[i] == Character) {
            this.listCharacter.splice(i, 1);
            return;
        }
    }
}

Scene.prototype.sortCharact = function()
{
	this.listCharacter.sort(function(a,b){
		return a.y - b.y;
	});
}


Scene.prototype.draw = function(g)
{	
	g.save();
	
		g.translate(-this.backgroundX, -this.backgroundY);
		
		g.drawImage(this.background, 0, 0);
		
		for(var i=0; i<this.listCharacter.length; i++)
		{
			this.listCharacter[i].draw(g);
			
		}
		
	g.restore();
}