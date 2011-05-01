/**
 * @author Becky
 */
$(document).ready(function() {
	
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
	
		user = new User('img/personIcon.png', "Alice Packer", "lisp@mit.edu")//usually gotten from backend
		user.organizer = or;
		maxZ = 0; // should get this and totalPapers from data from backend
		totalPapers = 0;
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
		  
		  var note = "<div class='taskSticky draggable resizable' onclick='moveToFront(\"#"+id+"\")' id='"+id+"' style=\"left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div class='stickyNote'>"+item.name+"</div>"
  			+"<div><img class='editStickyButton' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeTaskSticky('"+id+"','"+b+"','"+t+"')\">x</div></div>";
	} else { // Post a note sticky
		  var note = sticky.item;
		  var n = note.index;
		  var t = note.taskNo;
		  var b = note.bucketNo;
		  var id = 'b'+b+'t'+t+'n'+n+'s';
		  var noteId = '#b'+b+'t'+t+'n'+n;

		  var note = "<div class='sticky draggable resizable' onclick='moveToFront(\"#"+id+"\")' id='"+id+"' style=\"left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div class='stickyNote'>"+item.text+"</div>"
  			+"<div><img class='editStickyButton' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+id+"','"+b+"','"+t+"','"+n+"')\">x</div></div>";
	}
	$("#container").append(note);
	moveToFront(id);
	$(".draggable").draggable( {containment: "#container"} );
  	$(".resizable").resizable({aspectRatio: true});
}

function moveToFront(id) {
	maxZ = maxZ+1;
	$(id).css('z-index', String(maxZ));
}
function postPaper(paper) {
	var uid = paper.uid;
	var html =  "<div id='"+uid+"' class='draggable paper' onclick='moveToFront(\"#"+uid+"\")' style='top: "+paper.x+"px; left: "+paper.y+"px;'>"
	var trashcan = "<img src='img/trashcan.png' onclick='deleteItemFromPaper(\""+uid+"\")' style='top: 245px' class='editStickyButton'></img>"
	var xbutton = "<div style='height: 5%; padding-top: 3%; padding-right: 3%; width: 100%'><div style='padding-right: 1px; float: right; cursor: pointer;' onclick='closePaper(\""+uid+"\")'><b>x</b></div></div>"
	var textHolder = "<div class='textholder'><div class='leftBox'>";
	var titleBoxHTML = "<div class='topLeftBoxBucket' id='titleBox"+uid+"'>";
	var iconHTML = "<div> <img style='float: left' src='img/bucket.gif' class='bucketIcon icon' id='icon"+uid+"' onClick = 'toggleBox(\""+uid+"\")'></img></div>";
	var titleHTML = "<div> <textarea class='h2' class='bucketTitle' id='title"+uid+"' style='height: 100%' onkeyup = 'ifEnter(\"title"+uid+"\", event)'></textarea></div></div>";
	var notesBoxHTML = "<div id='notesBox"+uid+"' class='notesBox'></div>";
	html = html + xbutton + textHolder + titleBoxHTML + iconHTML + titleHTML + notesBoxHTML + "</div>";
	
	html = html + "<div class='rightBox'><div class='topRightBoxBucket' id='collabsTitle"+uid+"'><div style='float: left;'><h5 class='collabsTitle'><b>Collaborators</b></h5></div>";
	var collabsButtonHTML = "<img id='addCollabButton"+uid+"' onclick='toggleCollabsBox(\""+uid+"\")' src='img/plusButton.png' class='addCollabButton'></div>";
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
		$('#title'+uid).val(bucket.name);
	} else {
		task = paper.item;
		bucket = user.organizer[task.bucketNum];
		$('#title'+uid).val(task.name+' in Bucket '+bucket.name);
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
	if($('#collabsBox'+uid).hasClass('collabsView')) {
		$('#collabsBox'+uid).addClass('collabsAdd');
		$('#collabsBox'+uid).removeClass('collabsView');
	} else {
		$('#collabsBox'+uid).addClass('collabsView');
		$('#collabsBox'+uid).removeClass('collabsAdd');
		
		
	}
	//takes in a uid
	//changes + button to Done button or vice versa
	//deletes or adds collaborators-adding menu vs. collaborators-view
	//include creation of collaborators-view in postPaper
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
		
		var notes = "<div id='boxDiv"+paper.uid+"'><h4>Tasks</h4>"
			+"<textarea class='task new' "
        	+"style='float:left'"
	        + "id='textbox"+paper.uid+"'"
    	    + "rows='1' "
        	+ "onfocus=\"taskOrNoteFocus('"+paper.uid+"')\" "
	        + "onblur=\"taskBlur('"+paper.uid+"')\" "
    	    + "onkeyup=\"ifEnter('#textbox"+paper.uid+"', event)\">New Task</textarea>"
        	+ "<h4 id='dueLabel"+paper.uid+"' class='hidden' style='float:right; padding-right:5px'>Due</h4>"
			+ "<div class='divider'></div></div><div class='notesDiv' id='notesDiv"+paper.uid+"'></div>";
		
		$("#notesBox"+paper.uid).html(notes);
		
		refreshPaper(paper.uid);
	} else {
		paper.item = bucketObj;
		
		refreshPaper(paper.uid);		
	}
	
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
					+ "<div style='float:right'><img src='img/alarmclock.png' style='float:left; width:20px; height:auto;'></img>"
					+ "<input type='textbox' style='width: 7em; float:right;' class='date'></input>"
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
		
		refreshPaper(paper.uid);
	} else {
		paper.item = bucketObj;
		
		refreshPaper(paper.uid);		
	}
	
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
function collabFocus() {
	var id = '#collabInput';
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}

