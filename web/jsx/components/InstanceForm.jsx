'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormCreate = require('./InstanceFormCreate.jsx');
var InstanceFormEdit = require('./InstanceFormEdit.jsx');

var InstanceForm = React.createClass({
    //mixins: [Reflux.connect(InstanceFormStore)],
    mixins: [Reflux.connectFilter(InstanceFormStore, "created", function(instance) {
        return instance.status.created;
        }
    )],
    componentDidMount: function() {

    },
    render: function() {
        var title = this.state.created === true ? 'Edit your page' : 'Create your page';

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h3>{ title }</h3>
                    </div>
                </div>
                { (this.state.created === true) ? <InstanceFormEdit /> : <InstanceFormCreate /> }
            </div>
        );
    }
});

module.exports = InstanceForm;