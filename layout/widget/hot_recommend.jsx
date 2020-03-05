const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class HotRecommend extends Component {
    render() {
        const {isReturn} = this.props;

        if (!isReturn) {
            return null
        }

        return <div class="card widget">
            <div class="card-content">
                <h3 class="menu-label">热门推荐</h3><span id="index_hot_div">加载中，稍等几秒...</span>
            </div>
            </div>
    }
}

module.exports = cacheComponent(HotRecommend, 'widget.hotrecommend', props => {
    const { config,type } = props;
    const { comment } = config;


    if (comment.type == 'undefined' || comment.type != 'gitalk'
        || (type == 'undefined' && !comment.has_latest_comment)
        || (type == 'hot_recommend' && !comment.has_hot_recommend)) {
        return null
    }

    return {
        isReturn:true
    };
});