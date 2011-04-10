var Task = function(name, bucket, index) {
	this.index = index;
	this.bucket = bucket;
	this.objName = this.bucket.objName + 't' + String(this.index);
	
	this.name = name;
	this.notes = [];
	this.dueDate = null;
	this.collabs = [];
	this.done = false;
}
