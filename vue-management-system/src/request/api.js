import axios from './request'

// 登录接口
export const loginApi = (admin) => axios.post('/api/v1/pc/admin/login', admin)

//发送邮箱验证码
export const sendEmailCodeApi = (email) =>
  axios.get('/api/v1/pc/admin/send_emil', {
    params: {
      email,
    },
  })
//获取验证码
export const getCaptchaApi = () =>
  axios.get('/api/v1/captcha/get_captcha', {
    responseType: 'blob',
  })
//校验验证码
export const flagCodeApi = (captcha) =>
  axios.get('/api/v1/captcha/send_code', {
    params: {
      captcha,
    },
  })
//宠物上传照片
export const upLoadImgApi = (file, token) =>
  axios.post('/api/v1/pc/pet/up_pet_img', file, {
    headers: {
      token: token,
      'Content-Type': 'multipart/form-data',
    },
  })
// 查询宠物信息列表
export const listPetInfoApi = (page, token) =>
  axios.get('/api/v1/pc/pet/list_pet', {
    params: {
      page,
      token,
    },
  })
//删除宠物信息
export const delPetInfoApi = (petId, token) =>
  axios.get('/api/v1/pc/pet/del_pet', {
    params: {
      petId,
      token,
    },
  })
//新增宠物信息
export const addPetInfoApi = (form, token) =>
  axios.post('/api/v1/pc/pet/save_pet', form, {
    headers: {
      token: token,
    },
  })
//修改宠物信息
export const editPetInfoApi = (editForm, token) =>
  axios.post('/api/v1/pc/pet/up_pet', editForm, {
    headers: {
      token: token,
    },
  })
//查询用户信息
export const listUserInfoApi = (page, token) =>
  axios.get('/api/v1/pc/user/list_user', {
    params: {
      page,
      token,
    },
  })
//禁用账户信息
export const delUserStatusApi = (userId, token) =>
  axios.get('/api/v1/pc/user/del_user', {
    params: {
      userId,
      token,
    },
  })
//解封账户信息
export const upUserStatusApi = (userId, token) =>
  axios.get('/api/v1/pc/user/up_user', {
    params: {
      userId,
      token,
    },
  })
//获取用户排行榜
export const rankUserApi = (token) =>
  axios.get('/api/v1/pc/user/rank_user', {
    params: {
      token,
    },
  })
//项目服务管理列表
export const listServiceApi = (page, token) =>
  axios.get('/api/v1/pc/service/list_service', {
    params: {
      page,
      token,
    },
  })
//服务项目新增接口
export const addServiceApi = (addForm, token) =>
  axios.post('/api/v1/pc/service/save_service', addForm, {
    headers: {
      token: token,
    },
  })
//项目服务上架接口
export const upServiceApi = (serviceId, token) =>
  axios.get('/api/v1/pc/service/put_service', {
    params: {
      serviceId,
      token,
    },
  })
//项目服务下架接口
export const delServiceApi = (serviceId, token) =>
  axios.get('/api/v1/pc/service/del_service', {
    params: {
      serviceId,
      token,
    },
  })
//根据id去修改项目服务的信息
export const editServiceApi = (editForm, token) =>
  axios.post('/api/v1/pc/service/up_service', editForm, {
    headers: {
      token: token,
    },
  })
//获取分类和文章数据
export const listCategoryApi = (token) =>
  axios.get('/api/v1/pc/category/list_category', {
    params: {
      token,
    },
  })
//删除文章内容
export const delTopicApi = (topicId, token) =>
  axios.get('/api/v1/pc/topic/del_topic', {
    params: {
      topicId,
      token,
    },
  })

export const addTopicApi = (addForm, token) =>
  axios.post('/api/v1/pc/topic/add_topic', addForm, {
    headers: {
      token: token,
    },
  })
//将ChatGPT回答的数据添加缓存
export const setSearchDataApi = (messages, title, token) =>
  axios.get('/api/v1/pc/pet/addMessagesList', {
    params: {
      messages,
      title,
    },
    headers: {
      token,
    },
  })
//将ChatGPT回答的数据获取
export const getSearchDataApi = (token) =>
  axios.get('/api/v1/pc/pet/members_list', {
    params: {
      token,
    },
  })
