<template>
  <div class="simulator-page">
    <div class="top">
      <el-icon><Back /></el-icon>
      <span>Simulator</span>
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
                data.currentProject.project_status === 'MODEL_OUTPUT' ||
                data.currentProject.project_status === 'SIMULATION' ||
                data.currentProject.project_status === 'SIMULATION_RUNNING'
              "
              >Channel Analysis Output</el-dropdown-item
            >
            <el-dropdown-item
              @click="goPage('simulator')"
              v-if="
                data.currentProject.project_status === 'MODEL_OUTPUT' ||
                data.currentProject.project_status === 'SIMULATION' ||
                data.currentProject.project_status === 'SIMULATION_RUNNING'
              "
              >Simulation</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="top-btn-wrap" v-if="data.showAddBtn && !data.currentProject.hide">
      <el-button type="primary" @click="addSimulationFn">
        <el-icon><CirclePlus /></el-icon>
        Create new simulation
      </el-button>
    </div>

    <ul class="list-content" v-if="data.simulationList.length > 0">
      <li v-for="(item, index) in data.simulationList" :key="index" :id="item.simulation_name">
        <div class="card-title">
          <i>{{ index + 1 }}</i>
          <span>{{ item.simulation_name }}</span>
        </div>
        <el-card>
          <span class="failed-tips" v-if="item.simulation_task_status === 'SIMULATION_FAILED'"
            >The last run of this simulation failed. If the error persists, please contact
            IQVIA.</span
          >
          <el-icon
            class="delete-btn"
            @click="deleteConfirm(item.simulation_name)"
            v-if="
              data.currentProject && data.currentProject.simulation_privileges.includes('Delete')
            "
            ><Delete
          /></el-icon>
          <el-icon
            class="delete-btn"
            @click="renameFn(item)"
            v-if="
              data.currentProject && data.currentProject.simulation_privileges.includes('Rename')
            "
            ><EditPen
          /></el-icon>
          <template
            v-if="
              data.currentProject &&
              data.currentProject.simulation_privileges.includes('Visibility')
            "
          >
            <el-icon
              class="delete-btn"
              v-if="item.is_visible"
              @click="simulationVisibilityFn(item.simulation_name, 0)"
              ><View
            /></el-icon>
            <el-icon
              class="delete-btn"
              v-if="!item.is_visible"
              @click="simulationVisibilityFn(item.simulation_name, 1)"
              ><Hide
            /></el-icon>
          </template>

          <el-form label-position="left" ref="metadataFormRef">
            <el-form-item label="Optimization Type" label-width="200px">
              <span>{{ item.optimization_type }}</span>
            </el-form-item>
            <el-form-item label="Time Period" prop="n_time_periods">
              <el-input-number
                v-model="item.n_time_periods"
                :min="0"
                :max="100"
                size="small"
                :disabled="data.currentProject.hide"
              >
                <template #suffix>
                  <span>Month</span>
                </template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="Budget(of the time period)">
              <el-input-number
                v-model="item.budget"
                :min="0"
                size="small"
                class="input-btn-250"
                @blur="changeBudget(index)"
                :disabled="data.currentProject.hide"
              >
                <template #suffix>
                  <span>CNY</span>
                </template>
              </el-input-number>
              <span>{{ item.budgetLabel }}</span>
            </el-form-item>
            <el-form-item label="">
              <div>
                <p class="tips">
                  {{ item.average_monthly_cost }}
                </p>
              </div>
            </el-form-item>
            <el-form-item>
              <p class="title">Unit Price Change</p>
              <el-table
                v-if="data.simulationList[index].unit_price_pct_input"
                :data="data.simulationList[index].unit_price_pct_input"
                border
                header-row-class-name="header-unit"
              >
                <el-table-column prop="channel" label="Channel" />
                <el-table-column prop="unit_price" label="Unit Price" :formatter="floatFormat" />
                <el-table-column prop="if_changes" label="If changes">
                  <template #default="scope">
                    <el-segmented
                      v-model="scope.row.if_changes"
                      :options="['unchanged', 'up', 'down']"
                      :disabled="data.currentProject.hide"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Change percentage">
                  <template #default="scope">
                    <span v-if="scope.row.if_changes === 'up' || scope.row.if_changes === 'down'">
                      <el-input-number
                        v-model="item.unit_price_pct_input[scope.$index].change_percentage"
                        :min="1"
                        :disabled="data.currentProject.hide"
                      >
                        <template #suffix>
                          <span>%</span>
                        </template>
                      </el-input-number>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <div class="constraint-wrap" v-if="item.optimization_type === 'fixed_budget'">
              <p class="title">Constraints on Channels</p>

              <el-row
                v-for="(unitValue, unitIndex) in item.constraints_on_channels"
                :key="unitIndex"
              >
                <el-col :span="8">
                  <span class="title">{{ unitValue.channel }}</span>
                </el-col>

                <el-col :span="6">
                  <span>Channel Constraint</span>
                  <el-segmented
                    v-model="unitValue.constraint"
                    size="small"
                    :options="[true, false]"
                    :disabled="data.currentProject.hide"
                  >
                    <template #default="scope">
                      <div class="flex flex-col items-center gap-2 p-2">
                        <div>{{ scope.item }}</div>
                      </div>
                    </template>
                  </el-segmented>
                </el-col>
                <el-col :span="5">
                  <span>Min Spend</span>
                  <el-input-number
                    v-model="unitValue.min_spend"
                    :controls="false"
                    size="small"
                    :disabled="unitValue.constraint === false || data.currentProject.hide"
                  />
                </el-col>
                <el-col :span="5">
                  <span>Max Spend</span>
                  <el-input-number
                    v-model="unitValue.max_spend"
                    :controls="false"
                    size="small"
                    :disabled="unitValue.constraint === false || data.currentProject.hide"
                  />
                </el-col>
              </el-row>
            </div>
            <div class="constraint-wrap" v-if="item.optimization_type === 'mccp_suggestion'">
              <p class="title">Constraints on MCCP Suggested Channels</p>

              <el-row
                v-for="(unitValue, unitIndex) in item.constraints_on_channels"
                :key="unitIndex"
              >
                <el-col :span="4">
                  <span class="title">{{ unitValue.channel }}</span>
                </el-col>
                <el-col :span="5">
                  <span>TP</span>
                  <span>{{ floatFormat0(unitValue.TP) }}</span>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div class="btn-wrap" v-if="!data.currentProject.hide">
            <el-button
              type="primary"
              @click="commitSimulation(index)"
              :loading="item.progressForm && item.progressForm.isPolling"
              >Confirm</el-button
            >
            <el-button type="info" @click="resetFn(index)">Reset Parameter</el-button>
          </div>
          <div class="output-wrap" v-if="item.simulation_task_status === 'SIMULATION_OUTPUT'">
            <el-divider />
            <Output :simulation="item.simulation_name" v-if="item.simulation_name"></Output>
          </div>
          <el-button
            type="primary"
            @click="downloadFn(item.simulation_name)"
            v-show="item.canDownload"
          >
            <el-icon><Download /></el-icon>
            Download Data
          </el-button>
        </el-card>
      </li>
    </ul>

    <el-dialog v-model="data.dialogFormVisible" title="Create a New Simulation">
      <el-form :model="simulationForm" ref="simulationFormRef" :rules="simulationFormRules">
        <el-form-item label="Enter a name" prop="simulation_name">
          <el-input v-model="simulationForm.simulation_name" />
        </el-form-item>
        <el-form-item label="Optimization Type" prop="optimization_type">
          <el-segmented
            v-model="simulationForm.Optimization_Type"
            :options="['fixed_budget', 'mccp_suggestion']"
          />
        </el-form-item>
        <el-form-item
          label="Select the MCCP suggestion reference month "
          v-if="simulationForm.Optimization_Type === 'mccp_suggestion'"
          prop="MCCP_cycle"
        >
          <el-select v-model="simulationForm.MCCP_cycle" placeholder="Select" class="width-440">
            <el-option
              v-for="item in simulationForm.MCCP_cycle_options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <p class="tips">
          *NOTE: The MCCP reference month can be selected up to month T+1, if the analyzed period
          ends in month T.
        </p>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addConfirmFn"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="data.renameDialog" title="Rename Simulation">
      <el-form ref="renameFormRef">
        <el-form-item label="Enter a new name" prop="simulation_name">
          <el-input v-model="data.renameForm.simulation_name" disabled />
        </el-form-item>
        <el-form-item label="Enter a new name" prop="simulation_name">
          <el-input v-model="data.renameForm.simulation_name_new" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.renameDialog = false">Cancel</el-button>
          <el-button type="primary" @click="renameComfirm"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, reactive, ref, watch, defineEmits, resolveDirective } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addSimulation,
  previewModelSimulatingMetadata,
  previewRawData,
  simulationRename,
  deleteSimulation,
  runSimulation,
  previewSimulations,
  simulationVisibility,
  getProjectList,
  getCurrentSimulatingTask,
  getSimulationsParam,
} from '../../api/api'
import { useRouter } from 'vue-router'
import Output from './simulatorOutput.vue'
import { basic } from '../../config'

