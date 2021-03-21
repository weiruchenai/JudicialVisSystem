var flag = false;
var WIDTH = 400;
var HEIGHT = 300;
var manualPlacement = false;
var placingFinished = false;
var drawCentroids = false;
//定义画布和基本属性
var svg = d3.select("#kmeans svg")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .style('padding', '10px')
    .style('background', '#223344')
    .style('cursor', 'pointer')
    .style('-webkit-user-select', 'none')
    .style('-khtml-user-select', 'none')
    .style('-moz-user-select', 'none')
    .style('-ms-user-select', 'none')
    .style('user-select', 'none')
    .on('click', function() {
        d3.event.preventDefault();
        if (!manualPlacement || placingFinished) {
            step();
        }
    });

//定义按钮和标签的样式
d3.selectAll("#kmeans button")
    .style('padding', '.5em .8em');

d3.selectAll("#kmeans label")
    .style('display', 'inline-block')
    .style('width', '15em');

//定义线段、散点、中心的元素
var lineg = svg.append('g');
var dotg = svg.append('g');
var centerg = svg.append('g');

//定义step执行内容
d3.select("#step")
    .on('click', function() {
        step(); draw();
    });
//run按钮执行内容
d3.select("#run").
on('click', function() { startRun(); });
//restart执行内容
d3.select("#restart")
    .on('click', function() { restart(); draw(); });
//reset执行内容
d3.select("#reset")
    .on('click', function() { init(); draw(); });

var groups_old = [];
var groups = [], //包含dots,color,center,init
    dots = []; //包含x,y,group(),init()
firstRun = true;            //是否第一次运行的flag
var inter;

//开始运行后每0.4秒执行一次step()方法
function startRun() {
    $("#run").prop("disabled", true); //操作结束前run按键不可选中
    $("#step").prop("disabled", true);
    step();
    inter = setInterval(step, 400);
}

function centroids(cb) {
    drawCentroids = (cb.checked);
}

function manual(cb) {
    manualPlacement = (cb.checked);
    init();
}

//step方法，每实际更新一次，需运行两次step，一次更新质心，一次更新簇
function step() {
    d3.select("#restart").attr("disabled", null);
    if (flag) {         //flag为true，则移动质心，并执行draw()函数
        moveCenter();
        draw();
    } else {            //flag为false，则更新簇，并执行draw()函数
        updateGroups();
        draw();
    }
    flag = !flag;
}

//为groups赋初值
function place(i, K, x1, y1) {
    var g = {
        dots: [],
        color: 'hsl(' + (i * 360 / K) + ',100%,50%)',
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

//初始化dots内部的内容
var placed = 0;
function init() {
    $("#step").prop("disabled", manualPlacement);
    $("#run").prop("disabled", manualPlacement);
    clearInterval(inter);
    firstRun = true;
    placed = 0;
    d3.select("#restart").attr("disabled", "disabled");

    var N = parseInt(d3.select('#N')[0][0].value, 10);
    var K = parseInt(d3.select('#K')[0][0].value, 10);
    groups = [];

    if (!manualPlacement) {
        for (var i = 0; i < K; i++) {
            groups.push(place(i, K, Math.random() * WIDTH, Math.random() * HEIGHT));
        }
    } else {
        d3.select("#kmeans svg").on("click", function() {
            if (placed < K && manualPlacement) {
                coords = d3.mouse(this);
                groups.push(place(placed, K, coords[0], coords[1]));
                draw();
                placed++;
                if (placed == (K)) {
                    $("#run").prop("disabled", false);
                    $("#step").prop("disabled", false);
                }
            } else {
                step();
                draw();
            }
        });
    }
    dots = [];
    flag = false;
    dots =/* drawCentroids ? pushCentroids(N, K) :*/ pushRands(N);
    draw();
}

//初始化每个dot
function pushRands(N) {
    dots = [];
    for (i = 0; i < N; i++) {
        var dot = {
            x: Math.random() * WIDTH,
            y: Math.random() * HEIGHT,
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

//初始化每个dot
function pushCentroids(N, K) {
    dots = [];
    for (i = 0; i < K; i++) {
        var cX = Math.random() * WIDTH;
        var cY = Math.random() * HEIGHT;
        var cW = getRandomArbitrary(50,125);
        var cH = getRandomArbitrary(50,125);
        for (j = 0; j < N/K; j++) {
            rX = Math.random() * cW;
            x = cX + ((cX + rX < WIDTH) ? rX : -1 * rX);
            rY = Math.random() * cH;
            y = cY + ((cY + rY < HEIGHT) ? rY : -1 * rY);
            var dot = {
                x: x,/*(Math.random() * WIDTH/K) + cX,*/
                y: y, /*(Math.random() * HEIGHT/K) + cY,*/
                group: undefined
            };
            dot.init = {
                x: dot.x,
                y: dot.y,
                group: dot.group
            };
            dots.push(dot);
        }
    }
    return dots;
}
/* from Mozilla Developer Center */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function restart() {
    $("#step").prop("disabled", false);
    $("#run").prop("disabled", false);
    clearInterval(inter);
    firstRun = true;
    flag = false;
    d3.select("#restart").attr("disabled", "disabled");
    groups.forEach(function(g) {
        g.dots = [];
        g.center.x = g.init.center.x;
        g.center.y = g.init.center.y;
    });

    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        dots[i] = {
            x: dot.init.x,
            y: dot.init.y,
            group: undefined,
            init: dot.init
        };
    }
}


function draw() {
    console.log(dots[0]);

    //画初始的白色圆点
    var circles = dotg.selectAll('circle')
        .data(dots);    //初始化在哪里呢??
    circles.enter()
        .append('circle');
    circles.exit().remove();
    circles
        .transition()
        .duration(500)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', function(d) { return d.group ? d.group.color : '#ffffff'; })
        .attr('r', 5);

    if (dots[0].group) {    //??
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
        updateLine(l.transition().duration(400));
        l.exit().remove();
    } else {
        lineg.selectAll('line').remove();
    }

    var c = centerg.selectAll('path')
        .data(groups);
    //定义绘制簇质心的x样式图案的函数
    var updateCenters = function(centers) {
        centers
            .attr('transform', function(d) { return "translate(" + d.center.x + "," + d.center.y + ") rotate(45)";})
            .attr('fill', function(d,i) { return d.color; })
            .attr('stroke', '#aabbcc');
    };
    c.exit().remove();
    //绘制每个簇质心
    updateCenters(c.enter()
        .append('path')
        .attr('d', d3.svg.symbol().type('cross'))
        .attr('stroke', '#aabbcc'));
    updateCenters(c
        .transition()
        .duration(400));}

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
            var d = Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2);
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

//初始化dots内部内容，并画出初始化后的空白dots点与质心
init(); draw();