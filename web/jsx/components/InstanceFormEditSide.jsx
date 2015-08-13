'use strict';

var React = require('react');
var Reflux = require('reflux');

var cookie = require('react-cookie');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');
var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var ReactSpinner = require('./ReactSpinner.jsx');
var ReactError = require('./ReactError.jsx');

/**
 * @todo move cookie management to a store
 */
var InstanceFormShare = React.createClass({
    mixins: [Reflux.connectFilter(InstanceFormStore, "data", function(instance) {
            return instance.data;
        }
    )],
    componentDidMount: function () {
        cookie.setRawCookie(document.cookie);
        this.setState({isInCookie: this.isInCookie()});
    },
    onDeleteClick: function (e) {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this page ?")) {
            InstanceFormActions.deleteSubmitted();
        }
    },
    onShareClick: function (event) {
        // auto select-all
        event.preventDefault();
        event.target.select();
    },
    isInCookie: function() {
        return (typeof cookie.load('instance[' + this.state.data.publicKey + ']') !== 'undefined');
    },
    onCookieToggle: function(event) {
        if (this.isInCookie() === true) {
            cookie.remove('instance[' + this.state.data.publicKey + ']', '/');
        } else {
            var cookieContent =  this.state.data.writeKey;
            cookieContent += (this.state.data.title.length > 40) ? this.state.data.title.substr(0, 36) + ' ...' : this.state.data.title;

            var expires = new Date();
            expires.setSeconds(expires.getSeconds() + (3600 * 24 * 365));

            cookie.save('instance[' + this.state.data.publicKey + ']', cookieContent, {path: '/', 'expires': expires});
        }

        this.setState({isInCookie: this.isInCookie()});
        InstanceFormStore.refreshDropdown();
    },
    render: function() {
        return (
            <div>
                <fieldset>
                    <legend>Links</legend>
                    <div className="well">
                        <div className="form-group">
                            <label>Public page link</label>
                            <div className="input-group">
                                <input type="text" ref="pagelink" className="form-control" value={base_url + 'i/' + this.state.data.publicKey}  onClick={this.onShareClick}
                                       readOnly/>
                                <span className="input-group-btn">
                                    <a className="btn btn-default pull-right" target="_blank" href={base_url + 'i/' + this.state.data.publicKey} role="button">
                                        <span className="glyphicon glyphicon-share" aria-hidden="true"></span>
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Edit link</label>
                            <input type="text" ref="editlink" className="form-control" value={base_url + 'instance/' + this.state.data.publicKey + '/' + this.state.data.writeKey}  onClick={this.onShareClick}
                                   readOnly/>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" name="cookieToggle" ref="cookietoggle" onChange={this.onCookieToggle}
                                       checked={ this.state.isInCookie } />
                                Save your page link on this computer (top-right menu)
                            </label>
                            <span className="help-block">
                                You should uncheck it if you're on a public computer.
                            </span>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Delete</legend>
                    <div className="well">
                        <ReactError identifier="delete" />
                        <ReactSpinner identifier="delete" leftPos="28%" />
                        <button type="button" className="btn btn-danger center-block" disabled={this.state.data.isDemo === true} onClick={this.onDeleteClick}>Delete this page</button>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Social</legend>
                    <div className="well">
                        <div className="row">
                            <div className="col-md-offset-1 col-md-5 col-xs-offset-1 col-xs-5">
                                <div className="fb-share-button" data-href={base_url + 'i/' + this.state.data.publicKey}
                                     data-layout="button_count"></div>
                            </div>
                            <div className="col-md-offset-1 col-md-5 col-xs-offset-1 col-xs-5">
                                <a href="https://twitter.com/share" className="twitter-share-button" data-count="none">Tweet</a>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }
});

module.exports = InstanceFormShare;