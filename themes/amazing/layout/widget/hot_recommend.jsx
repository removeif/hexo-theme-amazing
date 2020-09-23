const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class HotRecommend extends Component {
    render() {
        const { isReturn, title, tip } = this.props;

        if (!isReturn) {
            return null
        }

        return <div class="card widget">
            <div class="card-content">
                <h3 class="menu-label">{title}</h3><span id="index_hot_div">{tip}</span>
            </div>
        </div>
    }
}

module.exports = cacheComponent(HotRecommend, 'widget.hotrecommend', props => {
    const { config, helper } = props;
    const { __ } = helper;
    const { comment } = config;

    if (comment == undefined || comment.type == undefined || comment.type == 'undefined' || comment.type != 'gitalk'
        || !comment.has_hot_recommend) {
        return null
    }

    return {
        isReturn: true,
        title: __('widget.hot_recommend'),
        tip: __('widget.hot_recommend_tip')
    };
});