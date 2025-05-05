<template>
  <div class="output-page">
    <div class="top">
      <el-icon><HomeFilled /></el-icon>
      <span>Channel Analysis Output</span>
    </div>
    <div class="overview">
      <el-descriptions title="" :column="4" direction="vertical">
        <el-descriptions-item label="OutTime" :span="2" label-class-name="descriptions-label"
          >2025-07-03</el-descriptions-item
        >
        <el-descriptions-item
          label="Model time period"
          :span="2"
          label-class-name="descriptions-label"
          >2023.01-2025.06</el-descriptions-item
        >
        <el-descriptions-item label="Channels" label-class-name="descriptions-label">
          <p>Number: 7</p>
          <p>channels: F2F call, Hospital Talk, Digital-GSK</p>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" :column="4">
        <el-descriptions-item label="Segment" :span="4" label-class-name="descriptions-label">
          <el-select v-model="data.segmentValue" placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in data.segmentOptions"
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
          <el-col :span="8">
            <span class="title">Total Cost</span>
            <span>1,456M</span>
          </el-col>
          <el-col :span="8">
            <span class="title">Total Sales</span>
            <span>1,960M</span>
          </el-col>
          <el-col :span="8">
            <span class="title">Total Cost/Total Sales</span>
            <span>73%</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <span class="title">Cost Distribution</span>
            <div class="chart-content">
              <bar :options="costDistributionOptions" chartId="costDistribution"></bar>
            </div>
          </el-col>
          <el-col :span="10">
            <span class="title">Current Unit Price</span>
            <div class="chart-content">
              <el-table :data="tableData" border style="width: 100%">
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
              v-model="data.costByChannelValue"
              placeholder="Select"
              class="channel-select-input"
            >
              <el-option v-for="item in channeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <div class="chart-content">
              <bar :options="costByChannelOptions" chartId="costByChannel"></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title">Touch Points by Channel VS Total Sales Trend</span>
            <el-select
              v-model="data.touchByChannelValue"
              placeholder="Select"
              class="channel-select-input"
            >
              <el-option v-for="item in channeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <div class="chart-content">
              <bar :options="touchByChannelOptions" chartId="touchByChannel"></bar>
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
              <bar :options="promotionOptions" chartId="promotion"></bar>
            </div>
          </el-col>
          <el-col :span="14">
            <span class="title">Total promotion Contribution</span>
            <div class="chart-content">
              <bar :options="totalPromotionOptions" chartId="totalPromotion"></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title">Promotion VS Non-promotion</span>
            <el-segmented v-model="data.ROItrigger" :options="['ROI', 'MROI']" />
            <el-select
              v-model="data.ROIChannelValue"
              placeholder="Select"
              class="channel-select-input"
            >
              <el-option v-for="item in ROIOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <div class="chart-content">
              <bar :options="ROIChartOptions" chartId="ROIChart"></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title">Response Curve</span>
            <el-select
              v-model="data.responseCurveValue"
              placeholder="Select"
              class="channel-select-input"
            >
              <el-option v-for="item in channeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <div class="chart-content">
              <bar :options="responseCurveOptions" chartId="responseCurveChart"></bar>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span class="title">Current Unit Price</span>

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
import { reactive } from 'vue'
const data = reactive({
  segmentOptions: ['Total Market', 'Segment1', 'Segment2'],
  segmentValue: '',
  costByChannelValue: '',
  touchByChannelValue: '',
  ROItrigger: 'ROI',
  ROIChannelValue: 'cost',
  responseCurveValue: '',
})
const tableData = reactive([
  { price: 1048, channel: 'F2F Call' },
  { price: 735, channel: 'Hospital Talk' },
  { price: 580, channel: 'Digital-GSK' },
  { price: 484, channel: 'Digital-third party' },
  { price: 300, channel: 'Meeting online' },
  { price: 300, channel: 'Meeting offline' },
  { price: 300, channel: 'Sponsorship' },
])
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
      data: [
        { value: 1048, name: 'F2F Call' },
        { value: 735, name: 'Hospital Talk' },
        { value: 580, name: 'Digital-GSK' },
        { value: 484, name: 'Digital-third party' },
        { value: 300, name: 'Meeting online' },
        { value: 300, name: 'Meeting offline' },
        { value: 300, name: 'Sponsorship' },
      ],
    },
  ],
})
const costByChannelOptions = reactive({
  xAxis: {
    type: 'category',
    data: ['20-Nov', '20-Dec', '21-Jan', '21-Feb', '21-Mar', '21-Apr', '21-May'],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}M',
    },
  },
  series: [
    {
      name: 'Cost',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
    },
    {
      name: 'Total Sales',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310],
      markPoint: {
        // label: {
        //   show: true,
        //   formatter:
        //     'The peak F2F call cost occurred in Dec.2021,reaching 180M,\n 48% above the average of the analysis period.',
        //   offset: [0, -10],
        // },
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
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
const touchByChannelOptions = reactive({
  xAxis: {
    type: 'category',
    data: ['20-Nov', '20-Dec', '21-Jan', '21-Feb', '21-Mar', '21-Apr', '21-May'],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}M',
    },
  },
  series: [
    {
      name: 'Touch Points',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
      },
    },
    {
      name: 'Total Sales',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310],
      markPoint: {
        // label: {
        //   show: true,
        //   formatter:
        //     'The peak F2F call cost occurred in Dec.2021,reaching 180M,\n 48% above the average of the analysis period.',
        //   offset: [0, -10],
        // },
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' },
        ],
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
      data: ['Sales contribution'],
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
      data: [120],
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
      data: [22],
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
      data: [
        { value: 1048, name: 'F2F Call' },
        { value: 735, name: 'Hospital Talk' },
        { value: 580, name: 'Digital-GSK' },
        { value: 484, name: 'Digital-third party' },
        { value: 300, name: 'Meeting online' },
        { value: 300, name: 'Meeting offline' },
        { value: 300, name: 'Sponsorship' },
      ],
    },
  ],
})
const ROIOptions = reactive(['cost', 'cost-indirect cost'])
const ROIChartOptions = reactive({
  xAxis: {
    type: 'category',
    data: channeOptions,
  },
  yAxis: {
    type: 'value',
  },
  tooltip: {
    trigger: 'axis',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
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
    data: ['0', '20', '40', '60', '80', '100', '120'],
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
      data: [120, 132, 101, 134, 90, 230, 210],
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
const ModelMetricsTableData = reactive([{ mape: 8.41, R2: 0.623 }])

const goContinue = () => {
  
}


</script>
<style lang="less" scoped>
.output-page {
  padding: 15px;
  // .card-title {
  //   background-color: #e99d42;
  //   display: inline-block;
  //   color: #fff;
  //   border-radius: 20px;
  //   & > i {
  //     display: inline-block;
  //     width: 15px;
  //     height: 15px;
  //     text-align: center;
  //     line-height: 15px;
  //     background-color: #fff;
  //     color: #000;
  //     border: 2px solid #000;
  //     border-radius: 10px;
  //   }
  //   & > span {
  //     padding: 0 20px 0 5px;
  //   }
  // }
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
