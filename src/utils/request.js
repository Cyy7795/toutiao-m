/**
 * 封装 axios 请求模块
 */
import axios from "axios"
import store from '@/store'
import JSONBig from 'json-bigint'

// const jsonStr = '{"art_id": "90071992547409924"}'

// console.log(JSON.parse(jsonStr))

// JSONBig 可以处理数据中超出js安全整数范围的问题

// console.log(JSONBig.parse(jsonStr)) // 把JSON格式的字符串转为 js对象

// 使用的时候需要把  BigNumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString());

// JSONBig.stringify(JSONBig.parse(jsonStr)) // 把js对象转为 json格式的字符串



const request = axios.create({
    baseURL: "http://toutiao.itheima.net/", // 接口的基础路径

    // 自定义后端返回的原始数据
    // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
    transformResponse: [function (data) {
        try {
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }
        // axios 默认会在内部这样处理后端返回的数据
        // return JSON.parse(data)  //这种情况转换超出准确范围会出错
    }]

})

// 请求拦截器 
// Add a request interceptor
request.interceptors.request.use(function (config) {
    // 请求发起会经过这里 
    // config ：本次请求配置对象
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    // 注意： 这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
}, function (error) {
    // 如果请求出错了（还没有发出去） 会进入这里
    return Promise.reject(error)
})

// 相应拦截器

export default request    //导出请求对象