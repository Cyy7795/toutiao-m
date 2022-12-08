<template>
  <!--  因为 v-if 和 v-else 只有一个节点会被渲染出来，所以不受限于只能一个节点 -->
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";

export default {
  name: "FollowUser",
  // 通过这个来 修改v-model 的规则名称  在子组件内部修改就好，父组件不用改
  model: {
    prop: "isFollowed", // v-model  自动传递的数据名  默认是 value
    event: "update-is-followed", // v-model  自动监听的事件名  默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true,
    },
    userId: {
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
    // 关注及取消关注用户的方法
    async onFollow() {
      this.loading = true; // 展示关注按钮的 loading 状态
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId);
          // this.article.is_followed = false;
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId);
          // this.article.is_followed = true;
        }

        // 更新试图状态
        // this.article.is_followed = !this.article.is_followed;
        // 让父组件的 article.is_followed 更新
        // this.$emit("update-is_followed", !this.value);
        // this.$emit("input", !this.value);
        this.$emit("update-is-followed", !this.isFollowed);
      } catch (err) {
        let message = "操作失败，请重试！";
        if (err.response && err.response.stetus === 400) {
          message = "你不能关注你自己！";
        }
        this.$toast(message);
      }
      this.loading = false; // 关闭关注按钮的 loading 状态
    },
  },
};
</script>

<style>
</style>