var Note = function(text, task, bucket) {
	this.text = text;
	this.task = task;
	this.bucket = bucket;
	this.alert = [];
	this.creator = null;
}
