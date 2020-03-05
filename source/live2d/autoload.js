try {
    $("<link>").attr({href: "/live2d/waifu.css?v=1.4.2", rel: "stylesheet", type: "text/css"}).appendTo('head');
    $('body').append('<div class="waifu"><div class="waifu-tips"></div><canvas id="live2d" class="live2d"></canvas><div class="waifu-tool"><span class="fui-home"></span> <span class="fui-chat"></span> <span class="fui-eye"></span> <span class="fui-user"></span> <span class="fui-photo"></span> <span class="fui-info-circle"></span> <span class="fui-cross"></span></div></div>');
    $.ajax({url: "/live2d/waifu-tips.js?v=1.4.2", dataType:"script", cache: true, success: function() {
        $.ajax({url: "/live2d/live2d.js?v=1.0.5", dataType:"script", cache: true, success: function() {
            /* 可直接修改部分参数 */
            live2d_settings['hitokotoAPI'] = "hitokoto.cn";  // 一言 API
            live2d_settings['modelId'] = 6;                  // 默认模型 ID 1,6
            live2d_settings['modelTexturesId'] = 3;          // 默认材质 ID 6-3,7,2,1-87,1-42,1-2兔子，1-81，1-30羊
            live2d_settings['modelStorage'] = false;         // 不储存模型 ID
            /* 在 initModel 前添加 */
            initModel("/live2d/waifu-tips.json");
        }});
    }});
} catch(err) { console.log("[Error] JQuery is not defined.") }
