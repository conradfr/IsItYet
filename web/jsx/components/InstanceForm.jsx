'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceForm = React.createClass({
    mixins: [Reflux.listenTo(InstanceFormStore,"instanceSubmitted")],
    componentDidMount: function() {
        React.findDOMNode(this.refs.title).focus();
    },
    getInitialState: function() {
        return InstanceFormStore.getDefaultData();
    },

    onTypeChange: function(e) {
        this.setState({type: e.target.value});
    },
    onSubmit: function(e) {
        e.preventDefault();
        InstanceFormActions.instanceSubmitted({
            title: React.findDOMNode(this.refs.title).value,
            type: React.findDOMNode(this.refs.type).value,
            date: React.findDOMNode(this.refs.type).value,
            time: React.findDOMNode(this.refs.type).value,
            first: React.findDOMNode(this.refs.type).value,
            second: React.findDOMNode(this.refs.type).value,
            id: React.findDOMNode(this.refs.type).value
        });
    },
    render: function() {

        var dateTimeOpts = {};
        if (this.state.type !== 'countdown') {
            dateTimeOpts['disabled'] = 'disabled';
        }

        var dateTimeOpts = {};
        if (this.state.type !== 'countdown') {
            dateTimeOpts['disabled'] = 'disabled';
        }

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
                        <label>Type of instance</label>
                        <div className="radio">
                            <label>
                                <input type="radio" name="type" ref="type" className="optionsRadios"
                                       value="boolean" onChange={this.onTypeChange} checked={this.state.type === 'boolean'} />
                                Boolean (e.g "Yes/No")
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="type" ref="type" className="optionsRadios"
                                       value="countdown" onChange={this.onTypeChange} checked={this.state.type === 'countdown'} />
                                Countdown
                            </label>
                        </div>
                    </div>
                    <div className="col-md-5 col-md-offset-1 hidden-xs">
                        <span className="help-block">
                            This parameter can't be changed once the instance created.
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" ref="title" className="form-control" placeholder="Title, question, topic ..."
                                   value={this.state.title} />
                        </div>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="text" ref="date" className="form-control" {...dateTimeOpts} value={this.state.date} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Time</label>
                                    <input type="text" ref="time" className="form-control" {...dateTimeOpts} value={this.state.time} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>First state text</label>
                            <input type="text" ref="first" className="form-control" value={this.state.first} placeholder="Default state text" />
                        </div>

                        <div className="form-group">
                            <label>Second state text</label>
                            <input type="text" ref="second" className="form-control" value={this.state.second} placeholder="Text after countdown is over or boolean is toggled" />
                        </div>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button type="submit" ref="submit" className="btn btn-info">Submit</button>
                    </div>
                </div>
                </form>
            </div>
        );
    }
});

module.exports = InstanceForm;