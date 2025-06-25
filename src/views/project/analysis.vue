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
            <el-radio-group v-model="form.adjust_priors" aria-label="label position" size="small">
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
          <el-form-item
            :label="item.channel_name"
            v-for="(item, index) in form.channel"
            :key="index"
          >
            <el-input-number v-model="item.channel_prior" :min="0" :max="100" size="small">
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
            <el-button
              type="primary"
              size="small"
              v-if="data.channelNumber === 'customized'"
              @click="createNewChannel"
            >
              <el-icon><CirclePlus /></el-icon>
              Create new channel
            </el-button>
            <ul class="select-wrap">
              <li v-for="(val, key) in form.agg_rule[data.channelNumber]">
                <el-select
                  v-model="form.agg_rule[data.channelNumber][key].channels"
                  multiple
                  placeholder="Select"
                  style="width: 440px"
                >
                  <el-option
                    v-for="item in options.channelListOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
                <span class="channel-p">
                  <el-icon><CaretRight /></el-icon>New channel name
                </span>
                <el-input
                  v-model="form.agg_rule[data.channelNumber][key].new_column_name"
                  style="width: 240px"
                  placeholder="Please input"
                />
              </li>
            </ul>
          </div>
        </div>
        <el-form label-width="auto">
          <el-form-item>
            <template v-slot:label> <i class="label-title"></i>Select segmentation type</template>
            <el-select v-model="form.segmentation_type" placeholder="Select" style="width: 440px">
              <el-option
                v-for="item in options.segmentOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="foot-button">
        <el-button type="primary" round size="small" @click="runConfirm">Confirm</el-button>
        <el-button type="info" round size="small" @click="runCancel">Cancel</el-button>
      </div>
    </el-card>
    <el-card v-if="progressForm.isPolling" style="width: 100%; height: 200px;" v-loading="progressForm.isPolling">
      <!-- <el-progress
        :percentage="progressForm.percentage"
        :stroke-width="15"
        striped
        striped-flow
        :duration="50"
      /> -->
    </el-card>
  </div>
</template>
<script setup>
import { reactive, onMounted, defineProps, watch } from 'vue'
import {
  previewRawData,
  runModeling,
  revokeTask,
  getCurrentModelTask,
  previewModelOutputParameters,
} from '../../api/api'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const props = defineProps({
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
})

const data = reactive({
  loading: false,
  currentProject: {},
  labelPosition: true,
  channelNumber: '7',
  task_id: '',
})

const form = reactive({
  channel: [],
  agg_rule: {
    7: [],
    9: [],
    customized: [],
  },
  segmentation_type: '',
  adjust_priors: true,
})

const progressForm = reactive({
  isPolling: false,
  pollingTimer: null,
  percentage: 0,
  task_status: '', //{FAILURE|PENDING|RECEIVED|RETRY|REVOKED|STARTED|SUCCESS}
})

const options = reactive({
  channelListOptions: [],
  segmentOptions: [],
})

// ["EMPTY","MODEL_RUNNING","MODEL_OUTPUT","SIMULATION","SIMULATION_RUNNING"]
const init = () => {
  console.log('data.currentProject.project_status', data.currentProject.project_status)
  if (data.currentProject.project_status === 'EMPTY') {
    getPreviewRawData()
  }
  if (data.currentProject.project_status === 'MODEL_RUNNING') {
    previewModelOutputParametersFn()
    startPolling()
  }
  if (
    data.currentProject.project_status === 'MODEL_OUTPUT' ||
    data.currentProject.project_status === 'SIMULATION' ||
    data.currentProject.project_status === 'SIMULATION_RUNNING'
  ) {
    previewModelOutputParametersFn()
  }
}

const getPreviewRawData = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
  }
  let res = await previewRawData(param)
  if (res) {
    formatRes(res)
  }
}

const createNewChannel = () => {
  let channel = {
    new_column_name: '',
    channels: [],
  }
  form.agg_rule['customized'].push(channel)
}

