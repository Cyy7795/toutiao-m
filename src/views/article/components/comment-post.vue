<template>
  <div class="comment-post">
    <!--  trim 去除首位空格 不影响视图 -->
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <!-- disabled 属性，使得按钮处于禁用状态 -->
    <van-button class="post-btn" @click="onPost" :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from "@/api/comment";
export default {
  name: "CommentPost",
  components: {},
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      this.$toast.loading({
        // 代码来自于vant组件库 Toast轻提示
        message: "发布中...",
        forbidClick: true, // 禁用背景点击
        duration: 0, // 持续时间  默认两秒 (2000) ，如果为0 就会持续展示
      });
      try {
        const { data } = await addComment({
          target: this.target.toString(), // 评论的目标id （评论文章就是文章id，对评论进行评论就是评论id）
          content: this.message, //评论内容
          art_id: this.articleId ? this.articleId.toString() : this.articleId, // 文章的id (对评论内容发表回复时，需要传递此参数，表明所属文章id，对文章进行评论，不要传此参数)
        });

        // 清空文本框
        this.message = "";
        this.$emit("post-success", data.data);

        this.$toast.success("发布成功");
      } catch (err) {
        this.$toast.fail("发布失败");
      }
    },
  },
};
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
