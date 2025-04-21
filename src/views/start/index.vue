<template>
  <div class="start-page">
    <img src="../../assets/images/gif_logo_opt.gif" alt="" />
    <el-row class="content">
      <el-col :span="8" class="left">
        <div class="form">
          <h3>Channel Impact</h3>
          <h3>and</h3>
          <h3>ROI Analysis</h3>
          <h3>Platform</h3>
          <!-- <router-link to="/group">
            <a href="">Start</a>
          </router-link> -->
        </div>
      </el-col>
      <el-col :span="16">
        <el-card class="login-wrap">
          <el-form label-position="top" label-width="auto" :model="data.formLogin">
            <el-form-item label="Username">
              <el-input v-model="data.formLogin.username" />
            </el-form-item>
            <el-form-item label="Password">
              <el-input v-model="data.formLogin.password" />
            </el-form-item>
          </el-form>
          <el-button type="primary">Sign in</el-button>
        </el-card>
        <el-card class="saml-wrap"> 
          <p>Sign in with</p>
          <el-button>SAML</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
const data = reactive({
  formLogin: {
    username: '',
    password: '',
  },
})
</script>

<style lang="less" scoped>
.start-page {
  background: url(../../assets/images/bk.png) no-repeat center center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  // .bk {
  //   background: url(../../assets/images/bk.jpg) no-repeat center center;
  //   background-size: cover;
  //   width: 100vw;
  //   height: 100vh;
  //   position: relative;
  //   filter: blur(10px);
  //   z-index: -1;
  // }

  & > img {
    position: absolute;
    width: 106px;
    height: 34px;
    top: 10%;
    left: 10%;
  }
  .form {
    position: relative;
    color: #f36633;
    top: 32vh;
    font-weight: bolder;
    & > h3 {
      font-size: 62px;
      text-align: right;
      margin-bottom: 10px;
      font-style: italic;
    }
    & > a {
      display: inline-block;
      width: 263px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #f36633;
      background-color: #fff;
      font-size: 32px;
      border-radius: 10px;
      font-weight: bold;
      margin-top: 20px;
    }
  }
  .login-wrap {
    width: 70%;
    margin: 20vh auto 0 auto;
  }
  .saml-wrap {
    width: 70%;
    margin: 1vh auto 0 auto;
  }
}
</style>
