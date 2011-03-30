$(document).ready(function(){

	$(".sticky").draggable( {containment: "#bulletin"} );
	
	$("#accordion").accordion();
  

});

function taskFocus(num, bucket) {
  var id = '#b'+bucket+'t'+num;
  if ($(id).hasClass('new')) {
    $(id).text('');
    $(id).css('color', 'black');
  }
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
    
    
    var newCheck = "<input type='checkbox' class='hidden' id='" + newCheckId + "'>";
    var newText = "<textarea class='new' id='"+newTaskId+"' onfocus=\"taskFocus('"+newTaskNum+"', '"+bucket+"')\" onblur=\"taskBlur('"+newTaskNum+"', '"+bucket+"')\">New Task</textarea><br>";
    
    $('#b'+bucket).append(newCheck+newText);
  }

}


