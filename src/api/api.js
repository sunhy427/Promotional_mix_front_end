import request from './config'
import { basic } from '../config/index.js'

// /as/ack SAML
export function getSAML() {
  return request.get('/as/ack')
}

// /api/user_profile
export function getUserProfile() {
  return request.get(basic.apiUrl + 'user_profile')
}

///api/projects/share_popup
export function getPopup() {
  return request.get(basic.apiUrl + 'projects/share_popup')
}

// Get group list
export function getGroupList() {
  return request.get(basic.apiUrl + 'groups')
}

// create group
export function createGroup(params) {
  return request.put(`${basic.apiUrl}groups/${params}`, params)
}

//delete group
export function deleteGroup(params) {
  return request.delete(`${basic.apiUrl}groups/${params.group_name}`)
}

//Rename exsting group  POST /api/groups/${group_name}/rename
export function renameGroup(params) {
  return request.post(`${basic.apiUrl}groups/${params.group_name}/rename`, params)
}

//create new project
export function createProject(params, group_name) {
  return request.put(`${basic.apiUrl}projects/${group_name}/${params.project_name}`, params)
}

//meta_data
export function createMetaData() {
  return request.get(`${basic.apiUrl}projects/empty/metadata`)
}

//get project list
export function getProjectList(params) {
  return request.get(`${basic.apiUrl}${params.group_name}/projects`)
}

//Publish project
export function publishProject(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/publish`,
    params,
  )
}

//cancel Publish project  api缺少publish字段，待沟通
export function cancelPublishProject(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/cancel_publish`,
  )
}

//Delete exsting project
export function deleteProject(params) {
  return request.delete(`${basic.apiUrl}projects/${params.group_name}/${params.project_name}`)
}

//Share project
export function shareProject(params) {
  return request.post(
    `${basic.apiUrl}projects/${params.group_name}/${params.project_name}/share`,
    params,
  )
}

//Fork project
export function forkProject(params) {
  return request.post(
    `${basic.apiUrl}projects/${params.group_name_fork}/${params.project_name_fork}/copy`,
    params,
  )
}

//Rename exsting project  POST /api/groups/${group_name}/rename
export function renameProject(params) {
  return request.post(
    `${basic.apiUrl}projects/${params.group_name}/${params.project_name}/rename`,
    params,
  )
}

//Export excel project（download data）
export function exportExportProject(params) {
  return request.get(`${basic.apiUrl}${params.group_name}/${params.project_name}`, { params })
}

// Permission
export function getPermissions() {
  return request.get(`${basic.apiUrl}permissions`)
}

export function addPermission(params) {
  return request.post(
    `${basic.apiUrl}permission/add`,
    params,
  )
}
//Remove permission user
export function removePermission(id) {
  return request.delete(`${basic.apiUrl}permission/${id}/remove`)
}

// Update permission user /api/permission/${id}/update
export function updatePermission(params) {
  return request.post(
    `${basic.apiUrl}permission/${params.id}/update`,
    params,
  )
}



// Add simulation
export function addSimulation(params) {
  return request.put(
    `${basic.apiUrl}${params.group_name}/${params.project_name}/simulation/add`,
    params,
  )
}

// Preview Simulation metadata
export function previewSimulationMetadata(params) {
  return request.get(
    `${basic.apiUrl}${params.group_name}/${params.project_name}/simulation/meta_data`,
    { params },
  )
}

// Contents API
// Preview meta data for empty project
export function previewRawData(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/metadata`,
  )
}

// ## Run modeling 
// * POST ``/api/contents/${group_name}/${project_name}/modeling/run``
export function runModeling(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/run`,
    params,
  )
}

//## Revoke current model asnyc task
//* DELETE ``/api/contents/${group_name}/${project_name}/modeling/current_task``
export function revokeTask(params) {
  return request.delete(`${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/current_task`)
}

//## Get current model asnyc task
//* GET ``/api/contents/${group_name}/${project_name}/modeling/current_task``
export function getCurrentModelTask(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/current_task`,
  )
}

//## Preview modeling output
//* GET ``/api/contents/${group_name}/${project_name}/modeling/output/metadata|parameters|result?segmentation_type=Total Market``
export function previewModelOutputMetadata(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/output/metadata`,
  )
}

