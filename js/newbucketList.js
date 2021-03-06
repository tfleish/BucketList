/**
 * @author Becky
 */
$(document).ready(function() {

	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	
	$('#enterPaper').css('top', screenHeight/2 - 150);
	$('#enterPaper').css('left', screenWidth/2 - 220);
	
	$(".draggable").draggable( {containment: "#container"} );
	
	//Set drop downs
	$('#nameButton').click(function () {
		$('ul.menu1').slideToggle('fast');
  	});
	
	$('#alertButton').click(function () {
		$('ul.menu2').slideToggle('fast');
	});
	
	$('#tasksButton').click(function() {
		$('ul.menu3').slideToggle('fast');
	});
	
	$('#tasksByDateButton').click(function() {
		$('ul.menu4').slideToggle('fast');
	});	
	
	$('.alertMenus').click(function() {
		$('ul.menu5').slideToggle('fast');
	})
	
	$( "#accordion" ).accordion();
	
});

function login(type) {
	//send to backend
	//get response
	
	if((type == "create") && ($('#newPwd').val() != $('#pwdconf').val())) {
		alert("Your passwords do not match.  Please retype them and try again.");
	} else {
			
		var firstBucket = new Bucket("My First Bucket", 0);
		var secondBucket = new Bucket("Another Bucket", 1);
		var task1 = new Task("Task #1", 0, 0);
		var task2 = new Task("Task #2", 0, 1);
		var task3 = new Task("Task #3", 1, 0);
		var task4 = new Task("Task #4", 1, 1);
		firstBucket.tasks = [task1, task2];
		secondBucket.tasks = [task3, task4];
		var or=[firstBucket, secondBucket];
		if(type == 'create') {
			user = new User('img/personIcon.png', $('#newNameEntry').val(), $('#newEmail').val())//usually gotten from backend
			$('#nameButton').val($('#newNameEntry').val())
		} else {
			user = new User('img/personIcon.png', "Alice Packer", "lisp@mit.edu");
		}
		user.organizer = or;
		user.friends = [new Collaborator("Becky Bianco", "renminbi@mit.edu"), new Collaborator("Tamara Fleisher", "tfleish@mit.edu")];
		maxZ = 0; // should get this and totalPapers from data from backend
		totalPapers = 0;
		
		if(type == 'create') {
			note = new Task("Buckets are groups of tasks. You can use them to organize tasks and share them with friends.", "z", 1);
			user.board.stickies[0] = new Sticky([100, 500], 0, [187, 144], "task", note);
			
			note = new Task("You can post notes or tasks on your bulletin board by clicking the post-it image.", "z", 2);
			user.board.stickies[1] = new Sticky([200, 700], 0, [187, 144], "task", note);
			
			note = new Note("r", "Collaborators in a Bucket can see all tasks within the Bucket. You can also assign tasks to individual collaborators.", 1, "z");
			user.board.stickies[2] = new Sticky([300, 200], 0, [187, 144], "note", note);
			
			note = new Note("r", "Its easy to send alerts to other users reminding them about important information - just click the 'alert' button beside the note and check their name!", 2, "z");
			user.board.stickies[3] = new Sticky([50, 900], 0, [187, 144], "note", note);
			
		}
		
		loadLoginData();
	
		$('#nameEntry').val("");
		$('#usernameEnter').val("");
		$('#passwordEnter').val("");
		$('#newNameEntry').val("");
		$('#newEmail').val("");
		$('#newPwd').val("");
		$('#pwdconf').val("");
	
		$('#welcomeHolder').addClass('hidden');
		$('#accountCreate').addClass('hidden');
		$('#enterPaper').addClass('hidden');
		
		$('#bottomBar').removeClass('hidden');
		$('#dropDownBar').removeClass('hidden');
	}
}

function loadLoginData() {
	refreshDropDown();
	bd = user.board;
	for(i = 0; i < bd.stickies.length; i++) {
		postSticky(bd.stickies[i]);
	}
	for(i = 0; i < bd.papers.length; i++) {
		postPaper(bd.papers[i]);
	}
}

function postSticky(sticky) {
	var pos = sticky.position;
	var item = sticky.item;
	if(sticky.type == "task") { // Post a task sticky
		  var task = sticky.item;
		  var t = task.index;
		  var b = task.bucketNum;
		  var id = 'b'+b+'t'+t+'s';
		  var taskID = '#b'+b+'t'+t;
		  
		  var note = "<div class='taskSticky draggable resizable' onmousedown='moveToFront(\"#"+id+"\")' id='"+id+"' style=\"position: absolute; left:"+pos[1]+"px; top: "+pos[0]+"px; height:"+sticky.size[0]+"px; width:"+sticky.size[1]+"px\">"
  			+"<div class='stickyNote'>"+item.name+"</div>"
  			+"<div><img class='editStickyButton' title='Click to edit.' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+b+"','"+t+"', null)\">x</div></div>";
	} else { // Post a note sticky
		  var note = sticky.item;
		  var n = note.index;
		  var t = note.taskNo;
		  var b = note.bucketNo;
		  var id = 'b'+b+'t'+t+'n'+n+'s';
		  var noteId = '#b'+b+'t'+t+'n'+n;

		  var note = "<div class='sticky draggable resizable' onmousedown='moveToFront(\"#"+id+"\")' id='"+id+"' style=\"position: absolute; left:"+pos[1]+"px; top: "+pos[0]+"px; height:"+sticky.size[0]+"px; width:"+sticky.size[1]+"px\">"
  			+"<div class='stickyNote'>"+item.text+"</div>"
  			+"<div><img class='editStickyButton' title='Click to edit.' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+b+"','"+t+"','"+n+"')\">x</div></div>";
	}
	$("#container").append(note);
	moveToFront(id);
	$(".draggable").draggable( {containment: "#container"} );
  	$(".resizable").resizable({aspectRatio: true});
  	
  	refreshAllPapers();
}

function moveToFront(id) {
	maxZ = maxZ+1;
	$(id).css('z-index', String(maxZ));
}

