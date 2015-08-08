'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

var ReactSpinner = require('./ReactSpinner.jsx');
var ReactAjaxStatus = require('./ReactAjaxStatus.jsx');
var ReactError = require('./ReactError.jsx');

var DateTimeField = require('react-bootstrap-datetimepicker');
var moment = require('moment');

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
    onDateChange: function(newDate) {
        var oldDate = this.state.data.endAt ? moment(this.state.data.endAt) : moment();
        var momentNewDate = moment(parseInt(newDate));
        oldDate.set({'year': momentNewDate.get('year'), 'month': momentNewDate.get('month'), 'date': momentNewDate.get('date')});
        InstanceFormActions.inputUpdated('endAt', oldDate.toISOString());
    },
    onTimeChange: function(newTime) {
        var oldDate = this.state.data.endAt ? moment(this.state.data.endAt) : moment();
        var momentNewDate = moment(parseInt(newTime));
        oldDate.set({'second': momentNewDate.get('second'), 'minute': momentNewDate.get('minute'), 'date': momentNewDate.get('hour')});
        InstanceFormActions.inputUpdated('endAt', oldDate.toISOString());
    },
    onSubmit: function(e) {
        e.preventDefault();
        InstanceFormActions.instanceSubmitted();
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

        // Is instance still editable (15 minutes limit) ?
        var instanceEditable = true;
        if ((this.state.data.isDemo !== true) && (typeof this.state.data.createdAt !== 'undefined')) {
            var instanceDate = new Date(this.state.data.createdAt);
            var currDate = new Date();
            if (((currDate - instanceDate) / (60 * 1000)) > 15) {
                var instanceEditable = false;
            }
        }

/*        var clInputEditable = cx({
            'form-control': true,
            'has-error': this.state.status.errors.textTrue
        });*/

        var Countdown = null;
        if (this.state.data.type === 'countdown') {

            var clDateTime = cx({
                'form-group': true,
                'has-error': (typeof this.state.status.errors.endAt !== 'undefined')
            });

            var currEndAt = this.state.data.endAt ? moment(this.state.data.endAt) : moment();

            Countdown =
            <div className="row">
                <div className="col-md-6 col-xs-12">
                    <div className={clDateTime}>
                        <label>Date</label>
                        <DateTimeField mode='date' minDate={moment()} inputFormat='MM/DD/YYYY' dateTime={currEndAt} onChange={ this.onDateChange } />
                    </div>
                </div>
                <div className="col-md-6 col-xs-12">
                    <div className={clDateTime}>
                        <label>Time</label>
                        <DateTimeField mode='time' dateTime={currEndAt} inputFormat='h:mm A' onChange={ this.onTimeChange } />
                    </div>
                </div>
            </div>;
        }

        return (
                <form onSubmit={this.onSubmit}>
                    <fieldset disabled={!instanceEditable}>
                    <div className="row">
                        <div className="col-md-12 col-xs-12">
                            <div className="well">
                                <div className={clTitle}>
                                    <label>Title <small>(75 chars max)</small></label>
                                    <input type="text" ref="title" className="form-control" placeholder="Title, question, topic ..."
                                           value={this.state.data.title} onChange={this.onTitleChange}  />
                                    { this.state.status.errors.title ? <p className="help-block">{this.state.status.errors.title}</p> : '' }
                                </div>

                                {Countdown}

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

                        <div className="well">
                            <div className={clCreatedBy}>
                                <label>Created by</label>
                                <input type="text" ref="title" className="form-control" placeholder="Optional"
                                       value={this.state.data.createdBy} onChange={this.onCreatedByChange}  />
                                { this.state.status.errors.createdBy ? <p className="help-block">{this.state.status.errors.createdBy}</p> : '' }
                            </div>
                        </div>
                    </div>
                </div>

                <ReactError identifier="form" />

                <div className="row">
                    <div className="col-md-offset-8 col-md-4 col-xs-12">
                        <div className="pull-right"><button type="submit" ref="submit" className="btn btn-info">Submit</button></div>
                        <ReactAjaxStatus status="updated" />
                        <ReactSpinner identifier="form" />
                    </div>
                </div>
                </fieldset>
            </form>
        );
    }
});

module.exports = InstanceFormSetup;