//This function is called whenever the newBucket section of the mytasks dropdown is blurred.
//it creates a new bucket on the dropdown.
function collabBlur(b, t) {
	var inp = '#collabInput';

	if ($(inp).val() == '' && $(inp).hasClass('new')) {
    	$(inp).text('Enter name');
    	$(inp).css('color', '#aaa');
	} 
	else if (t == "-1") {//set t to -1 if it's a bucket
		name = $(inp).val();
		addCollabToBucket(b, name);
    	//$(inp).removeClass('new');
		//name = $(inp).val();
		//var iconText = "<img src='img/personIcon.png' class='icon persona'></img>"
		//var xbutton = "<div style='color:#808080; cursor: pointer; float: right;'>x</div>"
	
		//$(inp).text('Enter name'); // reset input box
		//$(inp).css('color', '#aaa');
		//$(inp).addClass('new');
    	//$('#'+currentView.objName+"collabs").append("<div>"+iconText+name+xbutton+"</div>");
    } else{ // it's a task
    	name = $(inp).val();
		addCollabToTask(b, t, name);
    }
}

function addCollabToBucket(bucketNo, collabName) {
	bucket = user.organizer[parseInt(bucketNo)];
	var collabNo = bucket.collabs.length;
	bucket.collabs[collabNo] = collabName;
	addCollabToPaperView(collabName);
}

function addCollabToTask(bucketNo, taskNo, collabName) {
	bucket = user.organizer[parseInt(bucketNo)];
	task = bucket.tasks[parseInt(taskNo)];
	var collabNo = task.collabs.length;
	task.collabs[collabNo] = collabName;
	
	addCollabToPaperView(collabName);

}

function addCollabToPaperView(name) {
	var inp = '#collabInput';
	var iconText = "<img src='img/personIcon.png' class='icon persona'></img>"
	var xbutton = "<div style='color:#808080; float:right; cursor:pointer;'>x</div>"

	$(inp).text('Enter name'); // reset input box
	$(inp).css('color', '#aaa');
	$(inp).addClass('new');
   	$('#'+currentView.objName+"collabs").append("<div>"+iconText+name+xbutton+"</div>");
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
		$(taskbox).text('New Task');
		$(taskbox).css('color', '#aaa');
	} else {
		name = $(taskbox).val();
		var task = new Task(name, bucket.index, bucket.tasks.length);
		bucket.tasks[bucket.tasks.length] = task;
		refreshPaper(paperID);
	}
}

