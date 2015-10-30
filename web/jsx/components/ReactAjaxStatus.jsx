'use strict';

var React = require('react');
var Reflux = require('reflux');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var ReactAjaxStatus = React.createClass({
    mixins: [Reflux.connectFilter(InstanceFormStore, "status", function(instance) {
            return instance.status;
        }
    )],
    render: function () {
        var okIcon = this.state.status.success[this.props.status] === true ? <span key="ajax-ok" className="glyphicon glyphicon-ok" aria-hidden="true"></span> : [];
        return (
            <div className="ajax-success">
                    <ReactCSSTransitionGroup transitionName="ajax-success" transitionEnterTimeout={300} transitionLeaveTimeout={200}>
                        { okIcon }
                    </ReactCSSTransitionGroup>
                </div>
        );
    }
});

module.exports = ReactAjaxStatus;