'use strict';

var React = require('react');

var InstanceFooterShare = React.createClass({

    render: function() {
        return (
            <div className="social">
                <div className="social-one social-fb">
                    <div className="fb-share-button" data-href={base_url + 'i/' + this.props.publicKey}
                         data-layout="button_count"></div>
                </div>
                <div className="social-one social-tw">
                    <a href="https://twitter.com/share" className="twitter-share-button" data-count="none">Tweet</a>
                </div>
            </div>
        );
    }
});

module.exports = InstanceFooterShare;