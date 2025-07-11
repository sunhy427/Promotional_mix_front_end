<template>
  <div class="simulator-output-page">
    <div class="content" v-if="simulationOutput.optimal_channel_performance.length > 0">
      <p class="title">Optimal Channel Performance</p>
      <el-table
        border
        header-row-class-name="header-unit"
        :data="simulationOutput.optimal_channel_performance"
      >
        <el-table-column prop="channel" label="Channel" />
        <el-table-column prop="roi_simulated" label="ROI(simulated)" :formatter="formatNumber" />
        <el-table-column prop="mroi_simulated" label="MROI(simulated)" :formatter="formatNumber" />
        <el-table-column
          prop="sales_contribution_pct_simulated"
          label="Sales % Contribution(simulated)"
          :formatter="formatNumber"
        />
        <el-table-column
          prop="sales_contribution_simulated"
          label="Sales Contribution(simulated)"
          :formatter="formatNumberto0"
        />
        <el-table-column
          prop="spending_simulated"
          label="Spending(simulated)"
          :formatter="formatNumberto0"
        />
        <el-table-column prop="tp_simulated" label="TP(simulated)" :formatter="formatNumberto0" />

        <el-table-column prop="gr_in_sales_simulated" label="GR in Sales(simulated)" />
        <el-table-column prop="gr_in_spending_simulated" label="GR in Spending(simulated)" />
      </el-table>
    </div>
    <div class="content">
      <p class="title">Current Channel Performance</p>
      <el-table
        border
        header-row-class-name="header-unit"
        :data="simulationOutput.current_channel_performance"
      >
        <el-table-column prop="channel" label="Channel" />
        <el-table-column prop="roi" label="ROI" :formatter="formatNumber" />

        <el-table-column prop="mroi" label="MROI" :formatter="formatNumber" />
        <el-table-column
          prop="sales_contribution_pct"
          label="Sales % Contribution"
          :formatter="formatNumberFG"
        />
        <el-table-column
          prop="sales_contribution"
          label="Sales Contribution"
          :formatter="formatNumberto0"
        />

        <el-table-column prop="spending" label="Spending" :formatter="formatNumberto0" />
      </el-table>
    </div>
    <el-tabs type="border-card" v-model="data.tabValue">
      <el-tab-pane label="Simulated Performance" name="Simulated">
        <div class="content-wrap">
          <el-row>
            <el-col :span="24">
              <p class="tips-chart">
                Notes: All annotations in the figures represent simulated performance (current
                performance), shown in parentheses for comparison.
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <div class="item">
                <p class="title">Cost Distribution</p>
                <div class="chart-content">
                  <bar
                    :options="costDistributionOptions"
                    :chartId="props.simulation + '_costDistribution'"
                    v-if="costDistributionOptions.series[0].data.length > 0"
                  ></bar>
                </div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="item">
                <p class="title">Calculated Unit Price</p>
                <div class="chart-content">
                  <el-table
                    border
                    header-row-class-name="header-unit"
                    :data="simulationOutput.calculated_unit_price"
                  >
                    <el-table-column prop="channels" label="channels" />
                    <el-table-column
                      prop="unit_price"
                      label="unit price"
                      :formatter="formatNumber"
                    />
                    <el-table-column
                      prop="tp_simulated"
                      label="tp simulated"
                      :formatter="formatNumberto0"
                    />
                    <el-table-column
                      prop="price"
                      label="current unit price"
                      :formatter="formatNumber"
                    />
                  </el-table>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="item">
                <p class="title">Promotion VS Non-promotion</p>
                <bar
                  :options="promotionOptions"
                  :chartId="props.simulation + 'promotion'"
                  v-if="promotionOptions.xAxis[0].data.length > 0"
                ></bar>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="item">
                <p class="title">Total promotion Contribution</p>
                <bar
                  :options="totalPromotionOptions"
                  :chartId="props.simulation + '_totalPromotion'"
                  v-if="totalPromotionOptions.series[0].data.length > 0"
                ></bar>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="item">
                <p class="title">
                  ROI/MROI
                  <el-segmented v-model="data.ROItrigger" :options="['ROI', 'MROI']" />
                </p>

                <div v-if="data.ROItrigger === 'ROI'">
                  <div class="chart-content">
                    <bar
                      :options="ROIChartOptions"
                      :chartId="props.simulation + '_ROIChart'"
                      v-if="ROIChartOptions.xAxis.data.length > 0"
                    ></bar>
                  </div>
                </div>
                <div v-if="data.ROItrigger === 'MROI'">
                  <bar
                    :options="MROIChartOptions"
                    :chartId="props.simulation + '_MROIChart'"
                    v-if="MROIChartOptions.xAxis.data.length > 0"
                  ></bar>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Current Performance" name="Current" :lazy="true">
        <div class="content-wrap">
          <el-row>
            <el-col :span="14">
              <div class="item">
                <p class="title">Cost Distribution</p>
                <bar
                  :options="current_costDistributionOptions"
                  :chartId="props.simulation + '_current_costDistributionOptions'"
                  v-if="current_costDistributionOptions.series[0].data.length > 0"
                ></bar>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="item">
                <p class="title">Current Unit Price</p>

                <el-table :data="Current_output.current_unit_price" border>
                  <el-table-column prop="channel" label="Channel" align="center" />
                  <el-table-column
                    prop="price"
                    label="Unit Price(CNY per TP)"
                    align="center"
                    :formatter="formatNumber"
                  />
                </el-table>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="item">
                <p class="title">Promotion VS Non-promotion</p>
                <bar
                  :options="current_promotionOptions"
                  chartId="current_promotionOptions"
                  v-if="current_promotionOptions.series[0].data.length > 0"
                ></bar>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="item">
                <p class="title">Total Promotion Contribution</p>
                <bar
                  :options="current_totalPromotionOptions"
                  chartId="current_totalPromotionOptions"
                  v-if="current_totalPromotionOptions.series[0].data.length > 0"
                ></bar>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="item">
                <p class="title">
                  ROI/MROI
                  <el-segmented v-model="data.current_ROItrigger" :options="['ROI', 'MROI']" />
                </p>

                <div v-if="data.current_ROItrigger === 'ROI'">
                  <div class="chart-content">
                    <bar
                      :options="current_ROIChartOptions"
                      :chartId="props.simulation + '_current_ROIChart'"
                      v-if="current_ROIChartOptions.xAxis.data.length > 0"
                      :key="props.simulation"
                    ></bar>
                  </div>
                </div>
                <div v-if="data.current_ROItrigger === 'MROI'">
                  <bar
                    :options="current_MROIChartOptions"
                    :chartId="props.simulation + '_current_MROIChart'"
                    v-if="current_MROIChartOptions.xAxis.data.length > 0"
                    :key="props.simulation"
                  ></bar>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { nextTick, onMounted, reactive, watch } from 'vue'
