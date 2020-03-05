const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class LatestComment extends Component {
    render() {
        const {isReturn} = this.props;

        if (!isReturn) {
            return null
        }

        return <div class="card widget">
            <div class="card-content">
                <h3 class="menu-label">最新评论</h3><span class="body_hot_comment">加载中，最新评论有1分钟延迟...</span>
            </div>
            </div>
    }
}

module.exports = cacheComponent(LatestComment, 'widget.latestcomment', props => {
    const { config } = props;
    const { comment } = config;

    if (comment.type == 'undefined' || comment.type != 'gitalk') {
        return null
    }

    return {
        isReturn:true
    };
});