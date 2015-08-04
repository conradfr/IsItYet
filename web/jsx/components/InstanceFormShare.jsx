'use strict';

var React = require('react');
var Reflux = require('reflux');

var InstanceFormStore = require('../stores/InstanceFormStore.jsx');

var InstanceFormShare = React.createClass({
    mixins: [Reflux.connect(InstanceFormStore)],
    onShareClick: function (event) {
        // auto select-all
        event.preventDefault();
        event.target.select();
    },
    render: function() {
        return (
            <div>
                <fieldset>
                    <legend>Links</legend>
                    <div className="well">
                        <div className="form-group">
                            <label>Page link</label>
                            <input type="text" ref="pagelink" className="form-control" value={base_url + 'i/' + this.state.data.publicKey}  onClick={this.onShareClick}
                                   readOnly/>
                        </div>
                        <div className="form-group">
                            <label>Edit link</label>
                            <input type="text" ref="editlink" className="form-control" value={base_url + 'instance/' + this.state.data.publicKey + '/' + this.state.data.writeKey}  onClick={this.onShareClick}
                                   readOnly/>
                            <span className="help-block">
                            <strong>Save this link !</strong> ... or you won't be able to manage your page.
                            </span>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Social</legend>
                        <div className="social">
                            <div className="social-one social-fb">
                                <div className="fb-share-button" data-href={base_url + 'i/' + this.state.data.publicKey}
                                     data-layout="button_count"></div>
                            </div>
                            <div className="social-one social-tw">
                                <a href="https://twitter.com/share" className="twitter-share-button" data-count="none">Tweet</a>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                </fieldset>
            </div>
        );
    }
});

module.exports = InstanceFormShare;