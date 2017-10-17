<template>
  <div class="material__upload-wrap">
    <div class="material__wrap" :class="{show}" ref="material__wrap">
      <div class="material__wrap-scroll" ref="material__wrap_scroll">
        <ul class="clear">
          <material-btn />
          <material-cell
            v-for="item in files"
            :item="item"
            :key="item.id"
          />
        </ul>
      </div>
    </div>
    <div class="material__upload-wrap-table">
      <upload :multiple="true" :postAction="postAction" :name="'upfile'" v-model="files" ref="upload" class="material__upload-wrap-cell">
        <div class="material__upload">
          <div class="material__upload-btn">上传本地图片</div>
        </div>
        <div class="batch-upload">
          <p>批量上传文章中需要的图片，</p>
          <p>在撰文过程中将图片插入合适位置，</p>
          <p>每张限8Mb之内。</p>
        </div>
      </upload>
    </div>
  </div>
</template>
<script>
	import Upload from './../../uploader/upload.vue'
	import MaterialCell from './material-cell.vue'
	import MaterialBtn from './material-btn.vue'

	export default {
		data() {
			return {
				files: [],
				show: false,
				postAction: window.UEDITOR_CONFIG.serverUrl + '&action=uploadimage',
			}
		},
		watch: {
			files() {
				this.show = !!this.files.length
			}
		},
		components: {
			Upload,
			MaterialCell,
			MaterialBtn
		},
		mounted() {
			this.$refs['upload'].addBtn(this.$refs['upload-btn']);
		}
	}
</script>

<style lang="less" scoped>
  @import "_materialupload.less";

  .batch-upload {
    font-size: 12px;
    color: #999999;
    line-height: 17px;
    margin-top: 20px;
  }
</style>