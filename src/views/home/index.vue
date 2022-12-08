<template>
  <div class="home-container">
    <!-- 导航栏  fixed 固定定位 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 频道列表 -->
    <!-- 
      通过 v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
    通过 animated 属性可以开启切换标签内容时的转场动画。
    通过 swipeable 属性可以开启滑动切换标签页。
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <ArticleList :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/article-list.vue";
import ChannelEdit from "./components/channel-edit.vue";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit,
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false, // 控制编辑弹出层的显示状态
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {},
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        // const { data } = await getUserChannels();
        // this.channels = data.data.channels;
        let channels = [];

        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const loadChannels = getItem("TOUTIAO_CHANNELS");
          // 有，拿来用
          if (loadChannels) {
            channels = loadChannels;
          } else {
            // 没有，请求获取默认频道列表
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }
        }
        this.channels = channels;
      } catch (err) {
        this.$toast("获取频道列表失败");
      }
    },
    onUpdateActive(index, isChennelEditShow = true) {
      // 更新激活的频道项
      this.active = index;
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow;
    },
  },
};
</script>


<style scoped lang="less">
.home-container {
  padding-top: 174px; // 87*2
  padding-bottom: 100px;
  // van-nav-bar__title 是检查元素时 看到的父元素的类名
  .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  // /deep/ 是深度作用符，能作用到一个作用域内的子组件上
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px; // 高要设置在这个位置才起效果，具体检查元素
    }
    .van-tab {
      min-width: 200px; //最小宽度
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777; //未激活时文字颜色
    }
    .van-tab--active {
      color: #333; // 激活后文字颜色
    }
    .van-tabs__nav {
      padding-bottom: 0px; // 把父元素底边距离清空 ，这样底部条才会显示
    }
    .van-tabs__line {
      // 底部条
      bottom: 8px; // 距离底部的距离
      width: 31px !important; // !importantv 增加权重
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      // 占位用的空格，避免最后一个内容被汉堡按钮遮挡
      width: 66px;
      height: 82px;
      flex-shrink: 0; // 0是 不参与剩余空间计算 默认1是参与
    }

    .hamburger-btn {
      // 汉堡按钮
      position: fixed; //固定定位
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902; // 透明度
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        // 汉堡按钮前面的灰条
        content: "";
        position: absolute;
        left: 0;
        width: 1px; // 模拟器上看不到灰条，但是手机上是可以看到的
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain; // 填充形式 长边全部显示出来
      }
    }
  }
}
</style>