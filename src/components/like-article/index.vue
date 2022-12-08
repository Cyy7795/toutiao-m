<template>
  <!--  接口函数中说明 1 表示用户喜欢 -->
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{
      liked: value === 1,
    }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addLike, deleteLike } from "@/api/article";
export default {
  name: "LikeArticle",
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onCollect() {
      this.loading = true;
      try {
        let status = -1; // 在接口文档中  -1 是无状态
        if (this.value === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId);
        } else {
          // 没有点赞，添加点赞
          await addLike(this.articleId);
          status = 1;
        }
        // 更新视图
        this.$emit("input", status);

        // 自定义时间修改数据并不是立即
        this.$toast.success(status === 1 ? "点赞成功" : "取消点赞");
      } catch (err) {
        this.$toast.fail("操作失败，请重试！");
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="less">
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>