'use strict';

var React = require('react');
var Reflux = require('reflux');

var cx = require('classnames');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var InstanceStore = require('../stores/InstanceStore.jsx');

var InstanceStatus = React.createClass({
    mixins: [Reflux.connect(InstanceStore)],
    render: function() {
        var classes = cx({
            'status-ok': this.state.data.status,
            'status-no': !this.state.data.status
        });

        var key = this.state.data.status === true ? 'text-true' : 'text-false';

        return (
            <div>
                <ReactCSSTransitionGroup transitionName="instance-status" transitionEnterTimeout={300} transitionLeaveTimeout={500}>
                    <span key={key} className={classes}>
                        { this.state.data.status === true ? this.state.data.textTrue :
                            this.state.data.showTextFalse === false ? '' : this.state.data.textFalse
                        }
                    </span>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

module.exports = InstanceStatus;