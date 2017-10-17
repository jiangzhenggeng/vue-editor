import React from 'react';

import DialogBase from './dialogbase';
import dialog from './../toast/dialog';


class CreatePreviewVideo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			id: String('id' + Math.random()).replace('.', ''),
			tips: '',
			url: '',
			check: 'check'
		};
	}

	render() {
		var url = this.unhtmlForUrl(this.convert_url(this.state.url));
		var _url2 = this.unhtmlForUrl(this.convert_url(this.state.url, true));

		var body = '';
		if (this.state.url && !url) {
			body = (
				<div className="previewvideo__msg">
					<span className="previewvideo__msg-tps-text">不支持该地址</span>
				</div>
			);
			this.state.check = 'cansel';
		}

		if (!this.state.url) {
			body = (
				<div className="previewvideo__msg">
					<div><img src={require('./icon/video_cover.svg')}/></div>
				</div>
			);
			this.state.check = 'cansel';
		}

		return (
			<div className="video__wrap">
				<div className="video__input-box">
					<input
						placeholder="粘贴视频地址并键入回车，目前支持优酷、腾讯视频、搜狐视频的视频链接"
						defaultValue={this.state.url}
						onChange={event => {
							this.setState({
								url: event.target.value
							});
							this.onChangeVal();
						}}
					/>
				</div>
				<div className="video__body">
					{body ? body :
						<div style={{position: 'relative', height: 350, width: 640, overflow: 'hidden'}}>
							<div className="previewvideo__msg">
								{this.state.tips ? this.state.tips : <span className="previewvideo__msg-tps-text">正在检测中...</span>}
							</div>
							<div className="previewvideo__video" ref={o => this.videoBox = o}>
								<iframe
									style={{margin: 'auto', display: 'block'}}
									id={this.state.id}
									name={this.state.id}
									src={_url2}
									width={640}
									height={350}
									frameBorder={'none'}
									className="edui-faked-video"
								/>
								<div style={{display: 'none'}} className="video-wrap-box">
									<img
										width="640"
										height="350"
										data-url={url}
										className="edui-faked-video"
										src={window.UEDITOR_CONFIG.UEDITOR_HOME_URL + "themes/default/images/spacer.gif"}
										style={{
											margin: 'auto',
											background: 'url(' + window.UEDITOR_CONFIG.UEDITOR_HOME_URL + 'themes/default/images/videologo.gif) no-repeat center center',
											border: '1px solid gray'
										}}
									/>
								</div>
							</div>
						</div>}
				</div>
				<div className="video__footer">
					<div className="video__btn video__cansel" onClick={this.props.parent.close.bind(this.props.parent)}>取消</div>
					<div id="video__btn-check-wrap" className={'video__btn video__' + this.state.check}
							 onClick={this.insertVideo.bind(this)}>
						<span className="video__btn-text">确认</span>
						<img src={require('./icon/rotation_show.svg')}/>
					</div>
				</div>
			</div>
		);
	}

	insertVideo() {
		if (this.state.check == 'ok' || this.state.check == 'check') {
			var p = jQuery(this.videoBox).find('.video-wrap-box');
			var img = p.find('[data-url]');
			img.attr('_url', img.attr('data-url')).removeAttr('data-url');
			this.props.parent.insertVideo.call(this.props.parent, '<p style="text-align: center">'+p.html()+'</p>' );
			img.attr('data-url', img.attr('_url')).removeAttr('_url');
		}
	}

	onChangeVal() {
		this.now = new Date().getTime();
		this.loadVideo();
	}

	loadVideo() {
		var _this = this;
		_this.setState({
			tips: <span style={{color: 'green'}}>检测通过</span>,
			check: 'ok'
		});

		if (new Date().getTime() - this.now > 12000) {
			this.setState({
				tips: <span style={{color: 'red'}}>检测失败</span>,
				check: 'cansel'
			});
		}
	}

	unhtmlForUrl(str, reg) {
		return str ? str.replace(reg || /[<">']/g, function (a) {
			return {
				'<': '&lt;',
				'&': '&amp;',
				'"': '&quot;',
				'>': '&gt;',
				"'": '&#39;'
			}[a]

		}) : '';
	}

	convert_url(url, ifram) {
		url = String(url).replace(/^\s+|\s+$/g, '');
		if (!/^https?:\/\//i.test(url)) {
			dialog.toast('请正确填写视频地址');
			return '';
		}

		// http://my.tv.sohu.com/us/325364258/93029298.shtml
		url = url
			.replace(/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i, 'player.youku.com/player.php/sid/$1/v.swf')
			.replace(/(www\.)?youtube\.com\/watch\?v=([\w\-]+)/i, "www.youtube.com/v/$2")
			.replace(/youtu.be\/(\w+)$/i, "www.youtube.com/v/$1")
			.replace(/v\.ku6\.com\/.+\/([\w\.]+)\.html.*$/i, "player.ku6.com/refer/$1/v.swf")
			.replace(/www\.56\.com\/u\d+\/v_([\w\-]+)\.html/i, "player.56.com/v_$1.swf")
			.replace(/www.56.com\/w\d+\/play_album\-aid\-\d+_vid\-([^.]+)\.html/i, "player.56.com/v_$1.swf")
			.replace(/v\.pps\.tv\/play_([\w]+)\.html.*$/i, "player.pps.tv/player/sid/$1/v.swf")
			.replace(/www\.letv\.com\/ptv\/vplay\/([\d]+)\.html.*$/i, "i7.imgs.letv.com/player/swfPlayer.swf?id=$1&autoplay=0")
			.replace(/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i, "www.tudou.com/v/$1")
			.replace(/v\.qq\.com\/cover\/[\w]+\/[\w]+\/([\w]+)\.html/i, "static.video.qq.com/TPout.swf?vid=$1")
			.replace(/v\.qq\.com\/.+[\?\&]vid=([^&]+).*$/i, "static.video.qq.com/TPout.swf?vid=$1")
			.replace(/v\.qq\.com\/\w+\/\w+\/[\w]+\/([\w]+)\.html/i, "imgcache.qq.com/tencentvideo_v1/playerv3/TPout.swf?vid=$1")
			.replace(/v\.qq\.com\/\w+\/\w+\/([\w]+)\.html/i, "imgcache.qq.com/tencentvideo_v1/playerv3/TPout.swf?vid=$1")
			.replace(/my\.tv\.sohu\.com\/[\w]+\/([\d]+)\/([\d]+)\.shtml.*$/i, "tv.sohu.com/upload/static/share/share_play.html#$2_$1_0_9001_0")
			.replace(/share\.vrs\.sohu\.com\/([\w]+)\/v\.swf.*?plid=(\w+).*/i, "tv.sohu.com/upload/static/share/share_play.html#$1_$2_0_2_1");

		if (ifram) {
			function getKeyVal(src, key) {
				var matchVidArray = src.toString().split('?')[1].toString().split('&'), vid = null;
				for (var i2 = 0; i2 < matchVidArray.length; i2++) {
					if (matchVidArray[i2].split('=')[0].toLowerCase() == key) {
						vid = matchVidArray[i2].split('=')[1];
						return vid;
					}
				}
				return '';
			}

			if (url.match("v.qq.com") || url.match("video.qq.com") || url.match("imgcache.qq.com")) {
				url = 'http://v.qq.com/iframe/player.html?vid=' + getKeyVal(url, 'vid') + '&width=640&height=350&auto=0';
			} else if (url.match("youku.com")) {
				url.match(/http:\/\/player.youku.com\/player.php\/sid\/(.+)\/v.swf/);
				url = 'http://player.youku.com/embed/' + RegExp.$1;
			}
		}
		return url;
	}


}


class Video extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<DialogBase
				editor={this.props.editor}
				parent={this}
				show={this.props.editor.video_show}
				title={false}
			>
				<CreatePreviewVideo parent={this}/>
			</DialogBase>
		);
	}

	insertVideo(html) {
		this.props.editor.execCommand('inserthtml', html);
		this.close();
	}

	close() {
		this.props.editor.Component.editorDialogClose('video_show');
	}

}

Video.propTypes = {
	editor: React.PropTypes.object.isRequired
};

export default Video;