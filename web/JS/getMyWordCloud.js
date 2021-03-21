function getMyWordCloud(d) {
    d3.select("#myFileArea")
        .selectAll("svg")
        .remove();
    var word = d.keyWord.split(" ");
    //var word = d.fileContent.split(" ");
    //.log(word);
    //为每个单词随机分配大小size
    /*var wordWithSize = word.map(function(d) {
        var wordAndRank = d.split("&");
        return {text: wordAndRank[0], size: Math.sqrt(parseFloat(wordAndRank[1])) * 20};
    });*/
    var wordWithSize = word.map(function(d) {
        return {text: d, size: 7 + Math.random() * 20};
    });

    //console.log(wordWithSize);
    var margin = {top: 5, right: 15, bottom: 5, left: 15},
        width = 550 - margin.left - margin.right,
        height = 170 - margin.top - margin.bottom;
    var svg1 = d3.select("#myFileArea").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    //svg1.style("border","solid blue 1px");
    svg1.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        //var color = d3.scaleOrdinal().range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"]);
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

