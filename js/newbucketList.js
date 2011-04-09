/**
 * @author Becky
 */
$(document).ready(function() {
	$(".draggable").draggable( {containment: "#container"} );
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
 
function addBucketToPaper(bucket, name) {
	$("#paperTitle").text(name);
	var collabs=["Becky", "Tamara"]
	var notes = "<div id='b"+bucket+"t0n' class='hiddenFloat'>"
              + "<img src=\"img/addStickyIcon.gif\" "
                         + "id='b"+bucket+"t0i1' "
                         + "class='stickyButton hidden' "
                         + "onclick=\"addSticky('"+bucket+"', '0', '1')\"></img>"
              + "<textarea class='new task'"
                           + "id='b"+bucket+"t0'"
                           + "onfocus=\"taskFocus('"+bucket+"', '0', '1')\" "
                           + "onblur=\"taskBlur('"+bucket+"', '0', '1')\" "
                           + "onkeypress=\"ifEnter('#b"+bucket+"t0', event)\">New Task</textarea><br>"
				+ "<div class='divider'></div></div>";
	var collabs = "<div id='b" + bucket + "t0c' class='hiddenFloat'>"
					+ "<div id='b"+bucket+"t0collabs' class='collabsBox'>"+collabs[(bucket%2)]+"</div></div>";

  $("#bottomLeftBox").html(notes);
  $("#bottomRightBox").html(collabs);

}

function bucketFocus(bucket) {
	var id = '#b0';
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}

function bucketBlur(bucket) {
	var currentBucket = '#b0';
  var newBucketNum = parseInt(bucket)+1;
  var newBucket = 'b'+newBucketNum;
	var newBucketID = '#'+newBucket;
  
  if ($(currentBucket).val() == '' && $(currentBucket).hasClass('new')) {
    $(currentBucket).text('New Bucket');
    $(currentBucket).css('color', '#aaa');
  } 
  else if ($(currentBucket).hasClass('new')) {
    $(currentBucket).removeClass('new');
		name = $(currentBucket).val();
		
		bucket = new Bucket(name);
		
		bucketsTasksNotes.append(bucket);
		
		var newBucket = "<li onclick='addBucketToPaper("+String(newBucketNum)+",\""+name+"\")'>"+name+"</li>";

		$(currentBucket).text('New Bucket');
		$(currentBucket).css('color', '#aaa');
		$(currentBucket).addClass('new');
		$(currentBucket).onkeypress="ifEnter("+newBucketID+", event)";

    $('#tasksMenu').append(newBucket);
  }
}

function taskFocus(bucket, task) {
  var id = '#b'+bucket+'t'+task;
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}


function taskBlur(bucket, task) {
	var currentTask = '#b'+bucket+'t'+task;
	var currentTaskIcon = '#b'+bucket+'t'+task+'i';
	
	if($(currentTask).val() == '' && $(currentTask).hasClass('new')) {
		$(currentTask).text('New Task');
		$(currentTask).css('color', '#aaa');
	}
	else if ($(currentTask).hasClass('new')) {
		$(currentTask).removeClass('new');
		$(currentTaskIcon).removeClass('hidden');
		
		bucketsTasksNotes[bucket].append([]);
		
		nextTaskNumber = parseInt(task)+1;
		
	}
	
	
/*
  var taskID = '#b'+bucket+'t'+task;
  var iconID = '#b'+bucket+'t'+task+'i';
  var nextTaskNum = parseInt(task)+1;
  var nextTaskID = 'b'+bucket+'t'+nextTaskID;
  var nextTaskIcon = 'b'+bucket+'t'+nextTaskID+'i';
  
  
  if ($(taskID).val() == '' && $(taskID).hasClass('new')) {
    $(taskID).text('New Task');
    $(taskID).css('color', '#aaa');
  } 
  else if ($(taskID).hasClass('new')) {
    $(taskID).removeClass('new');
    $(iconID).removeClass('hidden');
    
    var newIcon = "<img src=\"img/addStickyIcon.gif\""
                           + "id='"+nextTaskIcon+"'"
                           + "class='stickyButton hidden' "
                           + "onclick=\"addSticky('"+bucket+"', '"+task+"')\"></img>";
    
    var newText = "<textarea class='new note' "
                             + "id='" + nextTaskID
                             + "' onfocus=\"taskFocus('" + bucket+"', '" + String(nextTaskNum) + "')\" " 
                             + "onblur=\"taskBlur('" + bucket+"', '" + String(nextTaskNum) + "')\""
                             + "onkeypress=\"ifEnter('#"+nextTaskID+"', event)\">New Task</textarea><br>";
    
    $('#b'+bucket+'t'+task+'n').append(newIcon+newText);
    // $('#'+newNodeId).focus();
  }
*/
}

function noteFocus(bucket, task, note) {
  var id = '#b'+bucket+'t'+task+'n'+note;
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
}


function noteBlur(bucket, task, note) {
  var pNoteId = '#b'+bucket+'t'+task+'n'+note;
  var pIconId = '#b'+bucket+'t'+task+'i'+note;
  var newNoteNum = parseInt(note)+1;
  var newNoteId = 'b'+bucket+'t'+task+'n'+newNoteNum;
  var newIconId = 'b'+bucket+'t'+task+'i'+newNoteNum;
  
  
  if ($(pNoteId).val() == '' && $(pNoteId).hasClass('new')) {
    $(pNoteId).text('New Note');
    $(pNoteId).css('color', '#aaa');
  } 
  else if ($(pNoteId).hasClass('new')) {
    $(pNoteId).removeClass('new');
    $(pIconId).removeClass('hidden');
    
    var newIcon = "<img src=\"img/addStickyIcon.gif\""
                           + "id='b"+bucket+"t"+task+"i"+newNoteNum+"' "
                           + "class='stickyButton hidden' "
                           + "onclick=\"addSticky('"+bucket+"', '"+task+"', '"+newNoteNum+"')\"></img>";
    
    var newText = "<textarea class='new note' "
                             + "id='" + newNoteId
                             + "' onfocus=\"noteFocus('" + bucket+"', '" + task + "', '" + newNoteNum + "')\" " 
                             + "onblur=\"noteBlur('" + bucket+"', '" + task + "', '" + newNoteNum + "')\""
                             + "onkeypress=\"ifEnter('#"+newNoteId+"', event)\">New Task</textarea><br>";
    
    $('#b'+bucket+'t'+task+'n').append(newIcon+newText);
    // $('#'+newNodeId).focus();
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
	// $(".resizable").resizable();
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

