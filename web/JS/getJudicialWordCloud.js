function getJudicialWordCloud(d) {
    d3.select("#judicialFileArea")
        .selectAll("svg")
        .remove();
    var word = d.keyWord.split(" ");
    //console.log(word);

    //为每个单词随机分配大小size
    var wordWithSize = word.map(function(d) {
        return {text: d, size: 7 + Math.random() * 20};
    });

    //console.log(wordWithSize);
    var margin = {top: 5, right: 15, bottom: 5, left: 15},
        width = 550 - margin.left - margin.right,
        height = 170 - margin.top - margin.bottom;
    var svg1 = d3.select("#judicialFileArea").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    //svg1.style("border","solid blue 1px");
    svg1.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //创建layout，绑定带wordWithSize，设定初始属性，再执行draw绘制
    var angleArray = [ -90, 0, 0, 0, 90];
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(wordWithSize.map(function(d) { return {text: d.text, size: d.size}; }))
        .rotate(function() {
            /*var index = Math.floor(Math.random() * angleArray.length );
            return angleArray[index];*/
            return 0;
        })
        .spiral("rectangular")
        .padding(1)
        .fontSize(function (d) {return d.size;})
        .on("end", draw);
    layout.start();

    function draw(word) {
        var color = d3.scaleOrdinal(d3.schemeSet2);
        var cloud = svg1.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(word)
            .enter().append("text")
            .style("font-size", 1)
            .style("fill",function (d,i)  {return color(i);})
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .text(function(d) { return d.text; });
        var transition = cloud.transition()
            .duration(1000)
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill",function (d,i)  {return color(i);})
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .style("font-weight", "bold")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}