import { previewSimulations } from '../../api/api'
import bar from '../../components/bar.vue'
import { formatter } from 'element-plus'

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
  tabValue: 'Simulated',
  current_ROItrigger: 'ROI',
  current_ROIChannelValue: '',
})

const simulationOutput = reactive({
  calculated_unit_price: [],
  cost_distribution: {},
  current_channel_performance: [],
  mroi: {},
  optimal_channel_performance: [],
  promotion_vs_base: {},
  roi: {},
  total_promotion_contribution: {},
})

const Current_output = reactive({
  total_cost_distribution: 0,
  total_promotion_contribution_number: 0,
  total_promotion_contribution: {},
  cost_distribution: {},
  current_unit_price: [],
  mroi: {},
  mroi_options: ['cost'],
  mroi_select: 'cost',
  roi: {},
  roi_options: ['cost', 'cost_direct'],
  roi_select: '',
})

const formatNumber = (row, column, cellValue) => {
  // return Number(Number(cellValue).toFixed(2)).toLocaleString()
  return Number(cellValue).toFixed(2)
}

const formatNumberto0 = (row, column, cellValue) => {
  return Number(Number(cellValue).toFixed(0)).toLocaleString()
}
const formatNumberFG = (row, column, cellValue) => {
  return Number(cellValue * 100).toFixed(2) + '%'
}
const previewSimulationsFn = async () => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: props.simulation,
  }
  let res = await previewSimulations(param)
  if (res && res.Simulation_output) {
    for (let i = 0; i < res.Simulation_output.Total_market.calculated_unit_price.length; i++) {
      let item = {
        ...res.Simulation_output.Total_market.calculated_unit_price[i],
        price:
          res.Current_output.current_unit_price[
            res.Simulation_output.Total_market.calculated_unit_price[i].channels
          ],
      }
      simulationOutput.calculated_unit_price.push(item)
    }
    // simulationOutput.calculated_unit_price =
    //   res.Simulation_output.Total_market.calculated_unit_price

    simulationOutput.cost_distribution = res.Simulation_output.Total_market.cost_distribution
    Current_output.cost_distribution = res.Current_output.cost_distribution

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

    ROIChartOptions.xAxis.data = []
    ROIChartOptions.series[0].data = res.Simulation_output.Total_market.roi.y
    ROIChartOptions.xAxis.data = res.Simulation_output.Total_market.roi.x

    MROIChartOptions.xAxis.data = []
    MROIChartOptions.series[0].data = res.Simulation_output.Total_market.mroi.y
    MROIChartOptions.xAxis.data = res.Simulation_output.Total_market.mroi.x

    //
    for (let key in res.Current_output.cost_distribution) {
      let item = {
        name: key,
        value: res.Current_output.cost_distribution[key],
      }
      current_costDistributionOptions.series[0].data.push(item)
      Current_output.total_cost_distribution = Current_output.total_cost_distribution + item.value
    }

    for (let key in res.Current_output.current_unit_price) {
      let item = {
        channel: key,
        price: res.Current_output.current_unit_price[key].toFixed(2),
      }
      Current_output.current_unit_price.push(item)
    }

    Current_output.total_promotion_contribution = res.Current_output.total_promotion_contribution

    for (let key in res.Current_output.total_promotion_contribution) {
      let item = {
        name: key,
        value: res.Current_output.total_promotion_contribution[key],
      }
      current_totalPromotionOptions.series[0].data.push(item)
      Current_output.total_promotion_contribution_number += item.value
    }
    current_promotionOptions.series[0].data = [
      res.Current_output.promotion_vs_nonpromotion.y.promotion,
    ]
    current_promotionOptions.series[1].data = [
      res.Current_output.promotion_vs_nonpromotion.y.nonpromotion,
    ]
    current_promotionOptions.xAxis[0].data = res.Current_output.promotion_vs_nonpromotion.x

    Current_output.roi = res.Current_output.roi
    Current_output.roi_select = Current_output.roi_options[0]
    current_changeROI()

    Current_output.mroi = res.Current_output.mroi

    current_MROIChartOptions.xAxis.data = []
    current_MROIChartOptions.series[0].data = Current_output.mroi[Current_output.mroi_select].y
    current_MROIChartOptions.xAxis.data = Current_output.mroi[Current_output.mroi_select].x
  }
}
const current_changeROI = () => {
  current_ROIChartOptions.xAxis.data = []
  current_ROIChartOptions.series[0].data = Current_output.roi[Current_output.roi_select].y
  current_ROIChartOptions.xAxis.data = Current_output.roi[Current_output.roi_select].x
}
const promotionOptions = reactive({
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
        formatter: '{value}',
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
        formatter: (params) => {
          let sum = 0
          for (let i = 0; i < promotionOptions.series.length; i++) {
            sum += promotionOptions.series[i].data[params.dataIndex]
          }
          let percent = ((params.value / sum) * 100).toFixed(1) 

          let current_sum =
            current_promotionOptions.series[0].data[0] + current_promotionOptions.series[1].data[0]

          let current_percent =
            ((current_promotionOptions.series[0].data[0] / current_sum) * 100).toFixed(1) 

          let label =
            translateNumber(params.value, percent) +
            '\n' +
            '( ' +
            translateNumber(current_promotionOptions.series[0].data[0], current_percent) +
            ' )'
          return label
        },
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
        formatter: (params) => {
          let sum = 0
          for (let i = 0; i < promotionOptions.series.length; i++) {
            sum += promotionOptions.series[i].data[params.dataIndex]
          }
          let percent = ((params.value / sum) * 100).toFixed(1) 
          let current_sum =
            current_promotionOptions.series[0].data[0] + current_promotionOptions.series[1].data[0]
          let current_percent = (
            (current_promotionOptions.series[1].data[0] / current_sum) *
            100
          ).toFixed(1)
          let label =
            translateNumber(params.value, percent) +
            '\n' +
            '( ' +
            translateNumber(current_promotionOptions.series[1].data[0], current_percent) +
            ' )'
          return label
        },
      },
      itemStyle: {
        color: '#f9d2a3',
      },
    },
  ],
})

