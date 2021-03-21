$(function () {
    //滑块部件
    $("#slider").slider({
        range: "min",
        value: 5,
        min: 1,
        max: 10,
        slide: function( event, ui ) {
            //alert(ui.value);
            $( "#size" ).val( ui.value);
        }
    });
    $( "#size" ).val($( "#slider" ).slider( "value"));

    //选择下拉框部件
    $("#classChoose").selectmenu({
        icons: { button: "ui-icon-triangle-1-s" }
    });

    //定义弹窗初始为隐藏，设置长宽
    $( "#dialog1,#dialog2" ).dialog({
        autoOpen: false,
        width: 600,
        height: 250,
        show: {
            effect: "blind",
            duration: 300
        },
        hide: {
            effect: "blind",
            duration: 300
        }
    });

    //初始聚类按钮灰色
    $("#k-means").prop("disabled", true);

});