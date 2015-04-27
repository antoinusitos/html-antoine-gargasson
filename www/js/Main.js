window.addEventListener("load", function(){
    var game = new Game();
});

function switchWindow(){
	var win = document.getElementById('main-win');
	win.className = (win.className == 'window enabled')?'window':'window enabled';
}

var sound = new Audio();
sound.src = "sound/Pokemon.mp3";
sound.play();
sound.volume = 0.5;
sound.loop = true;
sound.muted = true;

function switchMenu(name,tab){
	document.getElementById('InfoButton').className="";
	document.getElementById('EquipButton').className="";
	document.getElementById('StatsButton').className="";
	
	document.getElementById(name).className="selected";
	
	document.getElementById('infos').className="content-invisible";
	document.getElementById('equipement').className="content-invisible";
	document.getElementById('stats').className="content-invisible";

	document.getElementById(tab).className="content-visible";
}
function switchMusic() {
    sound.muted = !sound.muted;
}

function getOffset(elm)
{
	var offset = {
		left:0,
		top:0
	};
	do{
		offset.left += elm.offsetLeft;
		offset.top += elm.offsetTop;
	}while(elm = elm.offsetParent);
	
	return offset;
}