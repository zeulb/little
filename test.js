function jelly() {
	this.mark_done = function(e)
	{
		console.log(e);
		return;
	}
	this.iter = function(e)
	{
		if (e === 0) return;
		this.mark_done(e);
		this.iter(e-1);
		return;
	}
}

var pika = new jelly();
pika.iter(100);