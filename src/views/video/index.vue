<template>
  <div class="qa-container"  >
    <van-nav-bar
      title="视频 "
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <!-- 文字较短时，通过设置 scrollable 属性开启滚动播放 -->
    <van-notice-bar
      left-icon="volume-o"
      scrollable
      text="该页面在开发中，尽请期待！！！ "
    />
  </div>
</template>

<script>
export default {
  name: "videoIndex",
  componentsL: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less"></style>