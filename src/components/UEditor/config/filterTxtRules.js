

function clearAttr(node){
  node.setAttr();
}
function transP(node){
  node.tagName = 'p';
  node.setAttr();
  node.setStyle();
}
function has(node,attr) {
  attr = attr || {};
  var attrs = node.attrs||{};
  for (var i in attrs){
	if(!attr[i]){
	  node.setAttr(i);
	}
  }
}

function filterTxtRules(){

  return {
	//直接删除及其字节点内容
	'-' : 'from input select',
	'iframe':function (node) {
	  has(node,{src:1,style:1});
	},
	'img':function (node) {
	  has(node,{
		'src':1,
		'_src':1,
		'alt':1,
		'title':1,
		'data-img-type':1,
		'data-ratio':1,
		'data-height':1,
		'data-width':1,
		'data-original':1
	  });
	},
	'div':function (node) {
	  if( node.attrs['data-disedit'] && node.tagName == 'div' ){
		has(node,{class:1,style:1});
		node.setAttr('contenteditable','false');
	  }else{
		transP(node);
	  }
	},
	'p': {'$':{}},
	'br':{'$':{}},
	'li':{'$':{}},
	'h1':{'$':{}},
	'h2':{'$':{}},
	'h3':{'$':{}},
	'h4':{'$':{}},
	'h5':{'$':{}},
	'h6':{'$':{}},
	'table':{'$':{}},
	'caption':{'$':{}},
	'th':{'$':{}},
	'tr':{'$':{}},
	'td':function(node){
	  //没有内容的td直接删掉
	  var txt = !!node.innerText();
	  if(txt){
		node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
	  }
	  node.parentNode.removeChild(node,node.innerText())
	}
  }
}

const _filterTxtRules = filterTxtRules();


module.exports =  _filterTxtRules;



