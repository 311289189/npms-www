import './NotFound.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from 'shared/containers/header/Header';
import { markAsLoading, unmarkAsLoading } from 'shared/state/app/actions';

class NotFound extends Component {
    componentWillMount() {
        this.props.dispatch(markAsLoading());
        setTimeout(() => this.props.dispatch(unmarkAsLoading()), 10);
    }

    render() {
        return (
            <div className="page page-not-found">
                <Header appearance="menu-only" />

                This will be the 404 page.
            </div>
        );
    }
}

NotFound.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect()(NotFound);
