'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceStore = require('../stores/InstanceStore.jsx');
var InstanceActions = require('../actions/InstanceActions.jsx');

var InstanceTitle = require('./InstanceTitle.jsx');
var InstanceStatus = require('./InstanceStatus.jsx');
var InstanceCountdown = require('./InstanceCountdown.jsx');
var InstanceFooter = require('./InstanceFooter.jsx');

var Instance = React.createClass({
    mixins: [Reflux.connect(InstanceStore)],
    render: function() {
        var components = [];
        if (this.state.status.isDeleted === true) {
            components.push(
                <div key="deleted" className="status-deleted">
                    <div>This page has been deleted.</div>
                    <div><small>(sorry)</small></div>
                </div>
            );
        } else {
            components.push(
                <InstanceStatus key="status" />);

            if (this.state.data.type === 'countdown') {
                components.push(<InstanceCountdown key="countdown" timeLeft={this.state.data.time_left} />);
            }
        }

        return (
            <div className="instance-wrap">
                <div className={"title row"}>
                    <div className="row-content">
                        <InstanceTitle title={this.state.data.title} />
                    </div>
                </div>
                <div className={"status row"}>
                    <div className="row-content">
                        { components }
                    </div>
                </div>
                <InstanceFooter live={this.state.status.live} lastUpdated={this.state.status.lastUpdated} createdBy={this.state.data.createdBy} publicKey={this.state.data.publicKey} />
            </div>
        );
    }
});

module.exports = Instance;