/**
 * Utterances comment JSX component.
 * @module view/comment/utterances
 */
const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
/**
 * Utterances comment JSX component.
 *
 * @see https://utteranc.es/
 * @example
 * <Utterances
 *     repo="******"
 *     issueTerm="******"
 *     issueNumber={123}
 *     label="******"
 *     theme="******" />
 */
class Utteranc extends Component {
    render() {
        const { repo, issueTerm, issueNumber, label, theme } = this.props;
        const js = `
        // reference https://tristan.partin.io/blog/2020/4/11/introduction/
        function loadUtterances() {
            var isDark = false;
            if(typeof isNightFun === 'function'){
                isDark = isNightFun() == 'true';
            }
            if($('#comment-container').length > 0){ 
            // remove
            if ($('#comment-container')[0].lastChild != null) {
                if ($('#comment-container')[0].lastChild.nodeName == 'DIV') {
                    $('#comment-container')[0].lastChild.remove();
                }
            }
            const utterancesScript = document.createElement("script");
            utterancesScript.setAttribute("id", "utterances-script");
            utterancesScript.setAttribute("src", "https://utteranc.es/client.js");
            utterancesScript.setAttribute("repo", "${repo}");
            utterancesScript.setAttribute("issue-term", "${issueTerm}");
            utterancesScript.setAttribute("label", "${label}");
            utterancesScript.setAttribute("theme", isDark ? "github-dark" : "${theme}");
            utterancesScript.setAttribute("crossorigin", "anonymous");
            utterancesScript.setAttribute("async", "true");

            const commentsSection = document.getElementById("comment-container");
            commentsSection.appendChild(utterancesScript);
            }
        }
        loadUtterances();
      `;
        if (!repo || (!issueTerm && !issueNumber)) {
            return <div class="notification is-danger">
                You forgot to set the <code>repo</code>, <code>issue_term</code>,
                or <code>issue_number</code> for Utterances.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const config = { repo };
        if (issueTerm) {
            config['issue-term'] = issueTerm;
        } else {
            config['issue-number'] = issueNumber;
        }
        if (label) {
            config.label = label;
        }
        if (theme) {
            config.theme = theme;
        }
        return <div id="comment-container"><script dangerouslySetInnerHTML={{ __html: js }} async={true}></script></div>;
    }
}

/**
 * Cacheable Utterances comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Utterances.Cacheable
 *     comment={{
 *         repo: '******',
 *         issue_term: "******"
 *         issue_number: {123}
 *         label: "******"
 *         theme: "******"
 *     }} />
 */
module.exports = Utteranc.Cacheable = cacheComponent(Utteranc, 'comment.utteranc', props => {
    const { repo, issue_term, issue_number, label, theme } = props.comment;

    return {
        repo,
        issueTerm: issue_term,
        issueNumber: issue_number,
        label,
        theme
    };
});

