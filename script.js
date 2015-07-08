var r = 6;
var c = 6;
var Grid = new Array();
var State = new Array();
var Dp;
var Block = new Array();
var isi = r*c;
var difficulty = location.search.split('dengklek=')[1]
var player = "AI"

if (difficulty === 'easy') {
	player = "Budi"

}
else if (difficulty === 'hard') {
	r = 8;
	c = 8;
	isi = r*c;
	player = "Budi Imboz"
}

for(var i=0;i<r;i++)
{
	Grid.push(new Array());
	State.push(new Array());
	Block.push(new Array());
	for(var j=0;j<c;j++)
	{
			Grid[i].push("<div class = \"little\" id = \"s"+(i*c+j)+"\"> </div>");
			State[i].push(0);
			Block[i].push(0);
	}
}

function getID(i,j)
{
	return "#s"+(i*c+j).toString();
}

var cowMessages = [
	"Mooooooo",
	"Moooooo000000",
	"Moooo",
	"Mo0o0o0o0o0",
	"MMooo",
	"MMMoo",
	"Mooooooo.."
]

var turn = 0;
var size = 1;
var lastx = -1;
var lasty = -1;

var op = new Array(2);
op[0] = "op1";
op[1] = "op2";

function go(p, fl, fr) {
	if (fl > fr) return 0;
  if (Dp[p][fl][fr] !== -1) return Dp[p][fl][fr];
  var ada = [];
  for(var a=fl;a<=fr-1;a++)
  {
      if (p < r-1 && State[p][a] === 0 && State[p][a+1] === 0 && State[p+1][a] === 0 && State[p+1][a+1] === 0)
      {
          ada[go(p,fl,a-1)^go(p,a+2,fr)] = 1;
      }
  }
  for(var a=fl;a<=fr;a++)
  {
      for(var b=p;b<=Math.min(p+1,r-1);b++)
      {
          if (State[b][a] === 0)
          {
              var val = 0;
              if (p < r-1 && State[b^1][a] === 0) val ^= 1;
              val ^= go(p,fl,a-1)^go(p,a+1,fr);
              ada[val] = 1;
          }
      }
  }
  Dp[p][fl][fr] = 0;
  while(ada[Dp[p][fl][fr]]) Dp[p][fl][fr]++;
  return Dp[p][fl][fr];
}

function calculateNim() {
	Dp = []
	for(var i=0;i<r;i++) {
		Dp.push([]);
	}
	for(var k=0;k<r;k++) {
		for(var i=0;i<c;i++) {
			Dp[k][i] = []
			for(var j=0;j<c;j++) {
				Dp[k][i].push(-1);
			}
		}
	}
	var nim = 0;
  for(var a=0;a<=r-1;a+=2)
  {
      nim ^= go(a,0,c-1);
  }
  return nim;
}

function getRandomMove()
{
	var items = new Array();
	var Move = new Object();
	Move.x = 0;
	Move.y = 0;
	Move.s = 0;
	for(var s=0;s<r;s++)
	{
		for(var t=0;t<c;t++)
		{
			if (State[s][t] === 0)
			{
				var Move = new Object();
					Move.x = s;
					Move.y = t;
					Move.s = 1;
					Move.type = 'random';
					items.push(Move);
			}
			if (s < r-1 && t < c-1)
			{
				if (s%2 === 0 && State[s][t] === 0 && State[s+1][t] === 0 && State[s][t+1] === 0 && State[s+1][t+1] === 0)
				{
					var Move = new Object();
					Move.x = s;
					Move.y = t;
					Move.s = 2;
					Move.type = 'random';
					items.push(Move);
				}
			}
		}
	}
	return items[Math.floor(Math.random()*items.length)];
}

function getBestMove()
{
	candidate = []
	for(var s=0;s<r;s++)
	{
		for(var t=0;t<c;t++)
		{
			if (State[s][t] === 0)
			{
				State[s][t] = 1;
				if (calculateNim() == 0) {
					Move = new Object();
					Move.x = s;
					Move.y = t;
					Move.s = 1;
					Move.type = 'best';
					candidate.push(Move);
				}

				State[s][t] = 0;
			}
		}
	}

	for(var s=0;s<r-1;s+=2)
	{
		for(var t=0;t<c-1;t++)
		{
			if (State[s][t] === 0 && State[s][t+1] === 0 && State[s+1][t] === 0 && State[s+1][t+1] === 0)
			{
				State[s][t] = 1;
				State[s][t+1] = 1;
				State[s+1][t] = 1;
				State[s+1][t+1] = 1;

				if (calculateNim() == 0) {
					Move = new Object();
					Move.x = s;
					Move.y = t;
					Move.s = 2;
					Move.type = 'best';
					candidate.push(Move);
				}

				State[s][t] = 0;
				State[s][t+1] = 0;
				State[s+1][t] = 0;
				State[s+1][t+1] = 0;
			}
		}
	}
	if (candidate.length > 0) {
		return candidate[Math.floor(Math.random() * candidate.length)];
	}
	else {
		return getRandomMove();
	}
}