const runConfirm = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
    channel_layout: data.channelNumber,
    channel_agg_rule: {},
    prior_info_input: {
      channel_name: [],
      channel_prior: [],
    },
    segmentation_type: form.segmentation_type,
    adjust_priors: form.adjust_priors,
  }

  for (let i = 0; i < form.agg_rule[data.channelNumber].length; i++) {
    param.channel_agg_rule[form.agg_rule[data.channelNumber][i].new_column_name] =
      form.agg_rule[data.channelNumber][i].channels
  }
  //adjust_priors
  for (let i = 0; i < form.channel.length; i++) {
    param.prior_info_input.channel_name.push(form.channel[i].channel_name)
    param.prior_info_input.channel_prior.push(form.channel[i].channel_prior / 100)
  }

  let res = await runModeling(param)
  if (res && res.task_id) {
    data.task_id = res.task_id
    startPolling()
  }
}

const runCancel = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
  }
  let res = await revokeTask(param)
  if (res && res.status) {
    ElMessage({
      type: 'success',
      message: 'Task canceled',
    })
  }
}

//{FAILURE|PENDING|RECEIVED|RETRY|REVOKED|STARTED|SUCCESS}
const getCurrentModelTaskFn = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
  }
  let res = await getCurrentModelTask(param)
  if (res && res.task_status) {
    progressForm.task_status = res.task_status
    if (progressForm.task_status === 'FAILURE') {
      ElMessage({
        type: 'error',
        message: 'FAILURE',
      })
      data.loading = false
      stopPolling()
    } else if (progressForm.task_status === 'REVOKED') {
      ElMessage({
        type: 'error',
        message: 'REVOKED',
      })
      data.loading = false
      stopPolling()
    } else if (progressForm.task_status === 'SUCCESS') {
      ElMessage({
        type: 'success',
        message: 'SUCCESS',
      })
      data.loading = false
      stopPolling()
      router.push({
        name: 'output',
        params: { group: pageParam.group_name, project: pageParam.project_name },
      })
      location.reload()
    } else {
      if (progressForm.percentage < 95) {
        progressForm.percentage = progressForm.percentage + 5
      }
    }
  }
}

const startPolling = () => {
  if (progressForm.isPolling) {
    return
  }
  progressForm.isPolling = true
  progressForm.percentage = 0
  getCurrentModelTaskFn()
  progressForm.pollingTimer = setInterval(getCurrentModelTaskFn, 10000)
}

const stopPolling = () => {
  progressForm.isPolling = false
  clearInterval(progressForm.pollingTimer)
}

const previewModelOutputParametersFn = async () => {
  let param = {
    group_name: pageParam.group,
    project_name: pageParam.project,
  }
  let res = await previewModelOutputParameters(param)
  if (res) {
    formatResParam(res)
  }
}

const formatResParam = (res) => {
  let tempRes = res
  form.adjust_priors = tempRes.adjust_priors

  options.channelListOptions = Object.keys(tempRes.prior_info_input)
  for (let key in tempRes.prior_info_input) {
    form.channel.push({
      channel_name: key,
      channel_prior: parseInt(tempRes.prior_info_input[key] * 100),
    })
  }
  data.channelNumber = tempRes.channel_layout

  for (let key in tempRes.channel_agg_rule_input) {
      form.agg_rule[data.channelNumber].push({
        new_column_name: key,
        channels: tempRes.channel_agg_rule_input[key],
      })
    }

    form.segmentation_type = tempRes.segmentation_type_input
  
}

const formatRes = (res) => {
  let tempRes = res
  form.adjust_priors = tempRes.adjust_priors
  if (
    tempRes &&
    tempRes.default_channel_list &&
    tempRes.default_channel_list.channel_name &&
    tempRes.default_channel_list.channel_prior
  ) {
    options.channelListOptions = tempRes.default_channel_list.channel_name

    for (let key in tempRes.default_segmentation_type_list) {
      options.segmentOptions.push(key)
    }
    for (let i = 0; i < tempRes.default_channel_list.channel_name.length > 0; i++) {
      form.channel.push({
        channel_name: tempRes.default_channel_list.channel_name[i],
        channel_prior: parseInt(tempRes.default_channel_list.channel_prior[i] * 100),
      })
    }
    for (let key in tempRes.default_agg_rule['7']) {
      form.agg_rule['7'].push({
        new_column_name: key,
        channels: tempRes.default_agg_rule['7'][key],
      })
    }
    for (let key in tempRes.default_agg_rule['9']) {
      form.agg_rule['9'].push({
        new_column_name: key,
        channels: tempRes.default_agg_rule['9'][key],
      })
    }
  }
}

watch(
  () => props.project,
  (value) => {
    if (value && value.project_status) {
      data.currentProject = value
      init()
    }
  },
  { deep: true, immediate: true },
)
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
