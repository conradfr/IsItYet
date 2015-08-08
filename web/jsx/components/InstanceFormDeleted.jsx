'use strict';

var React = require('react');

var InstanceFormDeleted = React.createClass({
    componentDidMount: function() {

    },
    render: function() {
        return (
            <div className="row" >
                <div className="col-md-6">
                    <div className="alert alert-success" role="alert">
                        <p><strong>You page has been successfully deleted.</strong></p>
                    </div>

                    <p><a href={base_url + 'instance'}>Create a new one</a></p>
                </div>
            </div>
        );
    }
});

module.exports = InstanceFormDeleted;