function postPaper(paper) {
	var uid = paper.uid;
	var html =  "<div id='"+uid+"' class='draggable paper' onmousedown='moveToFront(\"#"+uid+"\")' style='top: "+paper.x+"px; left: "+paper.y+"px;'>"
	var trashcan = "<img title='Delete this "+paper.type+".' src='img/trashcan.png' onclick='deleteItemFromPaper(\""+uid+"\")' style='top: 245px' class='editStickyButton'></img>"
	var xbutton = "<div style='height: 5%; padding-top: 3%; padding-right: 3%; width: 100%'><div style='padding-right: 1px; float: right; cursor: pointer;' onclick='closePaper(\""+uid+"\")'><b>x</b></div></div>"
	var textHolder = "<div class='textholder'><div class='leftBox'>";
	var titleBoxHTML = "<div class='topLeftBoxBucket' id='titleBox"+uid+"'>";
	var iconHTML = "<div> <img style='float: left' src='img/bucket.gif' class='bucketIcon icon' id='icon"+uid+"' onClick = 'toggleBox(\""+uid+"\")'></img></div>";
	var titleHTML = "<div class='bucketTitle' id='title"+uid+"' style='height: 100%'> </div></div>"
	var notesBoxHTML = "<div id='notesBox"+uid+"' class='notesBox'></div>";
	html = html + xbutton + textHolder + titleBoxHTML + iconHTML + titleHTML + notesBoxHTML + "</div>";
	
		html = html + "<div class='rightBox'><div class='topRightBoxBucket' id='collabsTitle"+uid+"'><div style='float: left;'><h5 class='collabsTitle'><b>Collaborators</b></h5></div>";
	var collabsButtonHTML = "<img id='addCollabButton"+uid+"' onclick='toggleCollabsBox(\""+uid+"\")' title='Modify collaborators' src='img/plusButton.png' class='addCollabButton'></div>";
	var collabsBoxHTML = "<div class='collabsBox collabsView' id='collabsBox"+uid+"'></div></div>"
	
	html = html + collabsButtonHTML + collabsBoxHTML+trashcan;
	
	html = html + "</div>";
	$('#container').append(html);
	$(".draggable").draggable( {containment: "#container"} );
	
	$('#addCollabButton'+uid).click(function() {
		$('#collabDropDown'+uid).slideToggle('fast');
	})
	
	if(paper.type == "bucket") {
		bucket = paper.item;
		var html = "<textarea class='h2' onkeyup = 'ifEnter(\"title"+uid+"\", event)'>"+bucket.name+"</textarea>"
		$('#title'+uid).html(html);
	} else {
		task = paper.item;
		bucket = user.organizer[task.bucketNum];
		var html = "<textarea class='h2' onkeyup = 'ifEnter(\"title"+uid+"\", event)'>"+task.name+"</textarea>"
		html = html + "<br><h5 style='float: left; font-weight: lighter'>in bucket <u><font onclick=\"alert('hi')\" color='#0000ff'>"+bucket.name+"</font></u></h5>"
		$('#title'+uid).html(html);
		$('#titleBox'+uid).removeClass('topLeftBoxBucket');
		$('#titleBox'+uid).addClass('topLeftBoxTask');
		$('#collabsTitle'+uid).removeClass('topLeftBoxBucket');
		$('#collabsTitle'+uid).addClass('topLeftBoxTask');	
		if(task.done == true) {
			$('#icon'+uid).attr('src', 'img/checkbox-full.png')	
		} else{
			$('#icon'+uid).attr('src', 'img/checkbox-empty.png')	
		}
	}
	moveToFront(uid);
}

function toggleCollabsBox(uid) {
	var paper = getPaperFromID(uid);
	if(paper.collabsView == "view") {
		paper.collabsView = "add";
		
		postCollabAddScreen(uid);
	} else {
		paper.collabsView = 'view';
		
		processCollabAdd(uid);
		postCollabViewScreen(uid);
	}
}

function postCollabAddScreen(uid) {
	var paper = getPaperFromID(uid);
	var item = paper.item;
	$('#addCollabButton'+uid).attr('src', 'img/doneButton.gif');
	$('#addCollabButton'+uid).css('width', '50px');
	$('#addCollabButton'+uid).css('height', '25px');
	
	if(paper.type == 'bucket') {
		var addList = user.friends;
	} else {
		var addList = user.organizer[item.bucketNum].collabs;
	}
	
	var html = "<textarea id='collabInput"+uid+"' class='new collab' rows='1' onfocus='collabFocus(\""+uid+"\")' onblur='collabBlur(\""+uid+"\")' "
					+"onkeyup='ifEnter(\"#collabInput"+uid+"\", event)'>Find a collaborator</textarea>"
	
	for(i = 0; i < addList.length; i++) {
		var collab = addList[i];
		var name = collab.name;
		if(item.collabs.indexOf(collab) >= 0) {
			var src= 'img/checkbox-full.png';
		} else {
			var src='img/checkbox-empty.png';
		}
		
		var addHTML = "<div><img id='collabCheck"+i+uid+"' onclick='toggleCollab(\"#collabCheck"+i+uid+"\")' src='"+src+"' class='checkBoxIcon'/><img src='"+collab.pic+"' class='icon persona'/>"+name
		html = html + addHTML;
	}
	
	$('#collabsBox'+uid).html(html);
}

function toggleCollab(id) {
	if($(id).attr('src') == 'img/checkbox-empty.png') {
		var s = 'img/checkbox-full.png';
	} else{
		var s = 'img/checkbox-empty.png';
	}
	$(id).attr('src', s);
}

function processCollabAdd(uid) {
	var paper = getPaperFromID(uid);
	var item = paper.item;
	paper.collabView = 'add';
	item.collabs = [];
	
	if(paper.type == 'bucket') {
		var addList = user.friends;
	} else {
		var addList = user.organizer[item.bucketNum].collabs;}
	for(i = 0; i < addList.length; i++) {
		if($("#collabCheck"+i+uid).attr('src')=='img/checkbox-full.png') {
			item.collabs[item.collabs.length] = addList[i];
		}
	}	
}

function postCollabViewScreen(uid) {
	var paper = getPaperFromID(uid);
	paper.collabView = 'view'
	var item = paper.item;
	$('#addCollabButton'+uid).attr('src', 'img/plusButton.png');
	$('#addCollabButton'+uid).css('width', '30px');
	$('#addCollabButton'+uid).css('height', '30px');
	
	html='';
	for(i = 0; i < item.collabs.length; i++) {
		var collab = item.collabs[i];
		var name = collab.name;
		var addHTML = "<div><img src='"+collab.pic+"' class='icon persona'/>"+name+"<div style='color:#808080; cursor: pointer; float: right;'>x</div></div>"
		html = html + addHTML;
	}
	$('#collabsBox'+uid).html(html);
}

function deleteItemFromPaper(paperID) {
	var paper = getPaperFromID(paperID);
	item = paper.item;
	
	var response = confirm("Are you sure you want to delete the "+paper.type+" "+item.name+"?");
	if(response) {
		if(paper.type == 'bucket') { // Deleting a bucket, delete the paper
			user.organizer[item.index] = null;
			closePaper(paperID);
		} else { // Deleting a task, return to bucket view
			user.organizer[item.bucketNum].tasks[item.index] = null;
			changePaperFocus(item.bucketNum, null, paperID);	
		}
		refreshDropDown();
	} 
}

function returnToLogin() {
	$('#welcomeHolder').removeClass('hidden');
	$('#accountCreate').addClass('hidden');
}

