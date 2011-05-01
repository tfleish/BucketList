var Sticky=function(position, z, size, type, item) {
	this.position = position;
	this.x = position[0];
	this.y = position[1];
	this.z = z;
	
	this.size = size;
	this.height = size[0];
	this.width = size[1];
	
	this.type = type;
	
	this.item = item;
}
