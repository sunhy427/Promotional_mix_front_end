<template>
  <div class="project-page">
    <Aside :project_list="data.project_list"></Aside>
    <div class="content">
      <Analysis
        :project="data.currentProject"
        v-if="pageParam.currentComponent === 'analysis'"
      ></Analysis>
      <Output
        :project="data.currentProject"
        v-if="pageParam.currentComponent === 'output'"
      ></Output>
      <Simulator
        :project="data.currentProject"
        v-if="pageParam.currentComponent === 'simulator'"
        @setProject="handleProject"
      ></Simulator>
    </div>
  </div>
</template>
<script setup nonce="NONCE_PLACE_HOLDER">
import { onMounted, reactive } from 'vue'
import Aside from './aside.vue'
import Analysis from './analysis.vue'
import Output from './output.vue'
import Simulator from './simulator.vue'
import { useRoute } from 'vue-router'
import { getProjectList } from '../../api/api'

const route = useRoute()
const pageParam = reactive({
  group: route.params.group,
  project: route.params.project,
  currentComponent: route.name,
})

const data = reactive({
  project_list: [],
  currentProject: {},
})

const handleProject = (project) => {
  getProjectListFn(pageParam.group)
}

const getProjectListFn = async (group_name) => {
  let param = {
    group_name: group_name,
  }
  let res = await getProjectList(param)
  if (res) {
    data.project_list = res.project_list

    let index = data.project_list.findIndex((item) => {
      return item.project_name === pageParam.project
    })

    if (index > -1) {
      data.currentProject = data.project_list[index]
    }
  }
}

onMounted(() => {
  getProjectListFn(pageParam.group)
})
</script>
<style lang="less" scoped>
.content {
  margin-left: 200px;
}
</style>