function createAccountScreen() {
	$('#welcomeHolder').addClass('hidden');
	$('#accountCreate').removeClass('hidden');
}

function toggleAccordion(id) {
	if($('#b'+id+'accordion').hasClass('hidden')) {
		$('#b'+id+'expand').attr('src', 'img/red-minus.png')
		$('#b'+id+'accordion').css('position','relative');
		$('#b'+id+'accordion').removeClass('hidden');
	} else {
		$('#b'+id+'expand').attr('src', 'img/plus_green.gif')	
		$('#b'+id+'accordion').css('position','absolute');
		$('#b'+id+'accordion').addClass('hidden');
	}
}
 
function toggleAccordionDate(id) {
	if($('#d'+id+'accordion').hasClass('hidden')) {
		$('#d'+id+'expand').attr('src', 'img/red-minus.png')
		$('#d'+id+'accordion').css('position','relative');
		$('#d'+id+'accordion').removeClass('hidden');
	} else {
		$('#d'+id+'expand').attr('src', 'img/plus_green.gif')	
		$('#d'+id+'accordion').css('position','absolute');
		$('#d'+id+'accordion').addClass('hidden');
	}
}
// This function is called whenever we open a Bucket View on a paper
// Takes in the organizer index of a Bucket object.
function addBucketToPaper(b, paper) {
	var bd = user.board;
	var bucketObj = user.organizer[b]; // get Bucket object
	if(paper == null) {
		var position = getRandomPosition([475, 308]);
		paper = new Paper(position, "bucket")
		bd.papers[bd.papers.length] = paper;
		paper.item = bucketObj;
		paper.uid = "p"+totalPapers;
		totalPapers = totalPapers+1;
		postPaper(paper);
		
		var notes = "<div id='boxDiv"+paper.uid+"'><div><h4 id='identTitle"+paper.uid+"' style='float: left'>Tasks</h4>"
			+ "<div id='alarmBox"+paper.uid+"' class='hidden' style='float:right'>"
			+ "<div id='addStickyButtonDiv"+paper.uid+"' style='float:left; width:20px; padding-right: 90px; height:auto;'><img id='addStickyButtonPaper"+paper.uid+"' onclick='addSticky(null,\""+paper.uid+"\")' src='img/addStickyIconGreen copy.gif' style='float:left; cursor: default; width:20px; height:auto;'></img></div>"
			+ "<img src='img/alarmclock.png' style='float:left; width:20px; height:auto;'></img>"
			+ "<input type='textbox' onchange = 'setDueDate("+0+", \""+paper.uid+"\")' id='alarmText"+paper.uid+"' style='width: 7em; float:right;' class='date'></input>"
			+ "</div></div>"
			+ "<textarea class='task new' "
        	+ "style='float:left'"
	        + "id='textbox"+paper.uid+"'"
    	    + "rows='1' "
        	+ "onfocus=\"taskOrNoteFocus('"+paper.uid+"')\" "
	        + "onblur=\"taskBlur('"+paper.uid+"')\" "
    	    + "onkeyup=\"ifEnter('#textbox"+paper.uid+"', event)\">New Task</textarea>"
        	+ "<h4 id='dueLabel"+paper.uid+"' class='hidden' style='float:right; padding-right:5px'>Due</h4>"
			+ "<div class='divider'></div></div><div class='notesDiv' id='notesDiv"+paper.uid+"'></div>";
		
		$("#notesBox"+paper.uid).html(notes);
	} else {
		paper.item = bucketObj;		
	}
	refreshAllPapers();
}

//Will be to toggle checkbox next to Task name
function toggleBox(id) {
	for(i = 0; i < user.board.papers.length; i++) {
		if(user.board.papers[i].uid == id) {
			var task = user.board.papers[i].item;
		}
	}
	if($("#icon"+id).attr('src')=="img/checkbox-empty.png"){
		task.done = true;
		$("#icon"+id).attr('src', "img/checkbox-full.png")
	} else if($("#icon"+id).attr('src')=="img/checkbox-full.png"){
		task.done = false;
		$("#icon"+id).attr('src', "img/checkbox-empty.png");
	}
	refreshDropDown();
}

//This function is called whenever we want to add a Task View to the paper
//Takes in the number of the bucket and the number of the task.
function addTaskToPaper(b, t, paper) {
	var bd = user.board;
	var bucketObj = user.organizer[b]; // get Bucket object
	var taskObj = bucketObj.tasks[t];
	if(paper == null) {
		var position = getRandomPosition([475, 308]);
		paper = new Paper(position, "task")
		bd.papers[bd.papers.length] = paper;
		paper.item = taskObj;
		paper.uid = "p"+totalPapers;
		totalPapers = totalPapers+1;
		postPaper(paper);
	
		var notes = "<div id='boxDiv"+paper.uid+"' class='noteBox'>"
					+ "<div><h4 style='float: left;'>Notes</h4>"
					+ "<div style='float:right'>"
					+ "<div id='addStickyButtonDiv"+paper.uid+"' style='float:left; width:20px; cursor: default; padding-right: 90px; height:auto;'><img id='addStickyButtonPaper"+paper.uid+"' onclick='addSticky(null,\""+paper.uid+"\")' src='img/addStickyIconGreen copy.gif' style='float:left; width:20px; cursor: default; height:auto;'></img></div>"
					+ "<img id='alarmBox"+paper.uid+"' src='img/alarmclock.png' style='float:left; width:20px; height:auto;'></img>"
					+ "<input type='textbox' onchange = 'setDueDate("+0+", \""+paper.uid+"\")' id='alarmText"+paper.uid+"' style='width: 7em; float:right;' class='date'></input>"
					+ "</div></div>"
      				+ "<textarea class='new note'"
                   + "id='textbox"+paper.uid+"'"
                   + "rows='1' style='height: auto'"
                   + "onfocus=\"taskOrNoteFocus('"+paper.uid+"')\" "
                   + "onblur=\"noteBlur('"+paper.uid+"')\" "
                   + "onkeyup=\"ifEnter('#textbox"+paper.uid+"', event)\">New Note</textarea><br>"
      + "<h4 id='alertLabel' class='hidden' style='float:right; padding-right:5px; cursor: help;' onClick='help(\"alerts\")'>Alert\n</h4>"
   	  + "<div class='divider'></div></div><div class='notesDiv' id='notesDiv"+paper.uid+"'></div>";
	
		$("#notesBox"+paper.uid).html(notes);

	} else {
		paper.item = bucketObj;		
	}
	refreshAllPapers();	
}

//This function focuses the newBucket section of the mytasks dropdown.  changes color.
function bucketFocus() {
	var id = '#bucketInput';
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}

