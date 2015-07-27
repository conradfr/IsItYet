'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var InstanceFormChoice = require('./InstanceFormChoice.jsx');
var InstanceFormSetup = require('./InstanceFormSetup.jsx');

var InstanceFormCreate = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    render: function() {
        return (
            (this.state.status.step) === 1 ? <InstanceFormChoice /> : <InstanceFormSetup />
        );
    }
});

module.exports = InstanceFormCreate;