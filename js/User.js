var User=function(pic, name, email) {
	this.pic = pic;
	this.name = name;
	this.email = email;
	
	this.organizer = [];
	this.friends = [];
	this.Board = new Board();
}