//This function is called whenever the newBucket section of the mytasks dropdown is blurred.
//it creates a new bucket on the dropdown.
function bucketBlur() {
	var inp = '#bucketInput';
	var newBucketNum = user.organizer.length;
	//If the bucket has no text still, don't create a new bucket out of it.
  if ((($(inp).val() == '') || ($(inp).val() == 'New Bucket')) && $(inp).hasClass('new')) {
  	$(inp).text('New Bucket');
  	$(inp).css('color', '#aaa');
  } //else, create new bucket
  else if ($(inp).hasClass('new')) {
		
    	$(inp).removeClass('new');
		name = $(inp).val();
		var bucketObj = new Bucket(name, newBucketNum); // create a new Bucket object
		user.organizer[newBucketNum]=bucketObj; // and add it to the organizer

		$(inp).text('New Bucket'); // reset input box
		$(inp).css('color', '#aaa');
		$(inp).addClass('new');
		refreshDropDown();
  }
}

//This function focuses the newBucket section of the mytasks dropdown.  changes color.
function collabFocus(uid) {
	var id = '#collabInput'+uid;
	if ($(id).hasClass('new')) {
		$(id).text('');
		$(id).css('color', 'black');
	}
}

//This function is called whenever the newBucket section of the mytasks dropdown is blurred.
//it creates a new bucket on the dropdown.
function collabBlur(paperID) {
	var paper = getPaperFromID(paperID);
	var inp = '#collabInput'+paperID;
	
	if ($(inp).val() == '' && $(inp).hasClass('new')) {
	} 
	else if (paper.type == "bucket") {//set t to -1 if it's a bucket
		name = $(inp).val();
		var collab = new Collaborator(name, null);
		addCollabToBucket(paper, collab);
    } else {
    	name = $(inp).val();
    	var collab = new Collaborator(name, null);
    	addCollabToTask(paper, collab);
    }
    $(inp).text('Enter name'); // reset input box
	$(inp).css('color', '#aaa');
	$(inp).addClass('new');
}

function addCollabToBucket(paper, collab) {
	var bucket = paper.item;
	var collabNo = bucket.collabs.length;
	bucket.collabs[collabNo] = collab;
	user.friends[user.friends.length]=collab;
	refreshAllPapers();
}

function addCollabToTask(paper, collab) {
	var task = paper.item;
	var bucket = user.organizer[task.bucketNum];
	var response = confirm("Are you sure you want to add this collaborator to the bucket "+bucket.name+" as well?");
	if(response) {
		var collabNo = task.collabs.length;
		task.collabs[collabNo] = collab;
		bucket.collabs[bucket.collabs.length] = collab;
		user.friends[user.friends.length]=collab;
	
		refreshAllPapers();
	}
}

//Called when tasks are brought into focus in BucketView
function taskOrNoteFocus(paperID) {
  var id = '#textbox'+paperID;
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}

//Called when tasks are blurred in BucketView
function taskBlur(paperID) {
	var paper = getPaperFromID(paperID);
	var bucket = paper.item;
	var taskbox = '#textbox'+paperID;
	
	if($(taskbox).val() == '' && $(taskbox).hasClass('new')) { // if the text is empty, don't actually create new task.
		$(taskbox).text('New Note');
		$(taskbox).css('color', '#aaa');
	} else {
		name = $(taskbox).val();
		var task = new Task(name, bucket.index, bucket.tasks.length);
		bucket.tasks[bucket.tasks.length] = task;
		refreshAllPapers();
	}
}

//called when a note is blurred in TaskView
function noteBlur(paperID) {
	var paper = getPaperFromID(paperID);
	var task = paper.item;
	var taskbox = '#textbox'+paperID;
	
	if($(taskbox).val() == '' && $(taskbox).hasClass('new')) { // if the text is empty, don't actually create new task.
		$(taskbox).text('New Note');
		$(taskbox).css('color', '#aaa');
	} else {
		name = $(taskbox).val();
		var note = new Note(task.notes.length, name, task.index, task.bucketNum);
		task.notes[task.notes.length] = note;
		refreshAllPapers();
	}
}

function addSticky(index, paperID) { 
	var pos = getRandomPosition([96, 75])
	var buttonId = '#icon'+index+paperID;
	var paper = getPaperFromID(paperID);
	$(buttonId).attr("onclick", "");
	$(buttonId).css("opacity", "0.3");
	$(buttonId).css("filter", "alpha(opacity=30)");
	maxZ = maxZ + 1;
	if(index == null) {
		var task = paper.item;
		task.openPaper = true;
		var sticky = new Sticky(pos, maxZ, [96, 75], "task", task);
		var id='stickyb'+task.bucketNum+"t"+task.index
		var html = "<div class='taskSticky draggable resizable' id='stickyb"+task.bucketNum+"t"+task.index+"' style=\"position: absolute; left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div id='stickyTextb"+task.bucketNum+"t"+task.index+"' class='stickyNote'>"+task.name+"</div>"
  			+"<div><img onclick=\"editSticky('"+task.bucketNum+"','"+task.index+"',null)\" class='editStickyButton' title='Click to edit.' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+task.bucketNum+"','"+task.index+"',null)\">x</div></div>";
	}
	else if(paper.type == 'task') {
		var note = paper.item.notes[index];
		note.openSticky = true;
		var sticky = new Sticky(pos, maxZ, [96, 75], "note", note)
  
  		var html = "<div class='sticky draggable resizable' id='stickyb"+note.bucketNo+"t"+note.taskNo+"n"+note.index+"' style=\"position: absolute; left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div class='stickyNote'>"+note.text+"</div>"
  			+"<div><img class='editStickyButton' title = 'Click to edit.' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+note.bucketNo+"','"+note.taskNo+"','"+note.index+"')\">x</div></div>";
  	} else {
  		var task = paper.item.tasks[index];
  		var sticky = new Sticky(pos, maxZ, [96, 75], "task", task);
  		task.openSticky = true;
  		id = 'stickyb'+task.bucketNum+"t"+task.index
  		var html = "<div class='taskSticky draggable resizable' id='stickyb"+task.bucketNum+"t"+task.index+"' style=\"position: absolute; left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div id='stickyTextb"+task.bucketNum+"t"+task.index+"' class='stickyNote'>"+task.name+"</div>"
  			+"<div><img onclick=\"editSticky('"+task.bucketNum+"','"+task.index+"',null)\" class='editStickyButton' title='Click to edit.' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+task.bucketNum+"','"+task.index+"',null)\">x</div></div>";
  	}
	user.board.stickies[user.board.stickies.length] = sticky;
  $("#container").append(html);
  moveToFront('#'+id);
  $(".draggable").draggable( {containment: "#container"} );
  $( ".resizable" ).resizable({aspectRatio: true});
}

