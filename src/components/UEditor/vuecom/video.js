
UE.registerUI('yuiinsertvideo',function(editor,uiName){

  editor.registerCommand(uiName,{
	execCommand:function(){

	}
  });
  var btn = new UE.ui.Button({
	name:uiName,
	title:'插入视频',
	onclick:function () {
	  editor.Component.editorDialogOpen && editor.Component.editorDialogOpen('video_show' );
	},
	onmouseenter:function () {
	  //console.log(1)
	},
	onmouseleave:function () {
	  //console.log(2)
	}
  });

  editor.addListener('selectionchange', function () {
	var state = editor.queryCommandState(uiName);
	if (state == -1) {
	  btn.setDisabled(true);
	  btn.setChecked(false);
	} else {
	  btn.setDisabled(false);
	  btn.setChecked(state);
	}
  });
  return btn;
});