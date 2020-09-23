const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class AdSenseY extends Component {
    render() {
        // const { title, clientId, slotId } = this.props;
        return <div class="card widget">
            <div class="g-ads-y">
                <div class="card-content">
                        {/* <div class="menu">
                            <h3 class="menu-label">
                                广告位
                            </h3>
                        </div>
                        <br/> */}
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="ca-pub-6343805421927634"
                             data-ad-slot="6639418948"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                        <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
                    </div>
                </div>
        </div>;
    }
}

module.exports = cacheComponent(AdSenseY, 'widget.adsense_y', props => {
    // const { widget, helper } = props;
    // const { client_id, slot_id } = widget;
    // 暂时关闭
    return null;

    return {
        // title: helper.__('widget.adsense'),
        // clientId: client_id,
        // slotId: slot_id
    };
});
