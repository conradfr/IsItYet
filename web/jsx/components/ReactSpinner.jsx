'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var ReactSpinner = React.createClass({
    mixins: [Reflux.connectFilter(InstanceFormStore, "isLoading", function(instance) {
            return instance.status.isLoading;
        }
    )],
    componentDidMount: function () {
        var leftPos = this.props.leftPos || '38%';
        var topPos = this.props.topPos || '24px';

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
            top: topPos, // Top position relative to parent
            left: leftPos, // Left position relative to parent
            position: 'static'
        };
        this.spinner = new Spinner(opts);
        this.spinner.spin(ReactDOM.findDOMNode(this));
        if ((this.state.isLoading === false) || (this.state.isLoading !== this.props.identifier)) {
            this.spinner.stop();
        }
    },
    componentWillUpdate: function(newProps, newState) {
        if (newState.isLoading === false && this.state.isLoading === this.props.identifier) {
            this.spinner.stop();
        } else if (newState.isLoading === this.props.identifier && !this.state.isLoading) {
            this.spinner.spin(ReactDOM.findDOMNode(this));
        }
    },
    componentWillUnmount: function() {
        this.spinner.stop();
    },
    render: function () {
        return (
            <div className="spinner-container"></div>
        );
    }
});

module.exports = ReactSpinner;
