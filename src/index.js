window.router = bui.router();

bui.on("pageinit",function(){
    // 初始化路由
    router.init({
        id: "#bui-router"
    })
    
    // 绑定事件
    bind();

    // 事件类定义
    function bind() {
        // 绑定页面的所有按钮有href跳转
        bui.btn({id:"#bui-router",handle:".bui-btn,a"}).load();

        // 统一绑定页面所有的后退按钮
        $("#bui-router").on("click",".btn-back",function (e) {
            // 支持后退多层,支持回调
            bui.back();
        })
    }
})



//定义多个模块
// loader.map({
//     baseUrl: "",
//     modules: {
//         "main": {
//             moduleName: "main",
//             template: "pages/main/main.html",
//             script: "pages/main/main.js"
//         },
//         "login": {
//             moduleName: "login",
//             template: "pages/login/login.html",
//             script: "pages/login/login.js"
//         },
//         "enterprise": {
//             moduleName: "enterprise",
//             template: "pages/enterprise/enterprise.html",
//             script: "pages/enterprise/enterprise.js"
//         },
//         "enterMessage": {
//             moduleName: "enterMessage",
//             template: "pages/enterMessage/enterMessage.html",
//             script: "pages/enterMessage/enterMessage.js"
//         },
//         "enterLocation": {
//             moduleName: "enterLocation",
//             template: "pages/enterLocation/enterLocation.html",
//             script: "pages/enterLocation/enterLocation.js"
//         }
//     }
// })