function addTaskToBucket(taskName, bucketNo) {
	var bucket = user.organizer[parseInt(bucketNo)];
	var taskNo = bucket.tasks.length;
	var task = new Task(taskName, parseInt(bucketNo), taskNo);
	bucket.tasks[taskNo] = task;
	
	refreshDropDown();
	//refreshPaper();
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
		refreshPaper(paperID);
	}
}

function addNoteToTask(noteText, taskNo, bucketNo) {
	var bucket = user.organizer[parseInt(bucketNo)];
	var task = bucket.tasks[parseInt(taskNo)];
	var noteNo = task.notes.length;
	task.notes[noteNo] = new Note(noteNo, noteText, task, bucket);
	
	//refreshPaper();
}


function addSticky(bucket, task, note) {
  var pos = getRandomPosition([96, 75])
  var id = 'b'+bucket+'t'+task+'n'+note+'s';
  var noteId = '#b'+bucket+'t'+task+'n'+note;
  var buttonId = '#b'+bucket+'t'+task+'n'+note+'i';
  var sticky = new Sticky()
  
  $(buttonId).attr("onclick", "");
  $(buttonId).css("opacity", "0.3");
  $(buttonId).css("filter", "alpha(opacity=30)");
  
  var note = "<div class='sticky draggable resizable' id='"+id+"' style=\"left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div class='stickyNote'>"+$(noteId).val()+"</div>"
  			+"<div><img class='editStickyButton' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+id+"','"+bucket+"','"+task+"','"+note+"')\">x</div></div>";
  $('#'+id).removeClass('hidden');
  $("#container").append(note);
  $(".draggable").draggable( {containment: "#container"} );
  $( ".resizable" ).resizable({aspectRatio: true});
}

function closeSticky(id, bucket, task, note) {
	$('#'+id).addClass('hidden');
	var buttonId = '#b'+bucket+'t'+task+'n'+note+'i';
	var clickFn = "addSticky('"+bucket+"', '"+task+"', '"+note+"')"
	$(buttonId).attr("onclick", clickFn);
  	$(buttonId).css("opacity", "1");
  	$(buttonId).css("filter", "alpha(opacity=100)");
}

function addTaskSticky(bucket, task) {
  var pos = getRandomPosition([96, 75])
  var id = 'b'+bucket+'t'+task+'s';
  var taskID = '#b'+bucket+'t'+task;
  var buttonId = '#b'+bucket+'t'+task+'i';
  $(buttonId).attr("onclick", "");
  $(buttonId).css("opacity", "0.3");
  $(buttonId).css("filter", "alpha(opacity=30)");
  var note = "<div class='taskSticky draggable resizable' id='"+id+"' style=\"left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div class='stickyNote'>"+$(taskID).val()+"</div>"
  			+"<div><img class='editStickyButton' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeTaskSticky('"+id+"','"+bucket+"','"+task+"')\">x</div></div>";
  $('#'+id).removeClass('hidden');
  $("#container").append(note);
  $(".draggable").draggable( {containment: "#container"} );
  $( ".resizable" ).resizable({aspectRatio: true});
}

function closeTaskSticky(id, bucket, task) {
	$('#'+id).addClass('hidden');
	var buttonId = '#b'+bucket+'t'+task+'i';
	var clickFn = "addTaskSticky('"+bucket+"', '"+task+"')"
	$(buttonId).attr("onclick", clickFn);
  	$(buttonId).css("opacity", "1");
  	$(buttonId).css("filter", "alpha(opacity=100)");
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

	var helpTitle = "<h3 style='padding:15px' > How can we help you? </h3>"
	var helpPaper = "<div id='helpPaper' class='draggable paper'>"
			+helpTitle
			+"<div class='xbuttonPaper' onclick=\"closePaper('helpPaper')\">x</div>"
			+"</div>";
	$('#container').append(helpPaper);
	$(".draggable").draggable( {containment: "#container"} );

}

function logout() {
	if($('#nameEntry').val()!="") {
		$('#nameButton').attr("value", $('#nameEntry').val());
	}
	$('#welcomeHolder').removeClass('hidden');
	$('#accountCreate').addClass('hidden');
	$('#bottomBar').addClass('hidden');
	$('#dropDownBar').addClass('hidden');
	$('#enterScreen').addClass('hidden');
	//$('#textHolder').addClass('hidden');
	
	
	for(i=0; i<visiblePapers.length;i++) {
		$('#'+visiblePapers[i]).addClass('hidden');
	}
	
	$('#enterPaper').removeClass('hidden');
}

