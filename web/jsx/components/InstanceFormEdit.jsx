'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var InstanceFormToggle = require('./InstanceFormToggle.jsx');
var InstanceFormSetup = require('./InstanceFormSetup.jsx');
var InstanceFormEditSide = require('./InstanceFormEditSide.jsx');
var InstanceFormDeleted = require('./InstanceFormDeleted.jsx');

var InstanceFormEdit = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    render: function() {
        return (
            this.state.status.isDeleted === true ? <InstanceFormDeleted /> :
                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        { this.state.status.success.created === true ?
                            <div className="alert alert-success" role="alert">
                                <p><strong>You page has been successfully created!</strong></p>
                                <p><a className="alert-link" target="_blank" href={base_url + 'i/' + this.state.data.publicKey}>Click here to view it</a> (open in a new tab)</p>
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
                        <InstanceFormEditSide />
                    </div>
                </div>
        );
    }
});

module.exports = InstanceFormEdit;