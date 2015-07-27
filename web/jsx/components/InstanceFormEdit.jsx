'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormToggle = require('./InstanceFormToggle.jsx');

var InstanceFormEdit = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    componentDidMount: function() {

    },
    render: function() {
        return (
            <div className="container">
                { (this.state.data.type) === 'boolean' ? <InstanceFormToggle /> : '' }
            </div>
        );
    }
});

module.exports = InstanceFormEdit;