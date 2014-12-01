var r = 6;
var c = 6;
var Grid = new Array();
var State = new Array();
var Num = new Array();
var Block = new Array();
var isi = r*c;
for(var i=0;i<r;i++)
{
	Grid.push(new Array());
	State.push(new Array());
	Num.push(new Array());
	Block.push(new Array());
	for(var j=0;j<c;j++)
	{
			Grid[i].push("<div class = \"little\" id = \"s"+(i*c+j)+"\"> </div>");
			State[i].push(0);
			Num[i].push(-1);
			Block[i].push(0);
	//		console.log(Grid[i][j]);
	}
}

function getID(i,j)
{
	return "#s"+(i*c+j).toString();
}

var turn = 0;
var size = 1;
var lastx = -1;
var lasty = -1;

var op = new Array(2);
op[0] = "op1";
op[1] = "op2";


function getRandomMove()
{
	console.log("inside "+isi);
	var items = new Array();
	var Move = new Object();
	Move.x = 0;
	Move.y = 0;
	Move.s = 0;
	console.log("inside "+isi);
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
					items.push(Move);
			}
			if (s < r-1 && t < c-1)
			{
				if (State[s][t] === 0 && State[s+1][t] === 0 && State[s][t+1] === 0 && State[s+1][t+1] === 0)
				{
					var Move = new Object();
					Move.x = s;
					Move.y = t;
					Move.s = 2;
					items.push(Move);
				}
			}
		}
	}
	console.log(items.length);
	console.log(items[Math.floor(Math.random()*items.length)]);
	return items[Math.floor(Math.random()*items.length)];
}

function getBestMove()
{
	if (isi > 15)
	{
		return getRandomMove();
	}
	else
	{
		console.log("isi "+isi);
		var dp = new Array(1 << isi);
		console.log("isi "+isi);
		dp[0] = 0;
		var id = 0;
		for(var s=0;s<r;s++)
		{
			for(var t=0;t<c;t++)
			{
				if (State[s][t] === 0)
				{
					Num[s][t] = id++;
				}
			}
		}
		console.log("isi "+isi);
		var Move = new Object();
		Move.x = 0;
		Move.y = 0;
		Move.s = 0;
		console.log("isi "+isi);
		for(var bitMask=0;bitMask<(1 << isi);bitMask++)
		{
			for(var s=0;s<r;s++)
			{
				for(var t=0;t<c;t++)
				{
					if (Num[s][t] >= 0)
					{
						if (bitMask & (1 << Num[s][t]))
						{
							Block[s][t] = 0;
						}
						else
						{
							Block[s][t] = 1;
						}
					}
				}
			}
			var exist = new Array;
			for(var a=0;a<=2*id;a++) exist.push(0);
			for(var s=0;s<r;s++)
			{
				for(var t=0;t<c;t++)
				{
					if (Block[s][t] === 0)
					{
						if (dp[bitMask-(1 << Num[s][t])] === 0)
						{
							Move.x = s;
							Move.y = t;
							Move.s = 1;
						}
						exist[dp[bitMask-(1 << Num[s][t])]] = 1;
					}
					if (s < r-1 && t < c-1)
					{
						if (Block[s][t] === 0 && Block[s+1][t] === 0 && Block[s][t+1] === 0 && Block[s+1][t+1] === 0)
						{
							if (dp[bitMask-(1 << Num[s][t])-(1 << Num[s+1][t])-(1 << Num[s][t+1])-(1 << Num[s+1][t+1])] === 0)
							{
								Move.x = s;
								Move.y = t;
								Move.s = 2;
							}
							exist[dp[bitMask-(1 << Num[s][t])-(1 << Num[s+1][t])-(1 << Num[s][t+1])-(1 << Num[s+1][t+1])]] = 1;
						}
					}
				}
			}
			dp[bitMask] = 0;
			
			while(exist[dp[bitMask]] === 1) dp[bitMask]++;
		}
		while(dp.length > 0) 
		{
			    dp.pop();
		}
		console.log("out "+isi);
		if (dp[bitMask] === 0)
		{
			return getRandomMove();
		}
		else
		{
			return Move;
		}
	}
}

