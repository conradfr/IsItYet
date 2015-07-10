'use strict';

var Reflux = require('reflux');
var extend = require("xtend");

var InstanceActions = require('../actions/InstanceActions.jsx');

var InstanceStore = Reflux.createStore({
    init: function() {
        // initial data
        if (typeof instanceData !== 'undefined') {
            this.instance = instanceData;

            if (this.instance.kindof !== "countdown") {
                var that = this;
                //var ws = ab.connect('ws://dev.isityet.funkybits.fr:8080',
                //    function (session) {
                //        session.subscribe(that.instance.id, function(topic, data) {
                //            var jsonData = JSON.parse(data);
                //            if (typeof jsonData.instance !== 'undefined') {
                //                that.updateInstance(jsonData.instance);
                //            }
                //        });
                //    },
                //    function (code, reason, detail) { },
                //    {
                //        'skipSubprotocolCheck': true
                //    }
                //);
            } else {
                this.instance.status = false;
                this.instance.time_left = 0;

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
            time_left: new Date(this.instance.end_at) - new Date(),
            status: false
        };

        if (newData.time_left < 1000) {
            clearInterval(this.timer);
            newData.time_left = 0;
            newData.status = true;
        }

        this.instance = extend(this.instance, newData);
        this.trigger(this.instance);
    }
});

module.exports = InstanceStore;