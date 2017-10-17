<template>
  <div class="editor__wrap">
    <textarea
      ref="editor_textarea"
      name="content"
      :style="`height:${height}`"
      :data-editor-key="editor_key"
      :id="editor_id"
    ></textarea>
    <video-article v-if="editor"></video-article>
  </div>
</template>

<script>
	import '../../UEditor/index'
	import {mapActions} from 'vuex'
	import VideoArticle from '../video/video.vue'
	import editor_roow from './../../UEditor/themes/jiguo/icon/editor_roow.svg';
	import editor_roow2 from './../../UEditor/themes/jiguo/icon/editor_roow2.svg';

	export default {
		props: {
			editor_id: {
				editor_type: String,
				default: String('id' + Math.random()).replace('.', '')
			},
			editor_key: {
				type: String,
				default: 'editor-key'
			}
		},
		data() {
			return {
				editor: null,
				height: $(window).height() - 60 - 60 - 30 - 150
			}
		},
		components: {
			VideoArticle,
		},
		mounted() {
			var _this = this;
			if (!this.editor) {
				this.editor = UE.getEditor(this.editor_id, {
					onready: function () {
						_this.hidePageLoading();
						//esc退出全屏
						var _self = this;
						$(_self.document).add(window.document).keyup(function (e) {
							if (e.keyCode == 27 && _self.__fullscreen__) {
								_self.execCommand('yuifullscreen');
							}
						});

						var toolbarbox = $('#' + _this.editor_id).find('.edui-editor-toolbarbox');
						var rightFixed = $(_this.rightFixed);
						var ___yut__ = null;
						$(window).on('resize.left', function () {
							___yut__ && clearTimeout(___yut__);
							___yut__ = setTimeout(function () {
								//rightFixed.css('left', rightFixed.parent().offset().left);
							}, 30);
						}).trigger('resize.left');

						var toolbarboxOffsetTop = toolbarbox.offset().top;
						var windowScorllTop = 0;

						$(window).on('scroll.editor_fullscreen', function () {
							windowScorllTop = $(window).scrollTop();
							if (!toolbarbox.hasClass('editor-fullscreen')) {
								if (windowScorllTop >= toolbarboxOffsetTop - 60) {
									toolbarbox.css({
										position: 'fixed',
										left: toolbarbox.offset().left,
										top: 60,
										width: toolbarbox.width()
									});
								} else {
									toolbarbox.removeAttr('style');
								}
							}
						});

						var editor__tools_tips = $('#' + _this.editor_id + '-tools-tips');
						var editor__tools_tips_text = editor__tools_tips.find('.editor__tools-tips-text');
						if (editor__tools_tips.length <= 0) {
							$('body').append(`
			<div id="${_this.editor_id}-tools-tips" class="editor__tools-tips-wrap">
				<div class="editor__tools-tips-text"></div>
				<img class="editor__tools-tips-roow" src=${editor_roow} />
				<img class="editor__tools-tips-roow editor__tools-tips-roow2" src=${editor_roow2} />
			</div>`
							);
							editor__tools_tips = $('#' + _this.editor_id + '-tools-tips');
							editor__tools_tips_text = editor__tools_tips.find('.editor__tools-tips-text')
						}

						//hover提示
						toolbarbox.on('mouseenter', '.edui-button-body', function () {
							var title = $(this).attr('data-title');
							if (_self.__fullscreen__ && $(this).attr('data-hover-title') == '退出全屏') {
								title = '退出全屏';
							}
							editor__tools_tips_text.html(title);

							var offset = $(this).offset();
							var tips_w = editor__tools_tips.outerWidth();
							var tips_h = editor__tools_tips.outerHeight();
							var scrollTop = $(window).scrollTop();
							editor__tools_tips.hide();

							if (offset.top - 100 <= scrollTop) {
								editor__tools_tips.addClass('editor__tools-arrow-down').css({
									left: offset.left - ( tips_w / 2 ) + 20,
									top: offset.top + tips_h + 18,
								});
							} else {
								editor__tools_tips.removeClass('editor__tools-arrow-down').css({
									left: offset.left - ( tips_w / 2 ) + 20,
									top: offset.top - tips_h - 8,
								});
							}
							editor__tools_tips.stop(true, false).fadeIn(260);

						}).on('mouseleave', '.edui-button-body', function () {
							editor__tools_tips.stop(true, false).fadeOut(260);
						});

						//添加快捷键
						this.addshortcutkey({
							//有序列表
							"insertorderedlist2": "ctrl+shift+55",
							//无序列表
							"insertunorderedlist2": "ctrl+shift+56"
						});
						if (!window.SYATEM.isWindows) {
							this.addshortcutkey({
								//分隔线
								"horizontal": "ctrl+shift+83"
							});
						}

						//保存按钮
						toolbarbox.append(`
						<div class="editor__save-time" id="${ _this.editor_id + '-tools-save'}">
							<div class="editor__save-time-text">${window.__BLOG_DATA__.addtime ? "保存于" + window.__BLOG_DATA__.addtime : '&nbsp;'}</div>
							<div class="editor__save-time-btn">立即保存</div>
						</div>`
						);

						function _getTime() {
							function formet(u) {
								u = String(u);
								if (u.length == 1) {
									return '0' + u;
								}
								return u;
							}

							var date = new Date();
							var mm = formet(date.getMonth() + 1);
							var dd = formet(date.getDay());
							var hh = formet(date.getHours());
							var ii = formet(date.getMinutes());
							var ss = formet(date.getSeconds());

							return mm + '-' + dd + ' ' + hh + ':' + ii + ':' + ss;
						}

						var __auto_save = $('#' + _this.editor_id + '-tools-save');

						__auto_save.on('click', '.editor__save-time-btn.red', function (e) {
							var text = $(this).prev();
							_this.postArticle(e, -2, function () {
								text.html('保存中...');
							}, function (replayData) {
								// _self.execCommand('inserthtml','<p>scscscsc</p><p>scsciii就你不懂</p>');
								if (replayData.resultCode == 0) {
									if (replayData.result.blogid) {
										history.pushState({}, null, '/user/edit/' + replayData.result.blogid + '.html');
									}
									text.html('<span class="green">保存于' + _getTime() + '</span>');
								} else {
									text.html(replayData.errorMsg || '<span class="red">保存失败</span>');
								}
							});
						});
						_this.editor__save_btn = __auto_save.find('.editor__save-time-btn');

						var __auto_save_timer__ = null;
						_self.addListener("contentChange", function () {
							__auto_save_timer__ && clearTimeout(__auto_save_timer__);
							__auto_save_timer__ = setTimeout(() => {
								_this.autoSave();
							}, 5000);
						});

						$('body').on('click', '.preview__btn-submit', function () {
							var r = _this.validationAll(true);
							var blogForm = $('#preview__form');
							if (!r.result) return false;
							blogForm.submit();
						});
						if (window.__BLOG_DATA__.content) {
							_this.editor.setContent(window.__BLOG_DATA__.content);
						}

						//hover编辑器图片出现效果
						var _temp_id_string = '', _temp_id_timer = null, doc = $('body', _this.editor.document);
						doc.on('mouseenter', 'img:not(.edui-faked-video)', function () {
							var $ = $, _img = $(this);

							var src_arr = _img.attr('src').match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i);
							if (!src_arr) {
								return;
							}
							_temp_id_timer && clearTimeout(_temp_id_timer);
							if (!_temp_id_string) {
								_temp_id_string = $('<div class="editor__reinstate-wrap" contenteditable="false">放回素材库</div>');
								$(this).after(_temp_id_string);
							}
							var offset = $(this).offset();
							_temp_id_string.css({
								left: offset.left + $(this).width() - _temp_id_string.width(),
								top: offset.top + $(this).height() - _temp_id_string.height()
							}).on('mouseenter', function () {
								_temp_id_timer && clearTimeout(_temp_id_timer);
							}).on('mouseleave', function () {
								_img.trigger('mouseleave');
							});
						}).on('mouseleave', 'img', function () {
							if (_temp_id_string) {
								_temp_id_timer = setTimeout(function () {
									_temp_id_string.remove();
									_temp_id_string = null;
									doc.find('.editor__reinstate-wrap').remove();
								}, 100);
							}
						}).on('click', '.editor__reinstate-wrap', function () {
							var $ = $, img = $(this).prev('img'), parent = img.parent();
							if (_this.MaterialUpload && _this.MaterialUpload.reinstateImage) {
								var src_arr = img.attr('src').match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i);
								if (!src_arr) {
									return;
								}
								_this.MaterialUpload.reinstateImage(img.attr('src'), img.get(0));
								_temp_id_string && _temp_id_string.remove();
								_temp_id_string = '';
								img.remove();
								if (parent.length && parent.get(0).tagName.toLowerCase() != 'body') {
									if (parent.html() == '') {
										parent.remove();
									}
								}
							}
						});

					}
				});
				this.editor.Component = this;
			}

			//设置右侧素材框高度
			setTimeout(() => {
				var _h = $(window).height() - 190 - 196;
				$('.material__wrap-scroll').css('max-height', _h);
			})
		},
		methods: {
			autoSave(){

      },
			...mapActions([
				'hidePageLoading'
			])
		},
		filter: {}
	}
</script>

<style lang="less" rel="stylesheet/less" scoped="true">

</style>





