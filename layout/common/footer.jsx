const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Footer extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            siteYear,
            author,
            links,
            showVisitorCounter,
            url_for,
            my_cdn,
            side_music_netease_id,
            websiteStartTime,
            footerCopyrightDsec,
            registeredNo
        } = this.props;

        return <footer class="footer">
            <div class="container">
                <div class="level">
                    <div class="level-start">
                        <a class="footer-logo is-block mb-2" href={siteUrl}>
                            {logo && logo.text ? logo.text : <img src={logoUrl} alt={siteTitle} height="28" />}
                        </a>
                        <p class="size-small">
                            <span dangerouslySetInnerHTML={{ __html: `&copy; ${siteYear} ${author || siteTitle}` }}></span>
                            &nbsp;&nbsp;Powered by <a href="https://hexo.io/" target="_blank">Hexo</a> & <a
                                href="https://github.com/ppoffice/hexo-theme-icarus" target="_blank">Icarus</a>,Modify by <a href="https://github.com/removeif/hexo-theme-amazing" target="_blank">removeif</a>&nbsp;
                            <br />
                            {registeredNo ? <span>&copy; {registeredNo}<br /></span> : null}
                            {footerCopyrightDsec ? <span>&copy; 版权说明：[本网站所有内容均收集于互联网或自己创作,<br />&nbsp;&nbsp;&nbsp;&nbsp;方便于网友与自己学习交流，如有侵权，请<a href={url_for('/message')} target="_blank">留言</a>，立即处理]<br /></span> : null}
                            {websiteStartTime ? <span>
                                <script type="text/javascript" src={my_cdn(url_for('/js/statistics.js'))}></script>
                                <script dangerouslySetInnerHTML={{ __html: `var now = new Date();setInterval("createTime('${websiteStartTime}')", 250,"");` }}></script>
                                <span id="statistic-times">网站运行时间统计加载中...</span>
                                <br />
                            </span> : null}
                            {showVisitorCounter ? <div class="size-small"><span id="busuanzi_container_site_uv">
                                ❤️感谢<strong>&nbsp;<span id="busuanzi_value_site_uv">99+</span>&nbsp;</strong>
                            </span>小伙伴的
                                <strong>&nbsp;<span id="busuanzi_value_site_pv">99+</span>&nbsp;</strong>次光临！❤️</div> : null}
                        </p>
                    </div>
                    <div class="level-end">
                        {Object.keys(links).length ? <div class="field has-addons">
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <p class="control">
                                    <a class={`button is-transparent ${link.icon ? 'is-large' : ''}`} target="_blank" rel="noopener" title={name} href={link.url}>
                                        {link.icon ? <i class={link.icon}></i> : name}
                                    </a>
                                </p>;
                            })}
                        </div> : null}
                        {side_music_netease_id ?
                        <div class="sideMusic">
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css" />
                            <script src={my_cdn(url_for('/js/APlayer.min.js'))}></script>
                            <script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
                            <meting-js style="width: auto;height: 2000px;"
                                server="netease"
                                type="playlist"
                                id={side_music_netease_id}
                                theme="#2980b9"
                                loop="all"
                                autoplay="false"
                                order="list"
                                storageName="aplayer-setting"
                                lrctype="0"
                                list-max-height="400px"
                                fixed="true"
                            >
                            </meting-js>
                        </div> : null}
                    </div>
                </div>
            </div>
        </footer>;
    }
}

module.exports = cacheComponent(Footer, 'common.footer', props => {
    const { config, helper } = props;
    const { url_for, _p, date, my_cdn } = helper;
    const { logo, title, author, footer, plugins, side_music_netease_id, website_start_time, footer_copyright_dsec, footer_registered_no, busuanzi_only_count } = config;

    const links = {};
    if (footer && footer.links) {
        Object.keys(footer.links).forEach(name => {
            const link = footer.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        url_for: url_for,
        websiteStartTime: website_start_time,
        footerCopyrightDsec: footer_copyright_dsec,
        registeredNo: footer_registered_no,
        my_cdn: my_cdn,
        logo,
        logoUrl: url_for(logo),
        siteUrl: url_for('/'),
        siteTitle: title,
        siteYear: date(new Date(), 'YYYY'),
        author,
        links,
        side_music_netease_id,
        showVisitorCounter: plugins && plugins.busuanzi === true && (busuanzi_only_count != undefined && !busuanzi_only_count),
        visitorCounterTitle: _p('plugin.visitor', '<span id="busuanzi_value_site_uv">0</span>')
    };
});
