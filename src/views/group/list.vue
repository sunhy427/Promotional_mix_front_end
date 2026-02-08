<template>
  <div class="list-page">
    <el-empty description="Group list is empty." v-if="data.groupList.length === 0" />
    <div class="demo-collapse" v-if="data.groupList.length > 0">
      <el-collapse accordion>
        <el-collapse-item
          :name="item.group_name"
          v-for="(item, index) in data.groupList"
          :key="index"
        >
          <template #title>
            <el-icon><ArrowLeftBold /></el-icon>
            <el-icon><Folder /></el-icon>
            <i class="i-group">{{ item.group_name.charAt(0) }}</i>
            <div class="info">
              <div class="group-name">
                <p class="name">{{ item.group_name }}</p>
                <p>Created {{ formatDate(item.created_datetime) }}</p>
              </div>

              <div class="number">
                <el-button
                  type="primary"
                  color="#e99d42"
                  @click.stop="
                    createAndUploadAnalysisFn(item.group_name, itemGroupInternalPrivileges)
                  "
                  v-for="itemGroupInternalPrivileges in item.group_internal_privileges"
                >
                  {{ itemGroupInternalPrivileges }}
                </el-button>
                <span class="span-100">
                  <span>
                    <!-- <el-icon @click.stop="deleteGroupConfirm(item.group_name)"><Delete /></el-icon> -->
                    <el-icon><Document /></el-icon>
                    <span>{{ item.project_list.length }}</span>
                  </span>
                </span>
              </div>
            </div>
          </template>
          <ul class="list" v-if="item.project_list.length > 0">
            <li v-for="(itemProject, indexProject) in item.project_list" :key="indexProject">
              <i>{{ itemProject.project_name.charAt(0) }}</i>
              <div class="info">
                <div class="group-name">
                  <p class="name">{{ itemProject.project_name }}</p>
                  <p>
                    Updated
                    {{ formatDate(itemProject.updated_datetime) }}
                  </p>
                </div>

                <div class="publish">
                  <el-checkbox
                    v-if="itemProject.project_privileges.includes('Publish')"
                    v-model="itemProject.is_publish"
                    label="Publish"
                    size="small"
                    @click.native.prevent="
                      handlePublish(
                        item.group_name,
                        itemProject.project_name,
                        itemProject.is_publish,
                      )
                    "
                  />
                </div>

                <div class="btn-wrap">
                  <span
                    v-for="(itemPrivileges, indexPrivileges) in itemProject.project_privileges"
                    :key="indexPrivileges"
                    class="analysis-btn"
                  >
                    <template v-if="itemPrivileges != 'Publish'">
                      <a
                        v-if="itemPrivileges === 'Enter'"
                        @click="
                          goProject(
                            item.group_name,
                            itemProject.project_name,
                            itemProject.project_status,
                          )
                        "
                      >
                        <el-icon><Promotion /></el-icon>
                        {{ itemPrivileges }}
                      </a>
                      <a
                        v-if="itemPrivileges === 'Copy'"
                        @click="openForkProjectDialog(item.group_name, itemProject.project_name)"
                      >
                        <el-icon><CopyDocument /></el-icon>
                        {{ itemPrivileges }}
                      </a>
                      <a
                        v-if="itemPrivileges === 'Share'"
                        @click="openShareProjectDialog(item.group_name, itemProject.project_name)"
                      >
                        <el-icon><Share /></el-icon>
                        {{ itemPrivileges }}
                      </a>
                      <a
                        v-if="itemPrivileges === 'Delete'"
                        @click="deleteProjectConfirm(item.group_name, itemProject.project_name)"
                      >
                        <el-icon><Delete /></el-icon>
                        {{ itemPrivileges }}
                      </a>
                      <a
                        v-if="itemPrivileges === 'Rename'"
                        @click="openRenameProjectDialog(item.group_name, itemProject.project_name)"
                      >
                        <el-icon><Edit /></el-icon>
                        {{ itemPrivileges }}
                      </a>
                    </template>
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <el-empty v-else description="Empty" />
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="bottom" v-if="data.groupList.length > 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="data.page.total"
        :page-size="data.page.size"
        :hide-on-single-page="true"
        @current-change="changePage"
      />
    </div>

    <el-dialog v-model="data.showRenameGroupDialog" title="Rename Current Group" @keyup.enter="confirmRenameGroup">
      <el-form :model="renameGroupForm" label-position="top">
        <el-form-item label="Enter New Group Name" :label-width="200">
          <el-input v-model="renameGroupForm.group_name_new" @keyup.enter="confirmRenameGroup" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.showRenameGroupDialog = false">Cancel</el-button>
          <el-button type="primary" @click="confirmRenameGroup" @keyup.enter="confirmRenameGroup"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="data.showRenameProjectDialog" title="Rename Current Analysis" @keyup.enter="confirmRenameProject">
      <el-form :model="form" label-position="top">
        <el-form-item label="Enter New Analysis Name" :label-width="200">
          <el-input v-model="renameProjectForm.project_name_new" @keyup.enter="confirmRenameProject" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.showRenameProjectDialog = false">Cancel</el-button>
          <el-button type="primary" @click="confirmRenameProject" @keyup.enter="confirmRenameProject"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="data.showCreateProjectDialog" title="Create a New Analysis Project" @keyup.enter="confirmCreateProject">
      <el-form :model="createProjectForm" label-position="top" ref="createProjectFormRef" :rules="createProjectRules">
        <el-form-item label="Enter project name" :label-width="200" prop="project_name">
          <el-input v-model="createProjectForm.project_name" @keyup.enter="confirmCreateProject" />
        </el-form-item>
        <el-form-item label="Select brand" :label-width="200" prop="brand_name">
          <el-select v-model="createProjectForm.brand_name" placeholder="Select" @change="handleBrandChange">
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in createOptions.brand_name_list"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Select data version" :label-width="200" prop="data_version_id">
          <el-select v-model="createProjectForm.data_version_id" placeholder="Select" :disabled="!createProjectForm.brand_name" @change="handleDataVersionChange">
            <el-option
              :label="item"
              :value="item"
              v-for="(item, index) in createOptions.data_version_id_list"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Select the last month of the analysis time period" :label-width="200" prop="date_range">
          <el-date-picker
            v-model="createProjectForm.date_range"
            type="monthrange"
            range-separator="To"
            start-placeholder="Start Month"
            end-placeholder="End Month"
            :disabled="!createProjectForm.brand_name || !createProjectForm.data_version_id"
            @change="handleDateRangeChange"
            value-format="YYYYMM"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.showCreateProjectDialog = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="confirmCreateProject"
            @keyup.enter="confirmCreateProject"
            :loading="createProjectForm.loading"
            :disabled="!isFormValid"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="data.showShareProjectDialog" title="Share Project" @keyup.enter="shareProjectConfirm">
      <el-form
        :model="shareProjectForm"
        label-width="140"
        ref="shareProjectRuleFormRef"
        :rules="shareProjectRuleFormRefRules"
      >
        <el-form-item label="Group Name">
          <el-input v-model="shareProjectForm.group_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="Project Name">
          <el-input v-model="shareProjectForm.project_name" :disabled="true" />
        </el-form-item>
        <!-- <el-form-item label="Share Type">
          <el-select v-model="shareProjectForm.type" placeholder="Please select share type">
            <el-option label="Mudid" value="mudid" />
            <el-option label="Email address" value="email address" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="Mudid" prop="mudid">
          <el-input v-model="shareProjectForm.mudid" @keyup.enter="shareProjectConfirm" />
        </el-form-item>
        <el-form-item label="Message">
          <el-input v-model="shareProjectForm.msg" @keyup.enter="shareProjectConfirm" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.showShareProjectDialog = false">Cancel</el-button>
          <el-button type="primary" @click="shareProjectConfirm()" @keyup.enter="shareProjectConfirm()"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="data.showForkProjectDialog" title="Copy a project file" @keyup.enter="forkProjectConfirm">
      <el-form
        :model="forkProjectForm"
        label-width="140"
        ref="forkProjectRuleFormRef"
        :rules="forkProjectRuleFormRefRules"
      >
        <el-form-item label="New Group Name">
          <el-select v-model="forkProjectForm.group_name_new" placeholder="Select">
            <el-option :label="item" :value="item" v-for="(item, index) in data.groupListOptions" />
          </el-select>
        </el-form-item>
        <el-form-item label="New Project Name">
          <el-input v-model="forkProjectForm.project_name_new" @keyup.enter="forkProjectConfirm" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.showForkProjectDialog = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="forkProjectConfirm()"
            @keyup.enter="forkProjectConfirm()"
            :loading="forkProjectForm.loading"
          >
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="data.showUploadDialog" title="Upload a project file" @keyup.enter="uploadConfirm">
      <el-form :model="uploadForm" label-width="200">
        <el-form-item label="Enter a Project Name">
          <el-input v-model="uploadForm.project_name" @keyup.enter="uploadConfirm" />
        </el-form-item>
        <el-form-item label="Select a project file(.JSON)">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :action="data.uploadUrl"
            :auto-upload="false"
            name="content"
            :data="uploadForm"
            :on-success="uploadSuccess"
          >
            <template #trigger>
              <el-button type="primary">Select File</el-button>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.showUploadDialog = false">Cancel</el-button>
          <el-button type="primary" @click="uploadConfirm()" @keyup.enter="uploadConfirm()"> Upload </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { useRouter } from 'vue-router'
