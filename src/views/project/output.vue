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
      <div class="content">
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
          <el-col :span="12">
            <span class="title">Cost Distribution</span>
            <bar :options="costDistributionOptions" chartId="costDistribution"></bar>
          </el-col>
          <el-col :span="12">
            <span class="title">Current Unit Price</span>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="channel" label="Channel" width="180" align="center"/>
              <el-table-column prop="price" label="Unit Price(CNY per TP)" width="180" align="center"/>
            </el-table>
          </el-col>
        </el-row>
        <span class="title">Cost by Channel VS Total Sales Trend</span>
        
      </div>
    </el-card>
    <div class="card-title">
      <i>2</i>
      <span>Channel contribution & ROI</span>
    </div>
    <el-card>
      <div class="content"></div>
    </el-card>
  </div>
</template>
<script setup>
import bar from '../../components/bar.vue'
import { reactive } from 'vue'
const data = reactive({
  segmentOptions: ['Total Market', 'Segment1', 'Segment2'],
  segmentValue: '',
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
        show: false,
        position: 'center',
      },
      labelLine: {
        show: false,
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
</script>
<style lang="less" scoped>
.output-page {
  padding: 15px;
  .card-title {
    background-color: #e99d42;
    display: inline-block;
    color: #fff;
    border-radius: 20px;
    & > i {
      display: inline-block;
      width: 15px;
      height: 15px;
      text-align: center;
      line-height: 15px;
      background-color: #fff;
      color: #000;
      border: 2px solid #000;
      border-radius: 10px;
    }
    & > span {
      padding: 0 20px 0 5px;
    }
  }
  .content {
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
  .foot-button {
    text-align: right;
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
    background-color: #F4CE98;
    color: #000;
}
}
</style>
