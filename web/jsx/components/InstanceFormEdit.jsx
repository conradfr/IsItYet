'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormToggle = require('./InstanceFormToggle.jsx');
var InstanceFormDeleted = require('./InstanceFormDeleted.jsx');
var InstanceFormSetup = require('./InstanceFormSetup.jsx');
var InstanceFormShare = require('./InstanceFormShare.jsx');

var ReactSpinner = require('./ReactSpinner.jsx');
var ReactError = require('./ReactError.jsx');

var InstanceFormEdit = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    onDeleteClick: function (e) {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this page ?")) {
            InstanceFormActions.deleteSubmitted();
        }
    },
    render: function() {
        return (
            this.state.status.isDeleted === true ? <InstanceFormDeleted /> :
                <div className="row">
                    <div className="col-md-6">
                        { this.state.status.success.created === true ?
                            <div className="alert alert-success" role="alert">
                                <p><strong>You page has been successfully created!</strong> <a target="_blank" href={base_url + 'i/' + this.state.data.publicKey}>View it (new tab)</a></p>
                                <p>Save this page url to be able to manage your page later.</p>
                            </div>
                            :'' }

                        { this.state.data.type === 'boolean' ? <InstanceFormToggle /> : '' }
                        <fieldset>
                            <legend>Settings</legend>
                            { this.state.data.isDemo === true ? '' :
                                <div className="row">
                                    <div className="col-md-12 col-xs-12">
                                        <div className="well" role="alert">You can only modify your page's settings 15 minutes after its creation.</div>
                                    </div>
                                </div> }
                            <InstanceFormSetup />
                        </fieldset>
                    </div>
                    <div className="col-md-offset-1 col-md-5 col-xs-12">
                        <fieldset>
                            <legend>Delete</legend>
                            <div className="well">
                                <ReactError identifier="delete" />
                                <ReactSpinner identifier="delete" leftPos="28%" />
                                <button type="button" className="btn btn-danger center-block" disabled={this.state.data.isDemo === true} onClick={this.onDeleteClick}>Delete this page</button>

                            </div>
                        </fieldset>
                        <InstanceFormShare />
                    </div>
                </div>
        );
    }
});

module.exports = InstanceFormEdit;