const totalPromotionOptions = reactive({
  legend: {
    type: 'scroll',
    top: 'bottom',
    bottom: 20,
  },
  series: [
    {
      name: '',
      type: 'pie',
      center: ['45%', '45%'],
      radius: ['10%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        formatter: (params) => {
          let numStr = translateNumber(params.value, params.percent) + '\n'
          let current_num = Current_output.total_promotion_contribution[params.name]
          let current_percent =
            (current_num / Current_output.total_promotion_contribution_number) * 100

          numStr += '(' + translateNumber(current_num, current_percent.toFixed(2)) + ')'
          return numStr
        },
      },
      data: [],
    },
  ],
})

const ROIChartOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 20,
    },
  },
  grid: {
    bottom: '15%',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        formatter: (params) => {
          let current = Current_output.roi.cost.y[params.dataIndex]
          let label = params.value.toFixed(2) + '\n' + `( ${current.toFixed(2)} )`
          return label
        },
      },
      itemStyle: {
        color: '#e99d42',
      },
    },
  ],
})

const MROIChartOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 20,
    },
  },
  grid: {
    bottom: '15%',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        formatter: (params) => {
          let current = Current_output.mroi.cost.y[params.dataIndex]
          let label = params.value.toFixed(2) + '\n' + `( ${current.toFixed(2)} )`
          return label
        },
      },

      itemStyle: {
        color: '#e99d42',
      },
    },
  ],
})

