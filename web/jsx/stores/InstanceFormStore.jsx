'use strict';

var Reflux = require('reflux');
var extend = require("xtend");

var InstanceFormActions = require('../actions/InstanceFormActions.jsx');

var InstanceFormStore = Reflux.createStore({
    listenables: InstanceFormActions,
    init: function(){
        this.instance = {
            data: {
                kindof: 'boolean'
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
                errorText: null
            }
        }
    },
    getInitialState: function () {
        return this.instance;
    },
    stepSubmitted: function(formData){
        this.instance = extend(this.instance, formData);
        this.instance.status.step++;
        this.trigger(this.instance);
    },
    onInstanceSubmitted: function () {
        this.instance.status.error = false;
        this.instance.status.errorText = null;
        this.instance.status.loading = true;
        this.trigger(this.instance);

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
            this.instance = React.addons.update(this.instance, {$merge: data});
            this.trigger(this.instance);
        }
    },
    onInstanceSubmittedFailed: function (data) {
        var error = {
            error: true,
            errorText: data.responseJSON.status.errorText || data.status.errorText || "An error occurred; please try again later."
        };

        this.instance.status = React.addons.update(this.instance.status, {$merge: error});
        this.trigger(this.instance);
    }
});

module.exports = InstanceFormStore;