const crypto = require('crypto');
const {Component, Fragment} = require('inferno');
const {cacheComponent} = require('hexo-component-inferno/lib/util/cache');

class Gitalk extends Component {
    render() {
        const {
            language,
            id,
            repo,
            owner,
            admin,
            clientId,
            clientSecret,
            createIssueManually = false,
            distractionFreeMode = false,
            pagerDirection = 'last',
            perPage = 10,
            proxy,
            flipMoveOptions,
            enableHotKey,
            jsUrl,
            cssUrl,
            isLocked,
        } = this.props;

        if (!id || !repo || !owner || !admin || !clientId || !clientSecret) {
            return <div class="notification is-danger">
                You forgot to set the <code>owner</code>, <code>admin</code>, <code>repo</code>,
                <code>client_id</code>, or <code>client_secret</code> for Gitalk.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = ` $.getScript('${jsUrl}', function () { 
            var gitalk = new Gitalk({
            language:'${language}',
            id: '${id}',
            repo: '${repo}',
            owner: '${owner}',
            clientID: '${clientId}',
            clientSecret: '${clientSecret}',
            admin: ${JSON.stringify(admin)},
            createIssueManually: ${createIssueManually},
            distractionFreeMode: ${distractionFreeMode},
            perPage: ${perPage},
            pagerDirection: '${pagerDirection}',
            ${proxy ? `proxy: '${proxy}',` : ''}
            ${flipMoveOptions ? `flipMoveOptions: ${JSON.stringify(flipMoveOptions)},` : ''}
            enableHotKey: ${enableHotKey ? !!enableHotKey : true},
            isLocked: ${isLocked}
        })
        gitalk.render('comment-container')});`;
        return <Fragment>
            <div id="comment-container"></div>
            <link rel="stylesheet" href={cssUrl}/>
            <script dangerouslySetInnerHTML={{__html: js}}></script>
        </Fragment>;
    }
}

module.exports = Gitalk.Cacheable = cacheComponent(Gitalk, 'comment.gitalk', props => {
    const {helper, comment} = props;
    const {my_cdn, url_for, __, _get_md5, _get_path_end_str} = helper;

    // FIXME: config name change
    const id = _get_md5(_get_path_end_str(props.page.path, props.page.uniqueId, props.page.title));

    let canComments = props.page.comments;

    return {
        language: comment.language || __('article.comments_language'),
        id,
        repo: comment.repo,
        owner: comment.owner,
        admin: comment.admin,
        clientId: comment.client_id,
        clientSecret: comment.client_secret,
        createIssueManually: comment.create_issue_manually,
        distractionFreeMode: comment.distraction_free_mode,
        pagerDirection: comment.pager_direction,
        perPage: comment.per_page,
        proxy: comment.proxy,
        flipMoveOptions: comment.flip_move_options,
        enableHotKey: comment.enable_hotkey,
        cssUrl: helper.cdn('gitalk', '1.6.0', 'dist/gitalk.css'),
        jsUrl: my_cdn(url_for('/js/gitalk.min.js')),
        isLocked: !canComments,
    };
});