const costDistributionOptions = reactive({
  // tooltip: {
  //   trigger: 'item',
  // },
  legend: {
    type: 'scroll',
    orient: 'horizontal',
    top: 'bottom',
    // right: 10,
    // bottom: 10,
  },
  series: [
    {
      name: '',
      type: 'pie',
      center: ['50%', '45%'],
      radius: ['10%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        formatter: (params) => {
          let labelStr = translateNumber(params.value, params.percent)
          if (Current_output.cost_distribution) {
            let percent =
              (Current_output.cost_distribution[params.name] /
                Current_output.total_cost_distribution) *
              100
            let numStr = translateNumber(
              Current_output.cost_distribution[params.name],
              percent.toFixed(2),
            )
            labelStr = labelStr + `\n ( ${numStr} )`
          }
          return labelStr
        },
      },
      data: [],
    },
  ],
})

const translateNumber = (num, percent) => {
  let numStr = ''
  if (num >= 1e9) {
    numStr = (num / 1e9).toFixed(2) + 'B' + '，' + percent + '%'
  } else if (num >= 1e6) {
    numStr = (num / 1e6).toFixed(2) + 'M' + '，' + percent + '%'
  } else {
    numStr = num.toFixed(2) + '，' + percent + '%'
  }
  return numStr
}

const current_costDistributionOptions = reactive({
  // tooltip: {
  //   trigger: 'item',
  // },
  legend: {
    type: 'scroll',
    // orient: 'vertical',
    // right: 10,
    top: 'bottom',
    // bottom: 20,
  },
  series: [
    {
      name: '',
      type: 'pie',
      center: ['45%', '45%'],
      radius: ['10%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        formatter: (params) => {
          let num = params.value
          if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B' + '，' + params.percent + '%'
          } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M' + '，' + params.percent + '%'
          } else {
            return num.toFixed(2) + '，' + params.percent + '%'
          }
        },
      },
      data: [],
    },
  ],
})

const current_promotionOptions = reactive({
  // tooltip: {
  //   trigger: 'axis',
  //   axisPointer: {
  //     type: 'shadow',
  //   },
  // },
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
        formatter: '{value}',
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
        formatter: (params) => {
          let sum =
            current_promotionOptions.series[0].data[0] + current_promotionOptions.series[1].data[0]

          let percent = ((params.value / sum) * 100).toFixed(1)

          return translateNumber(params.value, percent)
        },
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
        formatter: (params) => {
          let sum =
            current_promotionOptions.series[0].data[0] + current_promotionOptions.series[1].data[0]
          let percent = ((params.value / sum) * 100).toFixed(1)

          return translateNumber(params.value, percent)
        },
      },
      itemStyle: {
        color: '#f9d2a3',
      },
    },
  ],
})
const current_totalPromotionOptions = reactive({
  // tooltip: {
  //   trigger: 'item',
  // },
  legend: {
    type: 'scroll',
    // orient: 'vertical',
    // right: 10,
    top: 'bottom',
    bottom: 20,
  },
  series: [
    {
      name: '',
      type: 'pie',
      center: ['45%', '45%'],
      radius: ['10%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        formatter: (params) => {
          let num = params.value
          if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B' + '，' + params.percent + '%'
          } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M' + '，' + params.percent + '%'
          } else {
            return num.toFixed(2) + '，' + params.percent + '%'
          }
        },
      },
      data: [],
    },
  ],
})

const current_ROIChartOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 20,
    },
  },
  grid: {
    bottom: '15%',
  },
  yAxis: {
    type: 'value',
  },
  // tooltip: {
  //   trigger: 'axis',
  // },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        formatter: (params) => params.value.toFixed(2),
      },
      itemStyle: {
        color: '#e99d42',
      },
    },
  ],
})
const current_MROIChartOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 20,
    },
  },
  grid: {
    bottom: '15%',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        formatter: (params) => params.value.toFixed(2),
      },
      itemStyle: {
        color: '#e99d42',
      },
    },
  ],
})

onMounted(() => {
  previewSimulationsFn()
})
</script>
<style lang="less" scoped>
.simulator-output-page {
  .channel-select-input {
    width: 240px;
    float: right;
    margin-top: -40px;
  }
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
    .tips-chart {
      font-size: 16px;
      color: #ee6666;
      font-weight: bold;
    }
    .item {
      .title {
        font-weight: bold;
        border-left: 2px solid #000;
        padding-left: 10px;
        font-size: 16px;
        margin: 20px 0;
      }
    }
  }
}
</style>
