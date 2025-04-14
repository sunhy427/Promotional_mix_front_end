<template>
  <div class="list-page">
    <el-empty description="description" v-if="data.groupList.length === 0" />
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
                  @click.stop="createProjectFn(item.group_name)"
                >
                  New Analysis
                </el-button>
                <el-button type="primary" color="#e99d42"> Upload </el-button>
                <span class="span-100">
                  <el-icon @click.stop="deleteGroupConfirm(item.group_name)"><Delete /></el-icon>
                  <el-icon><Document /></el-icon>
                  <span>{{ item.projects_list.length }}</span>
                </span>
              </div>
            </div>
          </template>
          <ul class="list">
            <li v-for="(itemProject, indexProject) in item.projects_list" :key="indexProject">
              <i>{{ itemProject.project_name.charAt(0) }}</i>
              <div class="info">
                <div class="group-name">
                  <p class="name">{{ itemProject.project_name }}</p>
                  <p>
                    Updated
                    {{ formatDate(itemProject.updated_datetime) }}
                  </p>
                </div>

                <div class="btn-wrap">
                  <a
                    v-for="(itemPrivileges, indexPrivileges) in itemProject.privileges"
                    :key="indexPrivileges"
                    @click="goProject(item.group_name, itemProject.project_name)"
                  >
                    <el-icon v-if="itemPrivileges === 'Enter'"><Promotion /></el-icon>
                    <el-icon v-if="itemPrivileges === 'Copy'"><CopyDocument /></el-icon>
                    <el-icon v-if="itemPrivileges === 'Share'"><Share /></el-icon>
                    <el-icon v-if="itemPrivileges === 'Delete'"><Delete /></el-icon>
                    {{ itemPrivileges }}
                  </a>
                </div>
              </div>
            </li>
          </ul>
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

    <el-dialog v-model="showRenameDialog" title="Rename Current Group">
      <el-form :model="form" label-position="top">
        <el-form-item label="Enter New Group Name" :label-width="200">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRenameDialog = false">Cancel</el-button>
          <el-button type="primary" @click="confirmRename"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="data.showCreateProjectDialog" title="Create New Analysis in Group">
      <el-form :model="form" label-position="top">
        <el-form-item label="Enter Analysis Name" :label-width="200">
          <el-input v-model="createProjectForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.showCreateProjectDialog = false">Cancel</el-button>
          <el-button type="primary" @click="confirmCreateProject"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { useRouter } from 'vue-router'

import { watch, ref, reactive, computed } from 'vue'

const props = defineProps({
  groupList: {
    type: Array,
    required: true,
  },
})

// onMounted(() => {
//   data.groupList = props.groupList
//   console.log('xxxx', data.groupList)
// })

const data = reactive({
  groupList: [],
  currentList: [],
  showCreateProjectDialog: false,
  page: {
    total: 0,
    size: 10,
    currentPage: 0,
  },
})

watch(
  () => props.groupList,
  (value) => {
    console.log('value', value)
    data.groupList = value
  },
  { deep: true, immediate: true },
)

const goProject = (group, project) => {
  router.push({ name: 'project', params: { group: group, project: project } })
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
    data.page.total = data.groupList.length
    data.page.currentPage = 0
    data.currentList = sliceData()
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

const getProjectStatus = async (groupName, projectName) => {
  let param = {
    group_name: groupName,
  }
  let res = await getProjectList(param)
  if (res) {
    let current = res.projects_list.filter((item) => {
      return item.project_name === projectName
    })[0]
    setState(groupName, projectName, current.project_status)
  }
}
const setState = (groupName, projectName, status) => {
  store.commit('changeProjectStatus', status)
  handleProjectStatus(groupName, projectName, store.state.index)
}
const handleProjectStatus = (groupName, projectName, index) => {
  if (index < 3) {
    enter(groupName, projectName, 'upload')
  }

  if (index === 3) {
    enter(groupName, projectName, 'baseline')
  }
  if (index > 3) {
    enter(groupName, projectName, 'MCMC')
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
  ElMessage({
    type: 'success',
    message: 'Delete completed',
  })
  // let res = await deleteGroup({ group_name })
  // if (res && res.status === 1) {
  //   ElMessage({
  //     type: 'success',
  //     message: 'Delete completed',
  //   })
  //   getList()
  // } else {
  //   ElMessage({
  //     message: res && res.message ? res.message : 'delete error',
  //     type: 'error',
  //   })
  // }
}

const form = reactive({
  name: '',
  currentGroupName: '',
})
const showRenameDialog = ref(false)
const confirmRename = () => {
  if (!form.name) {
    ElMessage({
      message: 'Please input new group name',
      type: 'error',
    })
  } else {
    renameGroupConfirm(form.name, form.currentGroupName)
  }
}

const renameGroupFn = (group_name) => {
  form.currentGroupName = group_name
  showRenameDialog.value = true
}
const renameGroupConfirm = async (new_name, group_name) => {
  let param = {
    group_name: group_name,
    group_name_new: new_name,
  }
  let res = await renameGroup(param)
  if (res && res.status === 1) {
    ElMessage({
      type: 'success',
      message: 'Rename completed',
    })
    getList()
    showRenameDialog.value = false
  } else {
    ElMessage({
      message: res && res.message ? res.message : 'rename error',
      type: 'error',
    })
  }
}

const createProjectForm = reactive({
  group_name: '',
  name: '',
})
const createProjectFn = (group_name) => {
  createProjectForm.group_name = group_name
  data.showCreateProjectDialog = true
  createProjectForm.name = ''
}
const confirmCreateProject = async () => {
  ElMessage({
    message: 'create analysis success',
    type: 'success',
  })
  data.showCreateProjectDialog = false
  // let param = {
  //   group_name: createProjectForm.group_name,
  //   project_name: createProjectForm.name,
  // }
  // let res = await createProject(param)
  // if (res && res.status === 1) {
  //   ElMessage({
  //     message: 'create success',
  //     type: 'success',
  //   })
  //   data.showCreateProjectDialog = false
  //   getList()
  // }
}

const formatDate = computed(() => {
  return (value) => {
    return dayjs(value).format(' YYYY-MM-DD HH:mm:ss')
  }
})
//   defineExpose({
//     getList,
//   });
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
        .btn-wrap {
          line-height: 45px;
          & > a {
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
