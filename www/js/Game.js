var Game = function()
{
	var self = this;

	//this.main = main;
	
	this.canvas = document.getElementById('game');
	this.graphics = this.canvas.getContext('2d');
	
	this.canvas.width = Game.WIDTH;
	this.canvas.height = Game.HEIGHT;
	
	this.timeData = {
		global:Date.now(),
		globalDelta:0,
		local:0,
		localDelta:0
	};
	
	this.graphics.width = this.canvas.width;
	this.graphics.height = this.canvas.height;
	this.graphics.timeData = this.timeData;
	
	this.assetManager = new AssetManager();
	this.assetManager.addLoadingListener(function () {
	    self.onGameLoaded();
	});
	this.assetManager.startLoading(imageList, soundList);
	addEventListener('resize', function () {
	    self.onResize();
	});
	self.onResize();
	requestAnimationFrame(function loop() {
	    self.mainLoop();
	    requestAnimationFrame(loop);
	});
};

Game.WIDTH = 800;
Game.HEIGHT = 600;

Game.prototype.onGameLoaded = function ()
{
    var self = this;
    console.log("GAME LOADED");
    this.scene = new Scene(this);
	
	
};

Game.prototype.onResize = function()
{
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.graphics.width = document.body.clientWidth;
    this.graphics.height = document.body.clientHeight;
    this.scale = this.canvas.height / Game.HEIGHT;
}

Game.prototype.mainLoop = function()
{
	var now = Date.now();
	this.timeData.globalDelta = now - this.timeData.global;
	this.timeData.global = now;
	
	this.timeData.localDelta = Math.min(50,this.timeData.globalDelta);
	this.timeData.local += this.timeData.localDelta * 2;
	
	this.update(this.timeData);
	this.draw(this.graphics);
}

Game.prototype.update = function(timeData)
{
    if (this.scene)
    {
        this.scene.update(timeData);
    }
};

Game.prototype.draw = function(g)
{
	g.clearRect(0, 0, g.width, g.height);
	g.fillStyle = "red";
	g.fillRect(0, 0, g.width, g.height);
	

	g.save();
	    g.scale(this.scale, this.scale);
	    if (this.scene)
	    {
	        this.scene.draw(g);
        }
	    else
	    {
	        g.fillStyle = "black";
	        g.font = "30px Verdana";
	        g.fillText("LOADING", g.WIDTH / 2 - 60, Game.HEIGHT / 2);
	        g.fillText(this.assetManager.loadingProgression() + " %", Game.WIDTH / 2, Game.HEIGHT / 2 + 60);
	        g.fillRect(Game.WIDTH / 2 - 60, Game.HEIGHT / 2 + 120, this.assetManager.loadingProgression(), 20);
	    }
	g.restore();
};