import { watch, ref, reactive, computed, onMounted } from 'vue'
import {
  getGroupList,
  deleteGroup,
  createProject,
  publishProject,
  deleteProject,
  getProjectList,
  shareProject,
  forkProject,
  renameGroup,
  renameProject,
  createMetaData,
} from '../../api/api'
import { basic } from '../../config'

const data = reactive({
  groupList: [],
  currentList: [],
  showCreateProjectDialog: false,
  showShareProjectDialog: false,
  showForkProjectDialog: false,
  showRenameGroupDialog: false,
  showRenameProjectDialog: false,
  showUploadDialog: false,
  groupListOptions: [],
  uploadUrl: '',
  // uploadUrl: `${basic.apiUrl}projects/${group_name}?action=import_json`,
  page: {
    total: 0,
    size: 10,
    currentPage: 0,
  },
})

const shareProjectForm = reactive({
  group_name: '',
  project_name: '',
  mudid: '',
  type: 'mudid',
  msg: '',
})

const goProject = (group, project, status) => {
  // ["EMPTY","MODEL_RUNNING","MODEL_OUTPUT","SIMULATION","SIMULATION_RUNNING"]
  let name = ''
  if (status === 'EMPTY' || status === 'MODEL_RUNNING') {
    name = 'analysis'
  }
  if (status === 'MODEL_OUTPUT') {
    name = 'output'
  }
  if (
    status === 'SIMULATION_RUNNING' ||
    status === 'SIMULATION' ||
    status === 'SIMULATION_FAILED'
  ) {
    name = 'simulator'
  }
  router.push({
    name: name,
    params: { group: group, project: project },
  })
}