const emits = defineEmits(['setProject'])
const router = useRouter()

const data = reactive({
  loading: false,
  dialogFormVisible: false,
  group_name: router.currentRoute._value.params.group,
  project_name: router.currentRoute._value.params.project,
  // project_status: '',
  simulationList: [],
  simulationProps: [],
  renameDialog: false,
  renameForm: {
    simulation_name: '',
    simulation_name_new: '',
  },
  changesList: ['unchanged', 'up', 'down'],
  currentProject: {},
  showAddBtn: true,
})

const props = defineProps({
  project: {
    type: Object,
    requred: true,
  },
  // simulation_list: {
  //   type: Array,
  //   required: true,
  // },
})

const simulationFormRules = reactive({
  simulation_name: [{ required: true, message: 'Please input simulation name', trigger: 'blur' }],
  MCCP_cycle: [
    {
      required: true,
      message: 'Please select MCCP_cycle',
      trigger: 'blur',
    },
  ],
})

const simulationForm = reactive({
  simulation_name: '',
  Optimization_Type: 'fixed_budget', // MCCP suggestion | Fixed Budget
  MCCP_cycle: '', // 20250225
  MCCP_cycle_options: [],
})

const addSimulationFn = () => {
  clearObject(simulationForm)
  data.dialogFormVisible = true
  previewRawDataFn()
}

