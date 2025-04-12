<template>
  <div class="start-page">
    <div class="bk"></div>
    <img src="../../assets/images/gif_logo_opt.gif" alt="" />
    <div class="form">
      <h3>Channel Impact</h3>
      <h3>and</h3>
      <h3>ROI Analysis</h3>
      <h3>Platform</h3>
      <router-link to="/group">
        <a href="">Start</a>
      </router-link>
    </div>
  </div>
</template>
<script setup></script>

<style lang="less" scoped>
.start-page {
  .bk {
    background: url(../../assets/images/bk.jpg) no-repeat center center;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    position: relative;
    filter: blur(10px);
    z-index: -1;
  }

  & > img {
    position: absolute;
    width: 106px;
    height: 34px;
    top: 10%;
    left: 10%;
  }
  .form {
    position: absolute;
    background-color: #f36633;
    color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    border-radius: 20px;
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
}
</style>
