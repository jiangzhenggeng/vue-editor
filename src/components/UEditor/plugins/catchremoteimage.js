///import core
///commands 远程图片抓取
///commandsName  catchRemoteImage,catchremoteimageenable
///commandsTitle  远程图片抓取
/**
 * 远程图片抓取,当开启本插件时所有不符合本地域名的图片都将被抓取成为本地服务器上的图片
 */
UE.plugins['catchremoteimage'] = function () {
	var me = this,
		ajax = UE.ajax,
		/////////////////////修改//////////////////////
		//每次抓取多少张
		number = me.options.catchRemoteImageNumber || 5,
		//失败后继续抓取的次数
		latsNum = me.options.catchRemoteImageFail || 3,
		currNum = 1;

	/* 设置默认值 */
	if (me.options.catchRemoteImageEnable === false) return;
	me.setOpt({
		catchRemoteImageEnable: false
	});

	me.addListener("afterpaste", function () {
		me.fireEvent("catchRemoteImage");
	});

	me.addListener("catchRemoteImage", function () {

		var catcherLocalDomain = me.getOpt('catcherLocalDomain'),
			catcherLocalDomainUse = me.getOpt('catcherLocalDomainUse'),
			catcherActionUrl = me.getActionUrl(me.getOpt('catcherActionName')),
			catcherUrlPrefix = me.getOpt('catcherUrlPrefix'),
			catcherFieldName = me.getOpt('catcherFieldName');

		var remoteImages = [],
			imgs = domUtils.getElementsByTagName(me.document, "img"),
			imgs_arr = [],
			test = function (src, urls) {
				if (src.indexOf(location.host) != -1 || /(^\.)|(^\/)/.test(src)) {
					return true;
				}
				if (urls) {
					for (var j = 0, url; url = urls[j++];) {
						if (src.indexOf(url) !== -1) {
							return true;
						}
					}
				}
				return false;
			};
		///////////////////////////////////////////////////
		for (var i = 0, ci; ci = imgs[i++];) {
			if (ci.getAttribute("word_img") || ci.getAttribute("_url") || domUtils.hasClass(ci, 'edui-faked-video')) {
				continue;
			}
			var src = ci.getAttribute("_src") || ci.src || "";
			if (src.indexOf('s1.jiguo.com') !== -1) {
				continue;
			}
			if (/^(https?|ftp|\/\/):/i.test(src) && (!catcherLocalDomainUse || test(src, catcherLocalDomain) )) {
				if (src.substr(0, 2) == '//') {
					src = 'http:' + src;
					ci.setAttribute('src', src);
				}
				remoteImages.push(src);
				imgs_arr.push(ci);
			}
		}

		/////////////////////修改//////////////////////
		var my_len = remoteImages.length;
		if (my_len) {
			for (var my_i = 0; my_i < Math.ceil(my_len / number); my_i++) {
				var fing = number * (my_i + 1);
				fing = fing > my_len ? my_len : fing;
				var showmessageid = me.trigger('showmessage', {
						content: '正在抓取中(' + fing + '/' + my_len + ')。。。',
						timeout: 2000000
					}
				);
				_catch(remoteImages.splice(0, number), imgs_arr.splice(0, number), showmessageid);
			}
		} else {
			me.trigger('showmessage', {
				content: '没有图片或已经抓取',
				timeout: 2000
			});
		}

		function _catch(remoteImages, imgs_arr, showmessageid) {
			catchremoteimage(remoteImages, {
				//成功抓取
				success: function (r) {
					try {
						var info = r.state !== undefined ? r : eval("(" + r.responseText + ")");
					} catch (e) {
						return;
					}

					/* 获取源路径和新路径 */
					var i, j, ci, cj, oldSrc, newSrc, list = info.list;

					for (i = 0; ci = imgs_arr[i++];) {
						oldSrc = ci.getAttribute("_src") || ci.src || "";
						for (j = 0; cj = list[j++];) {
							if (oldSrc == cj.source && cj.state == "SUCCESS") {  //抓取失败时不做替换处理
								newSrc = catcherUrlPrefix + cj.url;
								try {
									cj.ratio = isNaN(cj.width / cj.height) ? 0 : (cj.width / cj.height);
								} catch (e) {
									cj.ratio = 0;
								}
								domUtils.setAttributes(ci, {
									"src": newSrc,
									"_src": newSrc,
									"catchremote": true,
									"title": cj.title,
									"alt": cj.original,
									"data-original": cj.original,
									"data-img-type": cj.type ? cj.type : '',
									"data-width": cj.width,
									"data-height": cj.height,
									"data-ratio": cj.ratio,
								});
								domUtils.removeAttributes(ci, 'class');
								break;
							} else if (oldSrc == cj.source) {
								ci.getAttribute('catchremote', true);
							}
						}
					}

					/////////////////////修改//////////////////////
					currNum = 1;
					me.trigger('hidemessage', showmessageid);
					me.trigger('showmessage', {content: '抓取成功', timeout: 2000000});
					me.fireEvent("catchremotesuccess");

				},
				//回调失败，本次请求超时
				error: function () {
					currNum++;
					/////////////////////修改//////////////////////
					me.trigger('hidemessage', showmessageid);
					if (currNum <= latsNum) {
						me.trigger('showmessage', {
							content: '抓取失败,正在尝试第' + currNum + '次抓取', type: 'error', timeout: 2000
						});
						me.fireEvent("catchRemoteImage");
					} else {
						me.trigger('showmessage', {
							content: '抓取失败', type: 'error', timeout: 2000
						});
						me.fireEvent("catchremoteerror");
					}
				}
			});
		}

		function catchremoteimage(imgs, callbacks) {
			var params = utils.serializeParam(me.queryCommandValue('serverparam')) || '',
				url = utils.formatUrl(catcherActionUrl + (catcherActionUrl.indexOf('?') == -1 ? '?' : '&') + params),
				isJsonp = utils.isCrossDomainUrl(url),
				opt = {
					'method': 'POST',
					'dataType': isJsonp ? 'jsonp' : '',
					'timeout': 60000, //单位：毫秒，回调请求超时设置。目标用户如果网速不是很快的话此处建议设置一个较大的数值
					'onsuccess': callbacks["success"],
					'onerror': callbacks["error"]
				};
			opt[catcherFieldName] = imgs;
			ajax.request(url, opt);
		}

	});
};