import request from '@/utils/request'
export function delTrain(params) { // 培训班删除
  return request({
    url: 'train/delete',
    method: 'post',
    data: params
  })
}
export function listTrain(params) { // 培训班查询
  return request({
    url: 'train/list',
    method: 'post',
    data: params
  })
}
export function addTrain(params) { // 培训班基本信息新增
  return request({
    url: 'train/addTrain',
    method: 'post',
    data: params
  })
}
export function editTrain(params) { // 培训班基本信息编辑
  return request({
    url: 'train/edit',
    method: 'post',
    data: params
  })
}
export function getMatter(params) { // 培训班事项获取
  return request({
    url: 'train/getMatter',
    method: 'post',
    data: params
  })
}
export function getTrain(params) { // 培训班基本信息查询
  return request({
    url: 'train/getTrain',
    method: 'post',
    data: params
  })
}
export function surveyAdd(params) { // 培训班需求调研信息查询
  return request({
    url: 'survey/addSurvey',
    method: 'post',
    data: params
  })
}
export function surveyList(params) { // 培训班需求调研信息查询
  return request({
    url: 'survey/list',
    method: 'post',
    data: params
  })
}
export function surveyDelete(params) { // 培训班需求调研信息查询
  return request({
    url: 'survey/delete',
    method: 'post',
    data: params
  })
}
export function addTrainCourse(params) { // 培训班课程表新增
  return request({
    url: 'trainCourse/addTrainCourse',
    method: 'post',
    data: params
  })
}
export function delTrainCourse(params) { // 培训班课程表删除
  return request({
    url: 'trainCourse/delete',
    method: 'post',
    data: params
  })
}
export function trainCourseList(params) { // 培训班课程表查询
  return request({
    url: 'trainCourse/list',
    method: 'post',
    data: params
  })
}
export function addPretrainCourse(params) { // 培训班训前学习课程新增
  return request({
    url: 'pretrainCourse/addPretrainCourse',
    method: 'post',
    data: params
  })
}
export function delPretrainCourse(params) { // 培训班训前学习课程删除
  return request({
    url: 'pretrainCourse/delete',
    method: 'post',
    data: params
  })
}
export function pretrainCourseList(params) { // 培训班训前学习课程查询
  return request({
    url: 'pretrainCourse/list',
    method: 'post',
    data: params
  })
}
export function addTask(params) { // 作业上传
  return request({
    url: 'task/addTask',
    method: 'post',
    data: params
  })
}
export function taskList(params) { // 作业查询
  return request({
    url: 'task/list',
    method: 'post',
    data: params
  })
}
export function addDiscussSet(params) { // 增加研讨
  return request({
    url: 'discussSet/addDiscussSet',
    method: 'post',
    data: params
  })
}
export function delDiscussSet(params) { // 增加研讨
  return request({
    url: 'discussSet/delete',
    method: 'post',
    data: params
  })
}
export function discussSetList(params) { // 查询研讨
  return request({
    url: 'discussSet/list',
    method: 'post',
    data: params
  })
}
