<template>
  <div class="group-list-page">
    <div class="top-welcome">
      <div class="welcome">Welcome!</div>
      <div class="btn-wrap">
        <el-button
          type="primary"
          color="#e99d42"
          @click="showDialog = true"
          style="color: #fff;margin-right: 10px;"
          v-if="
            groupItemList.group_meta.privileges.length > 0 &&
            groupItemList.group_meta.privileges[0] === 'create'
          "
        >
          New Group
        </el-button>
        <router-link to="/setting"
          ><el-button type="primary" class="setting-btn">
            <el-icon><Setting /></el-icon>
            Setting
          </el-button></router-link
        >
      </div>
    </div>
    <div class="search-wrap">
      <div class="group-numer">
        <span>Your Groups</span>
        <i>{{ groupItemList.group_list.length }}</i>
      </div>
      <div class="search">
        <!-- <el-autocomplete
          v-model="data.searchKey"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          placeholder="Please Input"
          @select="handleSelect"
        /> -->
      </div>
    </div>
    <group-list :groupList="groupItemList.group_list"></group-list>
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
import { getGroupList } from '../../api/api'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import GroupList from './list.vue'
const showDialog = ref(false)
const form = reactive({
  name: '',
})
const data = reactive({
  searchKey: '',
})

const groupItemList = reactive({
  group_meta: {
    privileges: [],
  },
  group_list: [],
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
  groupItemList.group_list.push({
    group_name: form.name,
    created_datetime: '2023-02-07T06:58:04.450Z',
    project_count: 0,
    privileges: ['create', 'upload'],
    projects_list: [],
    publish: false,
  })
  ElMessage({
    message: 'create group success',
    type: 'success',
  })
  showDialog.value = false

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

const getGroupFn = async () => {
  //let res = await getGroupList()
  groupItemList.group_meta.privileges = ['create']
  groupItemList.group_list = [
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
          project_status: 'EMPTY',
          updated_datetime: '2023-02-07T09:23:00.386Z',
          privileges: ['Enter', 'Copy', 'Share', 'Delete'],
        },
        {
          project_name: 'aaa_2',
          project_status: 'MODELING',
          updated_datetime: '2023-02-07T09:23:00.386Z',
          privileges: ['Enter', 'Copy', 'Share', 'Delete'],
        },
      ],
    },
  ]
}

onMounted(() => {
  getGroupFn()
})
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
    .btn-wrap {
      .setting-btn {
        i {
          margin-right: 5px;
        }
      }
    }
  }
  .search-wrap {
    padding: 5px 0;
    font-size: 14px;
    font-weight: bold;
    border-top: 1px solid #e99d42;
    color: #e99d42;
    i {
      color: #fff;
      background-color: #c9c8c8;
      display: inline-block;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 24px;
      margin: 10px;
    }
  }
}
</style>
