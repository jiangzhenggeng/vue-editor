/**
 +----------------------------------------------------------
 //数据缓存器
 +----------------------------------------------------------
 */

import md5 from 'md5';

const cache = {
  set:function (key,data) {
    let cache_data = JSON.stringify([data||'']);
    return sessionStorage.setItem(md5(key),cache_data);
  },
  get:function (key) {
    var cache_data = sessionStorage.getItem(md5(key));
    if( !cache_data ) return '';
    try {
      cache_data = JSON.parse( cache_data );
    }catch (e){
      cache_data = [''];
    }
    return cache_data[0];
  },
  delete:function (key) {
    sessionStorage.removeItem(md5(key));
  },
  clear:function () {
    sessionStorage.clear();
  }
};


export default  cache;





