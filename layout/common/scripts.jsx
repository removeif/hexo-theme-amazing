const { Component, Fragment } = require('inferno');
const Plugins = require('./plugins');

module.exports = class extends Component {
    render() {
        const { site, config, helper, page } = this.props;
        const { url_for, cdn, my_cdn } = helper;
        const { external_link, article, comment, has_banner } = config;
        const language = page.lang || page.language || config.language || 'en';
        const hasComment = comment != undefined && comment.type != undefined && (comment.type == 'gitalk' || comment.type == 'valine');
        const isValineComment = comment != undefined && comment.type != undefined && comment.type == 'valine';
        var hasHotRecommend = false;
        var hasBanner = has_banner != undefined && has_banner;
        var appKey;
        var appId;
        var userName;
        var userRepo;
        var isValine;

        if (comment != undefined && comment.type != undefined && comment.type == 'gitalk') {
            hasHotRecommend = comment.has_hot_recommend != undefined && comment.has_hot_recommend;
            appId = comment.client_id;
            appKey = comment.client_secret;
            userName = comment.owner;;
            userRepo = comment.repo;
            isValine = false;
        } else if (comment != undefined && comment.type != undefined && comment.type == 'valine') {
            appId = comment.app_id;
            appKey = comment.app_key;
            userName = comment.owner;
            isValine = true;
        }

        const js = `$.getScript('${my_cdn(url_for('/js/comment-issue-data.js'))}',function(){loadIssueData('${appId}','${appKey}','${userName}','${userRepo}',${isValine});})`;
        let externalLink;
        if (typeof external_link === 'boolean') {
            externalLink = { enable: external_link, exclude: [] };
        } else {
            externalLink = {
                enable: typeof external_link.enable === 'boolean' ? external_link.enable : true,
                exclude: external_link.exclude || []
            };
        }

        let fold = 'unfolded';
        let clipboard = true;
        if (article && article.highlight) {
            if (typeof article.highlight.clipboard !== 'undefined') {
                clipboard = !!article.highlight.clipboard;
            }
            if (typeof article.highlight.fold === 'string') {
                fold = article.highlight.fold;
            }
        }

        const embeddedConfig = `var IcarusThemeSettings = {
            site: {
                url: '${config.url}',
                external_link: ${JSON.stringify(externalLink)}
            },
            article: {
                highlight: {
                    clipboard: ${clipboard},
                    fold: '${fold}'
                }
            }
        };`;


        return <Fragment>
            <script src={cdn('moment', '2.22.2', 'min/moment-with-locales.min.js')}></script>
            <script dangerouslySetInnerHTML={{ __html: `moment.locale("${language}");` }}></script>
            <script dangerouslySetInnerHTML={{ __html: embeddedConfig }}></script>
            {clipboard ? <script src={cdn('clipboard', '2.0.4', 'dist/clipboard.min.js')} defer={true}></script> : null}
            <Plugins site={site} config={config} page={page} helper={helper} head={false} />
            <script src={my_cdn(url_for('/js/toc.js'))} defer={true}></script>
            <script src={my_cdn(url_for('/js/main.js'))} defer={true}></script>
            {isValineComment ? <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script> : null}
            {isValineComment ? <script src="https://cdnjs.loli.net/ajax/libs/valine/1.4.4/Valine.min.js"></script> : null}
            {isValineComment ? <script src={my_cdn(url_for('/js/md5.min.js'))}></script> : null}
            {(hasHotRecommend || !hasBanner) ? null : <script src={my_cdn(url_for('/js/banner.js'))}></script>}
            {hasComment ? <script dangerouslySetInnerHTML={{ __html: js }}></script> : null}
        </Fragment>;
    }
};
