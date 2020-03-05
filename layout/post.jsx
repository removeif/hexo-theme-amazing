const { Component } = require('inferno');
const Article = require('./common/article');

module.exports = class extends Component {
    render() {
        const { config, page, helper ,site } = this.props;

        return <Article config={config} page={page} helper={helper} site={site} index={false} />;
    }
};
