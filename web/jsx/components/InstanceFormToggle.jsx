'use strict';

var React = require('react');
var Reflux = require('reflux');

var ReactSpinner = require('./ReactSpinner.jsx');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormToggle = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    onChange: function(e) {
        var newState = this.state;
        newState.data.status = e.currentTarget.value === 'true';
        this.setState(newState);
    },
    onSubmit: function(e) {
        e.preventDefault();
        InstanceFormActions.statusSubmitted(this.state.data.status);
    },
    render: function() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <fieldset>
                            <legend>Status</legend>
                            <div className="well">
                                <div className="radio radio-status">
                                    <label>
                                        <input type="radio" name="status" ref="status" onChange={this.onChange}
                                               value={false} checked={this.state.data.status === false} />
                                        { this.state.data.textFalse }
                                    </label>
                                </div>
                                <div className="radio radio-status">
                                    <label>
                                        <input type="radio" name="status" ref="status" onChange={this.onChange}
                                               value={true} checked={this.state.data.status === true} />
                                        { this.state.data.textTrue }
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
                { this.state.status.errors.formStatus ?
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-danger" role="alert">{this.state.status.errors.formStatus}</div>
                        </div>
                    </div>
                    : '' }
                <div className="row">
                    <div className="col-md-offset-10 col-md-2 col-xs-12">
                        <ReactSpinner text="status" loading={this.state.status.isLoading}/>
                        <button type="submit" ref="submit" className="btn btn-info pull-right">Update</button>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = InstanceFormToggle;