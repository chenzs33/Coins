import axios from "axios";
import qs from "qs";

// let base = '';

//<========后台管理系统登录注册部分========>s
export const login = (params) => {
  return axios.post(`/api/admin/login`, params).then((res) => res.data);
}; //登录

//<========管理员部分========>
export const getAdminByPage = (params) => {
  return axios.post(`/api/admin/getAdminByPage`, params);
}; //获取
export const addAdmin = (params) => {
  return axios.post(`/api/admin/addAdmin`, params);
}; //新建管理员
export const updateAdmin = (params) => {
  return axios.post(`/api/admin/updateAdmin`, params);
}; //修改管理员
export const deleteAdmin = (params) => {
  return axios.post(`/api/admin/deleteAdmin`, params);
}; //删除管理员
export const getAdminBykw = (params) => {
  return axios.post(`/api/admin/getAdminBykw`, params);
}; //查找

//<========金币商品兑换部分========>
export const getGoods = (params) => {
  return axios.post(`/api/commodity/getInfoByPage`, params);
}; //获取
export const addGoods = (params) => {
  return axios.post(`/api/commodity/add`, params);
}; //新增
export const editGoods = (params) => {
  return axios.post(`/api/commodity/update`, params);
}; //修改
export const deleteGoods = (params) => {
  return axios.post(`/api/commodity/del`, params);
}; //删除
export const getGoodBykw = (params) => {
  return axios.post(`/api/commodity/getGoodBykw`, params);
}; //查找

//<========金币用户兑换部分========>
export const exchanged = (params) => {
  return axios.post(`/api/exchange/exchanged`, params);
}; //更新兑换状态
export const getExchangeByPage = (params) => {
  return axios.post(`/api/exchange/getInfoByPage`, params);
}; //获取
export const getExchangeBykw = (params) => {
  return axios.post(`/api/exchange/getExchangeBykw`, params);
}; //查找

//<========用户反馈部分========>
export const getFeedbackList = (params) => {
  return axios.post(`/api/feedback/getFeedbackList`, params);
}; //查找

//<========用户信息部分========>
export const getUserList = (params) => {
  return axios.post(`/api/user/getUserList`, params);
}; //查找
export const getUserByPhone = (params) => {
  return axios.post(`/api/user/getUserByPhone`, params);
}; //查找

//<========帖子部分========>
export const getDiscover = (params) => {
  return axios.post(`/api/discover/getDiscoverByPage`, params);
}; //查找
export const delDiscover = (params) => {
  return axios.post(`/api/discover/del`, params);
}; //删除

//<========统计部分========>
export const statsAllData = (params) => {
  return axios.post(`/api/time/statsAllData`, params);
}; //统计
