$(document).ready(function(){
	$(".sticky").draggable( {containment: "#bulletin"} );
  setAccordion();
 });


// This function sets the taskInfo pannel to contain the appropriate information
// It is called when a bucket or task in the left list is clicked
function setInfo(bucket, task) {
	if (currentView == "welcome") {
		$('#'+currentView).addClass('hiddenFloat');
	} else{
		$('#' + currentView + 'n').addClass('hiddenFloat');
		$('#' + currentView + 'c').addClass('hiddenFloat');
		$('#' + currentView + 'd').addClass('hiddenFloat');
	}
  currentView = 'b'+bucket+'t'+task;
  $('#'+currentView+'n').removeClass('hiddenFloat');
  $('#'+currentView+'c').removeClass('hiddenFloat');
  $('#'+currentView+'d').removeClass('hiddenFloat');
}


// This function creates the accordion in the left list
// It is called whenever something is appended to the accordion
function setAccordion(){
  var stop = false;
  $( "#accordion h3" ).click(function( event ) {
    if ( stop ) {
      event.stopImmediatePropagation();
      event.preventDefault();
      stop = false;
    }
  });
  
  $( "#accordion" )
    .accordion({
      header: "> div > h3"
    })
    .sortable({
      axis: "y",
      handle: "h3",
      stop: function() { stop = true; }
    });
}

// This function sets the text in a textbox to black
// Called when 'new task' gains focus
function taskFocus(num, bucket) {
  var id = '#b'+bucket+'t'+num;
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
  setInfo(bucket, num);
}


function taskBlur(num, bucket) {
  var pTaskId = '#b'+bucket+'t'+num;
  var pCheckId = '#b'+bucket+'c'+num;
  var newTaskNum = parseInt(num)+1;
  var newTaskId = 'b'+bucket+'t'+newTaskNum;
  var newCheckId = 'b'+bucket+'c'+newTaskNum;
  
  
  if ($(pTaskId).val() == '' && $(pTaskId).hasClass('new')) {
    $(pTaskId).text('New Task');
    $(pTaskId).css('color', '#aaa');
  } 
  
  else if ($(pTaskId).hasClass('new')) {
    $(pTaskId).removeClass('new').addClass('task');
    $(pCheckId).removeClass('hidden');
    
    
    var newCheck = "<input type='checkbox' " 
                           + "class='hidden' "
                           + "id='" + newCheckId + "'> ";
    var newText = "<textarea class='new'"
                             + "id= '" + newTaskId
                             + "' onfocus=\"taskFocus('" + newTaskNum + "', '" + bucket + "')\" "
                             + "onblur=\"taskBlur('" + newTaskNum + "', '" + bucket + "')\" "
                             + "onkeypress=\"ifEnter('#"+newTaskId+"', event)\">New Task</textarea><br>";
    
    $('#b'+bucket).append(newCheck+newText);
    
    var name = $(pTaskId).val();
    addTaskToInfo(bucket, num, name);
    // $('#'+newTaskId).focus();
  }
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
  var note = "<div class='sticky' id='"+id+"'><textarea class='stickyNote'>"+$(noteId).val()+"</textarea></div>";
  $("#bulletin").append(note);
  $(".sticky").draggable( {containment: "#bulletin"} );
}

function stickyType(Sid, Nid) {
  $(Nid).text($(Sid).val());
}

function noteType(Sid, Nid) {
  $(Sid).text($(Nid).val());
}

function taskType(num, bucket) {
  var idInfo = '#b'+bucket+'t'+num+'name';
  var id = '#b'+bucket+'t'+num;
  $(idInfo).html("Information about "+$(id).val());
}

function bucketName() {
  $("#bucketName").removeClass("hidden");
  $("#name").focus();
}

function addBucket() {
  var name = $("#name").val();
  if (name != "") {
    var num = $("#accordion > div").size()+1;
    $("#name").text("");
    
    var title = "<h3 id='b"+num+"t"+0+"name'><a href='#' id='b"+num+"name' onclick=\"setInfo('"+num+"', '0')\">"+name+"</a></h3>";
       
    var content = "<div id='b"+num
                        + "' class='bucket'>"
                  + "<input type='checkbox' class='hidden' id='b"+num+"c1'>"
                  + "<textarea class='new' "
                               + "id='b"+num+"t1' "
                               + "onfocus=\"taskFocus('1', '"+num+"')\" "
                               + "onblur=\"taskBlur('1', '"+num+"')\" "
                               + "onkeypress=\"ifEnter('#b"+num+"t1', event)\""
                               + "onkeyup=\"taskType('1', '"+num+"')\">New Task</textarea><br></div>";
  
    $("#accordion").append("<div>"+title+content+"</div>").accordion('destroy'); //.accordion({ "active" : num-1 })
    setAccordion();
     
    addBucketToInfo(num, name);
  }
  $("#bucketName").addClass("hidden");
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
                           + "onkeypress=\"ifEnter('#b"+bucket+"t"+task+"n1', event)\">New Note</textarea><br></div>";
	
	var collabs = "<div id='b" + bucket + "t"+task+"c' class='hiddenFloat'>"
					+ "<h4 style='margin: 10px'>Collaborators</h4>"
					+ "<div id='b"+bucket+"t"+task+"collabs' class='collabsBox'>Becky</div></div>";
	var due = "<div id='b" + bucket + "t"+task+"d' class='hiddenFloat dueOptBox'>"
				+ "<h4 style='margin: 10px'>Due Date Options</h4>"
				+ "<div>Due Date: "
					+ "<textbox name='due' rows='1'>Enter the due date here.</textbox>"
				+ "</div> <div>Remind me <textbox name='remind'></textbox> days in advance.</div> </div>";
	
    $("#notesBox").append(notes);
	$("#collabsBar").append(collabs);
    $("#dueOptions").append(due);

}

function addBucketToInfo(bucket, name) {
  var notes = "<div id='b"+bucket+"t0n' class='hiddenFloat'>"
              + "<h3 id='b"+bucket+"t0name' style='margin: 10px'> Information about " + name + "</h3>"
              + "<img src=\"img/addStickyIcon.gif\" "
                         + "id='b"+bucket+"t0i1' "
                         + "class='stickyButton hidden' "
                         + "onclick=\"addSticky('"+bucket+"', '0', '1')\"></img>"
              
              + "<textarea class='new note'"
                           + "id='b"+bucket+"t0n1'"
                           + "onfocus=\"noteFocus('"+bucket+"', '0', '1')\" "
                           + "onblur=\"noteBlur('"+bucket+"', '0', '1')\" "
                           + "onkeypress=\"ifEnter('#b"+bucket+"t0n1', event)\">New Note</textarea><br></div>";
	var collabs = "<div id='b" + bucket + "t0c' class='hiddenFloat'>"
					+ "<h3 style='margin: 10px'>Collaborators</h3>"
					+ "<div id='b"+bucket+"t0collabs' class='collabsBox'>Becky</div></div>";

	var due = "<div id='b" + bucket + "t0d' class='hiddenFloat'></div>";
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