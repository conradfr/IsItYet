'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var InstanceFormCreate = require('./InstanceFormCreate.jsx');
var InstanceFormEdit = require('./InstanceFormEdit.jsx');

var InstanceForm = React.createClass({
    mixins: [Reflux.connectFilter(InstanceFormStore, "isCreated", function(instance) {
        return instance.status.isCreated;
        }
    )],
    render: function() {
        var title = this.state.isCreated === true ? 'Edit your page' : 'Create your page';

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h3>{ title }</h3>
                    </div>
                </div>
                { (this.state.isCreated === true) ? <InstanceFormEdit /> : <InstanceFormCreate /> }
            </div>
        );
    }
});

module.exports = InstanceForm;