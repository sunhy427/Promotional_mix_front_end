<template>
  <div class="layout">
    <!-- <el-watermark :content="userInfo.userId"> -->
    <el-container>
      <el-header>
        <HeaderNav></HeaderNav>
      </el-header>
      <el-main>
        <router-view class="router-view" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" />
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" />
        </router-view>
      </el-main>
    </el-container>
    <!-- </el-watermark> -->
  </div>
</template>
<script setup>
import HeaderNav from '../components/header.vue'
import { getUserProfile } from '../api/api'
import { onMounted, reactive } from 'vue'

const userInfo = reactive({
  userId: '',
  frsc: ''
})
const getUserId = async () => {
  let res = await getUserProfile()
  if (res && res.frsc) {
    userInfo.userId = res.mudid
    userInfo.frsc = res.frsc
    localStorage.setItem('frsc', userInfo.frsc)
  }
}
onMounted(() => {
  getUserId()
})
</script>

<style lang="less">
.el-header {
  padding: 0;
  height: 89px;
}
.el-main {
  padding: 0;
}
</style>