const previewRawDataFn = async () => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
  }
  let res = await previewRawData(param)
  if (res && res.mccp_yyyymm_list.length > 0) {
    simulationForm.MCCP_cycle_options = res.mccp_yyyymm_list
  }
}

const clearObject = (obj) => {
  simulationForm.simulation_name = ''
  simulationForm.Optimization_Type = 'fixed_budget'
  simulationForm.MCCP_cycle = ''
}

const simulationFormRef = ref(null)

const addConfirmFn = async () => {
  await simulationFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      let param = {
        group_name: data.group_name,
        project_name: data.project_name,
        ...simulationForm,
      }
      let res = await addSimulation(param)
      if (res && res.status === 1) {
        ElMessage({
          message: 'Create success!',
          type: 'success',
        })

        data.dialogFormVisible = false
        getProjectListFn()
      }
    } else {
      ElMessage.error('The input is incomplete. Please fill in all the required fields.')
    }
  })
}

const getProjectListFn = async () => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
  }
  let res = await getProjectList(param)
  if (res) {
    data.project_list = res.project_list

    let index = res.project_list.findIndex((item) => {
      return item.project_name === data.currentProject.project_name
    })

    if (index > -1) {
      data.currentProject = data.project_list[index]
      data.simulationList = data.currentProject.simulation_list
      emits('setProject', data.currentProject)
      // initSimulation()
    }
  }
}

