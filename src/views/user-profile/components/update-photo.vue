<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
// 截图插件地址 https://github.com/fengyuanchen/cropperjs#getcroppedcanvasoptions
import { updateUserPhoto } from "@/api/user";

export default {
  name: "updatePhoto",
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null,
    };
  },
  mounted() {
    // 因为要 操作 dom 所以要写在这里面

    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      //  定义裁剪器的视图模式。如果你将viewMode设置为0，裁剪框可以延伸到画布之外，而值为1、2或3将限制裁剪框到画布的大小。viewMode为2或3会额外地将画布限制在容器上。当画布和容器的比例相同时，2和3没有区别。
      viewMode: 1,
      //定义裁剪机的拖动模式。  crop  move none 三种模式
      dragMode: "move",
      //定义裁剪框的初始纵横比。默认情况下，它与画布(图像包装器)的长宽比相同  (16/9)。
      aspectRatio: 1,
      // 自动截取的区域
      autoCropArea: 1,
      // 截图区域是否可以移动 默认可以
      cropBoxMovable: false,
      // 截图区域是否可以缩放 默认可以
      cropBoxResizable: false,
      // 默认背景  不需要的情况要设置为 false
      background: false,
      // 背景图像 （所选的图片） 是否可以移动 默认就是true
      //   movable: true,  // 可不写
    });
  },
  methods: {
    // 基于服务端的裁剪 使用 getData 方法 需要把得到的参数传给服务端
    onConfirm() {
      // 基于服务端的裁剪 this.cropper.getData(); 得到的是 要裁切 与原图的关系 及需要裁切图片的大小
      //   console.log(this.cropper.getData());

      // 基于客户端的裁切 使用 getCroppedCanvas 方法  获取裁切的文件对象  兼容性相对较差
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto();
      });
    },

    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });

      try {
        // 错误的用法
        // 如果接口要求 Content-Type 是 application/json
        // 则传递普通 JavaScript 对象
        // updateUserPhoto({
        //   photo: blob,
        // });
        // 如果接口要求 Content-Type 是 multipart/form-data
        // 则你必须传递 FormData 对象
        const formData = new FormData();
        formData.append("photo", blob);

        const { data } = await updateUserPhoto(formData);
        // 关闭弹出层
        this.$emit("close");

        // 更新视图
        this.$emit("update-photo", data.data.photo);

        // 提示成功
        this.$toast.success("更新成功");
      } catch (err) {
        this.$toast.fail("更新失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    //  display:flex意思是弹性布局,它能够扩展和收缩 flex 容器内的元素,以最大限度地填充可用空间。
    display: flex;
    // 使其左右两端对齐
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>