var vsMode = false;

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
	}
	$("#addobstacle").hide();
	$("#tog").click(function () {
		if (size === 2)
		{
			if (lastx===-1&&lasty===-1);
			else if (lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
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
			else if (lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
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
	$("#modepick").click(function () {
		if (!Movement)
		{
			p1win = 0;
			p2win = 0;
			
			if (vsMode)
			{
				vsMode = false;
				$("#mode").html("Challenge!");
				$("#score1").html("Red : 0");
				$("#score2").html("Blue : 0");
			}
			else
			{
				vsMode = true;
				$("#mode").html("Versus!");
				$("#score1").html("You : 0");
				$("#score2").html("AI : 0");
			}
		}
		else
		{
			$("#mode").fadeOut("slow");
			$("#mode").fadeIn("fast");
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
				Num[s][t] = -1;
				Block[s][t] = 0;
				$(getID(s,t)).removeClass("turn1");
				$(getID(s,t)).removeClass("turn2");
				$(getID(s,t)).removeClass(op[0]);
				$(getID(s,t)).removeClass(op[1]);
				$(getID(s,t)).removeClass("obstacle");
			}
		}
		$("#newgame").hide();
		$("#addobstacle").show();	
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
	//	console.log(event.which);
	//	console.log(lastx + " "+ lasty);
		if (event.which===49)
		{
	//		console.log("masuk66");
			if (size === 2)
			{
	//			console.log("masuk55");
				if (lastx===-1&&lasty===-1)
				{
	//				console.log("masuk4");
				}
				else if (lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
				{
	//				console.log("masuk2");
					$(getID(lastx+1,lasty)).removeClass(op[turn]);
					$(getID(lastx,lasty+1)).removeClass(op[turn]);
					$(getID(lastx+1,lasty+1)).removeClass(op[turn]);
				}
				else if (State[lastx][lasty] === 0)
				{
	//				console.log("masuk");
					$(getID(lastx,lasty)).addClass(op[turn]);
				}
				else
				{
	//				console.log("masuk3");
				}
				size = 1;
				$("#toggle").html("1!");
			}

		}
		if (event.which===50)
		{
	//		console.log("masuk77");
			if (size === 1)
			{
				
				if (lastx===-1&&lasty===-1);
				else if (lastx < r-1 && lasty < c-1 && State[lastx][lasty] === 0 && State[lastx+1][lasty] === 0 && State[lastx][lasty+1] === 0 && State[lastx+1][lasty+1] === 0)
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
	//console.log(size);
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
									$("#title").html("Red Wins!");
									p1win++;
									$("#score1").html("Red : "+p1win);
								}
								else
								{
									$("#title").html("You Wins!");
									p1win++;
									$("#score1").html("You : "+p1win);
								}
							}
							else
							{
								$("#title").html("Blue Wins!");
								p2win++;
								$("#score2").html("Blue : "+p2win);
							}
						}
						turn = 1-turn;
						
						if (vsMode)
						{
							console.log("vsmode 1");
							var Move = getBestMove();
							console.log(Move);
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
								$("#title").html("AI Wins!");
								$("#score2").html("AI : "+p2win);
							}
							turn = 1-turn;
						}
						
						
					}
				}
				else if (s != r-1 && t != c-1)
				{
					if (State[x][y] === 0 && State[x+1][y] === 0 && State[x][y+1] === 0 && State[x+1][y+1] === 0)
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
									$("#title").html("Red Wins!");
									p1win++;
									$("#score1").html("Red : "+p1win);
								}
								else
								{
									$("#title").html("You Wins!");
									p1win++;
									$("#score1").html("You : "+p1win);
								}
							}
							else
							{
								$("#title").html("Blue Wins!");
								p2win++;
								$("#score2").html("Blue : "+p2win);
							}
						}
						turn = 1-turn;
						
						if (vsMode)
						{
							
							console.log("vsmode 2");
							var Move = getBestMove();
							console.log(Move);
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
								$("#title").html("AI Wins!");
								$("#score2").html("AI : "+p2win);
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
				else if (x < r-1 && y < c-1)
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
