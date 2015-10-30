'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormChoice = React.createClass({
    componentDidMount: function() {
        // this.refs.type.focus();
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
        InstanceFormActions.typeSubmitted(this.state.data.type);
    },
    render: function() {
        return (
                <form onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="col-md-12">
                            <fieldset>
                                <legend>Choose a type of page</legend>
                                <div className="well">
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
                                </div>
                                <div className="well">
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
                                <div className="post-well">
                                    <button type="submit" ref="submit" className="btn btn-info pull-right">Choose &raquo;</button>
                                    <div className="clearfix"></div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </form>
        );
    }
});

module.exports = InstanceFormChoice;