'use strict';

var React = require('react/addons');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var InstanceStatus = React.createClass({
    text: function() {
        return this.props.status === true ? this.props.textTrue : this.props.textFalse;
    },
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'status-ok': this.props.status,
            'status-no': !this.props.status
        });
        return (
            <div>
                <ReactCSSTransitionGroup transitionName="instance-status" transitionLeave={false}>
                    <span key={this.text()} className={classes}>
                        { this.text() }
                    </span>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

module.exports = InstanceStatus;