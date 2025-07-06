<template>
  <div class="output-page">
    <div class="top">
      <el-icon><HomeFilled /></el-icon>
      <span>Channel Analysis Output</span>
      <el-dropdown>
        <el-button type="primary">
          Navigation Bar<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goPage('analysis')">Channel Analysis</el-dropdown-item>
            <el-dropdown-item
              @click="goPage('output')"
              v-if="
                props.project.project_status === 'MODEL_OUTPUT' ||
                props.project.project_status === 'SIMULATION' ||
                props.project.project_status === 'SIMULATION_RUNNING'
              "
              >Channel Analysis Output</el-dropdown-item
            >
            <el-dropdown-item
              @click="goPage('simulator')"
              v-if="
                props.project.project_status === 'MODEL_OUTPUT' ||
                props.project.project_status === 'SIMULATION' ||
                props.project.project_status === 'SIMULATION_RUNNING'
              "
              >Simulation</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
              class="channle-list-span"
              >{{ item }}
            </span>
          </p>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" :column="4">
        <el-descriptions-item label="Segment" :span="4" label-class-name="descriptions-label">
          <el-select
            v-model="form.segmentation_type"
            placeholder="Select"
            class="select-btn-240"
            @change="changeSegment"
          >
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
              <bar
                :options="costDistributionOptions"
                chartId="costDistribution"
                :key="pageParam.timestamp"
              ></bar>
            </div>
          </el-col>
          <el-col :span="10">
            <span class="title">Current Unit Price</span>
            <div class="chart-content">
              <el-table :data="outputData.current_unit_price" border>
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
            <div class="chart-content">
              <bar
                :options="costByChannelOptions"
                :chartId="outputData.cost_by_channel_vs_total_sales_trend_select + 'costByChannel'"
                v-if="costByChannelOptions.xAxis.data.length > 0"
                :key="outputData.cost_by_channel_vs_total_sales_trend_select + pageParam.timestamp"
              ></bar>
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
                :chartId="
                  outputData.torch_points_by_channel_vs_total_sales_trend_select + 'touchByChannel'
                "
                v-if="touchByChannelOptions.xAxis.data.length > 0"
                :key="
                  outputData.torch_points_by_channel_vs_total_sales_trend_select +
                  pageParam.timestamp
                "
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
                :key="pageParam.timestamp"
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
                :key="pageParam.timestamp"
              ></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title"></span>
            <el-segmented v-model="data.ROItrigger" :options="['ROI', 'MROI']" />
            <div v-if="data.ROItrigger === 'ROI'">
              <el-select
                v-model="outputData.roi_select"
                placeholder="Select"
                class="channel-select-input"
                @change="changeROI"
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
                  :key="outputData.roi_select + pageParam.timestamp"
                ></bar>
              </div>
            </div>
            <div v-if="data.ROItrigger === 'MROI'">
              <el-select
                v-model="outputData.mroi_select"
                placeholder="Select"
                class="channel-select-input"
                @change="changeMROI"
              >
                <el-option
                  v-for="item in outputData.mroi_options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div class="chart-content">
                <bar
                  :options="MROIChartOptions"
                  chartId="MROIChart"
                  v-if="MROIChartOptions.xAxis.data.length > 0"
                  :key="outputData.mroi_select + pageParam.timestamp"
                ></bar>
              </div>
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
              @change="changeResponse_curve"
            >
              <el-option
                v-for="item in outputData.response_curve_options"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <div class="chart-content-curve">
              <bar
                :options="responseCurveOptions"
                :chartId="outputData.response_curve_select + 'responseCurveChart'"
                v-if="responseCurveOptions.xAxis.data.length > 0"
                :Key="outputData.response_curve_select + pageParam.timestamp"
              ></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span class="title">Model Metrics</span>

            <div class="chart-content">
              <el-table :data="outputData.modelMetricsTableData" border>
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
    <!-- 暂时禁掉 -->
    <div class="foot-wrap">
      <el-button type="primary" @click="downloadFn">
        <el-icon><Download /></el-icon>
        Download Data
      </el-button>
    </div>
  </div>
</template>
<script setup>
import bar from '../../components/bar.vue'
import { reactive, onMounted, defineProps } from 'vue'
import { previewModelOutputMetadata, previewModelOutputResult } from '../../api/api'
import { useRoute, useRouter } from 'vue-router'
import { basic } from '../../config'

