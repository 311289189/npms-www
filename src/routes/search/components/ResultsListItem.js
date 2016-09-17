import './ResultsListItem.css';
import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { Link } from 'react-router';
import ago from 's-ago';
import { uniq } from 'lodash';
import Gravatar from 'react-gravatar';
import PackageScore from 'shared/components/package-score/PackageScore';
import MaterialIcon from 'shared/components/icon/MaterialIcon';
import SvgIcon from 'shared/components/icon/SvgIcon';

class ListItem extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const isDeprecated = this.props.flags ? this.props.flags.indexOf('deprecated') !== -1 : false;

        return (
            <li className={ `results-list-item ${isDeprecated ? 'is-deprecated' : ''}` }>
                <div className="headline">
                    <a href={ this.props.package.links.repository || this.props.package.links.npm } target="_blank"
                        className="name ellipsis">{ this.props.package.name }</a>
                    <span className="version ellipsis">({ this.props.package.version })</span>

                    { isDeprecated ? <span className="deprecated">deprecated</span> : '' }

                    <PackageScore score={ this.props.score } />
                </div>

                { this.props.package.description ?
                    <div className="description ellipsis">{ this.props.package.description }</div> :
                    '' }

                { this._renderKeywords() }

                { this._renderPublisherInfo() }

                <div className="links">
                    <a className="tonic-link" href={ `https://tonicdev.com/npm/${encodeURIComponent(this.props.package.name)}` }
                        target="_blank" title="Try this package in Tonic">
                        <SvgIcon id={ SvgIcon.tonic } />
                    </a>
                    <a className="npm-link" href={ this.props.package.links.npm } target="_blank" title="View this package in npmjs.org">
                        <SvgIcon id={ SvgIcon.npm } />
                    </a>
                </div>

            </li>
        );
    }

    _renderKeywords() {
        const keywords = uniq(this.props.package.keywords);  // Remove duplicates because we use keywords as React keys
        const keywordsCount = keywords && keywords.length;

        if (!keywordsCount) {
            return '';
        }

        return (
            <div className="keywords ellipsis">
                <MaterialIcon id="local_offer" />
                { keywords.map((keyword, index) =>
                    <span className="keyword" key={ keyword }>
                        <Link to={ `/search?q=${encodeURIComponent(keyword)}` }>{ keyword }</Link>
                        { index < keywordsCount - 1 ? ', ' : '' }
                    </span>
                ) }
            </div>
        );
    }

    _renderPublisherInfo() {
        const hasPublisher = !!(this.props.package.publisher && this.props.package.publisher.username);
        const hasDate = !!(this.props.package.date);

        if (!hasPublisher && !hasDate) {
            return '';
        }

        return (
            <div className="publish-info">
                <span>updated </span>
                { hasDate ? <span className="date">{ ago(new Date(this.props.package.date)) }</span> : '' }

                { hasPublisher ? <span> by </span> : '' }
                { hasPublisher ? <a href={ `https://npmjs.com/~${encodeURIComponent(this.props.package.publisher.username)}` }
                    target="_blank" className="publisher-name ellipsis">{ this.props.package.publisher.username }</a> : '' }
                { hasPublisher ? <span className="publisher-avatar">
                    <Gravatar size={ 20 } email={ this.props.package.publisher.email || 'n/a' } https
                        onLoad={ (e) => this._onGravatarLoad(e) } /></span> : '' }
            </div>
        );
    }

    _onGravatarLoad(e) {
        e.target.style.opacity = '1';
    }
}

ListItem.propTypes = {
    package: PropTypes.object.isRequired,
    flags: PropTypes.array,
    score: PropTypes.object.isRequired,
};

export default ListItem;
