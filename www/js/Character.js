var Character = function(scene, spriteData)
{
	var self = this;

	if(typeof(spriteData) == "undefined")
	{
		return;
	}
	
	this.scene = scene;
	this.game = this.scene.game;
	
	this.x = 0;
	this.y = 0;
	
	this.baseScale = 1;
	
	this.spriteList = {};
	for(var i in spriteData){
		this.loadSprite(i, spriteData[i]);
	}
	player = this;
	
	this.moveListener = [];
};

Character.SPEED = 200/1000;
Character.MAXY = 1996;
Character.MAXSCALE = 2;
Character.MINY = 1571;
Character.MINSCALE = 1;

Character.prototype.setSprite = function(id, endListener)
{
	var self = this;
	if(this.currentSprite && !this.currentSprite.loop && this.spriteList[id] && this.spriteList[id].loop)
	{
		this.nextSpriteId = id;
	}
	else
	{
		this.currentSpriteId = id;
		this.currentSprite = this.spriteList[id];
		if(this.currentSprite && !this.currentSprite.loop){
		    this.currentSprite.play(function () {
		        if (this.nextSpriteId)
                {
		            self.playNextSprite(); // handler joué à la fin
                }
				if(endListener)
				{
					endListener();
				}
			}, this.game);
		}
	}
}

Character.prototype.playNextSprite = function()
{
	this.currentSprite = false;
	this.setSprite(this.nextSpriteId);
}

Character.prototype.loadSprite = function(id, data)
{
	var self = this;
	/*var image = new Image();
	image.src = data.img;
	image.addEventListener("load", function(){
		self.spriteList[id] = new Sprite(image, data.colCount, data.rowCount, data.loop);
		
		if(id == "idle")
		{
			self.setSprite("idle");
		}
	});*/
	var image = this.game.assetManager.getImage(data.img);
	if (!image)
	{
	    console.log("unknown image " + data.img);
	}
	else
	{

	    this.spriteList[id] = new Sprite(image, data.colCount, data.rowCount, data.loop);

	    if (id == "idle") {
	        self.setSprite("idle");
	    }
    }
}

Character.prototype.addMoveListener = function(listener)
{
	this.moveListener.push(listener);
};

Character.prototype.setPosition = function(X,Y)
{
	this.revertDirection = (X < this.x);
	this.x = X;
	this.y = Y;
	
	for(var i=0; i< this.moveListener.length; i++)
	{
		this.moveListener[i](this.x,this.y);
	}
	
	var temp = (this.y - Character.MINY) / (Character.MAXY - Character.MINY);
	this.scale = temp * (Character.MAXSCALE - Character.MINSCALE ) + Character.MINSCALE;
	
	this.scene.sortCharact();
};

Character.prototype.moveTo = function(X,Y)
{
	this.startX = this.x;
	this.startY = this.y;
	this.targetX = X;
	this.targetY = Y;
	this.moveTime = this.game.timeData.local;
	
	var dis = Math.sqrt(Math.pow(this.targetX - this.startX, 2)+Math.pow(this.targetY - this.startY, 2)) //algorithm de la distance
	this.moveDuration = dis / (Character.SPEED * this.scale);
	this.isMoving = true;
	this.setSprite("move");
};

Character.prototype.update = function(timeData)
{
	if(this.moveTime && timeData.local < this.moveTime + this.moveDuration){
		var f = (timeData.local - this.moveTime)/this.moveDuration;
		
		/* easeIn>1 , 0>easeOut>1 */
		//f = Math.pow(f,0.6);
		
		this.setPosition(
			f * (this.targetX - this.startX) + this.startX,
			f * (this.targetY - this.startY) + this.startY);
			
	}
	else if (this.isMoving)
	{
		this.isMoving = false;
		this.setPosition(this.targetX, this.targetY);
		this.setSprite("idle");
	}
}

Character.prototype.draw = function(g)
{
	g.save();
	
		g.translate(this.x, this.y);
	
		if(this.currentSprite)
		{
			g.scale(this.scale * this.baseScale, this.scale * this.baseScale);
			g.translate(
				0,
				-Math.round(this.currentSprite.frameHeight * 0.8)
			);
			
			if(this.revertDirection)
			{
				g.translate(Math.round(this.currentSprite.frameWidth/2), 0);
				g.scale(-1,1);
			}
			else{
				g.translate(-Math.round(this.currentSprite.frameWidth/2), 0);
			}
			
			this.currentSprite.draw(g);
		}
	g.restore();
};