function getHardBoard() {
	var numBlocked = Math.floor(Math.random() * 6) + 6;
	while(numBlocked > 0) {
		var s = Math.floor(Math.random() * r);
		var t = Math.floor(Math.random() * c);
		while(State[s][t] == 1) {
			s = Math.floor(Math.random() * r);
			t = Math.floor(Math.random() * c);
		}
		State[s][t] = 1;
		numBlocked--;
	}
	var Move = getBestMove();
	if (Move.type === 'best') {
		for(var i=0;i<r;i++) {
			for(var j=0;j<c;j++) {
				State[i][j] = 0;
			}	
		}
		getHardBoard();
	}
}

var vsMode = true;

var Movement = false;

var p1win = 0;
var p2win = 0;


$(document).ready(function(){
	for(var i = 0;i < r;i++)
	{
		for(var j=0;j<c;j++)
		{
			$("#container").append(Grid[i][j]);
		}
		$("#container").append("<br/>");
		if (i%2==1 && i < r-1) $("#container").append("<div class='separator'></div>");
		
	}
	if (difficulty === 'hard') {
		getHardBoard();
		for(var s=0;s<r;s++) {
			for(var t=0;t<c;t++) {
				if (State[s][t] === 1) {
					isi--;
					$(getID(s,t)).addClass("obstacle");
				}
			}
		}
	}
	$("#tog").click(function () {
		if (size === 2)
		{
			if (lastx===-1&&lasty===-1);
			else if (lastx%2==0 && lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
			{
				$(getID(lastx+1,lasty)).removeClass(op[turn]);
				$(getID(lastx,lasty+1)).removeClass(op[turn]);
				$(getID(lastx+1,lasty+1)).removeClass(op[turn]);
			}
			else if (State[lastx][lasty] === 0)
			{
				$(getID(lastx,lasty)).addClass(op[turn]);
			}
			size = 1;
			$("#toggle").html("1!");
		}	
		else
		{
			if (lastx===-1&&lasty===-1);
			else if (lastx%2==0 && lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
			{
				$(getID(lastx+1,lasty)).addClass(op[turn]);
				$(getID(lastx,lasty+1)).addClass(op[turn]);
				$(getID(lastx+1,lasty+1)).addClass(op[turn]);
			}
			else if (State[lastx][lasty] === 0)
			{
				$(getID(lastx,lasty)).removeClass(op[turn]);
			}
			size = 2;
			$("#toggle").html("2!");
		}
	});
	$("#instruction").click(function () {
		$("#instruction").fadeOut("verySlow");
			
	});
	$("#newgame").click(function () {
		isi = r*c;
		turn = 0;
		lastx = -1;
		lasty = -1;
		Movement = false;
		for(var s = 0;s<r;s++)
		{
			for(var t=0;t<c;t++)
			{
				State[s][t] = 0;
				Block[s][t] = 0;
				$(getID(s,t)).removeClass("turn1");
				$(getID(s,t)).removeClass("turn2");
				$(getID(s,t)).removeClass(op[0]);
				$(getID(s,t)).removeClass(op[1]);
				$(getID(s,t)).removeClass("obstacle");
			}
		}
		if (difficulty === 'hard') {
			getHardBoard();
			for(var s=0;s<r;s++) {
				for(var t=0;t<c;t++) {
					if (State[s][t] === 1) {
						isi--;
						$(getID(s,t)).addClass("obstacle");
					}
				}
			}
		}
		$("#title").html("Little Square!");
			
	});
	$("#addobstacle").click(function () {
		for(var s = 0;s<r;s++)
		{
			for(var t=0;t<c;t++)
			{
				if (Math.random()<0.2 && isi > 1 && State[s][t] === 0)
				{
					State[s][t] = 1;
					isi--;
					$(getID(s,t)).addClass("obstacle");
				}
			}
		}
		if (isi === 1)
		{
			$("#newgame").show();
			$("#modepick").show();
			$("#addobstacle").hide();	
		}
		
		
	});
	$(document).keypress(function(event){
		if (event.which===49)
		{
			if (size === 2)
			{
				if (lastx===-1&&lasty===-1)
				{
				}
				else if (lastx%2==0 && lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
				{
					$(getID(lastx+1,lasty)).removeClass(op[turn]);
					$(getID(lastx,lasty+1)).removeClass(op[turn]);
					$(getID(lastx+1,lasty+1)).removeClass(op[turn]);
				}
				else if (State[lastx][lasty] === 0)
				{
					$(getID(lastx,lasty)).addClass(op[turn]);
				}
				else
				{
				}
				size = 1;
				$("#toggle").html("1!");
			}

		}
		if (event.which===50)
		{
			if (size === 1)
			{
				
				if (lastx===-1&&lasty===-1);
				else if (lastx%2== 0 && lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
				{
					$(getID(lastx+1,lasty)).addClass(op[turn]);
					$(getID(lastx,lasty+1)).addClass(op[turn]);
					$(getID(lastx+1,lasty+1)).addClass(op[turn]);
				}
				else if (State[lastx][lasty] === 0)
				{
					$(getID(lastx,lasty)).removeClass(op[turn]);
				}
				size = 2;
				$("#toggle").html("2!");
			}
		}
	});
	for(var s = 0;s<r;s++)
	{
		for(var t=0;t<c;t++)
		{
			$(getID(s,t)).on("click",{x:s,y:t},function(e){
				var x = e.data.x;
				var y = e.data.y;
				if (size === 1)
				{
					if (State[x][y] === 0)
					{
						Movement = true;
						$("#newgame").show();
						$("#addobstacle").hide();
						State[x][y] = 1;
						if (turn)
						{
							$(getID(x,y)).removeClass(op[turn]);
							$(getID(x,y)).addClass("turn1");
						}
						else
						{
							$(getID(x,y)).removeClass(op[turn]);
							$(getID(x,y)).addClass("turn2");
						}
						isi--;
						if (isi === 0)
						{
							if (turn === 0)
							{
								if (!vsMode)
								{
									$("#title").html("Red is the winner!");
									p1win++;
								}
								else
								{
									var extra = '';
									if (difficulty === 'easy') {
										extra = "| key : \"ANSWERCODEFORSMALLTESTCASE\""
									}
									else if (difficulty === 'hard') {
										extra = "| key : \"ANSWERCODEFORLARGELARGELARGETESTCASE\""
									}
									$("#title").html("You are the winner!"+extra);
									p1win++;
								}
							}
							else
							{
								$("#title").html("Blue is the winner!");
								p2win++;
							}
						}
						turn = 1-turn;
						
						if (vsMode)
						{
							var Move = getBestMove()
							/*
							if (difficulty === 'hard')
								$("#title").html("<small>Cow : "+cowMessages[Math.floor(Math.random()*cowMessages.length)]+"</small>");
							else if (difficulty === 'easy') {
								if (Move.type === 'random') {
									$("#title").html("<small>Budi : "+notSureMessages[Math.floor(Math.random()*notSureMessages.length)]+'</small>');
								}
								else {
									$("#title").html("<small>Budi : "+wonMessages[Math.floor(Math.random()*wonMessages.length)]+'</small>');
								}
							}*/
							var x = Move.x;
							var y = Move.y;
							if (Move.s === 2)
							{
								isi -= 4;
								State[x][y] = 1;
								State[x+1][y] = 1;
								State[x][y+1] = 1;
								State[x+1][y+1] = 1;
								$(getID(x,y)).removeClass(op[turn]);
								$(getID(x+1,y)).removeClass(op[turn]);
								$(getID(x,y+1)).removeClass(op[turn]);
								$(getID(x+1,y+1)).removeClass(op[turn]);
								$(getID(x,y)).addClass("turn1");
								$(getID(x+1,y)).addClass("turn1");
								$(getID(x,y+1)).addClass("turn1");
								$(getID(x+1,y+1)).addClass("turn1");
							}
							else
							{
								isi -=1;
								State[x][y] = 1;
								$(getID(x,y)).removeClass(op[turn]);
								$(getID(x,y)).addClass("turn1");
							}
							if (isi === 0)
							{
								p2win++;
								$("#title").html(player+" is the winner!");
							}
							turn = 1-turn;
						}
						
						
					}
				}
				else if (s != r-1 && t != c-1)
				{
					if (x%2==0 && State[x][y] === 0 && State[x+1][y] === 0 && State[x][y+1] === 0 && State[x+1][y+1] === 0)
					{
						Movement = true;

						$("#newgame").show();
						$("#addobstacle").hide();
						State[x][y] = 1;
						State[x+1][y] = 1;
						State[x][y+1] = 1;
						State[x+1][y+1] = 1;
						if (turn)
						{
							$(getID(x,y)).removeClass(op[turn]);
							$(getID(x+1,y)).removeClass(op[turn]);
							$(getID(x,y+1)).removeClass(op[turn]);
							$(getID(x+1,y+1)).removeClass(op[turn]);
							$(getID(x,y)).addClass("turn1");
							$(getID(x+1,y)).addClass("turn1");
							$(getID(x,y+1)).addClass("turn1");
							$(getID(x+1,y+1)).addClass("turn1");
						}
						else
						{
							$(getID(x,y)).removeClass(op[turn]);
							$(getID(x+1,y)).removeClass(op[turn]);
							$(getID(x,y+1)).removeClass(op[turn]);
							$(getID(x+1,y+1)).removeClass(op[turn]);
							$(getID(x,y)).addClass("turn2");
							$(getID(x+1,y)).addClass("turn2");
							$(getID(x,y+1)).addClass("turn2");
							$(getID(x+1,y+1)).addClass("turn2");
						}
						isi-=4;
						if (isi === 0)
						{
							if (turn === 0)
							{
								if (!vsMode)
								{
									$("#title").html("Red is the winner!");
									p1win++;
								}
								else
								{
									var extra = '';
									if (difficulty === 'easy') {
										extra = "| key : \"ANSWERCODEFORSMALLTESTCASE\""
									}
									else if (difficulty === 'hard') {
										extra = "| key : \"ANSWERCODEFORLARGELARGELARGETESTCASE\""
									}
									$("#title").html("You are the winner!"+extra);
									p1win++;
								}
							}
							else
							{
								$("#title").html("Blue is the winner!");
								p2win++;
							}
						}
						turn = 1-turn;
						
						if (vsMode)
						{
							
							var Move = getBestMove();
							/*
							if (difficulty === 'hard')
								$("#title").html("Cow : "+cowMessages[Math.floor(Math.random()*cowMessages.length)]);
							else if (difficulty === 'easy') {
								if (Move.type === 'random') {
									$("#title").html("Budi : "+notSureMessages[Math.floor(Math.random()*notSureMessages.length)]);
								}
								else {
									$("#title").html("Budi : "+wonMessages[Math.floor(Math.random()*wonMessages.length)]);
								}
							}
							*/
							var x = Move.x;
							var y = Move.y;
							if (Move.s === 2)
							{
								isi -= 4;

								State[x][y] = 1;
								State[x+1][y] = 1;
								State[x][y+1] = 1;
								State[x+1][y+1] = 1;
								$(getID(x,y)).removeClass(op[turn]);
								$(getID(x+1,y)).removeClass(op[turn]);
								$(getID(x,y+1)).removeClass(op[turn]);
								$(getID(x+1,y+1)).removeClass(op[turn]);
								$(getID(x,y)).addClass("turn1");
								$(getID(x+1,y)).addClass("turn1");
								$(getID(x,y+1)).addClass("turn1");
								$(getID(x+1,y+1)).addClass("turn1");
							}
							else
							{
								isi -=1;
								State[x][y] = 1;
								$(getID(x,y)).removeClass(op[turn]);
								$(getID(x,y)).addClass("turn1");
							}
							if (isi === 0)
							{
								p2win++;
								$("#title").html(player+" is the winner!");
							}
							turn = 1-turn;
						}
						
					}
				}
			});
			$(getID(s,t)).on("mouseover",{x:s,y:t},function(e){
				var x = e.data.x;
				var y = e.data.y;
				lastx = x;
				lasty = y;
				if (size === 1)
				{
					if (State[x][y] === 0)
					{
						$(getID(x,y)).addClass(op[turn]);
					}
				}
				else if (x%2==0 && x < r-1 && y < c-1)
				{
					if (State[x][y] === 0 && State[x+1][y] === 0 && State[x][y+1] === 0 && State[x+1][y+1] === 0)
					{
						$(getID(x,y)).addClass(op[turn]);
						$(getID(x+1,y)).addClass(op[turn]);
						$(getID(x,y+1)).addClass(op[turn]);
						$(getID(x+1,y+1)).addClass(op[turn]);
					}
				}
			});
			$(getID(s,t)).on("mouseleave",{x:s,y:t},function(e){
				var x = e.data.x;
				var y = e.data.y;
				if (size === 1)
				{
					if (State[x][y] === 0)
					{
						$(getID(x,y)).removeClass(op[turn]);
					}
				}
				else if (s != r-1 && t != c-1)
				{
					if (State[x][y] === 0)
					{
						$(getID(x,y)).removeClass(op[turn]);
						$(getID(x+1,y)).removeClass(op[turn]);
						$(getID(x,y+1)).removeClass(op[turn]);
						$(getID(x+1,y+1)).removeClass(op[turn]);
					}
				}
				lastx = -1;
				lasty = -1;
			});
		}
	}

});
