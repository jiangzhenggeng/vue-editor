<template>
  <div class="cover__wrap" :class="uploading" ref="cover__wrap">
    <div class="cover__cover-box">
      <div class="cover__cover-icon">
        <div><img src="./../../UEditor/themes/jiguo/icon/cover_show.svg"/></div>
        <div class="cover__upload">上传文章封面</div>
        <div class="cover__upload-tips">建议尺寸800x400像素</div>
      </div>
      <div class="cover__cover-wrap" v-if="fileid || file && file.base64">
        <img :src="fileid?`http://s1.jiguo.com/${fileid}/640?imageView2/1/w/640/h/247/q/100`:file.base64"/>
      </div>
      <div class="cover__cover-uploadstate-bar" :style="`width: ${width}`"></div>
      <div class="cover__cover-change">
        <div class="cover__change-c">更换文章封面</div>
        <div class="cover__change-c-tips">建议800x400像素</div>
      </div>
      <div class="cover__cover-uploadstate-btn">
        <upload
          :multiple="false"
          :postAction="postAction"
          :name="'upfile'"
          v-model="files"
        />
      </div>
    </div>
  </div>
</template>
<script>
	import {mapActions} from 'vuex'
	import Upload from './../../uploader/upload.vue'

	export default {
		data() {
			return {
				uploading: false,
				fileid: '',
				files: [],
				file: null,
				width: '0%',
				postAction: window.UEDITOR_CONFIG.serverUrl + '&action=uploadimage',
        match_field:/https?:\/\/s1\.jiguo\.com\/([\w\-]+)\/?/i
			}
		},
		watch: {
			files() {
				this.file = this.files[0];
				this.uploading = this.file.status;
				this.width = this.file.progress + '%';
				if (
					this.file.response &&
          this.file.response.state=='SUCCESS' &&
					this.file.response.url
        ) {
					if( this.file.response.url.match(this.match_field) ){
						this.fileid = this.file.response.url.match(this.match_field)[1]
					}
				}
			}
		},
		components: {
			Upload
		},
		methods: {
			...mapActions([
				'showBrowseUpdate'
			])
		}
	}
</script>

<style lang="less" scoped>

  @h: 304px;
  .cover__wrap {
    color: #999;
    height: @h;
    background-image: url(./../../../style/images/cover_bg.svg);
    cursor: pointer;
  }

  .cover__upload {
    font-size: 18px;
    margin-top: 10px;
  }

  .cover__upload-tips {
    font-size: 14px;
  }

  .cover__change-c {
    color: #fff;
    font-size: 14px
  }

  .cover__change-c-tips {
    color: #999;
    font-size: 12px
  }

  .cover__cover-box {
    height: @h;
    text-align: center;
    overflow: hidden;
    position: relative
  }

  .cover__cover-icon {
    position: absolute;
    left: 50%;
    margin-left: -60px;
    top: 50%;
    margin-top: -63px;
  }

  .cover__cover-uploadstate-bar {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #F66039;
    width: 0%;
    height: 2px;
    display: none;
  }

  .cover__cover-change {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #000;
    width: 120px;
    height: 45px;
    text-align: center;
    line-height: 16px;
    padding-top: 8px;
    box-sizing: border-box;
    display: none;
  }

  .cover__cover-uploadstate-btn {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .cover__cover-wrap {
    display: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }

  .cover__wrap {
    &.success {
      .cover__cover-change {
        display: block;
      }
      .cover__cover-icon {
        display: none;
      }
      .cover__cover-wrap {
        display: block;
      }
    }
    &.uploading {
      .cover__cover-uploadstate-bar {
        display: block;
      }
      .cover__cover-wrap {
        display: block;
      }
      .cover__cover-icon {
        display: none;
      }
    }
  }
</style>