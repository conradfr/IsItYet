'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormChoice = require('./InstanceFormChoice.jsx');
var InstanceFormSetup = require('./InstanceFormSetup.jsx');

var InstanceForm = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    componentDidMount: function() {

    },
    render: function() {
        return (
            (this.state.status.step) === 1 ? <InstanceFormChoice /> : <InstanceFormSetup />
        );
    }
});

module.exports = InstanceForm;