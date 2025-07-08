<template>
  <div class="aside-page">
    <el-menu class="el-menu-vertical-demo" background-color="#e99d42">
      <el-menu-item :index="data.currentGroupName" @click="backGroup">
        <el-icon><House /></el-icon>
        <span>{{ data.currentGroupName }}</span>
      </el-menu-item>
    </el-menu>

    <el-menu
      :default-active="data.currentProjectName"
      class="el-menu-vertical-demo"
      background-color="#e99d42"
      :unique-opened="true"
      :default-openeds="data.openedIndexList"
      v-if="data.projectList.length > 0"
    >
      <el-sub-menu
        :index="item.project_name"
        v-for="(item, index) in data.projectList"
        :key="item.project_name"
      >
        <template #title>
          <span @click="enter(item)">{{ item.project_name }}</span>
        </template>
        <el-menu-item-group
          v-if="
            item.simulation_list &&
            item.simulation_list.length > 0 &&
            item.project_name === data.currentProjectName
          "
        >
          <el-anchor :offset="100">
            <el-menu-item
              v-for="simulationItem in item.simulation_list"
              :index="simulationItem.simulation_name"
            >
              <el-anchor-link :href="`#${simulationItem.simulation_name}`">
                {{ simulationItem.simulation_name }}
              </el-anchor-link>
            </el-menu-item>
          </el-anchor>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<script setup>
import { reactive, defineProps, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const props = defineProps({
  project_list: {
    type: Array,
    requred: true,
  },
})
const data = reactive({
  pageName: route.name,
  currentProjectName: route.params.project,
  currentGroupName: route.params.group,
  projectList: [],
  openedIndexList: [],
})
watch(
  () => props.project_list,
  (value) => {
    if (value && value.length > 0) {
      data.projectList = value
      data.openedIndexList.push(data.currentProjectName)
    }
  },
  { deep: true, immediate: true },
)

const backGroup = () => {
  window.location.href = '/group'
}
//["EMPTY","MODEL_RUNNING","MODEL_OUTPUT","SIMULATION","SIMULATION_RUNNING"]
const enter = (item) => {
  let name = ''
  if (item.project_status === 'EMPTY' || item.project_status === 'MODEL_RUNNING') {
    name = 'analysis'
  }
  if (item.project_status === 'MODEL_OUTPUT') {
    name = 'output'
  }
  if (item.project_status === 'SIMULATION' || item.project_status === 'SIMULATION_RUNNING') {
    name = 'simulator'
  }
  //router.push({ name: name, params: { group: data.currentGroupName, project: item.project_name } })
  window.location.href = `/${name}/${data.currentGroupName}/${item.project_name}`
}
</script>

<style lang="less">
:root {
  --el-menu-active-color: #555555;
}
.aside-page {
  height: calc(100vh - 80px);
  background-color: #e99d42;
  color: #fff;
  position: fixed;
  width: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  .el-anchor__list {
    background-color: #f0b36b;
    color: #fff;
    .el-anchor__link {
      font-size: 14px;
      color: #fff;
    }
    .el-menu-item {
      padding-left: 10px !important;
    }
  }

  .el-menu-vertical-demo {
    .el-sub-menu__title:hover {
      background-color: #f0b266;
    }
  }

  .el-menu-item {
    background-color: #f0b36b;
    color: #fff;
  }
  .is-opened {
    background-color: #f0b36b;
    color: #fff;
  }
  .el-menu-item-group {
    background-color: #f0b36b;
  }
  .el-sub-menu__title {
    color: #fff;
    span {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
