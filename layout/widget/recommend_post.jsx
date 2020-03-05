const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class RecommendPosts extends Component {
    render() {
        const { title, posts } = this.props;
        var i = 0;
        return <div class="recommend-post">
            <span class="is-size-6 has-text-grey has-mr-7">#&nbsp;{title}</span>
            <br/>
                {posts.map(post => {
                    i++;
                    return <span>&nbsp;&nbsp;{i}.<a href={post.url} class="is-size-6" target="_blank">{post.title}</a><br/></span>
                })}
            </div>
    }
}

module.exports = cacheComponent(RecommendPosts, 'widget.recommendposts', props => {
    const { site, helper } = props;
    const { has_thumbnail, get_thumbnail, url_for, __, date_xml, date } = helper;
    if (!site.posts.length) {
        return null;
    }
    const posts = site.posts.filter((item, index, arr) => item.encrypt != true && item.recommend != undefined && item.recommend > 0).sort('recommend',-1).sort('recommend',-1).limit(5).map(post => ({
        url: url_for(post.link || post.path),
        title: post.title,
        date: date(post.date),
        dateXml: date_xml(post.date),
        thumbnail: has_thumbnail(post) ? get_thumbnail(post) : null,
        categories: post.categories.map(category => ({
            name: category.name,
            url: url_for(category.path)
        }))
    }));
    return {
        posts,
        title: __('widget.recommend_posts'),
    };
});
