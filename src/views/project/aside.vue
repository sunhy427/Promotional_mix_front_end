<template>
  <div class="aside-page">
    <el-menu :default-active="data.currentProjectName" class="el-menu-vertical-demo">
      <el-menu-item :index="data.currentGroupName " @click="backGroup">
        <el-icon><Menu /></el-icon>
        <template #title>{{ data.currentGroupName }}</template>
      </el-menu-item>
      <!-- <el-menu-item
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
      </el-menu-item> -->
    </el-menu>
  </div>
</template>
<script setup>
import { defineProps, watch, reactive } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

const emit = defineEmits(['selectProject'])

// const props = defineProps({
//   groupName: {
//     type: String,
//     required: true,
//   },
//   currentProjectName: {
//     type: String,
//     required: true,
//   },
//   projectList: {
//     type: Array,
//     required: true,
//   },
// })
console.log('router.params', router)
const data = reactive({
  currentProjectName: router.params.project,
  currentGroupName: router.params.group,
  projectList: [],
})

const setCurrentProject = (name) => {
  data.currentProjectName = name
}

const enter = (project) => {
  emit('selectProject', project)
}

const backGroup = () => {
  window.location.href = '/group'
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
