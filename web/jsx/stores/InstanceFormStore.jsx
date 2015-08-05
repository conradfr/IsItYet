'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

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
            status: {
                isTypeChosen: false,
                isStatusUpdated: false,
                isCreated: false,
                isLoading: false,
                isDeleted: false,
                hasErrors: false,
                errors: {},
                success: {}
            }
        };

        if (typeof instanceData !== 'undefined') {
            this.updateInstance(instanceData);
        }

        window.onpopstate = function(event) {
            console.log(this.state);
            this.instance = event.state;
            this.trigger(this.instance);
        }.bind(this);
    },
    getInitialState: function () {
        return this.instance;
    },
    onTypeSubmitted: function(type){
        window.history.pushState(this.instance,'');
        this.instance.data.type = type;
        this.instance.status.isTypeChosen = true;
        window.history.pushState(this.instance,'');
        this.trigger(this.instance);
    },
    onInputUpdated: function(inputName, value) {
        this.instance.data[inputName] = value;
    },
    onStatusSubmitted: function (newStatus) {
        var newData = {
            data: {
                status: newStatus
            },
            status: {
                hasErrors : false,
                errors: {},
                success: {},
                isLoading : "status"
            }
        };
        this.updateInstance(newData);

        $.post(base_url + 'instance/status/' + this.instance.data.publicKey + '/' + this.instance.data.writeKey, '{"status": ' + this.instance.data.status + '}')
            .done(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.completed(data, 'formStatus');
            })
            .fail(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.failed(data, 'formStatus');
            })
            .always(function () {
                this.instance.status.isLoading = false;
                this.trigger(this.instance);
            }.bind(this));
    },
    onDeleteSubmitted: function (newStatus) {
        var newData = {
            status: {
                hasErrors : false,
                errors: {},
                success: {},
                isLoading : "delete"
            }
        };
        this.updateInstance(newData);

        $.get(base_url + 'instance/delete/' + this.instance.data.publicKey + '/' + this.instance.data.writeKey)
            .done(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.completed(data, 'delete');
            })
            .fail(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.failed(data, 'delete');
            })
            .always(function () {
                this.instance.status.isLoading = false;
                this.trigger(this.instance);
            }.bind(this));
    },
    onInstanceSubmitted: function () {
        var newData = {
            status: {
                hasErrors : false,
                errors: {},
                isLoading : "form",
                ajaxSuccess: null
            }
        };
        this.updateInstance(newData);

        var url = this.instance.status.isCreated === true ? '/' + this.instance.data.publicKey + '/' + this.instance.data.writeKey : '';

        $.post(base_url + 'instance' + url, this.instance.data)
            .done(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.completed(data);
            })
            .fail(function (data, status, headers) {
                InstanceFormActions.instanceSubmitted.failed(data);
            })
            .always(function () {
                this.instance.status.isLoading = false;
                this.trigger(this.instance);
            }.bind(this));
    },
    onInstanceSubmittedCompleted: function (data, name) {
        if (name === undefined) {
            name = 'form';
        }

        if ((typeof data.status.hasErrors !== 'undefined') && (data.status.hasErrors === true)) {
            this.onInstanceSubmittedFailed(data);
        } else {
            var formIsCreated = this.instance.status.isCreated;

            this.updateInstance(data);

            // Newly created instance ?
            if ((name === 'form') && (formIsCreated === false) && (this.instance.status.isCreated === true)) {
                this.instance.status.success.created = true;
                window.history.pushState(this.instance,'', base_url + 'instance/' + this.instance.data.publicKey + '/' + this.instance.data.writeKey);
                this.trigger(this.instance);
            }
            // Instance update ?
            else if ((name === 'form') && (formIsCreated === true)) {
                this.instance.status.success.updated = true;
                this.trigger(this.instance);
                setTimeout(function(){
                    this.instance.status.success.updated = false;
                    this.trigger(this.instance);
                }.bind(this), 2000);
            }
            // Status update ?
            else if (name === 'formStatus') {
                this.instance.status.success.status = true;
                    this.trigger(this.instance);
                setTimeout(function(){
                    this.instance.status.success.status = false;
                    this.trigger(this.instance);
                }.bind(this), 2000);
            }
            // Status update ?
            else if (name === 'delete') {
                this.instance.status.isDeleted = true;
                this.trigger(this.instance);
            }
        }
    },
    onInstanceSubmittedFailed: function (data, name) {
        if (name === undefined) {
            name = 'form';
        }

        var errors;

        if ((typeof data.responseJSON !== 'undefined') && (typeof data.responseJSON.status !== 'undefined')) {
            errors = data.responseJSON.status.errors || data.status.errors;
        }

        if (!errors) {
            var errorObject = new Object;
            errorObject[name] = "An error occurred, please try again later.";
            errors = errorObject;
        }

        var error = {
            hasErrors: true,
            errors: errors
        };

        this.instance.status = React.addons.update(this.instance.status, {$merge: error});
        this.trigger(this.instance);
    }
});

module.exports = InstanceFormStore;