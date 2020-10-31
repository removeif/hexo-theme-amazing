const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');
const ArticleLicensing = require('../misc/article_licensing');
const RecommendPosts = require('../widget/recommend_post');
const AdsenseX = require('../widget/ads_x');
/**
 * Get the word count of text.
 */
function getWordCount(content) {
    if (typeof content === 'undefined') {
        return 0;
    }
    content = content.replace(/<\/?[a-z][^>]*>/gi, '');
    content = content.trim();
    return content ? (content.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index, mysite, indexAt } = this.props;
        const { article, plugins, index_show_tags_categories,comment,comment_head_has_ad,article_head_has_ad,index_zero_position_ad,index_ad_positions } = config;
        const { url_for, date, date_xml, __, _p, _get_md5, _get_path_end_str } = helper;

        const language = page.lang || page.language || config.language || 'en';
        const cover = page.thumbnail ? page.thumbnail : null;

        const words = getWordCount(page._content);
        const time = moment.duration((words / 150.0) * 60, 'seconds');
        const timeStr = time.locale(language).humanize().replace('a few seconds', 'fast').replace('hours', 'h').replace('minutes', 'm').replace('seconds', 's').replace('days', 'd');
        const wordsCount = (words / 1000.0).toFixed(1);

        const indexShowTagsCat = index_show_tags_categories == undefined || index_show_tags_categories;
        const lastModified = __('article.last_modified');

        const isPost = page.layout == 'post';

        const isGitalk = comment !== undefined && comment.type !== undefined && comment.type == 'gitalk';
        const showComment = true;//comment !== undefined && comment.type !== undefined && (comment.type == 'gitalk' || comment.type == 'valine');
        var id = _get_md5(_get_path_end_str(page.path, page.uniqueId, page.title));
        var md5Id = id;
        if (!isGitalk) {
            id = "/" + page.path;
            md5Id = _get_md5(id);
        }

        return <Fragment>
            {(indexAt != undefined & indexAt == 0) ? <AdsenseX config={config} display={index_zero_position_ad}/> : null}
            {!index ? <AdsenseX config={config} display={article_head_has_ad}/> : null}
            {/* Main content */}
            <div class="card">
                {/* Thumbnail */}
                {cover ? <div class="card-image">
                    {index ? <a href={url_for(page.link || page.path)} class="image is-7by3">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </a> : <span class="image is-7by3">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </span>}
                </div> : null}
                {/* Metadata */}
                <article class={`card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                    {page.layout !== 'page' ? <div class="article-meta size-small is-uppercase level is-mobile">
                        <div class="level-left">
                            {/* Creation Date */}
                            {/*{page.date && <span class="level-item" dangerouslySetInnerHTML={{*/}
                                {/*__html: _p('article.created_at', `<time dateTime="${date_xml(page.date)}" title="${date_xml(page.date)}">${date(page.date)}</time>`)*/}
                            {/*}}></span>}*/}
                            <i class="far fa-calendar-plus">&nbsp;</i>{date(page.date)}&nbsp;&nbsp;
                            {/* Last Update Date */}
                            {/*{page.updated && <span class="level-item" dangerouslySetInnerHTML={{*/}
                                {/*__html: _p('article.updated_at', `<time dateTime="${date_xml(page.updated)}" title="${date_xml(page.updated)}">${date(page.updated)}</time>`)*/}
                            {/*}}></span>}*/}
                            {/* author */}
                            {page.author ? <span class="level-item"> {page.author} </span> : null}

                            {/* Categories */}
                            {/*{page.categories && page.categories.length ? <span class="level-item">*/}
                                {/*{(() => {*/}
                                    {/*const categories = [];*/}
                                    {/*page.categories.forEach((category, i) => {*/}
                                        {/*categories.push(<a class="link-muted" href={url_for(category.path)}>{category.name}</a>);*/}
                                        {/*if (i < page.categories.length - 1) {*/}
                                            {/*categories.push(<span>&nbsp;/&nbsp;</span>);*/}
                                        {/*}*/}
                                    {/*});*/}
                                    {/*return categories;*/}
                                {/*})()}*/}
                            {/*</span> : null}*/}
                            {showComment ?
                                <a class="commentCountImg" href={`${url_for(page.link || page.path)}#comment-container`}><span class="display-none-class">{id}</span><i class="far fa-comment-dots" />&nbsp;<span class="commentCount" id={md5Id}>99+</span>&nbsp;&nbsp;</a> : null}
                            {/* Read time */}
                            {/*{article && article.readtime && article.readtime === true ? <span class="level-item">*/}
                                {/*{(() => {*/}
                                    {/*const words = getWordCount(page._content);*/}
                                    {/*const time = moment.duration((words / 150.0) * 60, 'seconds');*/}
                                    {/*return `${_p('article.read_time', time.locale(index ? indexLaunguage : language).humanize())} (${_p('article.word_count', words)})`;*/}
                                {/*})()}*/}
                            {/*</span> : null}*/}
                            {article && article.readtime && article.readtime === true ? <span class="level-item">
                                <i class="far fa-clock">&nbsp;</i>{timeStr} &nbsp;<i class="fas fa-pencil-alt">&nbsp;</i>{wordsCount}&nbsp;k
                                </span> : null}
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: _p('plugin.visit_count', '<span id="busuanzi_value_page_pv">0</span>')
                            }}></span> : null}
                        </div>
                        {/*top icon*/}
                        {page.top > 0 ?
                            <div class="pin-icon"><i class="fas fa-thumbtack"></i></div> : null}
                    </div> : null}
                    {/* Title */}
                    <h1 class="title is-3 is-size-4-mobile">
                        {index ? <a class="link-muted" href={url_for(page.link || page.path)}>{page.title}</a> : page.title}
                    </h1>
                    {/* Content/Excerpt */}
                    <div class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                    {index && indexShowTagsCat ? <div class="index-category-tag">
                        {/* categories */}
                        {page.categories && page.categories.length ? <div class="level-item">
                            {(() => {
                                const categories = [];
                                categories.push(<i class="fas fa-folder-open has-text-grey">&nbsp;</i>)
                                page.categories.forEach((category, i) => {
                                    categories.push(<a class="article-more button is-small link-muted index-categories" href={url_for(category.path)}>{category.name}</a>);
                                    if (i < page.categories.length - 1) {
                                        categories.push(<span>&nbsp;</span>);
                                    }
                                });
                                return categories;
                            })()}
                        </div> : null}
                        &nbsp;&nbsp;
                        {/* tags */}
                        {page.tags && page.tags.length ?
                            <div class="level-item">
                                {(() => {
                                    const tags = [];
                                    tags.push(<i class="fas fa-tags has-text-grey">&nbsp;</i>)
                                    page.tags.forEach((tag, i) => {
                                        tags.push(<a class="article-more button is-small link-muted index-tags" href={url_for(tag.path)}>{tag.name}</a>);
                                        if (i < page.tags.length - 1) {
                                            tags.push(<span>&nbsp;</span>);
                                        }
                                    });
                                    return tags;
                                })()}
                            </div> : null}
                        <hr />
                    </div> : null}
                    {/* Licensing block */}
                    {!index && isPost && article && article.licenses && Object.keys(article.licenses)
                        ? <ArticleLicensing.Cacheable page={page} config={config} helper={helper} /> : null}
                    {/* Tags */}
                    {/*{!index && page.tags && page.tags.length ? <div class="article-tags size-small mb-4">*/}
                        {/*<span class="mr-2">#</span>*/}
                        {/*{page.tags.map(tag => {*/}
                            {/*return <a class="link-muted mr-2" rel="tag" href={url_for(tag.path)}>{tag.name}</a>;*/}
                        {/*})}*/}
                    {/*</div> : null}*/}
                    {/* "Read more" button */}
                    {index && page.excerpt ?
                        <div className="level is-mobile is-flex">
                            <div className="level-start">
                                <div className="level-item">
                                    <a className="article-more button is-small size-small"
                                       href={`${url_for(page.link || page.path)}#more`}>{__('article.more')}</a>
                                </div>
                            </div>
                        {/*lastModified updated*/}
                        {page.updated && page.updated > page.date ?
                            <div class="level-start">
                                <div class="level-item has-text-grey is-size-7">
                                    <time datetime={date_xml(page.updated)}><i
                                        class="far fa-calendar-check">&nbsp;{lastModified}&nbsp;</i>{date(page.updated)}
                                    </time>
                                </div>
                            </div> : null
                        }
                    </div> : null}
                    {/*Recommend & Relation post*/}
                    {!index && page.layout == 'post' && mysite !==undefined ? <RecommendPosts.Cacheable config={config} curPost={page} helper={helper} mysite={mysite} /> : null}
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            </div>
            {index && index_ad_positions && (index_ad_positions.indexOf(indexAt) > -1) ? <AdsenseX config={config} display={index_ad_positions != undefined}/> : null}
            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}
            {/* Post navigation */}
            {!index && (page.prev || page.next) ? <nav class="post-navigation mt-4 level is-mobile">
                {page.prev ? <div class="level-start">
                    <a class={`article-nav-prev level level-item${!page.prev ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.prev.path)}>
                        <i class="level-item fas fa-chevron-left"></i>
                        <span class="level-item">{page.prev.title}</span>
                    </a>
                </div> : null}
                {page.next ? <div class="level-end">
                    <a class={`article-nav-next level level-item${!page.next ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.next.path)}>
                        <span class="level-item">{page.next.title}</span>
                        <i class="level-item fas fa-chevron-right"></i>
                    </a>
                </div> : null}
            </nav> : null}
            {!index ? <AdsenseX config={config} display={comment_head_has_ad}/> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
