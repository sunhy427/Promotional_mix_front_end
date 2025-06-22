<template>
  <div class="output-page">
    <div class="top">
      <el-icon><HomeFilled /></el-icon>
      <span>Channel Analysis Output</span>
    </div>
    <div class="overview">
      <el-descriptions title="" :column="4" direction="vertical">
        <el-descriptions-item label="OutTime" :span="2" label-class-name="descriptions-label">{{
          outputMetadata.output_time
        }}</el-descriptions-item>
        <el-descriptions-item
          label="Model time period"
          :span="2"
          label-class-name="descriptions-label"
          >{{ outputMetadata.model_time_period }}</el-descriptions-item
        >
        <el-descriptions-item label="Channels" label-class-name="descriptions-label">
          <p>Number: {{ outputMetadata.aggregate_channel_list.length }}</p>
          <p>
            channels:
            <span
              v-for="(item, index) in outputMetadata.aggregate_channel_list"
              :key="index"
              style="margin: 0 5px"
              >{{ item }}
            </span>
          </p>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" :column="4">
        <el-descriptions-item label="Segment" :span="4" label-class-name="descriptions-label">
          <el-select v-model="form.segmentation_type" placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in outputMetadata.segmentOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="card-title">
      <i>1</i>
      <span>Sales Trends</span>
    </div>
    <el-card>
      <div class="card-content">
        <el-row>
          <el-col :span="8" v-if="outputData.total_cost.length > 0">
            <span class="title">Total Cost</span>
            <span>{{ outputData.total_cost[1] }}</span>
          </el-col>
          <el-col :span="8" v-if="outputData.total_sales.length > 0">
            <span class="title">Total Sales</span>
            <span>{{ outputData.total_sales[1] }}</span>
          </el-col>
          <el-col :span="8">
            <span class="title">Total Cost/Total Sales</span>
            <span>{{ outputData.total_cost_vs_total_sales }}%</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <span class="title">Cost Distribution</span>
            <div class="chart-content" v-if="costDistributionOptions.series[0].data.length > 0">
              <bar :options="costDistributionOptions" chartId="costDistribution"></bar>
            </div>
          </el-col>
          <el-col :span="10">
            <span class="title">Current Unit Price</span>
            <div class="chart-content">
              <el-table :data="outputData.current_unit_price" border style="width: 100%">
                <el-table-column prop="channel" label="Channel" align="center" />
                <el-table-column prop="price" label="Unit Price(CNY per TP)" align="center" />
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title">Cost by Channel VS Total Sales Trend</span>
            <el-select
              v-model="outputData.cost_by_channel_vs_total_sales_trend_select"
              placeholder="Select"
              class="channel-select-input"
              @change="changeCost_by_channel_vs_total_sales_trend"
            >
              <el-option
                v-for="item in outputData.cost_by_channel_vs_total_sales_trend_options"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <div class="chart-content" v-if="outputData.show_cost_by_channel_vs_total_sales_trend">
              <bar :options="costByChannelOptions" chartId="costByChannel"></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title">Touch Points by Channel VS Total Sales Trend</span>
            <el-select
              v-model="outputData.torch_points_by_channel_vs_total_sales_trend_select"
              placeholder="Select"
              class="channel-select-input"
              @change="changeTorch_points_by_channel_vs_total_sales_trend"
            >
              <el-option
                v-for="item in outputData.torch_points_by_channel_vs_total_sales_trend_options"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <div class="chart-content">
              <bar
                :options="touchByChannelOptions"
                chartId="touchByChannel"
                v-if="touchByChannelOptions.xAxis.data.length > 0"
              ></bar>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div class="card-title">
      <i>2</i>
      <span>Channel contribution & ROI</span>
    </div>
    <el-card>
      <div class="card-content">
        <el-row>
          <el-col :span="10">
            <span class="title">Promotion VS Non-promotion</span>
            <div class="chart-content">
              <bar
                :options="promotionOptions"
                chartId="promotion"
                v-if="promotionOptions.xAxis[0].data.length > 0"
              ></bar>
            </div>
          </el-col>
          <el-col :span="14">
            <span class="title">Total promotion Contribution</span>
            <div class="chart-content">
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
            <span class="title">Promotion VS Non-promotion</span>
            <el-segmented v-model="data.ROItrigger" :options="['ROI', 'MROI']" />
            <div v-if="data.ROItrigger === 'ROI'">
              <el-select
                v-model="data.ROIChannelValue"
                placeholder="Select"
                class="channel-select-input"
                @click="changeROI"
              >
                <el-option
                  v-for="item in outputData.roi_options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div class="chart-content">
                <bar
                  :options="ROIChartOptions"
                  chartId="ROIChart"
                  v-if="ROIChartOptions.xAxis.data.length > 0"
                ></bar>
              </div>
            </div>
            <div v-if="data.ROItrigger === 'MROI'">

            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title">Response Curve</span>
            <el-select
              v-model="outputData.response_curve_select"
              placeholder="Select"
              class="channel-select-input"
            >
              <el-option v-for="item in outputData.response_curve_options" :key="item" :label="item" :value="item" />
            </el-select>
            <div class="chart-content">
              <bar :options="responseCurveOptions" chartId="responseCurveChart" v-if="responseCurveOptions.xAxis.data.length > 0"></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span class="title">Model Metrics</span>

            <div class="chart-content">
              <el-table :data="ModelMetricsTableData" border style="width: 100%">
                <el-table-column prop="mape" align="center">
                  <template #header>
                    <span class="table-header-tip">Mape</span>
                    <el-tooltip
                      content="MAPE（平均绝对百分比误差）表示模型预测值与实际值之间的平均百分比误差，数值越小越好。"
                    >
                      <el-icon><Warning /></el-icon>
                    </el-tooltip>
                  </template>
                  <template #default="scope"> {{ scope.row.mape }} % </template>
                </el-table-column>
                <el-table-column prop="R2" align="center">
                  <template #header>
                    <span class="table-header-tip">R2</span>
                    <el-tooltip content="R²（0~1）表示模型对数据的拟合程度，数值越接近1越好">
                      <el-icon><Warning /></el-icon>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="14"> </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="continue-wrap">
      <el-button type="primary" @click="goContinue">Continue</el-button>
    </el-card>
    <div class="foot-wrap">
      <el-button type="primary">
        <el-icon><Download /></el-icon>
        Download Data
      </el-button>
      <el-button type="success">
        <el-icon><Download /></el-icon>
        Save Package
      </el-button>
    </div>
  </div>
