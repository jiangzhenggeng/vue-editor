<template>
  <div
    class="change__wrap"
    ref="change__wrap"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    v-if="describe"
  >
    <div class="change__left">
      <img :src="`${require('./../UEditor/themes/jiguo/icon/gantanhao.svg')}`"/>
      <div class="change__left-title">修改建议</div>
    </div>
    <div ref="change__body" class="change__body" :class="show">
      <div class="change__body-inner">
        <div class="change__body-title">修改建议</div>
        <div class="change__body-desc">{{ describe | describe }}</div>
      </div>
    </div>
  </div>
</template>

<script>

	export default {
		data() {
			return {
				describe: window.__BLOG_DATA__?window.__BLOG_DATA__.describe:'',
				show: false
			}
		},
		methods: {
			mouseenter() {
				$(this.$refs['change__wrap']).fadeIn(() => {
					this.show = true;
				});
				this.timer && clearTimeout(this.timer);
			},
			mouseleave() {
				this.timer = setTimeout(() => {
					$(this.$refs['change__body']).fadeOut(() => {
						this.show = false;
					})
				}, 1000);
			}
		},
		filter: {
			describe(str) {
				return (str || '').replace(/\n/g, '<br>');
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less" scoped="true">
  .change__wrap {
    z-index: 3;
    position: fixed;
    width: 36px;
    text-align: center;
    background: #FDE693;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.10);
    border-radius: 4px 0 0 4px;
    color: #724829;
    font-size: 14px;
    .change__left {
      padding: 10px 8px;
      box-sizing: border-box;
      line-height: 20px;
    }
    .change__left-title {
      margin-top: 5px;
      font-weight: 400;
    }
    .change__body-title {
      font-size: 16px;
      font-weight: 600;
    }
    .change__body {
      position: absolute;
      background: #FDE693;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.10);
      border-radius: 0 4px 4px 0;
      padding: 18px;
      width: 200px;
      left: 36px;
      top: 0;
      text-align: left;
      min-height: 125px;
      box-sizing: border-box;
      display: none;
      &.show {
        display: block;
      }
    }
  }
</style>





