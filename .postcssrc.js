/*
是 PostCSS 配置文件  基于nodejs实现的也是基于他编写的代码
*/
module.exports = {
    // plugins 用于配置要使用的 PostCSS 插件
    plugins: {
        // 配置要使用 autoprefixer 插件
        // 作用 ： 生成浏览器 CSS 样式规则前缀

        // 配置后重启项目时产生警告的原因：
        // VueCLI 内部已经配置了 autoprefixer  插件
        // 所以这边又配置就产生了冲突 所有需要把这边的配置 注释掉

        // 'autoprefixer': { // autoprefixer 插件的配置
        //     // 配置要兼容到的环境信息版本
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },

        // 配置使用 postcss-pxtorem 插件
        // 作用 ：把 px 转为 rem 
        'postcss-pxtorem': {
            // lib - flexible 的 REM 适配方案： 把一行分为10份  每份就是十分之一
            // 所有 rootValue 应该设计为你要设计项目的十分之一 (宽度)
            // 我们设计稿的宽度是 750  所以要设置为75
            // 但是 Vant 建议设置为 37.5 原因是  Vant 是基于375写的
            // 所有必须设置为 37.5  唯一的缺点就是使用设计稿的尺寸要/2换算 （按实际换算）
            // 怎么设置不同的样式按照不同的数值转换呢？
            // 通过查阅文档 我们发现 rootValue 支持两种类型一种是数字 ，一种是函数
            // 函数可以动态处理返回
            //  postcss-pxtorem 处理每个 CSS 文件的时候 都会来调用这个函数
            // 它会把处理的 CSS 文件相关的信息通过参数传递给该函数
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },

            // rootValue: 37.5,
            // 配置要转换的 CSS属性 * 表示所有属性
            propList: ['*'],

            // 配置不要转换的样式资源
            exclude: 'github-markdown'
        }
    }
}