</template>
<script setup>
import bar from '../../components/bar.vue'
import { reactive, onMounted } from 'vue'
import { previewModelOutputMetadata, previewModelOutputResult } from '../../api/api'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  project_status: {
    type: String,
    requred: true,
  },
})
const route = useRoute()
const router = useRouter()

const pageParam = reactive({
  group: route.params.group,
  project: route.params.project,
})

const outputMetadata = reactive({
  output_time: '',
  model_time_period: '',
  aggregate_channel_list: [],
  segmentOptions: [],
  segmentOptions_select: ''
})

const form = reactive({
  segmentation_type: '',
})

const outputData = reactive({
  cost_by_channel_vs_total_sales_trend: {},
  cost_by_channel_vs_total_sales_trend_options: [],
  cost_by_channel_vs_total_sales_trend_select: '',
  show_cost_by_channel_vs_total_sales_trend: false,
  current_unit_price: [],
  mroi: {},
  promotion_vs_nonpromotion: {},
  response_curve: {},
  response_curve_options: [],
  roi: {},
  roi_options: ['cost', 'cost_direct'],
  roi_select: '',
  torch_points_by_channel_vs_total_sales_trend: {},
  torch_points_by_channel_vs_total_sales_trend_options: [],
  torch_points_by_channel_vs_total_sales_trend_select: '',
  total_cost: [],
  total_cost_vs_total_sales: {},
  total_promotion_contribution: {},
  total_sales: [],
})

const previewModelOutputMetadataFn = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
  }
  let res = await previewModelOutputMetadata(param)
  if (res) {
    outputMetadata.output_time = res.output_time
    outputMetadata.model_time_period = res.model_time_period
    outputMetadata.aggregate_channel_list = res.aggregate_channel_list
    outputMetadata.segmentOptions = res.segment_options
    form.segmentation_type = outputMetadata.segmentOptions[0]
  }
}

