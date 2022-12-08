<template>
  <!--  只有 List 在可是范围内才会检查滚动位置触发  onLoad 
  :immediate-check="false"  关闭首次初始检查
   -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item.vue";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      // 不设置为必须  这样需要时就传值，不需要也不影响运行
      default: () => [], // vue 中数组或者对象给默认值要以这种形式
    },
    type: {
      type: String,
      // 自定义 prop 数据验证  得到的结果是布尔值
      validator(value) {
        return ["a", "c"].includes(value);
      },
      default: "a",
    },
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, //获取下一页数据的标记
      limit: 10,
      error: false,
    };
  },
  created() {
    // 当你手动初始 onLoad 的话 ，他不会自动开始初始 loading
    // 所以要手动开启
    this.loading = true;
    this.onLoad();
  },
  methods: {
    async onLoad() {
      try {
        //   渲染页面的时候就先调用，这样才能让还没翻到评论的的时候就显示出评论的数量
        //   唯一的区别是接口参数不一样
        //   type
        //    a  文章的评论
        //    c  评论的回复
        //    source
        //    获取文章的评论：传递文章的 id
        //    获取评论的回复：传递评论的 id

        // 1、请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          //  toString() 是因为  source 里面传递的数据 可能超出安全整数范围
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, //	获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });
        // 2、将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);

        // 把文章的总评论数量传递到外部
        this.$emit("onload-success", data.data);

        // 3、将 loading 设置为 false
        this.loading = false;
        // 4、判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id;
        } else {
          // 没有就把 finished 设置为 结束
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
</style>