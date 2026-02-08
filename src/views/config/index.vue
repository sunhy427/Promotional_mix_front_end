<template>
  <div class="setting-page">
    <div class="top-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/group' }">Homepage</el-breadcrumb-item>
        <el-breadcrumb-item> Setting </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-wrap">
      <div class="top-btn-wrap" v-show="data.canAdd">
        <el-button type="primary" class="add-btn" @click="data.showAddPermissionDialog = true">
          <el-icon><CirclePlusFilled /></el-icon>
          Add Permission
        </el-button>
      </div>
      <el-table :data="data.permissionsList">
        <el-table-column prop="mudid" label="mudid" />
        <el-table-column prop="role" label="Role" />
        <el-table-column label="Activity">
          <template #default="scope">
            <p class="activity" v-if="scope.row.activity.length > 0">
              <span class="edit" @click="openEditDrawer(scope.row)"
                ><el-icon><Edit /></el-icon
              ></span>
              <span @click="deleteConfirm(scope.row.mudid)"
                ><el-icon><Remove /></el-icon
              ></span>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      v-model="data.showDrawer"
      title="Role details"
      direction="rtl"
      size="50%"
      class="drawer-wrap"
      header-class="drawer-header"
    >
      <div class="detail">
        <p>Account</p>
        <div class="description">
          <p>{{ data.drawerDetail.id }}</p>
        </div>
        <p>Role</p>
        <el-select v-model="data.drawerDetail.role_new" placeholder="Select">
          <el-option
            v-for="item in data.drawerDetail.roleOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <template #footer>
        <div class="footer">
          <el-button @click="data.showDrawer = false">Cancel</el-button>
          <el-button type="primary" @click="confirmDrawer" @keyup.enter="confirmDrawer">Update Role</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="data.showAddPermissionDialog" title="Add Permission" width="500">
      <el-form :model="data.addPermissionForm" label-position="top">
        <el-form-item label="User Mudid">
          <el-input v-model="data.addPermissionForm.username" />
        </el-form-item>
        <el-form-item label="Role">
          <el-radio-group v-model="data.addPermissionForm.role">
            <el-radio value="Maintainer">Maintainer</el-radio>
            <el-radio value="Guest">Guest</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.showAddPermissionDialog = false">Cancel</el-button>
          <el-button type="primary" @click="confirmAddPermission" @keyup.enter="confirmAddPermission"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { drawerEmits, ElMessage, ElMessageBox } from 'element-plus'
import { getPermissions, addPermission, removePermission, updatePermission } from '../../api/api'
const data = reactive({
  permissionsList: [],
  canAdd: false,
  showDrawer: false,
  drawerDetail: {
    id: null,
    role_new: '',
    roleOptions: [],
  },
  selectRoleValue: '',
  showAddPermissionDialog: false,
  addPermissionForm: {
    username: '',
    role: '',
  },
})

const getPermissionList = async () => {
  let res = await getPermissions()
  if (res) {
    data.canAdd = res.Add
    data.permissionsList = res.permissions_list
  }
}

const deleteConfirm = (id) => {
  ElMessageBox.confirm(
    `This action will remove this user's access permission. Continue?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      deletePermissionFn(id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

const deletePermissionFn = async (id) => {
  let res = await removePermission(id)
  if (res) {
    ElMessage({
      type: 'success',
      message: 'Remove success',
    })
    getPermissionList()
  }
}

const openEditDrawer = (row) => {
  data.drawerDetail.id = row.mudid
  data.drawerDetail.roleOptions = row.roleOptions
  data.drawerDetail.role_new = row.role
  data.showDrawer = true
}
const confirmDrawer = async () => {
  let res = await updatePermission(data.drawerDetail)
  if (res) {
    data.showDrawer = false
    ElMessage({
      message: 'Update role success .',
      type: 'success',
    })
    getPermissionList()
  }
}

const confirmAddPermission = async () => {
  let res = await addPermission(data.addPermissionForm)
  if (res) {
    data.showAddPermissionDialog = false
    ElMessage({
      type: 'success',
      message: 'Add success',
    })
    getPermissionList()
  }
}
onMounted(() => {
  getPermissionList()
})
</script>

<style lang="less" scoped>
.setting-page {
  padding: 10px 15px;
  .table-wrap {
    padding: 15px;
    .add-btn {
      .el-icon {
        margin-right: 5px;
      }
    }
    .activity {
      span {
        margin-right: 10px;
        font-size: 18px;
      }
      .edit {
        color: #e99d42;
        font-weight: bold;
      }
    }
  }
  .drawer-wrap {
    .detail {
      & > p {
        font-weight: bold;
        color: #000;
        font-size: 14px;
        margin: 10px 0;
      }
      & > .description {
        margin: 0 10px;
        line-height: 25px;
      }
    }
  }
}
</style>