const handlePublish = (group_name, project_name, is_publish) => {
  console.log('is_publish', is_publish)
  ElMessageBox.confirm(
    `Are you sure you want to ${is_publish === false ? 'publish' : 'cancel publish'} ${group_name} / ${project_name}? You can also undo this action by ${is_publish === true ? 'checking' : 'unchecking'} the box.`,
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      publishProjectFn(group_name, project_name, is_publish)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Publish canceled',
      })
    })
}

const sliceData = () => {
  let currentList = data.groupList.slice(
    data.page.currentPage * data.page.size,
    data.page.currentPage * data.page.size + data.page.size,
  )
  return currentList
}

const getList = async () => {
  let res = await getGroupList()
  if (res && res.group_list) {
    data.groupList = res.group_list
  }
}

const changePage = (value) => {
  data.page.currentPage = value - 1
  data.currentList = sliceData()
}

const router = useRouter()
const enter = (groupName, projectName, page) => {
  router.push({
    name: 'project',
    query: {
      groupName: groupName,
      projectName: projectName,
      page: page,
    },
  })
}

const getProjectListByGroup = async (groupName, projectName) => {
  let param = {
    group_name: groupName,
  }
  let res = await getProjectList(param)
  if (res) {
    if (res.status === 1) {
      ElMessage()
    }
    // let index = res.project_list.findIndex(item => {
    //   return item
    // })
    // let current = res.projects_list.filter((item) => {
    //   return item.project_name === projectName
    // })[0]
    // setState(groupName, projectName, current.project_status)
  }
}

