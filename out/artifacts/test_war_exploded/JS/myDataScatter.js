var dataSet1; //声明全局变量，在下方ajax中接收返回的内容，同步，数据操作写于ajax外面
var time1 = null;
var index = []; //下面用来存放裁决数据中，应被点亮的相应散点的索引
var circle1;

function myDataScatter(category,size) {
    $.ajax({
        url: 'myDataScatter.do?class='+category,
        type: 'get',
        async: false,
        datatype:'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success:function (data) {
            dataSet1 = data;
        }
    });
    //alert(dataSet1[0].fileName + dataSet1[0].x + " "+ dataSet1[0].y + " " + dataSet1[0].keyWord +dataSet1[0].fileContent);
    //每次点击按键时，要清空散点图及词云
    d3.select("#myDataArea")
        .selectAll("svg")
        .remove();
    d3.select("#myFileArea")
        .selectAll("svg")
        .remove();

    //声明对象，内部存放每个点的四个信息
    function Center(fileName,x,y,fileContent,keyWord) {
        this.fileName = fileName;
        this.x = x;
        this.y = y;
        this.fileContent = fileContent;
        this.keyWord = keyWord;
    }

    //将读到的数据转为圆心坐标
    var center = [];
    for (var i = 0; i < dataSet1.length; i++) {
        center[i] = {"fileName":dataSet1[i].fileName,
            "x":dataSet1[i].x.toFixed(5), //double形式坐标保留小数点后5位
            "y":dataSet1[i].y.toFixed(5),
            "keyWord":dataSet1[i].keyWord,
            "fileContent":dataSet1[i].fileContent};
    }
    //console.log(center);

    //声明svg长宽，xy坐标轴长度
    var width = 550;
    var height = 420;
    var xAxisWidth  = 510;
    var yAxisWidth = 400;
    //获取xy的最大值，之后画坐标轴时根据该值自动调整定义域
    var xDomainMax = d3.max(center,function (d) {
        return Math.abs(d.x);
    });
    var yDomainMax = d3.max(center,function (d) {
        return Math.abs(d.y);
    });
    var DomainMax = Math.max(xDomainMax,yDomainMax) * 1.05;
    //定义外边框与画布
    var padding = {top: 10, right: 20, bottom: 10, left: 20};
    var svg1 = d3.select("#myDataArea")
        .append("svg")
        .attr("width", width)
        .attr("height",height);
    //svg.style("border","solid gray");

    //定义比例尺
    var xScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([0,xAxisWidth]);
    var yScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([yAxisWidth,0]);

    //定义坐标轴
    var gxAxis = svg1.append("g").attr("class", "axis x_axis1")
        .attr("transform","translate(200,200)")
        .attr("transform","translate(" + padding.left + "," + (height - padding.top - yAxisWidth/2) + ")");
    var gyAxis = svg1.append("g").attr("class", "axis x_axis1")
        .attr("transform","translate("+(padding.left + xAxisWidth/2)+","+(height - padding.bottom -yAxisWidth)+")");

    //绘制坐标轴
    gxAxis.transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));
    gyAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));

    //创建提示框
    var div = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("opacity", 0);

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg1.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = svg1.append('g')
        .attr("clip-path", "url(#clip)");

    //绘制圆（即相对应的散点）
    circle1 = scatter.selectAll("circle")
        .data(center)
        .enter()
        .append("circle")
        .attr("class","circle1")
        .attr("opacity",0)
        .attr("cx", function () {
            return padding.left + xAxisWidth/2;
        })
        .attr("cy", function () {
            return height - padding.bottom - yAxisWidth/2;
        })
        .attr("r", 1)
        .attr("fill","dodgerblue")
        .attr("cursor", "pointer")
        .on("mouseover", function(d) {  //鼠标移到点上出现提示框
            var R = d3.select(this).attr("r");
            if(R < 5.1) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeElastic)
                    .attr("fill", "blue")
                    .attr("r", 4);
            }else{
                var arcPath1 = d3.arc()
                    .innerRadius(15)
                    .outerRadius(17)
                    .startAngle(0)
                    .endAngle(Math.PI * 2);
                var arcPath2 = d3.arc()
                    .innerRadius(9)
                    .outerRadius(11)
                    .startAngle(0)
                    .endAngle(Math.PI * 2);
                //创建散点处生成的圆环
                var loop = svg1.append("path")
                    .attr("d",arcPath1)
                    .attr("class","loop")
                    .attr("transform","translate("+ d3.select(this).attr("cx") +","+ d3.select(this).attr("cy") +")")
                    .attr("fill","#444444")
                    .attr("opacity",0)
                    .transition()
                    .duration(1300)
                    .ease(d3.easeElastic)
                    .attr("d",arcPath2)
                    .attr("opacity",0.8);
            }
            div.transition()
                .duration(50)
                .style("opacity", .9);
            div.html("name: " + d.fileName )//+ "<br/>" + "x:" + d.x + "<br/>" + "y:" +d.y)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            var R = d3.select(this).attr("r");
            //console.log(R);
            if(R > 5.1){
                //若散点已被点亮，则不对圆恢复原状
            }else{
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("fill","dodgerblue")
                    .attr("r",2);
            }
            d3.selectAll(".loop")
                .transition()
                .duration(300)
                .attr("opacity",0);
            div.transition()
                .duration(100)
                .style("opacity", 0);
        })
        .on("click", function(d) {
            //单击圆展示文本内容对应词云
            // 取消上次延时未执行的方法
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill","#F63C12")
                .attr("r",5.2);
            clearTimeout(time1);
            //执行延时
            time1 = setTimeout(function(){
                getMyWordCloud(d);
            },300);

            //console.log(d.fileName + category + size);
            getSimilarityMatch(d,category,size);
        })
        .on("dblclick", function (d) {
            clearTimeout(time1);
            getMyFileContent(d);
        });

    var transition = circle1.transition()
        .delay(500)
        .duration(1000)
        .attr("cx",function (d) {
            return padding.left + xScale(d.x);
        })
        .attr("cy",function (d) {
            return padding.bottom + yScale(d.y);
        })
        .attr("opacity",0.9);

    //若选中的是所有类别，则散点半径设为1,否则设为2
    if(category === "AllCategories"){
        //不提供移入移出交互功能,且聚类按钮不可选
        transition.attr("r", 1);
        circle1.on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("fill", "dodgerblue")
                .attr("r", 1);
            div.transition()
                .duration(100)
                .style("opacity", 0);
            })
            .on("dblclick",function (d) {});
        $("#k-means").prop("disabled", true);
        //鼠标缩放功能
        var zoom = d3.zoom()
            .scaleExtent([.3, 10])  // This control how much you can unzoom (x0.5) and zoom (x20)
            .extent([[0, 0], [width, height]])
            .on("zoom", updateChart);
        svg1.call(zoom);
    }else {
        transition.attr("r",2);
    }

    function updateChart() {
        // zoom后更新比例尺
        var newX = d3.event.transform.rescaleX(xScale);
        var newY = d3.event.transform.rescaleY(yScale);
        //绘制新的坐标轴
        gxAxis.call(d3.axisBottom(newX));
        gyAxis.call(d3.axisLeft(newY));
        //更新散点的位置
        scatter.selectAll("circle")
            .attr('cx', function(d) {return padding.left + newX(d.x)})
            .attr('cy', function(d) {return padding.bottom + newY(d.y)})
    }
}


function getMyFileContent(d) {
    $.ajax({
        url: 'myFileContent.do?name='+d.fileName,
        type: 'get',
        async: false,
        datatype:'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success:function (data) {
            //alert(data.fileContent);
            $("#dialog1 p").empty();
            $("#dialog1 p").html(data.fileContent)
                .css("font-size","small")
                .css("white-space","pre-wrap");
            $("#dialog1").dialog("option","title", d.fileName)
            .dialog( "open" );
        }
    });
}