function closeSticky(bucketNo, taskNo, noteNo) {
	if(bucketNo == "z") {
		if(noteNo == null) {
			var id = '#b'+bucketNo+'t'+taskNo+'s';
			$(id).remove();
			user.board.stickies.splice(taskNo-1, taskNo-1);
		} else {
			var id = '#b'+bucketNo+'t'+taskNo+'n'+noteNo+'s';
			$(id).remove();
			user.board.stickies.splice(taskNo+1, taskNo+1);
		}
	}
	else if(noteNo == null) {
		var id = "stickyb"+bucketNo+"t"+taskNo;
		var item = user.organizer[bucketNo].tasks[taskNo]
	} else {
		var id = "stickyb"+bucketNo+"t"+taskNo+"n"+noteNo;
		var item = user.organizer[bucketNo].tasks[taskNo].notes[noteNo];
	}
	for(i = 0; i < user.board.stickies.length; i++) {
		s = user.board.stickies[i].item;
		if(s == item) {
			item.openSticky = false;
			user.board.stickies.splice(i, i);
			$('#'+id).remove();
		}
	}
	refreshAllPapers();
}

function editSticky(bucketNo, taskNo, noteNo) {
	if(noteNo == null) {
		var id = "#stickyTextb"+bucketNo+"t"+taskNo;
		var textboxID = "stickyEditableb"+bucketNo+"t"+taskNo+"n"+noteNo;
		var item = user.organizer[bucketNo].tasks[taskNo]
		var text = item.name;
	} else {
		var id = "#stickyTextb"+bucketNo+"t"+taskNo+"n"+noteNo;
		var textboxID = "stickyEditableb"+bucketNo+"t"+taskNo+"n"+noteNo;
		var item = user.organizer[bucketNo].tasks[taskNo].notes[noteNo];
		var text = item.text;
	}
	var html = "<textarea id='"+textboxID+"' class='editableSticky'>"+text+"</textarea>";
	$(id).html(html);
	$("#"+textboxID).focus(function(){
    // Select input field contents
    	this.select();
	})
	
	$("#"+textboxID).blur(function(){
    // Select input field contents
    	var text = $("#"+textboxID).val();
    	if(item.text != null) {
    		item.text = text;
    		html = item.text;
    	} else {
    		item.name = text;
    		html = item.name;
    	}
    	
    	$(id).html(html);
		refreshAllPapers();
	})
	
	$('#'+textboxID).focus();	
}

function getRandomPosition(size) {
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	var pieceHt = size[1]
	var pieceWd = size[0]
	
	function getRandomHeight() {
		var ht=Math.floor(Math.random()*screenHeight);
		if ((ht + pieceHt > screenHeight)) {
			return getRandomHeight();
		} else {
			return ht;
		}
	}
	ht = getRandomHeight();
	
	function getRandomWidth() {
		var wid=Math.floor(Math.random()*screenWidth);
		if ((wid + pieceWd > screenWidth)) {
			return getRandomWidth();
		} else {
			return wid;
		}
	}
	wid = getRandomWidth();

	return [ht, wid]
}

function ifEnter(field, event) {
  var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
  if (theCode == 13){
  	$(field).val($(field).val().split('\n')[0]);
    $(field).blur();
  }  
  text = $(field).val()
  var rows = Math.ceil(text.length/30);
  $(field).attr('rows', String(rows));
}

function closePaper(id) {
	$('#'+id).addClass('hidden');
	for(i = 0; i < user.board.papers.length; i++) {
		if(user.board.papers[i].uid = id) {
			user.board.papers.splice(i, i);
		}
	}
}

function help() {
	//create new paper, add it to container div	
	var helpTitle = "<h5 style='padding:10px' > How can we help you? </h5>"
	var helpTopics = "<u><font onclick=\"changeHelpFocus('buckets')\" color='#0000ff'>Buckets</font></u><br>"
	+"<u><font onclick=\"changeHelpFocus('postits')\" color='#0000ff'>Post-its</font></u><br>"
	+"<u><font onclick=\"changeHelpFocus('collabs')\" color='#0000ff'>Collaborators</font></u><br>"
	+"<u><font onclick=\"changeHelpFocus('alerts')\" color='#0000ff'>Alerts</font></u><br>"
	var helpPaper = "<div id='helpPaper' class='draggable paper help'>"
			+helpTitle
			+helpTopics
			+"<div class='xbuttonPaper' onclick=\"closeTempPaper('#helpPaper')\">x</div>"
			+"</div>";
	$('#container').append(helpPaper);
	$(".draggable").draggable( {containment: "#container"} );
}

function changeHelpFocus(dest) {
	if(dest == 'back') {
		var helpTitle = "<h5 style='padding:10px' > How can we help you? </h5>"
		var helpTopics = "<u><font onclick=\"changeHelpFocus('buckets');\" color='#0000ff'>Buckets</font></u><br>"
			+"<u><font onclick=\"changeHelpFocus('postits');\" color='#0000ff'>Post-its</font></u><br>"
			+"<u><font onclick=\"changeHelpFocus('collabs');\" color='#0000ff'>Collaborators</font></u><br>"
			+"<u><font onclick=\"changeHelpFocus('alerts');\" color='#0000ff'>Alerts</font></u><br>"
		var helpPaper = helpTitle
			+helpTopics
			+"<div class='xbuttonPaper' onclick=\"closeTempPaper('#helpPaper')\">x</div>"
		$('#helpPaper').html(helpPaper);
	} else if(dest == 'buckets') {
		var helpTitle = "<h5 style='padding:10px' > Buckets </h5>"
		var helpText = "<div style='font-size: small'>Buckets are how you organize tasks into categories. You can use them for personal organization or add other users to you Bucket to share all the tasks within the Bucket with them. You can view a list of your Buckets by clicking 'My Buckets'. Clicking on a Bucket name lets you view all tasks within the bucket and a list of collaborators in the Bucket.</div><br>"
		var backButton = "<button type='button' onclick=\"changeHelpFocus('back')\" style='float: right'>Back to Help Screen</button>"
		var helpPaper = helpTitle
			+helpText
			+backButton
			+"<div class='xbuttonPaper' onclick=\"closeTempPaper('#helpPaper')\">x</div>";
		$('#helpPaper').html(helpPaper);
	} else if(dest == 'postits') {
		var helpTitle = "<h5 style='padding:10px' > Post-its </h5>"
		var helpText = "<div style='font-size: small'>To help you organize and remember your important tasks and notes, you can post them on your bulletin board! To do this, simply click the post-it icon beside the task / note. You can move the post-its wherever you want on the board. You can also edit them, either from the post-it itself or from the task / Bucket view. Clicking the 'x' removes the post-it from the Bulletin board, but you can always reopen it later.</div><br>"
		var backButton = "<button type='button' onclick=\"changeHelpFocus('back')\" style='float: right'>Back to Help Screen</button>"
		var helpPaper = helpTitle
			+helpText
			+backButton
			+"<div class='xbuttonPaper' onclick=\"closeTempPaper('#helpPaper')\">x</div>"
		$('#helpPaper').html(helpPaper);
	} else if(dest == 'collabs') {
		var helpTitle = "<h5 style='padding:10px' > Collaborators </h5>"
		var helpText = "<div style='font-size: small'>Collaborators on a Bucket can see all tasks within the Bucket. You can also assign specific tasks to individual collaborators. When adding collaborators to Buckets, you can select from any user you have previously communicated with, or type the name or email of a different user. To assign a task, simple select from the collaborators already added to the Bucket.</div><br>"
		var backButton = "<button type='button' onclick=\"changeHelpFocus('back')\" style='float: right'>Back to Help Screen</button>"
		var helpPaper = helpTitle
			+helpText
			+backButton
			+"<div class='xbuttonPaper' onclick=\"closeTempPaper('#helpPaper')\">x</div>"
		$('#helpPaper').html(helpPaper);
	} else if(dest == 'alerts') {
		var helpTitle = "<h5 style='padding:10px' > Alerts </h5>"
		var helpText = "<div style='font-size: small'>Alerts make communicating with friends and sending reminders easy. You have a drop-down list with all your alerts (new ones in bold). You automatically receive an alert whenever a due-date is approaching or you are added to a Bucket or assigned a task. You also have the option of alerting collaborators of new notes, by clicking the 'alert' icon beside the note, to make sure they don�t miss anything important.</div><br>"
		var backButton = "<button type='button' onclick=\"changeHelpFocus('back')\" style='float: right'>Back to Help Screen</button>"
		var helpPaper = helpTitle
			+helpText
			+backButton
			+"<div class='xbuttonPaper' onclick=\"closeTempPaper('#helpPaper')\">x</div>"
		$('#helpPaper').html(helpPaper);
	}
}

