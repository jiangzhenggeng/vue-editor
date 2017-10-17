<template>
  <div class="content__header">
    <div class="content__header fixed">
      <div class="content__header-inner main clear">
        <div class="content__header-nav">
          <a href="/user/article.html">我的文章</a> > <a href="/user/article.html?draft=1" v-if="blogid>0">草稿箱</a><a
          href="javascript:;" v-else>写文章</a>
        </div>
        <div class="content__header-right">
          <div class="content__header-btn preview">
            <input value="预览" class="preview__btn-submit" type="submit"/>
          </div>
          <div class="content__header-btn pullout-fullscreen">退出全屏</div>
          <div class="content__header-btn post-article">发表</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
				blogid: window.__BLOG_ID__
			}
		}
	}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .content__header {
    background: #FFFFFF;
    box-shadow: 0 1px 0 0 #EEEEEE;
    height: 60px;
    box-sizing: border-box;
    .fixed {
      position: fixed;
      top: 0;
      width: 100%;
      left: 0;
      z-index: 10;
    }
  }

  .content__header-inner {
    height: 100%;
    color: #999;
    font-size: 14px;
  }

  .content__header-nav {
    line-height: 60px;
    float: left;
    padding-left: 1px;
  }

  .content__header-right {
    float: right;
    line-height: 60px;
    vertical-align: middle;
  }

  .content__header-btn {
    line-height: 32px;
    height: 32px;
    width: 90px;
    text-align: center;
    font-size: 12px;
    color: #333333;
    background-color: #E9E9E9;
    border: 1px solid #E9E9E9;
    display: inline-block;
    user-select: none;
    cursor: pointer;
    &.pullout-fullscreen {
      color: #fff;
      background: #F66039;
      border: 1px solid #D5370E;
      margin-left: 10px;
      display: none;
    }
    &.post-article {
      margin-left: 10px;
    }
    &.preview input[type=submit] {
      display: block;
      line-height: normal;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    &.btn-red {
      & {
        color: #fff;
        background: #F66039;
        border: 1px solid #D5370E;
      }
      input[type=submit] {
        color: #fff;
      }
    }
  }
</style>