const previewModelOutputResultFn = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
    segmentation_type: 'Total_market',
  }
  let res = await previewModelOutputResult(param)
  if (res) {
    outputData.total_cost = res.total_cost
    outputData.total_sales = res.total_sales
    outputData.total_cost_vs_total_sales = parseInt(res.total_cost_vs_total_sales * 100)
    for (let key in res.cost_distribution) {
      let item = {
        name: key,
        value: res.cost_distribution[key],
      }
      costDistributionOptions.series[0].data.push(item)
    }
    //current_unit_price
    for (let key in res.current_unit_price) {
      let item = {
        channel: key,
        price: res.current_unit_price[key].toFixed(2),
      }
      outputData.current_unit_price.push(item)
    }

    outputData.cost_by_channel_vs_total_sales_trend_options = Object.keys(
      res.cost_by_channel_vs_total_sales_trend,
    )
    outputData.cost_by_channel_vs_total_sales_trend_select =
      outputData.cost_by_channel_vs_total_sales_trend_options[0]

    outputData.cost_by_channel_vs_total_sales_trend = res.cost_by_channel_vs_total_sales_trend
    changeCost_by_channel_vs_total_sales_trend()

    outputData.torch_points_by_channel_vs_total_sales_trend =
      res.torch_points_by_channel_vs_total_sales_trend
    outputData.torch_points_by_channel_vs_total_sales_trend_options = Object.keys(
      res.torch_points_by_channel_vs_total_sales_trend,
    )
    outputData.torch_points_by_channel_vs_total_sales_trend_select =
      outputData.torch_points_by_channel_vs_total_sales_trend_options[0]
    changeTorch_points_by_channel_vs_total_sales_trend()

    promotionOptions.series[0].data = [res.promotion_vs_nonpromotion.y.promotion]
    promotionOptions.series[1].data = [res.promotion_vs_nonpromotion.y.nonpromotion]
    promotionOptions.xAxis[0].data = res.promotion_vs_nonpromotion.x

    //totalPromotionOptions
    for (let key in res.total_promotion_contribution) {
      let item = {
        name: key,
        value: res.total_promotion_contribution[key],
      }
      totalPromotionOptions.series[0].data.push(item)
    }
    outputData.roi = res.roi
    outputData.roi_select = outputData.roi_options[0]
    changeROI()

    outputData.response_curve = res.response_curve
    outputData.response_curve_options = Object.keys(res.response_curve)
    outputData.response_curve_select = outputData.response_curve_options[0]
    changeResponse_curve()

    let modelMetrics = {
      mape: res.model_metrics.MAPE.toFixed(2),
      R2: res.model_metrics.R_square.toFixed(2)
    }
    ModelMetricsTableData.push(modelMetrics)
  }
}

const changeCost_by_channel_vs_total_sales_trend = () => {
  costByChannelOptions.xAxis.data = []
  costByChannelOptions.series = []
  outputData.show_cost_by_channel_vs_total_sales_trend = false

  console.log(
    'outputData.cost_by_channel_vs_total_sales_trend_select',
    outputData.cost_by_channel_vs_total_sales_trend_select,
    outputData.cost_by_channel_vs_total_sales_trend[
      outputData.cost_by_channel_vs_total_sales_trend_select
    ]['cost']['y'],
  )

  costByChannelOptions.series.push({
    name: 'Cost',
    type: 'line',
    data: outputData.cost_by_channel_vs_total_sales_trend[
      outputData.cost_by_channel_vs_total_sales_trend_select
    ]['cost']['y'],
    markPoint: {
      data: [
        { type: 'max', name: 'Max' },
        { type: 'min', name: 'Min' },
      ],
    },
  })
  costByChannelOptions.series.push({
    name: 'Sales',
    type: 'line',
    data: outputData.cost_by_channel_vs_total_sales_trend[
      outputData.cost_by_channel_vs_total_sales_trend_select
    ]['sales']['y'],
    markPoint: {
      data: [
        { type: 'max', name: 'Max' },
        { type: 'min', name: 'Min' },
      ],
    },
  })

  costByChannelOptions.xAxis.data =
    outputData.cost_by_channel_vs_total_sales_trend[
      outputData.cost_by_channel_vs_total_sales_trend_select
    ]['cost']['x']
  outputData.show_cost_by_channel_vs_total_sales_trend = true
}

const changeTorch_points_by_channel_vs_total_sales_trend = () => {
  touchByChannelOptions.xAxis.data = []
  touchByChannelOptions.series = []

  touchByChannelOptions.series.push({
    name: 'Touch Points',
    type: 'line',
    data: outputData.torch_points_by_channel_vs_total_sales_trend[
      outputData.torch_points_by_channel_vs_total_sales_trend_select
    ]['tp']['y'],
    markPoint: {
      data: [
        { type: 'max', name: 'Max' },
        { type: 'min', name: 'Min' },
      ],
    },
  })
  touchByChannelOptions.series.push({
    name: 'Total Sales',
    type: 'line',
    data: outputData.torch_points_by_channel_vs_total_sales_trend[
      outputData.torch_points_by_channel_vs_total_sales_trend_select
    ]['sales']['y'],
    markPoint: {
      data: [
        { type: 'max', name: 'Max' },
        { type: 'min', name: 'Min' },
      ],
    },
  })

  touchByChannelOptions.xAxis.data =
    outputData.torch_points_by_channel_vs_total_sales_trend[
      outputData.torch_points_by_channel_vs_total_sales_trend_select
    ]['sales']['x']
}

