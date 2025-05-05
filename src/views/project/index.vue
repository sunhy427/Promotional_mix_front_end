<template>
  <div class="project-page">
    <Aside
      :groupName="data.groupName"
      :currentProjectName="data.currentProjectName"
      :projectList="data.projectList"
    ></Aside>
    <div class="content">
      <Analysis v-if="data.currentComponent === 'analysis'"></Analysis>
      <Output v-if="data.currentComponent === 'output'"></Output>
      <Simulator v-if="data.currentComponent === 'simulator'"></Simulator>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Aside from './aside.vue'
import Analysis from './analysis.vue'
import Output from './output.vue'
import Simulator from './simulator.vue'

const router = useRouter()

const data = reactive({
  currentComponent: '',
  groupName: router.currentRoute._value.params.group,
  currentProjectName: router.currentRoute._value.params.project,
  projectList: [],
})

onMounted(() => {
  data.currentComponent = router.currentRoute._value.name
  getProjectList()
})

const getProjectList = async () => {
  data.projectList = [
    {
      project_name: 'sulperzon_ge',
      project_status: 'MODELING',
      updated_datetime: '2023-02-07T07:35:10.862Z',
      privileges: ['Enter', 'Copy', 'Share', 'Delete'],
      simulations_list: ['simulation1', 'simulation2'],
    },
    {
      project_name: 'sulperzon_hbu',
      project_status: 'SIMULATION',
      updated_datetime: '2023-01-09T00:00:00Z',
      privileges: ['Enter', 'Copy', 'Share', 'Delete'],
      simulations_list: ['simulation1', 'simulation2'],
    },
  ]
}
</script>
<style lang="less" scoped>
.content {
  margin-left: 200px;
}
</style>
