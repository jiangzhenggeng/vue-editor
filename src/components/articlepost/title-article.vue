<template>
  <div class="content__title" ref="content__title">
    <div class="content__title-box">
		  <textarea
        :class="`content__title-textarea line${line}`"
        @keyup="keyup($event)"
        v-model="title"
        placeholder="文章标题"
        name="title"
        autoComplete="off"
        ref="textarea"
      />
      <div ref="title__len" class="title__len"/>
    </div>
    <div class="title__tips">
      <span>测评文章的标题需包含测评对象的品牌型号等信息</span>
      <span class="ml10">{{ title_number }} / 30 字</span>
    </div>
  </div>
</template>
<script>

	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				line: 1,
				title_number: 0,
			}
		},
		computed: {
			textareaLen() {
				return $(this.$refs['textarea']).width();
			}
		},
		methods: {

			keyup(e) {
				var text = e.target.value;
				var textLen = $(this.$refs['title__len']).html(text).width();
				var title_number_temp = this.chkstrlen(text);

				if (title_number_temp > 30) {
					this.title_number = 30;
					text = text.substr(0, 30);
				} else {
					this.title_number = title_number_temp;
				}
				this.title = text;
				if (textLen >= this.textareaLen) {
					this.line = 2;
				} else {
					this.line = 1;
				}
				this.$emit('change',e,text);
				this.$emit('keyup',e,text);

				this.timer && clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.$emit('autoSave');
				}, 500);
			},
			chkstrlen(str) {
				return str.length;
			}
		}
	}
</script>
<style lang="less" scoped>
  .content__title-textarea {
    color: #333;
    font-size: 32px;
  }

  .title__len {
    position: fixed;
    left: -999999px;
    font-size: 32px
  }

  .title__tips {
    color: #CCC;
    font-size: 12px
  }
</style>