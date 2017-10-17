<template>
  <li :class="item.status">
    <div class="material__item-inner material__item-inner-show-larg">
      <div class="material__item-content">
        <div class="material__thumbview">
          <img :src="item.src||item.base64"/>
        </div>
      </div>
      <div v-if="item.status=='uploading'" class="material__progressbar-wrap">
        <div class="material__progressbar" :style="`width:${item.progress}%`"></div>
      </div>

      <div class="material__hover-look-text" @click="insertImage(item)">点击插入</div>

      <div class="material__upload-replay" @click="$refs['upload'].reUploadFile(item)">
        <div><img :src="require('./../../UEditor/themes/jiguo/icon/message_shoe.svg')"/></div>
        <div style="margin-top: 10px">上传失败<br/>点击重传</div>
      </div>

      <div @click="$refs['upload'].deleteFile(item)" class="material__delete">
        <img :src="require('./../../UEditor/themes/jiguo/icon/close_show.svg')"/>
      </div>

    </div>
  </li>
</template>
<script>

	export default {
		props: {
			item: {
				type: Object,
				required: true
			}
		},
		data() {
			return {}
		},

	}
</script>

<style lang="less" scoped>

  @height: 110px;
  @width: @height;
  .item {
    width: 49.99%;
    float: left;
    overflow: hidden;
    cursor: pointer;
    height: @height + 10px;
    &:nth-child(even) {
      text-align: right;
    }
  }

  .material__item-inner {
    position: relative;
    width: @width;
    height: @height;
    overflow: hidden;
    display: inline-block;
    box-shadow: 0 0 0px 1px #F2F2F2 inset;
  }

  .material__item-content {
    position: relative;
    display: table;
  }

  .material__progressbar-wrap {
    position: absolute;
    width: 60px;
    height: 5px;
    text-align: center;
    bottom: 10px;
    left: 50%;
    margin-left: -30px;
    border: 1px solid #fff;
    & .material__progressbar {
      width: 0%;
      height: 100%;
      left: 0;
      top: 0;
      background: #fff;
    }
  }

  .material__uploadstate {
    position: absolute;
    width: 100%;
    left: 0;
    text-align: center;
    color: #fff;
    bottom: 20px;
  }

  .material__thumbview {
    overflow: hidden;
    height: 110px;
    width: 110px;
    position: relative;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    img {
      height: 100%;
      width: 100%;
      min-height: 110px;
      min-width: 110px;
    }
  }

  .material__filename{
    line-height: 20px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .material__rotation,
  .material__delete{
    position: absolute;
    color: #585858;
    line-height: 20px;
    width: 20px;
    height: 20px;
    overflow: hidden;
    cursor: pointer;
    right: 21px;
    top:0px;
    background: #000;
    text-align: center;
    display: none;
    img{
      width: 11px;
      height: 11px;
    }
  }
  .material__tips-text-box{
    display: none;
  }
  .material__delete{
    right: 0px;
  }

  .material__img-uploading{
    display: none;
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    color: #fff;
    text-align: center;
    line-height: @height;
  }

  .material__upload-btn-addr{
    border:1px dashed #CCCCCC;
    box-sizing: border-box;
  }
  .material__upload-btn-box{
    position: absolute;
    width: 100%;
    text-align: center;
    top: 25%;
  }
  .material__upload-replay{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background: rgba(0,0,0,0.4);
    line-height: 18px;
    color: #fff;
    padding-top: 20px;
    display: none;
  }
  .material__hover-look-text{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    line-height: @height;
    text-align: center;
    background: rgba(0,0,0,0.4);
    color: #fff;
    font-size: 12px;
  }

  .material__uploadstate,
  .material__progressbar-wrap,
  .material__upload-replay,
  .material__rotation,
  .material__img-uploading,
  .material__delete,
  .material__hover-look-text{
    display: none;
  }

  .item.uploading{
    .material__uploadstate,
    .material__progressbar-wrap{
      display: block;
    }
    //&:hover{
    //  .material__delete{
    //    display: block;
    //  }
    //}
  }
  .item.success{
    &:hover{
      .material__delete,
      .material__rotation,
      .material__hover-look-text{
        display: block;
      }
    }
  }

  .item.error{
    .material__upload-replay{
      display: block;
    }
    .material__hover-look-text{
      display: none !important;
    }
    &:hover{
      .material__delete{
        display: block;
      }
    }
  }

  .item.loading{
    .material__img-uploading{
      display: block;
    }
    .material__hover-look-text{
      display: none !important;
    }
    &:hover{
      .material__delete,
      .material__rotation{
        display: block;
      }
    }
  }

</style>