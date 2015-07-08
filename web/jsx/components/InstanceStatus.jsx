'use strict';

var React = require('react/addons');

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
            <div className={classes}>{this.text()}</div>
        );
    }
});

module.exports = InstanceStatus;