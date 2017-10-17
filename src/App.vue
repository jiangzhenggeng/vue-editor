<template>
  <div class="container">
    <loading v-show="show" />
    <browser-update v-if="show_update" />
    <router-view/>
  </div>
</template>

<script>
	import {mapState} from 'vuex'

	export default {
		computed: {
			...mapState([
				'show',
        'show_update'
			])
		}
	}
</script>

<style lang="less" rel="stylesheet/less">

</style>