const getMetaData = async (simulation_name) => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: simulation_name,
  }
  let res = await previewModelSimulatingMetadata(param)
  if (res) {
    let index = data.simulationList.findIndex((item) => {
      return item.simulation_name === simulation_name
    })
    if (index > -1) {
      let simulation_item = {
        showOutput: false,
        optimization_type: res.optimization_type,
        n_time_periodss: res.n_time_periods,
        budget: res.budget,
        budgetLabel: formatBudgetLabel(res.budget),
        unit_price_pct_input: [],

        constraints_on_channels: [],
        average_monthly_cost: res.average_monthly_cost,
      }

      for (let orderIndex = 0; orderIndex < res.ori_channel_order.length; orderIndex++) {
        let key = res.ori_channel_order[orderIndex]
        let item = {
          channel: key,
          unit_price: res.unit_price_pct_input[key].default_price,
          if_changes: '',
          change_percentage: res.unit_price_pct_input[key].change_percentage,
        }
        for (let i = 0; i < res.unit_price_pct_input[key].if_changes.length; i++) {
          if (res.unit_price_pct_input[key].if_changes[i] === 1) {
            item.if_changes = data.changesList[i]
            break
          }
        }
        simulation_item.unit_price_pct_input.push(item)
      }

      // 顺序 AB Protion 一起改
      if (res.optimization_type === 'fixed_budget') {
        for (let i = 0; i < res.ori_channel_order.length; i++) {
          let item = {
            channel: res.ori_channel_order[i],
            ...res.constraints_on_channels[res.ori_channel_order[i]],
          }
          simulation_item.constraints_on_channels.push(item)
        }
      } else {
        for (let key in res.constraints_on_channels) {
          let item = {
            channel: key,
            TP: res.constraints_on_channels[key].TP,
          }
          simulation_item.constraints_on_channels.push(item)
        }
      }
      data.simulationList[index] = { ...data.simulationList[index], ...simulation_item }
    }
  }
}

const renameFn = (item) => {
  data.renameForm.simulation_name = item.simulation_name
  data.renameDialog = true
}

const renameComfirm = async () => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: data.renameForm.simulation_name,
    simulation_name_new: data.renameForm.simulation_name_new,
  }
  let res = await simulationRename(param)
  if (res && res.status === 1) {
    ElMessage({
      message: 'Create success!',
      type: 'success',
    })
    data.renameDialog = false
    getProjectListFn()
  }
}

