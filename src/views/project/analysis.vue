<template>
  <div class="analysis-page">
    <div class="top">
      <el-icon><HomeFilled /></el-icon>
      <span>Channel Analysis</span>
    </div>
    <div class="card-title">
      <i>1</i>
      <span>Priors and Channel Aggregation</span>
    </div>
    <el-card>
      <div class="content">
        <el-form label-width="auto">
          <el-form-item>
            <template v-slot:label> <i class="label-title"></i> Adjust priors?</template>
            <el-radio-group v-model="data.labelPosition" aria-label="label position" size="small">
              <el-radio-button :value="true">True</el-radio-button>
              <el-radio-button :value="false">false</el-radio-button>
            </el-radio-group>
            <el-button type="info" size="small" class="reset-button">Reset to Default</el-button>
            <span class="reset-tips"
              >*Note: Dafault values come from IQVIA industry experience</span
            >
          </el-form-item>
        </el-form>
        <el-form label-width="auto" label-position="left" class="importance-form">
          <el-form-item label="" label-width="200px">
            <p class="importance">Promotion importance(0-100%)</p>
          </el-form-item>
          <el-form-item label="F2F call">
            <el-input-number v-model="data.F2F" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="HT">
            <el-input-number v-model="data.HT" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="Digital - GSK">
            <el-input-number v-model="data.GSK" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="Digital - 3rd party">
            <el-input-number v-model="data.party" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="meeting - Standalone online">
            <el-input-number v-model="data.standaloneOnline" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="meeting - Collaborative online">
            <el-input-number v-model="data.collaborativeOnline" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="meeting - Standalone offline">
            <el-input-number v-model="data.standaloneOffline" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="meeting - Collaborative offline">
            <el-input-number v-model="data.collaborativeOffline" :min="0" :max="100" size="small">
              <template #suffix>
                <span>%</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-form>
        <el-form label-width="auto">
          <el-form-item>
            <template v-slot:label>
              <i class="label-title"></i>Select the number of channels</template
            >
          </el-form-item>
        </el-form>
        <div class="channel-wrap">
          <el-radio-group v-model="data.channelNumber" aria-label="label position" size="small">
            <el-radio-button value="7">7 Channels </el-radio-button>
            <el-radio-button value="9">9 Channels </el-radio-button>
            <el-radio-button value="customized">Customized </el-radio-button>
          </el-radio-group>
          <div class="channel-input">
            <el-button type="primary" size="small">
              <el-icon><CirclePlus /></el-icon>
              Create new channel
            </el-button>
            <ul class="select-wrap">
              <li>
                <el-select
                  v-model="data.selsectChannel"
                  multiple
                  placeholder="Select"
                  style="width: 440px"
                >
                  <el-option
                    v-for="item in data.channelList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
                <span class="channel-p">
                  <el-icon><CaretRight /></el-icon>New channel name
                </span>
                <el-input v-model="input" style="width: 240px" placeholder="Please input"  />
              </li>
            </ul>
          </div>
        </div>
        <el-form label-width="auto">
          <el-form-item>
            <template v-slot:label> <i class="label-title"></i>Select segmentation type</template>
            <el-select v-model="data.segmentationValue" placeholder="Select" style="width: 440px">
              <el-option
                v-for="item in data.segmentationOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="foot-button">
        <el-button type="primary" round size="small">Confirm</el-button>
        <el-button type="info" round size="small">Cancel</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
const data = reactive({
  labelPosition: true,
  F2F: 76,
  HT: 57,
  GSK: 53,
  party: 51,
  standaloneOnline: 57,
  collaborativeOnline: 57,
  standaloneOffline: 75,
  collaborativeOffline: 75,
  channelNumber: 'customized',
  channelList: [
    'F2F call',
    'HT',
    'Digital - GSK',
    'Digital - 3rd party',
    'meeting - Standalone online',
    'meeting - Collaborative online',
    'meeting - Standalone offline',
    'meeting - Collaborative offline',
    'Select the number of channels',
  ],
  selsectChannel: [],
  segmentationOptions: [
    'Type1: Central, Region, Others',
    'Type2: Core, Engine, Others',
    'Type3: Lupus, Non-Lupus',
    'Type4: Lupus Demonstration, Lupus Certification, Non-Lupus',
  ],
  segmentationValue: '',
})
</script>

<style lang="less" scoped>
.analysis-page {
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
.analysis-page {
  .channel-wrap {
    .el-radio-group {
      width: 100%;
      .el-radio-button,
      .el-radio-button__inner {
        width: 30%;
      }
      .el-radio-button__inner {
        width: 100%;
      }
    }
  }
  .el-radio-button.is-active
    .el-radio-button__original-radio:not(:disabled)
    + .el-radio-button__inner {
    background-color: #e99d42;
    border: #e99d42;
  }
}
</style>
