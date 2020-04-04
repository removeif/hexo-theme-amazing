const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Gallery extends Component {
    render() {
        const { head, jsUrl, lightGallery, justifiedGallery } = this.props;
        if (head) {
            return <Fragment>
                <link rel="stylesheet" href={lightGallery.cssUrl} />
                <link rel="stylesheet" href={justifiedGallery.cssUrl} />
            </Fragment>;
        }
        return <Fragment>
            <script src={lightGallery.jsUrl} defer={true}></script>
            <script src={justifiedGallery.jsUrl} defer={true}></script>
        </Fragment>;

    }
}

module.exports = cacheComponent(Gallery, 'plugin.gallery', props => {
    const { head, helper, config } = props;
    const { url_for, my_cdn } = helper;
    const { lightgallery_is_full } = config;
    const galleryJsUrl = (lightgallery_is_full != undefined && lightgallery_is_full) ? 'dist/js/lightgallery-all.min.js' : 'dist/js/lightgallery.min.js';
    return {
        head,
        lightGallery: {
            jsUrl: helper.cdn('lightgallery', '1.6.12', `${ galleryJsUrl }`),
            cssUrl: helper.cdn('lightgallery', '1.6.12', 'dist/css/lightgallery.min.css')
        },
        justifiedGallery: {
            jsUrl: helper.cdn('justifiedGallery', '3.7.0', 'dist/js/jquery.justifiedGallery.min.js'),
            cssUrl: helper.cdn('justifiedGallery', '3.7.0', 'dist/css/justifiedGallery.min.css')
        }
    };
});
