/**
 * 锚点插件，为UEditor提供插入锚点支持
 * @file
 * @since 1.2.6.1
 */
UE.plugin.register('catchimgeinfo', function (){


	function createRandomId() {
		return 'id'+String(Math.random()).replace('.','')+(new Date().getTime() );
	}
	function setAttr(img) {
		img.setAttribute('data-with',img.width);
		img.setAttribute('data-height',img.height);
		img.setAttribute('data-ratio',img.width/img.height);
	}
	var me,imgs;

    return {
        bindEvents:{
            'afterinsertimage':function(){
                me = this;
	            imgs = me.document.getElementsByTagName('img');
	            if(imgs.length){
		            for (var i = 0 ; i < imgs.length; i++ ){
			            if(imgs.complete){
				            setAttr(imgs);
			            }else{
				            imgs.onload = function () {
					            setAttr(this);
					            this.onload = null;
				            }
			            }
		            }
	            }
            }
        },
       commands:{
           'catchimgeinfo':{
               execCommand:function (cmd, name) {
                   this.fireEvent('afterinsertimage');
               }
           }
       }
    }
});
