var valine = new Valine({
    el: '#latest-comment',
    notify: false,
    verify: false,
    app_id: 'xxxx',
    app_key: 'xxxx',
    placeholder: 'just go go...',
    serverURLs: 'https://leancloud.removeif.github.io'
});

// get latest comment
valine.Q('*').limit(20).find().then(function (comments) {
    var resultArr = [];
    for (var i = 0; i < comments.length; i++) {
        var nick = comments[i]._serverData.nick;
        var content = comments[i]._serverData.comment;
        var url = comments[i]._serverData.url;
        var createDate = comments[i]._serverData.insertedAt;
        var link = comments[i]._serverData.link;
        var mail = comments[i]._serverData.mail;
        resultArr.push({
            "content": content,
            "date": createDate,
            "userName": nick,
            "userUrl": link,
            "userAvatar": 'https://gravatar.loli.net/avatar/md5(' + mail + ')?d=mp',
            "url": url
        });
    }
});

// page comment count
valine.Q('/friend/').count().then(function (count) {
    console.log("count = " + count);
});
