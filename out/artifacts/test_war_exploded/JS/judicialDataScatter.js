var dataSet2;
var time2 = null;
var circle2;

function judicialDataScatter(category) {
    $.ajax({
        url: 'judicialDataScatter.do?class='+category,
        type: 'get',
        async: false,
        datatype:'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success:function (data) {
            dataSet2 = data;
            //alert(data[0].fileName + data[0].x + " "+ data[0].y + data[0].keyWord + data[0].fileContent);
        }
    });
    //alert(dataSet2[0].fileName + dataSet2[0].x + " "+ dataSet2[0].y + dataSet2[0].keyWord + dataSet2[0].fileContent);

    //每次点击按键时，清空散点图及词云
    d3.select("#judicialDataArea")
        .selectAll("svg")
        .remove();
    d3.select("#judicialFileArea")
        .selectAll("svg")
        .remove();

    function Center(fileName,x,y,keyWord,fileContent) {
        this.fileName = fileName;
        this.x = x;
        this.y = y;
        this.fileContent = fileContent;
        this.keyWord = keyWord;
    }

    //将读到的数据转为圆心坐标
    var center = [];
    for (var i = 0; i < dataSet2.length; i++) {
        center[i] = {"fileName":dataSet2[i].fileName,
            "x":dataSet2[i].x.toFixed(5),    //double形式坐标保留小数点后5位
            "y":dataSet2[i].y.toFixed(5),
            "keyWord":dataSet2[i].keyWord,
            "fileContent":dataSet2[i].fileContent};
    }
    //console.log("judicialData length" + center.length);
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
    var svg2 = d3.select("#judicialDataArea")
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
    var gxAxis = svg2.append("g")
        .attr("transform","translate(200,200)")
        .attr("transform","translate("+padding.left+","+(height - padding.top - yAxisWidth/2)+")");
    var gyAxis = svg2.append("g")
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
        .attr("class", "tooltip2")
        .style("opacity", 0);

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg2.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = svg2.append('g')
        .attr("clip-path", "url(#clip)");

    //绘制圆（即相对应的散点）
    circle2 = scatter.selectAll("circle")
        .data(center)
        .enter()
        .append("circle")
        .attr("opacity",0)
        .attr("class","circle2")
        .attr("cx", function () {
            return padding.left + xAxisWidth/2;
        })
        .attr("cy", function () {
            return height - padding.bottom - yAxisWidth/2;
        })
        .attr("r", 1)
        .attr("fill","dodgerblue")
        .attr("cursor", "pointer")
        .on("mouseover", function(d) {
            //若圆点未被点亮，则变蓝；若已被点亮，在圆点附近创建圆环
            var R = d3.select(this).attr("r");
            if(R < 5.1) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeElastic)
                    .attr("fill", "blue")
                    .attr("r", 4);

                $(".tooltip2").css("height","45px");
                div.html("name: " + d.fileName.substring(0,10)+"..." )//+ "<br/>" + "x:" + d.x + "<br/>" + "y:" + d.y)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
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
                var loop = svg2.append("path")
                    .attr("d",arcPath1())
                    .attr("class","loop")
                    .attr("transform","translate("+ d3.select(this).attr("cx") +","+ d3.select(this).attr("cy") +")")
                    .attr("fill","#444444")
                    .attr("opacity",0)
                    .transition()
                    .duration(1300)
                    .ease(d3.easeElastic)
                    .attr("d",arcPath2)
                    .attr("opacity",0.8);
                $(".tooltip2").css("height","60px");
                div.html("name: " + d.fileName.substring(0,10)+"..." + "<br/>" /*+ "x: " + d.x + "<br/>"
                    + "y: " + d.y + "<br/>"*/ + "sim: " + d3.select(this).attr("id"))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }
            //提示框动画
            div.transition()
                .duration(50)
                .style("opacity", .9);

        })
        .on("mouseout", function(d) {
            var R = d3.select(this).attr("r");
            //console.log(R);
            if(R > 5.1){
                //若散点已被点亮，则不恢复原状
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
            clearTimeout(time2);
            //执行延时
            time2 = setTimeout(function(){
                //do function在此处写单击事件要执行的代码
                getJudicialWordCloud(d);
            },300);


        })
        .on("dblclick", function (d) {
            clearTimeout(time2);
            getJudicialFileContent(d);
        });

    var transition = circle2.transition()
        .delay(500)
        .duration(1000)
        .attr("cx",function (d) {
            return padding.left + xScale(d.x);
        })
        .attr("cy",function (d) {
            return padding.bottom + yScale(d.y);
        })
        .attr("opacity",0.8);

    if(category === "AllCategories"){
        transition.attr("r",1);
        circle2.on("mouseout", function(d) {
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
        var zoom = d3.zoom()
            .scaleExtent([.3, 10])  // This control how much you can unzoom (x0.5) and zoom (x20)
            .extent([[0, 0], [width, height]])
            .on("zoom", updateChart);
        svg2.call(zoom);

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

function getJudicialFileContent(d) {
    $.ajax({
        url: 'judicialFileContent.do?name='+d.fileName,
        type: 'get',
        async: false,
        datatype:'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success:function (data) {
            //alert(data.fileContent);
            //console.log(data.fileContent);
            $("#dialog2 p").empty();
            $("#dialog2 p").append(data.fileContent)
                .css("font-size","small")
                .css("white-space","pre-wrap");  //该css属性使得dialog部件能够识别"\n"的换行符
            $("#dialog2").dialog("option","title", d.fileName)
                .dialog( "open" );
        }
    });
}
