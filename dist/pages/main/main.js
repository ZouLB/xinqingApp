loader.define(function(require,exports,module) {

    var uiLoading = bui.loading();

    var base='';
    var buiPost = null;
    require("login",function(common){
        base = common.base;
        buiPost = common.buiPost;
    })

    //封装GET方法
    function buiGet(api,params,callBack){
        bui.ajax({
            url: base+api,
            data: {params},
            async: false
        }).then(function(res){
            callBack(res);
        },function(res,status){
            console.log(status);
        })
    }

    var storage = bui.storage();
    var userName = storage.get("userName")[0];
    $('.user').text(userName)

    router.$("#loginLink").on("click",function () {
        router.back({
          name: "login"
        });
    })

    var parkList = [];//总体数据

    //获取基础数据
    buiGet("park/list",{},function(res){
        parkList = res.resultValue;
    })

    //根据园区id获取地块信息
    buiPost("block/selectByPid",{pId: "park002"},function(res){
        parkList[0].block=res.resultValue;
        parkList[1].block=res.resultValue;
        buiPost("block/selectByPid",{pId: "park003"},function(res){
            parkList[0].block=parkList[0].block.concat(res.resultValue);
            parkList[2].block=res.resultValue;
        })
    })

    //企业产值和税收
    buiPost("taxValue/selectByType",{type: "park",typeId: "park001"},function(res){
        parkList[0].outputValue=res.resultValue;
        buiPost("taxValue/selectByType",{type: "park",typeId: "park002"},function(res){
            parkList[1].outputValue=res.resultValue;
            buiPost("taxValue/selectByType",{type: "park",typeId: "park003"},function(res){
                parkList[2].outputValue=res.resultValue;
            })
        })
    })

    //企业数量和三大产业
    parkList.forEach(function(item,index){
        item.industryInfo= {dzxx: [], znzz: [], xny: [], hn: [], tc: [], ec: [], gs: []};
    })

    //封装获取数量接口的函数
    function getIndustryInfo(paramsPid,ListIndex){
        buiPost("company/getCompanyByPid",{pId: paramsPid},function(res){
        if(res.resultValue && res.resultValue.length>0){
              var companyList = res.resultValue;
              for (var i = 0; i < companyList.length; i++) {
                if (companyList[i].electron) {
                    parkList[0].industryInfo.dzxx.push(companyList[i]);
                    parkList[ListIndex].industryInfo.dzxx.push(companyList[i]);
                }
                if (companyList[i].intelligence) {
                  parkList[0].industryInfo.znzz.push(companyList[i]);
                    parkList[ListIndex].industryInfo.znzz.push(companyList[i])
                }
                if (companyList[i].xny) {
                  parkList[0].industryInfo.xny.push(companyList[i]);
                    parkList[ListIndex].industryInfo.xny.push(companyList[i]);
                }
                if (companyList[i].hightAndNew) {
                  parkList[0].industryInfo.hn.push(companyList[i]);
                    parkList[ListIndex].industryInfo.hn.push(companyList[i])
                }
                if (companyList[i].technologyCenter) {
                  parkList[0].industryInfo.tc.push(companyList[i]);
                    parkList[ListIndex].industryInfo.tc.push(companyList[i])
                }
                if (companyList[i].engineeringCenter) {
                  parkList[0].industryInfo.ec.push(companyList[i]);
                    parkList[ListIndex].industryInfo.ec.push(companyList[i])
                }
                if (companyList[i].gs) {
                  parkList[0].industryInfo.gs.push(companyList[i]);
                    parkList[ListIndex].industryInfo.gs.push(companyList[i])
                }
              }
            }
        })
    }

    getIndustryInfo("park002",1);//东区
    getIndustryInfo("park003",2);//西区

    // console.log(parkList)
    
    //生成列表的模板
    function template (data) {
        var html = "";
        var ptitle = "";
    
            data.forEach(function(el,index) {
                if(el.pName == 'overall'){
                    ptitle = "园区总体情况"
                }else if(el.pName == 'east'){
                    ptitle = "东片区总体情况"
                }else if(el.pName == 'west'){
                    ptitle = "西片区总体情况"
                }
                
                html += `
                <li class="thePark">
                    <div class="contentWrap">
                        <div class="bui-box container-xy title">
                            <h2>${ptitle}</h2>
                        </div>

                    <div class="boxWrap bui-fluid">
                        <h3><i class="iconfont icon-area"></i>园区面积</h3>
                        <ul>
                            <li class="bui-left bui-align-center">
                                <div class="count"><span>${el.landArea}</span>平方公里</div>
                                <div class="sort">园区总用地面积</div>
                            </li>
                            <li class=" bui-left bui-align-center">
                                <div class="count"><span>${el.builtArea/10000}</span>万㎡</div>
                                <div class="sort">已建筑面积</div>
                            </li>
                        </ul>
                    </div>
                    <div class="boxWrap bui-fluid">
                        <h3><i class="iconfont icon-tudi"></i>用地情况</h3>
                        <ul>
                            <li class="bui-left bui-align-center" id="landLink">
                                <div class="count"><span>${el.palceNum}</span><b>块</b></div>
                                <div class="sort">用地地块数量</div>
                                <div class="index" style="display:none">${el.pId}</div>
                            </li>
                            <li class="bui-left bui-align-center">
                                <div class="count"><span>${el.unusedPalceNum}</span><b>块</b></div>
                                <div class="sort">闲置土地</div>
                            </li>
                            <li class="bui-left bui-align-center">
                                <div class="count"><span>${el.rentRoomNum}</span><b>栋</b></div>
                                <div class="sort">待租厂房</div>
                            </li>
                        </ul>
                    </div>
                    <div class="boxWrap bui-fluid">
                        <h3><i class="iconfont icon-jiazhi"></i>企业产值</h3>
                        <ul>`

                    el.outputValue.forEach(function(elo) {
                        html +=`<li id="gsLink" class="bui-left bui-align-center">
                                 <div class="count"><span>${elo.value}</span>亿元</div>
                                 <div class="sort">园区${elo.year}规上企业产值</div>
                                 <div class="index" style="display:none">${index}</div>
                             </li>`
                    })

                    html+= `</ul>
                    </div>
                    <div class="boxWrap bui-fluid">
                        <h3><i class="iconfont icon-shui"></i>企业税收</h3>
                        <ul>`


                    el.outputValue.forEach(function(elo) {
                        html +=`<li id="gsLink" class="bui-left bui-align-center">
                                <div class="count"><span>${elo.tax}</span>亿元</div>
                                <div class="sort">园区${elo.year}规上企业税收</div>
                                <div class="index" style="display:none">${index}</div>
                            </li>`
                    })

                    html+= `</ul>
                    </div>
                    <div class="boxWrap bui-fluid">
                        <h3><i class="iconfont icon-qiye"></i>企业数量</h3>
                        <ul>
                            <li id="enterLink" class="bui-left bui-align-center">
                                <div class="count"><span class="gsNum${index}">${el.industryInfo.gs.length}</span>家</div>
                                <div class="sort">规上企业数量</div>
                                <div class="msg" style="display:none">gs</div><div class="index" style="display:none">${index}</div>
                            </li>
                            <li id="enterLink"  class="bui-left bui-align-center">
                                <div class="count"><span>${el.industryInfo.hn.length}</span>家</div>
                                <div class="sort">高新企业数量</div>
                                <div class="msg" style="display:none">hn</div><div class="index" style="display:none">${index}</div>
                            </li>
                            <li id="enterLink"  class="bui-left bui-align-center">
                                <div class="count"><span>${el.industryInfo.ec.length}</span>家</div>
                                <div class="sort">工程中心数量</div>
                                <div class="msg" style="display:none">ec</div><div class="index" style="display:none">${index}</div>
                            </li>
                            <li id="enterLink"  class="bui-left bui-align-center">
                                <div class="count"><span>${el.industryInfo.tc.length}</span>家</div>
                                <div class="sort">技术中心数量</div>
                                <div class="msg" style="display:none">tc</div><div class="index" style="display:none">${index}</div>
                            </li>
                        </ul>
                    </div>

                    <div class="boxWrap bui-fluid">
                        <h3><img class="icon" src="images/title_3.png">三大产业</h3>
                        <ul>
                            <li id="enterLink" class="bui-left bui-align-center">
                                <div class="count"><span>${el.industryInfo.dzxx.length}</span>家</div>
                                <div class="sort">电子信息</div>
                                <div class="msg" style="display:none">dzxx</div><div class="index" style="display:none">${index}</div>
                            </li>
                            <li id="enterLink"  class="bui-left bui-align-center">
                                <div class="count"><span>${el.industryInfo.znzz.length}</span>家</div>
                                <div class="sort">智能制造</div>
                                <div class="msg" style="display:none">znzz</div><div class="index" style="display:none">${index}</div>
                            </li>
                            <li id="enterLink"  class="bui-left bui-align-center">
                                <div class="count"><span>${el.industryInfo.xny.length}</span>家</div>
                                <div class="sort">新能源材料</div>
                                <div class="msg" style="display:none">xny</div><div class="index" style="display:none">${index}</div>
                            </li>
                        </ul>
                    </div>`

                    if(el.pName == 'overall'){


                    html +=`<div class="boxWrap bui-fluid panel" id="panel">
                        <div class="bui-panel-head">
                          <h3><i class="iconfont icon-xinxi" ></i>园区产业信息
                          <span class="showItem bui-right"><span class="tip">展开</span><i class="iconfont icon-down-copy changeIcon"></i></span></h3>
                        </div>
                        <div class="bui-panel-main">
                            <ul>`

                    var industrialInfo = el.industrialInfo?JSON.parse(el.industrialInfo):[]; 

                    industrialInfo.forEach(function(eli) {
                        html +=`<li class="info">
                                    <h4>${eli.title}</h4>
                                    <p>${eli.info}</p>
                                </li>`
                    })
                
                

                html+=`     </ul>
                        </div>
                    </div>`
                }

                html+=`    <div class="boxWrap bui-fluid">
                        <h3><i class="iconfont icon-beizhu1"></i>备注</h3>
                        <p class="note">${el.comments}</p>
                    </div>

                    </div>
                </li>`;
            });
    
        return html;
    };

    var listTpl = template(parkList);
    $("#mainContent").html(listTpl);
    
    //页面跳转
    router.$("#locationLink").on("click",function () {
        router.load({url:"pages/enterLocation/enterLocation.html"});
    })

	router.$("#enterLink").on("click",function () {
        var tit = $(this).children('.sort').text();
        var num = $(this).children('.count').children('span').text();
        var typ = $(this).children('.msg').text();
        var i = $(this).children('.index').text();
        router.load({ url: "pages/enterprise/enterprise.html", param: {title: tit,number: num, type:typ,index:i} });
    })

    router.$("#gsLink").on("click",function () {
        var i = $(this).children('.index').text();
        var num = $('.gsNum'+i).text();
        router.load({ url: "pages/enterprise/enterprise.html", param: {title: "规上企业数量",number: num, type:"gs",index:i} });
    })

    router.$("#landLink").on("click",function () {
        var tit = $(this).children('.sort').text();
        var num = $(this).children('.count').children('span').text();
        var un = $(this).children('.count').children('b').text();
        var id = $(this).children('.index').text();
        router.load({ url: "pages/landList/landList.html", param: {title: tit,number: num,unit: un,pid:id} });
    })

    //数据存储
    var storage = bui.storage();
    storage.set("totalData",parkList);

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
            $(".showItem span").html("展开");
            $('.showItem i').removeClass('icon-up').addClass('icon-down-copy');
        }else{
            $(".showItem span").html("收起");
            $('.showItem i').removeClass('icon-down-copy').addClass('icon-up');
        }
    })

    // 底部菜单TAB
    var uiSlideTab = bui.slide({
        id:"#uiSlideTab",
        menu:"#uiSlideTabNav",
        children:".bui-tab-main > ul",
        scroll: true
    });

    //tab切换
    uiSlideTab.on("to",function () {
        uiLoading.show();

        num=0;
        $(".showItem span").html("展开");
        $('.showItem i').removeClass('icon-up').addClass('icon-down-copy');
        $('.bui-panel-head').removeClass('active');
        $('.bui-panel-main').hide();
        
        if($('#uiSlideTabNav li').eq(0).hasClass('active')){
            map.centerAndZoom(new BMap.Point(113.302008,22.193946), 13);
        }else if($('#uiSlideTabNav li').eq(1).hasClass('active')){
            map.centerAndZoom(new BMap.Point(113.331174,22.210439), 16);
        }else if($('#uiSlideTabNav li').eq(2).hasClass('active')){
            map.centerAndZoom(new BMap.Point(113.287648,22.171205), 15);
        }

        uiLoading.hide();
    });

    var overlays = [];
    var labels = [];

    //地图
    var map = new BMap.Map("mapWrap",{enableMapClick:false});// 创建地图实例 
    map.centerAndZoom(new BMap.Point(113.302008, 22.193946), 13);
    map.setCurrentCity("珠海");          // 设置地图显示的城市 

    // map.disableDragging();
    var opts = {anchor: BMAP_ANCHOR_BOTTOM_LEFT}
    map.addControl(new BMap.NavigationControl(opts));  

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
    drawMapvPolygon(map,parkList[0].block);//网格
    
    initLabel(map,parkList[0].block);
    setLabelDisabled();
    map.addEventListener("zoomend", function(){
        if(map.getZoom()<15){
            setLabelDisabled();
        }else{
            initLabelStyle();
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

    //创建label
    function initLabel(map,res){
        if(res && res.length>0){
            for(var i=0;i<res.length;i++){
                if(res[i].sname && res[i].nbdLng &&　res[i].nbdLat){
                    var lab = new BMap.Label(res[i].sname, {position:new BMap.Point(res[i].nbdLng,res[i].nbdLat),offset:{width:-25,height:-15}});            
                    lab.info=res[i];
                    lab.map=map;
                    labels.push(lab);
                    initLabelStyle(); 
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

    //网格
    function drawMapvPolygon(map, block){
        let geo = [];
        block.forEach((b) => {
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
                    fillStyle: 'rgba(243,180,45,0.4)',
                    strokeStyle: 'rgba(243,180,45,0.8)'
                });
            }
        });
        var geojsonDataSet = new mapv.DataSet(geo);
        let geojsonOptions = {
            lineWidth: 1.5,
            zIndex: 2,
            draw: 'simple',
            // methods: { // 一些事件回调函数
            //     click: function (item) { // 点击事件，返回对应点击元素的对象值
            //         if(item){
            //             storage.set("blockData",item.orgData);
            //             router.load({url:"pages/enterLocation/enterLocation.html"});
            //         }
            //     }
            // },
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
            let w = $('#getMScorll');
            let h = w.scrollTop();
            let pixel = {
                x: e.pixel.x,
                y: e.pixel.y + h
            };
            var item = mapvLayer.isPointInPath(mapvLayer.getContext(), pixel);
            var conditions = e.pixel.x-distanceStartX<5 && e.pixel.y-distanceStartY<5;
            if(item&&conditions){
                storage.set("blockData",item.orgData);
                router.load({url:"pages/enterLocation/enterLocation.html"});
            }
        });

    }
    
    // 输出模块
    return {initLabelStyle,setLabelDisabled,initLabel,drawMapvPolygonMain}
})