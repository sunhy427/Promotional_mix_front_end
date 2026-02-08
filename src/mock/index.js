// src/mock/index.js
import Mock from 'mockjs'

// 模拟获取用户列表接口
Mock.mock('/api/users', 'get', {
  code: 200,
  message: 'success',
  'data|10-20': [
    {
      'id|+1': 1,
      name: '@cname',
      'age|18-60': 1,
      email: '@email',
    },
  ],
})

// 模拟登录接口
Mock.mock('/api/user_profile', 'get', (options) => {
  return {
    User_id: '12345',
  }
})

Mock.mock('/api/groups', 'get', (options) => {
  return {
    group_meta: {
      group_privileges: ['Create New Group'],
    },
    group_list: [
      {
        group_name: 'Benlysta',
        created_datetime: '2023-02-07T06:58:04.450Z',
        project_count: 0,
        group_internal_privileges: ['Create New Analysis', 'Upload', 'Rename'],
        projects_list: [],
      },
      {
        group_name: 'aaa',
        created_datetime: '2023-02-07T09:23:00.338Z',
        project_count: 1,
        group_internal_privileges: ['Create New Analysis', 'Upload', 'Rename'],
        projects_list: [
          {
            project_name: 'aaa_1',
            project_status: 'MODELING',
            updated_datetime: '2023-02-07T09:23:00.386Z',
            project_privileges: ['Publish', 'Enter', 'Copy', 'Share', 'Rename', 'Delete'],
          },
        ],
      },
    ],
  }
})

Mock.mock('/api/groups/name', 'put', (options) => {
  return {
    status: 1
  }
})

Mock.mock('/api/groups/aaa', 'delete', (options) => {
  return {
    status: 1
  }
})

// 模拟创建项目meta数据接口
Mock.mock('/api/projects/empty/create/metadata', 'get', (options) => {
  return {
    "belynsta": {
      "name": "belynsta",
      "data_version_id": {
        "202601": {
          "name": 202601,
          "yyyymm": {
            "202601": {
              "name": 202601
            },
            "202602": {
              "name": 202602
            }
          }
        },
        "202602": {
          "name": 202602,
          "yyyymm": {
            "202605": {
              "name": 202605
            },
            "202606": {
              "name": 202606
            }
          }
        }
      }
    }
  }
})