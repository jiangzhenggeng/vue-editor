<template>
  <li class="material__upload-control item">
    <div class="material__item-inner" ref="upload-btn">
      <div class="material__upload-btn-box">
        <div><img :src="`${require('./../../UEditor/themes/jiguo/icon/add_img_show.svg')}`"/></div>
        <div style="color:#333333">本地图片</div>
        <div class="gray">8Mb之内</div>
      </div>
      <div class="material__upload-btn-addr" style="height:100%"></div>
    </div>
  </li>
</template>
<script>
	export default {}
</script>

<style lang="less" scoped>



</style>