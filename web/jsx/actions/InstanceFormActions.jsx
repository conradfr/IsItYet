'use strict';

var Reflux = require('reflux');

var InstanceFormActions = Reflux.createActions({
    "instanceSubmitted": {asyncResult: true}
});

module.exports = InstanceFormActions;