const deleteConfirm = (simulation_name) => {
  ElMessageBox.confirm(`This action will remove simulation. Continue?`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      deleteSimulationFn(simulation_name)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

const deleteSimulationFn = async (simulation_name) => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: simulation_name,
  }
  let res = await deleteSimulation(param)
  if (res && res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Delete success',
    })
    getProjectListFn()
  }
}
const floatFormat = (row, column, cellValue) => {
  if (cellValue) {
    return Number(cellValue)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
        return $1 + ','
      })
      .replace(/\.$/, '')
  }
}
const floatFormat0 = (cellValue) => {
  if (cellValue) {
    return Number(cellValue)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

const commitSimulation = async (index) => {
  if (!data.simulationList[index].n_time_periods) {
    ElMessage({
      type: 'error',
      message: 'Please input Time Period',
    })
    return
  }
  if (!data.simulationList[index].budget) {
    ElMessage({
      type: 'error',
      message: 'Please input Budget(of the time period)',
    })
    return
  }
  for (let i = 0; i < data.simulationList.length; i++) {
    if (data.simulationList[i].progressForm.isPolling) {
      ElMessage({
        type: 'error',
        message: 'A simulation task is in progress. Please try again later.',
      })
      return
    }
  }
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: data.simulationList[index].simulation_name,
    optimization_type: data.simulationList[index].optimization_type,
    n_time_periods: data.simulationList[index].n_time_periods,
    budget: data.simulationList[index].budget,
    unit_price_pct: {},

    constraints_on_channels: {},
  }

  for (let i = 0; i < data.simulationList[index].unit_price_pct_input.length; i++) {
    param.unit_price_pct[data.simulationList[index].unit_price_pct_input[i].channel] = {
      default_price: data.simulationList[index].unit_price_pct_input[i].unit_price,
      change_percentage: data.simulationList[index].unit_price_pct_input[i].change_percentage,
      if_changes: [0, 0, 0],
    }

    let changeIndex = data.changesList.findIndex((changeItem) => {
      return changeItem === data.simulationList[index].unit_price_pct_input[i].if_changes
    })

    param.unit_price_pct[data.simulationList[index].unit_price_pct_input[i].channel].if_changes[
      changeIndex
    ] = 1

    if (data.simulationList[index].optimization_type === 'fixed_budget') {
      for (let i = 0; i < data.simulationList[index].constraints_on_channels.length; i++) {
        if (
          data.simulationList[index].constraints_on_channels[i].constraint &&
          data.simulationList[index].constraints_on_channels[i].min_spend >
            data.simulationList[index].constraints_on_channels[i].max_spend
        ) {
          ElMessage({
            type: 'error',
            message: 'Min spend should be less than or equal to Max spend',
          })
          return
        }
        param.constraints_on_channels[
          data.simulationList[index].constraints_on_channels[i].channel
        ] = {
          constraint: data.simulationList[index].constraints_on_channels[i].constraint,
          max_spend: data.simulationList[index].constraints_on_channels[i].max_spend,
          min_spend: data.simulationList[index].constraints_on_channels[i].min_spend,
        }
      }
    } else {
      for (let i = 0; i < data.simulationList[index].constraints_on_channels.length; i++) {
        param.constraints_on_channels[
          data.simulationList[index].constraints_on_channels[i].channel
        ] = {
          TP: data.simulationList[index].constraints_on_channels[i].TP,
        }
      }
    }
  }
  data.loading = true
  let res = await runSimulation(param)

  if (res && res.status === 1) {
    // task_id
    getSimulationsParamFn(param.simulation_name)
    let progressForm = {
      isPolling: false,
      pollingTimer: null,
      task_status: '', //{FAILURE|PENDING|RECEIVED|RETRY|REVOKED|STARTED|SUCCESS}
    }
    data.simulationList[index].progressForm = progressForm

    startPolling(param.simulation_name, index)
  }
}

const init = () => {
  // ["EMPTY","MODEL_RUNNING","MODEL_OUTPUT","SIMULATION","SIMULATION_RUNNING"]

  if (
    data.currentProject.project_status === 'EMPTY' ||
    data.currentProject.project_status === 'MODEL_RUNNING' ||
    data.currentProject.project_status === 'MODEL_FAILED'
  ) {
    data.simulationList = []
    data.showAddBtn = false
  }
  if (data.currentProject.project_status === 'MODEL_OUTPUT') {
    data.simulationList = []
  }
  if (
    data.currentProject.project_status === 'SIMULATION' ||
    data.currentProject.project_status === 'SIMULATION_RUNNING' ||
    data.currentProject.project_status === 'SIMULATION_FAILED'
  ) {
    initSimulation()
  }
}
const progressForm = reactive({
  isPolling: false,
  pollingTimer: null,
  task_status: '', //{FAILURE|PENDING|RECEIVED|RETRY|REVOKED|STARTED|SUCCESS}
})

const startPolling = (simulation, index) => {
  if (data.simulationList[index].progressForm.isPolling) {
    return
  }
  data.simulationList[index].progressForm.isPolling = true

  getCurrentSimulatingTaskFn(simulation, index)

  data.simulationList[index].progressForm.pollingTimer = setInterval(() => {
    getCurrentSimulatingTaskFn(simulation, index)
  }, 30000)
}

const stopPolling = (index) => {
  console.log(' data.simulationList[index]', data.simulationList[index])
  data.simulationList[index].progressForm.isPolling = false
  clearInterval(data.simulationList[index].progressForm.pollingTimer)
}

const getCurrentSimulatingTaskFn = async (simulation, index) => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: simulation,
  }
  let res = await getCurrentSimulatingTask(param)
  if (res) {
    data.simulationList[index].progressForm.task_status = res.task_status
    if (data.simulationList[index].progressForm.task_status === 'FAILURE') {
      ElMessage({
        type: 'error',
        message: 'FAILURE',
      })
      data.loading = false
      stopPolling(index)
    } else if (data.simulationList[index].progressForm.task_status === 'REVOKED') {
      ElMessage({
        type: 'error',
        message: 'REVOKED',
      })
      data.loading = false
      stopPolling(index)
    } else if (data.simulationList[index].progressForm.task_status === 'SUCCESS') {
      ElMessage({
        type: 'success',
        message: 'SUCCESS',
      })
      data.loading = false
      stopPolling(index)
      // setTimeout(() => {
      //   getProjectListFn()
      // }, 1500)
      getProjectListFn()
    }
  }
}

