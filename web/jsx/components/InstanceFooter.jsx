'use strict';

var React = require('react');

var InstanceFooter = React.createClass({

    render: function() {
        return (
            <div className="footer-instance row">
                    { this.props.createdBy ? <div className="creator">Page created by : <span className="name">{ this.props.createdBy }</span></div> : '' }
                <div className="social">
                    <div className="social-one social-fb">
                        <div className="fb-share-button" data-href={base_url + 'i/' + this.props.publicKey}
                             data-layout="button_count"></div>
                    </div>
                    <div className="social-one social-tw">
                        <a href="https://twitter.com/share" className="twitter-share-button" data-count="none">Tweet</a>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = InstanceFooter;