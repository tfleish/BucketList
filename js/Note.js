var Note = function(name, creator, task, bucket) {
	this.name = name;
	this.task = task;
	this.bucket = bucket;
	this.alert = [];
	this.creator = creator;
}
