import React, {Component} from 'react';
import jQuery from './UEditor/third-party/jquery-1.10.2';
import webuploader from './UEditor/third-party/webuploader/webuploader';
import dialog from './toast/dialog';

class Cover extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cover: window.__BLOG_DATA__.cover ? 'http://s1.jiguo.com/' + window.__BLOG_DATA__.cover + '/logo' : '',
			fileid: window.__BLOG_DATA__.cover ? window.__BLOG_DATA__.cover : ''
		};

	}

	validation(_val,scroll) {
		if (_val && (!this.state.cover || !this.state.fileid)) {
			dialog.toast('请上传封面');
			if(scroll!='not' && this.content__cover){
				jQuery('html,body').animate({
					scrollTop:jQuery(this.content__cover).offset().top - 70
				});
			}
			return false;
		}
		return {
			fileid: this.state.fileid || ''
		};
	}

	render() {
		return (
			<div className={"content__cover" + (this.state.fileid ? " success" : "")} ref={o=>this.content__cover=o}>
				<div className="content__cover-box">
					<div className="content__cover-icon">
						<div><img src={require('./uicomponent/icon/cover_show.svg')}/></div>
						<div style={{color: '#999', fontSize: 18, marginTop: 10}}>上传文章封面</div>
						<div style={{color: '#999', fontSize: 14}}>建议尺寸800x400像素</div>
					</div>
					<div className="content__cover-wrap">
						<img src={"http://s1.jiguo.com/" + this.state.fileid + "/640?imageView2/1/w/640/h/247/q/100"}/>
						<input type="hidden" value={this.state.fileid} name="fileid"/>
					</div>
					<div className="content__cover-uploadstate-bar"></div>
					<div className="content__cover-change">
						<div style={{color: '#fff', fontSize: '14px'}}>更换文章封面</div>
						<div style={{color: '#999', fontSize: '12px'}}>建议800x400像素</div>
					</div>
					<div className="content__cover-uploadstate-btn"></div>
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
			pick: '.content__cover-uploadstate-btn',
			multiple: false,
			auto: true,
			fileSingleSizeLimit: 8 * 1024 * 1024,
			fileVal: 'upfile',
			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif'
			}
		});
		var cover_file_obj = null;
		var uploadstatusbar = jQuery('.content__cover-uploadstate-bar');
		var content__cover = jQuery('.content__cover');

		uploader.on('beforeFileQueued', function (file) {
			if (file.size >= sizeMax * 1024 * 1024) {
				dialog.toast('图片不能超过' + sizeMax + 'M');
				return false;
			}
			if (cover_file_obj) {
				uploader.removeFile(cover_file_obj, true);
				cover_file_obj = null;
			}
		});

		uploader.on('fileQueued', function (file) {
			cover_file_obj = file;
			content__cover.removeClass('success').addClass('uploading');
			uploadstatusbar.css('width', '0%');
		});

		uploader.on('uploadProgress', function (file, percentage) {
			uploadstatusbar.css('width', percentage * 100 + '%');
		});

		uploader.on('uploadSuccess', function (file, respon) {
			if (respon.url) {
				_this.setState({
					cover: respon.url,
					fileid: respon.url.match(/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i)[1]
				});
				content__cover.removeClass('error uploading').addClass('success');

				_this.timer && clearTimeout(_this.timer);
				_this.timer = setTimeout(() => {
					_this.props.parent.autoSave();
				}, 500);

			} else {
				dialog.toast('上传错误');
			}

			if (cover_file_obj) {
				uploader.removeFile(cover_file_obj, true);
				cover_file_obj = null;
			}
		});

	}
}

export default Cover;








