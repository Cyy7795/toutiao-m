// 用户相关请求模块

import request from '@/utils/request'
// import store from '@/store'

export const login = data => {
    return request({
        method: 'POST', // 请求方法
        url: '/v1_0/authorizations', // 请求地址
        data  // 请求体
    })
}

// 发送验证码：
// 注意每个接口每分钟只能发一次
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/v1_0/sms/codes/${mobile}`   //接口已经不能用了  246810 万能验证码
    })
}

// 获取用户自己的信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user'
        // request 中设置了请求拦截器 ，所以这边可以直接请求 
        // 发送请求头数据 headers 是固定写法
        // headers: {
        //     // 注意： 该接口需要授权 所以要提供用户的身份给后端
        //     // token的数据格式： Bearer token数据，
        //     // 注意 Bearer 后面有个空格
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}

// 获取用户频道列表 
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}

// 关注用户
export const addFollow = target => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target
        }
    })
}




// 取消关注用户
export const deleteFollow = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`
    })
}

/**
 * 获取当前登录用户的个人资料
 */
export const getUserProfile = target => {
    return request({
        method: 'GET',
        url: '/v1_0/user/profile'
    })
}

/**
 * 更新用户资料
 */
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data
    })
}

/**
 * 更新用户照片资料
 */
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data
    })
}