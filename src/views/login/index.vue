<template>
  <div class="login-container">
    <!-- 导航栏 因为整个项目导航栏的样式一样 所以写到全局样式里面-->
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- back 是路由方法里面后退的意思 -->
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 登录表单  left-icon 配置图标 -->
    <!-- 
      表单验证：
      1、 给 van-field 组件配置 rules 验证规则 https://vant-contrib.gitee.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
      2、 当表单提交的时候会自动触发表单验证，
      如果验证通过 ，会触发 submit 事件
      如果验证失败 ，不会触发 submit 事件
     -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- 利用插槽 自定义图标 -->
        <i slot="left-icon" class="toutiao toutiao-shouji"> </i>
      </van-field>

      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <!-- 利用插槽 自定义图标   native-type="button" 使点击改按钮时表单不提交-->
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time 就是倒计时时间  
          ss 是秒的格式 后面的 s 是秒的单位
          finish 是组件中倒计时结束之后触发的事件
          -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            round
            size="small"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>

      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          <!-- round 表示圆角 -->
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";

export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "13911111112", //手机号
        code: "246810", // 验证码
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/, // 用于验证手机号格式
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
      isCountDownShow: false, // 是否展示倒计时
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 关于表单验证的内容
    async onSubmit() {
      // 1. 展示登陆中 loading
      // 在组件中必须通过  this.$toast 来调用 Toast 组件
      this.$toast.loading({
        // 代码来自于vant组件库 Toast轻提示
        message: "登录中...",
        forbidClick: true, // 禁用背景点击
        duration: 0, // 持续时间  默认两秒 (2000) ，如果为0 就会持续展示
      });

      // 2. 请求登录
      try {
        // 用于捕获异常
        const { data } = await login(this.user);
        this.$store.commit("setUser", data.data);
        // 任何一个新的 toast 被调用 之前的 toast 就会关闭
        this.$toast.success("登录成功"); // success 是成功的提示

        // 登录成功，跳转回原来页面
        // back  方式代表从哪来回哪去 不严谨 ，后面功能优化再说
        this.$router.back();
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误"); // fail 是失败的提示
        } else {
          this.$toast.fail("登录失败,请稍后重试");
        }
      }
      //4.根据请求相应结果处理后续操作
    },

    // 关于发送验证码的内容
    async onSendSms() {
      // console.log("onSendSms");
      // 1、 校验手机号  validate 方法能通过名字判断验证单个表单
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("验证失败", err); // err 就是错误对象   return 是发生错误后阻止往下执行
      }

      // 2、 验证通过，显示倒计时
      this.isCountDownShow = true;

      // 3、 请求发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast("发送成功");
      } catch (err) {
        // 发送成功 关闭倒计时
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          // response.status 是相应状态
          this.$toast("发送太频繁,请稍后重试");
        } else {
          this.$toast("发送失败，请稍后重试");
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
}

.send-sms-btn {
  width: 156px; //老师的是152
  height: 46px;
  line-height: 40px; // 老师的是 46
  background-color: #ededed;
  font-size: 22px;
  color: #666;
}

.login-btn-wrap {
  padding: 53px 33px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>