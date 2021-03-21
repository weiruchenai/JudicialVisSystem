var circle3;


function getKMeansCluster(category,size) {
    try {//点击聚类前先把所有内容恢复原状
        d3.select("#myFileArea")
            .selectAll("svg")
            .remove();
        d3.select("#judicialFileArea")
            .selectAll("svg")
            .remove();
        circle1.attr("fill","dodgerblue")
            .attr("r",2);
        circle2.attr("fill","dodgerblue")
            .attr("r",2);
    }catch (e) {
        console.log(e);
    }
    var flag = false;
    var xAxisWidth = 510;
    var yAxisWidth = 400;
    var dataSet = circle1.data(); //获取调解数据圆绑定的数据集
    var padding = {top: 10, right: 20, bottom: 10, left: 20};
    var groups = [], //包含dots,color,center,init
        dots = []; //包含x,y,group(),init()
    var inter;
    var iteration = 0;

    //自动根据数据集调整比例尺
    var xDomainMax = d3.max(dataSet,function (d) {return Math.abs(d.x);});
    var yDomainMax = d3.max(dataSet,function (d) {return Math.abs(d.y);});
    var DomainMax = Math.max(xDomainMax,yDomainMax) * 1.05;
    //定义比例尺
    var xScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([0,xAxisWidth]);
    var yScale = d3.scaleLinear()
        .domain([-DomainMax,DomainMax])
        .range([yAxisWidth,0]);

    //创建提示框
    var div = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("opacity", 0);

    //获取画布
    var svg = d3.select("#myDataArea svg");
    //定义线段、散点、中心的元素
    var lineg = svg.append('g');
    var dotg = svg.append('g');
    var centerg = svg.append('g');

    //开始运行后每0.4秒执行一次step()方法
    function startRun() {
        d3.select("#k-means").attr("disabled", "disabled");
        step();
        inter = setInterval(step, 500);
    }

    //step方法，每实际更新一次，需运行两次step，一次更新质心，一次更新簇
    function step() {
            if(iteration < 24) {
                if (flag) {         //flag为true，则移动质心，并执行draw()函数
                    moveCenter();
                    draw();
                } else {            //flag为false，则更新簇，并执行draw()函数
                    updateGroups();
                    draw();
                }
                flag = !flag;
                iteration++;
                //console.log(iteration);
            }else {
                //console.log("iteration = " + iteration + "..." + "聚类完成...");
                return;
            }
    }
    /*e41a1c,377eb8,4daf4a,984ea3,ff7f00,ffff33,a65628,f781bf,999999*/
    /*66c2a5,fc8d62,8da0cb,e78ac3,a6d854,ffd92f,e5c494,b3b3b3*/
    /*8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462,b3de69,fccde5,d9d9d9,bc80bd,ccebc5,ffed6f*/
    var colorList = ["#8dd3c7","#fc8d62","#8da0cb","#e78ac3"];
    //为每个簇group赋初值
    function place(i, x1, y1) {
        var g = {
            dots: [],
            color: colorList[i],
            center: {
                x: x1,
                y: y1
            },
            init: {
                center: {}
            }
        };
        g.init.center = {
            x: g.center.x,
            y: g.center.y
        };
        return g;
    }

    //初始化dots和groups内部的内容
    var placed = 0;
    function init() {
        clearInterval(inter);
        firstRun = true;
        placed = 0;

        var N = dataSet.length;
        var K = 4;
        groups = [];
        //为每次聚类结果一致，使初始center坐标固定
        groups.push(place(0,240,180));
        groups.push(place(1,240,250));
        groups.push(place(2,330,180));
        groups.push(place(3,330,250));
        dots = [];
        flag = false;
        dots = pushRands(N);
        draw();
    }

    //初始化每个dot
    function pushRands(N) {
        dots = [];
        for (i = 0; i < N; i++) {
            var dot = {
                x: padding.left + xScale(dataSet[i].x),
                y: padding.bottom + yScale(dataSet[i].y),
                fileName:dataSet[i].fileName,
                keyWord: dataSet[i].keyWord,
                fileContent: dataSet[i].fileContent,
                group: undefined
            };
            dot.init = {
                x: dot.x,
                y: dot.y,
                group: dot.group
            };
            dots.push(dot);
        }
        return dots;
    }

    function draw() {
        //散点
        circle3 = dotg.selectAll('circle')
            .data(dots);
        circle3.enter()
            .append('circle');
        circle3.exit().remove();
        if(iteration == 0){
            circle3.attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .attr('fill', function(d) { return d.group ? d.group.color : '#ffffff'; })
                .attr('r', 2);
        }else {
            circle3.attr("cursor", "pointer")
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
                    var loop = svg.append("path")
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
                }
                div.transition()
                    .duration(50)
                    .style("opacity", .9);
                div.html("name: " + d.fileName /*+ "<br/>" + "x:" + d.x.toFixed(5)
                            + "<br/>" + "y:" +d.y.toFixed(5)*/)
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
                            .attr("fill", d.group.color)
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
                    //单击后点亮该圆
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("fill","#F63C12")
                        .attr("r",5.2);
                    //单击圆展示文本内容对应词云
                    // 取消上次延时未执行的方法并执行延时
                    clearTimeout(time1);
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
            circle3.transition()
                .duration(400)
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .attr('fill', function(d) { return d.group ? d.group.color : 'dodgerblue'; })
                .attr('r', 2);
        }
        //连线
        if (dots[0].group) {
            var l = lineg.selectAll('line')
                .data(dots);
            //定义画线段的函数，将每个dot与该dot所在group的center连接，color为簇的颜色
            var updateLine = function(lines) {
                lines
                    .attr('x1', function(d) { return d.x; })
                    .attr('y1', function(d) { return d.y; })
                    .attr('x2', function(d) { return d.group.center.x; })
                    .attr('y2', function(d) { return d.group.center.y; })
                    .attr('stroke', function(d) { return d.group.color; });
            };
            updateLine(l.enter().append('line'));
            updateLine(l.transition().duration(500));
            l.exit().remove();
        } else {
            lineg.selectAll('line').remove();
        }
        //质心
        var c = centerg.selectAll('path')
            .data(groups);
        //定义绘制簇质心的x样式图案的函数
        var updateCenters = function(centers) {
            centers
                .attr('transform', function(d) { return "translate(" + d.center.x + "," + d.center.y + ") rotate(45)";})
                .attr('fill', function(d,i) { return d.color; })
                .attr('stroke', '#444444');
        };
        c.exit().remove();
        //绘制每个簇质心
        var symbol = d3.symbol().size([50]);
        updateCenters(c.enter()
            .append('path')
            .attr('d', symbol.type(d3.symbolCross))
            .attr('stroke', '#444444'));
        updateCenters(c
            .transition()
            .duration(500));}

    //移动质心
    function moveCenter() {
        groups.forEach(function(group, i) {
            if (group.dots.length == 0) return; //若未进行过step，则不移动质心
            // get center of gravity
            var x = 0, y = 0;
            group.dots.forEach(function(dot) {
                x += dot.x;
                y += dot.y;
            });
            group.center = {
                x: x / group.dots.length,
                y: y / group.dots.length
            };
        });
    }

