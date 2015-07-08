'use strict';

var React = require('react');

var InstanceTitle = React.createClass({
    render: function() {
        return (
            <span>{this.props.title}</span>
        );
    }
});

module.exports = InstanceTitle;