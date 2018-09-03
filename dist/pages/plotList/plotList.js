loader.define(function(require,exports,module) {

   var base = "http://bi.projects.bingosoft.net:8081/xinqing/";

    //封装POST方法
    function buiPost(api,params,callBack){
        bui.ajax({
            contentType: 'application/json;charset=UTF-8',
            method: 'POST',
            url: base+api,
            data: JSON.stringify(params),
            async: false
        }).then(function(res){
            callBack(res);
        },function(res,status){
            console.log(status);
        })
    }
		
    //接收参数
    var params = router.getPageParams();

    var blockCompany = [];   
    buiPost("company/getCompanyByBid",{bId: params.bId},function(res){
        blockCompany = res.resultValue;
    })

    $('#partMess .count span').html(blockCompany.length)

    var storage = bui.storage();
    var userName = storage.get("userName")[0];
    $('.user').text(userName)

    router.$("#loginLink").on("click",function () {
        router.back({
          name: "login"
        });
    })

    //生成模板
    function template (data) {
        var html = "";
        data.forEach(function(el,index) {

            html +=`<li class="bui-btn bui-box container-y">
                <div class="countBg bui-align-center">${index+1}</div>
                <div class="span7 container-y bui-text-hide" id="pmessLink">${el.name}</div>
                <div class="span1 btn-back" id="locationLink"><i class="iconfont icon-dingwei-copy"></i></div>
            </li>
            `
        })
        return html;
    };

    var listTpl = template(blockCompany);

    $("#plList").html(listTpl);

    //数据存储
    var storage = bui.storage();

    //页面跳转
    router.$("#pmessLink").on("click",function () {
        var cindex = $(this).siblings('.countBg').text()-1;
        var currentCompant = blockCompany[cindex]
        storage.set("companyData",currentCompant);
        router.load({ url: "pages/enterMessage/enterMessage.html", param: {index: cindex} });
    })

    // //数据存储
    // var storage = bui.storage();
    // storage.set("companyData",blockCompany);

    return {};
})