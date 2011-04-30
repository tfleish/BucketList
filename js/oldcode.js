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

/*
	var task = user.organizer[b].tasks[t]; // Get task from organizer
	name = task.name;
	
	$("#paperTitle").text(name); // Set the title of the paper
	$('#enterScreen').addClass('hidden');
	//$('#paperHolder').removeClass('hidden');
	//$('#textHolder').removeClass('hidden'); // Make the paper appear, if it is currently invisible
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
                           + "rows='1' style='height: auto'"
                           + "onfocus=\"noteFocus('"+b+"','"+t+"')\" "
                           + "onblur=\"noteBlur('"+b+"','"+t+"')\" "
                           + "onkeyup=\"ifEnter('#b"+b+"t"+t+"noteBox', event)\">New Note</textarea><br>"
              + "<h4 id='alertLabel' class='hidden' style='float:right; padding-right:5px'>Alert\n</h4>"
		   	  + "<div class='divider'></div></div>";
				
	//id of outer div is b(bucketNum)t(taskNum)c
	//id of collabs box is b(bucketNum)t(taskNum)collabs
	var collabs = "<div id='b"+b+"t"+t+"c' class='hiddenFloat'>"
					+ "<div id='b"+b+"t"+t+"collabs' class='collabsBox'></div></div>";
	$( ".date" ).datepicker();
  $("#bottomLeftBox").html(notes);
  $("#bottomRightBox").html(collabs);*/
  
  
  
	/*
	//notes is the HTML for the notes section of the textbox.
	//id of notes is assigned as b(bucketNumber)t.
	//id of taskbox is b(bucketNumber)taskBox
	//we add just the one New Task line
	var notes = "<div id='b"+b+"t' class='noteBox'>"
							+ "<h4>Tasks</h4>"
              + "<textarea class='new task' "
              				+"style='float:left'"
                           + "id='b"+b+"taskBox'"
                           + "onfocus=\"taskFocus('"+b+"')\" "
                           + "onblur=\"taskBlur('"+b+"')\" "
                           + "onkeyup=\"ifEnter('#b"+b+"taskBox', event)\">New Task</textarea>"
                + "<h4 id='dueLabel' class='hidden' style='float:right; padding-right:5px'>Due</h4>"
				+ "<div class='divider'></div></div>";
				
	//id of overall div is b(bucketNumber)c
	//id of section holding collabs is b(bucketNumber)collabs
	var collabsList = "<div id='b" + b + "c' class='hiddenFloat' style='positon: absolute'>"
					+ "<div id='b"+b+"collabs' class='collabsBox'>"+String(collabs)+"</div></div>";

  $("#bottomLeftBox").html(notes);
  $("#bottomRightBox").html(collabsList);*/
  
  
  /*
	var notebox = '#b'+bucket+'t'+task+'noteBox'; // Input notebox for the relevant task
	var currentNoteNum=user.organizer[parseInt(bucket)].tasks[parseInt(task)].notes.length; // get number of next task on list from organizer
	var currentNote = 'b'+bucket+'t'+task+'n'+String(currentNoteNum);
	var currentNoteIcon = currentNote+'i';
	
	if ($(notebox).val() == '' && $(notebox).hasClass('new')) { // if the text is empty, don't actually create new task.
			$(notebox).text('New Task');
			$(notebox).css('color', '#aaa');
		}
	else if ($(notebox).hasClass('new')) {
			name = $(notebox).val();
			addNoteToTask(name, task, bucket);
			
			$('#alertLabel').removeClass('hidden');
			$(notebox).removeClass('new');
			
			//new sticky icon with id b(bucketNum)t(taskNum)i
			var newIcon = "<div style='float: left; width: 80%;'><img src=\"img/addStickyIcon.gif\""
						+ "id='" + currentNoteIcon + "'" 
						+ "class='stickyButton' " 
						+ "onclick=\"addSticky('"+bucket+"','"+task+"','"+String(currentNoteNum) +"')\"></img>";
		
			//create a new line of text on the list of tasks with id b(bucketNum)t(taskNum)
			rows = Math.ceil(name.length/22);

			var newText = "<textarea class='note fixed' rows='"+rows+"' style='float:left; width: 200px;'" 
						+"id='"+currentNote +"'" +">" 
						+name+"</textarea></div>"
						+"<div style='float: right; width: 20%;'>"
							+"<img src='img/reorder.png' class='checkBoxIcon' style='float: left;'></img>"
							+"<img src='img/alert_icon.gif' class='menu_class alertMenus checkBoxIcon' style='float: right;'>"
						//+"<ul class='the_menu menu5' style='float: right;'></div>"
						//+ "<li><textarea class='new collab' onfocus='collabFocus()'>Enter name</textarea></li></ul>"
						+"</img></div>";
			
			//reset taskbox
			$(notebox).text('New Note');
			$(notebox).css('color', '#aaa');
			$(notebox).addClass('new');
			$(notebox).onkeyup = "ifEnter('#b" + bucket + "t" + task + "noteBox, event)";
			$('#b'+bucket+'t'+task+'n').append("<div style='float: left; width:100%;'>"+newIcon + newText+"</div>");
	}*/
  
  