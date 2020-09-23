const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
class Valine extends Component {
    render() {
        const {
            appId,
            appKey,
            notify,
            verify,
            placeholder,
            avatar = 'mm',
            avatarForce = false,
            meta = ['nick', 'mail', 'link'],
            pageSize = 10,
            visitor = false,
            highlight = true,
            recordIp = false,
            path,
            lang,
            enableQQ = true,
            requiredFields,
        } = this.props;
        if (!appId || !appKey) {
            return <div class="notification is-danger">
                You forgot to set the <code>app_id</code> or <code>app_key</code> for Valine.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `var valine = new Valine({
            el: '#comment-container' ,
            notify: ${notify},
            verify: ${verify},
            appId: '${appId}',
            appKey: '${appKey}',
            placeholder: '${placeholder}',
            avatar: '${avatar}',
            avatarForce: ${avatarForce},
            meta: ${JSON.stringify(meta)},
            pageSize: ${pageSize},
            visitor: ${visitor},
            highlight: ${highlight},
            recordIP: ${recordIp},
            path:'${path}',
            lang:'${lang}',
            enableQQ:${enableQQ},
            requiredFields:${JSON.stringify(requiredFields)}
        });`;
        return <Fragment>
            <div id="comment-container" class="content"></div>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = Valine.Cacheable = cacheComponent(Valine, 'comment.valine', props => {
    const { comment, page } = props;

    return {
        appId: comment.app_id,
        appKey: comment.app_key,
        notify: comment.notify,
        verify: comment.verify,
        placeholder: comment.placeholder,
        avatar: comment.avatar,
        avatarForce: comment.avatar_force,
        meta: comment.meta,
        pageSize: comment.page_size,
        visitor: comment.visitor,
        highlight: comment.highlight,
        recordIp: comment.record_ip,
        path: "/" + page.path,
        lang: comment.lang || __('article.comments_language'),
        requiredFields: comment.required_fields,
    };
});
