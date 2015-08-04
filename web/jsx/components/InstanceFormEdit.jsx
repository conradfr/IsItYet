'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormToggle = require('./InstanceFormToggle.jsx');
var InstanceFormSetup = require('./InstanceFormSetup.jsx');
var InstanceFormShare = require('./InstanceFormShare.jsx');

var InstanceFormEdit = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    componentDidMount: function() {

    },
    render: function() {
        return (
            <div className="row" >
                <div className="col-md-6">
                    { this.state.status.ajaxSuccess === 'created' ?
                        <div className="alert alert-success" role="alert">
                            <p><strong>You page has been successfully created!</strong></p><p>Save this page url to be able to manage your page later.</p>
                        </div>
                        :'' }

                    { this.state.data.type === 'boolean' ? <InstanceFormToggle /> : '' }
                    <fieldset>
                        <legend>Settings</legend>
                        <div className="row">
                            <div className="col-md-12 col-xs-12">
                                <div className="well" role="alert">You can only modify your page's settings 15 minutes after its creation.</div>
                            </div>
                        </div>
                        <InstanceFormSetup />
                    </fieldset>
                </div>
                <div className="col-md-offset-1 col-md-5 col-xs-12">
                    <InstanceFormShare />
                </div>
            </div>
        );
    }
});

module.exports = InstanceFormEdit;