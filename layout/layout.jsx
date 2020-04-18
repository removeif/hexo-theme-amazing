const { Component } = require('inferno');
const Head = require('./common/head');
const Navbar = require('./common/navbar');
const Widgets = require('./common/widgets');
const Footer = require('./common/footer');
const Scripts = require('./common/scripts');
const Search = require('./common/search');
const classname = require('./util/classname');

module.exports = class extends Component {
    render() {
        const { env, site, config, page, helper, body } = this.props;
        const { my_cdn, url_for, __ } = helper;
        const { comment, use_pjax, has_banner } = config;
        // 默认不加载公式，文中头部开启mathJax:true才加载
        var isMath = page.mathJax != undefined && page.mathJax;
        const hasComment = comment != undefined && comment.type != undefined && (comment.type == 'gitalk' || comment.type == 'valine')
            && (comment.has_hot_recommend || comment.has_latest_comment);
        var appKey;
        var appId;
        var userName;
        var userRepo;
        var isValine;

        if (comment != undefined && comment.type != undefined && comment.type == 'gitalk') {
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
        var hotTitle = __('widget.hot_recommend');
        var hotTip = __('widget.hot_recommend_tip');

        // =====index hot_recommend
        var hotRecommendStr =
            `<div class="card widget">
            <div class="card-content">
                <h3 class="menu-label">${hotTitle}</h3><span id="index_hot_div">${hotTip}</span>
            </div>
        </div>`;

        // =====index banner
        var bannerStr =
            `<div class="card widget">
            <div class="card-content1 card-image">
                <span id="banner"><div class="card-content ">Banner ${hotTip}</div></span>
            </div>
        </div>`;

        var pjaxJs = `var pjax = new Pjax({
            elements: "a",//代表点击链接就更新
            selectors: [  //代表要更新的节点
                ".section",
                "title"
            ],
            cache: true,
            cacheBust:false
        })

        function loadBusuanzi(){
        $.getScript("//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js", function () {});
        }

        // 开始 PJAX 执行的函数
        document.addEventListener('pjax:send', function () {
        });
        
        // PJAX 完成之后执行的函数，可以和上面的重载放在一起
        document.addEventListener('pjax:complete', function () {
            $(".section").css({opacity:1});
            if(${hasComment}){
                $.getScript('${my_cdn(url_for('/js/comment-issue-data.js'))}',function(){loadIssueData('${appId}','${appKey}','${userName}','${userRepo}',${isValine});});
            }
            if(${isMath}){
                loadMathJax();
            }
            loadMainJs(jQuery, window.moment, window.ClipboardJS, window.IcarusThemeSettings);
            loadBackTop();
            loadBusuanzi();
            if(typeof loadBanner == 'function'){
                loadBanner();
            }
        });`;

        if (comment == undefined || comment.type == undefined
                || comment.type != 'gitalk'
                || comment.has_hot_recommend == undefined
                || !comment.has_hot_recommend) {
            hotRecommendStr = '';
        }

        var indexTopData = hotRecommendStr;

        const language = page.lang || page.language || config.language;
        const columnCount = Widgets.getColumnCount(config.widgets);
        const hasBanner = has_banner != undefined && has_banner;

        if (indexTopData == '' && hasBanner) {
            indexTopData = bannerStr;
        }

        if(page.path != 'index.html'){
            indexTopData = '';
        }

        return <html lang={language ? language.substr(0, 2) : ''}>
            <Head env={env} site={site} config={config} helper={helper} page={page} />
            <body class={`is-${columnCount}-column has-navbar-fixed-top`}>
                <Navbar config={config} helper={helper} page={page} />
                <script type="text/javascript" src={my_cdn(url_for('/js/theme-setting.js'))}></script>
                <section class="section">
                    <div class="container">
                        <div class="columns">
                            <div class={classname({
                                column: true,
                                'order-2': true,
                                'column-main': true,
                                'is-12': columnCount === 1,
                                'is-8-tablet is-8-desktop is-8-widescreen': columnCount === 2,
                                'is-8-tablet is-8-desktop is-6-widescreen': (page.layout != 'post' && page.layout != 'page') && columnCount === 3,
                                'is-8-tablet is-8-desktop is-9-widescreen': page.layout == 'page' || page.layout == 'post'
                            })} dangerouslySetInnerHTML={{ __html: indexTopData + body }}></div>
                            <Widgets site={site} config={config} helper={helper} page={page} position={'left'} />
                            {page.layout == 'page' || page.layout == 'post' ? null : <Widgets site={site} config={config} helper={helper} page={page} position={'right'} />}
                        </div>
                    </div>
                </section>
                <Footer config={config} helper={helper} />
                <Scripts site={site} config={config} helper={helper} page={page} />
                <Search config={config} helper={helper} />
                {use_pjax ? <script src="https://cdn.jsdelivr.net/npm/pjax@0.2.8/pjax.js"></script> : null}
                {use_pjax ? <script type="text/javascript" dangerouslySetInnerHTML={{ __html: pjaxJs }}></script> : null}
            </body>
        </html>;
    }
};
