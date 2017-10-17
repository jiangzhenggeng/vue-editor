import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../redux/action/actions';
import MaterialUpload from './uicomponent/materialupload';
import Video from './uicomponent/video';
import ConnectInstructions from './instructions';
import Cover from './cover';
import Title from './title';
import jQuery from './UEditor/third-party/jquery-1.10.2';
import editor_roow from './uicomponent/icon/editor_roow.svg';
import editor_roow2 from './uicomponent/icon/editor_roow2.svg';
import dialog from './toast/dialog';
import Order from './order';
import HasChange from './haschange';

class Editor extends Component {

	constructor(props) {
		super(props);
		const {editor_id, editor_key} = this.props;
		this.state = {
			editor_id: editor_id || String('id' + Math.random()).replace('.', ''),
			editor_key: editor_key || 'editor-key',
			editor: null
		};

		this.pullOutFullScreen = this.pullOutFullScreen.bind(this);
		this._refs = [];

		window.onbeforeunload = function (event) {
			return "要离开正在撰写文章的页面吗？\n系统可能不会保存您所做的更改";
		}

	}

	pullOutFullScreen() {
		this.state.editor.execCommand('yuifullscreen');
	}

	postArticle(event, displayorder, beforeback, callback) {
		var validation = false;
		if (event == 'post') {
			validation = true;
		}
		var r = this.validationAll(validation);
		var _this = this;
		if (!r.result || _this.isSend) {
			return false;
		}

		_this.isSend = true;
		var data = r.data;
		data.displayorder = displayorder;

		var url = '/api/user/AddArticle';
		if (window.__BLOG_ID__ && window.__BLOG_ID__ > 0) {
			data.blogid = data.id = window.__BLOG_ID__;
			//url = '/api/user/EditArticle';
		}
		if (typeof beforeback == 'function') beforeback();

		var _ploa = jQuery.post(url, data, function (replayData) {
			_this.isSend = false;
			if (replayData.resultCode == 0) {
				if (replayData.result.blogid) {
					window.__BLOG_ID__ = replayData.result.blogid;
				}
				dialog.toast('保存成功');
				if (!callback) {
					window.onbeforeunload = null;
					setTimeout(() => {
						window.location = '/user/article.html';
					}, 300);
				}
			} else {
				dialog.toast(replayData.errorMsg || '系统错误');
			}
			if (typeof callback == 'function') {
				callback(replayData);
			}
		}, 'json');
		setTimeout(function () {
			_this.isSend = false;
			_ploa.abort();
		}, 5000);

	}

	render() {
		var height = jQuery(window).height() - 60 - 60 - 30 - 150;
		var blogid = window.__BLOG_ID__;
		return (
			<form action={"/article/Preview"} method="post" target="_blank" id="preview__form">
				<div className="post__editor-page">
					{/*scscs*/}
					<div className="content__wrap main clear">
						<div className="content__left">
							<Cover ref={o => this._refs.Cover = o} parent={this}/>
							<div className="article__content">
								<Title ref={o => {
									this._refs.Title = o;
									this._refs._this = this;
								}} parent={this}/>
								<textarea
									ref={o => this.editor_textarea = o}
									name="content" id={this.state.editor_id}
									data-editor-key={this.state.editor_key}
									style={{height: height}}
								></textarea>
								{this.state.editor ? <Video editor={this.state.editor}/> : ''}
							</div>
							<HasChange/>
						</div>
						<div className="content__right">
							<div ref={o => this.rightFixed = o} className="content__right-fixed">
								<div className="content__right-item">
									<div className="content__right-header">图片素材库</div>
									<div className="content__right-inner">
										{this.state.editor ? <MaterialUpload ref={o => {
											this.MaterialUpload = o;
											this._refs.MaterialUpload = o;
										}} editor={this.state.editor} parent={this}/> : ''}
									</div>
								</div>
								<ConnectInstructions
									changeOrder={() => {
										this.Order.show();
									}}
									clearOrder={() => {
										this.Order.clear();
									}}
									ref={o => this._refs.ConnectInstructions = o}
								/>
							</div>
						</div>
					</div>
				</div>
				<Order
					show={!(/source=user-article/i.test(window.location.href) )}
					ref={o => {
						this.Order = o;
						this._refs.Order = o;
					}} parent={this}/>
			</form>
		);
	}

	validationAll(_val,scroll) {
		var validation = true, post = {}, v, _this = this;
		for (var i in _this._refs) {
			v = _this._refs[i].validation(_val,scroll);
			if (!v) {
				validation = false;
				break;
			} else {
				post = jQuery.extend(true, post, v);
			}
		}
		return {
			data: post,
			result: validation
		};
	}

