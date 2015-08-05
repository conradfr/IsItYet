'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
                    <ReactCSSTransitionGroup transitionName="ajax-success">
                        { okIcon }
                    </ReactCSSTransitionGroup>
                </div>
        );
    }
});

module.exports = ReactAjaxStatus;