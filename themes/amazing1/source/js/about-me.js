// author by removef
// https://removeif.github.io/
// $(function () { // 获取一句诗
//     $.post("https://api.gushi.ci/all.json", {}, function (data, status) {
//         var htmlC = "<blockquote>" + data.origin + "<br>\"" + data.content + "\"<br>–" + data.author + "</blockquote>";
//         $("#poetry-container-time").append("<p>" + new Date().Format("yyyy.MM.dd/hh:mm:ss") + "</p>" + htmlC);
//     })
// });

$(function () { // 获取记录数据
    $.getJSON("../json_data/record.json", function (data) {
        $.each(data, function (i, e) {
            var html = '<li class="time-axis-item">' +
                '<div class="time-axis-date">' + e.date + '<span></span></div>' +
                '<div class="time-axis-title">' + e.title + '</div>' +
                '<p class="time-axis-achievement">' + e.achievement + '</p>' +
                '</li>';
            $('.time-axis').append(html);
        });
    })
});

