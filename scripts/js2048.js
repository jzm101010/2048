var tileColor = {'2': '#8268C1', '4': '#56268C', '8': '#B824F9', '16': '#9C2727', '32': '#BF1313', '64': '#FF0000', '128': '#5448BF', '256': '#5B2BAF', '512': '#6C1FAD',
			'1024': '#DC3EEA', '2048': '#EA00FF', '4096': '#EA00FF', '8192': '#EA00FF', '16384': '#EA00FF', '32768': '#EA00FF', '65536': '#EA00FF'};
var numSize = {'2': '7.5rem', '4': '7.5rem', '8': '7.5rem', '16': '7.2rem', '32': '7.2rem', '64': '7.2rem', '128': '6.8rem', '256': '6.8rem', '512': '6.8rem',
			'1024': '5rem', '2048': '5rem', '4096': '5rem', '8192': '5rem', '16384': '4rem', '32768': '4rem', '65536': '4rem'}
var tiles = new Array();
var merged = new Array();
var startX = '';
var startY = '';
var score = 0;

$(document).ready(function() {
	$('.g-bd').hide(10);
	$('.g-ft').hide(10);
	$('.m-logo').fadeIn(600);
	$('.m-start').fadeIn(600).click(function() {
		$('.m-logo').hide(600);
		$('.m-start').hide(600);
		$('.g-bd').show(800);
		$('.g-ft').show(800);
		newgame();
		$('.m-game').fadeIn(600);
	});
	$('.m-restart').click(function() {
		newgame();
	})
});

function newgame() {
	init();
	creatNum();
	creatNum();
	keyEvent();
}

function init() {
	score = 0;

	for(var i=0; i<4; i++){
		tiles[i] = new Array();
		merged[i] = new Array();
		for(var j=0; j<4; j++){
			tiles[i][j] = 0;
			merged[i][j] = false;
		}
	}

	update();
	updateScore();
}

function update() {
	$('.m-game>div').remove();
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			$('.m-game').append('<div class="tile' + i + '-' + j + '"></div>');
			var $thisTile = $('.tile' + i + '-' + j);
			if(tiles[i][j] != 0){
				$thisTile.css({'background-color':tileColor[String(tiles[i][j])],
								'font-size': numSize[String(tiles[i][j])],
								'width':'180px', 'height':'180px'});
				$thisTile.text(tiles[i][j]);
				if(merged[i][j]){
					$thisTile.addClass('rubberBand');
				}
			}else{
				$thisTile.css({'background-color':tileColor[String(tiles[i][j])],
								'width':'0px', 'height':'0px'});
			}
			merged[i][j] = false;
		}
	}
}

function creatNum() {
	if(noempty()){
		return false;
	}
	var randX = parseInt(Math.floor(Math.random() * 4));
	var randY = parseInt(Math.floor(Math.random() * 4));
	var colArray = [];
	var rowArray = [];
	var randNum = Math.random() < 0.5 ? 2 : 4;

	if(tiles[randX][randY] != 0){
		for(var i=0; i<4; i++){
			for(var j=0; j<4; j++){
				if(tiles[i][j] == 0){
					rowArray.push(i);
					colArray.push(j);
				}
			}
		}
	}
	while(tiles[randX][randY] != 0){ 
		randX = rowArray[parseInt(Math.floor(Math.random() * rowArray.length))];
		randY = colArray[parseInt(Math.floor(Math.random() * colArray.length))];
	}

	tiles[randX][randY] = randNum;
	var $thisTile = $('.tile' + randX + '-' + randY);
	$thisTile.css({'background-color':tileColor[String(randNum)], 'font-size':numSize[String(randNum)]}).
	text(randNum).
	animate({width: '180px', height:'180px'}, 100);
}

function keyEvent() {
	$(document).keydown(function (e) {
		event.preventDefault();
		if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40){
			return;
		}

		var currDiv = $('.m-game>div').toArray();
		var dir = '';

		for(var i=0; i<currDiv.length; i++){
			if($(currDiv[i]).is(':animated')){
				return;
			}
		}

		switch(e.keyCode){
			case 38:
				dir = 'up';
				break;
			case 40:
				dir = 'down';
				break;
			case 37:
				dir = 'left';
				break;
			case 39:
				dir = 'right';
				break;
		}

		if(move(dir)){
			setTimeout('update()', 200);
			setTimeout('creatNum()', 210);
			setTimeout('judge()', 500);
		}

	})
}


document.addEventListener('touchstart', function (e) {
	startX = e.touches[0].pageX;
	startY = e.touches[0].pageY;
});

document.addEventListener('touchend', function (e) {
	var currDiv = $('.m-game>div').toArray();
	var endX = '';
	var endY = '';
	var deltaX = '';
	var deltaY = '';
	for(var i=0; i<currDiv.length; i++){
		if($(currDiv[i]).is(':animated')){
			return;
		}
	}

	endX = e.changedTouches[0].pageX;
	endY = e.changedTouches[0].pageY;
	deltaX = endX - startX;
	deltaY = endY - startY;

	if(Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5){
		return;
	}
	
	if(Math.abs(deltaX) > Math.abs(deltaY)){
		if(deltaX > 0){
			dir = 'right';
		}else{
			dir = 'left';
		}
	}else{
		if(deltaY > 0){
			dir = 'down';
		}else{
			dir = 'up';
		}
	}

	if(move(dir)){
		setTimeout('update()', 200);
		setTimeout('creatNum()', 210);
		setTimeout('judge()', 500);
	}
})