function logout() {

	$('#enterPaper').removeClass('hidden');
	$('#welcomeHolder').removeClass('hidden');
	$('#bottomBar').addClass('hidden');
	$('#dropDownBar').addClass('hidden');
	for(var i = 0; i < user.board.stickies.length; i++) {
		user.board.stickies[i].remove();
	}
	user.board.stickes = [];
	
	for(var j = 0; j < user.board.papers.length; j++) {
		user.board.papers[j].remove();
	}
	user.board.papers = [];
}

function setDueDate(i, paperID) {
	var paper = getPaperFromID(paperID);
	if(paper.type == 'task') {
		var task = paper.item;
		var date = $("#alarmText"+paperID).datepicker('getDate');
	} else {
		var task = paper.item.tasks[i];
		var date = $('#dateTexti'+i+paperID).datepicker('getDate');
	}
	task.dueDate = date;
	
	refreshAllPapers();
}

function editTask(i, uid) {
	$("#text"+i+uid).attr('readonly', '');
	$("#text"+i+uid).select();
}

function editBlur(i, uid) {
	var paper = getPaperFromID(uid);
	var task = paper.item.tasks[i];
	if($('#text'+i+uid).val() != '') {
		task.name = $('#text'+i+uid).val();
	}
	
	$('#text'+i+uid).attr('readonly', 'readonly')
	refreshAllPapers();
}

