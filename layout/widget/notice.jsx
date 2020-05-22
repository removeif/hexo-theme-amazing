const { URL } = require('url');
const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Links extends Component {
    render() {
        const { title, contents } = this.props;
        return <div class="card widget">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <ul>
                        {Object.keys(contents).map(key => {
                            return <li>
                                <span>
                                    <span dangerouslySetInnerHTML={{ __html: contents[key] }}></span>
                                </span>
                            </li>;
                        })}
                    </ul>
                </div>
            </div>
        </div>;
    }
}

module.exports = cacheComponent(Links, 'widget.links', props => {
    const { helper, widget } = props;
    if (!Object.keys(widget.contents).length) {
        return null;
    }
    return {
        title: helper.__('widget.notice'),
        contents: widget.contents
    };
});
