'use strict';

var InstanceMixin = {
    updateInstance: function(newData) {
        if (typeof newData.data !== 'undefined') {
            this.instance.data = React.addons.update(this.instance.data, {$merge: newData.data});
        }

        if (typeof newData.meta !== 'undefined') {
            this.instance.meta = React.addons.update(this.instance.meta, {$merge: newData.meta});
        }

        if (typeof newData.status !== 'undefined') {
            this.instance.status = React.addons.update(this.instance.status, {$merge: newData.status});
        }

        this.trigger(this.instance);
    },
};

module.exports = InstanceMixin;