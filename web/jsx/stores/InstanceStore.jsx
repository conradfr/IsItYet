'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

var extend = require("xtend");
var moment = require('moment');

var InstanceActions = require('../actions/InstanceActions.jsx');
var InstanceMixin = require('./InstanceMixin.jsx');

var InstanceStore = Reflux.createStore({
    mixins: [InstanceMixin],
    init: function() {
        // initial data
        if (typeof instanceData !== 'undefined') {
            this.instance = instanceData;

            var that = this;
            var ws = ab.connect(ws_url,
                function (session) {
                    session.subscribe(that.instance.data.publicKey, function(topic, data) {
                        var jsonData = JSON.parse(data);
                        //if (typeof jsonData.instance !== 'undefined') {
                            that.updateInstance(jsonData);
                        //}
                    });
                },
                function (code, reason, detail) { }, {
                    'skipSubprotocolCheck': true
                }
            );

            if (this.instance.data.type === "countdown") {
                this.instance.data.status = false;
                this.instance.data.time_left = 0;

                // Cancel timezone if useTimezone is false (everybody use the same datetime)
                this.instance.data.endAtParsed = moment(this.instance.data.endAt);
/*                if (this.instance.data.useTimezone) {
                    this.instance.data.endAtParsed.add(this.instance.data.timeOffset, 'm');
                }*/

                this.tick();
                this.timer = setInterval(this.tick, 1000);
            }
        }
    },
    getInitialState: function () {
        return this.instance || {};
    },
    tick: function() {

        var newData = {
            time_left: moment.duration(this.instance.data.endAtParsed.diff(moment())),
            status: false
        };

        if (newData.time_left.asMilliseconds() < 1000) {
            clearInterval(this.timer);
            newData.time_left = moment.duration(0);
            newData.status = true;
        }

        this.instance.data = extend(this.instance.data, newData);
        this.trigger(this.instance);
    }
});

module.exports = InstanceStore;