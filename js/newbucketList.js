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
	
 });
 
 
// This function is called whenever we open a Bucket View on a paper
// Takes in the organizer index of a Bucket object.
function addBucketToPaper(bucket) {
	var bucketObj = organizer[parseInt(bucket)]; // get Bucket object
	var name = bucketObj.name;
	$("#paperTitle").text(name); // Set the title of the paper
	$('#paperHolder').removeClass('hidden'); // Make the paper appear, if it is currently invisible
	$("#bucketIcon").removeClass('hidden'); // Set icon in corner (will be different for buckets/tasks)
	$("#bucketIcon").attr('src', "img/bucket.gif")

	var collabs = bucketObj.collabs;
	
	//notes is the HTML for the notes section of the textbox.
	//id of notes is assigned as b(bucketNumber)t.
	//id of taskbox is b(bucketNumber)taskBox
	//we add just the one New Task line
	var notes = "<div id='b"+bucket+"t' class='hiddenFloat'>"
							+ "<h5 style='float:left'>Tasks</h5>"
							+ "<h5 style='float:right; padding-right:5px'>Due</h5>"
              + "<textarea class='new task'"
                           + "id='b"+bucket+"taskBox'"
                           + "onfocus=\"taskFocus('"+bucket+"')\" "
                           + "onblur=\"taskBlur('"+bucket+"')\" "
                           + "onkeypress=\"ifEnter('#b"+bucket+"taskBox', event)\">New Task</textarea><br>"
				+ "<div class='divider'></div></div>";
				
	//id of overall div is b(bucketNumber)c
	//id of section holding collabs is b(bucketNumber)collabs
	var collabs = "<div id='b" + bucket + "c' class='hiddenFloat'>"
					+ "<div id='b"+bucket+"collabs' class='collabsBox'>"+String(collabs)+"</div></div>";

  $("#bottomLeftBox").html(notes);
  $("#bottomRightBox").html(collabs);

}

//Will be to toggle checkbox next to Task name
function toggleBox() {
	if($("#bucketIcon").attr('src')=="img/checkbox-empty.png"){
		$("#bucketIcon").attr('src', "img/checkbox-full.png")
	} else{
		$("#bucketIcon").attr('src', "img/checkbox-empty.png");
	}
}

//This function is called whenever we want to add a Task View to the paper
//Takes in the number of the bucket and the number of the task.
function addTaskToPaper(b, t) {
	var task = organizer[b].tasks[t]; // Get task from organizer
	$("#paperTitle").text(task.name);

	var collabs=task.collabs;
	
	//notes contains the HTML of the notes section.
	//id of outer div is b(bucketNum)t(taskNum)n
	//id of noteBox is b(bucketNum)t(taskNum)noteBox
	var notes = "<div id='b"+b+"t"+t+"n' class='hiddenFloat'>"
							+ "<h5>Notes</h5>"
              + "<textarea class='new note'"
                           + "id='b"+b+"t"+t+"noteBox'"
                           + "onfocus=\"noteFocus('"+b+"','"+t+"')\" "
                           + "onblur=\"noteBlur('"+b+"','"+t+"')\" "
                           + "onkeypress=\"ifEnter('#b"+b+"t"+t+"noteBox', event)\">New Note</textarea><br>"
				+ "<div class='divider'></div></div>";
				
	//id of outer div is b(bucketNum)t(taskNum)c
	//id of collabs box is b(bucketNum)t(taskNum)collabs
	var collabs = "<div id='b"+b+"t"+t+"c' class='hiddenFloat'>"
					+ "<div id='b"+b+"t"+t+"collabs' class='collabsBox'>"+collabs[(b%2)]+"</div></div>";

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
		var bucketObj = new Bucket(name); // create a new Bucket object
		organizer[parseInt(bucket)]=bucketObj; // and add it to the organizer
		var newBucket = "<li onclick='addBucketToPaper("+String(newBucketNum)+",\""+name+"\")'>"+name+"</li>"; // append to dropdown list
		$(inp).text('New Bucket'); // reset input box
		$(inp).css('color', '#aaa');
		$(inp).addClass('new');
		$(inp).onkeypress="ifEnter("+newBucketID+", event)";
    $('#tasksMenu').append(newBucket);
  }
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
		$(taskbox).removeClass('new');		
		name = $(taskbox).val();
		var taskObj = new Task(name, organizer[parseInt(bucket)]);
		organizer[parseInt(bucket)].tasks[currentTaskNum]=taskObj; // add to organizer
		
		//new sticky icon with id b(bucketNum)t(taskNum)i
		var newIcon = "<img src=\"img/addStickyIcon.gif\""
                           + "id='"+currentTaskIcon+"'"
                           + "class='stickyButton' "
                           + "onclick=\"addTaskSticky('"+bucket+"', '"+String(currentTaskNum)+"')\"></img>";
													 
		//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
    var newText = "<textarea class='note' "
                             + "id='" + currentTask +"'"
														 +"onclick='addTaskToPaper("+bucket+","+String(currentTaskNum)+")'>"
                             +name+"</textarea><br>";
		
		//reset taskbox
		$(taskbox).text('New Task');
		$(taskbox).css('color', '#aaa');
		$(taskbox).addClass('new');
		$(taskbox).onkeypress="ifEnter('#b"+bucket+"taskBox, event)";
    $('#bottomLeftBox').append(newIcon+newText);

	}
}

