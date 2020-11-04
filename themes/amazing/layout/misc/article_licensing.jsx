/**
 * A JSX component that renders article licensing block.
 * @module view/misc/article_licensing
 */
const {Component} = require('inferno');
const {cacheComponent} = require('hexo-component-inferno/lib/util/cache');

/**
 * A JSX component that renders article licensing block.
 *
 * @example
 * <ArticleLicensing
 *     title="article title"
 *     link="full article URL"
 *     author="author name"
 *     authorTitle="Author"
 *     createdAt={date}
 *     createdTitle="Posted on"
 *     updatedAt={date}
 *     updatedTitle="Updated on"
 *     licenses={{
 *         'Creative Commons': {
 *             url: 'https://creativecommons.org/'
 *         },
 *         'Attribution 4.0 International': {
 *             icon: 'fab fa-creative-commons-by',
 *             url: 'https://creativecommons.org/licenses/by/4.0/'
 *         },
 *     }}
 *     licensedTitle="Licensed under" />
 */
class ArticleLicensing extends Component {
    render() {
        const {
            title,
            link,
            author,
            author_url,
            authorTitle,
            createdAt,
            createdTitle,
            updatedAt,
            updatedTitle,
            licenses,
            licensedTitle,
        } = this.props;
        return (
            <div class="article-licensing box">
                <div class="licensing-title">
                    {title ? <p>{title}</p> : null}
                    <p>
                        <a href={link}>{link}</a>
                    </p>
                </div>
                <div class="licensing-meta level is-mobile">
                    <div class="level-left">
                        {author ? (
                            <div class="level-item is-narrow">
                                <div>
                                    <h6>{authorTitle}</h6>
                                    <a href={author_url}><p>{author}</p></a>
                                </div>
                            </div>
                        ) : null}
                        {createdAt ? (
                            <div class="level-item is-narrow">
                                <div>
                                    <h6>{createdTitle}</h6>
                                    <p>{createdAt}</p>
                                </div>
                            </div>
                        ) : null}
                        {updatedAt ? (
                            <div class="level-item is-narrow">
                                <div>
                                    <h6>{updatedTitle}</h6>
                                    <p>{updatedAt}</p>
                                </div>
                            </div>
                        ) : null}
                        {licenses && Object.keys(licenses).length ? (
                            <div class="level-item is-narrow">
                                <div>
                                    <h6>{licensedTitle}</h6>
                                    <p>
                                        {Object.keys(licenses).map((name) => (
                                            <a
                                                rel="noopener"
                                                target="_blank"
                                                title={name}
                                                class={licenses[name].icon ? 'icon' : ''}
                                                href={licenses[name].url}>
                                                {licenses[name].icon ? <i class={licenses[name].icon}></i> : name}
                                            </a>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * A JSX component that renders article licensing block.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <ArticleLicensing.Cacheable
 *     config={{
 *         article: {
 *             licenses: {
 *                 'Creative Commons': 'https://creativecommons.org/',
 *                 'Attribution 4.0 International': {
 *                     icon: 'fab fa-creative-commons-by',
 *                     url: 'https://creativecommons.org/licenses/by/4.0/'
 *                 },
 *             }
 *         }
 *     }}
 *     page={page}
 *     helper={{
 *         __: function() {...},
 *         url_for: function() {...}
 *     }} />
 */
ArticleLicensing.Cacheable = cacheComponent(ArticleLicensing, 'misc.articlelicensing', (props) => {
    const {config, page, helper} = props;
    const {licenses} = config.article || {};
    const link = decodeURI(page.permalink);

    const links = {};
    if (licenses) {
        Object.keys(licenses).forEach((name) => {
            const license = licenses[name];
            links[name] = {
                url: helper.url_for(typeof license === 'string' ? license : license.url),
                icon: license.icon,
            };
        });
    }

    return {
        title: page.title,
        link: link,
        author: page.author || config.author,
        author_url:page.author_url || config.url,
        authorTitle: helper.__('article.licensing.author'),
        createdAt: page.date ? helper.date(page.date) : null,
        createdTitle: helper.__('article.licensing.created_at'),
        updatedAt: page.updated ? helper.date(page.updated) : null,
        updatedTitle: helper.__('article.licensing.updated_at'),
        licenses: links,
        licensedTitle: helper.__('article.licensing.licensed_under'),
    };
});

module.exports = ArticleLicensing;