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

    var uiStorage = bui.storage();
    var companyList = uiStorage.get("companyData");
    var messageList = companyList[0][params.index];

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
    }

    if(messageList.info){
        $(".enterInfo").html(`<span class="container-x">${messageList.info}</span>`)
    }
    
    if(messageList.contactUserName||messageList.contactUserPhone){
        $(".contactInfo").html(`<i class="iconfont icon-user1 container-x"></i><span>${messageList.contactUserName}</span>&nbsp;<span class="phoneNumber">${messageList.contactUserPhone}</span>`)
    }

    $('.phoneNumber').on('click',function(){
        bui.unit.tel(messageList.contactUserPhone);
    })

    var userName = uiStorage.get("userName")[0];
    $('.user').text(userName)

    router.$("#loginLink").on("click",function () {
        router.back({
          name: "login"
        });
    })

    var enterpriseLand =[];
    buiPost("company/getBlockByCid",{cId:messageList.cId},function(res){
         enterpriseLand = res.resultValue;
    })

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

    //柱形图
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

    return {};
})
