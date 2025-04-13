<template>
  <div class="group-list-page">
    <div class="top-welcome">
      <div class="welcome">Welcome!</div>
      <div class="btn-wrap">
        <el-button
          type="primary"
          color="#e99d42"
          @click="showDialog = true"
          style="color: #fff"
          v-if="data.groupPrivilege.length > 0 && data.groupPrivilege[0] === 'create'"
        >
          New Group
        </el-button>
      </div>
    </div>
    <group-list :groupList="data.groupList"></group-list>
    <el-dialog v-model="showDialog" title="Create a New Group">
      <el-form :model="form" label-position="top">
        <el-form-item label="Enter Group Name" :label-width="200">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">Cancel</el-button>
          <el-button type="primary" @click="confirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
// import { createGroup } from '../../api/api'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import GroupList from './list.vue'
const showDialog = ref(false)
const form = reactive({
  name: '',
})
const data = reactive({
  groupList: [
    {
      group_name: 'Sulperazon',
      created_datetime: '2023-02-07T06:58:04.450Z',
      project_count: 0,
      privileges: ['create', 'upload'],
      projects_list: [],
    },
    {
      group_name: 'aaa',
      created_datetime: '2023-02-07T09:23:00.338Z',
      project_count: 1,
      projects_list: [
        {
          project_name: 'aaa_1',
          project_status: 'MODELING',
          updated_datetime: '2023-02-07T09:23:00.386Z',
          privileges: ['Enter', 'Copy', 'Share', 'Delete'],
        },
      ],
    },
  ],
  groupPrivilege: ['create'],
})
const ComponentGroupList = ref(null)
const confirm = () => {
  if (!form.name) {
    ElMessage({
      message: 'Please input group name',
      type: 'error',
    })
  } else {
    create()
  }
}
const create = async () => {
  let param = form
  //   let res = await createGroup(param)
  //   if (res && res.status === 1) {
  //     ElMessage({
  //       message: 'create success',
  //       type: 'success',
  //     })
  //     ComponentGroupList.value.getList()
  //     showDialog.value = false
  //   } else {
  //     ElMessage({
  //       message: res && res.message ? res.message : 'create error',
  //       type: 'error',
  //     })
  //   }
}

const getGroupList = async () => {}
</script>

<style lang="less" scoped>
.group-list-page {
  padding: 0 30px;
  .top-welcome {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    .welcome {
      font-size: 32px;
      color: #e99d42;
      font-weight: bold;
    }
  }
}
</style>