function refreshPaper(paperID) {
	var paper = getPaperFromID(paperID);
	var uid = paper.uid;
	if(paper.type == "bucket") {
		var bucket = paper.item;
		var titleHTML = "<textarea class='h2' onkeyup = 'ifEnter(\"title"+uid+"\", event)'>"+bucket.name+"</textarea>"
		$('#title'+uid).html(titleHTML);
		$('#icon'+uid).attr('src', 'img/bucket.gif')
		$('#titleBox'+uid).addClass('topLeftBoxBucket');
		$('#titleBox'+uid).removeClass('topLeftBoxTask');
		$('#collabsTitle'+uid).addClass('topLeftBoxBucket');
		$('#collabsTitle'+uid).removeClass('topLeftBoxTask');	
		var html = ''; 
		for(i = 0; i < bucket.tasks.length; i++){
			if(bucket.tasks[i] != null) {
				var task = bucket.tasks[i];
				$("#dueLabel"+paper.uid).removeClass('hidden');
				var name = task.name;
				var stringTask = "user.organizer["+task.bucketNum+"].tasks["+i+"]";
				var entry = "<div style='width: 100%; float: left'>";
				var newIcon = "<div style='float: left'><img title = 'Post a sticky!' src=\"img/addStickyIconGreen copy.gif\""
		        	+ "id='icon"+i+paper.uid+"'"
		        	+ "class='stickyButton' "
		        	+ "onclick=\"addSticky("+i+", '"+uid+"')\"> </img>"
		        if(task.done) {
		        	src = 'img/checkbox-full.png';
		        } else {
		        	src ='img/checkbox-empty.png';
		        }
		        var checkbox = "<img id='itemCheck"+i+paper.uid+"' onclick = 'toggleTask("+i+", \""+paper.uid+"\")' src='"+src+"' class='checkBoxIcon' style='float:left'></input>"
		        
				//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
				rows = Math.ceil(name.length/22);

		    	var newText = "<textarea class='task fixed' "
		        	+ "id='text"+i+uid+"'"
		        	+ "readonly='readonly' "
					+"ondblclick='changePaperFocus("+bucket.index+","+i+",\""+uid+"\")'"
					+"onkeyup='ifEnter(\"#text"+i+uid+"\", event)' "
					+"onblur='editBlur("+i+", \""+uid+"\")' "
					+"rows='"+String(rows)+"' "
					+"style='float:left;'>"
		        	+name+"</textarea></div>"
		         	+"<div style='float: right; width: 65px;'>"
		        	+"<input onchange='setDueDate("+i+", \""+uid+"\")' id='dateTexti"+i+uid+"' class='hidden date' type='textbox' style='float: right; width:0px; padding:0px; margin:0px; border: 0px;'/>"
		        	+"<img src='img/EditObjectButton.png' title='Click to edit.' onclick='editTask("+i+", \""+uid+"\")' class='icon' style='float: left'></img></div>";
		        var exit = "</div>";
		        html = html + entry + newIcon + checkbox + newText + exit;
	        }
		}
		$('#textbox'+uid).text('New Task');
		$('#textbox'+uid).css('color', '#aaa');
		$('#textbox'+uid).onkeyup="ifEnter('#textbox"+paper.uid+"', event)";
    	$('#notesDiv'+uid).html(html);
		for(i=0;i<bucket.tasks.length;i++){   
			if(bucket.tasks[i] != null) {
				task = bucket.tasks[i]; 	
		    	if(task.dueDate != null) {
		    		var src='img/cals/cal'+task.dueDate.getDate()+'.gif';
			    } else {
			    	var src = 'img/calendar_icon.gif';
			    }
			    
			    if(task.done) {
		        	$('#text'+i+uid).addClass('strikeThrough');
			    } else {
			    	$('#text'+i+uid).removeClass('strikeThrough');
			    }
			    
				$("#dateTexti"+i+uid).datepicker({ showOn: 'button', buttonImageOnly: true, buttonImage: src });
				$('#dateTexti'+i+uid).datepicker("setDate", task.dueDate);
				
		        if(bucket.tasks[i].openSticky) {
		        	var buttonId = '#icon'+i+paper.uid;
		       		$(buttonId).attr("onclick", "");
					$(buttonId).css("opacity", "0.3");
					$(buttonId).css("filter", "alpha(opacity=30)");
			    }
			}
		}
		
		if(paper.collabsView == 'view') {
			postCollabViewScreen(paper.uid)
		} else {
			postCollabAddScreen(paper.uid);
		}
	} else {
		$("#dueLabel"+paper.uid).addClass('hidden');
		var task = paper.item;
		var bucket = user.organizer[task.bucketNum];
		var html = "<textarea class='h2' onkeyup = 'ifEnter(\"title"+uid+"\", event)'>"+task.name+"</textarea>"
		html = html + "<br><h5 style='float: left; font-weight: lighter;'>in bucket <u><font onclick=\"changePaperFocus("+task.bucketNum+", null,'"+paper.uid+"');\" color='#0000ff'>"+bucket.name+"</font></u></h5>"
		$('#title'+uid).html(html);
		$('#titleBox'+uid).removeClass('topLeftBoxBucket');
		$('#titleBox'+uid).addClass('topLeftBoxTask');
		$('#collabsTitle'+uid).removeClass('topLeftBoxBucket');
		$('#collabsTitle'+uid).addClass('topLeftBoxTask');	
		if(task.done == true) {
			$('#icon'+uid).attr('src', 'img/checkbox-full.png')	
		} else{
			$('#icon'+uid).attr('src', 'img/checkbox-empty.png')	
		}
		
		try {
			if(task.dueDate == null) {
				task.dueDate = $('#alarmText'+uid).datepicker('getDate').getDate();
				task.dueDate = $('#alarmText'+uid).datepicker('getDate');
			}
		} catch(err) {}
		
		html='';
		for(i = 0; i < task.notes.length; i++){
			var note = task.notes[i];
			var name = note.text;
		
			var entry = "<div style='width: 100%; float: left'>";
			var newIcon = "<div style='float: left; width: 80%;'><img title='Post a sticky!' src=\"img/addStickyIcon.gif\""
						+ "id='icon"+i+paper.uid+"'" 
						+ "class='stickyButton' " 
						+ "onclick=\"addSticky('"+i+"','"+paper.uid+"')\"></img>";
														 
			//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
			rows = Math.ceil(name.length/22);
	    	var newText = "<textarea class='note fixed' rows='"+rows+"' style='float:right; width: 180px;'" 
						+"id='text"+i+uid+"'" +">" 
						+name+"</textarea></div>"
						+"<div style='float: right; width: 15px;'>"
							+"<img src='img/alert_icon.gif' title='Alert a collaborator about this note.' class='menu_class alertMenus checkBoxIcon' style='float: right;'>"
						+"</img></div>";
	        var exit = "</div>";        
	        html = html + entry + newIcon + newText + exit;	
		}
		$('#textbox'+uid).text('New Note');
		$('#textbox'+uid).css('color', '#aaa');
		$('#textbox'+uid).onkeyup="ifEnter('#textbox"+paper.uid+"', event)";
    	$('#notesDiv'+uid).html(html);
    	$('#alarmText'+uid).datepicker();
    	$('#alarmText'+uid).datepicker('setDate',task.dueDate)
    	
    	for(var i = 0; i < task.notes.length; i++){
    		if(task.notes[i].openSticky) {
		       	var buttonId = '#icon'+i+paper.uid;
		  		$(buttonId).attr("onclick", "");
				$(buttonId).css("opacity", "0.3");
				$(buttonId).css("filter", "alpha(opacity=30)");
			}
    	}
    	if(task.openSticky) {
    		$("#addStickyButtonPaper"+paper.uid).attr("onclick", "");
    		$("#addStickyButtonPaper"+paper.uid).css("opacity", "0.3");
			$("#addStickyButtonPaper"+paper.uid).css("filter", "alpha(opacity=30)");
    	} else {
			$('#addStickyButtonDiv'+paper.uid).html("<img id='addStickyButtonPaper"+paper.uid+"' onclick='addSticky(null,\""+paper.uid+"\")' src='img/addStickyIconGreen copy.gif' style='float:left; width:20px; padding-right: 90px; cursor: default; height:auto;'></img>");
    	}
    	if(paper.collabsView == 'view') {
			postCollabViewScreen(paper.uid)
		} else {
			postCollabAddScreen(paper.uid);
		}
	}	
}

function toggleTask(ind, uid) {
	var paper = getPaperFromID(uid);
	item = paper.item;
	task = item.tasks[ind];
	if(task.done) {
		task.done = false;
		$('#itemCheck'+ind+uid).attr('src', 'img/checkbox-empty.png');
		$('#text'+ind+uid).removeClass('strikeThrough');
		}
	else {
		task.done = true;
		$('#itemCheck'+ind+uid).attr('src', 'img/checkbox-full.png');
		$('#text'+ind+uid).addClass('strikeThrough');
	}
	refreshAllPapers();
	refreshDropDown();
}

function changePaperFocus(bucketNum, taskNum, paperID) {
	var bucket=user.organizer[bucketNum];
	if(taskNum != null) {
		var task = bucket.tasks[taskNum];
		var paper = getPaperFromID(paperID);
		paper.item = task;
		paper.type = 'task';
		$('#alarmText'+paper.uid).removeClass('hidden');
		$('#addStickyButtonDiv'+paperID).removeClass('hidden');
		$('#identTitle'+paper.uid).html("Notes");
		$('#alarmBox'+paper.uid).removeClass('hidden');
		$('#textbox'+paper.uid).blur(function() {
	  		noteBlur(paperID);
		});
	} else { // this is where you change it BACK to a bucket
		var paper = getPaperFromID(paperID);
		paper.item = bucket;
		paper.type = 'bucket';
		$('#alarmText'+paper.uid).addClass('hidden');
		$('#identTitle'+paper.uid).html("Tasks");
		$('#addStickyButtonDiv'+paperID).addClass('hidden');
		$('#alarmBox'+paper.uid).addClass('hidden');
		$('#textbox'+paper.uid).blur(function() {
	  		taskBlur(paperID);
		});
	}	
	paper.collabsView = 'view'	
	refreshAllPapers();
}

