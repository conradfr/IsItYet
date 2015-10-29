'use strict';

var React = require('react');
var update = require('react-addons-update');

var InstanceMixin = {
    updateInstance: function(newData) {
        if (typeof newData.data !== 'undefined') {
            this.instance.data = update(this.instance.data, {$merge: newData.data});
        }

        if (typeof newData.meta !== 'undefined') {
            this.instance.meta = update(this.instance.meta, {$merge: newData.meta});
        }

        if (typeof newData.status !== 'undefined') {
            this.instance.status = update(this.instance.status, {$merge: newData.status});
        }

        this.trigger(this.instance);
    },
};

module.exports = InstanceMixin;