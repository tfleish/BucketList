var Note = function(index, text, task, bucket) {
	this.text = text;
	this.index = index;
	this.taskNo = task;
	this.bucketNo = bucket;
	this.alert = [];
	this.creator = null;
	this.openSticky = false;
}
