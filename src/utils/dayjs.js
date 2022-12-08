import Vue from 'vue'
import dayjs from 'dayjs'


// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用 处理相对时间 relativeTime 的插件
dayjs.extend(relativeTime)

// dayjs 默认语言是英文，我们这里配置为中文

dayjs.locale('zh-cn') // 全局使用

// 定义一个全局过滤器 ,然后就可以再任何组件的模板中使用了 ，方便复用
// 其实过滤器相当于一个全局可用的方法(仅供模板使用)
// 参数一：过滤器名称，不要重复就可以
// 参数二：过滤器函数

// 使用方式 ： {{ 表达式 | 过滤器名称}}
// 管道符前面的 表达式的结果 会作为参数传到过滤器函数中
// 过滤器返回值会渲染到使用过滤器的模板位置

Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})

// dayjs() 是获取当前最新时间   要再 main.js里面配置
// console.log(dayjs().format('YYYY-MM-DD'));

// console.log(dayjs().to(dayjs('1990-01-01')));


