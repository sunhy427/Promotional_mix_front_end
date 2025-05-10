<template>
  <div class="setting-page">
    <div class="top-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/group' }">Homepage</el-breadcrumb-item>
        <el-breadcrumb-item> Setting </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-wrap">
      <div class="top-btn-wrap">
        <el-button type="primary" class="add-btn" @click="addPermissionFn"
          ><el-icon><CirclePlusFilled /></el-icon>Add Permission</el-button
        >
      </div>
      <el-table :data="data.settingList" style="width: 100%">
        <el-table-column prop="id" label="Id" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="role" label="Role" />
        <el-table-column label="Activity">
          <template #default="scope">
            <p class="activity" v-if="scope.row.activity.length > 0">
              <span class="edit" @click="openEditDrawer(scope.row)"
                ><el-icon><Edit /></el-icon
              ></span>
              <span @click="deleteConfirm"
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
          <p>id12344</p>
          <p>name1</p>
        </div>
        <p>Role</p>
        <el-select v-model="data.selectRoleValue" placeholder="Select">
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
          <el-button type="primary" @click="confirmDrawer">Update Role</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="data.showAddPermissionDialog" title="Add Permission" width="500">
      <el-form :model="data.addPermissionForm">
        <el-form-item label="User Name">
          <el-input v-model="data.addPermissionForm.name" />
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
          <el-button type="primary" @click="data.showAddPermissionDialog = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { drawerEmits, ElMessage, ElMessageBox } from 'element-plus'

const data = reactive({
  settingList: [
    {
      id: 12324022,
      name: 'name1',
      role: 'Maintainer',
      activity: ['change', 'remove'],
      roleOptions: ['Maintainer', 'Guest'] 
    },
    {
      id: 12324023,
      name: 'name2',
      role: 'Owner',
      activity: [],
      roleOptions:[]
    },
    {
      id: 12324024,
      name: 'name3',
      role: 'Guest',
      activity: ['change', 'remove'],
      roleOptions: ['Maintainer', 'Guest'],
    },
  ],
  showDrawer: false,
  drawerDetail: {
    id: null,
    name: '',
    role: '',
    activity: [],
    roleOptions: [],
  },
  selectRoleValue: '',
  showAddPermissionDialog: false,
  addPermissionForm: {
    name: '',
    permission: '',
  },
})

const deleteConfirm = () => {
  ElMessageBox.confirm(
    `This action will remove this user's access permission. Continue?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
}

const openEditDrawer = (row) => {
  data.drawerDetail = row
  data.selectRoleValue = data.drawerDetail.role
  data.showDrawer = true
}
const confirmDrawer = () => {
  data.showDrawer = false
  ElMessage({
    message: 'Congrats, Update role success .',
    type: 'success',
  })
}

const addPermissionFn = () => {
  data.showAddPermissionDialog = true
}
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
