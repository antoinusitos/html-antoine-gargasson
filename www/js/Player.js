var Player = function(scene)
{
	var self = this;
	Character.call(this, scene, {
		idle: {
			img : "sprite.idle-1-2-1",
			rowCount : 2,
			colCount : 16,
			loop : true
		},
		move: {
			img : "sprite.move-1-2-1",
			rowCount : 1,
			colCount : 7,
			loop : true
		},
		attack: {
			img : "sprite.attack-1-2-1",
			rowCount : 1,
			colCount : 16,
			loop : false
		}
	});
	this.game = this.scene.game;
	
	this.game.canvas.addEventListener('mousedown', function(e){
	    self.onMouseClick(e.clientX, e.clientY);
	});
	this.lastTapTime = 0;
	this.game.canvas.addEventListener('touchstart', function(e){
	    self.onMouseDown(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	});
	this.game.canvas.addEventListener('touchmove', function (e) {
	    e.preventDefault();
	    self.onTouchMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	});
};

Player.TAPMAXDELAY = 300;
Player.prototype = new Character();

Player.prototype.doubleTap = function()
{
	this.setSprite("attack");
	var sound = new Audio();
	sound.src = "sound/WindowsBatteriedechargee.wav";
	sound.play();
	for(var i=0; i< this.scene.enemyList.length; i++)
	{
		var dist = Math.sqrt(Math.pow(this.scene.enemyList[i].x-this.x, 2) + Math.pow(this.scene.enemyList[i].y-this.y, 2));
		if(dist < 100)
		{
			this.scene.enemyList[i].hit();
			
		}
	}
}

Player.prototype.onMouseClick = function(x,y)
{
    
    if (this.game.timeData.global - this.lastTapTime < Player.TAPMAXDELAY) {
        this.doubleTap();
    }
    else
    {
        var offset = getOffset(this.game.canvas);
        this.scale = this.game.scale;
        this.moveTo(
            ((x - offset.left) / this.scale + this.scene.backgroundX),
            ((y - offset.top) / this.scale + this.scene.backgroundY)
        );
    }
    this.lastTapTime = this.game.timeData.global;
}

Player.prototype.onTouchMove = function (x, y) {
    var offset = getOffset(this.game.canvas);
    this.scale = this.game.scale;
    this.moveTo(
        ((x - offset.left) / this.scale + this.scene.backgroundX),
        ((y - offset.top) / this.scale + this.scene.backgroundY)
    );
}

Player.prototype.onMouseDown = function(e)
{
    if (this.game.timeData.global - this.lastTapTime < Player.TAPMAXDELAY) {
        this.doubleTap(e);
    }
    this.lastTapTime = this.game.timeData.global;
}