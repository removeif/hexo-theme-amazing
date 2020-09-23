const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const AdsenseX = require('./ads_x');

class Categories extends Component {


    renderList(categories, showCount,count,isPage) {
        return categories.map(category => {return (count.n++ < 10 || isPage) ?<li>
            <a class="level is-mobile is-marginless" href={category.url}>
                <span class="level-start">
                    <span class="level-item">{category.name}</span>
                </span>
                {showCount ? <span class="level-end">
                    <span class="level-item tag">{category.count}</span>
                </span> : null}
            </a>
            {category.children.length ? <ul class="mr-0">{this.renderList(category.children, showCount,count,isPage)}</ul> : null}
        </li>:null});
    }

    render() {
        const {
            title,
            showCount,
            categories,
            isPage,
            allUrl
        } = this.props;
        var count={n: 0};

        return <Fragment>
            {isPage ? <AdsenseX /> : null}
            <div class="card widget">
                <div class="card-content">
                    <div class="menu">
                        <h3 class="menu-label">{title}</h3>
                        <ul class="menu-list">
                            {this.renderList(categories, showCount,count,isPage)}
                            {count.n >= 10 && !isPage ?
                                <a className="level is-mobile is-marginless" href={allUrl}>
                                    <span className="level-start">
                                        <span className="level-item">查看全部>></span>
                                    </span>
                                </a> : null
                            }
                        </ul>
                    </div>
                </div>
        </div>
        {isPage ? <AdsenseX /> : null}
        </Fragment>
    }
}

module.exports = Categories.Cacheable = cacheComponent(Categories, 'widget.categories', props => {
    // adapted from hexo/lib/plugins/helper/list_categories.js
    const {
        page,
        helper,
        categories = props.site.categories,
        orderBy = 'name',
        order = 1,
        show_current = false,
        show_count = true,
        isPage
    } = props;
    const { url_for, _p } = helper;

    if (!categories || !categories.length) {
        return null;
    }

    let depth = 0;
    try {
        depth = parseInt(props.depth, 10);
    } catch (e) { }

    function prepareQuery(parent) {
        const query = {};

        if (parent) {
            query.parent = parent;
        } else {
            query.parent = { $exists: false };
        }

        return categories.find(query).sort(orderBy, order).filter(cat => cat.length);
    }

    function hierarchicalList(level, parent) {
        return prepareQuery(parent).map((cat, i) => {
            let children = [];
            if (!depth || level + 1 < depth) {
                children = hierarchicalList(level + 1, cat._id);
            }

            let isCurrent = false;
            if (show_current && page) {
                for (let j = 0; j < cat.length; j++) {
                    const post = cat.posts.data[j];
                    if (post && post._id === page._id) {
                        isCurrent = true;
                        break;
                    }
                }
                // special case: category page
                isCurrent = isCurrent || (page.base && page.base.startsWith(cat.path));
            }

            return {
                children,
                isCurrent,
                name: cat.name,
                count: cat.length,
                url: url_for(cat.path)
            };
        });
    }

    return {
        showCount: show_count,
        categories: hierarchicalList(0),
        title: _p('common.category', Infinity),
        allUrl: url_for('/categories/'),
        isPage: isPage
    };
});
