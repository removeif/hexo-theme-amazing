const {Component} = require('inferno');
const {cacheComponent} = require('../util/cache');

class AdSenseX extends Component {
    render() {
        // const { title, clientId, slotId } = this.props;
        return <div class="card widget">
            <div class="g-ads-x">
                <div class="card-content">
                    <h3 class="menu-label">
                        温馨提示！此处可能会出现广告！
                    </h3>
                    <br/>
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <ins class="adsbygoogle"
                         style="display:block; text-align:center;"
                         data-ad-layout="in-article"
                         data-ad-format="fluid"
                         data-ad-client="ca-pub-6343805421927634"
                         data-ad-slot="5134765588"></ins>
                    <script
                        dangerouslySetInnerHTML={{__html: '(adsbygoogle = window.adsbygoogle || []).push({});'}}></script>
                </div>
            </div>
        </div>
    }
}

module.exports = cacheComponent(AdSenseX, 'widget.adsense_x', props => {
    // const { widget, helper } = props;
    // const { client_id, slot_id } = widget;

    return {
        // title: helper.__('widget.adsense'),
        // clientId: client_id,
        // slotId: slot_id
    };
});
