<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
         Tips: 在 van-search 外层增加 form 标签，
    且 action 不为空，即可在 iOS 输入法中显示搜索按钮。
     -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from "./components/search-history";
import SearchSuggestion from "./components/search-suggestion";
import SearchResult from "./components/search-result";
import { setItem, getItem } from "@/utils/storage";
export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  data() {
    return {
      searchText: "",
      isResultShow: false, // 控制显示搜素结果
      // 通过本地存储拿到的数据如果有效，我们就拿过来用，无效就给他一个空数组
      searchHistories: getItem("TOUTIAO_SEARCH_HISTORIES") || [], // 搜索的历史记录数据
    };
  },
  watch: {
    searchHistories(value) {
      setItem("TOUTIAO_SEARCH_HISTORIES", value);
    }, // 简写

    // searchHistories: {  // 完整写法
    //   handler() {},
    // },
  },
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val;

      // 存储历史记录
      // 要求：
      // 1、 不要有重复数据(没有相同数据时返回-1)
      // 2、 最新的排在最前面
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }

      this.searchHistories.unshift(val);

      // 渲染搜索结果
      this.isResultShow = true;
    },
    onCancel() {
      // 点击取消返回首页
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>