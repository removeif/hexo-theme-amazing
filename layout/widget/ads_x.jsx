const {Component} = require('inferno');
const {cacheComponent} = require('hexo-component-inferno/lib/util/cache');

class AdSenseX extends Component {
    render() {
        const {clientId, slotId} = this.props;
        return <div class="card widget">
            <div class="g-ads-x">
                <div class="card-content">
                    {/* <div class="menu">
                            <h3 class="menu-label">
                                温馨提示！此处可能会出现广告！
                            </h3>
                        </div>
                        <br/> */}
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <ins class="adsbygoogle"
                         style="display:block; text-align:center;"
                         data-ad-layout="in-article"
                         data-ad-format="fluid"
                         data-ad-client={clientId}
                         data-ad-slot={slotId}></ins>
                    <script
                        dangerouslySetInnerHTML={{__html: '(adsbygoogle = window.adsbygoogle || []).push({});'}}></script>
                </div>
            </div>
        </div>
    }
}

module.exports = cacheComponent(AdSenseX, 'widget.adsense_x', props => {
    const {config, display} = props;
    const {adsense_client_id, adsense_slot_id} = config;
    if (!adsense_client_id || !adsense_slot_id || !display) {
        return null;
    }
    return {
        clientId: adsense_client_id,
        slotId: adsense_slot_id
    };
});
