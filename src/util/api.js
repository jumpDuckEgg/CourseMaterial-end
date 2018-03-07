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
    // 获取用户信息
    getUserById(params) {
        return api.post('/user/getUserInformation', params).then(res => res.data);
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
    // 获取全部评论通过ID
    getAllCommentById(params) {
        return api.post('/comment/getAllCommentById', params).then(res => res.data)
    },
    // 评论上下线
    modifyCommentPublish(params) {
        return api.post('/comment/modifyCommentPublish', params).then(res => res.data);
    },
    // 删除评论
    deleteComment(params) {
        return api.post('/comment/deleteComment', params).then(res => res.data);
    },
    // 获取全部用户数据
    getUserCountNum(params) {
        return api.post('/user/getUserCountNum', params).then(res => res.data);
    },
    // 获取最新评论
    getNewComment(params) {
        return api.post('/comment/getCommentLimit', params).then(res => res.data);
    },
    // 获取课程最新收藏数
    getNewCourse(params) {
        return api.post('/course/getCourseLimit', params).then(res => res.data);
    },
    // 删除用户
    deleteUser(params) {
        return api.post('/user/deleteUser', params).then(res => res.data);
    },
    // 修改用户信息
    modifyUser(params) {
        return api.post('/user/updateUserInformation', params).then(res => res.data);
    },
    // 添加模拟试题
    addMoniTest(params) {
        return api.post('/moniTest/createMoniTest', params).then(res => res.data);
    },
    // 查找试题通过参数
    getAllMoniTestByOptions(params) {
        return api.post('/moniTest/getAllMoniTestByOptions', params).then(res => res.data);
    },
    // 修改试题
    modifyMoniTest(params) {
        return api.post('/moniTest/modifyMoniTest', params).then(res => res.data);
    },
    // 删除试题
    deleteMoniTest(params) {
        return api.post('/moniTest/deleteMoniTest', params).then(res => res.data);
    },
    // 添加模拟试卷
    addMoniExam(params) {
        return api.post('/moniExam/createdMoniExam', params).then(res => res.data)
    },
    // 获取模拟试卷通过课程ID
    getAllMoniExamByOptions(params) {
        return api.post('/moniExam/getAllMoniExamByOptions', params).then(res => res.data);
    },
    // 更新模拟试卷
    modifyMoniExamByOptions(params) {
        return api.post('/moniExam/modifyMoniExamByOptions', params).then(res => res.data);
    },
    // 删除模拟试卷
    deleteMoniExam(params) {
        return api.post('/moniExam/deleteMoniExam', params).then(res => res.data);
    },
    // 修改用户密码
    modifyUserPassword(params){
        return api.post('/user/modifyUserPassword',params).then(res=>res.data)
    },
    //管理员获取数量信息
    getUserNumData(){
        return api.get('/user/getUserNumData').then(res=>res.data);
    },
    // 管理员获取最新评论
    getNewCommentByAdmin(){
        return api.get('/comment/getCommentLimitByAdmin').then(res=>res.data)
    },
    // 管理员获取待审批课程
    getCourseByAdmin(){
        return api.get('/course/getCourseByAdmin').then(res=>res.data);
    }

}