function refreshDropDown() {
	var bucket;
	var task;
	var bucketName;
	var taskName;
	var src;
	var numBuckets = user.organizer.length;
	var inputBoxHTML = "<li><textarea id='bucketInput' class='new bucket' rows='1' onfocus='bucketFocus("+numBuckets+")' onblur='bucketBlur()' "
					+"onkeyup='ifEnter(\"#bucketInput\", event)'>New Bucket</textarea></li>"
	var text = inputBoxHTML;
	for(i = 0; i < user.organizer.length; i ++) {
			bucket = user.organizer[i];
			var ul = ""
			if(bucket != null) {
				ul = ul + "<li>"
				bucketName = bucket.name;
				ul = ul + "<div><img id='b"+i+"expand' class='expandButton' style='float: left;' src='img/plus_green.gif' onclick='toggleAccordion("+i+")'></img></div>";
				ul = ul + "<div class='hoverBold' onclick = 'addBucketToPaper("+i+", null)'>"+bucketName+"</div>";
				ul = ul + "<div id='b"+i+"accordion' class='hidden' style='position:absolute'>";
				for(j = 0; j < bucket.tasks.length; j++) {
						task = bucket.tasks[j];
						if(task != null) {
						taskName = task.name;
						if(task.done) {
							taskName = "<del>"+taskName+"</del>"
							src= 'img/checkbox-full.png';
						} else {
							src= 'img/checkbox-empty.png';
						}
						ul=ul+"<img onclick='toggleDDcheck("+i+", "+j+")' id='dropDownCheckb"+i+"t"+j+"' src='"+src+"' class='checkBoxIcon' style='float:left'></input>";
						ul = ul + "<div style='width: 12em; height:auto;' class='hoverBold' onclick='addTaskToPaper("+i+", "+j+")'>"+taskName+"</div>"
					}
				}
				ul = ul + "</div></li>"
			}
		text = text + ul;	
	}
		
	$('#tasksMenu').html(text);
	
	var sortedTasks = sortTasksByDate();
	
	var text = "";
	var ind = 0;
	for(var i in sortedTasks) {
		var ul = ""
		ul = ul + "<li>"
		var date = i;
		if(date == '99/99/9999') {
			date = "No due date"
		}
		ul = ul + "<div><img id='d"+ind+"expand' class='expandButton' style='float: left;' src='img/plus_green.gif' onclick='toggleAccordionDate("+ind+")'></img></div>";
		ul = ul + "<div class='hoverBold'>"+date+"</div>";
		ul = ul + "<div id='d"+ind+"accordion' class='hidden' style='position:absolute'>";
		for(j = 0; j < sortedTasks[i].length; j++) {
			var task = sortedTasks[i][j];
			var taskName = task.name;
			if(task.done) {
				taskName = "<del>"+taskName+"</del>"
				src= 'img/checkbox-full.png';
			} else {
				src= 'img/checkbox-empty.png';
			}
			ul=ul+"<img onclick='toggleDDcheck("+task.bucketNum+", "+task.index+")' id='dateDropDownCheckb"+ind+"t"+j+"' src='"+src+"' class='checkBoxIcon' style='float:left'></img>";
			ul = ul + "<div style='width: 12em; height:auto;' class='hoverBold' onclick='addTaskToPaper("+task.bucketNum+", "+task.index+")'>"+taskName+"</div>"
		}
		ul = ul + "</div></li>"
		text = text + ul;
		ind = ind + 1;
	}
	$('#tbdMenu').html(text);
}

function toggleDDcheck(b, t) {
	if(user.organizer[b].tasks[t].done){
		user.organizer[b].tasks[t].done = false;
	} else {
		user.organizer[b].tasks[t].done = true;
	}
	refreshAllPapers();
}

function getPaperFromID(paperID) {
	for(i = 0; i < user.board.papers.length; i++) {
		if(paperID == user.board.papers[i].uid) {
			var paper = user.board.papers[i];
		}
	}
	return paper;
}

function refreshAllPapers() {
	refreshDropDown();
	for(q = 0; q < user.board.papers.length; q++) {
		refreshPaper(user.board.papers[q].uid);
	}
}

function clearCompleted() {
	for(i = 0; i < user.organizer.length; i++) {
		bucket = user.organizer[i];
		for(j = 0; j < bucket.tasks.length; j++) {
			if(bucket.tasks[j] != null && bucket.tasks[j].done) {
				var task = bucket.tasks[j];
				bucket.tasks[j] = null;
			}
		}
	}
	for(var i = 0; i < user.board.papers.length; i++) {
		if(user.board.papers[i].item == task) {
			$('#'+user.board.papers[i].uid).remove();
			user.board.papers.splice(i,i);
		}
	}
	/*
	for(var i = 0; i < user.board.stickies.length; i++) {
		if(user.board.stickies[i].item == task) {
			$('#'+user.board.stickies[i].uid).remove();
			user.board.stickies.splice(i,i);
		}
	}*/
	refreshAllPapers();
}

function sortTasksByDate() {
	var dateDict = new Array();
	
	for(var i = 0; i < user.organizer.length; i++) {
		var bucket = user.organizer[i];
		for(var j = 0; j < bucket.tasks.length; j++) {
			var task = bucket.tasks[j];
			if(task != null) {
				if(task.dueDate == null) {
					try{
						dateDict['99/99/9999'][dateDict['99/99/9999'].length] = task;
					} catch(err) {
						dateDict['99/99/9999'] = [task];
					}
				} else {
					var month = task.dueDate.getMonth()+1;
					var date = task.dueDate.getDate();
					var year = task.dueDate.getFullYear();
					
					var dayString = month + '/' + date + '/' + year;
					try{
						dateDict[dayString][dateDict[dayString].length] = task;
					} catch(err) {
						dateDict[dayString] = [task];
					}					
				}
			}
		}
	}
	dateDict = sortObj(dateDict);
	return dateDict;
}

function sortObj(arr){
	// Setup Arrays
	var sortedKeys = new Array();
	var sortedObj = {};

	// Separate keys and sort them
	for (var i in arr){
		sortedKeys.push(i);
	}
	sortedKeys.sort(mdyOrdA);

	// Reconstruct sorted obj based on keys
	for (var i in sortedKeys){
		sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
	}
	return sortedObj;
}

function mdyOrdA(a, b){
	var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
	a = a.replace(dateRE,"$3$1$2");
	b = b.replace(dateRE,"$3$1$2");
	if (a>b) return 1;
	if (a <b) return -1;
	return 0; 
}

function accountScreen() {
	$('#acctPaper').removeClass('hidden');
	
	$('#nameEntryUpdate').val(user.name);
	$('#emailUpdate').val(user.email);
}

function updateInfo() {
	$('#acctPaper').addClass('hidden');
	
	user.name = $('#nameEntryUpdate').val();
	user.email = $('#emailUpdate').val();
	
	$('#nameButton').val(user.name);
	$('#newPwdUpdate').val("");
	$('#pwdconfUpdate').val("");
}

function closeTempPaper(id) {
	$(id).remove();
}