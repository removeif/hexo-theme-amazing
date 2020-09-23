const {Component} = require('inferno');
const {cacheComponent} = require('hexo-component-inferno/lib/util/cache');

class AdSense extends Component {
    render() {
        const {title, clientId, slotId} = this.props;
        return <div class="card widget">
            <div class="g-ads-x">
                <div class="card-content">
                    <div class="menu">
                        <h3 class="menu-label">
                            {title}
                        </h3>
                    </div>
                    <br/>
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-format="auto"
                         data-full-width-responsive="true"
                         data-ad-client={clientId}
                         data-ad-slot={slotId}>
                    </ins>
                    <script
                        dangerouslySetInnerHTML={{__html: '(adsbygoogle = window.adsbygoogle || []).push({});'}}></script>
                </div>
            </div>
        </div>
    }
}

module.exports = AdSense.Cacheable = cacheComponent(AdSense, 'widget.adsense', props => {
    const {helper, config} = props;
    const {adsense_client_id, adsense_slot_id} = config;
    if (!adsense_client_id || !adsense_slot_id) {
        return null;
    }
    return {
        title: helper.__('widget.adsense'),
        clientId: adsense_client_id,
        slotId: adsense_slot_id
    };
});
