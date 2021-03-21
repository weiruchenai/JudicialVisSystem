var dataSet3;
var dataSet4;
function getHexBinDensity1(category) {
    $.ajax({
        url: 'myDataScatter.do?class=' + category,
        type: 'get',
        async: false,
        datatype: 'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            dataSet3 = data;
            //alert(dataSet3[0].fileName + dataSet3[0].x + dataSet3[0].y);
        }
    });
    //console.log(dataSet3[1].fileName + dataSet3[0].x + dataSet3[0].y);
    d3.select("#myDataArea")
        .selectAll("svg")
        .remove();
    d3.select("#myFileArea")
        .selectAll("svg")
        .remove();

    //声明svg长宽，xy坐标轴长度
    var width = 550;
    var height = 420;
    var xAxisWidth  = 510;
    var yAxisWidth = 400;
    var padding = {top: 10, right: 20, bottom: 10, left: 20};
    //定义画布
    var svg = d3.select("#myDataArea")
        .append("svg")
        .attr("width", width)
        .attr("height",height);
    //创建提示框
    var div = d3.select("body").append("div")
        .attr("class", "tooltip4")
        .style("opacity", 0);

    //获取xy的最大值，比例尺根据该值自动调整定义域
    var xDomainMax = d3.max(dataSet3,function (d) {
        return Math.abs(d.x);
    });
    var yDomainMax = d3.max(dataSet3,function (d) {
        return Math.abs(d.y);
    });
    var DomainMax = Math.max(xDomainMax,yDomainMax) * 1.05;
    //定义比例尺
    var xScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([0,xAxisWidth]);
    var yScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([yAxisWidth,0]);

    //定义坐标轴
    var gxAxis = svg.append("g").attr("class", "axis x_axis1")
        .attr("transform","translate(200,200)")
        .attr("transform","translate(" + padding.left + "," + (height - padding.top - yAxisWidth/2) + ")");
    var gyAxis = svg.append("g").attr("class", "axis x_axis1")
        .attr("transform","translate("+(padding.left + xAxisWidth/2)+","+(height - padding.bottom -yAxisWidth)+")");

    //绘制坐标轴
    gxAxis.transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));
    gyAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));

    //获取hexbin的输入
    var inputForHexbinFun = [];
    for (var i = 0; i < dataSet3.length; i++) {
        inputForHexbinFun.push( [xScale(dataSet3[i].x), yScale(dataSet3[i].y)] )
    }

    var hexbin = d3.hexbin()
        .radius(9) // size of the bin in px
        .extent([ [0, 0], [xAxisWidth, yAxisWidth] ]);
    //console.log(hexbin(inputForHexbinFun)[0]);

    // 定义线性颜色尺
    var color = d3.scaleLinear()
        .domain([0, 800]) // Number of points in the bin? #69b3a2
        .range(["transparent",  "#69b3a2"]);
    var color2 = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(hexbin(inputForHexbinFun),function (d) {
            return d.length * 1.5;
        })]);
    console.log(color + "....." +color2);

    //绘制hexbin
    svg.append("g")
        .selectAll("path")
        .data(hexbin(inputForHexbinFun))
        .enter().append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", function(d) { return "translate(" + (padding.left + d.x) + "," + (padding.bottom + d.y) + ")"; })
        .attr("fill", function(d) { return color(d.length * 20); })
        .attr("stroke", "black")
        .attr("stroke-width", "0.1")
        .attr("opacity",0)
        .on("mouseover",function (d) {
            var x = xScale.invert(d.x);
            var y = yScale.invert(d.y);
            d3.select(this)
                .transition()
                .duration(50)
                .attr("fill","white");
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(/*"number: " +*/ d.length )//+ "<br/>" + "x:" + x.toFixed(2) + "<br/>" + "y:" + y.toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout",function (d) {
            div.transition()
                .duration(200)
                .style("opacity",0);
            d3.select(this)
                .transition()
                .duration(600)
                .attr("fill",function(d) { return color(d.length * 20); });
        })
        .transition()
        .duration(1000)
        .attr("opacity",1);
}

