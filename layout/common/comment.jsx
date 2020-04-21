const logger = require('hexo-log')();
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __ } = helper;
        const { comment } = config;

        if (!comment || typeof comment.type !== 'string') {
            return null;
        }
        const isGitalk = comment.type == 'gitalk';
        const commentColsed = !page.comments;
        
        return <div class="card">
            <div class="card-content">
                {!commentColsed ? <h3 class="title is-5">{__('article.comments')}</h3> : null}
                {(() => {
                    try {
                        if (isGitalk || !commentColsed) {
                            const Comment = require('../comment/' + comment.type);
                            return <Comment config={config} page={page} helper={helper} comment={comment} />;
                        } else {
                            return <Fragment>
                                <div id="comment-container">
                                    <div class="gt-container">
                                        <div class="menu-label has-text-centered">{__('article.comments_closed')}</div>
                                    </div>
                                </div>
                            </Fragment>;
                        }
                    } catch (e) {
                        logger.w(`Icarus cannot load comment "${comment.type}"`);
                        return null;
                    }
                })()}
            </div>
        </div>;
    }
};