//called when a note is focused in TaskView
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
		else 
			if ($(notebox).hasClass('new')) {
				var inBucket = organizer[parseInt(bucket)];
				var inTask = organizer[parseInt(bucket)].tasks[parseInt(task)];
				$(notebox).removeClass('new');
				name = $(notebox).val();
				var noteObj = new Note(name, inTask, inBucket);
				inTask.notes[currentNoteNum] = noteObj; // add to organizer
				//new sticky icon with id b(bucketNum)t(taskNum)i
				var newIcon = "<img src=\"img/addStickyIcon.gif\""
							+ "id='" + currentNote + "'" 
							+ "class='stickyButton' " 
							+ "onclick=\"addSticky('"+bucket+"','"+task+"','"+String(currentNoteNum) +"')\"></img>";
				
				//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
				var newText = "<textarea class='note' " 
							+"id='"+currentNote +"'" +">" 
							+name+"</textarea><br>";
				
				//reset taskbox
				$(notebox).text('New Note');
				$(notebox).css('color', '#aaa');
				$(notebox).addClass('new');
				$(notebox).onkeypress = "ifEnter('#b" + bucket + "t" + task + "noteBox, event)";
				$('#bottomLeftBox').append(newIcon + newText);
			}
}

function addSticky(bucket, task, note) {
  var id = 'b'+bucket+'t'+task+'n'+note+'s';
  var noteId = '#b'+bucket+'t'+task+'n'+note;
  var buttonId = '#b'+bucket+'t'+task+'i'+note;
  $(buttonId).attr("onclick", "");
  $(buttonId).css("opacity", "0.3");
  $(buttonId).css("filter", "alpha(opacity=30)");
  var note = "<div class='sticky draggable resizable' id='"+id+"'><textarea class='stickyNote'>"+$(noteId).val()+"</textarea></div>";
  $("#container").append(note);
  $(".draggable").draggable( {containment: "#container"} );
}

function addTaskSticky(bucket, task) {
  var id = 'b'+bucket+'t'+task+'s';
	var taskID = '#b'+bucket+'t'+task;
  var buttonId = '#b'+bucket+'t'+task+'i';
  $(buttonId).attr("onclick", "");
  $(buttonId).css("opacity", "0.3");
  $(buttonId).css("filter", "alpha(opacity=30)");
  var note = "<div class='sticky draggable resizable' id='"+id+"'><textarea class='stickyNote'>"+$(taskID).val()+"</textarea></div>";
  $("#container").append(note);
  $(".draggable").draggable( {containment: "#container"} );
}

function addTaskToInfo(bucket, task, name) {
  var notes = "<div id='b"+bucket+"t"+task+"n' class='hiddenFloat'>"
              + "<h3 id='b"+bucket+"t"+task+"name' style='margin: 10px'> Information about " + name + "</h3>"
              + "<img src=\"img/addStickyIcon.gif\" "
                         + "id='b"+bucket+"t"+task+"i1' "
                         + "class='stickyButton hidden' "
                         + "onclick=\"addSticky('"+bucket+"', '"+task+"', '1')\"></img>"
              
              + "<textarea class='new note'"
                           + "id='b"+bucket+"t"+task+"n1'"
                           + "onfocus=\"noteFocus('"+bucket+"', '"+task+"', '1')\" "
                           + "onblur=\"noteBlur('"+bucket+"', '"+task+"', '1')\""
                           + "onkeypress=\"ifEnter('#b"+bucket+"t"+task+"n1', event)\">New Note</textarea><br>"
						   +"<div class='divider'></div></div>";
	
	var collabs = "<div id='b" + bucket + "t"+task+"c' class='hiddenFloat'>"
					+ "<div style='margin: 10px'><b>Collaborators</b>"
					+ "<button type='button' style='float:right' "
					+ "onclick='addCollaborator("+bucket+","+task+")'>Add</button></div>"
					+ "<div id='b"+bucket+"t"+task+"collabs' class='collabsBox'>Becky</div></div>";
	var due = "<div id='b" + bucket + "t"+task+"d' class='hiddenFloat dueOptBox'>"
				+ "<h4 style='margin: 10px'>Due Date Options</h4>"
				+ "<div>Due Date: "
					+ "<input type='text' name='due' rows='1'></input>"
				+ "</div> <div>Remind me <input type='text' name='remind' size='1'></input> days in advance.</div> </div>";
	
  $("#notesBox").append(notes);
	$("#collabsBar").append(collabs);
  $("#dueOptions").append(due);
} 

function ifEnter(field, event) {
  var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
  if (theCode == 13){
    $(field).blur();
  }  
}

