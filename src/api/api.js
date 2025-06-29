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
  return request.get(`${basic.apiUrl}projects/empty/create/metadata`)
}

//get project list
export function getProjectList(params) {
  return request.get(`${basic.apiUrl}projects/${params.group_name}/contents/list`)
}

//Publish project
export function publishProject(params) {
  return request.post(
    `${basic.apiUrl}projects/${params.group_name}/${params.project_name}/publish`,
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
  return request.put(`${basic.apiUrl}permission/add`, params)
}
//Remove permission user
export function removePermission(id) {
  return request.delete(`${basic.apiUrl}permission/${id}/remove`)
}

// Update permission user /api/permission/${id}/update
export function updatePermission(params) {
  return request.post(`${basic.apiUrl}permission/${params.id}/update`, params)
}

// Add simulation
export function addSimulation(params) {
  return request.put(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}`,
    params,
  )
}
//## Preview Simulation metadata 6
//* GET ``/api/contents/${group_name}/${project_name}/${simulation_name}/simulating/simulating``
// Preview Simulation metadata
export function previewSimulationMetadata(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/simulating/simulating`,
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
  return request.delete(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/current_task`,
  )
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
//previewModelOutputResultFn
export function previewModelOutputResult(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/output/result`,
    { params },
  )
}

// ## Preview Simulation metadata 6
// * GET ``/api/contents/${group_name}/${project_name}/${simulation_name}/simulating/metadata``
export function previewModelSimulatingMetadata(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/simulating/metadata`,
    { params },
  )
}

//## simulation Rename
//* POST /api/groups/${group_name}/${project_name}/${simulation_name}/rename
export function simulationRename(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/rename`,
    params,
  )
}

//## Delete simulation
//* DELETE ``/api/contents/${group_name}/${project_name}/${simulation_name}``
export function deleteSimulation(params) {
  return request.delete(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}`,
  )
}

// ## Run simulation
// * POST ``/api/contents/${group_name}/${project_name}/${simulation_name}/simulating/run``
export function runSimulation(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/simulating/run`,
    params,
  )
}

//## Preview simulations
//* GET ``/api/contents/${group_name}/${project_name}/${simulation_name}/simulating/output``
export function previewSimulations(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/simulating/output/result`,
    { params },
  )
}

export function getSimulationsParam(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/simulating/output/parameters`,
    { params },
  )
}

//## Get current model asnyc task
//* GET ``/api/contents/${group_name}/${project_name}/${simulation_name}/simulating/current_task``
export function getCurrentSimulatingTask(params) {
  return request.get(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/simulating/current_task`,
    { params },
  )
}

//## simulation Visibility
//* POST ``/api/contents/${group_name}/${project_name}//${simulation_name}/visibility``
export function simulationVisibility(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/visibility`,
    params,
  )
}

//## Export excel project（download data :respectively corresponding to output part/simulation1/simulation2）
//* GET ``/api/projects/${group_name}/${project_name}?action=export_excel``

export function simulatingFailure(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/${params.simulation_name}/simulating/run/failure`,
    params,
  )
}

export function modelingFailure(params) {
  return request.post(
    `${basic.apiUrl}contents/${params.group_name}/${params.project_name}/modeling/run/failure`,
    params,
  )
}