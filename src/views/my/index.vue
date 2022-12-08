<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <!-- fit="cover" 是图片的显示方式 把短边显示出来 在 vant 组件中看 -->
          <van-image class="avatar" :src="userInfo.photo" round fit="cover" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->

    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 宫格导航 老师写的是 class="grid-nav mb-9"   -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <!-- 消息通知，小智同学 ，退出登录 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link class="mb-9" />
    <van-cell
      v-if="user"
      title="退出登录"
      clickable
      class="logout-cell"
      @click="onLogout"
    />
    <!-- /消息通知，小智同学 ，退出登录 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";

export default {
  name: "myIndex",
  componentsL: {},
  props: {},
  data() {
    return {
      userInfo: {}, // 用户信息
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {},
  created() {
    // 判断的意思是 如果用户登录了，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo();
    }
  },
  mounted() {},
  methods: {
    onLogout() {
      // 退出提示
      // 在组件中 需要使用 this.$dialog 来调用弹窗组件
      this.$dialog
        .confirm({
          title: "确认退出吗？",
        })
        .then(() => {
          // on confirm
          // 确认退出以后：清除登录状态 （就是清除容器中的 user + 本地存储中的 user）
          // 调用mutations里的setUser方法 传入 null 替换容器和本地数据 存储的 user 值 达到清除登录状态的结果
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          //取消执行这里
          // on cancel
          console.log("");
        });
    },

    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        this.userInfo = data.data;
      } catch (err) {
        this.$toast("获取数据失败，请稍后重试");
      }
    },
  },
};
</script>

<style scoped lang="less">
.my-container {
  // 背景的样式及图片地址
  .header {
    height: 361px;
    background: url("~@/assets/banner.png"); // 在css 中使用 @ 指代 src路径下 需要在前面加一个~
    background-size: cover; // 背景自动填充
  }
  // 图片及文字的样式
  .not-login {
    display: flex;
    justify-content: center; // 水平居中
    align-items: center; // 垂直居中
    .login-btn {
      // 文字的排列
      display: flex;
      flex-direction: column; // 排列方式 水平排列
      justify-content: center; // 水平居中
      align-items: center; // 垂直居中
      .mobile-img {
        //图片的大小及与文字的间距
        width: 132px;
        height: 132px;
        margin-bottom: 15px; // 文字和图片的间距
      }
      .text {
        // 文字的大小及颜色
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box; //设置高度把边框都包含其中
      display: flex;
      justify-content: space-between; //往两边去撑开
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column; // 让内容垂直分布
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>