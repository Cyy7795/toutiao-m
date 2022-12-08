// 封装本地存储数据的模块

// 存储数据
export const setItem = (key, value) => {
    // 将数组、对象类型的数据转换为 JSON 格式的字符串进行存储
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}
// 获取数据
export const getItem = key => {
    const data = window.localStorage.getItem(key)
    try {
        // 因为这边判断是不是JSON格式比较麻烦 ，所以直接这样写 
        // 当data数据是 有效的 JSON格式时 这个程序就执行成功 就会执行下面转换格式的代码
        // 如果 data数据是 不是有效的 JSON格式时 那么代码就会报错 就会执行 catch那边的代码
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}
// 删除数据
export const removeItem = key => {
    window.localStorage.removeItem(key)
}