	validation(_val) {
		var content = this.state.editor.getContent();
		if (!content || ('EE' + content).indexOf('<p id="initContent">文章正文...</p>') > 0) {
			if (_val) {
				dialog.toast('请先填写文章正文');
				return false;
			}
			content = '';
		}
		return {
			content: content
		};
	}

	componentDidMount() {
		var _this = this;
		if (!_this.state.editor) {
			_this.state.editor = UE.getEditor(_this.state.editor_id, {
				onready: function () {
					_this.props.dispatch(actions.page_loading_query(false));
					//esc退出全屏
					var _self = this;
					$(_self.document).add(window.document).keyup(function (e) {
						if (e.keyCode == 27 && _self.__fullscreen__) {
							_self.execCommand('yuifullscreen');
						}
					});

					var toolbarbox = jQuery('#' + _this.state.editor_id).find('.edui-editor-toolbarbox');
					var rightFixed = jQuery(_this.rightFixed);
					var ___yut__ = null;
					jQuery(window).on('resize.left', function () {
						___yut__ && clearTimeout(___yut__);
						___yut__ = setTimeout(function () {
							rightFixed.css('left', rightFixed.parent().offset().left);
						}, 30);
					}).trigger('resize.left');

					var toolbarboxOffsetTop = toolbarbox.offset().top;
					var windowScorllTop = 0;

					jQuery(window).on('scroll.editor_fullscreen', function () {
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

					var editor__tools_tips = jQuery('#' + _this.state.editor_id + '-tools-tips');
					var editor__tools_tips_text = editor__tools_tips.find('.editor__tools-tips-text');
					if (editor__tools_tips.length <= 0) {
						jQuery('body').append(`
			<div id="${_this.state.editor_id}-tools-tips" class="editor__tools-tips-wrap">
				<div class="editor__tools-tips-text"></div>
				<img class="editor__tools-tips-roow" src=${editor_roow} />
				<img class="editor__tools-tips-roow editor__tools-tips-roow2" src=${editor_roow2} />
			</div>`
						);
						editor__tools_tips = jQuery('#' + _this.state.editor_id + '-tools-tips');
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
						var scrollTop = jQuery(window).scrollTop();
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
						<div class="editor__save-time" id="${_this.state.editor_id + '-tools-save'}">
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

					var __auto_save = jQuery('#' + _this.state.editor_id + '-tools-save');

					__auto_save.on('click', '.editor__save-time-btn.red', function (e) {
						var text = jQuery(this).prev();
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

					jQuery('body').on('click', '.preview__btn-submit', function () {
						var r = _this.validationAll(true);
						var blogForm = jQuery('#preview__form');
						if (!r.result) return false;
						blogForm.submit();
					});
					if (window.__BLOG_DATA__.content) {
						_this.state.editor.setContent(window.__BLOG_DATA__.content);
					}

					//hover编辑器图片出现效果
					var _temp_id_string = '', _temp_id_timer = null, doc = jQuery('body', _this.state.editor.document);
					doc.on('mouseenter', 'img:not(.edui-faked-video)', function () {
						var $ = jQuery, _img = $(this);

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
						var $ = jQuery, img = $(this).prev('img'), parent = img.parent();
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
			_this.state.editor.Component = this;

			_this.setState({
				editor: _this.state.editor
			});
		}

		//设置右侧素材框高度
		setTimeout(() => {
			var _h = jQuery(window).height() - 190 - 196;
			jQuery('.material__wrap-scroll').css('max-height', _h);
		})
	}

	autoSave() {
		if (this.editor__save_btn && this.editor__save_btn.trigger) {
			this.editor__save_btn.addClass('red').trigger('click');
		}
		if (!this.previewBtn) {
			this.previewBtn = jQuery('.preview,.post-article');
		}
		if (this.validationAll(true,'not').result) {
			this.previewBtn.addClass('btn-red');
		} else {
			this.previewBtn.removeClass('btn-red');
		}
	}

	editorDialogOpen(key) {
		this.state.editor[key] = true;
		this.setState({
			editor: this.state.editor
		});
	}

	editorDialogClose(key) {
		this.state.editor[key] = false;
		this.setState({
			editor: this.state.editor
		});
	}
}

Editor.propTypes = {
	editor_id: React.PropTypes.string,
	editor_key: React.PropTypes.string,
};

const ConnectEditor = connect()(Editor);

export default ConnectEditor;








