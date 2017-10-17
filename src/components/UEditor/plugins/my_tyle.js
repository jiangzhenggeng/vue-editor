


UE.plugins['my_style'] = function(){

  var me = this;
  me.commands['title_h3'] = {
	execCommand : function() {
	  var me = this;

	  if( me.queryCommandState("title_h3")==1 ){
	    var range = me.selection.getRange();
		var path = this.selection.getStartElementPath();
		for(var i=0;i<path.length;i++){
		    if( path[i].tagName=='H3' ){
		      var p = me.document.createElement('p');
		      var textNode = me.document.createTextNode( path[i].innerText );
		      p.appendChild( textNode );
			  path[i].parentNode.replaceChild(p,path[i]);
			  range.setStart(textNode,range.startOffset)
				.setEnd(textNode,range.endOffset).collapse(true).select(true);
			  break;
            }
        }
      }else{
		me.execCommand('Paragraph','h3',{
		  'class':'title_h3'
		});
      }
	},
	queryCommandState : function() {
	  var pN = domUtils.filterNodeList(this.selection.getStartElementPath(),'h3');
	  return pN ?  1 : 0;
	}
  };

  var commands = [{
	  name:'insertorderedlist2',
	  dist:'insertorderedlist'
	},{
	  name:'insertunorderedlist2',
	  dist:'insertunorderedlist'
	}
  ];
  for (var i=0;i<commands.length;i++){
    var item = commands[i];
    var cmd = item.dist;
	(function (cmd,item) {
	  me.commands[item.name] = {
		execCommand : function() {
		  var value = this.queryCommandValue(cmd) || undefined;
		  this.execCommand(cmd,value);
		},
		queryCommandState : function() {
		  return this.queryCommandState(cmd);
		}
	  };
	})(cmd,item);
  }
};