//## Preview modeling output
//* GET ``/api/contents/${group_name}/${project_name}/modeling/output/metadata|parameters|result?segmentation_type=Total Market``
export function previewModelOutputParameters(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/output/parameters`,
  )
}


// // 流程 upload - Preview raw data
// export function previewRawData(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/rawdata/df_rawdata`,
//   )
// }

// // upload -data selection options
// export function selectionOptions(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/rawdata/df_rawdata/${params.type}`,
//   )
// }

// // upload data selection commit
// export function dataSelectionCommit(params) {
//   return request.post(`${basic}contents/${params.group_name}/${params.project_name}/handle`, params)
// }

// // upload preview handle data
// export function previewHandleData(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/handle/parameters`,
//   )
// }

// // upload channel options
// export function channelOptions(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/handle/df_handle/promo_channels`,
//   )
// }

// // upload channel preprocess
// export function preprocessed(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/preprocessed`,
//     params,
//   )
// }

// // upload baseline output
// export function baselineOutput(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/preprocessed/df_chnl`,
//   )
// }

// export function getitem(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/preprocessed/df_chnl/getitem`,
//     { params },
//   )
// }

// export function preprocessedChannels(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/preprocessed/df_chnl/promo_channels`,
//   )
// }

// export function preprocessedParameters(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/preprocessed/parameters`,
//   )
// }

// export function preprocessed_type(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/preprocessed/${params.type}`,
//   )
// }

// export function baseline(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/baseline`,
//     params,
//   )
// }

// export function baselineOutputPreview(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/baseline/${params.type}`,
//   )
// }

// export function prior_mcmc(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/prior_mcmc`,
//     params,
//   )
// }

// export function previewPriorOutput(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/prior_mcmc/${params.type}`,
//   )
// }

// export function bayes_mcmc(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/bayes_mcmc`,
//     params,
//   )
// }

// export function current_task(params) {
//   return request.get(
//     `${basic}contents/${params.group_name}/${params.project_name}/bayes_mcmc/current_task`,
//   )
// }

// export function bayes_mcmc_output(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/bayes_mcmc/${params.type}`,
//   )
// }

// export function postprocess(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/postprocess`,
//     params,
//   )
// }

// export function post_process_output(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/parameters`,
//   )
// }

// export function post_process_output_type(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/${params.type}`,
//   )
// }

// export function export_project(params) {
//   return request.get(
//     `${basic}projects/${params.group_name}/${params.project_name}`,
//     { params },
//     { responseType: 'stream' },
//   )
// }

// export function import_project(params) {
//   return request.post(`${basic}projects/${params.group_name}/${params.project_name}`, params)
// }

// export function aggregation(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/aggregation`,
//     params,
//   )
// }

// export function preview_aggregation(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/${params.type}`,
//   )
// }

// export function simulation(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/simulation`,
//     params,
//   )
// }

// export function preview_simulation(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/simulation/optimization_output`,
//   )
// }

// export function simulation_parameters(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/simulation/parameters`,
//   )
// }

// export function cost_adjusted_flag(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/preprocessed/cost_adjusted_flag`,
//   )
// }

// export function cost_adjusted(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/adjust_cost`,
//     params,
//   )
// }

// export function cost_adjusted_parameters(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/preprocessed/cost_adjusted_parameters`,
//   )
// }

// export function aggregation_flag(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/aggregation_flag`,
//   )
// }

// export function cst_window_flag(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/cst_window_flag`,
//   )
// }

// export function cst_window(params) {
//   return request.post(
//     `${basic}contents/${params.group_name}/${params.project_name}/cst_window`,
//     params,
//   )
// }

// export function cst_parameters(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/cst_parameters`,
//   )
// }

// export function cst_reference(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/cst_reference`,
//   )
// }

// export function cst_channel_spending(params) {
//   return request.get(
//     `${basic}contents/get/${params.group_name}/${params.project_name}/postprocess/cst_chnl_spending`,
//   )
// }