const deleteProjectConfirm = (group_name, project_name) => {
  ElMessageBox.confirm('Platform will permanently delete the project. Continue?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      deleteProjectFn(group_name, project_name)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

const deleteProjectFn = async (group_name, project_name) => {
  let res = await deleteProject({ group_name, project_name })
  if (res && res.status === 1) {
    ElMessage({
      message: 'delete success',
      type: 'success',
    })
    // 请求
    getList()
  } else {
    ElMessage({
      message: res && res.message ? res.message : 'delete error',
      type: 'error',
    })
  }
}

const deleteGroupConfirm = (group_name) => {
  ElMessageBox.confirm('Platform will permanently delete the group. Continue?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      deleteGroupFn(group_name)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
const deleteGroupFn = async (group_name) => {
  let res = await deleteGroup({ group_name })
  if (res && res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Delete completed',
    })
    getList()
  } else {
    ElMessage({
      message: res && res.message ? res.message : 'delete error',
      type: 'error',
    })
  }
}

const renameGroupForm = reactive({
  group_name: '',
  group_name_new: '',
})
const confirmRenameGroup = () => {
  if (!renameGroupForm.group_name_new) {
    ElMessage({
      message: 'Please input new group name',
      type: 'error',
    })
  } else {
    renameGroupConfirm()
  }
}

const renameGroupFn = (group_name) => {
  renameGroupForm.group_name = group_name
  data.showRenameGroupDialog = true
}
const renameGroupConfirm = async () => {
  let res = await renameGroup(renameGroupForm)
  if (res && res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Rename completed',
    })
    data.showRenameGroupDialog = false
    getList()
  }
}

const renameProjectForm = reactive({
  group_name: '',
  project_name: '',
  project_name_new: '',
})

const openRenameProjectDialog = (group_name, project_name) => {
  ;(renameProjectForm.group_name = group_name), (renameProjectForm.project_name = project_name)
  data.showRenameProjectDialog = true
}

const confirmRenameProject = () => {
  if (!renameProjectForm.project_name_new) {
    ElMessage({
      message: 'Please input new analysis name',
      type: 'error',
    })
  } else {
    renameProjectFn()
  }
}

const renameProjectFn = async () => {
  let res = await renameProject(renameProjectForm)
  if (res && res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Rename completed',
    })
    data.showRenameProjectDialog = false
    getList()
  }
}

const createProjectForm = reactive({
  group_name: '',
  project_name: '',
  brand_name: '',
  data_version_id: '',
  date_range: [],
  loading: false,
})
const createOptions = reactive({
  brand_name_list: [],
  data_version_id_list: [],
})

// 表单验证规则
const createProjectRules = reactive({
  project_name: [{ required: true, message: 'Please input project name', trigger: 'blur' }],
  brand_name: [{ required: true, message: 'Please select brand', trigger: 'change' }],
  data_version_id: [{ required: true, message: 'Please select data version', trigger: 'change' }],
  date_range: [{ required: true, message: 'Please select date range', trigger: 'change' }],
})

// 表单引用
const createProjectFormRef = ref(null)

// 元数据缓存
const metaDataCache = ref({})

// 日期选择器禁用日期判断函数
const disabledDate = (time) => {
  // 如果未选择数据版本，禁用所有日期
  if (!createProjectForm.brand_name || !createProjectForm.data_version_id) {
    return true
  }
  
  // 获取当前选择的品牌和数据版本对应的可用日期
  const availableMonths = getAvailableMonths()
  console.log('Available months:', availableMonths) // 调试信息
  
  if (!availableMonths.length) {
    return true
  }
  
  // 格式化日期为 YYYYMM 格式
  const year = time.getFullYear()
  const month = String(time.getMonth() + 1).padStart(2, '0')
  const dateStr = `${year}${month}`
  
  // 检查日期是否在可用列表中
  const isDisabled = !availableMonths.includes(dateStr)
  console.log(`Date ${dateStr} is ${isDisabled ? 'disabled' : 'enabled'}`) // 调试信息
  
  return isDisabled
}

// 获取可用的月份列表
const getAvailableMonths = () => {
  if (!createProjectForm.brand_name || !createProjectForm.data_version_id) {
    return []
  }
  const brandData = metaDataCache.value[createProjectForm.brand_name]
  if (!brandData || !brandData.data_version_id) {
    return []
  }
  const versionData = brandData.data_version_id[createProjectForm.data_version_id]
  if (!versionData || !versionData.yyyymm) {
    return []
  }
  return Object.keys(versionData.yyyymm)
}

// 数据版本选择变化处理
const handleDataVersionChange = (value) => {
  createProjectForm.date_range = []
}