function refreshPaper(paperID) {
	var paper = getPaperFromID(paperID);
	refreshDropDown();
	
	var uid = paper.uid;
	if(paper.type == "bucket") {
		var bucket = paper.item;
		$('#title'+uid).val(bucket.name);
		$('#icon'+uid).attr('src', 'img/bucket.gif')
		$('#titleBox'+uid).addClass('topLeftBoxBucket');
		$('#titleBox'+uid).removeClass('topLeftBoxTask');
		$('#collabsTitle'+uid).addClass('topLeftBoxBucket');
		$('#collabsTitle'+uid).removeClass('topLeftBoxTask');	
		var html = ''; 
		var dueDate =[];
		for(i = 0; i < bucket.tasks.length; i++){
				var task = bucket.tasks[i];
				if(task != null) {
				$("#dueLabel"+paper.uid).removeClass('hidden');
				var name = task.name;
				var stringTask = "user.organizer["+task.bucketNum+"].tasks["+i+"]";
				var entry = "<div style='width: 100%; float: left'>";
				var newIcon = "<div style='float: left'><img src=\"img/addStickyIconGreen copy.gif\""
		        	+ "id='icon"+i+paper.uid+"'"
		        	+ "class='stickyButton' "
		        	+ "onclick=\"postSticky(new Sticky(getRandomPosition([96, 75]), maxZ, [96, 75], 'task',"+stringTask+"))\"> </img>"//\"addTaskSticky('"+bucket.index+"', '"+i+"')\"></img>";
		        if(task.done) {
		        	src = 'img/checkbox-full.png';
		        } else {src ='img/checkbox-empty.png';}
		        var checkbox = "<img id='itemCheck"+i+paper.uid+"' src='"+src+"' class='checkBoxIcon' style='float:left'></input>"
				//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
				rows = Math.ceil(name.length/22);
				
				try {
					dueDate[i] = $('#dateTexti'+i+uid).datepicker('getDate').getDate();
				} catch(err) {
					dueDate[i] = null;
				}
				
		    	var newText = "<textarea class='task fixed' "
		        	+ "id='text"+i+uid+"'"
					+"ondblclick='changePaperFocus("+bucket.index+","+i+",\""+uid+"\")'"
					+"rows='"+String(rows)+"' "
					+"style='float:left;'>"
		        	+name+"</textarea></div>"
		         	+"<div style='float: right; width: 65px;'>"
		        	+"<input id='dateTexti"+i+uid+"' class='hidden date' type='textbox' style='float: right; width:0px; padding:0px; margin:0px; border: 0px;'/>"
		        	+"<img src='img/EditObjectButton.png' onclick='alert(\"hi2\")' class='icon' style='float: right'></img></div>";
		                             //+"<input type='textbox' style='width: 0px; height=0px; float:right;' class='date' id='datepicker"+currentTask+"'><br>";
		        var exit = "</div>";
		        html = html + entry + newIcon + checkbox + newText + exit;
	        }
		}
		$('#textbox'+uid).text('New Task');
		$('#textbox'+uid).css('color', '#aaa');
		$('#textbox'+uid).onkeyup="ifEnter('#textbox"+paper.uid+"', event)";
    	$('#notesDiv'+uid).html(html);
		for(i=0;i<bucket.tasks.length;i++){    	
	    	if(dueDate[i] != null) {
		    	//var src = 'img/calendar_icon.gif';
	    		var src='img/cals/cal'+dueDate[i]+'.gif';
		    } else {
		    	var src = 'img/calendar_icon.gif';
		    }
			$("#dateTexti"+i+uid).datepicker({ showOn: 'button', buttonImageOnly: true, buttonImage: src });
		}

	} else {
		$("#dueLabel"+paper.uid).addClass('hidden');
		var task = paper.item;
		var bucket = user.organizer[task.bucketNum];
		$('#title'+uid).val(task.name+' in Bucket '+bucket.name);
		$('#titleBox'+uid).removeClass('topLeftBoxBucket');
		$('#titleBox'+uid).addClass('topLeftBoxTask');
		$('#collabsTitle'+uid).removeClass('topLeftBoxBucket');
		$('#collabsTitle'+uid).addClass('topLeftBoxTask');	
		if(task.done == true) {
			$('#icon'+uid).attr('src', 'img/checkbox-full.png')	
		} else{
			$('#icon'+uid).attr('src', 'img/checkbox-empty.png')	
		}
		
		html='';
		
		for(i = 0; i < task.notes.length; i++){
			var note = task.notes[i];
			var name = note.text;
		
			var entry = "<div style='width: 100%; float: left'>";
			var newIcon = "<div style='float: left; width: 80%;'><img src=\"img/addStickyIcon.gif\""
						+ "id='icon"+i+paper.uid+"'" 
						+ "class='stickyButton' " 
						+ "onclick=\"addSticky('"+task.bucketNum+"','"+task.index+"','"+i+"')\"></img>";
														 
			//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
			rows = Math.ceil(name.length/22);
	    	var newText = "<textarea class='note fixed' rows='"+rows+"' style='float:left; width: 200px;'" 
						+"id='text"+i+uid+"'" +">" 
						+name+"</textarea></div>"
						+"<div style='float: right; width: 20%;'>"
							+"<img src='img/reorder.png' class='checkBoxIcon' style='float: left;'></img>"
							+"<img src='img/alert_icon.gif' class='menu_class alertMenus checkBoxIcon' style='float: right;'>"
						//+"<ul class='the_menu menu5' style='float: right;'></div>"
						//+ "<li><textarea class='new collab' onfocus='collabFocus()'>Enter name</textarea></li></ul>"
						+"</img></div>";
	                             //+"<input type='textbox' style='width: 0px; height=0px; float:right;' class='date' id='datepicker"+currentTask+"'><br>";
	        var exit = "</div>";
	        
	        html = html + entry + newIcon + newText + exit;	
		}
		
		$('#textbox'+uid).text('New Note');
		$('#textbox'+uid).css('color', '#aaa');
		$('#textbox'+uid).onkeyup="ifEnter('#textbox"+paper.uid+"', event)";
    	$('#notesDiv'+uid).html(html);
		
	}
	
}

