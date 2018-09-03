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
    $('#pageTitle').html(params.title);
    $('#total').html(params.number);
    $('.unit').html(params.unit);

    var uiStorage = bui.storage();
    var userName = uiStorage.get("userName")[0];
    $('.user').text(userName)

    var blockList = []
    if(params.pid == "park001"){
        buiPost("block/selectByPid",{pId: "park002"},function(res){
            blockList = res.resultValue;
            buiPost("block/selectByPid",{pId: "park003"},function(res){
                blockList=blockList.concat(res.resultValue);
            })
        })
    }else{
        buiPost("block/selectByPid",{pId: params.pid},function(res){
            blockList = res.resultValue;
        })
    }
    
    var uiSearchbar = bui.searchbar({ 
       id: "#searchbar",
       callback: function(module,keyword) {
           // 点击以后做什么事情
       }
     });

    router.$("#loginLink").on("click",function () {
        router.back({
          name: "login"
        });
    })

    // //生成模板
    function template (data) {
        var html = "";
        data.forEach(function(el,index) {

            html +=`<li class="bui-btn bui-box container-y" >
                <div class="countBg bui-align-center"><span>${index+1}</span></div>
                <div class="span7 container-y bui-text-hide" id="messageLink">${el.name}</div>
            </li>
            `
        })
        return html;
    };

    var listTpl = template(blockList);

    $("#enterList").html(listTpl);

    $('.btn-search').on('click',function(){
        let searchList = [];
        let search = $('#searchBlock').val();
        if(search !=''){
            blockList.forEach(function(item){
                if(item.name.indexOf(search)!=-1){
                    searchList.push(item);
                }
            })
            var listTpl = template(searchList);
            $("#enterList").html(listTpl);
        }else{
            var listTpl = template(blockList);
            $("#enterList").html(listTpl);
        }
    })

    return {};
})