// 表单是否有效
const isFormValid = computed(() => {
  return createProjectForm.project_name && 
         createProjectForm.brand_name && 
         createProjectForm.data_version_id && 
         createProjectForm.date_range && 
         createProjectForm.date_range.length === 2 && 
         checkDateRangeValidity()
})

// 检查日期范围有效性（跨度≥24个月）
const checkDateRangeValidity = () => {
  if (!createProjectForm.date_range || createProjectForm.date_range.length !== 2) {
    return false
  }
  const [start, end] = createProjectForm.date_range
  const startDate = dayjs(start, 'YYYYMM')
  const endDate = dayjs(end, 'YYYYMM')
  const monthsDiff = endDate.diff(startDate, 'month')
  return monthsDiff >= 23 // 24个月跨度
}

// 品牌选择变化处理
const handleBrandChange = (value) => {
  createProjectForm.data_version_id = ''
  createProjectForm.date_range = []
  if (value && metaDataCache.value[value]) {
    createOptions.data_version_id_list = Object.keys(metaDataCache.value[value].data_version_id)
  } else {
    createOptions.data_version_id_list = []
  }
}

// 日期范围变化处理
const handleDateRangeChange = (value) => {
  if (value && value.length === 2) {
    if (!checkDateRangeValidity()) {
      ElMessage({
        message: 'Time span must be at least 24 months',
        type: 'error',
      })
    }
  }
}

const createProjectFn = async (group_name) => {
  createProjectForm.group_name = group_name
  createProjectForm.brand_name = ''
  createProjectForm.data_version_id = ''
  createProjectForm.date_range = []
  data.showCreateProjectDialog = true
  let res = await createMetaData()
  if (res) {
    metaDataCache.value = res
    createOptions.brand_name_list = Object.keys(res)
    createOptions.data_version_id_list = []
  }
}
const confirmCreateProject = async () => {
  // 表单校验
  createProjectFormRef.value?.validate?.((valid) => {
    if (valid) {
      // 检查日期范围有效性
      if (!checkDateRangeValidity()) {
        ElMessage({
          message: 'Time span must be at least 24 months',
          type: 'error',
        })
        return
      }
      // 提交表单
      submitCreateProject()
    } else {
      return false
    }
  })
}

const submitCreateProject = async () => {
  const [yyyymm_start, yyyymm_end] = createProjectForm.date_range
  let param = {
    project_name: createProjectForm.project_name,
    brand_name: createProjectForm.brand_name,
    yyyymm_start: yyyymm_start,
    yyyymm_end: yyyymm_end,
    data_version_id: createProjectForm.data_version_id,
  }
  createProjectForm.loading = true
  let res = await createProject(param, createProjectForm.group_name)
  createProjectForm.loading = false
  if (res && res.status === 1) {
    ElMessage({
      message: 'create success',
      type: 'success',
    })
    data.showCreateProjectDialog = false
    getList()
  }
}

const formatDate = computed(() => {
  return (value) => {
    return dayjs(value).format(' YYYY-MM-DD HH:mm:ss')
  }
})

const createAndUploadAnalysisFn = (groupName, operation) => {
  if (operation === 'Create New Analysis') {
    createProjectFn(groupName)
  }
  if (operation === 'Upload') {
    uploadFn(groupName)
  }
  if (operation === 'Rename') {
    renameGroupFn(groupName)
  }
  if (operation === 'Delete') {
    deleteGroupConfirm(groupName)
  }
}
const uploadForm = reactive({
  project_name: '',
})

const uploadFn = (groupName) => {
  data.uploadUrl = `${basic.apiUrl}projects/${groupName}/project/upload?action=import_json`
  data.showUploadDialog = true
}
const uploadRef = ref(null)
const uploadConfirm = () => {
  if (uploadForm.project_name === '') {
    ElMessage({
      type: 'error',
      message: 'Input Project Name',
    })
    return
  }
  uploadRef.value.submit()
}

const uploadSuccess = (res) => {
  if (res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Upload success',
    })
    data.showUploadDialog = false
  } else {
    ElMessage({
      type: 'error',
      message: res.msg,
    })
  }
}

const shareProjectRuleFormRef = ref(null)

const shareProjectRuleFormRefRules = reactive({
  mudid: [{ required: true, message: 'Please input', trigger: 'blur' }],
})