const changeROI = () => {
  ROIChartOptions.xAxis.data = []
  ROIChartOptions.series[0].data = outputData.roi[outputData.roi_select].y
  ROIChartOptions.xAxis.data = outputData.roi[outputData.roi_select].x
  console.log('ROIChartOptions', ROIChartOptions)
}

const changeROItrigger = () => {}

const changeResponse_curve = () => {
  responseCurveOptions.xAxis.data = []
  responseCurveOptions.series[0].data = outputData.response_curve[outputData.response_curve_select].y
  responseCurveOptions.xAxis.data = outputData.response_curve[outputData.response_curve_select].x
}
onMounted(() => {
  previewModelOutputMetadataFn()
  previewModelOutputResultFn()
})

const data = reactive({
  costByChannelValue: '',
  touchByChannelValue: '',
  ROItrigger: 'ROI',
  ROIChannelValue: 'cost',
  responseCurveValue: '',
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
const costByChannelOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}M',
    },
  },
  series: [],
  tooltip: {
    trigger: 'axis',
  },
  toolbox: {
    show: false,
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      dataView: { readOnly: false },
      magicType: { type: ['line', 'bar'] },
      restore: {},
      saveAsImage: {},
    },
  },
  legend: {},
})
const touchByChannelOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}M',
    },
  },
  series: [],
  tooltip: {
    trigger: 'axis',
  },
  toolbox: {
    show: false,
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      dataView: { readOnly: false },
      magicType: { type: ['line', 'bar'] },
      restore: {},
      saveAsImage: {},
    },
  },
  legend: {},
})
const channeOptions = reactive([
  'F2F Call',
  ' Hospital Talk',
  'Digital-GSK',
  'Digital-third party',
  'Meeting online',
  'Meeting offline',
  'Sponsorship',
])
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
const responseCurveOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
    // axisLabel: {
    //   formatter: '{value}%',
    // },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}',
    },
  },
  series: [
    {
      name: 'Revenue',
      type: 'line',
      data: [],
      markLine: {
        itemStyle: {
          //盒须图样式。
          normal: {
            label: {
              formatter: 'Current\n Total ROI=1.82',
            },
          },
        },
        //name: '预警时间',
        //yAxisIndex: 0,
        symbol: 'none', //去掉箭头
        data: [[{ coord: ['100', 0] }, { coord: ['100', 'max'] }]],
      },
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
  toolbox: {
    show: false,
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      dataView: { readOnly: false },
      magicType: { type: ['line', 'bar'] },
      restore: {},
      saveAsImage: {},
    },
  },
  legend: {},
})
const ModelMetricsTableData = reactive([])

const goContinue = () => {}
</script>
<style lang="less" scoped>
.output-page {
  padding: 15px;
  .card-content {
    .title {
      border-left: 4px solid #000;
      padding: 0 6px;
      font-size: 16px;
      color: #000;
    }
    & > .el-row {
      margin-bottom: 20px;
      .chart-content {
        padding: 15px 0;
      }
      .channel-select-input {
        width: 240px;
        float: right;
      }
      .table-header-tip {
        margin: 0 5px;
      }
    }
    .label-title {
      display: inline-block;
      width: 3px;
      height: 30px;
      background-color: #000;
      margin-right: 10px;
    }
    .reset-button {
      margin: 0 20px;
    }
    .reset-tips {
      color: #000;
      color: #ad0202;
      font-size: 12px;
    }
    .importance-form {
      .importance {
        color: #e99d42;
        font-weight: bold;
      }
    }
  }
  .top {
    padding: 0 0 10px 0;
    color: #e99d42;
    font-size: 18px;
    font-weight: bold;
    & > span {
      margin: 0 10px;
    }
  }
  .channel-wrap {
    .channel-input {
      padding: 15px 0;
      .el-button {
        margin-bottom: 15px;
      }
      .channel-p {
        margin: 0 10px;
      }
    }
  }
  .foot-wrap {
    text-align: right;
  }

  .continue-wrap {
    text-align: center;
  }
}
</style>
<style lang="less">
#app .output-page {
  .descriptions-label {
    font-weight: bolder;
    color: #000;
  }
  .el-table__header th {
    background-color: #f4ce98;
    color: #000;
  }
}
</style>
