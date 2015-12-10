'use strict';

var React = require('react');
var Reflux = require('reflux');

var extend = require('xtend');
var moment = require('moment');

var InstanceConfig = require('../config/InstanceConfig.js');

var InstanceActions = require('../actions/InstanceActions.jsx');
var InstanceMixin = require('./InstanceMixin.jsx');

var InstanceStore = Reflux.createStore({
    mixins: [InstanceMixin],
    init: function() {
        if (typeof instanceData !== 'undefined') {
            this.instance = instanceData;

            var that = this;
            var ws = ab.connect(ws_url,
                function (session) {
                    session.subscribe(that.instance.data.publicKey, function(topic, data) {
                        var jsonData = JSON.parse(data);
                        that.updateInstance(jsonData);
                    });

                    that.updateInstance({status:{live: true}});
                    // Failsafe, timer with long interval
                    clearInterval(that.refreshTimer);
                    that.refreshTimer = setInterval(that.refresh, InstanceConfig.refreshDelayWithWebsocket);
                },
                function (code, reason, detail) {
                    that.updateInstance({status:{live: false}});

                    // We set a timer to refresh the instance without the websocket
                    clearInterval(that.refreshTimer);
                    that.refreshTimer = setInterval(that.refresh, InstanceConfig.refreshDelayWithoutWebsocket);
                },
                {
                    'skipSubprotocolCheck': true,
                    /* 'maxRetries': 60, */
                    'retryDelay': 10000
                }
            );

            if (this.instance.data.type === "countdown") {
                this.instance.data.status = false;
                this.instance.data.time_left = 0;

                this.tick();
                this.countdownTimer = setInterval(this.tick, 1000);
            }
        }
    },
    getInitialState: function () {
        return this.instance || {};
    },
    /* Rest refresh */
    refresh : function() {
        $.get(base_url + 'i/' + this.instance.data.publicKey)
            .done(function (data, status, headers) {
                this.updateInstance(data);
                this.updateInstance({status:{lastUpdated: moment()}})
            }.bind(this))
            .fail(function (data, status, headers) {

            })
            .always(function () {
                this.trigger(this.instance);
            }.bind(this));
    },
    /* Countdown tick */
    tick: function() {
        var newData = {
            time_left: moment.duration(moment(this.instance.data.endAt).diff(moment())),
            status: false
        };

        if (newData.time_left.asMilliseconds() < 1000) {
            clearInterval(this.countdownTimer);
            newData.time_left = moment.duration(0);
            newData.status = true;
        }

        this.instance.data = extend(this.instance.data, newData);
        this.trigger(this.instance);
    },
    componentWillUnmount: function() {
        clearInterval(this.refreshTimer);
        clearInterval(this.countdownTimer);
    }
});

module.exports = InstanceStore;