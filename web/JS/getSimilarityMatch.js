function getSimilarityMatch(d,category,size) {
    $.ajax({
        url: 'getSimilarityMatch.do?name=' + d.fileName + '&category=' + category + '&size=' + size,
        type: 'get',
        async: false,
        datatype:'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success:function (data) {
            //每次点击圆先把之前高亮的圆恢复原状
            d3.select("#judicialFileArea")
                .selectAll("svg")
                .remove();
            try {
                if(category === "AllCategories"){
                    circle1.attr("fill","dodgerblue")
                        .attr("r",1);
                    circle2.attr("fill","dodgerblue")
                        .attr("r",1);
                }else {
                    circle1.attr("fill","dodgerblue")
                        .attr("r",2);
                    //console.log("恢复前半径为：" + circle2._groups[0][488].attributes.r.value);
                    circle2.attr("fill","dodgerblue")
                        .attr("r",2);
                    //console.log("恢复后半径为：" + circle2._groups[0][488].attributes.r.value);
                    //console.log(circle2.data());
                    /*松原市中心医院与高庆霞医疗损害责任纠纷二审民事判决书.txt*/
                    for (var i = 0; i < circle2._groups[0].length; i++) {
                        var radius = circle2._groups[0][i].attributes.r.value;
                        if(radius > 2){
                            console.log("index = " + i + "...radius = " + radius);
                        }
                    }
                    circle3.attr("fill", function (d) {return d.group.color ;})
                        .attr("r", 2);
                }
            }catch (e) {
                console.log(e);
            }

            /*for (var i = 0; i < data.length; i++) {
                console.log(data[i].fileName + data[i].similarity);
            }*/
            //console.log(circle2.data());
            //console.log(circle2.data().length);

            index = [];
            function object(number,similarity) {
                this.number = number;
                this.similarity = similarity;
            }
            for (var i = 0; i < circle2.data().length; i++) {
                for (var j = 0; j < data.length; j++) {
                    //若裁决数据中的文件名与获取到的文件名有相同，将对应circle2中圆的索引放入index
                    if(circle2.data()[i].fileName === data[j].fileName) {
                        var obj = new object(i,data[j].similarity);
                        index.push(obj);
                    }
                }
            }
            //console.log(index);

            //遍历index数组，点亮对应的散点
            for (var i = 0; i < index.length; i++) {
                var num = index[i].number;
                var similarity = index[i].similarity.toFixed(6);
                d3.select(circle2._groups[0][num])
                    .transition()
                    .delay(400)
                    .duration(2000)
                    .ease(d3.easeElastic)
                    .attr("id",similarity)
                    .attr("fill","#F63C12")
                    .attr("opacity",0.8)
                    .attr("r",5.2);
            }
        }
    });
}