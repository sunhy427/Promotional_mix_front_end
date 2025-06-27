<template>
  <div class="layout" v-watermark="userInfo.userId">
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
  </div>
</template>
<script setup>
import HeaderNav from '../components/header.vue'
import { getUserProfile } from '../api/api'
import { onMounted, reactive } from 'vue'

const userInfo = reactive({
  userId: '',
})
const getUserId = async () => {
  let res = await getUserProfile()
  if (res && res.User_id) {
    userInfo.userId = res.User_id
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
