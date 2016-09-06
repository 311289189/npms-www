import './SearchBox.css';
import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { updateQuery, navigate } from 'shared/state/search/actions';
import { fetch as fetchSuggestions, reset as resetSuggestions } from 'shared/state/search-suggestions/actions';

const placeholderSuggestions = [
    'test',
    'couchdb',
    'test framework',
    'socket',
    'promises',
];

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this._handleWindowKeyDown = this._handleWindowKeyDown.bind(this);
    }

    componentWillMount() {
        this._placeholder = this._getRandomPlaceholder();
        this._inputValue = this.props.initiallyEmpty ? '' : this.props.term;

        window.addEventListener('keydown', this._handleWindowKeyDown);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.term !== this._inputValue) {
            this._inputValue = nextProps.term;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._handleWindowKeyDown);
    }

    render() {
        return (
            <form className="search-box-component" onSubmit={ (e) => this._handleSubmit(e) }>
                <div className="search-input">
                    <Autosuggest
                        id="search-box-autosuggest"
                        suggestions={ this.props.suggestions }
                        getSuggestionValue={ (suggestion) => suggestion.module.name }
                        renderSuggestion={ (suggestion) => this._renderSuggestion(suggestion) }
                        ref={ (ref) => { this._inputEl = ref && ref.input; } }
                        onSuggestionsFetchRequested={ (request) => this._handleSuggestionsFetchRequested(request) }
                        onSuggestionsClearRequested={ () => this._handleSuggestionsClearRequested() }
                        onSuggestionSelected={ (e, selected) => this._handleSuggestionSelected(e, selected) }
                        focusInputOnSuggestionClick={ false }
                        inputProps={ {
                            value: this._inputValue,
                            placeholder: this._placeholder,
                            onChange: (e, { newValue }) => this._handleInputChange(newValue),
                        } }
                        theme={ {
                            container: 'autosuggest-component-container',
                            containerOpen: 'is-open',
                            input: 'autosuggest-component-input',
                            suggestionsContainer: 'autosuggest-component-suggestions-container',
                            suggestionsList: 'autosuggest-component-suggestions-list',
                            suggestion: 'autosuggest-component-suggestion',
                            suggestionFocused: 'is-focused',
                            sectionContainer: 'autosuggest-component-section-container',
                            sectionTitle: 'autosuggest-component-section-title',
                            sectionSuggestionsContainer: 'autosuggest-component-section-suggestions-container',
                        } } />
                    <button ref={ (ref) => { this._buttonEl = ref; } }>
                        <i className="material-icons">search</i>
                    </button>
                </div>
            </form>
        );
    }

    // ---------------------------------------------

    _renderSuggestion(suggestion) {
        return (
            <div className="suggestion">
                { suggestion.highlight ?
                    <div className="suggestion-name ellipsis" dangerouslySetInnerHTML={ { __html: suggestion.highlight } } /> :
                    <div className="suggestion-name ellipsis">{ suggestion.module.name }</div>
                }
                <div className="suggestion-description ellipsis">{ suggestion.module.description }</div>
            </div>
        );
    }

    _getRandomPlaceholder() {
        return `Search modules, like "${placeholderSuggestions[Math.floor(Math.random() * placeholderSuggestions.length)]}"`;
    }

    _handleInputChange(newValue) {
        this.props.dispatch(updateQuery({ term: newValue }));
    }

    _handleSubmit(e) {
        e.preventDefault();
        this._inputEl.blur();  // Ensure keyboard is hidden in mobile
        this.props.dispatch(navigate());
    }

    _handleWindowKeyDown(e) {
        // Skip if `focusOnKeyDown` is not enabled or if something else is already focused
        if (this.props.focusOnKeyDown && !e.target.matches('input,textarea,select')) {
            this._inputEl.focus();
        }
    }

    _handleSuggestionsFetchRequested(request) {
        // TODO: Should we throttle this?
        this.props.dispatch(fetchSuggestions(request.value));
    }

    _handleSuggestionsClearRequested() {
        // TODO: Should we throttle this?
        this.props.dispatch(resetSuggestions());
    }

    _handleSuggestionSelected(e, selected) {
        this.props.dispatch(updateQuery({ term: selected.suggestionValue }));
        this._buttonEl.click();  // Submit the form (calling submit() was not working with react)
    }
}

SearchBox.propTypes = {
    dispatch: PropTypes.func.isRequired,
    term: PropTypes.string.isRequired,
    suggestions: PropTypes.array.isRequired,

    initiallyEmpty: PropTypes.bool,
    focusOnKeyDown: PropTypes.bool,
};

SearchBox.defaultProps = {
    initiallyEmpty: false,
    focusOnKeyDown: false,
};

export default connect((state, ownProps) => ({
    ...ownProps,
    term: state.search.query.term,
    suggestions: state.searchSuggestions.results,
}))(SearchBox);
