// 默认已经定义了main模块
loader.define(function(require,exports,module) {

    var pageview = {};
    
    // 模块初始化定义    
    pageview.init = function () {
        
    }
    
    // 初始化
    pageview.init();

    // 底部菜单TAB
	var uiSlideTab = bui.slide({
	    id:"#uiSlideTab",
	    menu:"#uiSlideTabNav",
	    children:".bui-tab-main > ul",
	    scroll: true
	})

	router.$("#enterLink").on("click",function () {
        router.load({url:"pages/enterprise/enterprise.html"});
    })

    router.$("#locationLink").on("click",function () {
        router.load({url:"pages/enterLocation/enterLocation.html"});
    })


    // var data = [{
    //     title: "园区总体情况"
    // },{
    //     title: "东片区总体情况"
    // },{
    //     title: "西片区总体情况"
    // }];
    // //生成列表的模板
    // function template (data) {
    
    //     var html = "";
    
    //         data.forEach(function(el,index) {
    //             html += '<li class="thePark">';
    //             html += '<div id="locationLink"><img src="../../images/map.png" style="width:100%" ></div>';
    //             html += '<div class="contentWrap">';
    //             html += '<div class="bui-box container-xy title"><h2>'+el.title+'</h2></div>';
                
    //             html += '<div class="boxWrap bui-fluid"><h3><i class="iconfont icon-area"></i>'+el.title+'</h3><ul><li class="bui-left bui-align-center">';
    //             html += '<div class="count"><span>8.86</span>平方公里</div><div class="sort">园区总用地面积</div></li></ul></div>';
    //             // html += '<div class="boxWrap bui-fluid"><h3><i class="iconfont icon-area"></i>'+el.title+'</h3><ul><li class="bui-left bui-align-center">';
    //             // html += '<div class="count"><span>8.86</span>平方公里</div><div class="sort">园区总用地面积</div></li></ul></div>';

    //             html += '</div></li>';
    //         });
    
    //     return html;
    // };

    // var listTpl = template(data);

    //  $("#mainContent").html(listTpl);


    //园区产业信息的展开和收起
    var uiAccordion = bui.accordion({
        id:"#panel",
        handle: ".bui-panel-head", 
        target: ".bui-panel-main"
    });

    var num = 0;
    $('.bui-panel-head').on('click',function(){
        num++;
        if(num%2 == 0){
            $('.showItem span').html("展开");
            $('.showItem i').removeClass('icon-up').addClass('icon-down-copy');
        }else{
            $('.showItem span').html("收起");
            $('.showItem i').removeClass('icon-down-copy').addClass('icon-up');
        }
    })

    

    // 输出模块
    module.exports = pageview;
})