function canMove (dir) {
	switch(dir){
		case 'up':
			for(var j=0; j<4; j++){
				for(var i=1; i<4; i++){
					if(tiles[i][j] != 0){
						if(tiles[i-1][j] == 0 || tiles[i-1][j] == tiles[i][j]){
							return true;
						}
					}
				}
			}
			return false;
			break;
		case 'down':
			for(var j=0; j<4; j++){
				for(var i=2; i>=0; i--){
					if(tiles[i][j] != 0){
						if(tiles[i+1][j] == 0 || tiles[i+1][j] == tiles[i][j]){
							return true;
						}
					}
				}
			}
			return false;
			break;
		case 'left':
			for(var i=0; i<4; i++){
				for(var j=1; j<4; j++){
					if(tiles[i][j] != 0){
						if(tiles[i][j-1] == 0 || tiles[i][j-1] == tiles[i][j]){
							return true;
						}
					}
				}
			}
			return false;
			break;
		case 'right':
			for(var i=0; i<4; i++){
				for(var j=2; j>=0; j--){
					if(tiles[i][j] != 0){
						if(tiles[i][j+1] == 0 || tiles[i][j+1] == tiles[i][j]){
							return true;
						}
					}
				}
			}
			return false;
			break;
	}
}

function noempty() {
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			if(tiles[i][j] == 0){
				return false;
			}
		}
	}
	return true;
}

function notileX (row, from, to) {
	for(var j=from+1; j<to; j++){
		if(tiles[row][j] != 0){
			return false;
		}
	}
	return true;
}

function notileY (col, from, to) {
	for(var i=from+1; i<to; i++){
		if(tiles[i][col] != 0){
			return false;
		}
	}
	return true;
}

function nomove() {
	if(canMove('up') || canMove('down') || canMove('left') || canMove('right')){
		return false;
	}
	return true;
}

function moveAnimation (fromx, fromy, tox, toy){
	var $thisTile = $('.tile' + fromx + '-' + fromy);
	$thisTile.animate({
		top: String(16 + 196*tox) + 'px',
		left: String(16 + 196*toy) + 'px'
	}, 200).removeClass();
}

function move (dir) {
	if(!canMove(dir)){
		return false;
	}

	switch(dir){
		case 'up':
			for(var j=0; j<4; j++){
				for(var i=1; i<4; i++){
					if(tiles[i][j] != 0){
						for(var k=0; k<i; k++){
							var notile = notileY(j, k, i);
							if(tiles[k][j] == 0 && notile){
								moveAnimation(i, j, k, j);
								tiles[k][j] = tiles[i][j];
								tiles[i][j] = 0;
								continue;
							}else if(tiles[k][j] == tiles[i][j] && notile && !merged[k][j]){
								moveAnimation(i, j, k, j);
								tiles[k][j] *= 2;
								tiles[i][j] = 0;
								score += tiles[k][j];
								updateScore();
								merged[k][j] = true;
								continue;							
							}
						}
					}
				}
			}
			break;
		case 'down':
			for(var j=0; j<4; j++){
				for(var i=2; i>=0; i--){
					if(tiles[i][j] != 0){
						for(var k=3; k>i; k--){
							var notile = notileY(j, i, k);
							if(tiles[k][j] == 0 && notile){
								moveAnimation(i, j, k, j);
								tiles[k][j] = tiles[i][j];
								tiles[i][j] = 0;
								continue;
							}else if(tiles[k][j] == tiles[i][j] && notile && !merged[k][j]){
								moveAnimation(i, j, k, j);
								tiles[k][j] *= 2;
								tiles[i][j] = 0;
								score += tiles[k][j];
								updateScore();
								merged[k][j] = true;
								continue;							
							}
						}
					}
				}
			}
			break;
		case 'left':
			for(var i=0; i<4; i++){
				for(var j=1; j<4; j++){
					if(tiles[i][j] != 0){
						for(var k=0; k<j; k++){
							var notile = notileX(i, k, j);
							if(tiles[i][k] == 0 && notile){
								moveAnimation(i, j, i, k);
								tiles[i][k] = tiles[i][j];
								tiles[i][j] = 0;
								continue;
							}else if(tiles[i][k] == tiles[i][j] && notile && !merged[i][k]){
								moveAnimation(i, j, i, k);
								tiles[i][k] *= 2;
								tiles[i][j] = 0;
								score += tiles[i][k];
								updateScore();
								merged[i][k] = true;
								continue;							
							}
						}
					}
				}
			}
			break;
		case 'right':
			for(var i=0; i<4; i++){
				for(var j=2; j>=0; j--){
					if(tiles[i][j] != 0){
						for(var k=3; k>j; k--){
							var notile = notileX(i, j, k);
							if(tiles[i][k] == 0 && notile){
								moveAnimation(i, j, i, k);
								tiles[i][k] = tiles[i][j];
								tiles[i][j] = 0;
								continue;
							}else if(tiles[i][k] == tiles[i][j] && notile && !merged[i][k]){
								moveAnimation(i, j, i, k);
								tiles[i][k] *= 2;
								tiles[i][j] = 0;
								score += tiles[i][k];
								updateScore();
								merged[i][k] = true;
								continue;							
							}
						}
					}
				}
			}
			break;
	}
	
	return true;
}

function judge() {
	if(noempty() && nomove()){
		alert('gameover!');
		newgame();
	}
}

function updateScore () {
	$('.m-score>span').text(score);
}
