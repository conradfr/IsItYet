'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

var ReactSpinner = require('./ReactSpinner.jsx');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormSetup = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    componentDidMount: function() {
        React.findDOMNode(this.refs.title).focus();
    },
    /**
     * @todo Look into Immutable & ReactLink alternatives to reduce duplicate code
     */
    inputChange: function(inputName, event) {
        var newState = this.state.data;
        newState[inputName] = event.target.value;
        this.setState({data: newState}); // avoid cursor mismanagement, https://github.com/spoike/refluxjs/issues/43
        InstanceFormActions.inputUpdated(inputName, event.target.value);
    },
    onTitleChange: function(event) {
        this.inputChange('title', event);
    },
    onCreatedByChange: function(event) {
        this.inputChange('createdBy', event);
    },
    onTextFalseChange: function(event) {
        this.inputChange('textFalse', event);
    },
    onTextTrueChange: function(event) {
        this.inputChange('textTrue', event);
    },
    onDateChange: function(event) {
        this.inputChange('date', event);
    },
    onTimeChange: function(event) {
        this.inputChange('time', event);
    },
    onSubmit: function(e) {
        e.preventDefault();

        var formData = {
            title: React.findDOMNode(this.refs.title).value,
            textFalse: React.findDOMNode(this.refs.textFalse).value,
            textTrue: React.findDOMNode(this.refs.textTrue).value
        };

        if (this.state.data.type === 'countdown') {
            formData.date = React.findDOMNode(this.refs.date).value;
            formData.time = React.findDOMNode(this.refs.time).value;
        }

        InstanceFormActions.instanceSubmitted(formData);
    },
    render: function() {
        //has-error
        var cx = React.addons.classSet;

        var clTitle = cx({
            'form-group': true,
            'has-error': this.state.status.errors.title
        });

        var clCreatedBy = cx({
            'form-group': true,
            'has-error': this.state.status.errors.createdBy
        });

        var clTextFalse = cx({
            'form-group': true,
            'has-error': this.state.status.errors.textFalse
        });

        var clTextTrue = cx({
            'form-group': true,
            'has-error': this.state.status.errors.textTrue
        });

        var Countdown = null;
        if (this.state.data.type === 'countdown') {

            var clDateTime = cx({
                'form-group': true,
                'has-error': (typeof this.state.status.errors.endAt !== 'undefined')
            });

            Countdown =
            <div className="row">
                <div className="col-md-6 col-xs-12">
                    <div className="row">
                        <div className="col-md-6 col-xs-12">
                            <div className={clDateTime}>
                                <label>Date</label>
                                <input type="text" ref="date" className="form-control" value={this.state.data.date} />
                            </div>
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <div className={clDateTime}>
                                <label>Time</label>
                                <input type="text" ref="time" className="form-control" value={this.state.data.time} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        }

        return (
                <form onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        <div className={clTitle}>
                            <label>Title</label>
                            <input type="text" ref="title" className="form-control" placeholder="Title, question, topic ..."
                                   value={this.state.data.title} onChange={this.onTitleChange}  />
                            { this.state.status.errors.title ? <p className="help-block">{this.state.status.errors.title}</p> : '' }
                        </div>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>

                {Countdown}

                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        <div className={clTextFalse}>
                            <label>First state text</label>
                            <input type="text" ref="textFalse" className="form-control" value={this.state.data.textFalse} placeholder="Text before countdown is over or status is updated (default: NO)" onChange={this.onTextFalseChange} />
                            { this.state.status.errors.textFalse ? <p className="help-block">{this.state.status.errors.textFalse}</p> : '' }
                        </div>

                        <div className={clTextTrue}>
                            <label>Second state text</label>
                            <input type="text" ref="textTrue" className="form-control" value={this.state.data.textTrue} placeholder="Text after countdown is over or boolean is toggled (default: YES)" onChange={this.onTextTrueChange} />
                            { this.state.status.errors.textTrue ? <p className="help-block">{this.state.status.errors.textTrue}</p> : '' }
                        </div>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>
                    <hr />
                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        <div className={clCreatedBy}>
                            <label>Created by</label>
                            <input type="text" ref="title" className="form-control" placeholder="Optional"
                                   value={this.state.data.createdBy} onChange={this.onCreatedByChange}  />
                            { this.state.status.errors.createdBy ? <p className="help-block">{this.state.status.errors.createdBy}</p> : '' }
                        </div>
                    </div>
                    <div className="col-md-6 col-xs-12">

                    </div>
                </div>
                    <hr />
                <div className="row">
                    <div className="col-md-offset-4 col-md-2 col-xs-12">
                        <ReactSpinner loading={this.state.status.loading}/>
                        <button type="submit" ref="submit" className="btn btn-info pull-right">Submit</button>
                    </div>
                </div>
                </form>
        );
    }
});

module.exports = InstanceFormSetup;