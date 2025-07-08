<template>
  <div class="header-nav">
    <span>Channel impact and ROI analysis</span>
    <img src="../assets/images/gif_logo_opt.gif" alt="" class="logo" @click="go" />
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const go = () => {
  router.push({
    name: 'group',
  })
}
</script>
<style lang="less" scoped>
.header-nav {
  height: 89px;
  line-height: 109px;

  background: url(../assets/images/top-2.png);
  background-size: cover;
  background-origin: content-box;
  position: relative;
  text-align: left;
  background-color: #f3f2f8;
  position: fixed;
  width: 100%;
  z-index: 99;

  .logo {
    width: 106px;
    height: 34px;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
  span {
    font-size: 34px;
    color: #e99d42;
    font-weight: bold;
    font-style: italic;
    float: right;
    margin-right: 170px;
  }
}
</style>
