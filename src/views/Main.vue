<template>
  <div class="layout">
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
<script setup lang="ts">
import HeaderNav from '../components/header.vue'
</script>

<style lang="less">
.el-header {
  padding: 0;
  height: 109px;
}
.el-main {
  padding: 0;
}
</style>
