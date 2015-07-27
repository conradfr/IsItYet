'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var extend = require("xtend");

var InstanceFormActions = require('../actions/InstanceFormActions.jsx');
var InstanceMixin = require('./InstanceMixin.jsx');

var InstanceFormStore = Reflux.createStore({
    mixins: [InstanceMixin],
    listenables: InstanceFormActions,
    init: function(){
        this.instance = {
            data: {
                type: 'boolean'
            },
            meta: {
                public_key: null,
                write_key: null,
                editLink: null,
                pageLink: null,
                deleteLink: null
            },
            status: {
                step: 1,
                created: false,
                loading: false,
                deleted: false,
                error: false,
                errors: {}
            }
        }
    },
    getInitialState: function () {
        return this.instance;
    },
    stepSubmitted: function(formData){
        formData.status.step++;
        this.updateInstance(formData);
    },
    onInputUpdated: function(inputName, value) {
        this.instance.data[inputName] = value;
    },
    onInstanceSubmitted: function () {
        var newData = {
            status: {
                error : false,
                errors: {},
                loading : true
            }
        };
        this.updateInstance(newData);

        // var dataToSend = deepCopy(this.instance.data);

        $.post(base_url + 'instance', this.instance.data)
            .done(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.completed(data);
            })
            .fail(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.failed(data);
            })
            .always(function () {
                this.instance.status.loading = false;
                this.trigger(this.instance);
            }.bind(this));
    },
    onInstanceSubmittedCompleted: function (data) {
        if (data.status.error === true) {
            this.onInstanceSubmittedFailed(data);
        } else {
            this.updateInstance(data);
        }
    },
    onInstanceSubmittedFailed: function (data) {
        var error = {
            error: true,
            errors: data.responseJSON.status.errors || data.status.errors || {}
        };

        this.instance.status = React.addons.update(this.instance.status, {$merge: error});
        this.trigger(this.instance);
    }
});

module.exports = InstanceFormStore;