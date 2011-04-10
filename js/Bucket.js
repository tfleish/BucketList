var Bucket=function(name, index) {
	this.index = index;
	this.objName = "b"+String(this.index);
	this.name = name;
	this.tasks=[];
	this.collabs=[];
}
