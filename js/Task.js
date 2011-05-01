var Task = function(name, bucket, index) {
	this.index = index;
	this.bucketNum = bucket;
	
	this.name = name;
	this.notes = [];
	this.dueDate = null;
	this.collabs = [];
	this.done = false;
	this.openSticky = false;
}
