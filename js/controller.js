//$('.feed-carousel-shelf').draggable({axis: "x"});

$('.gate-cart .gate').draggable({revert:true});

$('#holder').droppable({	
	drop:function(event,ui){				
		var $dropped = ui.draggable;			
		var p0 = $(this).offset();
		var p =$dropped.offset();				
		dl.createComponent({type:$dropped.attr('gatetype'),name:$dropped.attr('name'),x:(p.left-p0.left),y:(p.top-p0.top)});
	}
})

$(function(){
	dl.setMode(dl.modes.WIREMODE);
});
$('#simspeed').change(function(){	
	dl.setSimSpeed(1000-$(this).val())
});

$('.stop').click(function(){
	dl.stopSim();
	$(this).hide();$('.run').show();
});
$('.run').click(function(){
	dl.startSim();
	$(this).hide();$('.stop').show();
});

$('.saveas').click(function(){
	 document.location = 'data:Application/octet-stream,' + encodeURIComponent(dl.getCode());
});

$('.open').click(function(){
	$('#fileopen').click();
});
$('#fileopen').change(function(){
  var fileToLoad = this.files[0];	
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) {
    var textFromFileLoaded = fileLoadedEvent.target.result;   
	 dl.executeCode(textFromFileLoaded);
  };
  fileReader.readAsText(fileToLoad, "UTF-8");
});

$('.example').click(function(e){	
	dl.executeCode(examples[this.id]());
});
