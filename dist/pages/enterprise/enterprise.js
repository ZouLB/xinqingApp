loader.define(function(require,exports,module) {
    
    var base='';
    var buiPost = null;
    require("login",function(common){
        base = common.base;
        buiPost = common.buiPost;
    })
    
    //接收参数
    var params = router.getPageParams();
    $('#pageTitle').html(params.title);
    $('#total').html(params.number);

    var uiStorage = bui.storage();
    var parkList = uiStorage.get("totalData");
    var userName = uiStorage.get("userName")[0];
    $('.user').text(userName)

    var companyList = parkList[0][params.index].industryInfo[params.type];//公司列表
    
    // console.log(companyList);

    //生成模板
    function template (data) {
        var html = "";
        data.forEach(function(el,index) {

            html +=`<li class="bui-btn bui-box container-y" >
                <div class="countBg bui-align-center">${index+1}</div>
                <div class="span7 container-y bui-text-hide" id="messageLink">${el.name}</div>
                <div class="span1" id="locationLink"><i class="iconfont icon-dingwei-copy"></i></div>
            </li>
            `
        })
        return html;
    };

    var listTpl = template(companyList);

    $("#enterList").html(listTpl);

var storage = bui.storage();

    
    $('.btn-search').on('click',function(){
        let searchList = [];
        let search = $('#searchEnter').val();
        if(search !=''){
            companyList.forEach(function(item){
                if(item.name.indexOf(search)!=-1){
                    searchList.push(item);
                }
            })
            // console.log(searchList);
            
        }else{
            searchList = companyList;
        }
        var listTpl = template(searchList);
        $("#enterList").html(listTpl);

        router.$("#messageLink").on("click",function () {
            var cindex = $(this).siblings('.countBg').text()-1;
            var currentCompant = searchList[cindex];
            // console.log(currentCompant)
            storage.set("companyData",currentCompant);
            router.load({url:"pages/enterMessage/enterMessage.html", param: {index: cindex }});
        })

        router.$("#locationLink").on("click",function () {
            var cindex = $(this).siblings('.countBg').text()-1;
            var messageList = searchList[cindex]//具体到某一家公司
            buiPost("company/getBlockByCid",{cId:messageList.cId},function(res){
                storage.set("blockData",res.resultValue);
            })
            router.load({url:"pages/enterLocation/enterLocation.html" , param: {index: cindex } });
        })
    })

    router.$("#loginLink").on("click",function () {
        router.back({
          name: "login"
        });
    })

    var uiSearchbar = bui.searchbar({ 
       id: "#searchbar",
       callback: function(module,keyword) {
           // 点击以后做什么事情
       }
     });

     //存储数据
    // var storage = bui.storage();
    // storage.set("companyData",companyList);

    //页面跳转
    router.$("#messageLink").on("click",function () {
        var cindex = $(this).siblings('.countBg').text()-1;
        var currentCompant = companyList[cindex]
        storage.set("companyData",currentCompant);
        router.load({url:"pages/enterMessage/enterMessage.html", param: {index: cindex }});
    })

    router.$("#locationLink").on("click",function () {
        var cindex = $(this).siblings('.countBg').text()-1;
        var messageList = companyList[cindex]//具体到某一家公司
        buiPost("company/getBlockByCid",{cId:messageList.cId},function(res){
            storage.set("blockData",res.resultValue);
        })
        router.load({url:"pages/enterLocation/enterLocation.html" , param: {index: cindex } });
    })

    return {};
})