//确定每个dot对应的group,以及每个group中存在哪些dots
    function updateGroups() {
        //首先清空每个group内的dots
        groups.forEach(function(g) { g.dots = []; });
        dots.forEach(function(dot) {
            // find the nearest group
            var min = Infinity;
            var group;
            groups.forEach(function(g) {
                var d = Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2); //计算点到质心的距离
                if (d < min) {
                    min = d;
                    group = g;
                }
            });

            // update group
            group.dots.push(dot);
            dot.group = group;
        });
    }

    function getThemeOfCluster(category) {
        var themes = ["簇1", "簇2", "簇3", "簇4"];
        var delay;
        switch (category) {
            case "PersonalInjury" :
                themes = ["邻里 行人 亲属关系 ", "口角 医疗损害 肢体冲突", "纠纷 机动车 争吵 肢体冲突", "宅基地 单车 琐事"];
                delay = 5000;break;
            case "TrafficAccident" :
                themes = ["轿车 碰撞 调解", "客车 摩托车 责任 赔偿", "快递 肢体冲突 伤势", "电瓶车 自行车 验伤"];
                delay = 2500;break;
            case "Inheritance" :
                themes = ["楼房继承 农村 ", "账户存款 宅基地", "现金 继承权 份额", "套房 继承顺序 遗嘱"];
                delay = 9000;break;
            case "Contact" :
                themes = ["租赁 房屋 劳动合同 赔偿", "债务 欠薪 租赁", "亲属 协议 雇佣", "美容 购物 摄影 装修"];
                delay = 8000;break;
            case "Neighborhood" :
                themes = ["漏水 公共场所 装修 维修", "漏水 排水 油烟", "协议 房产权益 房租", "宠物 倒水 通道妨碍"];
                delay = 12000;break;
        }
        var color = d3.scaleOrdinal()
            .domain(themes)
            .range(d3.schemeSet2);
        svg.selectAll("dots")
            .data(themes)
            .enter()
            .append("circle")
            .attr("cx", 420)
            .attr("cy", function(d,i){ return 20 + i * 20})
            .attr("r", 5)
            .attr("opacity",0)
            .style("fill", function(d,i){ return colorList[i]})
            .transition().delay(delay).duration(1500)
            .attr("opacity",1);
        svg.selectAll("labels")
            .data(themes)
            .enter()
            .append("text")
            .attr("x", 435)
            .attr("y", function(d,i){ return 20 + i*20}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d,i){ return colorList[i]})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr("opacity",0)
            .attr("font-size","10px")
            .attr("font-family","Impact")
            .transition().delay(delay).duration(1500)
            .attr("opacity",1);

        }
    
    //获取词频
    function getWordFrequency() {
        var index = 3;
        console.log(groups[index].dots.length);
        console.log(groups[index].center);
        //获取一个簇内的所有词语
        var wordSplitArray = [];
        var wordSplit = [];
        for (var i = 0; i < groups[index].dots.length; i++) {
            wordSplitArray[i] = groups[index].dots[i].keyWord.split(" ");
            wordSplit = wordSplit.concat(wordSplitArray[i]);
        }
        //console.log(wordSplit);

        var words = [];
        //初始化words数组
        for (var i = 0; i < wordSplit.length; i++) {
            var word = {
                word: wordSplit[i],
                frequency: 0
            };
            words.push(word);
        }
        //计算每个词语的频率
        for (var i = 0; i < words.length; i++) {
            for (var j = 0; j < words.length; j++) {
                if(words[i].word === words[j].word) {words[i].frequency++;}
            }
        }

        //冒泡排序，按频率由高到低排序
        try {
            for (var i = 0; i < words.length - 1; i++) {
                for (var j = 0; j < words.length - 1 - i; j++) {
                    if(words[j].frequency > words[j+1].frequency){
                        var temp = word[j];
                        words[j] = words[j+1];
                        words[j+1] = temp;
                    }
                }
            }
        }catch (e) {
            console.log(e);
        }
        //console.log(words);

        var themes1 = [];
        for (var i = 0; i < 4; i++) {
            var themeAndSize = {
                theme: i,
                size: groups[i].dots.length,
                x: groups[i].center.x,
                y: groups[i].center.y
            };
            themes1.push(themeAndSize);
        }

        svg.selectAll("labels")
            .data(themes1)
            .enter()
            .append("text")
            .attr("x",function (d) {return d.x;})
            .attr("y",function (d) {return d.y;})
            .style("fill",function (d,i) {return colorList[i]})
            .text(function (d) {return d.theme;})
            .attr("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .attr("opacity",0)
            .attr("font-size",50)
            .attr("font-family","Impact")
            .attr("mouseover",function () {
                d3.select(this).lower();
            })
            .transition().duration(1500)
            .attr("opacity",0.7);
    }

    //初始化dots内部内容，并绘制初始化后的质心
    init();
    //开始运行
    startRun();
    //显示聚类每个簇的主题
    getThemeOfCluster(category);

/*    switch (category) {
        case "PersonalInjury" :
            setTimeout(getWordFrequency,5000);break;
        case "TrafficAccident" :
            setTimeout(getWordFrequency,2500);break;
        case "Inheritance" :
            setTimeout(getWordFrequency,9000);break;
        case "Contact" :
            setTimeout(getWordFrequency,8000);break;
        case "Neighborhood" :
            setTimeout(getWordFrequency,12000);break;
    }*/


}

