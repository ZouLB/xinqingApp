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

    //地图
    var map = new BMap.Map("container");// 创建地图实例 
    map.centerAndZoom(new BMap.Point(113.309, 22.199), 13);// 初始化地图，设置中心点坐标和地图级别  
    map.setCurrentCity("珠海");          // 设置地图显示的城市

    //修改地图样式
    map.setMapStyle({
        styleJson:[
            {
                "featureType": "highway",
                "elementType": "all",
                "stylers": {
                    "color": "#c9c9c9ff"
                }
            },{
                "featureType": "poilabel",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            },{
                "featureType": "districtlabel",
                "elementType": "all",
                "stylers": {
                    "visibility": "off"
                }
            },{
                "featureType": "road",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            },{
                "featureType": "manmade",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }
        ]
    });

    // var data = [
    //     [
    //         [113.283111,22.172595],[113.289686,22.173934],[113.291196,22.171256],[113.283578,22.170152]
    //     ],
    //     [
    //         [113.276104,22.165064],[113.289686,22.173934],[113.291196,22.171256],[113.283578,22.170152]
    //     ]
    // ]

    // function dullPolygon(arr){
    //     for(var i=0;i<arr.length;i++){
    //     map.addOverlay(new BMap.Polygon([
            
    //             new BMap.Point(arr[i][0],arr[i][1])+','
    //             console.log(arr[i][0],arr[i][1])
            
    //     ], {strokeColor:"#F4BE49", strokeWeight:2, fillColor:"#FCDF96",fillOpacity:1}))
    //     }
    // }

    // dullPolygon([[113.283111,22.172595],[113.289686,22.173934],[113.291196,22.171256],[113.283578,22.170152]])

    //创建多边形
    var polygon = new BMap.Polygon([
        new BMap.Point(113.283111,22.172595),
        new BMap.Point(113.289686,22.173934),
        new BMap.Point(113.291196,22.171256),
        new BMap.Point(113.283578,22.170152),
    ], {strokeColor:"#F4BE49", strokeWeight:2, fillColor:"#FCDF96",fillOpacity:1});  
    
    // // var polygon = new BMap.Polygon([
    // //     new BMap.Point(113.276104,22.165064),
    // //     new BMap.Point(113.281171,22.166035),
    // //     new BMap.Point(113.281781,22.162152),
    // //     new BMap.Point(113.276931,22.161181),
    // // ], {strokeColor:"#F4BE49", strokeWeight:2, fillColor:"#FCDF96",fillOpacity:1}); 

    map.addOverlay(polygon); 
    
    // polygon.addEventListener("click",change_style);
    // function change_style(e){
    //     alert('gfdgfdg');
    // } 

    

    //添加label
    //获得中心点
    // function getCenterPoint(path)
    // {
    //     var x = 0.0;
    //     var y = 0.0;
    //     for(var i=0;i<path.length;i++){
    //         x=x+ parseFloat(path[i].lng);
    //         y=y+ parseFloat(path[i].lat);
    //     }
    //     x=x/path.length;
    //     y=y/path.length;
    //     return new BMap.Point(x,y);
    // }
    // var point = getCenterPoint(polygon.getPath());
    // var label=new BMap.Label('dfdsfs', {offset:new BMap.Size(-10,-25), position:point});
    // map.addOverlay(label);


    // 输出模块
    module.exports = pageview;
})