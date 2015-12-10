'use strict';

var React = require('react');

var InstanceConfig = require('../config/InstanceConfig.js');

/**
 * @todo extend momentjs fromNow that doesn't display precise seconds interval, rendering the tic() mostly useless
 */
var InstanceFooterReloadStatus = React.createClass({
    componentDidMount: function() {
        this.timer = false;
    },
    componentWillUpdate: function() {
        if (this.props.live !== true) {
            if (this.timer === false) {
                this.timer = setInterval(this.tic, InstanceConfig.instancePageTic);
            }
        } else {
            clearInterval(this.timer);
            this.timer = false;
        }
    },
    getInitialState: function() {
       return this.getElapsed();
    },
    tic: function() {
        this.setState(this.getElapsed());
    },
    getElapsed: function() {
        if ((this.props.live !== true) && (typeof this.props.lastUpdated !== 'undefined')) {
            return {elapsed: this.props.lastUpdated.fromNow()};
        } else {
            return {};
        }
    },
    reloadText: function() {
        var reloadText = '';

        if (this.props.live === true) {
            reloadText = 'Live update is&nbsp;<span class="reload-status-on">ON</span>';
        }
        else if ((this.props.live !== true) && (typeof this.state.elapsed !== 'undefined'))  {
            reloadText = 'Last updated <span class="reload-status-time">' + this.state.elapsed + '</span>';
        }

        return {__html: reloadText};
    },
    render: function() {
        return (
            <div className="reload-status" dangerouslySetInnerHTML={this.reloadText()}>
            </div>
        );
    },
    componentWillUnmount: function() {
        clearInterval(this.timer);
    }
});

module.exports = InstanceFooterReloadStatus;
