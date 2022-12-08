<template>
  <!--  vant 组件库自带图标
     实心图标： star  
     空心图标：star-o
 -->
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value,
    }"
    @click="onCollect"
    :loading="Loading"
  />
</template>

<script>
import { addCollect, deleteCollect } from "@/api/article";
export default {
  name: "CollectArticle",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      Loading: false,
    };
  },
  methods: {
    async onCollect() {
      this.Loading = true;
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId);
        } else {
          // 没有收藏，添加收藏
          await addCollect(this.articleId);
        }
        // 更新视图
        this.$emit("input", !this.value);
        // 自定义时间修改数据并不是立即的
        this.$toast.success(!this.value ? "收藏成功" : "取消收藏");
      } catch (err) {
        this.$toast.fail("操作失败，请重试！");
      }
      this.Loading = false;
    },
  },
};
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>