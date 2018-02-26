import api from './http.js'

export default {
    //用户登录
    userLogin(params) {
        return api.post('/login', params).then(res => res.data);
    },
    // 用户注册
    userRegister(params) {
        return api.post('/register', params).then(res => res.data);
    },
    //获取用户信息
    getAllUsers() {
        return api.get('/user');
    },
    //获取上传token
    getUploadToken(params) {
        return api.post('/uploadtoken', params).then(res => res.data);
    },
    // 创建课程
    createCourse(params) {
        return api.post('/course/createcourse', params).then(res => res.data);
    },
    //获取全部课程
    findAllCourse() {
        return api.get('/course/findallcourse').then(res => res.data);
    },
    //获取作者全部课程
    findAllCourseByAuthor(params) {
        return api.post('/course/findAllCourseByAuthor', params).then(res => res.data);
    },
    // 删除课程
    deleteCourse(params) {
        return api.post('/course/deletecourse', params).then(res => res.data)
    },
    // 审批课程
    isPublishCourse(params) {
        return api.post('/course/updateCoursePublish', params).then(res => res.data)
    },
    //更新课程
    updateCourse(params) {
        return api.post('/course/updateCourseDetail', params).then(res => res.data)
    },
    // 添加课件资源
    addCourseware(params) {
        return api.post('/courseware/addCourseware', params).then(res => res.data)
    },
    // 添加资源
    addResources(params) {
        return api.post('/course/addResources', params).then(res => res.data)
    },
    // 获取资源
    findAllResources(params) {
        return api.post('/course/findallresource', params).then(res => res.data)
    },
    // 删除资源
    removeOneResource(params) {
        return api.post('/course/removeOneResource', params).then(res => res.data)
    },
    // 添加在线测试
    addOnlineTest(params) {
        return api.post('/onlineTest/addonlineTest', params).then(res => res.data)
    },
    // 查找在线测试通过课程ID
    findOnlineTest(params) {
        return api.post('/onlineTest/findAllonlineTest', params).then(res => res.data)
    },
    // 发布或下线在线测试
    publishOnlineTest(params) {
        return api.post('/onlineTest/publishOnlineTest', params).then(res => res.data)
    },
    // 删除在线测试
    removeOnlineTest(params) {
        return api.post('/onlineTest/removeOnlineTest', params).then(res => res.data)
    },
    // 获取全部评论
    getAllComment() {
        return api.get('/comment/getAllComment').then(res => res.data)
    },
    // 评论上下线
    modifyCommentPublish(params) {
        return api.post('/comment/modifyCommentPublish', params).then(res => res.data);
    },
    // 删除评论
    deleteComment(params) {
        return api.post('/comment/deleteComment', params).then(res => res.data);
    }


}