<template>
  <div class="project-page">
    <Aside :project_list="data.project_list"></Aside>
    <div class="content">
      <Analysis
        v-if="pageParam.currentComponent === 'analysis'"
        :project_status="data.project_status"
      ></Analysis>
      <Output
        v-if="pageParam.currentComponent === 'output'"
        :project_status="data.project_status"
      ></Output>
      <Simulator
        v-if="pageParam.currentComponent === 'simulator'"
        :project_status="data.project_status"
        :simulation_list="data.simulation_list"
      ></Simulator>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, watch } from 'vue'
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
  project_status: '',
  project_list: [],
  simulation_list: [],
})

const getProjectListFn = async (group_name) => {
  let param = {
    group_name: group_name,
  }
  let res = await getProjectList(param)
  if (res && res.project_list[0].length > 0) {
    data.project_list = res.project_list[0]
    data.project_status = data.project_list.filter((item) => {
      return item.project_name === pageParam.project
    })[0].project_status
    data.simulation_list = data.project_list.filter((item) => {
      return item.project_name === pageParam.project
    })[0].simulation_list
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
