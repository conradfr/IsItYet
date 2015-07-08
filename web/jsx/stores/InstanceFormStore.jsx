'use strict';

var Reflux = require('reflux');

var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormStore = Reflux.createStore({
    listenables: InstanceFormActions,
    init: function(){
        this.listenTo(InstanceFormActions.instanceSubmitted,this.instancePost.bind(this));
    },
    instancePost: function(formData){
        $.ajax({
            url: base_url + 'instance',
            dataType: 'json',
            type: 'POST',
            data: formData,
            success: function(data) {

                // this.setState({data: data});
                console.log('a');

            }.bind(this),
            error: function(xhr, status, err) {

                console.error(this.props.url, status, err.toString());

            }.bind(this)
        });
    },
    getDefaultData: function(){
        return this.instance || {type: 'boolean'};
    }
});

module.exports = InstanceFormStore;