const props = defineProps({
  project_status: {
    type: String,
    requred: true,
  },
  project: {
    type: Object,
    requred: true,
  },
})
const route = useRoute()
const router = useRouter()

const pageParam = reactive({
  group: route.params.group,
  project: route.params.project,
  timestamp: Date.now(),
})

const outputMetadata = reactive({
  output_time: '',
  model_time_period: '',
  aggregate_channel_list: [],
  segmentOptions: [],
  segmentOptions_select: '',
})

const form = reactive({
  segmentation_type: '',
})

const outputData = reactive({
  cost_by_channel_vs_total_sales_trend: {},
  cost_by_channel_vs_total_sales_trend_options: [],
  cost_by_channel_vs_total_sales_trend_select: '',
  current_unit_price: [],
  mroi: {},
  mroi_options: ['cost', 'cost_direct'],
  mroi_select: 'cost',
  promotion_vs_nonpromotion: {},
  response_curve: {},
  response_curve_options: [],
  response_curve_select: '',
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
  modelMetricsTableData: [],
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
    previewModelOutputResultFn()
  }
}

const changeSegment = () => {
  previewModelOutputResultFn()
}

const previewModelOutputResultFn = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
    segmentation_type: form.segmentation_type,
  }
  let res = await previewModelOutputResult(param)
  if (res) {
    pageParam.timestamp = Date.now()
    outputData.total_cost = res.total_cost
    outputData.total_sales = res.total_sales
    outputData.total_cost_vs_total_sales = parseInt(res.total_cost_vs_total_sales * 100)

    costDistributionOptions.series[0].data = []
    for (let key in res.cost_distribution) {
      let item = {
        name: key,
        value: res.cost_distribution[key],
      }
      costDistributionOptions.series[0].data.push(item)
    }
    //current_unit_price
    outputData.current_unit_price = []
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
    totalPromotionOptions.series[0].data = []
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

    outputData.mroi = res.mroi
    outputData.mroi_select = outputData.roi_options[0]
    changeMROI()
    // MROIChartOptions.xAxis.data = []
    // MROIChartOptions.series[0].data = outputData.mroi[outputData.mroi_select].y
    // MROIChartOptions.xAxis.data = outputData.mroi[outputData.mroi_select].x

    outputData.response_curve = res.response_curve
    outputData.response_curve_options = Object.keys(res.response_curve)
    outputData.response_curve_select = outputData.response_curve_options[0]
    changeResponse_curve()

    outputData.modelMetricsTableData = []
    let modelMetrics = {
      mape: res.model_metrics.MAPE.toFixed(2),
      R2: res.model_metrics.R_square.toFixed(2),
    }
    outputData.modelMetricsTableData.push(modelMetrics)
  }
}

const changeCost_by_channel_vs_total_sales_trend = () => {
  costByChannelOptions.xAxis.data = []
  costByChannelOptions.series = []

  costByChannelOptions.series.push({
    name: 'Cost',
    type: 'line',
    yAxisIndex: 0,
    color: '#f4ce98',
    data: outputData.cost_by_channel_vs_total_sales_trend[
      outputData.cost_by_channel_vs_total_sales_trend_select
    ]['cost']['y'],
    markPoint: {
      data: [
        {
          name: outputData.cost_by_channel_vs_total_sales_trend[
            outputData.cost_by_channel_vs_total_sales_trend_select
          ]['desc_marked'][1],
          value: '',
          xAxis:
            outputData.cost_by_channel_vs_total_sales_trend[
              outputData.cost_by_channel_vs_total_sales_trend_select
            ]['date_marked']['max'][0],
          yAxis:
            outputData.cost_by_channel_vs_total_sales_trend[
              outputData.cost_by_channel_vs_total_sales_trend_select
            ]['date_marked']['max'][1],
        },
        {
          name: outputData.cost_by_channel_vs_total_sales_trend[
            outputData.cost_by_channel_vs_total_sales_trend_select
          ]['desc_marked'][0],
          value: '',
          xAxis:
            outputData.cost_by_channel_vs_total_sales_trend[
              outputData.cost_by_channel_vs_total_sales_trend_select
            ]['date_marked']['min'][0],
          yAxis:
            outputData.cost_by_channel_vs_total_sales_trend[
              outputData.cost_by_channel_vs_total_sales_trend_select
            ]['date_marked']['min'][1],
        },
      ],
      label: {
        formatter: (param) => {
          const text = param.name
          const maxLength = 50
          let result = ''
          for (let i = 0; i < text.length; i += maxLength) {
            result += text.substring(i, i + maxLength) + '\n'
          }
          return result + param.value
        },
        color: '#000',
      },
    },
  })
  costByChannelOptions.series.push({
    name: 'Sales',
    type: 'line',

    yAxisIndex: 1,
    data: outputData.cost_by_channel_vs_total_sales_trend[
      outputData.cost_by_channel_vs_total_sales_trend_select
    ]['sales']['y'],
  })

  costByChannelOptions.xAxis.data =
    outputData.cost_by_channel_vs_total_sales_trend[
      outputData.cost_by_channel_vs_total_sales_trend_select
    ]['cost']['x']
}

