<template>
  <div class="simulator-page">
    <div class="top">
      <el-icon><Back /></el-icon>
      <span>Simulator</span>
    </div>
    <div class="top-btn-wrap">
      <el-button type="primary" @click="addSimulationFn">
        <el-icon><CirclePlus /></el-icon>
        Create new simulation
      </el-button>
    </div>
    <ul class="list-content">
      <li>
        <div class="card-title">
          <i>1</i>
          <span>Simulation 1</span>
        </div>
        <el-card>
          <el-icon class="delete-btn"><Delete /></el-icon>
          <el-form label-width="auto" label-position="left" :model="metadata" ref="metadataFormRef">
            <el-form-item label="Optimization Type" label-width="200px">
              <span>{{ metadata.optimization_type }}</span>
            </el-form-item>
            <el-form-item label="Time Period" prop="time_period">
              <el-input-number v-model="metadata.time_period" :min="0" :max="100" size="small">
                <template #suffix>
                  <span>Month</span>
                </template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="Budget(of the time period)">
              <el-input-number v-model="metadata.budget" :min="0" size="small" style="width: 250px">
                <template #suffix>
                  <span>CNY</span>
                </template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="">
              <div>
                <p class="tips">
                  Note: The average monthly budget for the modeling period is 38,900,000.
                </p>
                <p class="tips">It is recommended that the total budget be set on this basis.</p>
              </div>
            </el-form-item>
            <el-form-item>
              <p class="title">Unit Price Change</p>
              <el-table
                :data="metadata.unit_price_and_constraints"
                border
                style="width: 100%"
                header-row-class-name="header-unit"
              >
                <el-table-column prop="channel" label="Channel" />
                <el-table-column prop="unit_price" label="Unit Price" :formatter="floatFormat" />
                <el-table-column prop="if_changes" label="If changes">
                  <template #default="scope">
                    <el-segmented
                      v-model="scope.row.if_changes"
                      :options="['unchanged', 'up', 'down']"
                      disabled
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Change percentage(1~100%)">
                  <template #default="scope">
                    <span v-if="scope.row.if_changes === 'up' || scope.row.if_changes === 'down'">
                      {{ scope.row.change_percentage }}%
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <div class="constraint-wrap">
              <p class="title">Constraints on Channels</p>
              <el-row v-for="(item, index) in metadata.unit_price_and_constraints" :key="index">
                <el-col :span="4">
                  <span class="title">{{ item.channel }}</span>
                </el-col>
                <el-col :span="7">
                  <span>Channel Constraint</span>
                  <el-segmented
                    v-model="item.channel_contraint"
                    :options="['Yes', 'No']"
                    size="small"
                  />
                </el-col>
                <el-col :span="6">
                  <span>Min Speed</span>
                  <el-input-number
                    v-model="item.min_spend"
                    :controls="false"
                    size="small"
                    :disabled="item.channel_contraint === 'No'"
                  />
                </el-col>
                <el-col :span="6">
                  <span>Max Speed</span>
                  <el-input-number
                    v-model="item.max_spend"
                    :controls="false"
                    size="small"
                    :disabled="item.channel_contraint === 'No'"
                  />
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div class="btn-wrap">
            <el-button type="primary">Commit</el-button>
            <el-button type="info">Reset</el-button>
          </div>
          <div class="output-wrap">
            <el-divider />
            <Output></Output>
          </div>
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
            v-model="simulationForm.optimization_type"
            :options="['Fixed Budget', 'MCCP suggestion']"
          />
        </el-form-item>
        <el-form-item
          label="Select the MCCP suggestion reference month "
          v-if="simulationForm.optimization_type === 'MCCP suggestion'"
          prop="MCCP_cycle"
        >
          <el-date-picker
            v-model="simulationForm.MCCP_cycle"
            type="date"
            placeholder="Pick a day"
            value-format="YYYYMMDD"
          />
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
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addSimulation, previewSimulationMetadata } from '../../api/api'
import { useRouter } from 'vue-router'
import Output from './simulatorOutput.vue'
const router = useRouter()

const data = reactive({
  dialogFormVisible: false,
  group_name: router.currentRoute._value.params.group,
  project_name: router.currentRoute._value.params.project,
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
  optimization_type: 'Fixed Budget', // MCCP suggestion | Fixed Budget
  MCCP_cycle: '', // 20250225
})

const addSimulationFn = () => {
  clearObject(simulationForm)
  data.dialogFormVisible = true
}

const clearObject = (obj) => {
  simulationForm.simulation_name = ''
  simulationForm.optimization_type = 'Fixed Budget'
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
      // let res = await addSimulation(param)
      ElMessage({
        message: 'Create success!',
        type: 'success',
      })
      data.dialogFormVisible = false
    } else {
      ElMessage.error('The input is incomplete. Please fill in all the required fields.')
    }
  })
}

const metadata = reactive({
  optimization_type: 'Fixed Budget', // "MCCP suggestion"|"Fixed Budget"
  time_period: 6,
  budget: 0,
  unit_price_and_constraints: [
    {
      channel: 'F2F call',
      unit_price: 3334412,
      if_changes: 'unchanged',
      change_percentage: 0,
      channel_contraint: 'Yes',
      min_spend: 100000,
      max_spend: 200000,
      field_configurable: ['Unit Price', 'Min Spend', 'Max Spend'],
    },
    {
      channel: 'Hospital Talk',
      unit_price: 33351,
      if_changes: 'up',
      change_percentage: 10,
      channel_contraint: 'No',
      min_spend: 100000,
      max_spend: 200000,
      field_configurable: ['Unit Price', 'Min Spend', 'Max Spend'],
    },
  ],
})
const getMetaData = async () => {
  let param = {
    group_name: data.group_name,
    project_name: data.project_name,
  }
  let res = await previewSimulationMetadata(param)
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
</script>
<style lang="less" scoped>
.simulator-page {
  padding: 15px;
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
        .delete-btn {
          float: right;
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
            .title {
              color: #606266;
              margin-bottom: 20px;
              width: 100%;
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
