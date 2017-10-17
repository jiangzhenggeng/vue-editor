<template>
  <div class="container__index">
    <form action="/article/Preview" method="post" target="_blank" id="preview__form">
      <div class="post__editor-page">
        <header-nav></header-nav>
        <div class="content__wrap main clear">
          <div class="content__left">
            <cover-article ref="cover-article"></cover-article>
            <div class="article__content">
              <title-article ref="title-article"></title-article>
              <editor></editor>
            </div>
            <haschange></haschange>
          </div>
          <div class="content__right">
            <div class="content__right-fixed">
              <div class="content__right-item">
                <div class="content__right-header">图片素材库</div>
                <div class="content__right-inner">
                  <material-upload></material-upload>
                </div>
              </div>
              <instructions></instructions>
            </div>
          </div>
        </div>
      </div>
      <order-link></order-link>
    </form>
  </div>
</template>

<script>
	import HeaderNav from '../../components/articlepost/header-nav.vue'
	import OrderLink from '../../components/articlepost/order-link.vue'
	import CoverArticle from '../../components/articlepost/cover/cover.vue'
	import TitleArticle from '../../components/articlepost/title-article.vue'
	import Haschange from '../../components/articlepost/haschange.vue'
	import Instructions from '../../components/articlepost/instructions.vue'
	import MaterialUpload from '../../components/articlepost/material/materialupload.vue'
	import Editor from '../../components/articlepost/editor/editor.vue'

	export default {
		data() {
			return {
				editor: null
			}
		},
		components: {
			HeaderNav,
			OrderLink,
			CoverArticle,
			TitleArticle,
			Haschange,
			Instructions,
			MaterialUpload,
			Editor
		},
		mounted() {

		},
		methods: {}
	}
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../style/less/post-article.less";
</style>
