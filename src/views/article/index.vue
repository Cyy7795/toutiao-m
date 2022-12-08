<template>
  <!-- 11 -->
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="头条新闻"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <!--  通过 判断 article 中的任一数据 来判断请求是否成功 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <!--  发布者名称 -->
          <!-- {{ article.aut_name }} -->
          <div slot="title" class="user-name">***作者</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- 给组件的样式会作用到组件的根节点 
          模板中的 $event  是事件参数
          当我们传递给子组件的数据既要用，还要改
          传递：props
            :is-followed="article.is_followed"
          修改:自定义事件
            @update-is_followed="article.is_followed = $event"
          
          简写方式： 在组件上使用 v-model
            会自动传递一个名字叫 value的数据  如下：
            value="article.is_followed"
            会自动监听一个事件：
            @input="article.is_followed = $event"

             如果需要修改v-model 的规则名称，可以通过子组件的model属性来配置修改

            一个组件上只能使用一次v-model
            如果有多个数据需要实现类型v-model 的效果，咋办
            可以使用属性的 .sync 修饰符。
          -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
          <!-- <van-button    // 单独封装方便复用
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
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
            :loading="followLoading"
            @click="onFollow"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章的评论列表 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        />
        <!-- /文章的评论列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon
            class="comment-icon"
            name="comment-o"
            :info="totalCommentCount"
          />

          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>

        <!-- /发布评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染的 只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <!-- 
         利用 v-if 条件渲染
            true :渲染元素节点
            false：不渲染

       -->
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>

    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticlesById } from "@/api/article";
import { ImagePreview } from "vant";
import FollowUser from "@/components/follow-user";
import CollectArticle from "@/components/collect-article";
import LikeArticle from "@/components/like-article";
import CommentList from "./components/comment-list";
import CommentPost from "./components/comment-post.vue";
import CommentReply from "./components/comment-reply.vue";

// ImagePreview({
//   images: [
//     'https://cdn.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
//     'https://cdn.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
//   ],
//   // 起始位置，从0开始
//   startPosition: 1,
//   onClose () {
//     console.log('onClose')
//   }
// })

export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
  // 给所有的后代组件提供数据  后代组件需要就申明接收
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId,
    };
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, //失败的状态码
      followLoading: false, // 点击关注按钮的加载画面
      totalCommentCount: 0,
      isPostShow: false, //控制发布评论的状态
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {}, // 当前点击回复的评论项
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    // 获取文章数据的方法 （含图片）
    async loadArticle() {
      // 展示 loading 加载中
      this.loading = true;
      try {
        const { data } = await getArticlesById(this.articleId);

        // // 模拟请求出错
        // if (Math.random() > 0.5) {
        //   JSON.parse("zzzzzzz");
        // }

        // 数据及举动视图这件事不是立即的
        // console.log(data);
        this.article = data.data;

        // 初始化图片 点击预览
        // console.log(this.$refs["article-content"]);

        // 用延时器 确保能拿到数据更新后的影响的 DOM
        setTimeout(() => {
          this.previewImage();
        }, 0);

        // // 请求成功 关闭 loading
        // this.loading = false;
      } catch (err) {
        // this.loading = false;
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
        // console.log("获取数据失败", err);
      }
      // 无论成功还是失败，都要关闭 loading
      this.loading = false;
    },

    //关于预览图片的方法
    previewImage() {
      // 得到所有的 img 节点
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");

      // 获取所有 img 地址
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);

        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从0开始
            startPosition: index,
          });
        };
      });
    },

    //关于发布评论的方法
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false;
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj);
    },

    // 关于评论回复的方法
    onReplyClick(comment) {
      this.currentComment = comment;

      // 显示评论回复弹出层
      this.isReplyShow = true;
    },
  },
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
