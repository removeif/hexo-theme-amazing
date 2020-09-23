const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class LatestComment extends Component {
    render() {
        const { isReturn, title, tip } = this.props;

        if (!isReturn) {
            return null
        }

        return <div class="card widget">
            <div class="card-content">
                <h3 class="menu-label">{title}</h3><span class="body_hot_comment">{tip}</span>
            </div>
        </div>
    }
}

module.exports = cacheComponent(LatestComment, 'widget.latestcomment', props => {
    const { config, helper } = props;
    const { __ } = helper;
    const { comment } = config;

    if (comment == undefined || comment.type == undefined || (comment.type != 'gitalk' && comment.type != 'valine')
        || !comment.has_latest_comment) {
        return null
    }

    return {
        isReturn: true,
        title: __('widget.latest_comment'),
        tip: __('widget.latest_comment_tip')
    };
});