const initSimulation = () => {
  data.simulationList = data.currentProject.simulation_list
  for (let i = 0; i < data.simulationList.length; i++) {
    if (data.simulationList[i].progressForm && data.simulationList[i].progressForm.pollingTimer) {
      stopPolling(i)
    }

    let progressForm = {
      isPolling: false,
      pollingTimer: null,
      task_status: '', //{FAILURE|PENDING|RECEIVED|RETRY|REVOKED|STARTED|SUCCESS}
    }
    data.simulationList[i].progressForm = progressForm

    if (data.simulationList[i].simulation_task_status === 'SIMULATION_OUTPUT') {
      data.simulationList[i].canDownload = true
      getSimulationsParamFn(data.simulationList[i].simulation_name)
    }
    if (data.simulationList[i].simulation_task_status === 'SIMULATION_EMPTY') {
      getMetaData(data.simulationList[i].simulation_name)
    }
    if (data.simulationList[i].simulation_task_status === 'SIMULATION_FAILED') {
      getMetaData(data.simulationList[i].simulation_name)
    }
    if (data.simulationList[i].simulation_task_status === 'SIMULATION_RUNNING') {
      getSimulationsParamFn(data.simulationList[i].simulation_name)
      startPolling(data.simulationList[i].simulation_name, i)
    }
  }
}

const resetFn = (index) => {
  getMetaData(data.simulationList[index].simulation_name)
}

const getSimulationsParamFn = async (simulation) => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: simulation,
  }
  let res = await getSimulationsParam(param)
  if (res && res.simulation_parameters) {
    let index = data.simulationList.findIndex((item) => {
      return item.simulation_name === simulation
    })
    if (index > -1) {
      let simulation_item = {
        showOutput: false,
        optimization_type: res.simulation_parameters.optimization_type,
        n_time_periods: res.simulation_parameters.n_time_periods,
        budget: res.simulation_parameters.budget,
        budgetLabel: formatBudgetLabel(res.simulation_parameters.budget),
        unit_price_pct_input: [],

        constraints_on_channels: [],
        average_monthly_cost: res.average_monthly_cost,
      }
      for (let orderIndex = 0; orderIndex < res.ori_channel_order.length; orderIndex++) {
        let key = res.ori_channel_order[orderIndex]
        let item = {
          channel: key,
          unit_price: res.simulation_parameters.unit_price_pct_input[key].default_price,
          if_changes: '',
          change_percentage: res.simulation_parameters.unit_price_pct_input[key].change_percentage,
        }
        for (
          let i = 0;
          i < res.simulation_parameters.unit_price_pct_input[key].if_changes.length;
          i++
        ) {
          if (res.simulation_parameters.unit_price_pct_input[key].if_changes[i] === 1) {
            item.if_changes = data.changesList[i]
            break
          }
        }
        simulation_item.unit_price_pct_input.push(item)
      }
      if (res.simulation_parameters.optimization_type === 'fixed_budget') {
        for (let i = 0; i < res.ori_channel_order.length; i++) {
          let item = {
            channel: res.ori_channel_order[i],
            ...res.simulation_parameters.constraints_on_channels[res.ori_channel_order[i]],
          }

          simulation_item.constraints_on_channels.push(item)
        }
        data.simulationList[index] = { ...data.simulationList[index], ...simulation_item }
      } else {
        for (let key in res.simulation_parameters.constraints_on_channels) {
          let item = {
            channel: key,
            TP: res.simulation_parameters.constraints_on_channels[key].TP,
          }
          simulation_item.constraints_on_channels.push(item)
        }
        data.simulationList[index] = { ...data.simulationList[index], ...simulation_item }
      }
    }
  }
}

