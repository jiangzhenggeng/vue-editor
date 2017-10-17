<template>
  <input
    type="file"
    :name="$parent.name"
    :id="$parent.inputId"
    :accept="$parent.accept"
    :multiple="$parent.multiple"
    @change="change"
  />
</template>
<script>
	export default {
		methods: {
			change(e) {
				this.$parent.change(e)
				this.$destroy()
				new this.constructor({
					parent: this.$parent,
					el: this.$el
				})
			}
		}
	}
</script>
<style lang="less" scoped>
  input[type=file] {
    overflow: hidden;
    position: fixed;
    width: 1px;
    height: 1px;
    z-index: -1;
    opacity: 0;
  }
</style>
