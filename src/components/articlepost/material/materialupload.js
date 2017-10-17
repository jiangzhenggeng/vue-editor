import './_materialupload.less';
import React from 'react';
import jQuery from './../UEditor/third-party/jquery-1.10.2';
import webuploader from './../UEditor/third-party/webuploader/webuploader';
import tools from './../../tool/tools';
import editor_roow from './../uicomponent/icon/editor_roow.svg';
import dialog from './../toast/dialog';
import close_icon from './../uicomponent/icon/close_icon.svg';

var httpHost;
if (process.env.NODE_ENV == 'production') {
	httpHost = window.location.href.match(/http:\/\/(\w+\.jiguo\.com)/i)[1];
} else {
	httpHost = 'http://localhost:8080';
}

class MaterialUpload extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fileQueued: {},
			viewImgLargId: String('id' + Math.random()).replace('.', '')
		};
	}

	validation() {
		var img = [], fileQueued = this.state.fileQueued;
		for (var i in fileQueued) {
			if (fileQueued[i].src) {
				img.push({
					src:fileQueued[i].src,
					title:fileQueued[i].title
				});
			}
		}
		return {
			img: img
		};
	}

	setImgList(result) {
		result = result || [];
		var _temp_fileQueued = {};
		result.forEach((item) => {
			var src = typeof item=='object'?item.src : item;
			var title = typeof item=='object'?item.title : src;

			var id = String('id' + Math.random()).replace('.', '');
			var src_arr = src.match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i);
			if (!src_arr) return;

			var _r = {
				fileid: id,
				field: src.match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i)[1],
				src: src,
				original_url: src,
				rotate: 0,
				title:title
			};
			_temp_fileQueued[id] = this.state.fileQueued[id] = _r;
		});

		this.setState({
			fileQueued: this.state.fileQueued
		}, () => {
			for (var i in _temp_fileQueued) {
				this.state.fileQueued[i].progressbar = jQuery('#' + i + '-progressbar');
				this.state.fileQueued[i].uploadstate = jQuery('#' + i + '-uploadstate');
				this.state.fileQueued[i].thumbview = jQuery('#' + i + '-thumbview');
				this.state.fileQueued[i].wrapli = jQuery('#' + i);
				this.state.fileQueued[i].wrapli.addClass('success');
				this.loadImg(_temp_fileQueued[i].src, _temp_fileQueued[i].fileid);
			}
		});
	}

	render() {
		return (
			<div className="material__upload-wrap">
				<div className={"material__wrap " + (tools.getLength(this.state.fileQueued) ? "show" : "")}
						 ref="material__wrap">
					<div className="material__wrap-scroll" ref={o => this.material__wrap_scroll = o}>
						<ul className="clear">
							<li className="material__upload-control item">
								<div className="material__item-inner">
									<div className="material__upload-btn-box">
										<div><img src={require('./icon/add_img_show.svg')}/></div>
										<div style={{color: '#333333'}}>本地图片</div>
										<div className="gray">8Mb之内</div>
									</div>
									<div className="material__upload-btn-addr" style={{height: '100%'}}></div>
								</div>
							</li>
							{jQuery.map(this.state.fileQueued, (item) => {
								return item.hide ? null : (
									<li id={item.fileid} className={"item " + (item.src ? "success" : "")} key={item.fileid}>
										<div className="material__item-inner material__item-inner-show-larg">
											<div className="material__item-content">
												<div className="material__thumbview">
													<img id={`${item.fileid}-thumbview`} src={item.src} title={item.title} alt={item.alt||item.title}/>
												</div>
											</div>
											<div id={`${item.fileid}-uploadstate`} className="material__uploadstate"></div>
											<div className="material__progressbar-wrap">
												<div id={`${item.fileid}-progressbar`} className="material__progressbar"></div>
											</div>

											<div className="material__img-uploading">加载中</div>
											<div onClick={this.imageRotate.bind(this, item)} className="material__rotation">
												<img src={require('./icon/rotation_img.svg')}/>
											</div>

											<div className="material__tips-text-box"></div>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
				<div className="material__upload-wrap-table">
					<div className="material__upload-wrap-cell">
						<div className="material__upload">
							<div className="material__upload-btn">上传本地图片</div>
						</div>
						<div style={{fontSize: 12, color: '#999999', lineHeight: '17px', marginTop: 20}}>
							<p>批量上传文章中需要的图片，</p>
							<p>在撰文过程中将图片插入合适位置，</p>
							<p>每张限8Mb之内。</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		var _this = this;
		var sizeMax = 8;
		//上传
		var uploader = _this.uploader = new webuploader.Uploader({
			swf: window.UEDITOR_CONFIG.UEDITOR_HOME_URL + 'third-party/webuploader/Uploader.swf',
			// 文件接收服务端。
			server: window.UEDITOR_CONFIG.serverUrl + '&action=uploadimage',
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: '.material__upload-btn',
			//允许重复
			duplicate: true,
			multiple: true,
			fileSingleSizeLimit: sizeMax * 1024 * 1024,
			// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			resize: false,
			//选完文件后，是否自动上传。
			auto: true,
			prepareNextFile: true,
			fileVal: 'upfile',

			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp'
			}
		});
		uploader.addButton('.material__upload-btn-addr');
		uploader.on('beforeFileQueued', function (file) {
			if (file.size > sizeMax * 1024 * 1024) {
				dialog.toast('图片不能超过' + sizeMax + 'Mb');
				return false;
			}
		});
		this.bindOnUploadEvent();
		this.createViewLarg();

		jQuery('.material__wrap-scroll').hover(function () {
			var _this = jQuery(this),
				height = _this.height(),
				_ul = _this.find('>ul'),
				_ul_height = _ul.height();

			jQuery(window).on('mousewheel.preventDefault DOMMouseScroll.preventDefault', function (e) {

				var event = e.originalEvent;
				var delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;

				if (
					(_this.scrollTop() + height >= _ul_height && delta < 0 ) ||
					(_this.scrollTop() <= 0 && delta > 0 )
				) {
					e.preventDefault();
				}
			});
		}, function () {
			jQuery(window).off('mousewheel.preventDefault DOMMouseScroll.preventDefault');
		});

		if (window.__BLOG_ID__ && window.__BLOG_ID__ > 0) {
			window.__BLOG_DATA__.img && this.setImgList(window.__BLOG_DATA__.img || []);
		}

	}

	createViewLarg() {

		var html = `<div id="${this.state.viewImgLargId}" class="material__hover-look-larg">
				  <img class="material__hover-img"/>
				  <div class="material__hover-close"><img src="${close_icon}"/></div>
				  <div class="material__img-title"></div>
				</div>
				<div id="${this.state.viewImgLargId}-error" class="editor__tools-tips-wrap material__hover-look-error">
				  <div class="editor__tools-tips-text"></div>
				  <img class="editor__tools-tips-roow" src=${editor_roow} />
			  	</div>
			`;
		var body = jQuery('body').append(html);
		var viewObj = body.find('#' + this.state.viewImgLargId);
		var viewImg = viewObj.find('.material__hover-img');
		var viewTitle = viewObj.find('.material__img-title');

		var right_error = jQuery('#' + this.state.viewImgLargId + '-error');
		var right_error_text = right_error.find('.editor__tools-tips-text');

		body.on('mouseenter', '.material__item-inner-show-larg', function () {
			var _self = jQuery(this);
			var offset = _self.offset();
			var imgbox = _self.find('.material__thumbview');
			var imgsrc = imgbox.find('img');
			viewObj.stop(false, true).fadeIn();
			viewTitle.html( imgsrc.attr('title')||imgsrc.attr('alt') );

			var _img = new Image();
			_img.onload = function () {
				_loadfn();
			};
			_img.src = imgsrc.attr('src');
			var maxHeight = 300;
			var maxWidth = 300;
			var minWidth = 160;

			var _loadfn = function () {
				viewImg.attr('src', imgsrc.attr('src'));
				var h, w, scrollTop = jQuery(window).scrollTop();

				w = _img.width;
				h = _img.height;
				if (_img.width > maxWidth) {
					w = maxWidth;
					h = w * _img.height / _img.width;
				}
				if ( h > maxHeight) {
					h = maxHeight;
					w = maxHeight * _img.width / _img.height;
				}

				if (_img.width < minWidth) {
					w = minWidth;
				}

				viewObj.css({
					left: offset.left - w - 5,
					top: offset.top - scrollTop,
					height: h,
					width: w
				});
			};

			if (_img.complete) {
				_loadfn();
			}

			var html = _self.find('.material__tips-text-box').html().replace(/^\s+|\s+$/g, '');
			if (html) {
				right_error_text.html(html);
				right_error.css({
					left: offset.left - (right_error.width() - _self.width()) / 2,
					top: offset.top - right_error.height() - 18,
				}).stop(false, true).fadeIn();
			}

		}).on('mouseleave', '.material__item-inner-show-larg', function () {
			viewObj.stop(false, true).fadeOut();
			right_error.stop(false, true).fadeOut();
		}).on('click', '.material__hover-close', function () {
			jQuery(this).parent().stop(false, true).fadeOut();
		});

	}

	bindOnUploadEvent() {
		var uploader = this.uploader;
		var _this = this;

		// 当有文件被添加进队列的时候
		uploader.on('fileQueued', function (file) {

			var fileQueued = {};
			fileQueued[file.id] = {
				fileid: file.id,
				filename: file.name,
				file: file,
				title: file.name.replace(/\..*/,'')
			};

			for (var i in _this.state.fileQueued) {
				fileQueued[i] = _this.state.fileQueued[i];
			}
			_this.setState({
				fileQueued: fileQueued
			}, () => {
				_this.state.fileQueued[file.id].progressbar = jQuery('#' + file.id + '-progressbar');
				_this.state.fileQueued[file.id].uploadstate = jQuery('#' + file.id + '-uploadstate');
				_this.state.fileQueued[file.id].thumbview = jQuery('#' + file.id + '-thumbview');
				_this.state.fileQueued[file.id].wrapli = jQuery('#' + file.id);
				_this.createThumb(file, '#' + file.id + '-thumbview');
				_this.state.fileQueued[file.id].wrapli.addClass('uploading');
			});
		});

		// 文件上传过程中创建进度条实时显示。
		uploader.on('uploadProgress', function (file, percentage) {
			var item = _this.state.fileQueued[file.id];
			item.progressbar.css('width', percentage * 100 + '%');
			item.uploadstate.text('上传中');
		});

		uploader.on('uploadSuccess', function (file, respon) {
			uploader.removeFile(file, true);
			var item = _this.state.fileQueued[file.id];
			if (respon.url && respon.state == 'SUCCESS') {
				var url = respon.url;
				item.src = url;
				item.field = url.match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i)[1];
				item.original_url = 'http://s1.jiguo.com/' + item.field + '?imageView2/2/w/640/q/100';
				item.rotate = 0;
				item.title = file.name.replace(/\..*/,'');

				item.uploadstate.text('上传成功');

				_this.state.fileQueued[file.id] = item;

				_this.loadImg(url, file.id, respon.type,function () {
					item.wrapli.removeClass('error uploading').addClass('success');
				});
				_this.uploader.removeFile(file, true);

				_this.savetimer && clearTimeout(_this.savetimer);
				_this.savetimer = setTimeout(() => {
					_this.props.parent.autoSave();
				}, 500);

			} else {
				item.wrapli.find('.material__tips-text-box').html(respon.state);
				uploader.trigger('uploadError', file);
			}
		});

		uploader.on('uploadError', function (file) {
			uploader.removeFile(file, true);
			var item = _this.state.fileQueued[file.id];
			item.wrapli.removeClass('success uploading').addClass('error');
			item.uploadstate.text('上传错误');
		});

		uploader.on('error', function (file) {
			uploader.removeFile(file, true);
			var item = _this.state.fileQueued[file.id];
			item.wrapli.find('.material__tips-text-box').html(file.statusText || '上传错误');
		});
	}

	loadImg(url, fileid, type, callBack) {
		var img = new Image();
		img.onload = function () {
			var __img__ = jQuery('#' + fileid + '-thumbview');
			if (__img__.length) {
				__img__.attr({
					'src': this.src,
					'_src': this.src,
					'data-width': this.width,
					'data-height': this.height,
					'data-img-type': type || 2,
					'data-ratio': this.width / this.height,
				});
				(callBack || function () {})(fileid, __img__);
			}
			img = img.onload = null;
		};
		img.src = url;
	}

	createThumb(file, imgid) {
		this.uploader.makeThumb(file, (function (imgid) {
			return function (error, src) {
				var imgBox = jQuery(imgid);
				if (!imgBox.length) return;
				imgBox.attr({
					src : src,
					title: file.name.replace(/\..*/,''),
					alt:file.name.replace(/\..*/,'')
				});
			};
		})(imgid), 230, 230);
	}

	insertImage(item) {
		var img = item.thumbview.clone();
		var html = img.prop('outerHTML');

		item.file && this.uploader.removeFile(item.file, true);

		this.props.editor.execCommand('inserthtml', html + '<p><br/></p>');
		delete this.state.fileQueued[item.fileid];

		item.wrapli.find('.material__item-inner-show-larg').trigger('mouseleave');
		this.setState({
			fileQueued: this.state.fileQueued
		}, () => {
			item.wrapli.find('.material__item-inner-show-larg').trigger('mouseleave');
			this.props.parent.autoSave();
		});
	}

	reinstateImage(src, img) {
		var src_arr = img.src.match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i);
		if (!src_arr) return;
		this.setImgList([{
			src:img.src,
			alt:img.alt||img.src,
			title:img.title||img.src
		}]);
		jQuery(this.material__wrap_scroll).length && jQuery(this.material__wrap_scroll).scrollTop(999999);
		this.savetimer && clearTimeout(this.savetimer);
		this.savetimer = setTimeout(() => {
			this.props.parent.autoSave();
		}, 500);
	}

	deleteMaterial(item) {
		var _this = this;
		item.file && _this.uploader.removeFile(item.file, true);
		delete _this.state.fileQueued[item.fileid];
		_this.setState({
			fileQueued: _this.state.fileQueued
		});
		this.props.parent.autoSave();
		item.wrapli.find('.material__item-inner-show-larg').trigger('mouseleave');
	}

	replayUploadError(item) {
		var _this = this;
		item.wrapli.removeClass('success error').addClass('uploading');
		item.uploadstate.text('上传中');
		_this.uploader.retry(item.file);
	}

	imageRotate(item) {
		if (!item.field) return;

		var _this = this;
		item.rotate = ( (item.rotate || 0) + 90 ) % 360;
		var logo = '|watermark/1/image/aHR0cDovL3dhdGVybWFyay0xMjUyMTA2MjExLnBpY3NoLm15cWNsb3VkLmNvbS8xNDk3OTQyODk2MjgzNTk0OGNiNzA1NGViZi5wbmc=/gravity/southeast/dx/20/dy/20';
		item.src = 'http://s1.jiguo.com/' + item.field + '?imageView2/2/w/640/q/100|imageMogr2/rotate/' + item.rotate + logo;

		item.wrapli.addClass('loading');
		_this.loadImg(item.src, item.fileid, item.type, function () {
			item.wrapli.removeClass('loading');
			item.wrapli.find('.material__item-inner-show-larg').trigger('mouseenter');
			_this.props.parent.autoSave();
		});
		_this.state.fileQueued[item.fileid] = item;
		_this.setState({
			fileQueued: _this.state.fileQueued
		}, () => {
			item.wrapli.find('.material__item-inner-show-larg').trigger('mouseenter');
		});
	}

}

MaterialUpload.propTypes = {
	editor: React.PropTypes.object.isRequired
};

export default MaterialUpload;