const changeTorch_points_by_channel_vs_total_sales_trend = () => {
  touchByChannelOptions.xAxis.data = []
  touchByChannelOptions.series = []

  touchByChannelOptions.series.push({
    name: 'Touch Points',
    type: 'line',
    color: '#f4ce98',
    yAxisIndex: 0,
    data: outputData.torch_points_by_channel_vs_total_sales_trend[
      outputData.torch_points_by_channel_vs_total_sales_trend_select
    ]['tp']['y'],
    markPoint: {
      data: [
        {
          name: outputData.torch_points_by_channel_vs_total_sales_trend[
            outputData.torch_points_by_channel_vs_total_sales_trend_select
          ]['desc_marked'][1],
          value: '',
          xAxis:
            outputData.torch_points_by_channel_vs_total_sales_trend[
              outputData.torch_points_by_channel_vs_total_sales_trend_select
            ]['date_marked']['max'][0],
          yAxis:
            outputData.torch_points_by_channel_vs_total_sales_trend[
              outputData.torch_points_by_channel_vs_total_sales_trend_select
            ]['date_marked']['max'][1],
        },
        {
          name: outputData.torch_points_by_channel_vs_total_sales_trend[
            outputData.torch_points_by_channel_vs_total_sales_trend_select
          ]['desc_marked'][0],
          value: '',
          xAxis:
            outputData.torch_points_by_channel_vs_total_sales_trend[
              outputData.torch_points_by_channel_vs_total_sales_trend_select
            ]['date_marked']['min'][0],
          yAxis:
            outputData.torch_points_by_channel_vs_total_sales_trend[
              outputData.torch_points_by_channel_vs_total_sales_trend_select
            ]['date_marked']['min'][1],
        },
      ],
      label: {
        formatter: (param) => {
          const text = param.name
          const maxLength = 50
          let result = ''
          for (let i = 0; i < text.length; i += maxLength) {
            result += text.substring(i, i + maxLength) + '\n'
          }
          return result + param.value
        },
        color: '#000',
      },
    },
  })
  touchByChannelOptions.series.push({
    name: 'Total Sales',
    type: 'line',
    yAxisIndex: 1,
    data: outputData.torch_points_by_channel_vs_total_sales_trend[
      outputData.torch_points_by_channel_vs_total_sales_trend_select
    ]['sales']['y'],
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
}

const changeMROI = () => {
  MROIChartOptions.xAxis.data = []
  MROIChartOptions.series[0].data = outputData.mroi[outputData.mroi_select].y
  MROIChartOptions.xAxis.data = outputData.mroi[outputData.mroi_select].x
}

const changeResponse_curve = () => {
  responseCurveOptions.xAxis.data = []

  responseCurveOptions.series[0].data = []
  for (
    let i = 0;
    i < outputData.response_curve[outputData.response_curve_select].x.length > 0;
    i++
  ) {
    let item = [
      outputData.response_curve[outputData.response_curve_select].x[i],
      outputData.response_curve[outputData.response_curve_select].y[i],
    ]
    responseCurveOptions.series[0].data.push(item)
  }

  // responseCurveOptions.series[0].data =
  //   outputData.response_curve[outputData.response_curve_select].y
  responseCurveOptions.series[0].markLine.data = []
  responseCurveOptions.series[0].markLine.data.push({
    name: '',
    xAxis:
      outputData.response_curve[
        outputData.response_curve_select
      ].current_spending_marked[0].toString(),
  })
  responseCurveOptions.series[0].markLine.label.formatter =
    outputData.response_curve[outputData.response_curve_select].current_roi[0]

  setTimeout(() => {
    responseCurveOptions.xAxis.data = outputData.response_curve[outputData.response_curve_select].x
  }, 500)
}
onMounted(() => {
  previewModelOutputMetadataFn()
})

const data = reactive({
  costByChannelValue: '',
  touchByChannelValue: '',
  ROItrigger: 'ROI',
  ROIChannelValue: 'cost',
  responseCurveValue: '',
  key: Date.now(),
})

const downloadFn = () => {
  const port = window.location.port ? window.location.port : ''
  const baseUrl = `${window.location.protocol}//${window.location.hostname}:${port}`
  window.location.href = `${baseUrl}${basic.apiUrl}contents/${pageParam.group}/${pageParam.project}/modeling/download`
}

const costDistributionOptions = reactive({
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
      radius: ['10%', '60%'],
      avoidLabelOverlap: false,
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
const costByChannelOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: [
    {
      name: 'Cost(CNY)',
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      name: 'Sales(CNY) ',
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],

  series: [],
  // tooltip: {
  //   show: true,
  //   trigger: 'axis',
  // },

  legend: {
    data: ['Cost', 'Sales'],
  },
})
const touchByChannelOptions = reactive({
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: [
    {
      name: 'Touch Point',
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      name: 'Sales(CNY)',
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [],
  // tooltip: {
  //   trigger: 'axis',
  // },
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
      // axisLabel: {
      //   formatter: '{value}',
      // },
    },
  ],
  series: [
    {
      name: 'Promotion',
      type: 'bar',
      stack: 'Ad',

      data: [],
      label: {
        show: true,
        formatter: (params) => {
          let sum = 0
          for (let i = 0; i < promotionOptions.series.length; i++) {
            sum += promotionOptions.series[i].data[params.dataIndex]
          }
          let percent = ((params.value / sum) * 100).toFixed(1) + '%'
          let num = params.value
          if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B' + ', ' + percent
          } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M' + ', ' + percent
          } else {
            return num.toFixed(2) + ', ' + percent
          }
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
      data: [],
      label: {
        show: true,
        formatter: (params) => {
          let sum = 0
          for (let i = 0; i < promotionOptions.series.length; i++) {
            sum += promotionOptions.series[i].data[params.dataIndex]
          }
          let percent = ((params.value / sum) * 100).toFixed(1) + '%'
          let num = params.value
          if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B' + ', ' + percent
          } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M' + ', ' + percent
          } else {
            return num.toFixed(2) + ', ' + percent
          }
        },
      },
      itemStyle: {
        color: '#f9d2a3',
      },
    },
  ],
})
const totalPromotionOptions = reactive({
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
      radius: ['10%', '60%'],
      avoidLabelOverlap: false,
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
  // tooltip: {
  //   trigger: 'axis',
  // },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        formatter: (params) => params.value.toFixed(2),
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
  // tooltip: {
  //   trigger: 'axis',
  // },
  series: [
    {
      data: [],
      type: 'bar',
      label: {
        show: true,
        formatter: (params) => params.value.toFixed(2),
      },
      itemStyle: {
        color: '#e99d42',
      },
    },
  ],
})
const responseCurveOptions = reactive({
  xAxis: {
    type: 'value',
    data: [],
    // axisLabel: {
    //   formatter: (params) => {
    //      return Number(params).toFixed(0)
    //     // return 4000
    //   },
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
      name: 'Sales',
      type: 'line',
      data: [],
      markLine: {
        //盒须图样式。
        label: {
          show: true,
          formatter: '',
        },
        //name: '预警时间',
        //yAxisIndex: 0,
        symbol: 'none', //去掉箭头

        data: [],
      },
    },
  ],
  // tooltip: {
  //   trigger: 'axis',
  // },

  legend: {},
})

const change_response_curve_select = () => {}

const goContinue = () => {
  window.location.href = `/simulator/${pageParam.group}/${pageParam.project}`
}

const goPage = (name) => {
  window.location.href = `/${name}/${pageParam.group}/${pageParam.project}`
}
</script>
<style lang="less" scoped>
.output-page {
  padding: 15px;
  .channle-list-span {
    margin: 0 5px;
  }
  .select-btn-240 {
    width: 240px;
  }
  .el-dropdown {
    float: right;
  }
  .card-content {
    .title {
      border-left: 4px solid #000;
      padding: 0 6px;
      font-size: 16px;
      color: #000;
    }
    & > .el-row {
      margin-bottom: 40px;
      .chart-content {
        padding: 15px 0;
      }
      .chart-content-curve {
        margin-top: 20px;
        min-height: 300px;
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