const shareProjectFn = async () => {
  let res = await shareProject(shareProjectForm)
  if (res && res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Share Success',
    })
    data.showShareProjectDialog = false
  } else {
    ElMessage({
      type: 'error',
      message: res.message ? res.message : 'Error',
    })
  }
}

const shareProjectConfirm = () => {
  shareProjectRuleFormRef.value?.validate?.((valid) => {
    if (valid) {
      // 提交表单逻辑
      shareProjectFn()
    } else {
      return false
    }
  })
}
const openShareProjectDialog = (group_name, project_name) => {
  shareProjectForm.group_name = group_name
  shareProjectForm.project_name = project_name
  data.showShareProjectDialog = true
}

const forkProjectForm = reactive({
  group_name_fork: '',
  project_name_fork: '',
  group_name_new: '',
  project_name_new: '',
  loading: false,
})

const forkProjectRuleFormRef = ref(null)

const forkProjectRuleFormRefRules = reactive({
  project_name_new: [{ required: true, message: 'Please input new project name', trigger: 'blur' }],
})

const openForkProjectDialog = (group_name, project_name) => {
  forkProjectForm.group_name_fork = group_name
  forkProjectForm.project_name_fork = project_name
  data.groupListOptions = data.groupList.map((item) => item.group_name)
  data.showForkProjectDialog = true
}

const forkProjectConfirm = () => {
  forkProjectRuleFormRef.value?.validate?.((valid) => {
    if (valid) {
      // 提交表单逻辑
      forkProjectFn()
    } else {
      return false
    }
  })
}

const forkProjectFn = async () => {
  forkProjectForm.loading = true
  let res = await forkProject(forkProjectForm)
  forkProjectForm.loading = false
  if (res && res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Copy Success',
    })
    data.showForkProjectDialog = false
    getList()
  } else {
    ElMessage({
      type: 'error',
      message: res.message ? res.message : 'Error',
    })
  }
}

const publishProjectFn = async (group_name, project_name, is_publish) => {
  let param = {
    group_name: group_name,
    project_name: project_name,
    status: is_publish === true ? 0 : 1,
  }
  let res = await publishProject(param)
  if (res.status === 1) {
    ElMessage({
      message: is_publish === true ? 'Cancel publish success' : 'Publish success',
      type: 'success',
    })
    getList()
  }
}

defineExpose({
  getList,
})

onMounted(() => {
  getList()
})
</script>

<style lang="less">
.list-page {
  overflow: hidden;
  .el-collapse-item__header {
    font-size: 18px;
    padding: 10px 0;
    .info {
      padding: 0 20px;
      position: relative;
      width: 100%;
      //   width: 90%;
      display: flex;
      //   justify-content: space-between;
      .group-name {
        display: inline-block;
        p {
          line-height: 24px;
          text-align: left;
          font-size: 12px;
          &.name {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }

      .delete-wrap {
        margin: 0 140px;
      }
      .number {
        display: inline-block;
        position: absolute;
        right: 20px;
        & > span {
          margin: 0 15px;
          font-size: 14px;
        }
        & > .span-100 {
          display: inline-block;
          width: 100px;
        }
        i {
          vertical-align: text-top;
          margin: 0 10px;
        }
      }
    }
    .i-group {
      display: inline-block;
      width: 45px;
      height: 40px;
      background-color: #e99d42;
      color: #fff;
      line-height: 40px;
      border-radius: 10px;
      text-align: center;
      margin-left: 10px;
    }
  }
  .el-collapse-item__content {
    padding-bottom: 0;
    max-height: 50vh;
    overflow-y: auto;
  }
  .list {
    & > li {
      padding: 10px 0;
      margin-left: 80px;
      border-top: 1px solid #ebeef5;
      & > i {
        display: inline-block;
        width: 40px;
        height: 40px;
        background-color: #f9d5aa;
        color: #fff;
        line-height: 40px;
        border-radius: 10px;
        float: left;
        text-align: center;
      }
      .info {
        display: flex;
        justify-content: space-between;
        padding: 0 30px 0 20px;
        .group-name {
          text-align: left;
        }
        .publish {
          padding-top: 15px;
        }
        .btn-wrap {
          line-height: 45px;
          width: 35%;
          text-align: right;
          .analysis-btn > a {
            margin-right: 15px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .bottom {
    .el-pagination {
      justify-content: center;
      padding: 15px 0;
    }
  }
}
</style>
