'use strict';

var React = require('react');

var InstanceFooterReloadStatus = require('./InstanceFooterReloadStatus.jsx');
var InstanceFooterShare = require('./InstanceFooterShare.jsx');

var InstanceFooter = React.createClass({

    render: function() {
        return (
            <div className="footer-instance row">
                { this.props.createdBy ? <div className="creator">Page created by : <span className="name">{ this.props.createdBy }</span></div> : '' }
                <InstanceFooterReloadStatus live={this.props.live} lastUpdated={this.props.lastUpdated} />
                <InstanceFooterShare publicKey={this.props.publicKey} />
            </div>
        );
    }
});

module.exports = InstanceFooter;