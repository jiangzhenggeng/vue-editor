/**
 * Created by jiangzg on 2017/7/19.
 */

var throttle_fn_key = {};
var temp = '';
// 函数节流
const throttle = (method, context,time=100)=> {
    temp = method.name || method.toString();
    throttle_fn_key[temp] && clearTimeout(throttle_fn_key[temp]);  // mthod是真实要执行的函数，context是执行的作用域（默认window）
    throttle_fn_key[temp] = setTimeout(function() {
        method.call(context)   // 确保方法在适当的环境中执行
    }, time);
}

//函数防抖节流
const debounce = (method, delay = 50, duration = 100 )=>{
    temp = method.name || method.toString();
    var timer = null, stime = new Date();          // 记录下开始执行函数的时间
    return function() {
        var context = this, args = arguments,
            ctime = new Date();   // 记录下当前时间

        timer && clearTimeout(timer);     // 函数节流里的思路

        // 记录下的两个时间相减再与duration进行比较
        if (ctime - stime >= duration) {
            method.apply(context, args);
            stime = ctime;
        } else {
            timer = setTimeout(function(){
                method.apply(context, args);
            }, delay);
        }
    }
}

export default {
    throttle,
    debounce
};