function changePaperFocus(bucketNum, taskNum, paperID) {
	var bucket=user.organizer[bucketNum];
	if(taskNum != null) {
		var task = bucket.tasks[taskNum];
		
		var paper = getPaperFromID(paperID);
		
		paper.item = task;
		paper.type = 'task';
		$('#textbox'+paper.uid).blur(function() {
	  		noteBlur(paperID);
		});
	} else { // this is where you change it BACK to a bucket
		var paper = getPaperFromID(paperID);
		paper.item = bucket;
		paper.type = 'bucket';
		$('#textbox'+paper.uid).blur(function() {
	  		taskBlur(paperID);
		});
	}
		
	refreshPaper(paperID);
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
				ul = ul + "<div><img id='b"+i+"expand' class='expandButton' style='float: left; width: 17px; height: 17px; ' src='img/reorder.png'></img></div>";
				ul = ul + "<div onclick = 'addBucketToPaper("+i+", null)'>"+bucketName+"</div>";
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
						ul = ul + "<img id='dropDownCheckb"+i+"t"+j+"' src='"+src+"' class='checkBoxIcon' style='float:left'></input>";
						ul = ul + "<div style='width: 12em; height:auto;' onclick='addTaskToPaper("+i+", "+j+")'>"+taskName+"</div>"
					}
				}
				
				ul = ul + "</div></li>"
			}
		text = text + ul;	
	}
	$('#tasksMenu').html(text);
}

function refreshBoard() {
	bd = user.board;
	for(i = 0; i < bd.stickies.length; i++) {
		postSticky(bd.stickies[i]);
	}
	
	for(i = 0; i < bd.papers.length; i++) {
		postPaper(bd.papers[i]);
	}
}

function getPaperFromID(paperID) {
	for(i = 0; i < user.board.papers.length; i++) {
		if(paperID == user.board.papers[i].uid) {
			var paper = user.board.papers[i];
		}
	}
	return paper;
}
