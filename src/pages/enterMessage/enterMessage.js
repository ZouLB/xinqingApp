loader.define(function(require,exports,module) {

    var base='';
    var buiPost = null;
    require("login",function(common){
        base = common.base;
        buiPost = common.buiPost;
    })
	
    //接收参数
    var params = router.getPageParams();
    
    var uiStorage = bui.storage();
    var companyList = uiStorage.get("companyData");
    var userName = uiStorage.get("userName")[0];
    var messageList = companyList[0];
    $('.user').text(userName)

    $('.msgTitle').html(messageList.name);

    if(messageList.gs){
        $(".tag").append('<li>规上企业</li>')
    }
    if(messageList.hightAndNew){
        $(".tag").append('<li>高新技术企业</li>')
    }
    if(messageList.engineeringCenter){
        $(".tag").append('<li>工程中心</li>')
    }
    if(messageList.technologyCenter){
        $(".tag").append('<li>技术中心</li>')
    }

    
    if(messageList.synopsis){
        $(".enterIntro").html(`<span class="container-x">${messageList.synopsis}</span>`)
    }else{
        $(".enterIntro").html(`<span class="container-x">暂无企业简介</span>`)
    }

    if(messageList.info){
        $(".enterInfo").html(`<span class="container-x">${messageList.info}</span>`)
    }else{
        $(".enterInfo").html(`<span class="container-x">暂无企业信息</span>`)
    }

    if(messageList.contactUserName||messageList.contactUserPhone){
        $(".contactInfo").html(`<i class="iconfont icon-user1 container-x"></i><span>${messageList.contactUserName}</span>&nbsp;<span class="phoneNumber">${messageList.contactUserPhone}</span>`)
    }

    $('.phoneNumber').on('click',function(){
        bui.unit.tel(messageList.contactUserPhone);
    })


    //展开和收起
    var uiAccordion = bui.accordion({
        id:"#panel1",
        handle: ".bui-panel-head", 
        target: ".bui-panel-main"
    });

    var num1 = 0;

    $('#panel1 .bui-panel-head').on('click',function(){
        num1++;
        if(num1%2 == 0){
            $("#panel1 .showItem span").html("展开");
            $('#panel1 .showItem i').removeClass('icon-up').addClass('icon-down-copy');
        }else{
            $("#panel1 .showItem span").html("收起");
            $('#panel1 .showItem i').removeClass('icon-down-copy').addClass('icon-up');
        }
    })

    var uiAccordion = bui.accordion({
        id:"#panel2",
        handle: ".bui-panel-head", 
        target: ".bui-panel-main"
    });

    var num2 = 0;

    $('#panel2 .bui-panel-head').on('click',function(){
        num2++;
        if(num2%2 == 0){
            $("#panel2 .showItem span").html("展开");
            $('#panel2 .showItem i').removeClass('icon-up').addClass('icon-down-copy');
        }else{
            $("#panel2 .showItem span").html("收起");
            $('#panel2 .showItem i').removeClass('icon-down-copy').addClass('icon-up');
        }
    })


    // var enterpriseLand =[];
    // buiPost("company/getBlockByCid",{cId:messageList.cId},function(res){
    //      enterpriseLand = res.resultValue;
    // })

    // var listTpl =`    <li  class="bui-left bui-align-center">
    //         <div class="count"><span>${enterpriseLand.landOverview}</span>万㎡</div>
    //         <div class="sort">用地面积</div>
    //     </li>
    //     <li class="bui-left bui-align-center">
    //         <div class="count"><span>${enterpriseLand.planArea}</span>万㎡</div>
    //         <div class="sort">规划总建筑面积</div>
    //     </li>
    //     <li class="container-xy bui-left bui-align-center">
    //         <div class="count"><span>${enterpriseLand.plotRatio}</span></div>
    //         <div class="sort">规划容积率</div>
    //     </li>
    //     <li class="bui-left bui-align-center">
    //         <div class="count"><span>${enterpriseLand.builtArea}</span>万㎡</div>
    //         <div class="sort">已建筑面积</div>
    //     </li>
    //     <li class="bui-left bui-align-center">
    //         <div class="count"><span>${enterpriseLand.rentArea}</span>万㎡</div>
    //         <div class="sort">厂房使用情况</div>
    //     </li>`

    // $("#areaMessage").html(listTpl);

    //柱形图
    var yearArr=[];
    var valueArr=[];
    var taxArr=[];
    buiPost("taxValue/selectByType",{type: "company",typeId: messageList.cId},function(res){
        res.resultValue.forEach(function(el){
            yearArr.unshift(el.year);
            valueArr.unshift(el.value);
            taxArr.unshift(el.tax);
        })
    })

    function echart(name,id,xArr,yArr){
        var name = echarts.init(document.getElementById(id));

        var data = xArr;
        option = {
            color: ['rgb(0,149,222)'],
            grid: {
                left: '2%',
                right: '4%',
                bottom: '10%',
                top:'20%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : yArr,
                    axisLine:{
                        lineStyle:{
                            color:'#999',
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    axisTick:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine:{
                        lineStyle:{
                            color:'#999',
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    axisTick:{       
                      "show":false
                    },
                    scale: true,
                    splitLine:{
                        show:false
                    }
                }
            ],
            series : [
                {
                    type:'bar',
                    barWidth: '50%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data:data
                }
            ]
        };

         name.setOption(option);
    }
	
    if(yearArr.length>0){
        $('.addEcharts1').append('<div id="myEcharts1" style="height:140px;" class="container-x"></div>')
        $('.addEcharts2').append('<div id="myEcharts2" style="height:140px;" class="container-x"></div>')
        echart('myCharts1','myEcharts1',valueArr,yearArr);
        echart('myCharts2','myEcharts2',taxArr,yearArr);
    }

    //页面跳转
    router.$("#loginLink").on("click",function () {
        router.back({
          name: "login"
        });
    })
        
    return {};
})