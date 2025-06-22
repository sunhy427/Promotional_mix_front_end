<template>
  <div class="aside-page">
    <el-menu :default-active="data.currentProjectName" class="el-menu-vertical-demo">
      <el-menu-item :index="data.currentGroupName" @click="backGroup">
        <el-icon><Menu /></el-icon>
        <template #title>{{ data.currentGroupName }}</template>
      </el-menu-item>
      <el-menu-item
        :index="item.project_name"
        v-for="(item, index) in data.projectList"
        :key="index"
        @click="enter(item)"
      >
        <el-icon><CaretRight /></el-icon>
        <template #title>
          <el-popover
            placement="left-end"
            :width="200"
            trigger="hover"
            :content="item.project_name"
            effect="dark"
          >
            <template #reference>
              <p class="item-p">
                {{ item.project_name }}
              </p>
            </template>
          </el-popover>
        </template>
      </el-menu-item>
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
    requred: true
  }
})
const data = reactive({
  pageName: route.name,
  currentProjectName: route.params.project,
  currentGroupName: route.params.group,
  projectList: [],
})
watch(
  () => props.project_list,
  (value) => {
    data.projectList = value
  },
  {deep: true, immediate: true}
)





const backGroup = () => {
  window.location.href = '/group'
}

const enter = (item) => {
  let name = ''
  if (item.project_status === 'EMPTY') {
    name = 'analysis'
  }
  if (item.project_status === 'MODELING') {
    name = 'output'
  }
  if (item.project_status === 'SIMULATION') {
    name = 'simulator'
  }
  router.push({ name: name, params: { group: data.currentGroupName, project: item.project_name } })
}

</script>

<style lang="less">
.aside-page {
  height: calc(100vh - 80px);
  background-color: #e99d42;
  color: #fff;
  position: fixed;
  width: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  .el-menu-vertical-demo {
    li {
      padding: 0 5px;
      &:first-of-type {
        padding: 0;
      }
    }
    :not(:first-of-type) {
      padding: 0 10px;
      background-color: #e99d42;

      & > i {
        display: none;
        position: absolute;
        left: 0px;
      }
      &:hover {
        background-color: #f9d5aa;
      }
      &.is-active {
        & > i {
          display: block;
        }
      }
      & > .item-p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .el-menu-item {
    background-color: #f58b0b;
    color: #fff;
  }
}
</style>
