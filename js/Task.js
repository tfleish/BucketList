var Task = function(name, bucket) {
	this.bucket = bucket;
	this.name = name;
	this.notes = [];
	this.dueDate = null;
	this.collabs = [];
	this.done = false;
}