const changeBudget = (index) => {
  data.simulationList[index].budgetLabel = formatBudgetLabel(data.simulationList[index].budget)
}

const formatBudgetLabel = (number) => {
  if (number) {
    return Number(number)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
        return $1 + ','
      })
      .replace(/\.$/, '')
  }
}

const simulationVisibilityFn = async (simulation, visible) => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
    simulation_name: simulation,
    status: visible,
  }
  let res = await simulationVisibility(param)
  if (res && res.status) {
    ElMessage({
      type: 'success',
      message: visible === 1 ? 'visible' : 'not visible',
    })
    let index = data.simulationList.findIndex((item) => {
      return item.simulation_name === simulation
    })
    if (index > -1) {
      data.simulationList[index].is_visible = !data.simulationList[index].is_visible
    }
  }
}

const downloadFn = async (simulation_name) => {
  const port = window.location.port ? window.location.port : ''
  const baseUrl = `${window.location.protocol}//${window.location.hostname}:${port}`
  window.location.href = `${baseUrl}${basic.apiUrl}contents/${data.group_name}/${data.project_name}/${simulation_name}/simulating/download`
}

const savePackageFn = async () => {
  // multichannel/projects/<str:group_name>/<str:project_name>?action=export_json
  const port = window.location.port ? window.location.port : ''
  const baseUrl = `${window.location.protocol}//${window.location.hostname}:${port}`
  window.location.href = `${baseUrl}${basic.apiUrl}projects/${data.group_name}/${data.project_name}?action=export_json`
}

const goPage = (name) => {
  window.location.href = `/${name}/${data.group_name}/${data.project_name}`
}

watch(
  () => props.project,
  (value) => {
    if (value && value.project_status) {
      data.currentProject = value
      init()
    }
  },
  { deep: false, immediate: true },
)

onUnmounted(() => {
  for (let i = 0; i < data.simulationList.length; i++) {
    if (data.simulationList[i].progressForm && data.simulationList[i].progressForm.pollingTimer) {
      stopPolling(i)
    }
  }
})
</script>
<style lang="less" scoped>
.simulator-page {
  padding: 15px;
  .input-btn-250 {
    width: 250px;
  }
  .width-440 {
    width: 440px;
  }
  .foot-wrap {
    text-align: right;
  }
  .top {
    padding: 0 0 10px 0;
    color: #e99d42;
    font-size: 18px;
    font-weight: bold;
    & > span {
      margin: 0 10px;
      cursor: pointer;
    }
    & > i {
      cursor: pointer;
    }
    .el-dropdown {
      float: right;
    }
  }
  .top-btn-wrap {
    .el-icon {
      margin-right: 10px;
    }
  }
  .tips {
    font-size: 12px;
    color: #bd3124;
  }
  .list-content {
    padding: 15px 0;
    & > li {
      .el-card {
        .failed-tips {
          color: #bd3124;
          font-weight: bold;
          margin-bottom: 20px;
          display: inline-block;
          font-size: 14px;
        }
        .delete-btn {
          float: right;
          margin-right: 20px;
          font-weight: bold;
          font-size: 18px;
        }
        .el-form {
          .el-form-item {
            .title {
              color: #606266;
              margin-bottom: 10px;
              width: 100%;
            }
            :deep(.el-table) {
              .header-unit {
                color: #000;
                th.el-table__cell {
                  background-color: #f5ce9f;
                  text-align: center;
                }
              }
              .el-table__body {
                td {
                  text-align: center;
                }
              }
            }
          }
          .constraint-wrap {
            p.title {
              color: #606266;
              margin-bottom: 30px;
              width: 100%;
              .float-right {
                float: right;
                .el-select {
                  width: 150px;
                  margin: 0 15px;
                }
              }
            }
            .el-row {
              margin-bottom: 15px;
              .title {
                color: #000;
                border-left: 4px solid #000;
                padding: 0 6px;
              }
              .el-col {
                & > span {
                  margin-right: 10px;
                }
              }
            }
          }
        }
        .btn-wrap {
          text-align: right;
        }
      }
    }
  }
}
</style>
