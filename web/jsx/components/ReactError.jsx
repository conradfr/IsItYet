'use strict';

var React = require('react');
var Reflux = require('reflux');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var ReactError = React.createClass({
    mixins: [Reflux.connectFilter(InstanceFormStore, "errors", function(instance) {
            return instance.status.errors;
        }
    )],
    render: function () {
        var errorAlert = this.state.errors[this.props.identifier] ?
            <div className="row" key={"ajax-err-" + this.props.identifier}>
                <div className="col-md-12 col-xs-12">
                <div className="alert alert-danger" role="alert">{this.state.errors[this.props.identifier]}</div>
                </div>
            </div>
            : null;

        return (
            <div className="ajax-error">
                <ReactCSSTransitionGroup transitionName="ajax-error" transitionEnterTimeout={300} transitionLeaveTimeout={500}>
                    {  errorAlert }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

module.exports = ReactError;