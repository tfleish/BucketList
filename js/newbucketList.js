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
	
	$('#addCollabButton').click(function() {
		$('ul.menu4').slideToggle('fast');
	});
	
	$('.alertMenus').click(function() {
		$('ul.menu5').slideToggle('fast');
	})
	
	$( "#accordion" ).accordion();
	
});
 

function enterBucketList() {

	if($('#nameEntry').val()!="") {
		$('#nameButton').attr("value", $('#nameEntry').val());
	}
	
	$('#nameEntry').val("");
	$('#usernameEnter').val("");
	$('#passwordEnter').val("");
	
	$('#welcomeHolder').addClass('hidden');
	$('#accountCreate').addClass('hidden');
	$('#bottomBar').removeClass('hidden');
	$('#dropDownBar').removeClass('hidden');
	$('#enterScreen').removeClass('hidden');
}

function createAccount() {
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
function addBucketToPaper(bucket) {
	var bucketObj = organizer[bucket]; // get Bucket object
	currentView = bucketObj;
	
	var name = bucketObj.name;
	$("#paperTitle").html(name); // Set the title of the paper
	$('#enterScreen').addClass('hidden');
	$('#textHolder').removeClass('hidden'); // Make the paper appear, if it is currently invisible
	$("#bucketIcon").removeClass('hidden'); // Set icon in corner (will be different for buckets/tasks)
	$("#bucketIcon").attr('src', "img/bucket.gif")

	var collabs = bucketObj.collabs;
	
	//notes is the HTML for the notes section of the textbox.
	//id of notes is assigned as b(bucketNumber)t.
	//id of taskbox is b(bucketNumber)taskBox
	//we add just the one New Task line
	var notes = "<div id='b"+bucket+"t' class='noteBox'>"
							+ "<h4>Tasks</h4>"
              + "<textarea class='new task' "
              				+"style='float:left'"
                           + "id='b"+bucket+"taskBox'"
                           + "onfocus=\"taskFocus('"+bucket+"')\" "
                           + "onblur=\"taskBlur('"+bucket+"')\" "
                           + "onkeyup=\"ifEnter('#b"+bucket+"taskBox', event)\">New Task</textarea>"
                + "<h4 id='dueLabel' class='hidden' style='float:right; padding-right:5px'>Due</h4>"
				+ "<div class='divider'></div></div>";
				
	//id of overall div is b(bucketNumber)c
	//id of section holding collabs is b(bucketNumber)collabs
	var collabsList = "<div id='b" + bucket + "c' class='hiddenFloat'>"
					+ "<div id='b"+bucket+"collabs' class='collabsBox'>"+String(collabs)+"</div></div>";

  $("#bottomLeftBox").html(notes);
  $("#bottomRightBox").html(collabsList);

}

//Will be to toggle checkbox next to Task name
function toggleBox() {
	if($("#bucketIcon").attr('src')=="img/checkbox-empty.png"){
		$("#bucketIcon").attr('src', "img/checkbox-full.png")
	} else if($("#bucketIcon").attr('src')=="img/checkbox-full.png"){
		$("#bucketIcon").attr('src', "img/checkbox-empty.png");
	}
}

//This function is called whenever we want to add a Task View to the paper
//Takes in the number of the bucket and the number of the task.
function addTaskToPaper(b, t) {
	var task = organizer[b].tasks[t]; // Get task from organizer
	name = task.name;
	currentView = task;
	
	$("#paperTitle").text(name); // Set the title of the paper
	$('#enterScreen').addClass('hidden');
	$('#paperHolder').removeClass('hidden');
	$('#textHolder').removeClass('hidden'); // Make the paper appear, if it is currently invisible
	$("#bucketIcon").removeClass('hidden'); // Set icon in corner (will be different for buckets/tasks)
	
	$("#bucketIcon").attr('src', "img/checkbox-empty.png");

	var collabs=task.collabs;
	
	//notes contains the HTML of the notes section.
	//id of outer div is b(bucketNum)t(taskNum)n
	//id of noteBox is b(bucketNum)t(taskNum)noteBox
	var notes = "<div id='b"+b+"t"+t+"n' class='noteBox'>"
							+ "<div><h4 style='float: left;'>Notes</h4>"
							+ "<div style='float:right'><img src='img/alarmclock.png' style='float:left; width:20px; height:auto;'></img>"
							+ "<input type='textbox' style='width: 7em; float:right;' class='date'></input>"
							+ "</div></div>"
              + "<textarea class='new note'"
                           + "id='b"+b+"t"+t+"noteBox'"
                           + "onfocus=\"noteFocus('"+b+"','"+t+"')\" "
                           + "onblur=\"noteBlur('"+b+"','"+t+"')\" "
                           + "onkeyup=\"ifEnter('#b"+b+"t"+t+"noteBox', event)\">New Note</textarea><br>"
				+ "<div class='divider'></div></div>";
				
	//id of outer div is b(bucketNum)t(taskNum)c
	//id of collabs box is b(bucketNum)t(taskNum)collabs
	var collabs = "<div id='b"+b+"t"+t+"c' class='hiddenFloat'>"
					+ "<div id='b"+b+"t"+t+"collabs' class='collabsBox'></div></div>";
	$( ".date" ).datepicker();
  $("#bottomLeftBox").html(notes);
  $("#bottomRightBox").html(collabs);

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
function bucketBlur(bucket) {
	var inp = '#bucketInput';
  var newBucketNum = parseInt(bucket);
  var newBucket = 'b'+newBucketNum;
	var newBucketID = '#'+newBucket;
	
	//If the bucket has no text still, don't create a new bucket out of it.
  if ($(inp).val() == '' && $(inp).hasClass('new')) {
    $(inp).text('New Bucket');
    $(inp).css('color', '#aaa');
  } //else, create new bucket
  else if ($(inp).hasClass('new')) {
		nBuckets = nBuckets+1;
    $(inp).removeClass('new');
		name = $(inp).val();
		var bucketObj = new Bucket(name, newBucketNum); // create a new Bucket object
		organizer[parseInt(bucket)]=bucketObj; // and add it to the organizer
		var newBucket = "<li>"
						+"<img id='b"+newBucketNum+"expand' class='expandButton' style='float:left' src='img/plus_green.gif' onclick=\"toggleAccordion('"+newBucketNum+"')\"></img>"
						+"<div onclick=\"addBucketToPaper("+newBucketNum+")\">"+name+"</div>"
						+"<div id='b"+newBucketNum+"accordion' class='hidden' style='position:absolute'>"
						+"</div>"
						+"</li>"
		
		"<li onclick='addBucketToPaper("+newBucketNum+")'>"+name+"</li>"; // append to dropdown list
		$(inp).text('New Bucket'); // reset input box
		$(inp).css('color', '#aaa');
		$(inp).addClass('new');
		$(inp).onkeyup="ifEnter("+newBucketID+", event)";
    $('#tasksMenu').append(newBucket);
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
	bucket = organizer[parseInt(bucketNo)];
	var collabNo = bucket.collabs.length;
	bucket.collabs[collabNo] = collabName;
	addCollabToPaperView(collabName);
}

function addCollabToTask(bucketNo, taskNo, collabName) {
	bucket = organizer[parseInt(bucketNo)];
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
function taskFocus(bucket) {
  var id = '#b'+bucket+'taskBox';
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}

//Called when tasks are blurred in BucketView
function taskBlur(bucket) {
	var taskbox = '#b'+bucket+'taskBox'; // Input taskbox for the relevant bucket
	var currentTaskNum=organizer[parseInt(bucket)].tasks.length; // get number of next task on list from organizer
	var currentTask = 'b'+bucket+'t'+currentTaskNum;
	var currentTaskIcon = 'b'+bucket+'t'+currentTaskNum+'i';
	
	if($(taskbox).val() == '' && $(taskbox).hasClass('new')) { // if the text is empty, don't actually create new task.
		$(taskbox).text('New Task');
		$(taskbox).css('color', '#aaa');
	}
	else if ($(taskbox).hasClass('new')) {
		$('#dueLabel').removeClass('hidden')
		name = $(taskbox).val();
		addTaskToBucket(name, bucket);
				
		//new sticky icon with id b(bucketNum)t(taskNum)i
		var newIcon = "<img src=\"img/addStickyIconGreen copy.gif\""
                           + "id='"+currentTaskIcon+"'"
                           + "class='stickyButton' "
                           + "onclick=\"addTaskSticky('"+bucket+"', '"+String(currentTaskNum)+"')\"></img>";
        var checkbox = "<input type='checkbox' style='float:left'></input>"
													 
		//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
		rows = Math.ceil(name.length/12);
    	var newText = "<textarea class='task fixed' "
                             + "id='" + currentTask +"'"
							 +"onclick='addTaskToPaper("+bucket+","+currentTaskNum+")'"
							 +"rows='"+String(rows)+"' "
							 +"style='float:left;'>"
                             +name+"</textarea>"
                             +"<input type='textbox' style='width: 7em; float:right;' class='date' id='datepicker"+currentTask+"'><br>";
		
		$( ".date" ).datepicker();
		
		//reset taskbox
		$(taskbox).text('New Task');
		$(taskbox).css('color', '#aaa');
		$(taskbox).onkeyup="ifEnter('#b"+bucket+"taskBox, event)";
    $('#b'+bucket+'t').append("<div style='float: left'>"+newIcon+checkbox+newText+"</div>");

	}
}

function addTaskToBucket(taskName, bucketNo) {
	var bucket = organizer[parseInt(bucketNo)];
	var taskNo = bucket.tasks.length;
	var task = new Task(taskName, organizer[parseInt(bucketNo)], taskNo);
	bucket.tasks[taskNo] = task;
	
	refreshDropDown();
	//refreshPaper();
}

function noteFocus(bucket, task) {
  var id = '#b'+bucket+'t'+task+'noteBox';
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}

//called when a note is blurred in TaskView
function noteBlur(bucket, task) {
	var notebox = '#b'+bucket+'t'+task+'noteBox'; // Input notebox for the relevant task
	var currentNoteNum=organizer[parseInt(bucket)].tasks[parseInt(task)].notes.length; // get number of next task on list from organizer
	var currentNote = 'b'+bucket+'t'+task+'n'+String(currentNoteNum);
	var currentNoteIcon = currentNote+'i';
	
	if ($(notebox).val() == '' && $(notebox).hasClass('new')) { // if the text is empty, don't actually create new task.
			$(notebox).text('New Task');
			$(notebox).css('color', '#aaa');
		}
	else if ($(notebox).hasClass('new')) {
			name = $(notebox).val();
			addNoteToTask(name, task, bucket);
			
			$(notebox).removeClass('new');
			//new sticky icon with id b(bucketNum)t(taskNum)i
			var newIcon = "<img src=\"img/addStickyIcon.gif\""
						+ "id='" + currentNoteIcon + "'" 
						+ "class='stickyButton' " 
						+ "onclick=\"addSticky('"+bucket+"','"+task+"','"+String(currentNoteNum) +"')\"></img>";
		
			//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
			var newText = "<textarea class='note' " 
						+"id='"+currentNote +"'" +">" 
						+name+"</textarea>"
						+"<img src='img/alert_icon.gif' class='menu_class alertMenus' style='float: right; width:7%; height:auto;'>"
						+"<ul class='the_menu menu5' style='float: right;'>"
						+ "<li><textarea class='new collab' onfocus='collabFocus()'>Enter name</textarea></li></ul>"
						+"</input><br>";
			
			//reset taskbox
			$(notebox).text('New Note');
			$(notebox).css('color', '#aaa');
			$(notebox).addClass('new');
			$(notebox).onkeyup = "ifEnter('#b" + bucket + "t" + task + "noteBox, event)";
			$('#b'+bucket+'t'+task+'n').append(newIcon + newText);
	}
}

function addNoteToTask(noteText, taskNo, bucketNo) {
	var bucket = organizer[parseInt(bucketNo)];
	var task = bucket.tasks[parseInt(taskNo)];
	var noteNo = task.notes.length;
	task.notes[noteNo] = new Note(noteText, task, bucket);
	
	//refreshPaper();
}


function addSticky(bucket, task, note) {
  var pos = getRandomPosition()
  var id = 'b'+bucket+'t'+task+'n'+note+'s';
  var noteId = '#b'+bucket+'t'+task+'n'+note;
  var buttonId = '#b'+bucket+'t'+task+'n'+note+'i';
  $(buttonId).attr("onclick", "");
  $(buttonId).css("opacity", "0.3");
  $(buttonId).css("filter", "alpha(opacity=30)");
  var note = "<div class='sticky draggable' id='"+id+"' style=\"left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div class='stickyNote'>"+$(noteId).val()+"</div>"
  			+"<div><img class='editStickyButton' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeSticky('"+id+"','"+bucket+"','"+task+"','"+note+"')\">x</div></div>";
  $('#'+id).removeClass('hidden');
  $("#container").append(note);
  $(".draggable").draggable( {containment: "#container"} );
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
  var pos = getRandomPosition()
  var id = 'b'+bucket+'t'+task+'s';
  var taskID = '#b'+bucket+'t'+task;
  var buttonId = '#b'+bucket+'t'+task+'i';
  $(buttonId).attr("onclick", "");
  $(buttonId).css("opacity", "0.3");
  $(buttonId).css("filter", "alpha(opacity=30)");
  var note = "<div class='taskSticky draggable' id='"+id+"' style=\"left:"+pos[1]+"px; top: "+pos[0]+"px;\">"
  			+"<div class='stickyNote'>"+$(taskID).val()+"</div>"
  			+"<div><img class='editStickyButton' src='img/EditObjectButton.png'></img>"
  			+"<div class='xbutton' onclick=\"closeTaskSticky('"+id+"','"+bucket+"','"+task+"')\">x</div></div>";
  $('#'+id).removeClass('hidden');
  $("#container").append(note);
  $(".draggable").draggable( {containment: "#container"} );
}

function closeTaskSticky(id, bucket, task) {
	$('#'+id).addClass('hidden');
	var buttonId = '#b'+bucket+'t'+task+'i';
	var clickFn = "addTaskSticky('"+bucket+"', '"+task+"')"
	$(buttonId).attr("onclick", clickFn);
  	$(buttonId).css("opacity", "1");
  	$(buttonId).css("filter", "alpha(opacity=100)");
}

function getRandomPosition() {
	var position = $('#paperHolder').position()
	var paperTop = position.top;
	var paperBottom = $('#paperHolder').height() + position.top;
	var paperLeft = position.left;
	var paperRight = $('#paperHolder').width() + position.left;
	
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	
	var stickyWidth = 75//$('.sticky').width();
	var stickyHeight = 96//$('.sticky').height();
	
	function getRandomHeight() {
		var ht=Math.floor(Math.random()*screenHeight);
		if ((ht + stickyHeight > screenHeight)) {
			return getRandomHeight();
		} else {
			return ht;
		}
	}

	ht = getRandomHeight();
	
	function getRandomWidth() {
		var wid=Math.floor(Math.random()*screenWidth);
		if ((wid + stickyWidth > screenWidth) || ((paperLeft<wid + stickyWidth) && (wid + stickyWidth<paperRight) && (paperTop<ht + stickyHeight) && (ht + stickyHeight<paperBottom)) || ((paperLeft<wid) && (wid<paperRight) && (paperTop<ht) && (ht<paperBottom))) {
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
}

function closePaper(id) {
	$('#'+id).addClass('hidden');
	for(i=0; i<visiblePapers.length; i++) {
		if (visiblePapers[i] == id) {
			delete visiblePapers[i];
		}
	}
}

function help() {
	//create new paper, add it to container div
	ind = findIndex("helpPaper", totalPapers);
	visInd = findIndex("helpPaper", visiblePapers);
	
	if (ind == -1) {
		totalPapers[totalPapers.length+1] = "helpPaper";
		visiblePapers[visiblePapers.length+1]="helpPaper";
	} else if(visInd == -1) {
		visiblePapers[visiblePapers.length+1]="helpPaper";
		$('#helpPaper').removeClass('hidden');
		return;
	} else {
		return;
	}
	
	var helpTitle = "<h3 style='padding:15px' > How can we help you? </h3>"
	var helpPaper = "<div id='helpPaper' class='draggable paper'>"
			+helpTitle
			+"<div class='xbuttonPaper' onclick=\"closePaper('helpPaper')\">x</div>"
			+"</div>";
	$('#container').append(helpPaper);
	$(".draggable").draggable( {containment: "#container"} );

}

function findIndex(item, arr) {
	var idx;
	var last = arr.length;
	for (var i = 0; i < last; i++) {
		idx = (item == arr[i])?i:-1;
		if (-1 != idx) break;
	}
	return idx;
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
	$('#textHolder').addClass('hidden');
	
	
	for(i=0; i<visiblePapers.length;i++) {
		$('#'+visiblePapers[i]).addClass('hidden');
	}
	
	$('#paperHolder').removeClass('hidden');
}

function refreshPaper() {
	var bucket;
	var task;
	var note;
	var bucketCollabs;
	var taskCollabs;
	
	for(i = 0; i < organizer.length; i ++) {
		bucket = organizer[i];
		bucketCollabs = bucket.collabs;
		for(j = 0; j < bucket.tasks.length; j++) {
			task = bucket.tasks[j];
			taskCollabs = task.collabs;
			for(k = 0; k < task.notes.length; k++) {
				note = task.notes[k];
			}
		}
	}

}

function refreshDropDown() {
	var bucket;
	var task;
	var bucketName;
	var taskName;
	var inputBoxHTML = "<li><textarea id='bucketInput' class='new bucket' onfocus='bucketFocus(nBuckets)' onblur='bucketBlur(nBuckets)' "
					+"onkeyup='ifEnter(\"#bucketInput\", event)'>New Bucket</textarea></li>"
	var text = inputBoxHTML;
	for(i = 0; i < organizer.length; i ++) {
		var ul = "<li>"
		bucket = organizer[i];
		bucketName = bucket.name;
		ul = ul + "<div><img id='b"+i+"expand' class='expandButton' style='float: left;' src='img/plus_green.gif' onclick='toggleAccordion("+i+")'></img></div>";
		ul = ul + "<div onclick = 'addBucketToPaper("+i+")'>"+bucketName+"</div>";
		ul = ul + "<div id='b"+i+"accordion' class='hidden' style='position:absolute'>";
		for(j = 0; j < bucket.tasks.length; j++) {
			task = bucket.tasks[j];
			taskName = task.name;
			ul = ul + "<input type='checkbox' style='float:left'></input>";
			ul = ul + "<div onclick='addTaskToPaper("+i+", "+j+")'>"+taskName+"</div>"
		}
		ul = ul + "</div></li>"
		
		text = text + ul;	
	}
	$('#tasksMenu').html(text);
}
