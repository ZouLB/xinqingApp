loader.define(function(require,exports,module) {

        function goBarChart(canvasId,dataArr){
            var canvas,ctx;

            // 图表属性
            var cWidth, cHeight, cMargin, cSpace;
            var originX, originY;

            // 柱状图属性
            var bMargin, tobalBars, bWidth, maxValue;
            var totalYNomber;

            canvas = document.getElementById(canvasId);
            if(canvas && canvas.getContext){
                ctx = canvas.getContext("2d");
            }

            initChart(); // 图表初始化
            drawLineLabelMarkers(); // 绘制图表轴、标签和标记
            drawBarAnimate(); // 绘制柱状图

            // 图表初始化
            function initChart(){
                // 图表信息
                cMargin = 5;//padding
                cSpace = 35;//与左下角的距离
                cHeight = canvas.height - cMargin*2 - cSpace;
                cWidth = canvas.width - cMargin*2 - cSpace;
                originX = cMargin + cSpace;//起点
                originY = cMargin + cHeight+18;//y起点+15

                // 柱状图信息
                bMargin = 40;//柱状间的间隙
                tobalBars = dataArr.length;//柱状的数量
                bWidth = parseInt( cWidth/tobalBars - bMargin );//柱形宽度
                maxValue = 0;
                for(var i=0; i<dataArr.length; i++){
                    var barVal = parseInt( dataArr[i][1] );
                    if( barVal > maxValue ){
                        maxValue = barVal;
                    }
                }
                if(maxValue>2000){
                	maxValue = (parseInt(maxValue/1000)+1)*1000;//y轴最大值
                }else{
                	maxValue = (parseInt(maxValue/100)+1)*100;
                }
                if(maxValue%6==0){
                	totalYNomber = 6;//y轴的行数
                }else{
                	totalYNomber = 7;
                }
                
            }

            // 绘制图表轴、标签和标记
            function drawLineLabelMarkers(){
                ctx.translate(0.5,0.5);  // 当只绘制1像素的线的时候，坐标点需要偏移，这样才能画出1像素实线
                ctx.font = "12px Arial";
                ctx.lineWidth = 1;
                
                drawLine(originX, originY, originX, cMargin+12);// y轴
                drawLine(originX, originY, originX+cWidth, originY);// x轴

                // 绘制标记
                drawMarkers();
                ctx.translate(-0.5,-0.5);  // 还原位置
            }

            // 画线(x轴，y轴)
            function drawLine(x, y, X, Y){
                ctx.beginPath();
                ctx.strokeStyle="#c6c6c6";
                ctx.moveTo(x, y);
                ctx.lineTo(X, Y);
                ctx.stroke();
                ctx.closePath();
            }

            // 绘制标记
            function drawMarkers(){
                ctx.strokeStyle = "#E0E0E0";
                // 绘制 y
                var oneVal = parseInt(maxValue/totalYNomber);//平均值
                ctx.textAlign = "right";
                for(var i=0; i<=totalYNomber; i++){
                    var markerVal =  i*oneVal;//每行的值
                    var xMarker = originX-5;//数字的x坐标
                    var yMarker = parseInt( cHeight*(1-markerVal/maxValue) ) + cMargin;//数字的y坐标
                    
                    ctx.fillStyle="#c6c6c6";
                    ctx.fillText(markerVal, xMarker, yMarker+3+18, cSpace); // 文字
                }
                // 绘制 x
                ctx.textAlign = "center";
                for(var i=0; i<tobalBars; i++){
                    var markerVal = dataArr[i][0];//传的值
                    var xMarker = parseInt( originX+cWidth*(i/tobalBars)+bMargin+bWidth/2 );
                    var yMarker = originY+15;
                    ctx.fillStyle="#c6c6c6";
                    ctx.fillText(markerVal, xMarker-20, yMarker, cSpace); // 文字
                }
            };

            //绘制柱形图
            function drawBarAnimate(mouseMove){
                for(var i=0; i<tobalBars; i++){
                    var oneVal = parseInt(maxValue/totalYNomber);//平均值
                    var barVal = dataArr[i][1];//传的值
                    var barH = parseInt( cHeight*barVal/maxValue);
                    var y = originY - barH;
                    var x = originX + (bWidth+bMargin)*i + bMargin;
                    drawRect( x-13, y, bWidth-13, barH);  //高度减一避免盖住x轴
                    ctx.fillText(barVal, x+10, y-3); // 文字
                }
            }

            //绘制方块
            function drawRect( x, y, X, Y ){
                ctx.beginPath();
                ctx.rect( x, y, X, Y );
                ctx.fillStyle = "rgb(0,149,222)";
                ctx.strokeStyle = "rgb(0,149,222)";
                ctx.fill();
                ctx.closePath();

            }
        }


        goBarChart(
                'barChart',[['2015年', 5182], ['2016年', 5985], ['2017年', 6427.5]]
        )
        goBarChart(
                'my',[['2015年',1199], ['2016年', 1109], ['2017年', 427.5]]
        )

    return {};
})