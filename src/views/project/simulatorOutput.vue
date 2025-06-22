<template>
  <div class="simulator-output-page">
    <div class="content">
      <p class="title">Optimal Channel Performance</p>
      <el-table
       
        border
        style="width: 100%"
        header-row-class-name="header-unit"
      >
        <el-table-column prop="channel" label="Channel" />
      </el-table>
    </div>
    <div class="content">
      <p class="title">Current Channel Performance</p>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { previewSimulations } from '../../api/api'

const router = useRouter()
const props = defineProps({
  simulation_name: {
    type: String,
    requred: true,
  },
})

const data = reactive({
  group_name: router.currentRoute._value.params.group,
  project_name: router.currentRoute._value.params.project,
})

const previewSimulationsFn = async () => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: simulation_name,
  }
  let res = await previewSimulations(param)
  if (res) {
  }
}
onMounted(() => {})
</script>
<style lang="less" scoped>
.simulator-output-page {
  .content {
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
