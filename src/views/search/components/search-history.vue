<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        <!--   &nbsp;  是空格 -->
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>

      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  props: {
    // prpo 数据   是受父组件影响的
    //   如果是普通数据（数字，字符串，布尔值）绝对不能修改
    //   即便是改了，也不会传给父组件
    //
    //  如果是引用类型数据（数组，对象）
    //   可以修改，例如 [].push（xxx） 或 对象.xxx = xxx
    //    不能重新赋值，例如 xxx = []
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteShow: false, // 控制删除显示状态
    };
  },
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.searchHistories.splice(index, 1);
      } else {
        // 非删除状态，点击进入搜索详情
        this.$emit("search", item);
      }
    },
  },
};
</script>

<style scoped lang="less">
</style>