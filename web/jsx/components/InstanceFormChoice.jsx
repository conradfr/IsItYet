'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormChoice = React.createClass({
    componentDidMount: function() {
        // React.findDOMNode(this.refs.kindof).focus();
    },
    getInitialState: function () {
        return InstanceFormStore.getInitialState();
    },
    onChange: function(e) {
        this.setState({
            data: {
                kindof: e.currentTarget.value
            }
        });
    },
    onSubmit: function(e) {
        e.preventDefault();

        InstanceFormActions.stepSubmitted({
            status: {
                step: 1
            },
            data: {
                kindof: this.state.data.kindof
            }
        });
    },
    render: function() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h3>Create Instance</h3>
                    </div>
                </div>
                <form onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <label className="label-header">Choose a type of instance</label>
                        <div className="radio">
                            <label>
                                <input type="radio" name="kindof" ref="kindof" className="optionsRadios" onChange={this.onChange}
                                       value="boolean" checked={this.state.data.kindof === 'boolean'} />
                                Boolean
                            </label>
                            <span className="help-block">
                                This type of instance has two status (e.g Yes/No) that you toggle when you want and update in real time to anyone watching your page.
                            </span>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="kindof" ref="kindof" className="optionsRadios" onChange={this.onChange}
                                       value="countdown" checked={this.state.data.kindof === 'countdown'} />
                                Countdown
                            </label>
                            <span className="help-block">
                                You choose a date &amp; time. The page has a timer and the status change automatically when it's over.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button type="submit" ref="submit" className="btn btn-info pull-right">Choose &raquo;</button>
                    </div>
                </div>
                </form>
            </div>
        );
    }
});

module.exports = InstanceFormChoice;