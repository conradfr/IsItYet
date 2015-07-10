'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceStore = require('../stores/InstanceStore.jsx');
var InstanceActions = require('../actions/InstanceActions.jsx');

var InstanceTitle = require('./InstanceTitle.jsx');
var InstanceStatus = require('./InstanceStatus.jsx');
var InstanceCountdown = require('./InstanceCountdown.jsx');

var Instance = React.createClass({
    mixins: [Reflux.connect(InstanceStore)],
    render: function() {
        return (
            <div className="instance-wrap">
                <div className={"title row"}>
                    <div className="row-content">
                        <InstanceTitle title={this.state.title} />
                    </div>
                </div>
                <div className={"status row"}>
                    <div className="row-content">
                        <InstanceStatus status={this.state.status} textFalse={this.state.text_false} textTrue={this.state.text_true} />
                        {this.state.kindof === 'countdown' ? <InstanceCountdown timeLeft={this.state.time_left} /> : ''}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Instance;