<template>
  <div class="simulator-output-page">
    <div class="content">
      <p class="title">Optimal Channel Performance</p>
      <el-table border style="width: 100%" header-row-class-name="header-unit">
        <el-table-column prop="channel" label="Channel" />
      </el-table>
    </div>
    <div class="content">
      <p class="title">Current Channel Performance</p>
      <el-table border style="width: 100%" header-row-class-name="header-unit">
        <el-table-column prop="channel" label="Channel" />
      </el-table>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="Simulated Performance">
        <div class="content-wrap">
          <el-row>
            <el-col :span="10">
              <div class="item">
                <p class="title">Promotion VS Non-promotion</p>
                <bar
                  :options="promotionOptions"
                  chartId="promotion"
                  v-if="promotionOptions.xAxis[0].data.length > 0"
                ></bar>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="item">
                <p class="title">Total promotion Contribution</p>
                <bar
                  :options="totalPromotionOptions"
                  chartId="totalPromotion"
                  v-if="totalPromotionOptions.series[0].data.length > 0"
                ></bar>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="item">
                <p class="title">
                  ROI/MROI<el-segmented v-model="data.ROItrigger" :options="['ROI', 'MROI']" />
                </p>

                <div v-if="data.ROItrigger === 'ROI'">
                  <div class="chart-content">
                    <bar
                      :options="ROIChartOptions"
                      chartId="ROIChart"
                      v-if="ROIChartOptions.xAxis.data.length > 0"
                    ></bar>
                  </div>
                </div>
                <div v-if="data.ROItrigger === 'MROI'"></div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="item">
                <p class="title">Cost Distribution</p>
                <div class="chart-content" v-if="costDistributionOptions.series[0].data.length > 0">
                  <bar :options="costDistributionOptions" chartId="costDistribution"></bar>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="item">
                <p class="title">Calculated Unit Price</p>
                <div class="chart-content"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Current Performance">
        <div class="content-wrap"></div>
      </el-tab-pane>
    </el-tabs>
   
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { onMounted, reactive, watch } from 'vue'
import { previewSimulations } from '../../api/api'
import bar from '../../components/bar.vue'


const router = useRouter()
const props = defineProps({
  simulation: {
    type: String,
    requred: true,
  },
})

const data = reactive({
  group_name: router.currentRoute._value.params.group,
  project_name: router.currentRoute._value.params.project,
  ROItrigger: 'ROI',
})

const simulationOutput = reactive({
  calculated_unit_price: {},
  cost_distribution: {},
  current_channel_performance: {},
  mroi: {},
  optimal_channel_performance: {},
  promotion_vs_base: {},
  roi: {},
  total_promotion_contribution: {},
})

const previewSimulationsFn = async () => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: props.simulation,
  }
  let res = await previewSimulations(param)
  if (res && res.Simulation_output) {
    simulationOutput.calculated_unit_price =
      res.Simulation_output.Total_market.calculated_unit_price

    simulationOutput.cost_distribution = res.Simulation_output.Total_market.cost_distribution

    simulationOutput.current_channel_performance =
      res.Simulation_output.Total_market.current_channel_performance

    simulationOutput.mroi = res.Simulation_output.Total_market.mroi

    simulationOutput.optimal_channel_performance =
      res.Simulation_output.Total_market.optimal_channel_performance

    promotionOptions.series[0].data = [
      res.Simulation_output.Total_market.promotion_vs_base.y.promotion,
    ]
    promotionOptions.series[1].data = [
      res.Simulation_output.Total_market.promotion_vs_base.y.nonpromotion,
    ]
    promotionOptions.xAxis[0].data = res.Simulation_output.Total_market.promotion_vs_base.x

    for (let key in res.Simulation_output.Total_market.total_promotion_contribution) {
      let item = {
        name: key,
        value: res.Simulation_output.Total_market.total_promotion_contribution[key],
      }
      totalPromotionOptions.series[0].data.push(item)
    }
    for (let key in res.Simulation_output.Total_market.cost_distribution) {
      let item = {
        name: key,
        value: res.Simulation_output.Total_market.cost_distribution[key],
      }
      costDistributionOptions.series[0].data.push(item)
    }

    // ROIChartOptions.xAxis.data = []
    // ROIChartOptions.series[0].data = res.Simulation_output.Total_market.roi.y
    // ROIChartOptions.xAxis.data = res.Simulation_output.Total_market.roi.x
  }
}

const promotionOptions = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [],
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value}B',
      },
    },
  ],
  series: [
    {
      name: 'Promotion',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series',
      },
      data: [],
      label: {
        show: true,
        formatter: (params) => params.value + 'B',
      },
      itemStyle: {
        color: '#e99d42',
      },
    },
    {
      name: 'Non-promotion',
      type: 'bar',
      stack: 'Ad',
      emphasis: {
        focus: 'series',
      },
      data: [],
      label: {
        show: true,
        formatter: (params) => params.value + 'B',
      },
      itemStyle: {
        color: '#f9d2a3',
      },
    },
  ],
})

const totalPromotionOptions = reactive({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      center: ['45%', '45%'],
      radius: ['10%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        formatter: '{b}: {c}B',
      },
      data: [],
    },
  ],
})

const ROIChartOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  tooltip: {
    trigger: 'axis',
  },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        formatter: (params) => params.value,
      },
      itemStyle: {
        color: '#e99d42',
      },
    },
  ],
})

const costDistributionOptions = reactive({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      center: ['35%', '45%'],
      radius: ['10%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        formatter: '{b}: {c}B',
      },
      data: [],
    },
  ],
})


onMounted(() => {
  previewSimulationsFn()
})
</script>
<style lang="less" scoped>
.simulator-output-page {
 
  .content {
    .title {
      font-size: 16px;
      font-weight: bold;
      margin: 15px 0;
    }
  }
  :deep(.el-tabs__nav .is-active) {
    color: #e99d42;
  }
  :deep(.el-tabs__header .el-tabs__nav-wrap .el-tabs__item:hover) {
    color: #e99d42;
  }
  .content-wrap {
    background-color: #fff5ea;
    padding: 15px;
    .item {
      .title {
        font-weight: bold;
        border-left: 2px solid #000;
        padding-left: 10px;
        font-size: 16px;
      }
    }
  }
}
</style>
