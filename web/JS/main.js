var FLAG = 0;

$("#getScatterPlot").click(function () {
    FLAG++;
    //console.log(FLAG);
    var options=$("#classChoose option:selected");  //获取选中的项
    var category = options.val();
    var size = $('#slider').slider("option", "value");
    //alert(category + size);
    //点击更新后，cluster按钮可操作
    if(category !== "AllCategories") {
        $("#k-means").prop("disabled", false);
        $("#density").prop("disabled", true);
        $("#getCircularBarPlot").prop("disabled", true);
        //$("#tab").css("display","none");
    }else {
        $("#density").prop("disabled", false);
        $("#getCircularBarPlot").prop("disabled", false);
        /*$("#tab").show();
        $(function() {
            $( "#myDataArea" ).tabs();
        });*/
    }
    myDataScatter(category,size);
    judicialDataScatter(category,size);
    $( "#checkbox-1" ).checkboxradio( "destroy" );
});

$("#getCircularBarPlot").click(function () {
    circularBarPlot();
});

$("#update").click(function () {
    //更新MyData
    var options=$("#classChoose option:selected");  //获取选中的项
    var category = options.val();
    var size = $('#slider').slider("option", "value");

    //点击更新后，cluster按钮可操作
    if(category !== "AllCategories") {
        $("#k-means").prop("disabled", false);
        $("#density").prop("disabled", true);
        $("#getCircularBarPlot").prop("disabled", true);
        //$("#tab").css("display","none");
    }else {
        $("#density").prop("disabled", false);
        $("#getCircularBarPlot").prop("disabled", false);
        /*$("#tab").show();
        $(function() {
            $( "#myDataArea" ).tabs();
        });*/
    }

    //alert(category);
    myDataScatter(category,size);
    //更新JudicialData
    judicialDataScatter(category);
});

$("#k-means").click(function () {
    var options=$("#classChoose option:selected");  //获取选中的项
    var category = options.val();
    var size = $('#slider').slider("option", "value");
    if(category !== "AllCategories"){
        getKMeansCluster(category,size);
    }
    $("#checkbox-1").show();
});

$("#density").click(function () {
   getHexBinDensity1("AllCategories");
   getHexBinDensity2("AllCategories");
});