//裁决数据的hexbin
function getHexBinDensity2(category) {
    $.ajax({
        url: 'judicialDataScatter.do?class=' + category,
        type: 'get',
        async: false,
        datatype: 'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            dataSet4 = data;
            //alert(dataSet4[0].fileName + dataSet4[0].x + dataSet4[0].y);
        }
    });
    d3.select("#judicialDataArea")
        .selectAll("svg")
        .remove();
    d3.select("#judicialFileArea")
        .selectAll("svg")
        .remove();
    //声明svg长宽，xy坐标轴长度
    var width = 550;
    var height = 420;
    var xAxisWidth  = 510;
    var yAxisWidth = 400;
    var padding = {top: 10, right: 20, bottom: 10, left: 20};
    //定义画布
    var svg = d3.select("#judicialDataArea")
        .append("svg")
        .attr("width", width)
        .attr("height",height);
    //svg.style("border","solid gray");
    //创建提示框
    var div = d3.select("body").append("div")
        .attr("class", "tooltip4")
        .style("opacity", 0);

    //获取xy的最大值，比例尺根据该值自动调整定义域
    var xDomainMax = d3.max(dataSet4,function (d) {
        return Math.abs(d.x);
    });
    var yDomainMax = d3.max(dataSet4,function (d) {
        return Math.abs(d.y);
    });
    var DomainMax = Math.max(xDomainMax,yDomainMax) * 1.05;
    //定义比例尺
    var xScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([0,xAxisWidth]);
    var yScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([yAxisWidth,0]);

    //定义坐标轴
    var gxAxis = svg.append("g").attr("class", "axis x_axis1")
        .attr("transform","translate(200,200)")
        .attr("transform","translate(" + padding.left + "," + (height - padding.top - yAxisWidth/2) + ")");
    var gyAxis = svg.append("g").attr("class", "axis x_axis1")
        .attr("transform","translate("+(padding.left + xAxisWidth/2)+","+(height - padding.bottom -yAxisWidth)+")");

    //绘制坐标轴
    gxAxis.transition()
        .duration(1000)
        .call(d3.axisBottom(xScale));
    gyAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));

    //获取hexbin的输入
    var inputForHexbinFun = [];
    for (var i = 0; i < dataSet4.length; i++) {
        inputForHexbinFun.push( [xScale(dataSet4[i].x), yScale(dataSet4[i].y)] )
    }

    // Prepare a color palette
    var color = d3.scaleLinear()
        .domain([0, 800]) // Number of points in the bin?
        .range(["transparent",  "#69b3a2"]);

    var hexbin = d3.hexbin()
        .radius(9) // size of the bin in px
        .extent([ [0, 0], [xAxisWidth, yAxisWidth] ]);

    svg.append("g")
        .selectAll("path")
        .data(hexbin(inputForHexbinFun))
        .enter().append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", function(d) { return "translate(" + (padding.left + d.x) + "," + (padding.bottom + d.y) + ")"; })
        .attr("fill", function(d) { return color(d.length * 45); })
        .attr("stroke", "black")
        .attr("stroke-width", "0.1")
        .attr("opacity",0)
        .on("mouseover",function (d) {
            var x = xScale.invert(d.x);
            var y = yScale.invert(d.y);
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(/*"number: " +*/ d.length) //+ "<br/>" + "x:" + x.toFixed(2) + "<br/>" + "y:" + y.toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

            d3.select(this)
                .transition()
                .duration(50)
                .attr("fill","white");
        })
        .on("mouseout",function (d) {
            div.transition()
                .duration(200)
                .style("opacity",0);
            d3.select(this)
                .transition()
                .duration(600)
                .attr("fill",function(d) { return color(d.length * 45); });
        })
        .transition()
        .duration(1000)
        .attr("opacity",1);
}