import './SearchBoxHelp.css';
import React, { Component } from 'react';
import MaterialIcon from 'shared/components/icon/MaterialIcon';
import Tooltip from 'shared/components/tooltip/Tooltip';


export default class SearchBoxHelp extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        const overlay = (
            <div>
                <div>You may use search qualifiers in any combination.</div>

                <ul>
                    <li><code>author:sindresorhus</code> Show or filter results by author</li>
                    <li><code>maintainer:sindresorhus</code> Show or filter results by maintainer</li>
                    <li><code>keywords:gulpplugin</code> Show or filter results by keywords</li>
                    <li><code>not:deprecated</code> Exclude packages that are deprecated, unstable or insecure</li>
                </ul>

                <div>For the complete list of qualifiers, please read the Search API <a href="https://api-docs.npms.io" target="_blank">documentation</a>.</div>
            </div>
        );

        return (
            <div className="search-box-help-component">
                <Tooltip overlayClassName="search-box-help-component-tooltip" placement="top" overlay={ overlay }>
                    <MaterialIcon id="help_outline" className="help" />
                </Tooltip>
            </div>
        );
    }
}
