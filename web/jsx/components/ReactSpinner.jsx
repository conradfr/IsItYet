'use strict';

var React = require('react');

var ReactSpinner = React.createClass({
    componentDidMount: function () {
        var opts = {
            lines: 7, // The number of lines to draw
            length: 3, // The length of each line
            width: 4, // The line thickness
            radius: 3, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#FFFFFF', // #rgb or #rrggbb or array of colors
            speed: 1.3, // Rounds per second
            trail: 50, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '54%', // Top position relative to parent
            left: '90px' // Left position relative to parent
        };
        this.spinner = new Spinner(opts);
        this.spinner.spin(React.findDOMNode(this));
        if ((this.props.loading === false) || (this.props.loading !== this.props.text)) {
            this.spinner.stop();
        }
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.loading === false && this.props.loading) {
            this.spinner.stop();
        } else if (newProps.loading === this.props.text && !this.props.loading) {
            this.spinner.spin(React.findDOMNode(this));
        }
    },
    componentWillUnmount() {
        this.spinner.stop();
    },
    render: function () {
        return (
            <div className="spinner-container"></div>
        );
    }
});

module.exports = ReactSpinner;