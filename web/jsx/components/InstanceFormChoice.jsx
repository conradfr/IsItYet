'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormChoice = React.createClass({
    componentDidMount: function() {
        // React.findDOMNode(this.refs.type).focus();
    },
    getInitialState: function () {
        return InstanceFormStore.getInitialState();
    },
    onChange: function(e) {
        this.setState({
            data: {
                type: e.currentTarget.value
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
                type: this.state.data.type
            }
        });
    },
    render: function() {
        return (
                <form onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <label className="label-header">Choose a type of page</label>
                        <div className="radio">
                            <label>
                                <input type="radio" name="type" ref="type" className="optionsRadios" onChange={this.onChange}
                                       value="boolean" checked={this.state.data.type === 'boolean'} />
                                Boolean
                            </label>
                            <span className="help-block">
                                This type of page has two status (e.g Yes/No) that you toggle when you want and update in real time to anyone watching it.
                            </span>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="type" ref="type" className="optionsRadios" onChange={this.onChange}
                                       value="countdown" checked={this.state.data.type === 'countdown'} />
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
        );
    }
});

module.exports = InstanceFormChoice;