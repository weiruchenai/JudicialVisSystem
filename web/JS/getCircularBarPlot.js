var dataSet5;
function circularBarPlot() {
    $.ajax({
        url: 'categoriesOfGroups.do',
        type: 'get',
        async: false,
        datatype: 'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            dataSet5 = data;
            //alert(dataSet5[0].category + dataSet5[0].number);
        }
    });
    d3.select("#myDataArea")
        .selectAll("svg")
        .remove();
    d3.select("#myFileArea")
        .selectAll("svg")
        .remove();
    d3.select("#judicialDataArea")
        .selectAll("svg")
        .remove();
    d3.select("#judicialFileArea")
        .selectAll("svg")
        .remove();
    //声明svg长宽，xy坐标轴长度
    var width = 550;
    var height = 420;
    var padding = {top: 10, right: 20, bottom: 10, left: 20};
    var innerRadius = 90,
        outerRadius = Math.min(width, height) / 2;   // 外边缘从画布中心到画布边界

    //定义画布
    var svg = d3.select("#myDataArea")
        .append("svg")
        .attr("width", width)
        .attr("height",height);
    //svg.style("border","solid gray 1px");
    var svgG = svg
        .append("g")
        .attr("transform", "translate(" + (width / 2 ) + "," + (height / 2 ) + ")");
/*    console.log(dataSet5.map(function (d) {
        return d.category;
    }));*/

    //创建提示框
    var div = d3.select("body").append("div")
        .attr("class", "tooltip4")
        .style("opacity", 0);

    var x = d3.scaleBand()
        .range([0,2 * Math.PI])
        .align(0)
        .domain(dataSet5.map(function (d) {
            return d.category;
        }));

    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 1193]); // Domain of Y is from 0 to the max seen in the data

    var ybis = d3.scaleRadial()
        .range([innerRadius, 5])   // Domain will be defined later.
        .domain([0, 1193]);

    //添加外部bar
    var outArc1 = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius + 0.01)
        .startAngle(function(d) { return x(d.category); })
        .endAngle(function(d) { return x(d.category) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius);
    var outArc2 = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d.number); })
        .startAngle(function(d) { return x(d.category); })
        .endAngle(function(d) { return x(d.category) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius);
    svgG.append("g")
        .selectAll("path")
        .data(dataSet5)
        .enter()
        .append("path")
        .attr("fill", "#69b3a2")
        .attr("class", "yo")
        //.style("opacity",0)
        .attr("d", outArc1)
        .on("mouseover",function (d) {
            d3.select(this)
                .transition()
                .duration(50)
                .style("stroke","black")
                .style("stroke-width","2");
                //.attr("fill","white");
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html( d.number)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout",function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .style("stroke-width","0");
            div.transition()
                .duration(200)
                .style("opacity",0);
        })
        .transition().duration(500)//.ease(d3.easeElastic)
        //.style("opacity", .9)
        .attr("d", outArc2)
        .delay(function (d,i) {return (i * 50);});

    //添加内部bar
    var inArc1 = d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius( function(d) { return ybis(0) })
        .outerRadius(function(d) { return ybis(0) + 0.01; })
        .startAngle(function(d) { return x(d.category); })
        .endAngle(function(d) { return x(d.category) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius);
    var inArc2 = d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(function(d) { return ybis(0) })
        .outerRadius(function(d) { return ybis(d.number); })
        .startAngle(function(d) { return x(d.category); })
        .endAngle(function(d) { return x(d.category) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius);
    svgG.append("g")
        .selectAll("path")
        .data(dataSet5)
        .enter()
        .append("path")
        .attr("fill", "#f65631")
        //.style("opacity",0)
        .attr("d", inArc1)
        .on("mouseover",function (d) {
            d3.select(this)
                .transition()
                .duration(50)
                .style("stroke","black")
                .style("stroke-width","2");
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html( d.number)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout",function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .style("stroke-width","0");
            div.transition()
                .duration(200)
                .style("opacity",0);
        })
        .transition().duration(500)//.ease(d3.easeElastic)
        .delay(function (d,i) {return (i * 50);})
        //.style("opacity", .9)
        .attr("d", inArc2);

    //添加每个bar文字
    svgG.append("g")
        .selectAll("g")
        .data(dataSet5)
        .enter()
        .append("g")
        .attr("text-anchor", function(d) { return (x(d.category) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.category) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.number)+10) + ",0)"; })
        .append("text")
        .text(function(d){return(d.category)})
        .attr("transform", function(d) { return (x(d.category) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")
        .style("opacity",0)
        .transition()
        .delay(2200)
        .duration(1000)
        .style("opacity", .9);

    //显示中心的大类别
    var themes = [];
    var theme1 = {x: 240, y: 170, text: "消费"};
    var theme2 = {x: 310, y: 170, text: "邻里"};
    var theme3 = {x: 240, y: 260, text: "民事"};
    var theme4 = {x: 310, y: 260, text: "交通"};
    themes.push(theme1);themes.push(theme2);themes.push(theme3);themes.push(theme4);
    svg.append("g")
        .selectAll("g")
        .data(themes)
        .enter()
        .append("text")
        .attr("x", function (d) {return d.x;})
        .attr("y", function (d) { return d.y;})
        .text(function(d){ return d.text;})
        .attr("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .attr("opacity",0)
        .attr("font-size","5px")
        .attr("font-family","MicrosoftYaHei")
        .style("font-weight","bold")
        .transition().delay(3000).duration(1500).ease(d3.easeElastic)
        .attr("font-size","15px")
        .attr("opacity",0.9);
}
