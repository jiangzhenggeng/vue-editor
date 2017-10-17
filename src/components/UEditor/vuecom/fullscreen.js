
UE.registerUI('yuifullscreen',function(editor,uiName){

  editor.registerCommand(uiName,{
	execCommand:function(){
	  editor.__fullscreen__ = !!(editor.__fullscreen__ || false);
	  var toolbarbox = $( editor.container ).find('.edui-editor-toolbarbox');

	  if( !editor.pullout ){
		toolbarbox.append('<div class="pullout__fullscreen-tips">ESC可退出全屏编辑模式</div>');
		editor.pullout = toolbarbox.find('.pullout__fullscreen-tips');
	  }

	  if( !editor.__fullscreen__ ){
		$( '.post__editor-page' ).addClass('page__editor-fullscreen');
		var width = toolbarbox.width(),
		  offset = toolbarbox.offset(),
		  left = offset.left,
		  top = offset.top;
		toolbarbox.addClass('editor-fullscreen').css({
		  top:top,
		  left: left - 40,
		  width: width
		});
		setTimeout(function () {
		  toolbarbox.css({
			top:0,
			position:'fixed',
		  });
		});
		editor.pullout.show();
		setTimeout(function () {
		  editor.pullout.addClass('show');
		  setTimeout(function () {
			editor.pullout.removeClass('show');
		  },3000);
		},1000);
	  }else{
		toolbarbox.removeClass('editor-fullscreen');
		$( '.post__editor-page' ).removeClass('page__editor-fullscreen');
		toolbarbox.css('left',toolbarbox.offset().left + 40 );
		$(window).trigger('scroll.editor_fullscreen');
		setTimeout(function () {
		  editor.pullout.hide();
		},300);
	  }
	  editor.__fullscreen__ = !editor.__fullscreen__;
	  setTimeout(function(){
		editor.fireEvent('initialContentShow');
	  },50);
	},
	queryCommandState:function () {
	  if( editor.__fullscreen__ ){
		return 1;
	  }else{
		return 0;
	  }
	}
  });
  var btn = new UE.ui.Button({
	name:uiName,
	title:'写作模式',
	hover_title:'退出全屏',
	onclick:function () {
	  editor.execCommand(uiName);
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