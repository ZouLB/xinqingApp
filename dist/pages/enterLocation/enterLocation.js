loader.define(function(require,exports,module) {

    var uiLoading = bui.loading();

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
    
    var uiStorage = bui.storage();
    var parkList = uiStorage.get("totalData")[0];//全部数据
    var companyList = uiStorage.get("companyData")[0];//全部的公司数据

    var enterpriseLand =[];
    enterpriseLand = uiStorage.get("blockData")[0];

    var enterNumber = 0;

    function template (data){
        buiPost("company/getCompanyByBid",{bId: data.bId},function(res){
            enterNumber = res.resultValue.length;
        })
        var listTpl =`<div class="bui-box container-x top" id="plistLink">
            <i class="iconfont icon-back"></i>
            <h2>${data.name}</h2>
        </div>
        <div class="boxWrap bui-fluid">
            <h3><i class="iconfont icon-dikuaiqingkuang"></i>地块概览</h3>
            <ul>
                <li class="bui-left bui-align-center">
                    <div class="count"><span>${data.landOverview}</span>㎡</div>
                    <div class="sort">地块概览</div>
                </li>
                <li class="bui-left bui-align-center">
                    <div class="count"><span>${data.planArea}</span>㎡</div>
                    <div class="sort">规划总建筑面积</div>
                </li>
                <li class="bui-left bui-align-center">
                    <div class="count"><span>${data.plotRatio}</span></div>
                    <div class="sort">规划容积率</div>
                </li>
            </ul>
        </div>
        <div class="boxWrap bui-fluid">
            <h3><i class="iconfont icon-area"></i>建筑面积</h3>
            <ul>
                <li class="bui-left bui-align-center">
                    <div class="count"><span>${data.builtArea}</span>㎡</div>
                    <div class="sort">已建建筑面积</div>
                </li>
            </ul>
        </div>
        <div class="boxWrap bui-fluid">
            <h3><i class="iconfont icon-fenchengbili"></i>地块内厂房使用情况</h3>
            <ul>
                <li class="bui-left bui-align-center">
                    <div class="count"><span>${data.rentArea}</span>㎡</div>
                    <div class="sort">待租面积</div>
                </li>
            </ul>
        </div>
        <div class="boxWrap bui-fluid">
            <h3><i class="iconfont icon-qiye"></i>企业数量</h3>
            <ul>
                <li id="plistLink" class="bui-left bui-align-center">
                    <div class="count"><span>${enterNumber}</span>家</div>
                    <div class="sort">企业数量</div>
                    <div class="msg" style="display:none">gs</div><div class="index" style="display:none">${index}</div>
                </li>
            </ul>
        </div>
        <div class="boxWrap bui-fluid">
            <h3><img class="icon" src="images/title_remarks.png">备注</h3>
            <ul>
                <li class="bui-left bui-align-center">
                    <div class="count"><span id="isUnused">否</span></div>
                    <div class="sort">闲置土地</div>
                </li>
                <li class="bui-left bui-align-center">
                    <div class="count"><span id="isLow">否</span></div>
                    <div class="sort">低效用地</div>
                </li>
            </ul>
        </div>`
        $(".enterLoWrap").html(listTpl);

        if(data.unusedLand){
            $('#isUnused').html('闲置');
        }
        if(data.lowLand){
            $('#isLow').html('低效');
        }

        //页面跳转
        router.$("#plistLink").on("click",function () {
            router.load({url:"pages/plotList/plotList.html",param:{bId:data.bId}});
        }) 

    }

    template(enterpriseLand);

    var userName = uiStorage.get("userName")[0];
    $('.user').text(userName)

    router.$("#loginLink").on("click",function () {
        router.back({
          name: "login"
        });
    })
		
    var overlays = [];
    var labels = [];

    //地图
    var map = new BMap.Map("localMap");// 创建地图实例 
    if(enterpriseLand.nbdLng &&　enterpriseLand.nbdLat){
        map.centerAndZoom(new BMap.Point(enterpriseLand.nbdLng, enterpriseLand.nbdLat), 17);// 初始化地图,设置中心点坐标和地图级别
    }  
    
    map.setCurrentCity("珠海");          // 设置地图显示的城市 

    var opts = {anchor: BMAP_ANCHOR_BOTTOM_LEFT}
    map.addControl(new BMap.NavigationControl(opts)); //放大缩小控件

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

    drawMapvPolygonMain(map, parkList);//多边形
    initLabel(map,parkList[0].block);//label
    map.addEventListener("zoomend", function(){
        if(map.getZoom()<15){
            setLabelDisabled();
        }else{
            initLabelStyle();
        }
    });

    //绘制网格
    let geo = [];
    parkList[0].block.forEach((b) => {
        if(b.locationPoints){
            let p = [];
            let pStr = b.locationPoints.split(';');
            pStr.forEach((lngLat) => {
                let lngLatArr = lngLat.split(',');
                p.push(lngLatArr);
            });
            geo.push({
                name: b.name,
                orgData: b,
                center: [b.nbdLng, b.nbdLat],
                geometry: {
                    type: 'Polygon',
                    coordinates: [p]
                },
            });
        }
    });

    var geojsonDataSet = new mapv.DataSet(geo);
    let geojsonOptions = {
        lineWidth: 1.5,
        zIndex: 2,
        draw: 'simple',
        fillStyle: 'rgba(243,180,45,0.4)',
        strokeStyle: 'rgba(243,180,45,0.8)'
    };

    var mapvLayer = new mapv.baiduMapLayer(map, geojsonDataSet, geojsonOptions);

    var distanceStartX=0;
    var distanceStartY=0;
    map.addEventListener("touchstart",function(e){
        distanceStartX = e.pixel.x;
        distanceStartY = e.pixel.y;
    })

    //点击地块
    map.addEventListener("touchend",function(e){
        let w = $('#getEnScorll');
        let h = w.scrollTop();
        let pixel = {
            x: e.pixel.x,
            y: e.pixel.y + h
        };
        var item = mapvLayer.isPointInPath(mapvLayer.getContext(), pixel);
        var conditions = e.pixel.x-distanceStartX<5 && e.pixel.y-distanceStartY<5;
        if(item&&conditions){
            uiLoading.show();
            uiStorage.set("blockData",item.orgData);
            template(uiStorage.get("blockData")[0]);//更新数据
            currentLayer.update({//修改一开始选中地块的配置
                options: {
                    fillStyle: 'rgba(243,180,45,0.1)',
                    strokeStyle: 'rgba(243,180,45,0.1)',
                }
            })

            let data = geojsonDataSet.get();
            for(let i=0; i < data.length; i++){
                let d = data[i];
                if(d.name === item.name){
                    d.fillStyle = 'rgba(255, 150, 0, 0.8)';
                    d.strokeStyle = 'rgba(255, 0, 0, 0.9)';
                }else{
                    d.fillStyle = 'rgba(243,180,45,0.4)';
                    d.strokeStyle ='rgba(243,180,45,0.8)';
                }
            }
            mapvLayer.dataSet.set(data);
            if(item.center[0] &&　item.center[1]){
                map.panTo(new BMap.Point(item.center[0] ,item.center[1]));
            }

            uiLoading.hide();
        }
    });



    //label的样式
    function initLabelStyle(){
       for(var i=0;i<labels.length;i++){
          labels[i].setStyle({
             color: "#000",
             fontSize : "10px",
             border:"0px",
             display :"block",
             backgroundColor:"#FFF",
             border :"0px",
             opacity: "0.7",
             height : "16px",
             lineHeight : "16px",
             fontFamily:"微软雅黑"
          });
       }
    }

    //隐藏label
    function setLabelDisabled(){
       for(var i=0;i<labels.length;i++){
          labels[i].setStyle({
             opacity: "0"
          });
       }
     }

    
    //绘制label
    function initLabel(map,res){
    if(res && res.length>0){
        for(var i=0;i<res.length;i++){
           if(res[i].sname && res[i].nbdLng &&　res[i].nbdLat){
                    var lab = new BMap.Label(res[i].sname, {position:new BMap.Point(res[i].nbdLng,res[i].nbdLat),offset:{width:-25,height:-15}});
                    initLabelStyle();                
                    lab.info=res[i];
                    lab.map=map;
                    labels.push(lab);
                    map.addOverlay(lab);
                }
            }
        }
    } 

    //多边形
    function drawMapvPolygonMain(map, parkList){
        let geo = [];
        let locationPoints = parkList[1].locationPoints;
        if(locationPoints){
            let p = [];
            let pStr = locationPoints.split(';');
            pStr.forEach((lngLat) => {
                let lngLatArr = lngLat.split(',');
                p.push(lngLatArr);
            });
            geo.push({
                geometry: {
                    type: 'Polygon',
                    coordinates: [p]
                },
                strokeStyle: 'rgba(255, 0, 0, 0.8)'
            });
        };
        let lpStr = parkList[2].locationPoints.split("|");
        lpStr.forEach((locationPoints, inx)=>{
            if(locationPoints){
                let strokeStyle = 'rgba(112, 48, 160, 0.8)';
                if(inx === 1){
                    strokeStyle = 'rgba(255, 0, 0, 0.8)';
                }
                let p = [];
                let pStr = locationPoints.split(';');
                pStr.forEach((lngLat) => {
                    if(lngLat && lngLat.trim()){
                        let lngLatArr = lngLat.split(',');
                        p.push(lngLatArr);
                    }
                });
                geo.push({
                    geometry: {
                        type: 'Polygon',
                        coordinates: [p]
                    },
                    strokeStyle
                });
            };
        });
        let geojsonDataSet = new mapv.DataSet(geo);
        let geojsonOptions = {
            lineWidth: 1.5,
            fillStyle: 'rgba(255,255,255,0)',
            zIndex: 1,
            draw: 'simple'
        };
        let mapvLayer = new mapv.baiduMapLayer(map, geojsonDataSet, geojsonOptions);
    }

    //选中地块
    let geoOne = [];
    let pOne = [];
    let pStrOne = enterpriseLand.locationPoints.split(';');
    pStrOne.forEach((lngLat) => {
        let lngLatArr = lngLat.split(',');
            pOne.push(lngLatArr);
    }); 
    geoOne.push({
        geometry: {
            type: 'Polygon',
            coordinates: [pOne]
        },
    });
    var textDataSet = new mapv.DataSet(geoOne);
    var textOptions = { 
        zIndex:2,
        fillStyle: 'rgba(255, 150, 0, 0.8)',
        strokeStyle: 'rgba(255, 0, 0, 0.9)',
        lineWidth:1.5, 
        draw: 'simple'
    }
    var currentLayer = new mapv.baiduMapLayer(map, textDataSet, textOptions);
    return {};
})