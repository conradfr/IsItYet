'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormToggle = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    onToggle: function(e) {
        e.preventDefault();

    },
    render: function() {
        var cx = React.addons.classSet;

        var clFalse = cx({
            'btn': true,
            'btn-danger': !this.state.data.status,
            'active': !this.state.data.status,
            'btn-default': this.state.data.status
        });

        var clTrue = cx({
            'btn': true,
            'btn-success': this.state.data.status,
            'active': !this.state.data.status,
            'btn-default': !this.state.data.status
        });

        return (
            <div className="row">
                <div className="col-md-12">
                    <h4>Toggle the status</h4>
                    <div className="alert alert-info" role="alert">
                        Once clicked the status is instantaneously broadcast to anyone watching your page.
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-4">
                            <div className="btn-group btn-group-justified" role="group" aria-label="toggle">
                                <div className="btn-group" role="group">
                                    <button type="button" className={clFalse}>{ this.state.data.textFalse }</button>
                                </div>
                                <div className="btn-group" role="group">
                                    <button type="button" className={clTrue}>{ this.state.data.textTrue }</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = InstanceFormToggle;