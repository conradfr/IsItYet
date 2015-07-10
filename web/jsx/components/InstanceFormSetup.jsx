'use strict';

var React = require('react');
var Reflux = require('reflux');

var ReactSpinner = require('./ReactSpinner.jsx');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormSetup = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    componentDidMount: function() {
        React.findDOMNode(this.refs.title).focus();
    },
    onSubmit: function(e) {
        e.preventDefault();

        var formData = {
            title: React.findDOMNode(this.refs.title).value,
            text_false: React.findDOMNode(this.refs.text_false).value,
            text_true: React.findDOMNode(this.refs.text_true).value
        };

        if (this.state.data.kindof === 'countdown') {
            formData.date = React.findDOMNode(this.refs.date).value;
            formData.time = React.findDOMNode(this.refs.time).value;
        }

        InstanceFormActions.instanceSubmitted(formData);
    },
    render: function() {
        var Countdown = null;
        if (this.state.data.kindof === 'countdown') {
            Countdown =
            <div className="row">
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Date</label>
                                <input type="text" ref="date" className="form-control" value={this.state.data.date} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Time</label>
                                <input type="text" ref="time" className="form-control" value={this.state.data.time} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">

                </div>
            </div>;
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
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" ref="title" className="form-control" placeholder="Title, question, topic ..."
                                   value={this.state.data.title} />
                        </div>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>

                {Countdown}

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>First state text</label>
                            <input type="text" ref="text_false" className="form-control" value={this.state.data.text_false} placeholder="Text before countdown is over or status is updated (default: NO)" />
                        </div>

                        <div className="form-group">
                            <label>Second state text</label>
                            <input type="text" ref="text_true" className="form-control" value={this.state.data.text_true} placeholder="Text after countdown is over or boolean is toggled (default: YES)" />
                        </div>
                    </div>
                    <div className="col-md-6">

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ReactSpinner loading={this.state.status.loading}/>
                        <button type="submit" ref="submit" className="btn btn-info pull-right">Submit</button>

                        {this.state.status.error === true ?
                            <div className="alert alert-danger" role="alert"><strong
                                dangerouslySetInnerHTML={{__html: this.state.status.errorText}}/></div>
                            : <div></div> }
                    </div>
                </div>
                </form>
            </div>
        );
    }
});

module.exports = InstanceFormSetup;