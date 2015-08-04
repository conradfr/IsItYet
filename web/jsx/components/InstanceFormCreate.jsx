'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var InstanceFormChoice = require('./InstanceFormChoice.jsx');
var InstanceFormSetup = require('./InstanceFormSetup.jsx');

var InstanceFormCreate = React.createClass({
    mixins: [Reflux.connectFilter(InstanceFormStore, "isTypeChosen", function(instance) {
            return instance.status.isTypeChosen;
        }
    )],
    render: function() {
        return (
            <div className="row" >
                <div className="col-md-6">
                    { this.state.isTypeChosen === true ? <InstanceFormSetup /> : <InstanceFormChoice /> }
                </div>
            </div>
        );
    }
});

module.exports = InstanceFormCreate;