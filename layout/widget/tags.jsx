const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const AdsenseX = require('./ads_x');

class Tags extends Component {
    render() {
        const {
            tags,
            title,
            showCount,
            isPage,
            allUrl
        } = this.props;
        var count = 0;

        return <Fragment>
            {isPage ? <AdsenseX /> : null}
            <div class="card widget">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <div class="field is-grouped is-grouped-multiline">
                        {tags.sort((a, b)=> b.count-a.count).map(tag => { return (count++ < 20 || isPage)?<div class="control">
                            <a class="tags has-addons" href={tag.url}>
                                <span class="tag">{tag.name}</span>
                                {showCount ? <span class="tag is-grey-lightest">{tag.count}</span> : null}
                            </a>
                        </div>:null})}
                    </div>
                    {!isPage && count >= 20 ?
                        <div className="field is-grouped is-grouped-multiline">
                            <a className="tags has-addons" href={allUrl}>
                                <span className="tag">查看全部>></span>
                            </a>
                        </div> : null
                    }
                </div>
            </div>
        </div>
        {isPage ? <AdsenseX /> : null}
        </Fragment>
    }
}

module.exports = Tags.Cacheable = cacheComponent(Tags, 'widget.tags', props => {
    // adapted from hexo/lib/plugins/helper/list_tags.js
    const {
        helper,
        orderBy = 'name',
        order = 1,
        amount,
        show_count = true,
        isPage
    } = props;
    let tags = props.tags || props.site.tags;
    const { url_for, _p } = helper;

    if (!tags || !tags.length) {
        return null;
    }

    tags = tags.sort(orderBy, order).filter(tag => tag.length);
    if (amount) {
        tags = tags.limit(amount);
    }

    return {
        showCount: show_count,
        title: _p('common.tag', Infinity),
        tags: tags.map(tag => ({
            name: tag.name,
            count: tag.length,
            url: url_for(tag.path)
        })),
        isPage,
        allUrl: url_for('/tags/')
    };
});
