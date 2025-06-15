<template>
  <div class="group-list-page">
    <div class="top-welcome">
      <div class="welcome">Welcome!</div>
      <div class="btn-wrap">
        <el-button
          type="primary"
          color="#e99d42"
          @click="showDialog = true"
          style="color: #fff; margin-right: 10px"
          v-if="
            groupIndex.group_meta.group_privileges.length > 0 &&
            groupIndex.group_meta.group_privileges[0] === 'Create New Group'
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
        <i>{{ groupIndex.group_list.length }}</i>
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
    <group-list :groupList="groupIndex.group_list"></group-list>
    <el-dialog v-model="showDialog" title="Create a New Group">
      <el-form :model="form" label-position="top">
        <el-form-item label="Enter Group Name" :label-width="200">
          <el-input v-model="form.group_name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">Cancel</el-button>
          <el-button type="primary" @click="createConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getGroupList, createGroup } from '../../api/api'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import GroupList from './list.vue'
const showDialog = ref(false)
const form = reactive({
  group_name: '',
})
const data = reactive({
  searchKey: '',
})

const groupIndex = reactive({
  group_meta: {
    group_privileges: [],
  },
  group_list: [],
})
const ComponentGroupList = ref(null)
const createConfirm = () => {
  if (!form.group_name) {
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
  let res = await createGroup(param.group_name)
  if (res && res.status === 1) {
    ElMessage({
      message: 'create success',
      type: 'success',
    })
    showDialog.value = false
    form.group_name = ''
    getGroupFn()
  }
}

const getGroupFn = async () => {
  let res = await getGroupList()
  if(res && res.group_meta) {
    groupIndex.group_meta.group_privileges = res.group_meta.group_privileges
    groupIndex.group_list = res.group_list
  }
}

onMounted(() => {
  getGroupFn()
})
</script>

<style lang="less" scoped>
.group-list-page {
  padding: 0 30px;
  min-height: 80vh;
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
